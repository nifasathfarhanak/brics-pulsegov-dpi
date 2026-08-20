import React, { useState } from 'react';
import { ContaminationAlert } from '../../types';
import { 
  AlertTriangle, 
  Droplets, 
  SunMedium, 
  ShieldAlert, 
  MapPin, 
  Sparkles, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Info,
  Layers,
  Activity
} from 'lucide-react';

interface GeospatialContaminationMapProps {
  alerts: ContaminationAlert[];
  onSelectAlert?: (alert: ContaminationAlert) => void;
}

export const GeospatialContaminationMap: React.FC<GeospatialContaminationMapProps> = ({
  alerts,
  onSelectAlert,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<ContaminationAlert>(alerts[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter((a) => a.contaminantType.toLowerCase().includes(filterType.toLowerCase()));

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'Arsenic':
        return { bg: 'bg-red-500', ring: 'ring-red-400', text: 'text-red-400', border: 'border-red-500/40' };
      case 'Fluoride':
        return { bg: 'bg-amber-500', ring: 'ring-amber-400', text: 'text-amber-400', border: 'border-amber-500/40' };
      case 'Salinity':
        return { bg: 'bg-cyan-500', ring: 'ring-cyan-400', text: 'text-cyan-400', border: 'border-cyan-500/40' };
      case 'Heavy Metals':
        return { bg: 'bg-purple-500', ring: 'ring-purple-400', text: 'text-purple-400', border: 'border-purple-500/40' };
      case 'Grid Failure':
        return { bg: 'bg-yellow-500', ring: 'ring-yellow-400', text: 'text-yellow-400', border: 'border-yellow-500/40' };
      default:
        return { bg: 'bg-emerald-500', ring: 'ring-emerald-400', text: 'text-emerald-400', border: 'border-emerald-500/40' };
    }
  };

  // Approximate relative positioning on our map canvas (SVG coordinate mapping)
  const getNodeCoordinates = (alertId: string) => {
    switch (alertId) {
      case 'ALERT-ARS-001': // Bhagalpur, Bihar
        return { top: '48%', left: '68%' };
      case 'ALERT-FLR-002': // Nalgonda, Telangana
        return { top: '68%', left: '46%' };
      case 'ALERT-SAL-003': // Sundarbans, West Bengal
        return { top: '56%', left: '74%' };
      case 'ALERT-HM-004': // Korba, Chhattisgarh
        return { top: '54%', left: '55%' };
      case 'ALERT-GRD-005': // Ladakh
        return { top: '16%', left: '40%' };
      case 'ALERT-BIO-006': // Assam
        return { top: '42%', left: '85%' };
      default:
        return { top: '50%', left: '50%' };
    }
  };

  return (
    <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[11px] font-semibold border border-red-500/40 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              Sovereign Telemetry & Contamination GIS
            </span>
            <span className="text-[11px] font-mono text-[#94A3B8]">Real-Time Laboratory Feeds</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">
            Geospatial Contamination Nodes & Infrastructure Deficit
          </h2>
          <p className="text-xs text-[#CBD5E1]">
            Interactive map displaying real-time Arsenic, Fluoride, Salinity, and Energy grid hotspots with AI-formulated project recommendations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0A192F] p-1.5 rounded-xl border border-[#334155]">
          {[
            { id: 'all', label: 'All Hotspots' },
            { id: 'arsenic', label: 'Arsenic' },
            { id: 'fluoride', label: 'Fluoride' },
            { id: 'salinity', label: 'Salinity' },
            { id: 'grid', label: 'Grid Outages' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === f.id
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#CBD5E1]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Layout Grid: Map Canvas on Left, Active Node Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Map Canvas Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#0A192F] rounded-2xl border border-[#334155] p-4 relative min-h-[420px] overflow-hidden flex flex-col justify-between">
          
          {/* Top Map Ticker */}
          <div className="flex items-center justify-between text-xs text-[#94A3B8] z-10">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              National Jal & Energy Grid Layer
            </span>
            <span className="text-emerald-400 font-semibold text-[10px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Sensor Sync Active
            </span>
          </div>

          {/* SVG Map Canvas Background with stylized geospatial boundary grid */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
              {/* Subtle Grid Lines */}
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#grid-pattern)" />
              
              {/* Abstract Country Outline / Geospatial River Corridor Paths */}
              <path
                d="M 280 90 Q 320 60 360 80 T 420 140 T 480 180 T 560 210 T 640 240 T 700 270 T 720 340 T 660 370 T 580 430 T 490 510 T 440 570 T 380 520 T 320 440 T 260 360 T 220 280 T 240 180 Z"
                stroke="#1E3A8A"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="#1E293B"
                fillOpacity="0.4"
              />

              {/* River Ganga & Brahmaputra Corridor Highlights */}
              <path
                d="M 330 180 Q 420 220 510 260 T 640 290 T 710 280"
                stroke="#38bdf8"
                strokeWidth="2.5"
                opacity="0.5"
                strokeDasharray="6 3"
              />
              <path
                d="M 380 340 Q 430 380 490 420 T 540 450"
                stroke="#38bdf8"
                strokeWidth="1.8"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* Interactive Region Node Pins */}
          <div className="relative w-full h-[320px] sm:h-[350px]">
            {filteredAlerts.map((alert) => {
              const pos = getNodeCoordinates(alert.id);
              const isSelected = selectedAlert?.id === alert.id;
              const styling = getMarkerColor(alert.contaminantType);

              return (
                <div
                  key={alert.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => {
                    setSelectedAlert(alert);
                    if (onSelectAlert) onSelectAlert(alert);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Outer pulse wave */}
                  <div
                    className={`absolute -inset-2 rounded-full ${styling.bg} opacity-40 animate-ping`}
                  />

                  {/* Marker Node Badge */}
                  <div
                    className={`relative px-2.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl transition-all transform group-hover:scale-110 ${
                      isSelected
                        ? `${styling.bg} text-white ring-4 ring-white/50 scale-110 font-bold`
                        : `bg-[#0A192F] ${styling.border} ${styling.text} border font-medium`
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-[11px] whitespace-nowrap">
                      {alert.regionName.split('&')[0].trim()}
                    </span>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                    <div className="bg-[#0A192F] border border-[#1E3A8A] text-[#F8FAFC] p-2.5 rounded-xl shadow-2xl text-[11px] whitespace-nowrap space-y-1">
                      <div className="font-bold text-amber-400">{alert.regionName} ({alert.state})</div>
                      <div className="text-red-300">
                        {alert.contaminantType}: {alert.severityPPM} PPM (Limit: {alert.permissibleLimitPPM} PPM)
                      </div>
                      <div className="text-[#94A3B8] text-[10px]">Pop: {alert.affectedPopulation}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="bg-[#1E293B]/90 p-2.5 rounded-xl border border-[#334155] flex flex-wrap items-center justify-between gap-3 text-[11px] z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Arsenic
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Fluoride
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                Salinity
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                Grid Failure
              </span>
            </div>
            <span className="text-[#94A3B8] text-[10px]">Click any node to inspect telemetry</span>
          </div>

        </div>

        {/* Selected Region Node Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-[#0A192F] rounded-2xl border border-[#334155] p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            {/* Header Title */}
            <div className="flex items-start justify-between gap-2 border-b border-[#334155] pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                  Node Telemetry Inspector
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedAlert.regionName}
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {selectedAlert.state}, India • Logged on {selectedAlert.dateLogged}
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedAlert.riskLevel === 'Critical'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {selectedAlert.riskLevel} Risk
              </span>
            </div>

            {/* Metric Cards (Severity vs Permissible Limit) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1E293B] p-3 rounded-xl border border-[#334155]">
                <div className="text-[10px] text-[#94A3B8] uppercase font-medium">
                  {selectedAlert.contaminantType} Level
                </div>
                <div className="text-xl font-mono font-extrabold text-red-400 mt-0.5">
                  {selectedAlert.severityPPM} {selectedAlert.contaminantType === 'Grid Failure' ? '%' : 'PPM'}
                </div>
                <div className="text-[10px] text-red-300/80 mt-1">
                  Threshold: {selectedAlert.permissibleLimitPPM} {selectedAlert.contaminantType === 'Grid Failure' ? '%' : 'PPM'}
                </div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl border border-[#334155]">
                <div className="text-[10px] text-[#94A3B8] uppercase font-medium">
                  Exceedance Factor
                </div>
                <div className="text-xl font-mono font-extrabold text-amber-400 mt-0.5">
                  {selectedAlert.contaminantType === 'Grid Failure'
                    ? `${(selectedAlert.severityPPM / selectedAlert.permissibleLimitPPM).toFixed(1)}x Deficit`
                    : `${(selectedAlert.severityPPM / selectedAlert.permissibleLimitPPM).toFixed(1)}x Toxicity`}
                </div>
                <div className="text-[10px] text-[#CBD5E1] mt-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-300" />
                  <span>{selectedAlert.affectedPopulation}</span>
                </div>
              </div>
            </div>

            {/* AI Infrastructure Solution Recommendation */}
            <div className="bg-gradient-to-br from-[#0A192F] to-[#0A192F] p-4 rounded-xl border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Recommended Remedial Project:</span>
              </div>
              <div className="text-sm font-semibold text-white">
                {selectedAlert.suggestedAIProject}
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Automated multi-criteria analysis recommends deploying solar-powered decentralized nano-filtration kiosks with zero sovereign debt under the National Jal Rail.
              </p>
            </div>

            {/* Operational Status */}
            <div className="flex items-center justify-between text-xs bg-[#1E293B] px-3 py-2 rounded-xl border border-[#334155]">
              <span className="text-[#94A3B8]">Current Action State:</span>
              <span className="font-semibold text-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                {selectedAlert.status}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (onSelectAlert) onSelectAlert(selectedAlert);
              }}
              className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Bankable AI DPR for this Hotspot</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
