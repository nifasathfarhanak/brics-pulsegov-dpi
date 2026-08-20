export type BRICSCountryId = 
  | 'india' 
  | 'brazil' 
  | 'south_africa' 
  | 'china' 
  | 'russia' 
  | 'egypt' 
  | 'ethiopia' 
  | 'uae' 
  | 'saudi_arabia' 
  | 'iran' 
  | 'madagascar';

export interface BRICSCountry {
  id: BRICSCountryId;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
  currency: string;
  languages: string[];
  population: string;
  keyDevelopmentPlan: string;
  coordinates: { lat: number; lng: number };
  accentColor: string;
}

export type InfrastructureSector = 
  | 'Water & Sanitation'
  | 'Transport & Connectivity'
  | 'Energy & Microgrids'
  | 'Health Infrastructure'
  | 'Digital Public Infrastructure'
  | 'Education & Sanitation'
  | 'Agricultural & Irrigation'
  | string;

export interface MinisterialComplaint {
  ComplaintID: string;
  Timestamp: string;
  UserLanguage: string;
  UserLanguageCode?: string;
  MinisterialDomain: 'Infrastructure' | 'CapEx' | 'Water' | 'Energy' | 'Digital Public Infrastructure (DPI)' | string;
  UrgencyLevel: 'Critical' | 'Medium' | 'Low';
  ImageVerified: 'True' | 'False';
  GPS_Coordinates: string;
  ResolutionPlan: string;
  ComplaintDetails?: string;
  ResolutionStrategy?: string;
  Sentiment?: string;
  EmergencyEscalation?: boolean;
  Status?: 'Registered - Immediate Action Dispatched' | 'Under Review' | 'In Progress' | 'Resolved' | 'Blocked (Duplicate)';
  PolicyImpact?: {
    shortTerm: string;
    longTerm: string;
    economicMultiplier?: number | string;
    sdgAlignment?: string[];
  };
  Location?: {
    country?: string;
    region?: string;
  };
  AuditTrail?: {
    assignedDepartment: string;
    slaDays: number;
    sovereignTrackingCode: string;
  };
}

export interface GeminiVoiceAgentResponse {
  success: boolean;
  reply: string;
  spokenSummary: string;
  isDuplicate?: boolean;
  duplicateMessage?: string;
  duplicateComplaintId?: string;
  isValid?: boolean;
  validityFeedback?: string;
  detectedLanguage: string;
  languageCode: string;
  sentiment?: string;
  urgencyLevel?: 'Critical' | 'Medium' | 'Low';
  isEmergencyEscalation?: boolean;
  ministerialDomain?: string;
  policyImpact?: {
    shortTerm: string;
    longTerm: string;
    economicMultiplier?: number | string;
    sdgAlignment?: string[];
  };
  structuredComplaint?: MinisterialComplaint;
}

export interface RegionData {
  id: string;
  countryId: BRICSCountryId;
  name: string;
  nativeName: string;
  topPrioritySector: InfrastructureSector;
  vulnerabilityIndex: number; // 0-100
  population: number;
  deficitBudgetM: number; // in USD Millions
  activeRequestsCount: number;
  coordinates: { lat: number; lng: number; x?: number; y?: number };
  riskAlert?: string;
  waterAccessPercent?: number;
  gridUptimePercent?: number;
  roadPavedPercent?: number;
  pavedRoadPercent?: number;
  broadbandCoveragePercent?: number;
  infrastructureIndex?: number;
  allocatedBudgetM?: number;
}

export interface CitizenReport {
  id: string;
  token: string;
  countryId: BRICSCountryId;
  regionId: string;
  regionName: string;
  citizenNameOrAnon: string;
  language: string;
  languageCode: string;
  originalText: string;
  englishTranslation: string;
  category: InfrastructureSector;
  urgencyScore: number; // 1-10
  severityLevel: string;
  status: string;
  timestamp: string;
  estimatedAffectedPop: number;
  upvotes: number;
  hasPhoto: boolean;
  imageUrl?: string;
  channel: string;
  keyIssues: string[];
  recommendedAction: string;
  citizenReassuranceMessage?: string;
  imageAnalysis?: any;
}

