import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  Sprout, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  ChevronRight, 
  Users, 
  Flame, 
  Activity, 
  Globe2, 
  Bot, 
  Volume2, 
  VolumeX, 
  Layers,
  Scale,
  Award,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface PolicyDebateTopic {
  id: string;
  title: string;
  location: string;
  country: string;
  budgetEstM: number;
  sector: string;
  problemStatement: string;
}

const PRESET_TOPICS: PolicyDebateTopic[] = [
  {
    id: 'topic-1',
    title: '₹45 Cr Urban Stormwater & Drainage Overhaul in Flood-Prone Wards',
    location: 'Patna & Flood Plains',
    country: 'India',
    budgetEstM: 5.4,
    sector: 'Water & Sanitation',
    problemStatement: 'Severe monsoon waterlogging inundates 400 hectares every year, contaminating drinking borewells and disabling primary healthcare transit.'
  },
  {
    id: 'topic-2',
    title: 'Solar Microgrids & Cold-Chain Battery Storage for 18 Rural Primary Health Centers',
    location: 'Mandya & Mysore Rural',
    country: 'India',
    budgetEstM: 2.8,
    sector: 'Energy & Microgrids',
    problemStatement: 'Frequent 8-hour grid brownouts cause vaccine spoilage and disrupt emergency maternity deliveries in isolated rural clinics.'
  },
  {
    id: 'topic-3',
    title: 'High-Velocity All-Weather Culvert & Bridge Reconstruction for 32 Agrarian Villages',
    location: 'Bahia State River Basin',
    country: 'Brazil',
    budgetEstM: 7.2,
    sector: 'Transport & Connectivity',
    problemStatement: 'Flash flood torrents destroy wooden river bridges each harvest season, cutting off 12,000 farmers from regional commodity markets.'
  },
  {
    id: 'topic-4',
    title: 'Zero-Carbon Desalination & Solar Water Pipeline for Coastal Arid Corridor',
    location: 'Red Sea & UAE-Saudi Coastal Zone',
    country: 'UAE / Saudi Arabia',
    budgetEstM: 14.5,
    sector: 'Water & Sanitation',
    problemStatement: 'Rapid aquifer depletion requires sustainable solar-powered reverse osmosis desalination with zero groundwater brine pollution.'
  }
];

interface DebateSpeech {
  agentId: 'engineer' | 'finance' | 'climate' | 'ombudsman';
  agentName: string;
  agentTitle: string;
  avatar: string;
  badgeColor: string;
  role: string;
  statement: string;
  sentiment: 'favorable' | 'conditional' | 'opposed' | 'amendment';
  keyRecommendation: string;
  metricHighlight: string;
}

interface MinisterialPolicyDebateProps {
  initialComplaint?: any;
  onApproveFunding?: (summary: string, budgetM: number) => void;
  onClose?: () => void;
}

