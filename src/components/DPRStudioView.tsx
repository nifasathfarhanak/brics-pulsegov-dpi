import React, { useState, useEffect } from 'react';
import { DemandHotspot, BRICSCountryId, InfrastructureSector } from '../types';
import { BRICS_COUNTRIES, DEMAND_HOTSPOTS, REGIONS_DATA } from '../data/bricsData';
import { ProjectGanttTimeline } from './dpr/ProjectGanttTimeline';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Building2, 
  Globe2,
  Cpu,
  Coins,
  Calendar,
  Layers,
  PieChart,
  DollarSign,
  Bot,
  Network,
  ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DPRStudioViewProps {
  initialHotspot?: DemandHotspot | null;
  selectedCountry: BRICSCountryId | 'all';
}

export const DPRStudioView: React.FC<DPRStudioViewProps> = ({
  initialHotspot,
  selectedCountry,
}) => {
  const defaultHotspot = initialHotspot || DEMAND_HOTSPOTS[0];
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(defaultHotspot.id);
  const [budgetSlider, setBudgetSlider] = useState<number>(defaultHotspot.estimatedBudgetM || 25);
  const [targetYear, setTargetYear] = useState<number>(2028);
  const [activeViewTab, setActiveViewTab] = useState<'gantt' | 'document' | 'cross-border'>('gantt');
  
  // Selected DPI blocks for proposal
  const [selectedDPIBlocks, setSelectedDPIBlocks] = useState<string[]>([
    'IoT Remote Sensor Telemetry',
    'MOSIP Sovereign Identity Verification',
    'OpenG2P Direct Benefit Settlement'
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Gemini Cross-Border AI Agent State
  const [crossBorderMatches, setCrossBorderMatches] = useState<any[]>([]);
  const [crossBorderVerdict, setCrossBorderVerdict] = useState<string>('');
  const [isCrossBorderLoading, setIsCrossBorderLoading] = useState<boolean>(false);

  const activeHotspot = DEMAND_HOTSPOTS.find((h) => h.id === selectedHotspotId) || defaultHotspot;
  const activeCountry = BRICS_COUNTRIES.find((c) => c.id === activeHotspot.countryId);
  const activeRegion = REGIONS_DATA.find((r) => r.id === activeHotspot.regionId);

  const toggleDPIBlock = (block: string) => {
    setSelectedDPIBlocks((prev) => 
      prev.includes(block) ? prev.filter((b) => b !== block) : [...prev, block]
    );
  };

  const fetchCrossBorderAgentPicks = async () => {
    setIsCrossBorderLoading(true);
    try {
      const response = await fetch('/api/cross-border-agent-picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCountry: activeCountry?.name || 'India',
          sourceRegion: activeHotspot.regionName,
          targetSector: activeHotspot.sector,
          budgetM: budgetSlider,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCrossBorderMatches(data.data.crossBorderMatches || []);
        setCrossBorderVerdict(data.data.geminiAgentStrategicVerdict || '');
      }
    } catch (err) {
      console.error('Failed to fetch cross-border agent picks:', err);
    } finally {
      setIsCrossBorderLoading(false);
    }
  };

  useEffect(() => {
    if (activeViewTab === 'cross-border' && crossBorderMatches.length === 0) {
      fetchCrossBorderAgentPicks();
    }
  }, [activeViewTab, selectedHotspotId]);

  const handleSynthesizeDPR = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-dpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: activeCountry?.name || 'BRICS Nation',
          regionName: activeHotspot.regionName,
          category: activeHotspot.sector,
          allocatedBudgetMillions: budgetSlider,
          targetYear,
          demandHotspotData: {
            ...activeHotspot,
            vulnerabilityIndex: activeRegion?.vulnerabilityIndex,
            waterAccessPercent: activeRegion?.waterAccessPercent,
            pavedRoadPercent: activeRegion?.pavedRoadPercent,
            integratedDPIBlocks: selectedDPIBlocks,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.markdown) {
        setGeneratedMarkdown(data.markdown);
        setActiveViewTab('document');
      }
    } catch (err) {
      console.error('Failed to generate DPR:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (generatedMarkdown) {
      navigator.clipboard.writeText(generatedMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-500/40">
              AI Detailed Project Report (DPR) & Gantt Engine
            </span>
            <span className="text-xs font-mono text-slate-300">UN / BRICS DPG Formulation Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Ministerial Policy & Infrastructure DPR Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
            Automates the conversion of citizen demand signals and demographic indices into official, bankable Detailed Project Reports, lifecycle Gantt milestones, and CapEx allocations.
          </p>
        </div>

        <button
          id="generate-dpr-action-btn"
          disabled={isGenerating}
          onClick={handleSynthesizeDPR}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-950/40 flex items-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing DPR with Gemini 3.7 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate Bankable DPR Brief</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Left Setup Configuration (4 cols), Right Views (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: DPR Parameters Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Hotspot Target Selection */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Target Demand Hotspot
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Infrastructure Initiative
              </label>
              <select
                value={selectedHotspotId}
                onChange={(e) => setSelectedHotspotId(e.target.value)}
                className="w-full bg-[#070F1E] border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DEMAND_HOTSPOTS.map((h) => {
                  const c = BRICS_COUNTRIES.find((cnt) => cnt.id === h.countryId);
                  return (
                    <option key={h.id} value={h.id}>
                      {c?.flag} {h.title}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Hotspot Summary Card */}
            <div className="bg-[#070F1E] p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Region:</span>
                <span className="font-semibold text-white">{activeHotspot.regionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sector:</span>
                <span className="font-semibold text-cyan-400">{activeHotspot.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority Score:</span>
                <span className="font-mono font-bold text-rose-400">{activeHotspot.priorityScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Citizen Demand:</span>
                <span className="font-bold text-white">{activeHotspot.demandIntensity.toLocaleString()} voices</span>
              </div>
            </div>

            {/* CapEx Budget Envelope Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  CapEx Allocation Envelope:
                </label>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ${budgetSlider}M USD
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={2.5}
                value={budgetSlider}
                onChange={(e) => setBudgetSlider(Number(e.target.value))}
                className="w-full h-2 bg-[#070F1E] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>$5M</span>
                <span>$75M</span>
                <span>$150M</span>
              </div>
            </div>

            {/* Target Planning Horizon */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Completion Planning Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2027, 2028, 2030].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTargetYear(yr)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      targetYear === yr
                        ? 'bg-blue-600/40 text-cyan-200 border-cyan-400 shadow-md font-bold'
                        : 'bg-[#070F1E] text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {yr} Target
                  </button>
                ))}
              </div>
            </div>

            {/* Digital Public Infrastructure (DPI) Module Inclusion */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Include Open DPI Architecture Rails
              </label>
              <div className="space-y-1.5">
                {[
                  'IoT Remote Sensor Telemetry',
                  'MOSIP Sovereign Identity Verification',
                  'OpenG2P Direct Benefit Settlement',
                  'Sunbird Verifiable Asset Credentialing',
                  'Beckn Decentralized Logistics Protocol'
                ].map((block) => {
                  const isChecked = selectedDPIBlocks.includes(block);
                  return (
                    <button
                      key={block}
                      type="button"
                      onClick={() => toggleDPIBlock(block)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#070F1E] border-cyan-500/60 text-white'
                          : 'bg-[#070F1E]/50 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{block}</span>
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700'
                      }`}>
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-tab Interactive Views (Gantt, DPR Markdown, CapEx Breakdown) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* View Tab Selector */}
          <div className="flex items-center justify-between bg-[#0A192F] p-2 rounded-2xl border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveViewTab('gantt')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeViewTab === 'gantt'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Gantt Timeline & Milestones</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewTab('document')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeViewTab === 'document'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>AI Bankable DPR Document</span>
                {generatedMarkdown && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveViewTab('cross-border')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeViewTab === 'cross-border'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Gemini Cross-Border AI Picks</span>
              </button>
            </div>

            {/* Quick Action Button for Printing/Exporting */}
            {generatedMarkdown && activeViewTab === 'document' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-[#070F1E] hover:bg-slate-800 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-[#070F1E] hover:bg-slate-800 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Print</span>
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Gantt Chart Visualization */}
          {activeViewTab === 'gantt' && (
            <ProjectGanttTimeline
              projectTitle={activeHotspot.title}
              sector={activeHotspot.sector}
              totalBudgetM={budgetSlider}
              targetYear={targetYear}
              countryName={activeCountry?.name || 'BRICS Member'}
              regionName={activeHotspot.regionName}
            />
          )}

          {/* Tab 2: Rendered Bankable DPR Document */}
          {activeViewTab === 'document' && (
            <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[550px]">
              <div className="flex-1 overflow-y-auto max-h-[650px]">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-white">
                      Gemini AI is synthesizing your Detailed Project Report...
                    </p>
                    <p className="text-xs text-slate-300 max-w-md">
                      Analyzing {activeHotspot.demandIntensity.toLocaleString()} citizen grievances, calculating multi-year CapEx breakdown, and formulating milestone schedules.
                    </p>
                  </div>
                ) : generatedMarkdown ? (
                  <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-200 space-y-4">
                    <div className="bg-[#070F1E] p-6 rounded-2xl border border-slate-800 shadow-inner text-slate-100">
                      <ReactMarkdown>{generatedMarkdown}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#070F1E]/80 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-blue-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      No DPR Synthesized Yet for {activeHotspot.title}
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Click the <strong>"Generate Bankable DPR Brief"</strong> button above to have Gemini AI formulate a complete ministerial infrastructure proposal.
                    </p>
                    <button
                      onClick={handleSynthesizeDPR}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Synthesize DPR Now</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Document Certificate Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified BRICS Digital Public Good (DPG) Protocol
                </span>
                <span className="font-mono text-[11px] text-slate-300">
                  SHA256 Token: 8f9b2a7d...31e4
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Gemini Cross-Border AI Agent Picks */}
          {activeViewTab === 'cross-border' && (
            <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Gemini Cross-Border AI Agent Recommendations
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Peer-to-peer sovereign matchmaking for <strong>{activeHotspot.regionName}</strong> across BRICS open digital public goods with 100% zero debt and open-source sovereignty.
                  </p>
                </div>
                <button
                  onClick={fetchCrossBorderAgentPicks}
                  disabled={isCrossBorderLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-cyan-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all self-start cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isCrossBorderLoading ? 'Analyzing...' : 'Re-run Gemini Agent'}</span>
                </button>
              </div>

              {/* Strategic Gemini Agent Verdict */}
              {crossBorderVerdict && (
                <div className="bg-[#070F1E] border border-blue-500/40 rounded-2xl p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-cyan-300 shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Gemini Sovereign AI Strategic Verdict
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                      {crossBorderVerdict}
                    </p>
                  </div>
                </div>
              )}

              {/* Cross-Border Match Cards */}
              {isCrossBorderLoading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-300">
                    Gemini AI Agent is matchmaking cross-border Digital Public Goods across BRICS nations...
                  </p>
                </div>
              ) : crossBorderMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {crossBorderMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className="bg-[#070F1E] p-4 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="text-base">{match.originFlag}</span>
                            <span>{match.originCountry}</span>
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {match.interoperabilityScore}% Match
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-cyan-300">
                          {match.dpiProtocolName}
                        </h5>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {match.adaptationRationale}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[10px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Zero-Debt Guarantee:</span>
                          <span className="font-semibold text-emerald-400 truncate max-w-[140px]">{match.zeroDebtGuarantee}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Deployment Sprint:</span>
                          <span className="font-mono text-white">{match.deploymentSprintWeeks} Weeks</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#070F1E] p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-300">
                  Click "Re-run Gemini Agent" to generate real-time cross-border sovereign recommendations.
                </div>
              )}

              {/* Zero-Debt Sovereign Safeguard Banner */}
              <div className="bg-[#070F1E] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>100% Sovereign Open-Source Adaptation: Eliminates foreign vendor lock-in and commercial loan conditionalities.</span>
                </div>
                <button
                  onClick={() => {
                    const blockNames = crossBorderMatches.map(m => m.dpiProtocolName);
                    setSelectedDPIBlocks(prev => Array.from(new Set([...prev, ...blockNames])));
                    setActiveViewTab('document');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Incorporate into DPR</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
