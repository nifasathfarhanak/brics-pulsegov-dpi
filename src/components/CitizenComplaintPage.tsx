import React, { useState, useEffect } from 'react';
import { BRICS_COUNTRIES, REGIONS_DATA, BRICS_33_LANGUAGES, BRICSLanguageInfo } from '../data/bricsData';
import { BRICSCountryId, CitizenReport, InfrastructureSector } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Square,
  Search,
  Check,
  X,
  Globe2,
  Radio,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Camera,
  Layers,
  User,
  Phone,
  Lock,
  Download,
  Printer,
  Copy,
  ExternalLink,
  ChevronRight,
  Droplets,
  Zap,
  Truck,
  HeartPulse,
  Wifi,
  Sprout,
  GraduationCap,
  Activity,
  Compass,
  Satellite
} from 'lucide-react';

// Subcomponents for Google Hackathon Tracks & Multimodal Intelligence
import { GeospatialEarthEngineWidget } from './complaint/GeospatialEarthEngineWidget';
import { MultimodalVisionDropzone } from './complaint/MultimodalVisionDropzone';
import { DialogflowAssistantModal } from './complaint/DialogflowAssistantModal';
import { GeminiSmartDraftModal } from './complaint/GeminiSmartDraftModal';
import { VertexPredictiveSlaBadge } from './complaint/VertexPredictiveSlaBadge';
import { FirebaseBigQueryTerminalModal } from './complaint/FirebaseBigQueryTerminalModal';

interface CitizenComplaintPageProps {
  onReportSubmitted: (newReport: CitizenReport) => void;
  onNavigateToFeed: () => void;
  selectedCountry: BRICSCountryId | 'all';
}

const SECTOR_METRICS: { 
  id: InfrastructureSector; 
  label: string; 
  nativeLabel: string; 
  icon: any; 
  slaDefaultHours: number;
  deptName: string;
}[] = [
  { 
    id: 'Water & Sanitation', 
    label: 'Water & Sanitation', 
    nativeLabel: 'पेयजल एवं स्वच्छता / Saneamento', 
    icon: Droplets, 
    slaDefaultHours: 48,
    deptName: 'Public Health Engineering Directorate'
  },
  { 
    id: 'Energy & Microgrids', 
    label: 'Energy & Microgrids', 
    nativeLabel: 'ऊर्जा व सोलर ग्रिड / Energia', 
    icon: Zap, 
    slaDefaultHours: 24,
    deptName: 'State Electricity Transmission Authority'
  },
  { 
    id: 'Transport & Connectivity', 
    label: 'Transport & Connectivity', 
    nativeLabel: 'सड़क व परिवहन / Transporte', 
    icon: Truck, 
    slaDefaultHours: 72,
    deptName: 'Highways & Public Works Department'
  },
  { 
    id: 'Health Infrastructure', 
    label: 'Health Infrastructure', 
    nativeLabel: 'स्वास्थ्य क्लिनिक / Saúde', 
    icon: HeartPulse, 
    slaDefaultHours: 24,
    deptName: 'Ministry of Public Health & Facilities'
  },
  { 
    id: 'Digital Public Infrastructure', 
    label: 'Digital Public Infrastructure', 
    nativeLabel: 'डिजिटल अवसंरचना / Infra Digital', 
    icon: Wifi, 
    slaDefaultHours: 48,
    deptName: 'Digital Public Goods & Telecom Agency'
  },
  { 
    id: 'Agricultural & Irrigation', 
    label: 'Agricultural & Irrigation', 
    nativeLabel: 'कृषि व सिंचाई / Irrigação', 
    icon: Sprout, 
    slaDefaultHours: 96,
    deptName: 'Water Resources & Irrigation Board'
  },
  { 
    id: 'Education & Sanitation', 
    label: 'Education & Sanitation', 
    nativeLabel: 'शिक्षा व स्कूल स्वच्छता / Educação', 
    icon: GraduationCap, 
    slaDefaultHours: 72,
    deptName: 'School Infrastructure Directorate'
  },
];

