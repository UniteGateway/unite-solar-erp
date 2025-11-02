import { GoogleGenAI, Type } from '@google/genai';
import { FeasibilityFormData, ReportData, AssessmentFormData, AssessmentReportData } from '../types';
import { STATE_SOLAR_POLICIES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        projectOverview: {
            type: Type.OBJECT,
            properties: {
                client: { type: Type.STRING },
                location: { type: Type.STRING },
                capacity: { type: Type.NUMBER },
                installationType: { type: Type.STRING },
            },
        },
        energyGeneration: {
            type: Type.OBJECT,
            properties: {
                annualGeneration: { type: Type.NUMBER, description: 'in kWh' },
                solarIrradiation: { type: Type.NUMBER, description: 'in kWh/m²/day' },
                performanceRatio: { type: Type.NUMBER },
            },
        },
        spaceRequirement: {
            type: Type.OBJECT,
            properties: {
                area: { type: Type.NUMBER, description: 'in sq. ft.' },
            },
        },
        systemComponents: {
            type: Type.OBJECT,
            properties: {
                modules: { type: Type.STRING },
                inverter: { type: Type.STRING },
                structure: { type: Type.STRING },
            },
        },
        warrantiesAndAmc: {
            type: Type.OBJECT,
            properties: {
                moduleWarranty: { type: Type.STRING },
                inverterWarranty: { type: Type.STRING },
                amc: { type: Type.STRING },
            },
        },
        technicalCompliance: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        financialSummary: {
            type: Type.OBJECT,
            properties: {
                estimatedCost: { type: Type.NUMBER, description: 'in INR' },
                annualSavings: { type: Type.NUMBER, description: 'in INR' },
                roi: { type: Type.NUMBER, description: 'in %' },
                paybackPeriod: { type: Type.NUMBER, description: 'in years' },
            },
        },
        environmentalBenefits: {
            type: Type.OBJECT,
            properties: {
                co2Reduction: { type: Type.NUMBER, description: 'in tonnes per year' },
                treesEquivalent: { type: Type.NUMBER },
            },
        },
        executionSchedule: {
            type: Type.OBJECT,
            properties: {
                designAndEngineering: { type: Type.STRING },
                procurement: { type: Type.STRING },
                installation: { type: Type.STRING },
                commissioning: { type: Type.STRING },
            },
        },
        conclusion: { type: Type.STRING, description: 'A detailed, optimistic, and encouraging conclusion for the client in 2-3 paragraphs.' },
    },
};

const assessmentReportSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.OBJECT,
            properties: {
                permittedCapacityCMD: { type: Type.NUMBER, description: 'Permitted solar capacity in kW based on state policy and CMD.' },
                permittedCapacitySpace: { type: Type.NUMBER, description: 'Solar capacity in kW that can be installed in the available space.' },
                recommendedCapacity: { type: Type.NUMBER, description: 'The final recommended capacity in kW, which is the minimum of CMD and space-based capacities.' },
                annualGeneration: { type: Type.NUMBER, description: 'Estimated annual energy generation in kWh.' },
            },
        },
        financials: {
            type: Type.OBJECT,
            properties: {
                estimatedSystemCost: { type: Type.NUMBER, description: 'Total estimated cost of the solar system in INR.' },
                monthlySavings: { type: Type.NUMBER, description: 'Estimated average monthly savings on the power bill in INR.' },
                loanPrincipal: { type: Type.NUMBER, description: 'The total loan amount in INR.' },
                advancePayment: { type: Type.NUMBER, description: 'The upfront advance payment required (0 for UDB), in INR.' },
                monthlyEMI: { type: Type.NUMBER, description: 'The calculated monthly EMI for the loan in INR.' },
                paybackPeriod: { type: Type.NUMBER, description: 'The calculated payback period in years.' },
                loanType: { type: Type.STRING, description: 'The name of the financing option.' },
                interestRate: { type: Type.STRING, description: 'The interest rate and type (e.g., "8.9% Diminishing").' },
            },
        },
        enhancementPotential: {
            type: Type.OBJECT,
            properties: {
                isEnhancementPossible: { type: Type.BOOLEAN, description: 'True if available space supports more capacity than CMD allows.' },
                potentialCapacity: { type: Type.NUMBER, description: 'The maximum capacity possible if CMD is enhanced, in kW.' },
                estimatedCMDCost: { type: Type.NUMBER, description: 'Estimated cost to enhance the CMD to support the potential capacity.' },
                transformerUpgradeRequired: { type: Type.BOOLEAN, description: 'True if the current transformer cannot support the enhanced CMD.' },
                recommendationText: { type: Type.STRING, description: 'A detailed recommendation for the client if enhancement is possible.' },
            },
        },
        summary: {
            type: Type.OBJECT,
            properties: {
                conclusion: { type: Type.STRING, description: 'A compelling summary of the assessment for the client.' },
            },
        },
    },
};

