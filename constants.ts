export const INSTALLATION_TYPES = ['Rooftop', 'Ground Mount', 'Carport'];
export const ROOF_TYPES = ['RCC', 'Metal Sheet', 'Other'];
export const MODULE_BRANDS = ['Waree', 'Vikram', 'Goldi', 'Any Tier-1'];
export const OPERATION_MODES = ['CAPEX', 'RESCO', 'Lease'];
export const AMC_PREFERENCES = ['1 Year', '3 Years', '5 Years'];
export const INSURANCE_OPTIONS = ['Yes', 'No'];

// Constants for Assessment Report
export const INDIAN_STATES = ['Andhra Pradesh', 'Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Other'];
export const FINANCING_OPTIONS = ['Bank Loan', 'UDB Zero Investment'];

// State-wise policy for permitted solar capacity as a percentage of Contract Demand (CMD)
export const STATE_SOLAR_POLICIES: { [key: string]: number } = {
    'Telangana': 0.80, // 80% of CMD
    'Andhra Pradesh': 1.00, // 100% of CMD
    'Default': 0.80 // Default for other states
};
