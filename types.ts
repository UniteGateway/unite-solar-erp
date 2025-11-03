export type Role = 'Admin' | 'Franchise' | 'Client' | 'Guest' | 'Investor' | 'Partner' | 'Advisor';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export type Page = 
  | 'dashboard'
  | 'generator'
  | 'assessment'
  | 'clients'
  | 'reportDisplay'
  | 'assessmentReportDisplay'
  | 'roi-calculator'
  | 'project-tracker'
  | 'franchise'
  | 'add-franchise'
  | 'bio-cng';

export interface FeasibilityFormData {
  companyName: string;
  contactPerson: string;
  location: string;
  plantCapacity: number;
  installationType: string;
  roofType: string;
  moduleBrand: string;
  operationMode: string;
  powerTariff: number;
  amcPreference: string;
  insurance: string;
  additionalNotes: string;
}

export interface ReportData {
  projectOverview: {
    client: string;
    location: string;
    capacity: number;
    installationType: string;
  };
  energyGeneration: {
    annualGeneration: number;
    solarIrradiation: number;
    performanceRatio: number;
  };
  spaceRequirement: {
    area: number;
  };
  systemComponents: {
    modules: string;
    inverter: string;
    structure: string;
  };
  warrantiesAndAmc: {
    moduleWarranty: string;
    inverterWarranty: string;
    amc: string;
  };
  technicalCompliance: string[];
  financialSummary: {
    estimatedCost: number;
    annualSavings: number;
    roi: number;
    paybackPeriod: number;
  };
  environmentalBenefits: {
    co2Reduction: number;
    treesEquivalent: number;
  };
  executionSchedule: {
    designAndEngineering: string;
    procurement: string;
    installation: string;
    commissioning: string;
  };
  conclusion: string;
}

export interface GeneratedReport {
  formData: FeasibilityFormData;
  reportData: ReportData;
}

export interface AssessmentFormData {
  clientName: string;
  state: string;
  pincode: string;
  contractDemand: number;
  netUnitsConsumed: number;
  powerTariff: number;
  availableSpace: number;
  transformerCapacity: number;
  financingOption: string;
  cmdEnhancementCost: number;
  powerBillFile?: File | string; // string for data URL from camera
}

export interface AssessmentReportData {
  analysis: {
    permittedCapacityCMD: number;
    permittedCapacitySpace: number;
    recommendedCapacity: number;
    annualGeneration: number;
  };
  financials: {
    estimatedSystemCost: number;
    monthlySavings: number;
    loanPrincipal: number;
    advancePayment: number;
    monthlyEMI: number;
    paybackPeriod: number;
    loanType: string;
    interestRate: string;
  };
  enhancementPotential: {
    isEnhancementPossible: boolean;
    potentialCapacity: number;
    estimatedCMDCost: number;
    transformerUpgradeRequired: boolean;
    recommendationText: string;
  };
  summary: {
    conclusion: string;
  };
}

export interface GeneratedAssessmentReport {
  formData: AssessmentFormData;
  reportData: AssessmentReportData;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}