/**
 * BRICS PulseGov DPI — Translations Data Module
 *
 * Exports:
 *   - Translations          (interface)  – every UI string key
 *   - ENGLISH_BASE_TRANSLATIONS          – complete English fallback
 *   - FULL_TRANSLATIONS_DATABASE         – per-language overrides / extensions
 */

// ---------------------------------------------------------------------------
// Translations interface – every key that the app can resolve via `t.<key>`
// ---------------------------------------------------------------------------
export interface Translations {
  // Portal chrome
  portalTitle: string;
  portalSubtitle: string;

  // Primary nav
  raiseComplaint: string;
  gisHotspots: string;
  citizenVoice: string;
  aiDprStudio: string;
  geminiSovereignHub: string;
  geminiVoiceAdvisor: string;
  ministerialCopilot: string;
  liveCrisisDashboard: string;
  dashboard: string;

  // Auth
  login: string;
  signUp: string;

  // Country / region selectors
  allCountries: string;
  selectCountry: string;
  selectRegion: string;

  // Complaint form
  complaintTitle: string;
  complaintDescription: string;
  category: string;
  urgency: string;
  submitComplaint: string;
  voiceRecording: string;
  uploadPhoto: string;

  // AI flow
  aiAnalyzing: string;
  verificationToken: string;
  assignedDept: string;
  reassuranceMsg: string;
  crossBorderPicks: string;
  zeroDebtGuarantee: string;

  // Ministerial
  ministerOfExternalAffairs: string;

  // Navigation
  backToPrevious: string;

  // Counts
  grievancesCount: string;
  hotspotsCount: string;

  // Language selector
  switchLanguage: string;

  // Infrastructure sectors
  waterSanitation: string;
  energyMicrogrids: string;
  transportConnectivity: string;
  healthInfrastructure: string;
  digitalPublicInfrastructure: string;
  agriculturalIrrigation: string;
  educationSanitation: string;

  // Urgency levels
  critical: string;
  high: string;
  medium: string;
  low: string;

  // Voice / AI agent
  speakText: string;
  geminiAgentActive: string;
  emergencyEscalation: string;
  duplicateBlocked: string;
  policyImpact: string;
  validityFilter: string;

  // Country names (translated)
  country_india: string;
  country_brazil: string;
  country_southAfrica: string;
  country_russia: string;
  country_china: string;
  country_egypt: string;
  country_ethiopia: string;
  country_iran: string;
  country_uae: string;
  country_saudiArabia: string;
  country_madagascar: string;
  country_all: string;

  // Map layers
  layerPriority: string;
  layerVulnerability: string;
  layerDeficit: string;
  layerDemand: string;

  // Geospatial map UI
  bricsGeospatialMap: string;
  territorialMap: string;
  contaminationAlerts: string;
  dpiCorridors: string;
  sector: string;
  deficitBudget: string;
  clickNodeToInspect: string;
  legend: string;
  criticalPriorityLeg: string;
  highDeficitLeg: string;
  moderateStableLeg: string;
  dpiTransferRailsLeg: string;

  // Sector filter
  allSectors: string;

