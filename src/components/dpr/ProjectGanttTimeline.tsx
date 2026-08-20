import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  ChevronRight, 
  ArrowRight,
  Flag,
  FileCheck2,
  Cpu,
  Sparkles,
  Filter,
  BarChart3
} from 'lucide-react';

export interface MilestonePhase {
  id: string;
  name: string;
  category: 'Approval & Statutory' | 'Finance & Procurement' | 'Civil Engineering' | 'DPI & SCADA' | 'Commissioning & Handover';
  startMonth: number; // Month offset from project kickoff (0-based)
  durationMonths: number;
  progressPercent: number;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Critical Path';
  leadAuthority: string;
  budgetAllocatedM: number;
  keyDeliverables: string[];
  riskFactor: 'Low' | 'Medium' | 'High';
  dependencies?: string[];
}

interface ProjectGanttTimelineProps {
  projectTitle: string;
  sector: string;
  totalBudgetM: number;
  targetYear: number;
  countryName: string;
  regionName: string;
}

export const ProjectGanttTimeline: React.FC<ProjectGanttTimelineProps> = ({
  projectTitle,
  sector,
  totalBudgetM,
  targetYear,
  countryName,
  regionName,
}) => {
  // Calculate total months based on target year (Kickoff in 2026)
  const kickoffYear = 2026;
  const totalProjectMonths = Math.max(12, (targetYear - kickoffYear + 1) * 12);
  const quartersCount = totalProjectMonths / 3;

  // Selected Milestone for detail drawer
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('PHASE-1');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Milestone phases tailored dynamically to budget & sector
  const phases: MilestonePhase[] = [
    {
      id: 'PHASE-1',
      name: 'Statutory, Environmental (EIA) & Land Approvals',
      category: 'Approval & Statutory',
      startMonth: 0,
      durationMonths: Math.round(totalProjectMonths * 0.15),
      progressPercent: 100,
      status: 'Completed',
      leadAuthority: 'Ministry of Environment & Sovereign Land Board',
      budgetAllocatedM: parseFloat((totalBudgetM * 0.05).toFixed(2)),
      keyDeliverables: [
        'Comprehensive Environmental Impact Assessment (EIA)',
        'Free, Prior and Informed Citizen Consent (Gram Panchayat Protocol)',
        'Right of Way (RoW) & Hydrogeological Topography Survey',
      ],
      riskFactor: 'Low',
    },
    {
      id: 'PHASE-2',
      name: 'NDB Multilateral Co-Financing & EPC Tender Award',
      category: 'Finance & Procurement',
      startMonth: Math.round(totalProjectMonths * 0.12),
      durationMonths: Math.round(totalProjectMonths * 0.18),
      progressPercent: 85,
      status: 'In Progress',
      leadAuthority: 'New Development Bank (NDB) & Treasury Bureau',
      budgetAllocatedM: parseFloat((totalBudgetM * 0.08).toFixed(2)),
      keyDeliverables: [
        'Sovereign Green Bond Issuance & NDB Grant Tranche Disbursement',
        'Competitive International Bidding (ICB) Tender Release',
        'EPC Contractor Selection & Performance Guarantee Escrow',
      ],
      riskFactor: 'Medium',
      dependencies: ['PHASE-1'],
    },
    {
      id: 'PHASE-3',
      name: 'Core Civil Works & Substation / Plant Erection',
      category: 'Civil Engineering',
      startMonth: Math.round(totalProjectMonths * 0.28),
      durationMonths: Math.round(totalProjectMonths * 0.40),
      progressPercent: 35,
      status: 'In Progress',
      leadAuthority: 'National Public Works Corporation & Prime EPC Contractor',
      budgetAllocatedM: parseFloat((totalBudgetM * 0.55).toFixed(2)),
      keyDeliverables: [
        'Groundwater Filtration Nanomembrane / Solar Microgrid Inverter Fabrication',
        'Trunk Pipeline & High-Voltage Feeder Cable Trenching',
        'Decentralized Water Purification Kiosks / Battery Storage Bunkers',
      ],
      riskFactor: 'High',
      dependencies: ['PHASE-2'],
    },
    {
      id: 'PHASE-4',
      name: 'Open DPI Protocols, MOSIP Kiosks & IoT Telemetry Network',
      category: 'DPI & SCADA',
      startMonth: Math.round(totalProjectMonths * 0.55),
      durationMonths: Math.round(totalProjectMonths * 0.25),
      progressPercent: 10,
      status: 'Upcoming',
      leadAuthority: 'National Informatics Centre & Digital Public Goods Alliance',
      budgetAllocatedM: parseFloat((totalBudgetM * 0.18).toFixed(2)),
      keyDeliverables: [
        'MOSIP-integrated biometric identity access cards for free citizen water quota',
        'Real-time Arsenic/Fluoride/PPM Water Quality SCADA Probes',
        'OpenG2P Automated Maintenance Escrow Micro-Settlement Rail',
      ],
      riskFactor: 'Medium',
      dependencies: ['PHASE-3'],
    },
    {
      id: 'PHASE-5',
      name: 'Pilot Testing, Independent Social Audit & Community Handover',
      category: 'Commissioning & Handover',
      startMonth: Math.round(totalProjectMonths * 0.78),
      durationMonths: Math.round(totalProjectMonths * 0.22),
      progressPercent: 0,
      status: 'Upcoming',
      leadAuthority: 'Joint BRICS Municipal Authority & Village Water Committee',
      budgetAllocatedM: parseFloat((totalBudgetM * 0.14).toFixed(2)),
      keyDeliverables: [
        '90-Day Full Load Trial Run with Zero Unscheduled Downtime',
        'Participatory Public Social Audit with Ward Representatives',
        'Formal Handover of Operations & Maintenance (O&M) to Local Cooperative',
      ],
      riskFactor: 'Low',
      dependencies: ['PHASE-4'],
    },
  ];

  const filteredPhases = activeFilter === 'all'
    ? phases
    : activeFilter === 'critical'
    ? phases.filter((p) => p.status === 'In Progress' || p.riskFactor === 'High')
    : phases.filter((p) => p.category.toLowerCase().includes(activeFilter.toLowerCase()));

  const selectedPhase = phases.find((p) => p.id === selectedMilestoneId) || phases[0];

  // Helper for Gantt bar color by category
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Approval & Statutory':
        return { bar: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20' };
      case 'Finance & Procurement':
        return { bar: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40', badge: 'bg-amber-500/20' };
      case 'Civil Engineering':
        return { bar: 'bg-sky-500', text: 'text-sky-400', border: 'border-sky-500/40', badge: 'bg-sky-500/20' };
      case 'DPI & SCADA':
        return { bar: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/40', badge: 'bg-purple-500/20' };
      default:
        return { bar: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/40', badge: 'bg-indigo-500/20' };
    }
  };

  // Generate Year/Quarter Labels for Header
  const quarterLabels: string[] = [];
  for (let y = kickoffYear; y <= targetYear; y++) {
    for (let q = 1; q <= 4; q++) {
      quarterLabels.push(`Q${q} ${y}`);
    }
  }

  return (
    <div className="bg-[#1E293B]/95 border border-[#1E3A8A] rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Gantt Project Execution & Approval Gateways
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              Horizon: {kickoffYear} → {targetYear} ({totalProjectMonths} Months)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Lifecycle Milestone Gantt: {projectTitle}
          </h3>
          <p className="text-xs text-[#CBD5E1]">
            Multi-stage approval gates, statutory environmental clearances, procurement tenders, and Open DPI rollout milestones.
          </p>
        </div>

        {/* View Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0A192F] p-1.5 rounded-xl border border-[#334155]">
          {[
            { id: 'all', label: 'All 5 Phases' },
            { id: 'critical', label: 'Critical Path & In-Flight' },
            { id: 'statutory', label: 'Approvals' },
            { id: 'civil', label: 'Civil Works' },
            { id: 'dpi', label: 'DPI & SCADA' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Interactive Canvas Grid */}
      <div className="bg-[#0A192F] rounded-2xl border border-[#334155] p-4 sm:p-5 overflow-x-auto">
        <div className="min-w-[700px] space-y-4">
          
          {/* Gantt Header Columns (Quarters) */}
          <div className="grid grid-cols-12 gap-2 text-center text-[11px] font-mono text-[#94A3B8] border-b border-[#334155] pb-2 font-semibold">
            <div className="col-span-4 text-left pl-2">Project Phase & Deliverables</div>
            <div className="col-span-8 grid grid-cols-8 gap-1 text-center">
              {quarterLabels.slice(0, 8).map((q, idx) => (
                <div key={idx} className="bg-[#1E293B]/60 py-1 rounded border border-[#334155]/40 text-[10px]">
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Phase Rows */}
          <div className="space-y-3">
            {filteredPhases.map((phase) => {
              const isSelected = selectedMilestoneId === phase.id;
              const theme = getCategoryTheme(phase.category);
              
              // Calculate percentage offset and width relative to totalProjectMonths
              const leftPercent = Math.min(85, Math.max(0, (phase.startMonth / totalProjectMonths) * 100));
              const widthPercent = Math.min(100 - leftPercent, Math.max(15, (phase.durationMonths / totalProjectMonths) * 100));

              return (
                <div
                  key={phase.id}
                  onClick={() => setSelectedMilestoneId(phase.id)}
                  className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A192F] border-amber-500/80 shadow-lg'
                      : 'bg-[#2f1f15] border-[#334155]/60 hover:border-[#2563EB]'
                  }`}
                >
                  {/* Left Phase Info (4 cols) */}
                  <div className="col-span-4 pr-2 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${theme.bar}`} />
                      <span className="text-xs font-bold text-white truncate">
                        {phase.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                      <span className={`${theme.badge} ${theme.text} px-1.5 py-0.5 rounded font-semibold`}>
                        {phase.category}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">${phase.budgetAllocatedM}M</span>
                    </div>
                  </div>

                  {/* Right Gantt Bar (8 cols) */}
                  <div className="col-span-8 relative h-10 bg-[#1e130c] rounded-xl border border-[#334155]/40 p-1 flex items-center">
                    
                    {/* Vertical Quarter Guideline Grid */}
                    <div className="absolute inset-0 grid grid-cols-8 pointer-events-none opacity-20">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="border-r border-[#1E3A8A]" />
                      ))}
                    </div>

                    {/* Horizontal Task Span Bar */}
                    <div
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                      className={`absolute h-7 rounded-lg ${theme.bar} shadow-md transition-all flex items-center justify-between px-2 text-white text-[10px] font-bold overflow-hidden`}
                    >
                      <span className="truncate pr-1 drop-shadow">
                        {phase.durationMonths} Mos
                      </span>

                      <span className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-[9px] shrink-0">
                        {phase.progressPercent}%
                      </span>
                    </div>

                    {/* Milestone Pin Icon at completion point */}
                    <div
                      style={{
                        left: `${Math.min(96, leftPercent + widthPercent)}%`,
                      }}
                      className="absolute -translate-x-1/2 z-10"
                    >
                      {phase.progressPercent === 100 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 drop-shadow" />
                      ) : phase.progressPercent > 0 ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-amber-400/50 animate-pulse" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Selected Milestone Inspector Card */}
      <div className="bg-gradient-to-br from-[#0A192F] to-[#0A192F] border border-[#1E3A8A] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                Milestone Gateway Details ({selectedPhase.id})
              </span>
              <h4 className="text-base font-bold text-white leading-tight">
                {selectedPhase.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              selectedPhase.status === 'Completed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : selectedPhase.status === 'In Progress'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-[#0A192F] text-[#94A3B8] border border-[#334155]'
            }`}>
              {selectedPhase.status} ({selectedPhase.progressPercent}%)
            </span>
          </div>
        </div>

        {/* Phase Meta Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#0A192F] p-3 rounded-xl border border-[#334155] space-y-1">
            <div className="text-[10px] text-[#94A3B8] font-medium uppercase">Lead Implementing Agency:</div>
            <div className="font-bold text-white">{selectedPhase.leadAuthority}</div>
          </div>

          <div className="bg-[#0A192F] p-3 rounded-xl border border-[#334155] space-y-1">
            <div className="text-[10px] text-[#94A3B8] font-medium uppercase">CapEx Envelope for Phase:</div>
            <div className="font-bold text-emerald-400 font-mono text-sm">
              ${selectedPhase.budgetAllocatedM}M USD ({((selectedPhase.budgetAllocatedM / totalBudgetM) * 100).toFixed(0)}% of total)
            </div>
          </div>

          <div className="bg-[#0A192F] p-3 rounded-xl border border-[#334155] space-y-1">
            <div className="text-[10px] text-[#94A3B8] font-medium uppercase">Implementation Duration:</div>
            <div className="font-bold text-sky-300 font-mono text-sm">
              {selectedPhase.durationMonths} Months ({`M+${selectedPhase.startMonth} to M+${selectedPhase.startMonth + selectedPhase.durationMonths}`})
            </div>
          </div>
        </div>

        {/* Key Deliverables Checklist */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-[#CBD5E1] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Key Milestone Deliverables & Gate Verification Criteria:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {selectedPhase.keyDeliverables.map((deliv, i) => (
              <div
                key={i}
                className="bg-[#0A192F] p-3 rounded-xl border border-[#334155] text-xs text-[#F8FAFC] flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                  {i + 1}
                </span>
                <span className="leading-snug">{deliv}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
