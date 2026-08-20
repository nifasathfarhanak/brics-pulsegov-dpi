import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Droplets, 
  Zap, 
  Wind, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  FileText, 
  X, 
  Radio, 
  AlertTriangle, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { CitizenReport, DemandHotspot } from '../types';

export interface CrisisScenario {
  id: string;
  title: string;
  icon: string;
  category: string;
  location: string;
  regionId: string;
  countryId: 'india' | 'brazil' | 'south_africa' | 'uae';
  severity: 'Critical Emergency' | 'High Alert';
  incidentCount: number;
  affectedPop: number;
  headline: string;
  description: string;
  aiActionPlan: string;
  recommendedDPRTitle: string;
  recommendedCapExUSD_M: number;
  sampleReports: string[];
}

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    id: 'scen-patna-flood',
    title: '🌧️ Monsoon Cloudburst & Severe Inundation in Patna',
    icon: '🌧️',
    category: 'Water & Sanitation',
    location: 'Patna & Samastipur River Basin, Bihar, India',
    regionId: 'ind_bihar',
    countryId: 'india',
    severity: 'Critical Emergency',
    incidentCount: 54,
    affectedPop: 18500,
    headline: 'Sudden 145mm Cloudburst Overwhelms Urban Sump Stations',
    description: '400 hectares of residential wards inundated under 3.5 feet of water. 3 primary healthcare centers submerged and 42 drinking borewells contaminated with surface runoff.',
    aiActionPlan: 'Mobilize 12 emergency submersible dewatering pumps, deploy chlorination squads, and initiate fast-track Stormwater Drainage DPR.',
    recommendedDPRTitle: 'Emergency ₹45 Cr High-Capacity Stormwater Sump & Embankment Overhaul',
    recommendedCapExUSD_M: 5.4,
    sampleReports: [
      'Kankarbagh Ward 32 me paani ghar ke andar ghus gaya hai, bijli bhi kaat di gayi hai.',
      'Samastipur me Chakmehsi bridge ke dono approach road beh gaye hain.',
      'Drinking water borewells are spewing muddy flood water, urgent chlorine tablets needed.'
    ]
  },
  {
    id: 'scen-nagpur-grid',
    title: '⚡ 48°C Heatwave & 11kV Grid Blackout in Nagpur',
    icon: '⚡',
    category: 'Energy & Microgrids',
    location: 'Nagpur & Vidarbha Rural Health Corridor, Maharashtra, India',
    regionId: 'ind_maharashtra',
    countryId: 'india',
    severity: 'Critical Emergency',
    incidentCount: 68,
    affectedPop: 24000,
    headline: 'Transformer Overheats During Peak Heatwave Disabling Clinic Cold-Chains',
    description: 'Extreme temperatures caused simultaneous 11kV distribution line trips across 14 rural primary health centers, jeopardizing 1,200 vaccine doses and maternity oxygen concentrators.',
    aiActionPlan: 'Deploy mobile diesel generators to 14 rural clinics and auto-sanction 50kW Decentralized Solar Microgrid + Battery Storage DPR.',
    recommendedDPRTitle: 'Sovereign 50kW Solar Microgrid & Cold-Chain Storage for 14 Rural Clinics',
    recommendedCapExUSD_M: 3.2,
    sampleReports: [
      'Sub-center clinic lost power 6 hours ago, emergency vaccine refrigerator heating up.',
      '11kV transformer blasted with sparks near industrial zone, entire block blackout.',
      'Heavy heatwave stroke patients arriving at rural hospital with no fans or power.'
    ]
  },
  {
    id: 'scen-mandya-culvert',
    title: '🚜 Flash Flood & Culvert Bridge Scour in Mandya',
    icon: '🚜',
    category: 'Transport & Connectivity',
    location: 'Mandya Agrarian Panchayat Corridor, Karnataka, India',
    regionId: 'ind_karnataka',
    countryId: 'india',
    severity: 'High Alert',
    incidentCount: 38,
    affectedPop: 12800,
    headline: 'Wooden Agricultural Culvert Washed Out, Isolating 8,000 Sugarcane Farmers',
    description: 'Unseasonal reservoir discharge washed away the primary arterial culvert on State Highway feeder, preventing agricultural produce trucks and school transit.',
    aiActionPlan: 'Issue emergency PWD precast box-culvert dispatch order with a guaranteed 14-day completion milestone.',
    recommendedDPRTitle: 'All-Weather Precast Box-Culvert & Scour Protection Upgrade',
    recommendedCapExUSD_M: 2.1,
    sampleReports: [
      'Mandya river bridge broke, farmers cannot transport sugarcane harvest to mill.',
      'Ambulance and school bus stranded on other side of broken culvert.',
      'Need immediate temporary bailey bridge or precast culvert.'
    ]
  },
  {
    id: 'scen-bahia-flood',
    title: '🌴 River Basin Flash Flood & Isolation in Bahia',
    icon: '🌴',
    category: 'Transport & Connectivity',
    location: 'Bahia Agrarian Basin, Brazil',
    regionId: 'bra_bahia',
    countryId: 'brazil',
    severity: 'High Alert',
    incidentCount: 42,
    affectedPop: 16000,
    headline: 'Excessive Rainfall Breaches Rural Access Bridges & Disrupts Cassava Harvest',
    description: '3 regional wooden crossings washed out by river surge. Isolated rural communities require reinforced composite modular bridges.',
    aiActionPlan: 'Trigger NDB co-financed climate-resilient road & bridge reconstruction package.',
    recommendedDPRTitle: 'Climate-Resilient Precast Bridge & River Scour Mitigation Project',
    recommendedCapExUSD_M: 4.8,
    sampleReports: [
      'A ponte de madeira quebrou e a comunidade rural ficou isolada.',
      'Caminhões de mandioca e ônibus escolar não conseguem atravessar o rio.'
    ]
  }
];

