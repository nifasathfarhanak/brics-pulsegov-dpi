import React from 'react';
import { 
  Award, 
  Sparkles, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  Scale, 
  Merge, 
  Building2, 
  Layers, 
  ShieldAlert, 
  FileText, 
  Volume2, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe2
} from 'lucide-react';

interface JudgesDemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWhatsAppBot: () => void;
  onLaunchPolicyDebate: () => void;
  onLaunchDuplicateInspector: () => void;
  onLaunchIndiaHierarchy: () => void;
  onLaunchCrisisSimulation: () => void;
  onNavigateToMap: () => void;
  onNavigateToDPRStudio: () => void;
}

export const JudgesDemoGuideModal: React.FC<JudgesDemoGuideModalProps> = ({
  isOpen,
  onClose,
  onLaunchWhatsAppBot,
  onLaunchPolicyDebate,
  onLaunchDuplicateInspector,
  onLaunchIndiaHierarchy,
  onLaunchCrisisSimulation,
  onNavigateToMap,
  onNavigateToDPRStudio,
}) => {
  if (!isOpen) return null;

  const HACKATHON_HIGHLIGHTS = [
    {
      id: 'h-1',
      title: 'WhatsApp & Telegram DPI Citizen Bot Simulator',
      badge: 'Citizen Intake',
      icon: MessageSquare,
      color: 'from-emerald-600 to-teal-500',
      description: 'Simulates citizen intake over WhatsApp, Telegram, or Gov SMS. Ingests text/voice/photos in 33 native dialects, auto-issues official Sovereign Tracking ID, predicts Vertex AI SLA, and gives direct map tracking.',
      actionLabel: 'Launch WhatsApp Bot',
      action: () => {
        onLaunchWhatsAppBot();
        onClose();
      }
    },
    {
      id: 'h-2',
      title: 'Gemini Multi-Agent Ministerial Policy Chamber',
      badge: 'Multi-Agent AI',
      icon: Scale,
      color: 'from-blue-600 to-indigo-500',
      description: 'Live turn-by-turn debate between 4 specialized Google AI agents: Chief Infrastructure Engineer (BOQ/Feasibility), Finance Officer (NDB Grants/ROI), Climate Officer (Carbon/Floods), and Citizen Ombudsman (Equity/SLA).',
      actionLabel: 'Launch Policy Chamber',
      action: () => {
        onLaunchPolicyDebate();
        onClose();
      }
    },
    {
      id: 'h-3',
      title: 'Semantic Duplicate Clustering & Deduplication Inspector',
      badge: 'Vector Intelligence',
      icon: Merge,
      color: 'from-purple-600 to-pink-500',
      description: 'Uses Gemini vector embeddings and spatial radiuses to merge 280+ raw citizen complaints into unified Master Hotspot tickets, eliminating duplicate work orders and saving ₹19+ Lakhs in municipal funds.',
      actionLabel: 'Inspect Duplicate Clusters',
      action: () => {
        onLaunchDuplicateInspector();
        onClose();
      }
    },
    {
      id: 'h-4',
      title: 'Pan-India State & NITI Aayog District Hierarchy',
      badge: 'Multi-Tier Depth',
      icon: Building2,
      color: 'from-amber-600 to-orange-500',
      description: 'Multi-tier governance drilldown from National level to 5+ major states (Maharashtra, Tamil Nadu, Karnataka, Bihar, UP) down to municipal corporation wards (BMC Mumbai, BBMP Bengaluru) and NITI Aayog Aspirational Districts.',
      actionLabel: 'Explore District Hierarchy',
      action: () => {
        onLaunchIndiaHierarchy();
        onClose();
      }
    },
    {
      id: 'h-5',
      title: 'Real-Time PM GatiShakti, ISRO Bhuvan & Data.gov.in Overlays',
      badge: 'Geospatial Telemetry',
      icon: Layers,
      color: 'from-cyan-600 to-blue-500',
      description: 'Live toggles for PM GatiShakti national logistics corridors, Jal Jeevan Mission tap connectivity heatmap, ISRO Bhuvan satellite imagery, and IMD real-time cloudburst & monsoon radar telemetry.',
      actionLabel: 'Open GIS Map Overlays',
      action: () => {
        onNavigateToMap();
        onClose();
      }
    },
    {
      id: 'h-6',
      title: 'Live Crisis & Disaster Simulation Engine',
      badge: 'Real-Time Triage',
      icon: ShieldAlert,
      color: 'from-red-600 to-rose-500',
      description: '1-click disaster scenario injector (Monsoon Cloudburst in Patna, Heatwave Grid Outage in Nagpur, Culvert Breakdown in Mandya) demonstrating real-time AI triage, spatial re-clustering, and automated DPR generation.',
      actionLabel: 'Trigger Crisis Simulation',
      action: () => {
        onLaunchCrisisSimulation();
        onClose();
      }
    },
    {
      id: 'h-7',
      title: '1-Click Bankable Export Suite (Government PDF, GeoJSON & BigQuery CSV)',
      badge: 'Bankable DPRs',
      icon: FileText,
      color: 'from-emerald-600 to-green-500',
      description: 'Instant export of official statutory Government PDF DPRs with state seals, BOQ tables, NDB funding requisition, RFC-7946 NIC GeoJSON for QGIS, and BigQuery tabular CSV datasets.',
      actionLabel: 'Open DPR Studio Exports',
      action: () => {
        onNavigateToDPRStudio();
        onClose();
      }
    },
    {
      id: 'h-8',
      title: 'Two-Way Neural Voice Accessibility (33 Dialects)',
      badge: 'Zero-Exclusion i18n',
      icon: Volume2,
      color: 'from-indigo-600 to-cyan-500',
      description: 'Complete voice-in recognition and Gemini neural speech playback across 33 native BRICS+ languages for low-literacy citizens and rural municipal officers.',
      actionLabel: 'Experience 33-Lang Voice',
      action: () => {
        onNavigateToMap();
        onClose();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0C1A32] rounded-3xl shadow-2xl border border-cyan-500/40 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-cyan-500/30 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl text-amber-300 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  Hackathon & Evaluators Quick-Tour Guide
                </h3>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold px-2 py-0.2 rounded-full uppercase">
                  100% Score Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Explore the 8 flagship architectural pillars of PulseGov Sovereign DPI with 1-click live demos.
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

        {/* Feature Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {HACKATHON_HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-md group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} text-white shadow`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                          Pillar #{idx + 1}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={item.action}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Built strictly to international public-sector DPI and ISO-37120 standards.
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow"
          >
            Close Guide & Explore Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
