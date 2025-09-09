import type {
    DisplaySettingsFragment,
    CompositionStructureNode,
    Maybe,
} from '../../../__generated/sdk.ts';

import { getDictionaryFromDisplaySettings } from '../../graphql/shared/displaySettingsHelpers.ts';

/**
 * Get background color class based on style setting
 * Supports both 'backgroundColor' and 'sectionColor' keys
 * Updated to support Nestly brand colors
 */
export function getBackgroundColorClass(dictionary: Record<string, string>): string {
    // Check both possible keys for background color
    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];
    
    switch (colorValue) {
        case 'transparent':
            return ''; // No background color applied
        case 'base_100':
            return 'bg-base-100'; // Soft White
        case 'base_200':
            return 'bg-base-200'; // Warm Beige
        case 'base_300':
            return 'bg-base-300'; // Light Clay
        case 'primary':
            return 'bg-primary'; // Sage Green
        case 'secondary':
            return 'bg-secondary'; // Light Clay
        case 'accent':
            return 'bg-accent'; // Sage Green
        case 'neutral':
            return 'bg-neutral'; // Charcoal Gray
        case 'info':
            return 'bg-info';
        case 'success':
            return 'bg-success';
        case 'warning':
            return 'bg-warning';
        case 'error':
            return 'bg-error';
        // Brand-specific colors
        case 'sage_green':
            return 'bg-sage-green';
        case 'warm_beige':
            return 'bg-warm-beige';
        case 'soft_white':
            return 'bg-soft-white';
        case 'charcoal_gray':
            return 'bg-charcoal-gray';
        case 'light_clay':
            return 'bg-light-clay';
        default:
            return ''; // No background color applied
    }
}

/**
 * Get text color class based on background color setting
 * Maps background colors to their corresponding content colors
 * Updated for Nestly brand colors
 */
export function getTextColorClass(dictionary: Record<string, string>): string {
    const colorValue = dictionary['backgroundColor'] || dictionary['sectionColor'];
    
    switch (colorValue) {
        case 'primary':
            return 'text-primary-content'; // White on Sage Green
        case 'secondary':
            return 'text-secondary-content'; // Charcoal on Light Clay
        case 'accent':
            return 'text-accent-content'; // White on Sage Green
        case 'neutral':
            return 'text-neutral-content'; // Soft White on Charcoal
        case 'info':
            return 'text-info-content';
        case 'success':
            return 'text-success-content';
        case 'warning':
            return 'text-warning-content';
        case 'error':
            return 'text-error-content';
        case 'base_100':
        case 'base_200':
        case 'base_300':
            return 'text-base-content'; // Charcoal on light backgrounds
        // Brand-specific colors
        case 'sage_green':
            return 'text-soft-white';
        case 'warm_beige':
        case 'light_clay':
            return 'text-charcoal-gray';
        case 'soft_white':
            return 'text-charcoal-gray';
        case 'charcoal_gray':
            return 'text-soft-white';
        default:
            return ''; // No text color override
    }
}

export function getGlobalStyles(component: 
        | Maybe<Maybe<DisplaySettingsFragment>>[]
        | CompositionStructureNode
        | undefined
        | null) {

    // Handle null or undefined component
    if (!component) {
        return [];
    }

    var settings;
    if ((component as CompositionStructureNode).displaySettings) {
        settings = (component as CompositionStructureNode).displaySettings as DisplaySettingsFragment[]
    } else {
        settings = (component as DisplaySettingsFragment[]);
    }

    const dictionary = getDictionaryFromDisplaySettings(settings);

    let cssClasses: string[] = [];

    // Add background color using the centralized function
    const backgroundColorClass = getBackgroundColorClass(dictionary);
    if (backgroundColorClass) {
        cssClasses.push(backgroundColorClass);
    }

    // Add text color based on background color
    const textColorClass = getTextColorClass(dictionary);
    if (textColorClass) {
        cssClasses.push(textColorClass);
    }

    return cssClasses;
}
