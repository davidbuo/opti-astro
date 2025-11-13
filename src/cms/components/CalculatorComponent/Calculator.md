# Calculator Component (Bolånekalkyl)

A Swedish housing loan calculator component (Bolånekalkyl) for calculating mortgage payments, total costs, and loan-to-value ratios.

## Features

### Standard Features
- **Loan Amount Input** (Lånebelopp): Enter the desired loan amount in SEK
- **Down Payment Input** (Kontantinsats): Enter your down payment amount
- **Interest Rate Input** (Ränta): Specify the annual interest rate percentage
- **Loan Term Input** (Löptid): Set the loan term in years (1-50 years)

### Calculated Results
- **Monthly Payment** (Månadskostnad): Your estimated monthly mortgage payment
- **Total Cost** (Total kostnad): Total amount paid over the loan term
- **Total Interest** (Total ränta): Total interest paid over the loan term
- **Loan-to-Value Ratio** (Belåningsgrad): Percentage of property value financed
  - Warning shown when LTV exceeds 85% (Swedish regulatory threshold)

## Optimizely Feature Experimentation

The calculator integrates with **Optimizely Feature Experimentation** for A/B testing enhanced features.

### Feature Flag Configuration

**Flag Name**: `calculator_enhanced_features`

**Variables**:
1. **show_amortization_schedule** (boolean)
   - Default: `false`
   - Shows a detailed 12-month amortization schedule with principal/interest breakdown

2. **show_comparison_tool** (boolean)
   - Default: `false`
   - Displays side-by-side comparison of different loan terms (15, 25, 30 years)

3. **monthly_payment_calculation_method** (string)
   - Options: `"standard"` or `"enhanced"`
   - Default: `"standard"`
   - `"enhanced"` includes a 50 SEK monthly administrative fee

### Setting up the Feature Flag in Optimizely

1. Go to your Optimizely Feature Experimentation project
2. Create a new feature flag called `calculator_enhanced_features`
3. Add the three variables listed above
4. Create variations to test:
   - **Control**: All features disabled
   - **Variation A**: Amortization schedule enabled
   - **Variation B**: Comparison tool enabled
   - **Variation C**: All features enabled with enhanced calculation

### Example Experiment Ideas

1. **Test Engagement**: Does showing the amortization schedule increase time on page?
2. **Test Conversion**: Does the comparison tool lead to more contact form submissions?
3. **Test Transparency**: Does including fees in the calculation increase trust metrics?

## Usage in CMS

1. Add the Calculator component to any page
2. Set the Title field to customize the heading
3. The calculator will automatically detect if Optimizely Feature Experimentation is running
4. Enhanced features will show/hide based on the user's assigned variation

## Technical Details

- Uses AlpineJS for reactive state management
- Calculates monthly payments using the standard amortization formula: P * (r * (1+r)^n) / ((1+r)^n - 1)
- Formats currency using Swedish locale (SEK)
- Fully responsive design using Tailwind CSS and DaisyUI
- Works with or without Optimizely (graceful degradation)

## Swedish Mortgage Context

- **Belåningsgrad (LTV)**: Swedish regulations require:
  - Maximum 85% LTV for mortgages
  - Higher down payments for properties with LTV > 75%
- **Amortering**: Mandatory amortization requirements based on LTV
- **Ränta**: Interest rates in Sweden typically range from 3-6%

## Disclaimer

The component includes a built-in disclaimer stating that calculations are estimates and actual costs may vary. Users are encouraged to contact for personalized advice.
