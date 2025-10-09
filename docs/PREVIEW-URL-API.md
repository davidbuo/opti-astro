# Preview URL API Documentation

This API endpoint allows you to generate external preview URLs for CMS content programmatically.

## Endpoint

```
POST /api/preview-url.json
```

## Overview

The Preview URL API generates secure, tokenized URLs that allow external users to preview draft content from the Optimizely CMS without requiring CMS login credentials. The generated tokens are cryptographically secure and tied to specific content versions.

## Authentication

No authentication is required to call this endpoint, but the generated preview URLs will be validated by the external preview page against:
- Content draft status
- External preview enablement setting
- Token validity

## Request

### Headers

```
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contentKey` | string | Yes | Unique content identifier from Optimizely CMS |
| `contentVersion` | string | Yes | Version identifier for the content (e.g., "1.0.0", "draft-123") |
| `pageUrl` | string | Yes | The page URL path including locale (e.g., "/en/about/", "/de/products/") |

### Example Request

```bash
curl -X POST https://your-domain.com/api/preview-url.json \
  -H "Content-Type: application/json" \
  -d '{
    "contentKey": "abc123def456",
    "contentVersion": "1.0.0",
    "pageUrl": "/en/about/"
  }'
```

### JavaScript/TypeScript Example

```typescript
async function generatePreviewUrl(
  contentKey: string,
  contentVersion: string,
  pageUrl: string
) {
  const response = await fetch('/api/preview-url.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contentKey,
      contentVersion,
      pageUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error);
  }

  return await response.json();
}

// Usage
const result = await generatePreviewUrl(
  'abc123def456',
  '1.0.0',
  '/en/about/'
);

console.log('Preview URL:', result.previewUrl);
console.log('Token:', result.token);
```

## Response

### Success Response (200 OK)

```json
{
  "previewUrl": "https://your-domain.com/externalpreview/en/about/?ver=1.0.0&token=a1b2c3d4e5f6g7h8",
  "token": "a1b2c3d4e5f6g7h8",
  "expiresIn": "Token does not expire (tied to content version)"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `previewUrl` | string | Complete URL that can be shared for external preview |
| `token` | string | The generated security token (16 character hex string) |
| `expiresIn` | string | Information about token expiration (tokens don't expire but are version-specific) |

### Error Responses

#### 400 Bad Request - Missing Field

```json
{
  "error": "Missing required field: contentKey",
  "details": "contentKey is required to generate preview URL"
}
```

#### 400 Bad Request - Invalid Format

```json
{
  "error": "Invalid pageUrl format",
  "details": "pageUrl must start with \"/\" (e.g., \"/en/about/\")"
}
```

#### 400 Bad Request - Invalid JSON

```json
{
  "error": "Invalid JSON in request body",
  "details": "Unexpected token..."
}
```

#### 500 Internal Server Error - Configuration

```json
{
  "error": "Server configuration error",
  "details": "External preview is not properly configured"
}
```

#### 500 Internal Server Error - Generic

```json
{
  "error": "Failed to generate preview URL",
  "details": "Error message details"
}
```

## Important Notes

### Token Security

- Tokens are generated using SHA-256 hashing with a server-side secret
- Each token is unique to the combination of content key and version
- Tokens are 16 characters (first 16 chars of the hash)
- The secret is stored in the `EXTERNAL_PREVIEW_TOKEN` environment variable

### Token Lifecycle

- Tokens do **not expire** by time
- Tokens are tied to specific content versions
- When content is published to a new version, the old token becomes invalid
- To revoke access, publish a new version or disable external preview in CMS

### URL Format

Generated URLs follow this pattern:
```
{origin}/externalpreview{pageUrl}?ver={version}&token={token}
```

Example:
```
https://example.com/externalpreview/en/about/?ver=1.0.0&token=a1b2c3d4e5f6g7h8
```

### Validation at Preview Time

When the preview URL is accessed, the system validates:

1. **EXTERNAL_PREVIEW_ENABLED** - Feature flag must be enabled
2. **Draft Status** - Content must be in draft status
3. **External Preview Setting** - Page must have "Enable External Preview" enabled in CMS
4. **Token Validity** - Token must match the expected value for that content/version
5. **Content Existence** - Content must exist in the CMS

If any validation fails, the user is redirected to 404.

## Use Cases

### 1. CMS Integration

Generate preview links automatically when editors save draft content:

```typescript
// In your CMS event handler
async function onContentSaved(content: Content) {
  if (content.status === 'draft') {
    const preview = await generatePreviewUrl(
      content.key,
      content.version,
      content.url
    );

    // Display or email the preview link
    notifyEditor(preview.previewUrl);
  }
}
```

### 2. Review Workflow

Create shareable links for stakeholder reviews:

```typescript
async function createReviewLink(contentId: string) {
  const content = await getContentById(contentId);

  const preview = await generatePreviewUrl(
    content.key,
    content.version,
    content.url
  );

  // Share with stakeholders
  await sendReviewEmail({
    to: stakeholders,
    previewUrl: preview.previewUrl
  });
}
```

### 3. Batch Generation

Generate preview links for multiple content items:

```typescript
async function generateBatchPreviews(contentItems: Content[]) {
  const previews = await Promise.all(
    contentItems.map(item =>
      generatePreviewUrl(item.key, item.version, item.url)
    )
  );

  return previews;
}
```

## API Information Endpoint

You can also use a GET request to get API documentation:

```bash
curl https://your-domain.com/api/preview-url.json
```

This returns information about the endpoint format and example usage.

## Related Documentation

- [Environment Variables Configuration](./ENVIRONMENT-VARIABLES.md) - Configure EXTERNAL_PREVIEW_TOKEN
- [External Preview System](../src/cms/shared/ExtPreviewLink/ExtPreviewLinkBanner.astro) - Component implementation
- [Preview Utilities](../src/cms/shared/utils.ts) - Token generation and validation functions

## Troubleshooting

### "Server configuration error"

**Problem**: The `EXTERNAL_PREVIEW_TOKEN` environment variable is not set.

**Solution**: Add the token to your `.env` file:
```bash
EXTERNAL_PREVIEW_TOKEN=your-secure-random-string-here
```

### "Invalid pageUrl format"

**Problem**: The pageUrl doesn't start with a forward slash.

**Solution**: Ensure pageUrl starts with `/`:
```javascript
// ❌ Wrong
pageUrl: "en/about/"

// ✅ Correct
pageUrl: "/en/about/"
```

### Generated URL returns 404

**Possible causes**:
1. Content is published (not draft) - external preview only works with drafts
2. External preview is disabled for that content in CMS settings
3. Content version has changed since token was generated
4. EXTERNAL_PREVIEW_ENABLED environment variable is false/missing

**Solution**: Verify content status and settings in CMS, and regenerate the token if version changed.

## Performance

- Token generation is synchronous and very fast (~1ms)
- No database queries are performed
- No GraphQL calls are made
- Suitable for high-frequency generation

## Security Considerations

1. **Keep EXTERNAL_PREVIEW_TOKEN secret** - Never commit to version control
2. **Use HTTPS** - Always serve over HTTPS in production
3. **Share links securely** - Preview URLs should be shared through secure channels
4. **Version-based revocation** - Publish new versions to invalidate old tokens
5. **Content-level control** - Use CMS settings to control which pages can be previewed externally