export interface DemandHotspot {
  id: string;
  regionId: string;
  regionName?: string;
  countryId: BRICSCountryId;
  title: string;
  sector: InfrastructureSector;
  severity?: string;
  sentimentClusterCount?: number;
  estimatedBeneficiaries: number;
  estimatedBudgetM: number;
  readinessScore?: number; // 0-100
  priorityScore?: number;
  demandIntensity?: string | number;
  vulnerabilityScore?: number;
  infrastructureDeficitScore?: number;
  associatedReportsCount?: number;
  status?: string;
  summary?: string;
  roiMultiplier?: number | string;
  dpiRecommendation?: string;
  unSdgs?: string[];
  coordinates?: { lat: number; lng: number; x?: number; y?: number };
  description?: string;
  rootCauses?: string[];
  proposedDPIIntervention?: string;
  topMatchingDPGSolutions?: string[];
}

export interface DPISolution {
  id: string;
  name: string;
  originCountry: string;
  category: InfrastructureSector;
  license: string;
  readinessScore?: number;
  description: string;
  deploymentTimeMonths?: number;
  costSavingPercent?: number;
  tags?: string[];
  techStack?: string | string[];
  applicabilityAcrossBRICS?: string[] | string;
  adoptionCaseStudy?: string;
  githubOrRegistryUrl?: string;
}

export interface DetailedProjectReport {
  id: string;
  hotspotId: string;
  projectTitle: string;
  bricsCountry: string;
  targetRegion: string;
  executiveSummary: string;
  estimatedCapExUSD_M: number;
  estimatedOpExUSD_M_Year: number;
  coFinancingModel: string;
  totalDurationMonths: number;
  sdgImpact: string[];
  environmentalRiskScore: number; // 0-100
  milestones: {
    phase: string;
    durationMonths: number;
    budgetPercentage: number;
    deliverables: string[];
    riskMitigation: string;
  }[];
  procurementGuidelines: string[];
  citizenAuditMetrics: string[];
  generatedAt: string;
  aiVersion: string;
}

// User Profile & Authentication Types
export type UserRole = 'authority' | 'normal' | 'superadmin' | string;

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  fullName: string;
  designation?: string;
  department?: string;
  state?: string;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  passwordHash?: string;
  avatar?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role?: UserRole | null;
  token: string | null;
  sessionExpiresAt?: number | null;
}

// Contamination Alerts & Governance Types
export interface ContaminationAlert {
  id: string;
  regionId: string;
  regionName: string;
  state: string;
  contaminantType: 'Arsenic' | 'Fluoride' | 'Salinity' | 'Heavy Metals' | 'Nitrate' | 'Bacterial' | string;
  severityPPM: number;
  permissibleLimitPPM: number;
  riskLevel: 'Critical' | 'Severe' | 'Moderate' | 'Warning' | string;
  affectedPopulation: string;
  coordinates: { lat: number; lng: number };
  dateLogged: string;
  suggestedAIProject: string;
  status: 'Active Alert' | 'Containment Deployed' | 'Mitigation Underway' | 'Resolved' | string;
}

export interface CitizenServiceRequest {
  id: string;
  trackingNumber?: string;
  trackingCode?: string;
  userId?: string;
  userName?: string;
  username?: string;
  userPhone?: string;
  userMobile?: string;
  userEmail?: string;
  state?: string;
  district?: string;
  location?: any;
  category?: any;
  title?: string;
  description?: string;
  urgency?: string;
  submittedAt?: string;
  status?: string;
  allocatedBudgetM?: number;
  authorityNotes?: string;
  actionTakenBy?: string;
  upvotes?: number;
  aiSeverityScore?: number;
  aiAssessment?: {
    urgencyScore?: number;
    suggestedResolution?: string;
    estimatedCostINR?: string;
    recommendedDPI?: string;
  };
}

export interface AIInfrastructureInsight {
  id: string;
  title: string;
  stateOrRegion?: string;
  regionScope?: string;
  keyMetric?: string;
  recommendation?: string;
  description?: string;
  impactScore?: number;
  category?: string;
  targetContaminantOrGap?: string;
  timeToDeployMonths?: string | number;
  directBeneficiaries?: string;
  unSDGs?: string[];
  estimatedCapExM?: number;
  roiMultiplier?: string | number;
  riskMitigation?: string;
  technologyType?: string;
}