export const generateFeasibilityReport = async (formData: FeasibilityFormData): Promise<ReportData> => {
    // FIX: Implemented the function to generate a feasibility report using Gemini API.
    const prompt = `
    You are a senior solar technical-commercial analyst at Unite Solar. Your task is to create a detailed and professional solar feasibility report for a potential client in India based on the following data.

    Client Data:
    - Company Name: ${formData.companyName}
    - Contact Person: ${formData.contactPerson}
    - Location: ${formData.location}
    - Proposed Plant Capacity: ${formData.plantCapacity} kW
    - Type of Installation: ${formData.installationType}
    - Roof Type: ${formData.roofType}
    - Preferred Module Brand: ${formData.moduleBrand}
    - Mode of Operation: ${formData.operationMode}
    - Average Power Tariff: ₹${formData.powerTariff} per kWh
    - AMC Preference: ${formData.amcPreference}
    - Insurance Included: ${formData.insurance}
    - Additional Notes from Client: ${formData.additionalNotes}

    Calculation Rules & Assumptions (Strictly Follow):
    1.  **Project Overview:** Use the client data directly.
    2.  **Energy Generation:**
        -   Assume an average daily solar irradiation of 4.5 kWh/m²/day for the location.
        -   Assume a system Performance Ratio of 0.78 (78%).
        -   Calculate Annual Generation (kWh) = Plant Capacity (kW) * 4.5 * 365 * 0.78.
    3.  **Space Requirement:**
        -   Assume 100 sq. ft. of shadow-free area is required per kW for rooftop installations.
        -   Area (sq. ft.) = Plant Capacity * 100.
    4.  **System Components:**
        -   Modules: State the preferred brand. If 'Any Tier-1', mention "High-efficiency Tier-1 Solar Modules".
        -   Inverter: Mention "String Inverter from a reputed brand like SMA/SolarEdge/Huawei".
        -   Structure: Mention "Hot-dip galvanized iron mounting structures".
    5.  **Warranties & AMC:**
        -   Module Warranty: "25-30 Years Performance Warranty".
        -   Inverter Warranty: "5-10 Years Standard Warranty".
        -   AMC: Use the client's preference.
    6.  **Technical Compliance:** List common Indian standards like "IEC 61215, IEC 61730, MNRE guidelines, Local DISCOM regulations".
    7.  **Financial Summary:**
        -   Estimated Cost: Assume a base cost of ₹50,000 per kW. Total Cost = Plant Capacity * 50,000.
        -   Annual Savings: Annual Generation * Power Tariff.
        -   ROI (%): (Annual Savings / Estimated Cost) * 100.
        -   Payback Period (years): Estimated Cost / Annual Savings.
    8.  **Environmental Benefits:**
        -   CO2 Reduction (tonnes/year): Assume 1 kWh of solar energy reduces 0.82 kg of CO2. So, (Annual Generation * 0.82) / 1000.
        -   Trees Equivalent: Assume 1 tree absorbs 21 kg of CO2 per year. So, (CO2 Reduction in kg) / 21.
    9.  **Execution Schedule:** Provide realistic timelines for a project of this size. (e.g., Design: 1 week, Procurement: 2 weeks, Installation: 3 weeks, Commissioning: 1 week).
    10. **Conclusion:** Write a compelling, optimistic, and professional conclusion summarizing the benefits and encouraging the client to proceed.

    Return ONLY the JSON object matching the provided schema. Do not add any explanatory text, markdown, or comments.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: reportSchema,
            },
        });

        const jsonText = response.text.trim();
        const reportData = JSON.parse(jsonText);

        if (!reportData.projectOverview || !reportData.financialSummary) {
            throw new Error("Received incomplete or malformed data from AI for Feasibility Report.");
        }

        return reportData as ReportData;
    } catch (error) {
        console.error("Error generating feasibility report with Gemini:", error);
        throw new Error("Failed to communicate with the AI service. Please check your connection and API key.");
    }
};

export const generateAssessmentReport = async (formData: AssessmentFormData): Promise<AssessmentReportData> => {
    const policyPercentage = STATE_SOLAR_POLICIES[formData.state] || STATE_SOLAR_POLICIES['Default'];

    const prompt = `
    You are a senior solar technical-commercial analyst at Unite Solar. Your task is to create a preliminary on-site assessment report for a potential client in India based on the data provided by a sales agent.

    Client & Site Data:
    - Client Name: ${formData.clientName}
    - State: ${formData.state}
    - Pincode: ${formData.pincode}
    - Contract Maximum Demand (CMD): ${formData.contractDemand} kVA
    - Average Net Monthly Units Consumed: ${formData.netUnitsConsumed} kWh
    - Average Power Tariff: ₹${formData.powerTariff} per kWh
    - Available Installation Space: ${formData.availableSpace} sq. ft.
    - Transformer Capacity: ${formData.transformerCapacity} kVA
    - Preferred Financing Option: ${formData.financingOption}
    - Cost for CMD Enhancement: ₹${formData.cmdEnhancementCost} per kVA

    Calculation Rules & Logic (Strictly Follow):
    1.  **Capacity Analysis:**
        -   **Permitted Capacity (CMD-based):** Calculate as ${policyPercentage * 100}% of the client's CMD. Note: CMD is in kVA, but for solar (power factor ~1), we can treat kVA ≈ kW. Result should be in kW.
        -   **Permitted Capacity (Space-based):** Calculate the maximum capacity the available space can support. Use the rule of 100 sq. ft. per 1 kW.
        -   **Recommended Capacity:** This is the **minimum** of the CMD-based and Space-based capacities. This is the system size we will use for all subsequent calculations.

    2.  **Energy Generation:**
        -   Estimate annual generation for the **Recommended Capacity**.
        -   Assume an average daily solar irradiation of 4.75 kWh/kW for the location (pincode: ${formData.pincode}).
        -   Formula: Annual Generation (kWh) = Recommended Capacity (kW) * 4.75 * 365.

    3.  **Financial Analysis:**
        -   **System Cost:** Assume a base cost of ₹55,000 per kW. Total Cost = Recommended Capacity * 55,000.
        -   **Monthly Savings:** (Annual Generation / 12) * Power Tariff.
        -   **Analyze the chosen financing option (${formData.financingOption}):**
            -   **If 'Bank Loan':**
                -   Loan term is 6 years (<100 kW) or 5 years (>=100 kW).
                -   Advance payment is 10% of System Cost. Loan Principal is 90%.
                -   Interest rate is 8.9% per annum (diminishing).
                -   Calculate monthly EMI using the formula: P * r * (1+r)^n / ((1+r)^n - 1), where P=Loan Principal, r = monthly interest rate (0.089 / 12), n = loan term in months.
            -   **If 'UDB Zero Investment':**
                -   Loan term is 7 years (<100 kW) or 6 years (>=100 kW).
                -   Advance payment is 0. Loan Principal is 100% of System Cost.
                -   Interest rate is 8.75% per annum (flat rate).
                -   Calculate monthly EMI using the formula: (Principal + (Principal * Annual Rate * Term in Years)) / (Term in Months).
        -   **Payback Period:** System Cost / (Annual Savings).

    4.  **Enhancement Potential:**
        -   Check if the Space-based capacity is greater than the CMD-based capacity.
        -   If yes, 'isEnhancementPossible' is true. The 'potentialCapacity' is the Space-based capacity.
        -   Calculate the required CMD enhancement: Potential Capacity - Current CMD.
        -   Calculate the estimated cost for this enhancement using the provided enhancement cost per kVA.
        -   Check if the enhanced CMD would exceed 80% of the transformer capacity. If so, 'transformerUpgradeRequired' is true.
        -   Write a compelling recommendation text explaining the benefits of enhancing the CMD to utilize the full available space for maximum savings.

    5.  **Summary:**
        -   Write a professional and encouraging conclusion summarizing the key findings and next steps.

    Return ONLY the JSON object matching the provided schema. Do not add any explanatory text or markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: assessmentReportSchema,
            },
        });

        const jsonText = response.text.trim();
        const reportData = JSON.parse(jsonText);

        if (!reportData.analysis || !reportData.financials) {
            throw new Error("Received incomplete or malformed data from AI for Assessment Report.");
        }

        return reportData as AssessmentReportData;
    } catch (error) {
        console.error("Error generating assessment report with Gemini:", error);
        throw new Error("Failed to communicate with the AI service for assessment. Please check your connection and API key.");
    }
};


export const getAiChatResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], reportContext: ReportData | null): Promise<string> => {
    // FIX: Implemented the function to generate a chat response using Gemini API.
    let systemInstruction = "You are a helpful and friendly AI assistant for Unite Solar, a solar energy company. Your name is Sparky. Answer the user's questions. If the question is about a specific report, use the provided JSON context to answer. If there's no context or the question is general, answer based on your knowledge of solar energy in India.";

    if (reportContext) {
        systemInstruction += `\n\nHere is the JSON data for the current feasibility report the user is viewing:\n${JSON.stringify(reportContext, null, 2)}`;
    }

    try {
        const currentUserPrompt = history.pop()?.parts[0].text || "";

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const response = await chat.sendMessage({ message: currentUserPrompt });
        
        return response.text;

    } catch (error) {
        console.error("Error getting AI chat response:", error);
        return "I'm sorry, I'm having trouble processing that request right now. Please try again in a moment.";
    }
};