export const MinisterialPolicyDebate: React.FC<MinisterialPolicyDebateProps> = ({
  initialComplaint,
  onApproveFunding,
  onClose,
}) => {
  const { speak, isSpeaking } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<PolicyDebateTopic>(PRESET_TOPICS[0]);
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [consensusScore, setConsensusScore] = useState<number>(88);
  const [accordGenerated, setAccordGenerated] = useState<boolean>(false);

  // 4 Specialized Ministerial Debate Speeches per topic
  const getDebateScript = (topic: PolicyDebateTopic): DebateSpeech[] => [
    {
      agentId: 'engineer',
      agentName: 'Er. Rajeshwar Rao',
      agentTitle: 'Chief Infrastructure Engineer',
      avatar: '👷‍♂️',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-600',
      role: 'Structural Feasibility & BOQ Audit',
      statement: `From an engineering standpoint, this intervention is structurally urgent. Soil liquefaction and subgrade erosion are increasing structural failure rates by 34% per quarter. We recommend prefabricated reinforced polymer box-culverts and geotextile sub-base reinforcement. This will cut construction duration by 40% and guarantee a 35-year design lifespan with zero routine foundation maintenance.`,
      sentiment: 'favorable',
      keyRecommendation: 'Fast-track prefabricated modular components; mandate geotextile subgrade reinforcement.',
      metricHighlight: '35-Year Lifespan Guarantee • 40% Faster Deployment'
    },
    {
      agentId: 'finance',
      agentName: 'Amina Al-Mansoor',
      agentTitle: 'Sovereign Budget & NDB Finance Officer',
      avatar: '💰',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-600',
      role: 'Fiscal Viability & NDB Match Funding',
      statement: `The requested CapEx of $${topic.budgetEstM}M can be optimized. By structuring this as a 60% New Development Bank (NDB) Green Infrastructure Grant and 40% State Municipal Bond, we will avoid local fiscal deficit spikes. The projected economic multiplier is 2.84x within 36 months through reduced disaster repair expenditures and enhanced trade transit volume.`,
      sentiment: 'conditional',
      keyRecommendation: 'Blend 60% NDB sovereign concession grant with municipal revenue bonds.',
      metricHighlight: '2.84x Economic Multiplier • Zero Deficit Strain'
    },
    {
      agentId: 'climate',
      agentName: 'Dr. Elena Ivanova',
      agentTitle: 'Environmental & Climate Resilience Lead',
      avatar: '🌿',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-600',
      role: 'Carbon Offset & Ecological Risk Index',
      statement: `We must ensure this project achieves net-positive ecological resilience. I propose integrating decentralized bioswales, solar micro-pumping, and permeable pavements. This reduces peak runoff velocity by 65%, eliminates stagnant disease vectors, and offsets approximately 1,200 metric tonnes of CO₂ equivalent annually, fulfilling UN SDG-6, SDG-11, and SDG-13.`,
      sentiment: 'favorable',
      keyRecommendation: 'Incorporate solar micro-pumps & permeable bioswales for climate resilience.',
      metricHighlight: '65% Runoff Mitigation • 1,200 T/Yr CO₂ Offset'
    },
    {
      agentId: 'ombudsman',
      agentName: 'Devi Prasad',
      agentTitle: 'Citizen Ombudsman & DPI Commissioner',
      avatar: '⚖️',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-600',
      role: 'Social Equity & Citizen Grievance SLA',
      statement: `Over 280 verified citizen grievances have been lodged from this specific catchment area in the last 90 days. Low-income and marginalized households suffer 80% of the indirect health costs when this infrastructure fails. We demand 100% public OpenG2P contractor telemetry, transparent escrow milestones, and a strict 7-day citizen redressal SLA during the construction phase.`,
      sentiment: 'amendment',
      keyRecommendation: 'Enforce public escrow milestone tracking and mandatory 7-day citizen feedback loop.',
      metricHighlight: '280+ Resolved Grievances • 100% Transparent Telemetry'
    }
  ];

  const currentSpeeches = getDebateScript(selectedTopic);

  const startDebateSimulation = () => {
    setIsDebating(true);
    setActiveStep(1);
    setAccordGenerated(false);

    // Turn by turn progression
    setTimeout(() => setActiveStep(2), 2000);
    setTimeout(() => setActiveStep(3), 4000);
    setTimeout(() => setActiveStep(4), 6000);
    setTimeout(() => {
      setIsDebating(false);
      setAccordGenerated(true);
    }, 7500);
  };

  const handleDownloadAccord = () => {
    const accordText = `
================================================================================
MINISTERIAL POLICY ACCORD & SANCTION DIRECTIVE
BRICS+ & SOVEREIGN DIGITAL PUBLIC INFRASTRUCTURE (DPI) COUNCIL
================================================================================
PROJECT TITLE: ${selectedTopic.title}
LOCATION: ${selectedTopic.location}, ${selectedTopic.country}
SANCTIONED CAPEX: $${selectedTopic.budgetEstM}M USD (Approx ₹${(selectedTopic.budgetEstM * 8.3).toFixed(1)} Cr)
SECTOR: ${selectedTopic.sector}
DATE OF ACCORD: ${new Date().toLocaleDateString()} | STATUS: UNANIMOUSLY APPROVED (94% CONSENSUS)
================================================================================

1. EXECUTIVE SUMMARY & STRATEGIC MANDATE:
The Multi-Agent Ministerial Policy Chamber has concluded statutory deliberation on 
${selectedTopic.title}. The project addresses acute citizen grievances and 
infrastructure deficits.

2. MULTI-AGENT RESOLUTIONS:
- CHIEF INFRASTRUCTURE ENGINEER: Approved with mandatory prefabricated polymer culverts 
  and subgrade geotextile membranes. 35-year design lifespan guaranteed.
- FISCAL PLANNING & NDB OFFICER: Approved via 60% New Development Bank (NDB) Concession 
  Green Grant and 40% Municipal Bond. Projected 2.84x economic multiplier.
- CLIMATE & ECOLOGICAL OFFICER: Approved with integrated permeable bioswales and 
  solar pumping, mitigating 65% peak flood runoff and offsetting 1,200 T/Yr CO₂.
- CITIZEN OMBUDSMAN & DPI COMMISSIONER: Approved with open contractor telemetry, 
  milestone escrow settlement, and a strict 7-day grievance resolution SLA.

3. STATUTORY APPROVAL & ESCROW SIGNATURES:
[X] Ministry of Public Works & Transport
[X] New Development Bank (NDB) Infrastructure Directorate
[X] Sovereign Climate Adaptation Board
[X] National Digital Public Infrastructure (DPI) Registry

TRACKING CODE: BRICS-MIN-ACCORD-${selectedTopic.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}
================================================================================
    `;

    const blob = new Blob([accordText.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ministerial_Accord_${selectedTopic.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#0C1A32] rounded-3xl border border-slate-700/80 p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-950 border border-blue-600/50 text-cyan-400">
              <Scale className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Gemini Multi-Agent System
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Multi-Agent Ministerial Policy Chamber
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Simulate live, turn-by-turn policy debates between 4 specialized Google AI Ministerial Agents to evaluate structural feasibility, fiscal viability, climate resilience, and citizen equity.
          </p>
        </div>

        {/* Start Debate CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={startDebateSimulation}
            disabled={isDebating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-cyan-950/50 disabled:opacity-50"
          >
            {isDebating ? (
              <>
                <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                <span>Chamber In Session...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-slate-950 fill-current" />
                <span>Launch Ministerial Debate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Topic Selector Tabs */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Infrastructure Proposal to Debate:
          </span>
          <span className="text-xs text-blue-400 font-mono">
            {PRESET_TOPICS.length} Sovereign Directives Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopic.id;
            return (
              <div
                key={topic.id}
                onClick={() => {
                  if (!isDebating) {
                    setSelectedTopic(topic);
                    setActiveStep(0);
                    setAccordGenerated(false);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/80 border-cyan-400/80 shadow-md ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-semibold font-mono">
                      ${topic.budgetEstM}M CapEx
                    </span>
                    <span className="text-slate-400">{topic.country}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                    {topic.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate">{topic.sector}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                    Select <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Proposal Overview Card */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-cyan-300">Active Debate Proposal:</span>
            <span>{selectedTopic.location} • {selectedTopic.country}</span>
          </div>
          <h3 className="font-bold text-base text-white">
            {selectedTopic.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            {selectedTopic.problemStatement}
          </p>
        </div>

        {/* Consensus Meter */}
        <div className="p-3 rounded-xl bg-black/40 border border-slate-700/80 flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Consensus Level
            </div>
            <div className="text-lg font-extrabold text-cyan-300 font-mono">
              {consensusScore}% Approved
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center font-bold text-xs text-cyan-300 shadow">
            4/4 OK
          </div>
        </div>
      </div>

      {/* 4 Specialized AI Agents Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentSpeeches.map((speech, index) => {
          const isRevealed = activeStep >= index + 1 || activeStep === 0;
          return (
            <div
              key={speech.agentId}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isRevealed
                  ? 'bg-slate-900/95 border-slate-700/80 shadow-lg'
                  : 'bg-slate-900/30 border-slate-800/40 opacity-40'
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow">
                      {speech.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{speech.agentName}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${speech.badgeColor}`}>
                          {speech.agentTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{speech.role}</p>
                    </div>
                  </div>

                  {/* Speech Audio Button */}
                  <button
                    onClick={() => speak(speech.statement, 'en')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
                    title="Listen to Agent Speech"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Speech Body */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed min-h-[90px]">
                  {isRevealed ? (
                    speech.statement
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 py-6">
                      <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Preparing ministerial statement...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Bottom Recommendation & Key Metric */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-1.5 text-xs">
                <div className="flex items-start gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 font-medium">
                    <strong className="text-white">Proviso:</strong> {speech.keyRecommendation}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono bg-blue-950/40 px-2 py-1 rounded-md border border-blue-800/40">
                  <span>Impact Metric:</span>
                  <span className="font-bold">{speech.metricHighlight}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accord Sanction Document Banner (Upon Completion) */}
      {(accordGenerated || activeStep === 0) && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-blue-950/80 to-slate-900 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-400/60 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-white">
                  Ministerial Policy Accord Sanctioned (94% Consensus)
                </h4>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.2 rounded-full">
                  UNANIMOUS
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                All 4 ministerial portfolios have ratified the CapEx grant structure, engineering BOQ, and citizen audit metrics.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadAccord}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Statutory Accord</span>
          </button>
        </div>
      )}

    </div>
  );
};
