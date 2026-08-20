import React, { useState } from 'react';
import { DemandHotspot, BRICSCountryId, InfrastructureSector, RegionData } from '../types';
import { BRICS_COUNTRIES, REGIONS_DATA } from '../data/bricsData';
import { 
  TrendingUp, 
  Flame, 
  FileText, 
  DollarSign, 
  Users, 
  Sparkles, 
  Filter, 
  Droplets, 
  Zap, 
  Truck, 
  HeartPulse, 
  Wifi, 
  GraduationCap, 
  Sprout, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

interface HotspotsViewProps {
  hotspots: DemandHotspot[];
  selectedCountry: BRICSCountryId | 'all';
  setSelectedCountry: (c: BRICSCountryId | 'all') => void;
  onGenerateDPR: (hotspot: DemandHotspot) => void;
  onOpenBudgetSimulator: (region: RegionData) => void;
}

export const HotspotsView: React.FC<HotspotsViewProps> = ({
  hotspots,
  selectedCountry,
  setSelectedCountry,
  onGenerateDPR,
  onOpenBudgetSimulator,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'budget' | 'beneficiaries' | 'demand'>('priority');

  const filteredHotspots = hotspots.filter((h) => {
    if (selectedCountry !== 'all' && h.countryId !== selectedCountry) return false;
    if (selectedSector !== 'all' && h.sector !== selectedSector) return false;
    return true;
  });

  const sortedHotspots = [...filteredHotspots].sort((a, b) => {
    if (sortBy === 'priority') return (b.priorityScore ?? 0) - (a.priorityScore ?? 0);
    if (sortBy === 'budget') return b.estimatedBudgetM - a.estimatedBudgetM;
    if (sortBy === 'beneficiaries') return b.estimatedBeneficiaries - a.estimatedBeneficiaries;
    if (sortBy === 'demand') return (Number(b.demandIntensity) || 0) - (Number(a.demandIntensity) || 0);
    return 0;
  });

  const getSectorIcon = (sector: InfrastructureSector) => {
    switch (sector) {
      case 'Water & Sanitation': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Energy & Microgrids': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Transport & Connectivity': return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'Health Infrastructure': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'Digital Public Infrastructure': return <Wifi className="w-4 h-4 text-sky-400" />;
      case 'Education & Sanitation': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Agricultural & Irrigation': return <Sprout className="w-4 h-4 text-lime-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Scoring Engine Methodology Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                Predictive AI Prioritization Engine
              </span>
              <span className="text-xs font-mono text-slate-400">Model: Gemini 3.7 + Multi-Variable Econometric Weights</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Algorithmic Development Priority Ranking across BRICS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
              Synthesizing fragmented citizen voices with national census vulnerability, infrastructure deficits, and fiscal ROI models to prevent misallocated public spending.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">
              Priority Formula Weights:
            </div>
            <div className="text-[11px] text-slate-400">
              Demand (25%) + Vulnerability (25%) + Infra Deficit (25%) + ROI (15%) + ESG (10%)
            </div>
          </div>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Country Selector */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCountry('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCountry === 'all'
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All BRICS ({hotspots.length})
            </button>
            {BRICS_COUNTRIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
                  selectedCountry === c.id
                    ? 'bg-slate-100 text-slate-900 font-semibold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="priority">🔥 Highest Priority Score</option>
              <option value="demand">🗣️ Citizen Demand Volume</option>
              <option value="beneficiaries">👥 Max Beneficiaries</option>
              <option value="budget">💰 Capital Envelope ($M)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ranked Hotspots List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedHotspots.map((hotspot, index) => {
          const country = BRICS_COUNTRIES.find((c) => c.id === hotspot.countryId);
          const regionObj = REGIONS_DATA.find((r) => r.id === hotspot.regionId);

          return (
            <div
              key={hotspot.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition-all"
            >
              {/* Card Top: Rank Badge, Title, Sector */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-slate-700 shrink-0">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                        {hotspot.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{country?.flag} {hotspot.regionName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Score Meter */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-mono font-black text-amber-400">
                      {hotspot.priorityScore.toFixed(1)}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500">
                      Priority Index
                    </div>
                  </div>
                </div>

                {/* Summary Description */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {hotspot.summary}
                </p>

                {/* Indicator Metric Breakdown Bar */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Citizen Demand</div>
                    <div className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">
                      {hotspot.demandIntensity.toLocaleString()} voices
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Estimated CapEx</div>
                    <div className="text-xs sm:text-sm font-bold text-sky-300 mt-0.5">
                      ${hotspot.estimatedBudgetM}M USD
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Socio-Econ ROI</div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">
                      {hotspot.roiMultiplier}x Multiplier
                    </div>
                  </div>
                </div>

                {/* Digital Public Good (DPG) Architectural Recommendation */}
                <div className="bg-sky-950/20 border border-sky-800/40 rounded-xl p-2.5 text-xs text-sky-200">
                  <span className="font-semibold text-sky-400 block mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommended Digital Public Infrastructure (DPI) Rail:
                  </span>
                  <p>{hotspot.dpiRecommendation}</p>
                </div>

                {/* SDG Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {hotspot.unSdgs.map((sdg, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => regionObj && onOpenBudgetSimulator(regionObj)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulate Budget</span>
                </button>

                <button
                  id={`hotspot-btn-generate-dpr-${hotspot.id}`}
                  onClick={() => onGenerateDPR(hotspot)}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Synthesize AI DPR</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
