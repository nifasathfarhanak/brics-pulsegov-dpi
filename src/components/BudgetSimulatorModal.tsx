import React, { useState } from 'react';
import { RegionData, InfrastructureSector } from '../types';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { 
  X, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Leaf, 
  ShieldAlert, 
  CheckCircle2,
  Building,
  Coins
} from 'lucide-react';

interface BudgetSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: RegionData;
}

export const BudgetSimulatorModal: React.FC<BudgetSimulatorModalProps> = ({
  isOpen,
  onClose,
  region,
}) => {
  const [budgetMillions, setBudgetMillions] = useState<number>(region?.deficitBudgetM || 35);
  const [sector, setSector] = useState<InfrastructureSector>(region?.topPrioritySector || 'Water & Sanitation');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  if (!isOpen || !region) return null;

  const countryObj = BRICS_COUNTRIES.find((c) => c.id === region.countryId);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch('/api/simulate-budget-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: countryObj?.name || 'BRICS Nation',
          priorityRegion: region.name,
          sector,
          budgetMillions,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setSimulationResult(data.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Predictive Econometric & Budget ROI Simulator
              </h2>
              <p className="text-xs text-slate-400">
                {region.name}, {countryObj?.name} • Multi-Variable Public Finance Model
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Parameter Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Sector for Investment
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as InfrastructureSector)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[
                  'Water & Sanitation',
                  'Transport & Connectivity',
                  'Energy & Microgrids',
                  'Health Infrastructure',
                  'Digital Public Infrastructure',
                  'Agricultural & Irrigation'
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-400" />
                  Proposed CapEx Allocation ($ Million USD):
                </label>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ${budgetMillions}M USD
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={budgetMillions}
                onChange={(e) => setBudgetMillions(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>$5M</span>
                <span>$60M</span>
                <span>$120M</span>
              </div>
            </div>

            <button
              id="run-budget-simulation-btn"
              disabled={isSimulating}
              onClick={handleRunSimulation}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-600 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Multi-Variable Impact Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Predictive Impact Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Output Card */}
          {simulationResult && (
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-300">
                  Econometric Simulation Outcomes (24-Month Horizon)
                </h3>
              </div>

              {/* 4 Outcome Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Beneficiaries</span>
                  <span className="text-sm sm:text-base font-bold text-sky-400 mt-0.5 block">
                    {simulationResult.projectedBeneficiaries?.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Vuln. Reduction</span>
                  <span className="text-sm sm:text-base font-bold text-rose-400 mt-0.5 block">
                    -{simulationResult.vulnerabilityReductionPercent}%
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Socio-Econ ROI</span>
                  <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 block">
                    {simulationResult.economicMultiplier}x
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Direct/Indirect Jobs</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5 block">
                    {simulationResult.jobsCreated?.direct + simulationResult.jobsCreated?.indirect}
                  </span>
                </div>
              </div>

              {/* Executive Verdict */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200">
                <strong className="text-sky-400 block mb-1">Executive Policy Verdict:</strong>
                <p className="leading-relaxed">{simulationResult.executiveVerdict}</p>
              </div>

              {/* DPG Recommendations */}
              {simulationResult.dpgRecommendations && (
                <div className="text-xs space-y-1">
                  <span className="text-slate-400 font-semibold">Recommended Open DPI Building Blocks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {simulationResult.dpgRecommendations.map((dpg: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800 text-[11px]">
                        {dpg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
