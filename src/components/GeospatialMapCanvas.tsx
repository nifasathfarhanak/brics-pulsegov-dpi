import React, { useState, useMemo } from 'react';
import { BRICS_COUNTRIES, REGIONS_DATA } from '../data/bricsData';
import { BRICSCountryId, DemandHotspot, InfrastructureSector, RegionData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Droplets, 
  Zap, 
  Truck, 
  HeartPulse, 
  Wifi, 
  Sprout, 
  AlertTriangle,
  Radio,
  MapPin,
  Sparkles,
  Volume2
} from 'lucide-react';

interface GeospatialMapCanvasProps {
  selectedCountry: BRICSCountryId | 'all';
  onSelectCountry: (country: BRICSCountryId | 'all') => void;
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  hotspots: DemandHotspot[];
  onSelectHotspot?: (hotspot: DemandHotspot) => void;
  activeLayer: 'priority' | 'vulnerability' | 'deficit' | 'demand';
  selectedSector: string;
}

export const GeospatialMapCanvas: React.FC<GeospatialMapCanvasProps> = ({
  selectedCountry,
  onSelectCountry,
  selectedRegionId,
  onSelectRegion,
  hotspots,
  activeLayer,
  selectedSector,
}) => {
  const { currentLanguageInfo, speak, isSpeaking, t, tCountry, tSector } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showContamination, setShowContamination] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showGatiShakti, setShowGatiShakti] = useState<boolean>(true);
  const [showJalJeevan, setShowJalJeevan] = useState<boolean>(false);
  const [showBhuvanSatellite, setShowBhuvanSatellite] = useState<boolean>(false);
  const [showImdWeather, setShowImdWeather] = useState<boolean>(false);
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map coordinates projection helper
  // Projects lat/long into an SVG coordinate box (viewBox 0 0 1000 650)
  const projectCoordinates = (lat: number, lng: number, countryId?: BRICSCountryId) => {
    // If we are focusing on India
    if (selectedCountry === 'india' || countryId === 'india') {
      // India bounding box approx: lat 8 to 36, lng 68 to 97
      const minLat = 6.5;
      const maxLat = 37.5;
      const minLng = 67.0;
      const maxLng = 98.5;

      const x = 120 + ((lng - minLng) / (maxLng - minLng)) * 760;
      const y = 600 - ((lat - minLat) / (maxLat - minLat)) * 540;
      return { x: Math.max(50, Math.min(950, x)), y: Math.max(50, Math.min(600, y)) };
    }

    // If we are focusing on Madagascar
    if (selectedCountry === 'madagascar' || countryId === 'madagascar') {
      const minLat = -26.0;
      const maxLat = -11.5;
      const minLng = 42.5;
      const maxLng = 51.5;

      const x = 320 + ((lng - minLng) / (maxLng - minLng)) * 360;
      const y = 580 - ((lat - minLat) / (maxLat - minLat)) * 500;
      return { x: Math.max(100, Math.min(900, x)), y: Math.max(60, Math.min(600, y)) };
    }

    // World / Global BRICS Projection (Equirectangular scaled to 1000x650)
    // Longitude: -120 to +140 -> x: 50 to 950
    // Latitude: -40 to +65 -> y: 560 to 80
    const minLng = -120;
    const maxLng = 145;
    const minLat = -42;
    const maxLat = 68;

    const x = 50 + ((lng - minLng) / (maxLng - minLng)) * 900;
    const y = 560 - ((lat - minLat) / (maxLat - minLat)) * 480;
    return { x: Math.max(40, Math.min(960, x)), y: Math.max(50, Math.min(600, y)) };
  };

  // Filtered regions to render on canvas
  const visibleRegions = useMemo(() => {
    return REGIONS_DATA.filter((r) => {
      if (selectedCountry !== 'all' && r.countryId !== selectedCountry) return false;
      if (selectedSector !== 'all' && r.topPrioritySector !== selectedSector) return false;
      return true;
    });
  }, [selectedCountry, selectedSector]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, prev - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  const getSectorColor = (sector: InfrastructureSector) => {
    switch (sector) {
      case 'Water & Sanitation': return '#06b6d4'; // Cyan
      case 'Energy & Microgrids': return '#3b82f6'; // Blue
      case 'Transport & Connectivity': return '#10b981'; // Emerald
      case 'Health Infrastructure': return '#f43f5e'; // Rose
      case 'Digital Public Infrastructure': return '#38bdf8'; // Sky
      case 'Agricultural & Irrigation': return '#84cc16'; // Lime
      default: return '#60a5fa';
    }
  };

  const getVulnerabilityColor = (vIndex: number) => {
    if (vIndex >= 75) return '#f43f5e'; // Rose red
    if (vIndex >= 60) return '#38bdf8'; // Sky blue
    return '#10b981'; // Emerald green
  };

  // Precomputed DPI diplomatic transfer corridors (connecting sovereign nodes)
  const corridors = [
    { from: { lat: 20.5937, lng: 78.9629 }, to: { lat: -14.235, lng: -51.9253 }, label: 'India-Brazil DPI Bridge' },
    { from: { lat: 20.5937, lng: 78.9629 }, to: { lat: -30.5595, lng: 22.9375 }, label: 'India-South Africa Telemetry' },
    { from: { lat: 35.8617, lng: 104.1954 }, to: { lat: 26.8206, lng: 30.8025 }, label: 'China-Egypt Clean Grid' },
    { from: { lat: 61.524, lng: 105.3188 }, to: { lat: 32.4279, lng: 53.688 }, label: 'Russia-Iran Connectivity' },
    { from: { lat: 20.5937, lng: 78.9629 }, to: { lat: -18.7669, lng: 46.8691 }, label: 'India-Madagascar Water DPI' },
  ];

  return (
    <div className="relative bg-[#070F1E] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Map Stage Header & Live Layer Toggles */}
      <div className="p-4 bg-[#0A192F]/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-10 relative">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 flex items-center gap-1.5">
            <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {selectedCountry === 'all' 
                ? (t.bricsGeospatialMap || 'BRICS Global Sovereign Geospatial Map')
                : `${tCountry(selectedCountry).toUpperCase()} ${t.territorialMap || 'Territorial Infrastructure Map'}`}
            </span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
            {visibleRegions.length} Active Geospatial Nodes Plotted
          </span>
        </div>

        {/* Action Controls & Layer Switches */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowGatiShakti(!showGatiShakti)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
              showGatiShakti 
                ? 'bg-amber-900/50 text-amber-300 border-amber-500/50 shadow' 
                : 'bg-[#070F1E] text-slate-400 border-slate-800'
            }`}
            title="PM GatiShakti Multi-Modal Logistics & Freight Corridors"
          >
            <Truck className="w-3 h-3 text-amber-400" />
            <span>PM GatiShakti</span>
          </button>

          <button
            onClick={() => setShowJalJeevan(!showJalJeevan)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
              showJalJeevan 
                ? 'bg-cyan-900/50 text-cyan-300 border-cyan-500/50 shadow' 
                : 'bg-[#070F1E] text-slate-400 border-slate-800'
            }`}
            title="Jal Jeevan Mission Potable Water Telemetry"
          >
            <Droplets className="w-3 h-3 text-cyan-400" />
            <span>Jal Jeevan</span>
          </button>

          <button
            onClick={() => setShowBhuvanSatellite(!showBhuvanSatellite)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
              showBhuvanSatellite 
                ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50 shadow' 
                : 'bg-[#070F1E] text-slate-400 border-slate-800'
            }`}
            title="ISRO Bhuvan Satellite Earth Observation Layer"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>ISRO Bhuvan</span>
          </button>

          <button
            onClick={() => setShowImdWeather(!showImdWeather)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
              showImdWeather 
                ? 'bg-indigo-900/50 text-indigo-300 border-indigo-500/50 shadow' 
                : 'bg-[#070F1E] text-slate-400 border-slate-800'
            }`}
            title="IMD Live Cloudburst & Monsoon Alert Radar"
          >
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>IMD Radar</span>
          </button>

          <button
            onClick={() => setShowContamination(!showContamination)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
              showContamination 
                ? 'bg-rose-900/40 text-rose-300 border-rose-500/40' 
                : 'bg-[#070F1E] text-slate-400 border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>{t.contaminationAlerts || 'Contamination'}</span>
          </button>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
              showCorridors 
                ? 'bg-sky-900/40 text-sky-300 border-sky-500/40' 
                : 'bg-[#070F1E] text-slate-400 border-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>{t.dpiCorridors || 'DPI Bridge'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-[#070F1E] border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Geospatial Canvas */}
      <div 
        className="relative w-full h-[480px] sm:h-[540px] bg-[#030A14] overflow-hidden select-none cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Background Grid & Sovereign Latitude/Longitude lines */}
          <defs>
            <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10233B" strokeWidth="0.75" strokeDasharray="2 3" />
            </pattern>
            
            {/* Radial Gradients for Glow Rings */}
            <radialGradient id="red-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="blue-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="cyan-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="650" fill="url(#geo-grid)" />

          {/* Continental / Sovereign Outlines (Vector Path Representations) */}
          {selectedCountry === 'all' && (
            <g opacity="0.35" fill="#0A192F" stroke="#1E3A8A" strokeWidth="1">
              {/* Eurasia / Russia / China */}
              <path d="M 520 80 Q 720 70 880 120 Q 930 200 860 310 Q 750 360 620 320 Q 560 260 520 80 Z" />
              {/* India Subcontinent */}
              <path d="M 620 320 Q 680 340 680 430 Q 640 520 620 480 Q 590 390 620 320 Z" />
              {/* Africa / Egypt / Ethiopia / South Africa */}
              <path d="M 440 260 Q 560 260 550 380 Q 520 540 460 560 Q 380 420 440 260 Z" />
              {/* South America / Brazil */}
              <path d="M 180 320 Q 310 330 330 460 Q 280 570 210 540 Q 140 400 180 320 Z" />
              {/* Middle East / UAE / Saudi Arabia / Iran */}
              <path d="M 550 270 Q 620 280 620 340 Q 570 370 540 330 Z" />
              {/* Madagascar Island */}
              <path d="M 570 470 Q 590 480 580 530 Q 565 520 570 470 Z" />
            </g>
          )}

          {/* India Regional Map Silhouette when India is selected */}
          {selectedCountry === 'india' && (
            <g opacity="0.4" fill="#0A192F" stroke="#3B82F6" strokeWidth="1.5">
              {/* India Mainland Boundary Polygon */}
              <path d="M 380 70 Q 480 80 520 120 Q 620 160 740 180 Q 820 220 780 270 Q 680 280 640 330 Q 680 400 660 500 Q 520 610 440 620 Q 340 540 340 420 Q 260 360 280 260 Q 340 160 380 70 Z" />
            </g>
          )}

          {/* Madagascar Regional Map Silhouette when Madagascar is selected */}
          {selectedCountry === 'madagascar' && (
            <g opacity="0.45" fill="#0A192F" stroke="#3B82F6" strokeWidth="2">
              <path d="M 520 80 Q 580 140 600 280 Q 620 440 540 580 Q 440 560 410 400 Q 420 220 520 80 Z" />
            </g>
          )}

          {/* Sovereign DPI Diplomatic Transfer Corridors */}
          {showCorridors && selectedCountry === 'all' && (
            <g>
              {corridors.map((c, idx) => {
                const p1 = projectCoordinates(c.from.lat, c.from.lng);
                const p2 = projectCoordinates(c.to.lat, c.to.lng);
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2 - 40;

                return (
                  <g key={`corridor-${idx}`}>
                    <path
                      d={`M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.5"
                      className="animate-pulse"
                    />
                    <circle cx={midX} cy={midY} r="3" fill="#38bdf8" opacity="0.7" />
                  </g>
                );
              })}
            </g>
          )}

          {/* PM GatiShakti Multi-Modal Infrastructure Corridors Layer */}
          {showGatiShakti && (
            <g opacity="0.75">
              {/* Western Dedicated Freight Corridor (Delhi - Mumbai) */}
              <path
                d="M 440 160 Q 380 280 340 370"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 3"
                className="animate-pulse"
              />
              {/* Eastern Dedicated Freight Corridor (Ludhiana - Dankuni / Kolkata) */}
              <path
                d="M 440 160 Q 560 210 680 290"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              {/* Chennai - Bengaluru - Mumbai Industrial Corridor */}
              <path
                d="M 340 370 Q 420 480 470 510 Q 530 480 540 450"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              {/* GatiShakti Multi-Modal Node Labels */}
              <text x="445" y="155" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                GatiShakti Node: NCR Multi-Modal Hub
              </text>
              <text x="345" y="365" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                JNPT Port Logistics Corridor
              </text>
            </g>
          )}

          {/* Jal Jeevan Mission & Groundwater Purity Layer */}
          {showJalJeevan && (
            <g opacity="0.8">
              {visibleRegions.map((region) => {
                const coords = projectCoordinates(region.coordinates.lat, region.coordinates.lng, region.countryId);
                return (
                  <g key={`jjm-${region.id}`}>
                    <circle
                      cx={coords.x + 12}
                      cy={coords.y + 12}
                      r="9"
                      fill="#0891b2"
                      fillOpacity="0.35"
                      stroke="#06b6d4"
                      strokeWidth="1.2"
                    />
                    <text
                      x={coords.x + 8}
                      y={coords.y + 15}
                      fill="#67e8f9"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      JJM
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ISRO Bhuvan Satellite Imagery Grid Overlay */}
          {showBhuvanSatellite && (
            <g opacity="0.45">
              <rect width="1000" height="650" fill="#042f2e" fillOpacity="0.25" />
              <circle cx="480" cy="300" r="280" fill="none" stroke="#10b981" strokeWidth="0.75" strokeDasharray="5 5" />
              <circle cx="480" cy="300" r="160" fill="none" stroke="#10b981" strokeWidth="0.75" strokeDasharray="3 3" />
              <text x="750" y="40" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
                🛰️ ISRO Bhuvan EO Satellite Telemetry Active
              </text>
            </g>
          )}

          {/* IMD Live Monsoon Radar & Cloudburst Telemetry Layer */}
          {showImdWeather && (
            <g opacity="0.65">
              {/* Cloudburst Radar Sweep */}
              <circle
                cx="580"
                cy="240"
                r="70"
                fill="#4338ca"
                fillOpacity="0.3"
                stroke="#6366f1"
                strokeWidth="1.5"
                className="animate-ping"
                style={{ animationDuration: '4s' }}
              />
              <text x="540" y="235" fill="#a5b4fc" fontSize="8" fontWeight="bold" fontFamily="monospace">
                ⛈️ IMD Heavy Cloudburst Radar Alert
              </text>
            </g>
          )}

          {/* Contamination Buffer Radii (Arsenic, Fluoride, Salinity) */}
          {showContamination && visibleRegions.map((region) => {
            if (region.vulnerabilityIndex < 65) return null;
            const coords = projectCoordinates(region.coordinates.lat, region.coordinates.lng, region.countryId);
            const radius = Math.min(45, Math.max(16, region.vulnerabilityIndex * 0.45));

            return (
              <g key={`contam-${region.id}`}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radius}
                  fill={region.vulnerabilityIndex > 75 ? "url(#red-glow)" : "url(#blue-glow)"}
                  className="animate-ping"
                  style={{ animationDuration: '3s' }}
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={radius * 0.8}
                  fill="none"
                  stroke={region.vulnerabilityIndex > 75 ? "#f43f5e" : "#38bdf8"}
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              </g>
            );
          })}

          {/* Regional Geo Nodes & Sector Pins */}
          {visibleRegions.map((region) => {
            const coords = projectCoordinates(region.coordinates.lat, region.coordinates.lng, region.countryId);
            const isSelected = region.id === selectedRegionId;
            const isHovered = hoveredRegion?.id === region.id;
            const sectorColor = getSectorColor(region.topPrioritySector);
            const vulnColor = getVulnerabilityColor(region.vulnerabilityIndex);

            return (
              <g
                key={`node-${region.id}`}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => onSelectRegion(region.id)}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Active Selection Ring */}
                {isSelected && (
                  <g>
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="16"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      className="animate-spin"
                      strokeDasharray="4 2"
                    />
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="22"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.75"
                      opacity="0.5"
                    />
                  </g>
                )}

                {/* Base Node Pulse Circle */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 10 : isSelected ? 9 : 7}
                  fill={vulnColor}
                  stroke="#070F1E"
                  strokeWidth="2"
                  className="transition-all"
                  filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.8))"
                />

                {/* Inner Dot */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="3"
                  fill="#ffffff"
                />

                {/* Location Name Label (rendered for high vulnerability or selected/hovered nodes) */}
                {(isSelected || isHovered || region.vulnerabilityIndex > 78 || selectedCountry !== 'all') && (
                  <g>
                    <rect
                      x={coords.x + 8}
                      y={coords.y - 12}
                      width={Math.max(60, region.name.length * 6.5)}
                      height="18"
                      rx="4"
                      fill="#070F1E"
                      fillOpacity="0.9"
                      stroke={isSelected ? "#38bdf8" : "#1E3A8A"}
                      strokeWidth="0.75"
                    />
                    <text
                      x={coords.x + 12}
                      y={coords.y + 1}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {region.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredRegion && (
          <div
            className="absolute z-20 pointer-events-none bg-[#0A192F]/95 backdrop-blur-md border border-cyan-500/50 p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 w-64 animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: Math.min(tooltipPos.x + 15, 650),
              top: Math.max(10, Math.min(tooltipPos.y - 40, 360)),
            }}
          >
            <div className="flex items-start justify-between gap-1">
              <div>
                <h4 className="font-bold text-white text-sm">{hoveredRegion.name}</h4>
                <p className="text-[11px] text-cyan-300 font-medium">{hoveredRegion.nativeName}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                hoveredRegion.vulnerabilityIndex > 75 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                  : 'bg-blue-500/20 text-cyan-300 border-blue-500/30'
              }`}>
                Score: {hoveredRegion.vulnerabilityIndex}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <div>
                <span>{t.sector || 'Sector'}:</span>
                <div className="font-semibold text-white truncate">{tSector(hoveredRegion.topPrioritySector)}</div>
              </div>
              <div>
                <span>{t.deficitBudget || 'Deficit CapEx'}:</span>
                <div className="font-bold text-cyan-400 font-mono">${hoveredRegion.deficitBudgetM}M USD</div>
              </div>
            </div>

            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{t.clickNodeToInspect || 'Click node to inspect & adapt language'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="p-3.5 bg-[#0A192F] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold uppercase tracking-wider text-[10px] text-white">{t.legend || 'Legend'}:</span>
          
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm"></span>
            <span className="text-slate-300">{t.criticalPriorityLeg || 'Critical Priority (>75)'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-sm"></span>
            <span className="text-slate-300">{t.highDeficitLeg || 'High Deficit (60-74)'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
            <span className="text-slate-300">{t.moderateStableLeg || 'Moderate / Stable (<60)'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-3 h-0.5 border-b-2 border-dashed border-sky-400 inline-block"></span>
            <span className="text-slate-300">{t.dpiTransferRailsLeg || 'DPI Transfer Rails'}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 font-mono">
          <span>Active Voice: </span>
          <span className="text-cyan-300 font-bold">{currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</span>
        </div>
      </div>
    </div>
  );
};
