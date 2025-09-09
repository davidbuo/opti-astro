/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,opti-style.json}'],
    theme: { 
        extend: {
            colors: {
                'sage-green': '#A3B18A',
                'warm-beige': '#E6D3B3', 
                'soft-white': '#F9F9F9',
                'charcoal-gray': '#3D3D3D',
                'light-clay': '#DAD2C7',
            }
        } 
    },
    plugins: [
        function ({ addBase }) {
            addBase({
                h1: {
                    fontSize: '2.25rem', // text-3xl
                },
                h2: {
                    fontSize: '1.875rem', // text-2xl
                },
                h3: {
                    fontSize: '1.5rem', // text-xl
                },
                h4: {
                    fontSize: '1.25rem', // text-lg
                },
                h5: {
                    fontSize: '1.125rem', // text-base
                },
                h6: {
                    fontSize: '1rem', // text-sm
                },
            });
        },
        require('daisyui'),
    ],
    daisyui: {
        themes: [
            // Custom Nestly theme with brand colors
            {
                "nestly": {
                    "primary": "#A3B18A",        // Sage Green - for buttons, accents
                    "primary-content": "#ffffff",
                    "secondary": "#DAD2C7",      // Light Clay - secondary accents, borders
                    "secondary-content": "#3D3D3D",
                    "accent": "#A3B18A",         // Sage Green - accent elements
                    "accent-content": "#ffffff",
                    "neutral": "#3D3D3D",        // Charcoal Gray - text headers
                    "neutral-content": "#F9F9F9",
                    "base-100": "#F9F9F9",       // Soft White - main background
                    "base-200": "#E6D3B3",       // Warm Beige - cards, backgrounds
                    "base-300": "#DAD2C7",       // Light Clay - borders, dividers
                    "base-content": "#3D3D3D",   // Charcoal Gray - main text
                    "info": "#A3B18A",
                    "success": "#A3B18A",
                    "warning": "#E6D3B3",
                    "error": "#ff6b6b",
                }
            },
            // Keep some default themes for fallback
            'light',
            'dark',
        ],
    },
};
