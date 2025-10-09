import type { APIRoute } from 'astro';
import crypto from 'crypto';
import { EXTERNAL_PREVIEW_TOKEN } from 'astro:env/server';

interface PreviewUrlRequest {
    contentKey: string;
    contentVersion: string;
    pageUrl: string;
}

interface PreviewUrlResponse {
    previewUrl: string;
    token: string;
    expiresIn?: string;
}

interface ErrorResponse {
    error: string;
    details?: string;
}

/**
 * Generate external preview URL token
 * Uses the same algorithm as the main preview system
 */
function generatePreviewToken(contentKey: string, contentVersion: string): string {
    if (!EXTERNAL_PREVIEW_TOKEN) {
        throw new Error('EXTERNAL_PREVIEW_TOKEN is not configured');
    }

    const token = crypto
        .createHash('sha256')
        .update(`${EXTERNAL_PREVIEW_TOKEN}:${contentKey}:${contentVersion}`)
        .digest('hex')
        .substring(0, 16);

    return token;
}

/**
 * API endpoint to generate external preview URLs
 *
 * POST /api/preview-url.json
 *
 * Request body:
 * {
 *   "contentKey": "abc123",
 *   "contentVersion": "1.0.0",
 *   "pageUrl": "/en/about/"
 * }
 *
 * Response:
 * {
 *   "previewUrl": "https://example.com/externalpreview/en/about/?ver=1.0.0&token=a1b2c3d4e5f6g7h8",
 *   "token": "a1b2c3d4e5f6g7h8"
 * }
 */
export const POST: APIRoute = async ({ request, url }) => {
    try {
        // Parse request body
        const body = await request.json() as PreviewUrlRequest;

        // Validate required fields
        if (!body.contentKey) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required field: contentKey',
                    details: 'contentKey is required to generate preview URL'
                } as ErrorResponse),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        if (!body.contentVersion) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required field: contentVersion',
                    details: 'contentVersion is required to generate preview URL'
                } as ErrorResponse),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        if (!body.pageUrl) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required field: pageUrl',
                    details: 'pageUrl is required to generate preview URL (e.g., "/en/about/")'
                } as ErrorResponse),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate pageUrl format (should start with /)
        if (!body.pageUrl.startsWith('/')) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid pageUrl format',
                    details: 'pageUrl must start with "/" (e.g., "/en/about/")'
                } as ErrorResponse),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Generate preview token
        const token = generatePreviewToken(body.contentKey, body.contentVersion);

        // Get origin from request
        const origin = url.origin;

        // Construct preview URL
        const previewUrl = `${origin}/externalpreview${body.pageUrl}?ver=${body.contentVersion}&token=${token}`;

        // Return successful response
        return new Response(
            JSON.stringify({
                previewUrl,
                token,
                expiresIn: 'Token does not expire (tied to content version)'
            } as PreviewUrlResponse),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error generating preview URL:', error);

        // Handle JSON parse errors
        if (error instanceof SyntaxError) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid JSON in request body',
                    details: error.message
                } as ErrorResponse),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Handle configuration errors
        if (error instanceof Error && error.message.includes('EXTERNAL_PREVIEW_TOKEN')) {
            return new Response(
                JSON.stringify({
                    error: 'Server configuration error',
                    details: 'External preview is not properly configured'
                } as ErrorResponse),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Generic error response
        return new Response(
            JSON.stringify({
                error: 'Failed to generate preview URL',
                details: error instanceof Error ? error.message : 'Unknown error'
            } as ErrorResponse),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};

/**
 * GET endpoint for API documentation/info
 */
export const GET: APIRoute = async () => {
    return new Response(
        JSON.stringify({
            endpoint: '/api/preview-url.json',
            method: 'POST',
            description: 'Generate external preview URLs for CMS content',
            requestBody: {
                contentKey: 'string (required) - Content identifier from CMS',
                contentVersion: 'string (required) - Version identifier from CMS',
                pageUrl: 'string (required) - Page path with locale (e.g., "/en/about/")'
            },
            exampleRequest: {
                contentKey: 'abc123',
                contentVersion: '1.0.0',
                pageUrl: '/en/about/'
            },
            exampleResponse: {
                previewUrl: 'https://example.com/externalpreview/en/about/?ver=1.0.0&token=a1b2c3d4e5f6g7h8',
                token: 'a1b2c3d4e5f6g7h8',
                expiresIn: 'Token does not expire (tied to content version)'
            }
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    );
};