// Sample Existing Complaints for Status Tracking Demo
const SAMPLE_TRACKING_DATABASE: Record<string, {
  token: string;
  title: string;
  category: InfrastructureSector;
  location: string;
  country: string;
  flag: string;
  lodgedDate: string;
  currentStage: number; // 1 to 4
  assignedOfficer: string;
  department: string;
  targetSlaHours: number;
  elapsedHours: number;
  statusBadge: string;
  statusColor: string;
  events: Array<{ stage: string; timestamp: string; desc: string; completed: boolean }>;
}> = {
  'BRICS-IND-2026-8941': {
    token: 'BRICS-IND-2026-8941',
    title: 'High-Pressure Potable Water Pipe Rupture in Ward 12',
    category: 'Water & Sanitation',
    location: 'Patna Central, Bihar',
    country: 'India',
    flag: '🇮🇳',
    lodgedDate: 'Today, 08:30 AM',
    currentStage: 3,
    assignedOfficer: 'Er. Rajeshwar Prasad (Chief Hydraulic Engineer)',
    department: 'Department of Public Health Engineering & Water Supply',
    targetSlaHours: 48,
    elapsedHours: 14,
    statusBadge: 'Field Crew Dispatched',
    statusColor: 'text-amber-400 bg-amber-950/80 border-amber-600/50',
    events: [
      { stage: 'Grievance Lodged & Cryptographically Signed', timestamp: '08:30 AM', desc: 'Citizen submitted report with GPS metadata and photographic proof.', completed: true },
      { stage: 'Multimodal AI Vision & Duplicate Triage', timestamp: '08:31 AM', desc: 'Vertex AI confirmed structural leak. No duplicate records detected.', completed: true },
      { stage: 'Departmental Field Allocation', timestamp: '10:15 AM', desc: 'Work order #WO-4812 issued to Emergency Hydraulic Repair Unit 4.', completed: true },
      { stage: 'Remediation & Citizen Verification', timestamp: 'Estimated in 24 hrs', desc: 'On-site excavation and conduit replacement underway.', completed: false },
    ]
  },
  'BRICS-BRA-2026-4412': {
    token: 'BRICS-BRA-2026-4412',
    title: 'Bridge Structural Erosion Isolated Community Access',
    category: 'Transport & Connectivity',
    location: 'Vale do Rio Doce, Minas Gerais',
    country: 'Brazil',
    flag: '🇧🇷',
    lodgedDate: 'Yesterday, 02:15 PM',
    currentStage: 2,
    assignedOfficer: 'Eng. Camila Silveira',
    department: 'Secretaria de Infraestrutura e Transporte',
    targetSlaHours: 72,
    elapsedHours: 28,
    statusBadge: 'Technical Audit In Progress',
    statusColor: 'text-blue-400 bg-blue-950/80 border-blue-600/50',
    events: [
      { stage: 'Grievance Lodged & Cryptographically Signed', timestamp: 'Yesterday 02:15 PM', desc: 'Incident registered via WhatsApp DPI voice intake.', completed: true },
      { stage: 'Satellite Risk & Copernicus Rainfall Triangulation', timestamp: 'Yesterday 02:20 PM', desc: 'Copernicus Sentinel-2 layer cross-referenced high flood erosion.', completed: true },
      { stage: 'Departmental Field Allocation', timestamp: 'Pending Final Budget Sign-off', desc: 'Pre-engineering DPR drafted via Gemini Sovereign Studio.', completed: false },
      { stage: 'Remediation & Citizen Verification', timestamp: 'Estimated 48 hrs', desc: 'Emergency Bailey bridge deployment scheduled.', completed: false },
    ]
  },
  'BRICS-ZAF-2026-1092': {
    token: 'BRICS-ZAF-2026-1092',
    title: 'Primary Health Clinic Microgrid Battery Bank Failure',
    category: 'Health Infrastructure',
    location: 'Ekurhuleni District, Gauteng',
    country: 'South Africa',
    flag: '🇿🇦',
    lodgedDate: '2 Days Ago',
    currentStage: 4,
    assignedOfficer: 'Dr. Thabo Mokoena & Power Unit',
    department: 'Department of Health & Energy Security',
    targetSlaHours: 24,
    elapsedHours: 22,
    statusBadge: 'Resolved & Citizen Verified',
    statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/50',
    events: [
      { stage: 'Grievance Lodged & Cryptographically Signed', timestamp: '2 Days Ago', desc: 'Cold-chain vaccine refrigeration alert triggered.', completed: true },
      { stage: 'Vertex AI AutoML Priority Escalation', timestamp: '2 Days Ago', desc: 'Escalated to Tier-1 Critical due to vaccine preservation risks.', completed: true },
      { stage: 'Departmental Field Allocation', timestamp: 'Yesterday 08:00 AM', desc: 'Mobile solar inverter and new LiFePO4 cells delivered.', completed: true },
      { stage: 'Remediation & Citizen Verification', timestamp: 'Today 09:00 AM', desc: 'Clinic power restored. Verified via IoT telemetry sensor.', completed: true },
    ]
  }
};