interface CrisisSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectReports?: (reports: CitizenReport[]) => void;
  onNavigateToMap?: (regionId: string) => void;
  onNavigateToDPRStudio?: (title: string, budgetM: number, sector: string) => void;
}

export const CrisisSimulationModal: React.FC<CrisisSimulationModalProps> = ({
  isOpen,
  onClose,
  onInjectReports,
  onNavigateToMap,
  onNavigateToDPRStudio,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<CrisisScenario>(CRISIS_SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExecuteSimulation = () => {
    setIsSimulating(true);
    setSimulatedSuccess(false);

    setTimeout(() => {
      // Create batch of new simulated reports
      const generatedReports: CitizenReport[] = selectedScenario.sampleReports.map((text, idx) => ({
        id: `crisis-${selectedScenario.id}-${Date.now()}-${idx}`,
        token: `CRISIS-${selectedScenario.countryId.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        countryId: selectedScenario.countryId,
        regionId: selectedScenario.regionId,
        regionName: selectedScenario.location,
        citizenNameOrAnon: `Emergency Crisis Telemetry (Feed #${idx + 1})`,
        language: 'Local Dialect / English',
        languageCode: 'auto',
        originalText: text,
        englishTranslation: text,
        category: selectedScenario.category,
        urgencyScore: 10,
        severityLevel: 'Critical',
        status: 'Emergency Triage Active - Auto-Dispatched',
        timestamp: 'Just now (Simulated Crisis Feed)',
        estimatedAffectedPop: Math.floor(selectedScenario.affectedPop / selectedScenario.sampleReports.length),
        upvotes: 24,
        hasPhoto: true,
        channel: 'Emergency Satellite & WhatsApp Bot',
        keyIssues: ['Critical infrastructure failure', 'Public safety emergency', 'Immediate response required'],
        recommendedAction: selectedScenario.aiActionPlan
      }));

      if (onInjectReports) {
        onInjectReports(generatedReports);
      }

      setIsSimulating(false);
      setSimulatedSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1D38] rounded-3xl shadow-2xl border border-red-500/40 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-b border-red-500/30 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-xl text-red-400 shadow-inner animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  Live Crisis & Disaster Simulation Engine
                </h3>
                <span className="text-[10px] bg-red-500 text-slate-950 font-bold px-2 py-0.2 rounded-full uppercase">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs text-red-200/80">
                Demonstrate real-time AI triage, spatial re-clustering, and automated DPR dispatch live!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Crisis Disaster Scenario to Inject:
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CRISIS_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenario.id;
              return (
                <div
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenario(scen);
                    setSimulatedSuccess(false);
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-950/60 border-red-400 shadow-md ring-1 ring-red-400/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-red-300 font-mono">
                        {scen.incidentCount}+ Sudden Reports
                      </span>
                      <span className="text-slate-400">{scen.category}</span>
                    </div>
                    <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                      {scen.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Pop: {(scen.affectedPop / 1000).toFixed(1)}k</span>
                    <span className="text-red-400 font-semibold flex items-center gap-0.5">
                      Select <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Scenario Detailed Intel Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
                Active Scenario Parameters
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700 text-xs font-bold font-mono">
                {selectedScenario.severity}
              </span>
            </div>

            <h3 className="font-bold text-sm text-white">
              {selectedScenario.headline}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedScenario.description}
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs">
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
                Gemini Automated Countermeasure & DPR Directive:
              </div>
              <div className="text-slate-200 font-medium">
                {selectedScenario.aiActionPlan}
              </div>
              <div className="mt-2 text-cyan-300 font-mono text-[11px] font-bold">
                Recommended DPR: {selectedScenario.recommendedDPRTitle} (${selectedScenario.recommendedCapExUSD_M}M CapEx)
              </div>
            </div>
          </div>

          {/* Simulation Outcome Card */}
          {simulatedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Emergency Scenario Injected Successfully!
                  </h4>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    {selectedScenario.incidentCount}+ high-urgency reports logged. Live Hotspots re-clustered to Critical Priority.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (onNavigateToMap) {
                      onNavigateToMap(selectedScenario.regionId);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on GIS Map</span>
                </button>

                <button
                  onClick={() => {
                    if (onNavigateToDPRStudio) {
                      onNavigateToDPRStudio(
                        selectedScenario.recommendedDPRTitle,
                        selectedScenario.recommendedCapExUSD_M,
                        selectedScenario.category
                      );
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open AI DPR Studio</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Simulates dynamic real-time ingestion & spatial re-clustering
          </div>

          <button
            onClick={handleExecuteSimulation}
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-red-950/50 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Injecting Telemetry & Re-Clustering...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>Trigger Live Disaster Simulation</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