  // Allow arbitrary additional keys (forward-compat)
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// ENGLISH_BASE_TRANSLATIONS — used as the ultimate fallback
// ---------------------------------------------------------------------------
export const ENGLISH_BASE_TRANSLATIONS: Translations = {
  // Portal chrome
  portalTitle: 'BRICS PulseGov DPI',
  portalSubtitle: 'AI Digital Public Infrastructure & Citizen Governance',

  // Primary nav
  raiseComplaint: 'Raise a Complaint',
  gisHotspots: 'GIS Hotspots',
  citizenVoice: 'Citizen Grievance Feed',
  aiDprStudio: 'AI DPR & Gantt Studio',
  geminiSovereignHub: 'Gemini Sovereign Intelligence Hub',
  geminiVoiceAdvisor: 'Gemini Sovereign Voice Agent',
  ministerialCopilot: 'Gemini Sovereign Intelligence Hub',
  liveCrisisDashboard: 'Live Ministerial Crisis Dashboard',
  dashboard: 'Dashboard',

  // Auth
  login: 'Login',
  signUp: 'Sign Up',

  // Country / region selectors
  allCountries: '🌍 All 10 BRICS Nations',
  selectCountry: 'Select Country',
  selectRegion: 'Select Region / State / Territory',

  // Complaint form
  complaintTitle: 'Grievance / Infrastructure Issue Title',
  complaintDescription: 'Describe the infrastructure breakdown or community need...',
  category: 'Infrastructure Sector',
  urgency: 'Urgency Priority',
  submitComplaint: 'Submit Sovereign Grievance',
  voiceRecording: 'Voice Memo Intake',
  uploadPhoto: 'Attach Photographic Evidence',

  // AI flow
  aiAnalyzing: 'Gemini AI is analyzing and classifying...',
  verificationToken: 'Sovereign Verification Token',
  assignedDept: 'Assigned Government Directorate',
  reassuranceMsg: 'Citizen Reassurance Broadcast',
  crossBorderPicks: 'Gemini Cross-Border AI Picks',
  zeroDebtGuarantee: '100% Zero-Debt Open Source DPG',

  // Ministerial
  ministerOfExternalAffairs: 'Minister of External Affairs / Diplomatic Advisor',

  // Navigation
  backToPrevious: 'Back to Previous Overview',

  // Counts
  grievancesCount: 'Citizen Grievances',
  hotspotsCount: 'GIS Hotspots',

  // Language selector
  switchLanguage: 'Language (33 BRICS Languages)',

  // Infrastructure sectors
  waterSanitation: 'Water & Sanitation',
  energyMicrogrids: 'Energy & Microgrids',
  transportConnectivity: 'Transport & Connectivity',
  healthInfrastructure: 'Health Infrastructure',
  digitalPublicInfrastructure: 'Digital Public Infrastructure',
  agriculturalIrrigation: 'Agricultural & Irrigation',
  educationSanitation: 'Education & Sanitation',

  // Urgency levels
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',

  // Voice / AI agent
  speakText: 'Listen in Gemini AI Voice',
  geminiAgentActive: 'Gemini AI Regional Sentinel Active',
  emergencyEscalation: 'Emergency Escalation',
  duplicateBlocked: 'Duplicate Complaint Blocked',
  policyImpact: 'Policy Impact Simulation',
  validityFilter: 'Validity Filter',

  // Country names (English)
  country_india: 'India',
  country_brazil: 'Brazil',
  country_southAfrica: 'South Africa',
  country_russia: 'Russia',
  country_china: 'China',
  country_egypt: 'Egypt',
  country_ethiopia: 'Ethiopia',
  country_iran: 'Iran',
  country_uae: 'UAE',
  country_saudiArabia: 'Saudi Arabia',
  country_madagascar: 'Madagascar',
  country_all: 'All Countries',

  // Map layers
  layerPriority: 'Priority',
  layerVulnerability: 'Vulnerability',
  layerDeficit: 'Deficit',
  layerDemand: 'Demand',

  // Geospatial map UI
  bricsGeospatialMap: 'BRICS Global Sovereign Geospatial Map',
  territorialMap: 'Territorial Infrastructure Map',
  contaminationAlerts: 'Contamination',
  dpiCorridors: 'DPI Bridge',
  sector: 'Sector',
  deficitBudget: 'Deficit CapEx',
  clickNodeToInspect: 'Click node to inspect & adapt language',
  legend: 'Legend',
  criticalPriorityLeg: 'Critical Priority (>75)',
  highDeficitLeg: 'High Deficit (60-74)',
  moderateStableLeg: 'Moderate / Stable (<60)',
  dpiTransferRailsLeg: 'DPI Transfer Rails',

  // Sector filter
  allSectors: 'All Sectors',
};

// ---------------------------------------------------------------------------
// FULL_TRANSLATIONS_DATABASE — per-language overrides that layer on top of
// the inline FULL_33_TRANSLATIONS dictionary in LanguageContext.tsx.
// Add richer / extended translations here as needed.
// ---------------------------------------------------------------------------
export const FULL_TRANSLATIONS_DATABASE: Record<string, Partial<Translations>> = {
  // English is the base — no overrides needed
  // Example:
  // hi: { country_india: 'भारत', country_brazil: 'ब्राज़ील', ... },
};