export const CitizenComplaintPage: React.FC<CitizenComplaintPageProps> = ({
  onReportSubmitted,
  onNavigateToFeed,
  selectedCountry: initialCountry,
}) => {
  const {
    t,
    tCountry,
    tSector,
    tUrgency,
    currentLanguageInfo,
    currentLanguage,
    setLanguage,
    adaptLanguageForRegion,
    adaptLanguageForCountry,
    startListening,
    stopListening,
    isListening,
    speak,
    stopSpeaking,
    isSpeaking,
  } = useLanguage();

  // Primary Active View Mode: 'lodge-form' or 'track-status'
  const [activePortalTab, setActivePortalTab] = useState<'lodge-form' | 'track-status'>('lodge-form');

  // Country & Territory Selection
  const [countryId, setCountryId] = useState<BRICSCountryId>(
    initialCountry !== 'all' ? initialCountry : 'india'
  );
  const countryRegions = REGIONS_DATA.filter((r) => r.countryId === countryId);
  const [regionId, setRegionId] = useState<string>(countryRegions[0]?.id || 'ind_bihar');

  // Form Fields State
  const [citizenName, setCitizenName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('High-Pressure Potable Water Pipe Rupture & Road Surface Subsidence');
  const [description, setDescription] = useState<string>(
    'Subterranean potable water pipeline has burst on the main arterial corridor, discharging untreated high-pressure runoff and eroding the asphalt roadbed. Approximately 400 families lack clean water.'
  );
  const [category, setCategory] = useState<InfrastructureSector>('Water & Sanitation');
  const [urgencyLevel, setUrgencyLevel] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [agreedToCharter, setAgreedToCharter] = useState<boolean>(true);

  // Geospatial Coordinates & Public Data Context
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 25.5941,
    lng: 85.1376,
  });
  const [publicDataContext, setPublicDataContext] = useState<any | null>(null);

  // Multimodal Vision Evidence
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedTags, setDetectedTags] = useState<string[]>(['#BrokenPipe', '#WaterLeakage', '#RoadDamage']);
  const [visionAnalysisData, setVisionAnalysisData] = useState<any | null>(null);

  // 33 Languages Dictation & TTS Audio State
  const [selectedDictationLang, setSelectedDictationLang] = useState<string>(currentLanguage || 'en');
  const [showLanguageDrawer, setShowLanguageDrawer] = useState<boolean>(false);
  const [langSearchQuery, setLangSearchQuery] = useState<string>('');
  const [liveInterimText, setLiveInterimText] = useState<string>('');
  const [isPlayingDraftAudio, setIsPlayingDraftAudio] = useState<boolean>(false);

  // Modals
  const [showSmartDraftModal, setShowSmartDraftModal] = useState<boolean>(false);
  const [showTerminalModal, setShowTerminalModal] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] = useState<CitizenReport | null>(null);

  // Grievance Status Tracking Search State
  const [searchTokenInput, setSearchTokenInput] = useState<string>('BRICS-IND-2026-8941');
  const [trackedReport, setTrackedReport] = useState<any>(SAMPLE_TRACKING_DATABASE['BRICS-IND-2026-8941']);
  const [trackingNotFound, setTrackingNotFound] = useState<boolean>(false);

  const currentCountry = BRICS_COUNTRIES.find((c) => c.id === countryId) || BRICS_COUNTRIES[0];
  const currentRegion = REGIONS_DATA.find((r) => r.id === regionId) || countryRegions[0];
  const activeDictationLangObj: BRICSLanguageInfo = 
    BRICS_33_LANGUAGES.find((l) => l.code === selectedDictationLang) || currentLanguageInfo;

  // Handle Territory / Country Change
  const handleCountryChange = (newCountry: BRICSCountryId) => {
    setCountryId(newCountry);
    adaptLanguageForCountry(newCountry);
    const newRegions = REGIONS_DATA.filter((r) => r.countryId === newCountry);
    if (newRegions.length > 0) {
      setRegionId(newRegions[0].id);
      adaptLanguageForRegion(newRegions[0].id, true);
      const latLngMap: Record<string, { lat: number; lng: number }> = {
        india: { lat: 25.5941, lng: 85.1376 },
        brazil: { lat: -12.9714, lng: -41.5454 },
        russia: { lat: 55.7558, lng: 37.6173 },
        china: { lat: 31.2304, lng: 121.4737 },
        south_africa: { lat: -28.5306, lng: 30.8958 },
        egypt: { lat: 27.1809, lng: 31.1837 },
        ethiopia: { lat: 9.0249, lng: 38.7469 },
        iran: { lat: 35.6892, lng: 51.3890 },
        uae: { lat: 25.2048, lng: 55.2708 },
        saudi_arabia: { lat: 24.7136, lng: 46.6753 },
      };
      if (latLngMap[newCountry]) {
        setCoordinates(latLngMap[newCountry]);
      }
    }
  };

  const handleRegionChange = (newRegionId: string) => {
    setRegionId(newRegionId);
    adaptLanguageForRegion(newRegionId);
  };

  // Dictation Toggle
  const handleToggleDictation = () => {
    if (isListening) {
      stopListening();
      setLiveInterimText('');
      return;
    }
    setLiveInterimText('');
    startListening({
      lang: selectedDictationLang,
      continuous: true,
      onResult: (transcript) => {
        setLiveInterimText(transcript);
        setDescription((prev) => {
          if (!prev) return transcript;
          if (prev.endsWith(transcript) || transcript.startsWith(prev)) return transcript;
          return `${prev} ${transcript}`;
        });
      },
      onError: () => {
        setLiveInterimText('');
      }
    });
  };

  // Text-to-Speech Draft Read-Back
  const handleToggleListenToDraft = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsPlayingDraftAudio(false);
      return;
    }
    const scriptToRead = `Sovereign Grievance Verification. ` +
      `Jurisdiction: ${currentRegion.name}, ${currentCountry.name}. ` +
      `Sector: ${category}. ` +
      `Title: ${title || 'Infrastructure Deficit'}. ` +
      `Description: ${description}. ` +
      `Target SLA: 48 Hours.`;

    setIsPlayingDraftAudio(true);
    speak(scriptToRead, activeDictationLangObj.code, {
      rate: 0.95,
      onEnd: () => setIsPlayingDraftAudio(false)
    });
  };

  // Submission Form Handler
  const handleInitiateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setShowTerminalModal(true);
  };

  const handleSubmissionFinished = (newReport: CitizenReport) => {
    onReportSubmitted(newReport);
    setSubmittedReport(newReport);
    setShowTerminalModal(false);
  };

  // Status Tracking Lookup
  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = searchTokenInput.trim().toUpperCase();
    if (SAMPLE_TRACKING_DATABASE[cleanToken]) {
      setTrackedReport(SAMPLE_TRACKING_DATABASE[cleanToken]);
      setTrackingNotFound(false);
    } else if (submittedReport && submittedReport.token.toUpperCase() === cleanToken) {
      // Dynamic newly submitted report
      setTrackedReport({
        token: submittedReport.token,
        title: submittedReport.englishTranslation || title,
        category: submittedReport.category,
        location: `${submittedReport.regionName}`,
        country: currentCountry.name,
        flag: currentCountry.flag,
        lodgedDate: 'Just now',
        currentStage: 2,
        assignedOfficer: 'Automated Regional Dispatcher',
        department: 'Municipal Works Directorate',
        targetSlaHours: 48,
        elapsedHours: 0.1,
        statusBadge: 'AI-Verified & Streamed',
        statusColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50',
        events: [
          { stage: 'Grievance Lodged & Cryptographically Signed', timestamp: 'Just now', desc: 'Securely recorded in Cloud Firestore ledger.', completed: true },
          { stage: 'Vertex AI & BigQuery Ingest', timestamp: 'Just now', desc: 'Dispatched to regional engineering dashboard.', completed: true },
          { stage: 'Departmental Field Allocation', timestamp: 'In progress', desc: 'Issuing work order to field personnel.', completed: false },
          { stage: 'Remediation & Citizen Verification', timestamp: 'Target: 48 hrs', desc: 'Field inspection and repair.', completed: false },
        ]
      });
      setTrackingNotFound(false);
    } else {
      setTrackingNotFound(true);
    }
  };

  // 33 Languages Filter
  const filteredLanguages = BRICS_33_LANGUAGES.filter((lang) => {
    const q = langSearchQuery.toLowerCase();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.country.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  // Calculate current form step completion
  const isStep1Complete = !!countryId && !!regionId;
  const isStep2Complete = !!category && !!urgencyLevel;
  const isStep3Complete = title.trim().length > 5 && description.trim().length > 15;

  // =========================================================================
  // VIEW: OFFICIAL GRIEVANCE ACKNOWLEDGMENT CERTIFICATE (POST-SUBMISSION)
  // =========================================================================
  if (submittedReport) {
    return (
      <div id="sovereign-complaint-receipt" className="max-w-5xl w-full mx-auto space-y-6 py-4 animate-in fade-in duration-300">
        
        {/* Top Back / Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubmittedReport(null)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-300 shadow-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lodge Another Grievance</span>
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-300 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print Acknowledgment</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToFeed}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-xl shadow-md transition cursor-pointer"
            >
              <span>View Public Ledger</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Sovereign Certificate Container */}
        <div className="bg-white border-2 border-blue-600/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-200 pb-6 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Government Redressal Acknowledgment</span>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl">🏛️</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                BRICS Sovereign Grievance Certificate
              </h1>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              This grievance has been cryptographically recorded in the decentralized Digital Public Infrastructure ledger and queued for immediate ministerial dispatch.
            </p>
          </div>

          {/* Primary Reference Token Banner */}
          <div className="bg-slate-50 border border-blue-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-slate-500">
                Official Grievance Tracking Token (SHA-256)
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-blue-700 tracking-wider">
                {submittedReport.token}
              </div>
              <p className="text-xs text-slate-600">
                Quote this token in all future correspondence or enter it in the Status Tracking Console.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(submittedReport.token);
                  alert(`Token ${submittedReport.token} copied to clipboard!`);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-blue-600" />
                <span>Copy Token</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchTokenInput(submittedReport.token);
                  setActivePortalTab('track-status');
                  setTrackedReport(SAMPLE_TRACKING_DATABASE[submittedReport.token] || {
                    token: submittedReport.token,
                    title: submittedReport.englishTranslation || title,
                    category: submittedReport.category,
                    location: `${submittedReport.regionName}`,
                    country: currentCountry.name,
                    flag: currentCountry.flag,
                    lodgedDate: 'Just now',
                    currentStage: 2,
                    assignedOfficer: 'Automated Regional Dispatcher',
                    department: 'Municipal Works Directorate',
                    targetSlaHours: 48,
                    elapsedHours: 0.1,
                    statusBadge: 'AI-Verified & Streamed',
                    statusColor: 'text-blue-800 bg-blue-50 border-blue-300',
                    events: [
                      { stage: 'Grievance Lodged & Cryptographically Signed', timestamp: 'Just now', desc: 'Securely recorded in Cloud Firestore ledger.', completed: true },
                      { stage: 'Vertex AI & BigQuery Ingest', timestamp: 'Just now', desc: 'Dispatched to regional engineering dashboard.', completed: true },
                      { stage: 'Departmental Field Allocation', timestamp: 'In progress', desc: 'Issuing work order to field personnel.', completed: false },
                      { stage: 'Remediation & Citizen Verification', timestamp: 'Target: 48 hrs', desc: 'Field inspection and repair.', completed: false },
                    ]
                  });
                  setSubmittedReport(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Track Live Status</span>
              </button>
            </div>
          </div>

          {/* Formally Structured 4-Cell Telemetry Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Jurisdiction & GPS:</span>
              <p className="font-bold text-slate-900 text-sm">{submittedReport.regionName}, {currentCountry.name} {currentCountry.flag}</p>
              <p className="text-[11px] font-mono text-blue-700">{coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Infrastructure Sector:</span>
              <p className="font-bold text-blue-800 text-sm">{submittedReport.category}</p>
              <p className="text-[11px] text-slate-500">ISO-37120 Certified Metric</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Target Resolution SLA:</span>
              <p className="font-bold text-emerald-700 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> 48 Hours Guaranteed
              </p>
              <p className="text-[11px] text-slate-500">Field Unit Dispatched</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Filing Identity:</span>
              <p className="font-bold text-slate-900 text-sm truncate">{isAnonymous ? 'Protected Anonymous Whistleblower' : (citizenName || 'Verified Citizen')}</p>
              <p className="text-[11px] text-slate-500">{mobileNumber ? `SMS: ${mobileNumber}` : 'Web Portal Token'}</p>
            </div>
          </div>

          {/* Citizen Native Audio Reassurance Player */}
          <div className="bg-slate-50 border border-blue-200 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Sovereign Voice Reassurance ({submittedReport.language}):</span>
              </div>
              <button
                type="button"
                onClick={() => speak(submittedReport.citizenReassuranceMessage || 'Your grievance has been verified and registered.', submittedReport.languageCode)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Native Tongue Audio</span>
              </button>
            </div>
            <p className="italic text-slate-800 bg-white p-4 rounded-xl border border-slate-200 text-xs leading-relaxed">
              "{submittedReport.citizenReassuranceMessage || `Your complaint #${submittedReport.token} has been securely verified and queued for field deployment.`}"
            </p>
          </div>

          {/* Bottom Security Seals & Guarantees */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-600">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Immutable Ledger Sync • Zero Backdoors • Cloud Firestore</span>
            </div>
            <div>
              <span>Official Timestamp: {new Date().toUTCString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN REDESIGNED GOVERNMENT APPLICATION PORTAL
  // =========================================================================
  return (
    <div id="sovereign-grievance-portal" className="max-w-7xl w-full mx-auto space-y-6 pb-20 px-2 sm:px-4 overflow-x-hidden text-slate-900">
      
      {/* =====================================================================
          1. OFFICIAL GOVERNMENT / BRICS DPI HEADER BANNER
          ===================================================================== */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          
          {/* Official Emblem & Titles */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-200 p-1 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-3xl select-none">🏛️</span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Official BRICS DPI Portal
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ISO-37120 Standard
                </span>
                <span className="text-[10px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  48-Hr SLA Standard
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sovereign Public Grievance & Redressal Service
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Centralized Digital Public Infrastructure uniting 10 sovereign nations for prompt deficit reporting, geospatial computer vision triage, and guaranteed ministerial remediation.
              </p>
            </div>
          </div>

          {/* 33 Languages Switcher (Google Cloud Translation) */}
          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              id="header-brics-language-btn"
              onClick={() => setShowLanguageDrawer(true)}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-2xl border border-slate-300 shadow-sm text-xs font-semibold transition cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>{activeDictationLangObj.nativeName} ({activeDictationLangObj.name})</span>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold">
                33 Langs
              </span>
            </button>
          </div>
        </div>

        {/* Official Mode Navigation Tabs (Lodge Complaint vs Track Status) */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200">
          <button
            type="button"
            id="tab-lodge-complaint"
            onClick={() => setActivePortalTab('lodge-form')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activePortalTab === 'lodge-form'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lodge New Grievance</span>
          </button>

          <button
            type="button"
            id="tab-track-complaint"
            onClick={() => setActivePortalTab('track-status')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activePortalTab === 'track-status'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Track Grievance Status & SLA</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. TAB VIEW A: STATUS / TRACKING CONSOLE
          ===================================================================== */}
      {activePortalTab === 'track-status' && (
        <div id="tracking-console-view" className="space-y-6 animate-in fade-in duration-200">
          
          {/* Tracking Search Input Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Grievance Lifecycle Tracker</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your unique cryptographic token or select from recent official filings below.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
                Live Government Registry
              </span>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchTracking} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchTokenInput}
                  onChange={(e) => setSearchTokenInput(e.target.value)}
                  placeholder="e.g. BRICS-IND-2026-8941, BRICS-BRA-2026-4412"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Tracking Record</span>
              </button>
            </form>

            {/* Sample Preset Tokens for 1-Click Verification */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-600 font-medium">Sample Sovereign Records:</span>
              {Object.keys(SAMPLE_TRACKING_DATABASE).map((tokenKey) => (
                <button
                  key={tokenKey}
                  type="button"
                  onClick={() => {
                    setSearchTokenInput(tokenKey);
                    setTrackedReport(SAMPLE_TRACKING_DATABASE[tokenKey]);
                    setTrackingNotFound(false);
                  }}
                  className={`px-3 py-1 rounded-lg border font-mono text-[11px] transition cursor-pointer ${
                    searchTokenInput === tokenKey
                      ? 'bg-blue-100 border-blue-400 text-blue-800 font-bold'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {tokenKey}
                </button>
              ))}
            </div>

            {trackingNotFound && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>No active sovereign record found for token "{searchTokenInput}". Please check the token formatting or lodge a new complaint.</span>
              </div>
            )}
          </div>

          {/* Tracked Record Dossier & 4-Stage Progress Bar */}
          {trackedReport && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
              
              {/* Header Details */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{trackedReport.flag} {trackedReport.country}</span>
                    <span>•</span>
                    <span>{trackedReport.location}</span>
                    <span>•</span>
                    <span>Lodged: {trackedReport.lodgedDate}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {trackedReport.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-blue-700">{trackedReport.category}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-mono">Ref: {trackedReport.token}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${trackedReport.statusColor}`}>
                    {trackedReport.statusBadge}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-2 font-mono">
                    Target SLA: {trackedReport.targetSlaHours}h | Elapsed: {trackedReport.elapsedHours}h
                  </div>
                </div>
              </div>

              {/* 4-STAGE FORMAL PROGRESS BAR */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-600">
                  Official 4-Stage Redressal Lifecycle
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { stageNum: 1, name: 'Grievance Lodged', sub: 'Cryptographically Verified', completed: trackedReport.currentStage >= 1, active: trackedReport.currentStage === 1 },
                    { stageNum: 2, name: 'AI & Satellite Triage', sub: 'Multimodal Defect Audit', completed: trackedReport.currentStage >= 2, active: trackedReport.currentStage === 2 },
                    { stageNum: 3, name: 'Departmental Dispatch', sub: 'Field Engineers Assigned', completed: trackedReport.currentStage >= 3, active: trackedReport.currentStage === 3 },
                    { stageNum: 4, name: 'Remediation & Closure', sub: 'Citizen Verified', completed: trackedReport.currentStage >= 4, active: trackedReport.currentStage === 4 },
                  ].map((st) => (
                    <div 
                      key={st.stageNum} 
                      className={`p-4 rounded-xl border transition-all ${
                        st.completed 
                          ? 'bg-emerald-50 border-emerald-300 text-slate-900' 
                          : st.active 
                            ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm ring-2 ring-blue-200' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                          st.completed 
                            ? 'bg-emerald-600 text-white' 
                            : st.active 
                              ? 'bg-blue-700 text-white' 
                              : 'bg-slate-200 text-slate-600'
                        }`}>
                          {st.completed ? '✓' : st.stageNum}
                        </span>
                        <span className="text-[10px] font-mono uppercase font-semibold">
                          {st.completed ? 'Completed' : st.active ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold">{st.name}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">{st.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departmental Allocation & Audit Trail Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Departmental Officer Assignment Card */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-mono uppercase font-semibold text-slate-500">
                    Assigned Redressal Authority
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{trackedReport.department}</p>
                    <p className="text-xs text-blue-700 font-semibold">{trackedReport.assignedOfficer}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span>Priority Escalation Level:</span>
                    <span className="text-amber-700 font-bold font-mono">Tier-1 High Priority</span>
                  </div>
                </div>

                {/* Chronological Audit Log */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-mono uppercase font-semibold text-slate-500">
                    Chronological Redressal Audit Trail
                  </span>
                  <div className="space-y-2.5">
                    {trackedReport.events.map((ev: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ev.completed ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-semibold ${ev.completed ? 'text-slate-900' : 'text-slate-500'}`}>{ev.stage}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{ev.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{ev.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          3. TAB VIEW B: STRUCTURED GOVERNMENT GRIEVANCE SUBMISSION FORM
          ===================================================================== */}
      {activePortalTab === 'lodge-form' && (
        <div id="lodge-form-view" className="space-y-6 animate-in fade-in duration-200">
          
          {/* STEP PROGRESS BAR INDICATOR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider font-mono">
                Official Redressal Filing Workflow
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {isStep3Complete ? 'Step 3 of 3 Ready' : 'In Progress'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                isStep1Complete ? 'bg-blue-50 border-blue-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold">Jurisdiction & Identity</div>
                  <div className="text-[10px] text-slate-500">{currentCountry.name} • {currentRegion.name}</div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                isStep2Complete ? 'bg-blue-50 border-blue-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold">Infrastructure Sector</div>
                  <div className="text-[10px] text-slate-500">{category} ({urgencyLevel})</div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                isStep3Complete ? 'bg-emerald-50 border-emerald-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                  isStep3Complete ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  3
                </div>
                <div>
                  <div className="text-xs font-bold">Evidence & Statement</div>
                  <div className="text-[10px] text-slate-500">GPS, Voice & AI Triage</div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN FORM CONTAINER (2 COLUMNS) */}
          <form onSubmit={handleInitiateSubmission} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ===============================================================
                LEFT COLUMN: EVIDENTIARY DOSSIER & MAPS (5 COLUMNS)
                =============================================================== */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* SECTION: INTERACTIVE GEOSPATIAL MAP & PUBLIC DATA CONTEXT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>Geospatial Incident Triangulation</span>
                  </label>
                  <span className="text-[10px] text-blue-700 font-mono font-semibold">Google Earth Engine</span>
                </div>
                
                <GeospatialEarthEngineWidget
                  countryName={tCountry(currentCountry.id)}
                  regionName={currentRegion.name}
                  coordinates={coordinates}
                  onCoordinatesChange={(coords, context) => {
                    setCoordinates(coords);
                    if (context) setPublicDataContext(context);
                  }}
                  sector={category}
                />
              </div>

              {/* SECTION: MULTIMODAL PHOTOGRAPHIC EVIDENCE SCANNER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-purple-600" />
                    <span>Multimodal Photographic Proof</span>
                  </label>
                  <span className="text-[10px] text-purple-700 font-mono font-semibold">Vertex Vision</span>
                </div>

                <MultimodalVisionDropzone
                  imagePreview={imagePreview}
                  onImageUploaded={(base64, analysis) => {
                    setImagePreview(base64);
                    if (analysis) {
                      setVisionAnalysisData(analysis);
                      if (analysis.suggestedTitle) setTitle(analysis.suggestedTitle);
                      if (analysis.detectedTags) setDetectedTags(analysis.detectedTags);
                      if (analysis.damageSeverity) setUrgencyLevel(analysis.damageSeverity as any);
                    }
                  }}
                  onAutoFillTitle={(suggestedTitle) => setTitle(suggestedTitle)}
                  onTagsExtracted={(tags) => setDetectedTags(tags)}
                  locationName={`${currentRegion.name}, ${tCountry(currentCountry.id)}`}
                />
              </div>

              {/* VERTEX AI AUTOMATED PREDICTIVE SLA BADGE */}
              <VertexPredictiveSlaBadge
                sector={category}
                urgencyLevel={urgencyLevel}
                hasPhoto={!!imagePreview}
                detectedTags={detectedTags}
                locationName={`${currentRegion.name}, ${tCountry(currentCountry.id)}`}
              />
            </div>

            {/* ===============================================================
                RIGHT COLUMN: STRUCTURED GOVERNMENT GRIEVANCE FORM (7 COLUMNS)
                =============================================================== */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* CARD 1: TERRITORIAL JURISDICTION & CITIZEN IDENTITY */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      1. Sovereign Jurisdiction & Citizen Metadata
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                    Section 1
                  </span>
                </div>

                {/* Country & Region Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      BRICS Sovereign Member Nation <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={countryId}
                      onChange={(e) => handleCountryChange(e.target.value as BRICSCountryId)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer"
                    >
                      {BRICS_COUNTRIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {tCountry(c.id)} ({c.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      State / Territorial Jurisdiction <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={regionId}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none cursor-pointer"
                    >
                      {countryRegions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Citizen Identity & Whistleblower Protection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Citizen Name:</span>
                      </label>
                      
                      <label className="flex items-center gap-1.5 text-[11px] text-blue-700 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>File Anonymously</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={isAnonymous ? 'Protected Anonymous Citizen' : citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Maria Silva / Rajeshwar Kumar"
                      className="w-full bg-white disabled:bg-slate-100 disabled:opacity-60 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>SMS Updates Mobile (Optional):</span>
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210 (For real-time SMS alerts)"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: INFRASTRUCTURE CLASSIFICATION & URGENCY MATRIX */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      2. Infrastructure Deficit Classification (ISO-37120)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-blue-700 font-semibold">{tSector(category)}</span>
                </div>

                {/* 7 Sectors Structured Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {SECTOR_METRICS.map((sec) => {
                    const IconComp = sec.icon;
                    const isSelected = category === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setCategory(sec.id)}
                        className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[72px] cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-300'
                            : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-blue-700' : 'text-slate-500'}`} />
                          <span className="text-[9px] font-mono text-slate-500 font-semibold">{sec.slaDefaultHours}h SLA</span>
                        </div>
                        <div className="mt-1">
                          <div className="text-xs font-bold leading-tight line-clamp-1">{tSector(sec.id)}</div>
                          <div className="text-[9px] text-slate-500 truncate mt-0.5">{sec.nativeLabel}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Urgency & SLA Classification Matrix */}
                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-700">Urgency Severity Matrix:</span>
                    <p className="text-[10px] text-slate-500">Determines immediate dispatch protocol</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(['Critical', 'High', 'Medium', 'Low'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setUrgencyLevel(lvl)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold font-mono transition cursor-pointer ${
                          urgencyLevel === lvl
                            ? lvl === 'Critical' 
                              ? 'bg-red-600 text-white shadow-sm' 
                              : lvl === 'High' 
                                ? 'bg-amber-600 text-white shadow-sm' 
                                : 'bg-blue-700 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {tUrgency(lvl)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: FORMAL GRIEVANCE STATEMENT & VOICE SYNTHESIS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      3. Formal Grievance Statement & Multilingual Evidence
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                    Section 3
                  </span>
                </div>

                {/* Complaint Title Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Grievance Headline / Summary <span className="text-rose-600">*</span>
                    </label>
                    {visionAnalysisData && (
                      <span className="text-[10px] font-mono text-purple-700 flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        Extracted from Vertex Vision
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken Water Main causing severe flooding and road erosion"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                {/* Detailed Description with AI Smart Draft & Voice Microphones */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Detailed Incident Narrative <span className="text-rose-600">*</span>
                    </label>

                    {/* Integrated AI & Voice Action Toolbar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        id="smart-draft-gemini-btn"
                        onClick={() => setShowSmartDraftModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                        <span>Smart Draft (Gemini)</span>
                      </button>

                      <button
                        type="button"
                        id="dictate-stt-btn"
                        onClick={handleToggleDictation}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isListening
                            ? 'bg-red-600 text-white animate-pulse shadow-md'
                            : 'bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-300'
                        }`}
                      >
                        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
                        <span>{isListening ? 'Stop Dictating' : `Dictate (${activeDictationLangObj.code.toUpperCase()})`}</span>
                      </button>

                      <button
                        type="button"
                        id="listen-to-draft-tts-btn"
                        onClick={handleToggleListenToDraft}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isPlayingDraftAudio
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isPlayingDraftAudio ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{isPlayingDraftAudio ? 'Stop Audio' : 'Listen Read-Back'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="relative">
                    <textarea
                      rows={5}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide specific details about the infrastructure defect, affected households, and urgent risks..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none leading-relaxed"
                    />

                    {/* Speech Dictation Waveform Overlay */}
                    {isListening && (
                      <div className="absolute bottom-3 left-3 right-3 bg-red-50 border border-red-300 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs text-red-900 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-3 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-4 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="w-1 h-6 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                          </div>
                          <span className="font-mono text-[11px] font-semibold">Listening in {activeDictationLangObj.name}...</span>
                        </div>
                        <span className="text-[10px] italic text-slate-600 truncate max-w-xs">{liveInterimText || 'Speak clearly into microphone...'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Citizen Statutory Declaration */}
                <div className="pt-2 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    id="declaration-checkbox"
                    checked={agreedToCharter}
                    onChange={(e) => setAgreedToCharter(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="declaration-checkbox" className="cursor-pointer select-none leading-relaxed">
                    I hereby declare that this grievance is genuine and accurate to the best of my knowledge under the <span className="text-slate-900 font-semibold">BRICS Sovereign Digital Public Infrastructure Charter</span>.
                  </label>
                </div>
              </div>

              {/* PRIMARY SUBMISSION BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!agreedToCharter}
                  id="submit-complaint-master-btn"
                  className="w-full py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-md transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Sovereign Grievance (Dispatch to Live Ledger)</span>
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                </button>
              </div>

            </div>
          </form>

        </div>
      )}

      {/* =====================================================================
          4. 33 LANGUAGES MODAL DRAWER (GOOGLE CLOUD TRANSLATION API)
          ===================================================================== */}
      {showLanguageDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Google Cloud Translation (33 BRICS & Regional Languages)</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Dynamic localized UI & native voice synthesis across all member states</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLanguageDrawer(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={langSearchQuery}
                  onChange={(e) => setLangSearchQuery(e.target.value)}
                  placeholder="Search 33 languages (e.g. Hindi, Russian, Arabic, Zulu, Portuguese, Mandarin)..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Languages Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs flex-1">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedDictationLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedDictationLang(lang.code);
                      setLanguage(lang.code);
                      setShowLanguageDrawer(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{lang.nativeName} ({lang.name})</div>
                      <div className="text-[10px] text-slate-500 font-mono">{lang.country} • ISO: {lang.code}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. GEMINI 1.5 SMART DRAFT MODAL
          ===================================================================== */}
      {showSmartDraftModal && (
        <GeminiSmartDraftModal
          rawDescription={description}
          locationName={`${currentRegion.name}, ${currentCountry.name}`}
          sector={category}
          detectedTags={detectedTags}
          citizenLanguage={activeDictationLangObj.name}
          onApplyDraft={(formalTitle, formalDesc, urg) => {
            setTitle(formalTitle);
            setDescription(formalDesc);
            setUrgencyLevel(urg);
          }}
          onClose={() => setShowSmartDraftModal(false)}
        />
      )}

      {/* =====================================================================
          6. DIALOGFLOW ASSISTANT MODAL
          ===================================================================== */}
      <DialogflowAssistantModal
        currentLanguage={activeDictationLangObj.name}
        userLocation={`${currentRegion.name}, ${currentCountry.name}`}
      />

      {/* =====================================================================
          7. FIREBASE & BIGQUERY TERMINAL SUBMISSION MODAL
          ===================================================================== */}
      {showTerminalModal && (
        <FirebaseBigQueryTerminalModal
          reportPayload={{
            title,
            description,
            category,
            urgencyLevel,
            country: currentCountry.name,
            countryId,
            regionId,
            regionName: currentRegion.name,
            citizenName,
            isAnonymous,
            mobileNumber,
            lat: coordinates.lat,
            lng: coordinates.lng,
            language: activeDictationLangObj.name,
            languageCode: activeDictationLangObj.code,
            imagePreview,
            detectedTags,
            publicDataContext,
            estimatedSlaHours: 48,
          }}
          onComplete={handleSubmissionFinished}
          onClose={() => setShowTerminalModal(false)}
        />
      )}
    </div>
  );
};
