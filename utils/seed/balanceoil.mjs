/**
 * Seed the first ProductPage instance: Zinzino BalanceOil+ 300ml.
 * Data sourced from https://www.zinzino.com/shop/site/SE/en-GB/products/shop/omega-supplements/300000
 * Run with: node --env-file=.env utils/seed/balanceoil.mjs
 */
import { createClient } from '@remkoj/optimizely-cms-api';

const client = createClient({
    base: new URL(process.env.OPTIMIZELY_CMS_URL),
    clientId: process.env.OPTIMIZELY_CLIENT_ID,
    clientSecret: process.env.OPTIMIZELY_CLIENT_SECRET,
});

// Localhost site root — content created here resolves under https://localhost:4321
const NESTLY_ROOT = 'd7212daaff454bf991bb6d6ca3c9d56c';

const ingredientsHtml = `
<p>Fish oils (anchovy, mackerel, sardine), cold-pressed extra-virgin olive oil, antioxidants
(tocopherol-rich extract), natural flavors, vitamin D3 (from lanolin).</p>
<p><em>Available in lemon, orange-lemon-mint, and grapefruit-lemon-lime flavors.</em></p>
`;

const overviewHtml = `
<p>BalanceOil+ is a next-generation fish oil designed to restore your body's natural omega
balance. Cold-pressed extra-virgin olive oil meets sustainably-sourced fish oil rich in
EPA and DHA — for daily support of brain, heart, eyes, and immune function.</p>
<p>One bottle. 25 days of daily ritual. A simple, science-backed step toward feeling like yourself again.</p>
`;

const usageHtml = `
<p><strong>Daily dose:</strong> 0.15 ml per kilogram of body weight.</p>
<ul>
  <li>50 kg → 7.5 ml daily</li>
  <li>80 kg → 12 ml daily</li>
  <li>100 kg → 15 ml daily</li>
</ul>
<p>Take with or after a meal. Consult your doctor if you take blood-thinning medication.
Not intended for children under 3 years.</p>
`;

const storageHtml = `
<p>Store unopened bottles in a cool, dry place. Once opened, refrigerate and consume within
100 days. Keep out of reach of children.</p>
`;

const certifications = [
    {
        Name: 'Friend of the Sea',
        Description: '<p>Sustainable fishing certification — fish sourced from responsibly managed wild stocks.</p>',
        DetailsUrl: 'https://friendofthesea.org/',
    },
    {
        Name: 'Informed Sport',
        Description: '<p>Independently tested for banned substances — trusted by professional athletes.</p>',
        DetailsUrl: 'https://www.informed-sport.com/',
    },
    {
        Name: 'Cologne List®',
        Description: '<p>Tested against the Cologne List of substances banned in sport.</p>',
        DetailsUrl: 'https://www.koelnerliste.com/',
    },
    {
        Name: 'Halal-Control',
        Description: '<p>Certified compliant with Islamic dietary law.</p>',
        DetailsUrl: '',
    },
    {
        Name: 'GMP Certified',
        Description: '<p>Manufactured under Good Manufacturing Practice in an audited facility.</p>',
        DetailsUrl: '',
    },
    {
        Name: 'Ultra Pure',
        Description: '<p>Independently verified TOTOX values well below international purity standards.</p>',
        DetailsUrl: '',
    },
];

const nutritionFacts = [
    { Nutrient: 'Fish Oil',          Amount: '6627', Unit: 'mg', PercentDailyValue: '',    IsHighlighted: false },
    { Nutrient: 'Omega-3 Fatty Acids', Amount: '2478', Unit: 'mg', PercentDailyValue: '',  IsHighlighted: true  },
    { Nutrient: 'EPA',               Amount: '1283', Unit: 'mg', PercentDailyValue: '',    IsHighlighted: false },
    { Nutrient: 'DHA',               Amount: '683',  Unit: 'mg', PercentDailyValue: '',    IsHighlighted: false },
    { Nutrient: 'Olive Oil',         Amount: '4092', Unit: 'mg', PercentDailyValue: '',    IsHighlighted: false },
    { Nutrient: 'Oleic Acid (Omega-9)', Amount: '3069', Unit: 'mg', PercentDailyValue: '', IsHighlighted: false },
    { Nutrient: 'Polyphenols',       Amount: '3.5',  Unit: 'mg', PercentDailyValue: '',    IsHighlighted: false },
    { Nutrient: 'Vitamin D3',        Amount: '20',   Unit: 'µg', PercentDailyValue: '400', IsHighlighted: true  },
];

const documents = [
    { url: 'https://www.zinzino.com/files/BalanceOil-Product-Sheet.pdf', text: 'Product Sheet' },
    { url: 'https://www.zinzino.com/files/BalanceOil-Friend-of-the-Sea.pdf', text: 'Friend of the Sea Certificate' },
    { url: 'https://www.zinzino.com/files/BalanceOil-GMP.pdf', text: 'GMP Certificate' },
    { url: 'https://www.zinzino.com/files/BalanceOil-Cologne-List.pdf', text: 'Cologne List Certificate' },
    { url: 'https://www.zinzino.com/files/BalanceOil-Informed-Sport.pdf', text: 'Informed Sport Certificate' },
    { url: 'https://www.zinzino.com/files/BalanceOil-Halal.pdf', text: 'Halal Certificate' },
    { url: 'https://www.zinzino.com/files/BalanceOil-NonGMO.pdf', text: 'Non-GMO Statement' },
];

const productPage = {
    contentType: 'ProductPage',
    container: NESTLY_ROOT,
    locale: 'en',
    status: 'draft',
    displayName: 'BalanceOil+, 300 ml',
    routeSegment: 'balanceoil',
    properties: {
        Sku: '300000',
        ProductName: 'BalanceOil+, 300 ml',
        ShortDescription: 'Omega-3 food supplement with EPA, DHA and polyphenols',
        Category: 'Omega Supplements',
        Badge: 'Bestseller',

        OneTimePrice: 636,
        SubscriptionPrice: 449,
        DiscountPercent: 29,
        Currency: 'kr',
        LoyaltyPoints: 4,
        BuyUrl: '',

        Volume: '300 ml',
        ProductType: 'Food Supplement',
        ServingSize: '12 ml',
        Ingredients: ingredientsHtml,
        NutritionFacts: nutritionFacts,
        UsageInstructions: usageHtml,
        StorageInstructions: storageHtml,

        Certifications: certifications,
        Documents: documents,

        OverviewBody: overviewHtml,

        SeoSettings: {
            MetaTitle: 'BalanceOil+ 300ml — Omega-3 Daily Supplement | Nestly',
            MetaDescription: 'A daily omega-3 ritual with EPA, DHA, and polyphenols from cold-pressed olive oil. Sustainably sourced, third-party tested.',
            GraphType: '-',
            Indexing: true,
        },
    },
};

function describeApiError(e) {
    const status = e?.status ?? e?.response?.status;
    const body = e?.body ?? e?.response?.body;
    return `status=${status ?? '?'} ${typeof body === 'string' ? body : JSON.stringify(body || {})}`;
}

(async () => {
    console.log('Creating ProductPage "BalanceOil+, 300 ml"...');
    try {
        const created = await client.content.contentCreate(productPage);
        console.log('✅ Created');
        console.log('   key:', created.key);
        console.log('   route:', created.routeSegment);
        console.log('   status:', created.status);
    } catch (e) {
        console.log('❌ contentCreate failed:', describeApiError(e));
        process.exit(1);
    }
})().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
