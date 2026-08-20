import React, { useState, useEffect } from 'react';
import { BRICS_COUNTRIES, REGIONS_DATA } from '../data/bricsData';
import { BRICSCountryId, DemandHotspot, InfrastructureSector, RegionData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { GeospatialMapCanvas } from './GeospatialMapCanvas';
import { 
  AlertTriangle, 
  Droplets, 
  Zap, 
  Truck, 
  HeartPulse, 
  Wifi, 
  GraduationCap, 
  Sprout, 
  TrendingUp, 
  FileText,
  DollarSign,
  ChevronRight,
  Filter,
  Flame,
  CheckCircle2,
  Info,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  Search,
  MapPin,
  Building2,
  Compass,
  Layers,
  LayoutGrid,
  Download,
  Share2,
  Scale,
  Merge,
  ShieldAlert,
  MessageSquare,
  Award
} from 'lucide-react';

interface GeospatialHotspotMapProps {
  selectedCountry: BRICSCountryId | 'all';
  setSelectedCountry: (c: BRICSCountryId | 'all') => void;
  hotspots: DemandHotspot[];
  onSelectHotspot: (hotspot: DemandHotspot) => void;
  onGenerateDPRForHotspot: (hotspot: DemandHotspot) => void;
  onOpenBudgetSimulator: (region: RegionData) => void;
  onOpenWhatsAppBot?: () => void;
  onOpenPolicyDebate?: () => void;
  onOpenDuplicateInspector?: () => void;
  onOpenIndiaHierarchy?: () => void;
  onOpenCrisisSimulation?: () => void;
  onOpenJudgesGuide?: () => void;
}

export const GeospatialHotspotMap: React.FC<GeospatialHotspotMapProps> = ({
  selectedCountry,
  setSelectedCountry,
  hotspots,
  onSelectHotspot,
  onGenerateDPRForHotspot,
  onOpenBudgetSimulator,
  onOpenWhatsAppBot,
  onOpenPolicyDebate,
  onOpenDuplicateInspector,
  onOpenIndiaHierarchy,
  onOpenCrisisSimulation,
  onOpenJudgesGuide,
}) => {
  const { 
    t, 
    tCountry, 
    tSector, 
    tLayer, 
    currentLanguageInfo, 
    speak, 
    isSpeaking, 
    speakingLanguageName, 
    adaptLanguageForRegion, 
    adaptLanguageForCountry 
  } = useLanguage();
  const [activeLayer, setActiveLayer] = useState<'priority' | 'vulnerability' | 'deficit' | 'demand'>('priority');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [regionSearch, setRegionSearch] = useState<string>('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ind_maharashtra');
  const [agentIntelData, setAgentIntelData] = useState<any | null>(null);
  const [isAgentIntelLoading, setIsAgentIntelLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map-and-sentinel' | 'map-only' | 'grid-only'>('map-and-sentinel');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // 1-Click Bankable Export: RFC-7946 GeoJSON
  const handleExportGeoJSON = () => {
    const geojsonData = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
      },
      metadata: {
        generatedBy: "PulseGov Sovereign Digital Public Infrastructure",
        standard: "ISO-37120 / NIC / ISRO Bhuvan Compliant",
        timestamp: new Date().toISOString(),
        totalFeatures: REGIONS_DATA.length + hotspots.length
      },
      features: [
        ...REGIONS_DATA.map((region) => ({
          type: "Feature",
          id: region.id,
          geometry: {
            type: "Point",
            coordinates: [region.coordinates.lng, region.coordinates.lat]
          },
          properties: {
            name: region.name,
            nativeName: region.nativeName,
            countryId: region.countryId,
            population: region.population,
            vulnerabilityIndex: region.vulnerabilityIndex,
            topPrioritySector: region.topPrioritySector,
            deficitBudgetM: region.deficitBudgetM,
            activeRequestsCount: region.activeRequestsCount,
            riskAlert: region.riskAlert
          }
        })),
        ...hotspots.map((hotspot) => ({
          type: "Feature",
          id: hotspot.id,
          geometry: {
            type: "Point",
            coordinates: [hotspot.coordinates?.lng || 0, hotspot.coordinates?.lat || 0]
          },
          properties: {
            title: hotspot.title,
            sector: hotspot.sector,
            priorityScore: hotspot.priorityScore || 85,
            estimatedBudgetM: hotspot.estimatedBudgetM,
            estimatedBeneficiaries: hotspot.estimatedBeneficiaries,
            severity: hotspot.severity || "High"
          }
        }))
      ]
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pulsegov_nic_bhuvan_hotspots_${new Date().toISOString().slice(0, 10)}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice("Exported RFC-7946 GeoJSON for NIC / ISRO Bhuvan / QGIS!");
    setTimeout(() => setExportNotice(null), 4000);
  };

  // 1-Click Bankable Export: MOSPI / BigQuery Tabular CSV
  const handleExportCSV = () => {
    const headers = [
      "Region_ID",
      "Region_Name",
      "Country",
      "Latitude",
      "Longitude",
      "Population",
      "Vulnerability_Index_100",
      "Top_Priority_Sector",
      "Infrastructure_Deficit_USD_M",
      "Active_Citizen_Grievances",
      "Risk_Alert"
    ];

    const rows = REGIONS_DATA.map((r) => [
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.countryId.toUpperCase()}"`,
      r.coordinates.lat,
      r.coordinates.lng,
      r.population,
      r.vulnerabilityIndex,
      `"${r.topPrioritySector}"`,
      r.deficitBudgetM,
      r.activeRequestsCount,
      `"${r.riskAlert.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pulsegov_bigquery_mospi_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice("Exported BigQuery / MOSPI Tabular CSV Dataset!");
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleSelectCountryFilter = (countryId: BRICSCountryId | 'all') => {
    setSelectedCountry(countryId);
    if (countryId !== 'all') {
      adaptLanguageForCountry(countryId);
    }
  };

  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    adaptLanguageForRegion(regionId);
  };

  // Filter regions based on selected country and optional sector & text search
  const filteredRegions = REGIONS_DATA.filter((r) => {
    if (selectedCountry !== 'all' && r.countryId !== selectedCountry) return false;
    if (selectedSector !== 'all' && r.topPrioritySector !== selectedSector) return false;
    if (regionSearch.trim()) {
      const q = regionSearch.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q) || r.nativeName.toLowerCase().includes(q);
      if (!matchName) return false;
    }
    return true;
  });

  const selectedRegion = REGIONS_DATA.find((r) => r.id === selectedRegionId) || filteredRegions[0] || REGIONS_DATA[0];
  const currentCountryObj = BRICS_COUNTRIES.find((c) => c.id === selectedRegion.countryId);
  const associatedHotspots = hotspots.filter((h) => h.regionId === selectedRegion.id);

  const fetchRegionalAgentIntel = async (region: RegionData) => {
    setIsAgentIntelLoading(true);
    try {
      const response = await fetch('/api/regional-agent-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regionName: region.name,
          countryName: currentCountryObj?.name || 'BRICS Member',
          topPrioritySector: region.topPrioritySector,
          vulnerabilityIndex: region.vulnerabilityIndex,
          deficitBudgetM: region.deficitBudgetM,
          activeRequestsCount: region.activeRequestsCount,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAgentIntelData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch regional agent intel:', err);
    } finally {
      setIsAgentIntelLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRegion) {
      fetchRegionalAgentIntel(selectedRegion);
    }
  }, [selectedRegion.id]);

  const handleSpeakBriefing = () => {
    const textToSpeak = agentIntelData?.briefingText || 
      `${selectedRegion.name}, ${currentCountryObj?.name}. Vulnerability score: ${selectedRegion.vulnerabilityIndex} percent. Top priority sector: ${selectedRegion.topPrioritySector}. Infrastructure deficit budget: ${selectedRegion.deficitBudgetM} million dollars. Active citizen voices logged: ${selectedRegion.activeRequestsCount}. ${agentIntelData?.citizenReassuranceBroadcast || ''}`;
    speak(textToSpeak);
  };

  const getSectorIcon = (sector: InfrastructureSector) => {
    switch (sector) {
      case 'Water & Sanitation': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Energy & Microgrids': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'Transport & Connectivity': return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'Health Infrastructure': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'Digital Public Infrastructure': return <Wifi className="w-4 h-4 text-sky-400" />;
      case 'Education & Sanitation': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Agricultural & Irrigation': return <Sprout className="w-4 h-4 text-lime-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Country Filter Badges & Layer Switcher */}
      <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Countries Selector Pills */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.selectCountry} ({BRICS_COUNTRIES.length} {t.allCountries})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                id="country-filter-all-btn"
                onClick={() => handleSelectCountryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCountry === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-[#070F1E] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {t.allCountries}
              </button>
              {BRICS_COUNTRIES.map((country) => (
                <button
                  key={country.id}
                  id={`country-filter-${country.id}-btn`}
                  onClick={() => handleSelectCountryFilter(country.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCountry === country.id
                      ? 'bg-blue-900 text-white font-bold ring-2 ring-blue-500/50 shadow'
                      : 'bg-[#070F1E] text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{country.flag}</span>
                  <span>{tCountry(country.id)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode & Layer Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#070F1E] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('map-and-sentinel')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'map-and-sentinel'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t.mapAndSentinel || 'Map & Sentinel'}</span>
              </button>
              <button
                onClick={() => setViewMode('grid-only')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'grid-only'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{t.gridCards || 'Grid Cards'}</span>
              </button>
            </div>

            {/* Layer Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.layerLabel || 'Layer:'}</span>
              <div className="flex bg-[#070F1E] p-1 rounded-xl border border-slate-800">
                {(['priority', 'vulnerability', 'deficit', 'demand'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                      activeLayer === layer
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tLayer(layer)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sector Quick Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedSector === 'all'
                  ? 'bg-blue-900/60 text-cyan-300 font-bold border border-blue-700/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.allSectors || 'All Sectors'} ({filteredRegions.length})
            </button>
            {['Water & Sanitation', 'Energy & Microgrids', 'Transport & Connectivity', 'Health Infrastructure', 'Agricultural & Irrigation'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedSector === sec
                    ? 'bg-blue-900/60 text-cyan-300 font-bold border border-blue-700/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tSector(sec)}
              </button>
            ))}
          </div>

          {/* Quick Region Name Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              placeholder={t.searchPlaceholder || 'Search state / territory...'}
              className="w-full bg-[#070F1E] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Sovereign DPI Suite Quick Launch & 1-Click Bankable Export Toolbar */}
      <div className="p-4 bg-gradient-to-r from-[#0C1A32] via-[#0A192F] to-[#0F1D38] border border-cyan-500/30 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Quick Launch Features */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono mr-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Sovereign DPI Suite:
          </span>

          {onOpenJudgesGuide && (
            <button
              onClick={onOpenJudgesGuide}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>🏆 Hackathon Guide</span>
            </button>
          )}

          {onOpenWhatsAppBot && (
            <button
              onClick={onOpenWhatsAppBot}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp / Gov Bot</span>
            </button>
          )}

          {onOpenPolicyDebate && (
            <button
              onClick={onOpenPolicyDebate}
              className="px-2.5 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Policy Chamber</span>
            </button>
          )}

          {onOpenDuplicateInspector && (
            <button
              onClick={onOpenDuplicateInspector}
              className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Merge className="w-3.5 h-3.5 text-purple-400" />
              <span>Deduplication Inspector</span>
            </button>
          )}

          {onOpenIndiaHierarchy && (
            <button
              onClick={onOpenIndiaHierarchy}
              className="px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>India District Drilldown</span>
            </button>
          )}

          {onOpenCrisisSimulation && (
            <button
              onClick={onOpenCrisisSimulation}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Simulate Crisis</span>
            </button>
          )}
        </div>

        {/* Right: 1-Click Bankable Export Suite */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportGeoJSON}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            title="Download RFC-7946 GeoJSON dataset for NIC, ISRO Bhuvan, and QGIS"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>NIC GeoJSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            title="Export Tabular CSV for MOSPI, BigQuery, and NDB Financial Audits"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>BigQuery CSV</span>
          </button>
        </div>

      </div>

      {/* Export Toast Notification */}
      {exportNotice && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">100% ISO-37120 Compliant</span>
        </div>
      )}

      {/* Geospatial Interactive Vector Map Canvas (Displayed prominently) */}
      {(viewMode === 'map-and-sentinel' || viewMode === 'map-only') && (
        <GeospatialMapCanvas
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountryFilter}
          selectedRegionId={selectedRegion.id}
          onSelectRegion={handleSelectRegion}
          hotspots={hotspots}
          onSelectHotspot={onSelectHotspot}
          activeLayer={activeLayer}
          selectedSector={selectedSector}
        />
      )}

      {/* Main Grid: Regional Hotspot Selector & Live Gemini Intelligence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: All States / Provinces Grid (e.g. All 33+ Indian States) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>{selectedCountry === 'india' ? (t.allStatesTerritories || 'All States & Union Territories in India') : (t.regionalMatrix || 'Regional Infrastructure Matrix')}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-mono">
                {filteredRegions.length} {t.regions || 'Regions'}
              </span>
            </h3>
          </div>

          {/* Scrollable Regions Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredRegions.map((region) => {
              const isSelected = region.id === selectedRegion.id;
              const country = BRICS_COUNTRIES.find((c) => c.id === region.countryId);

              return (
                <div
                  key={region.id}
                  onClick={() => handleSelectRegion(region.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#070F1E] border-cyan-400 shadow-lg ring-1 ring-cyan-500/50'
                      : 'bg-[#0A192F] border-slate-800 hover:border-blue-500/50 hover:bg-[#0D213E]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{country?.flag}</span>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {region.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-cyan-300/80 font-medium">
                        {region.nativeName}
                      </p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      region.vulnerabilityIndex > 75
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : region.vulnerabilityIndex > 60
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {t.deficitBudget || 'Deficit'}: ${region.deficitBudgetM}M
                    </span>
                  </div>

                  {/* Priority Sector Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
                    {getSectorIcon(region.topPrioritySector)}
                    <span className="font-medium text-xs">{tSector(region.topPrioritySector)}</span>
                  </div>

                  {/* Indicators Bar */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-[#070F1E]/60 p-2 rounded-xl border border-slate-800">
                    <div>
                      <span>{t.waterAccess || 'Water Access'}:</span>
                      <div className="font-semibold text-cyan-300">{region.waterAccessPercent}%</div>
                    </div>
                    <div>
                      <span>{t.gridUptime || 'Grid Uptime'}:</span>
                      <div className="font-semibold text-blue-300">{region.gridUptimePercent}%</div>
                    </div>
                  </div>

                  {/* Risk Alert Snippet */}
                  {region.riskAlert && (
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-1 italic">
                      "{region.riskAlert}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Region Deep Dive & Live Gemini AI Sentinel */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Selected Region Overview Card */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {currentCountryObj?.flag} {tCountry(currentCountryObj?.id || 'india')} • {t.sovereignTerritory || 'Sovereign Territory'}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedRegion.name}
                </h2>
                <p className="text-xs text-cyan-300/90 font-medium">
                  {selectedRegion.nativeName}
                </p>
              </div>

              <button
                onClick={() => onOpenBudgetSimulator(selectedRegion)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>{t.simulateCapex || 'Simulate CapEx'}</span>
              </button>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-[#070F1E] p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{t.population || 'Population'}</span>
                <span className="font-bold text-white text-sm">{(selectedRegion.population / 1000000).toFixed(1)}M</span>
              </div>
              <div className="bg-[#070F1E] p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{t.vulnerability || 'Vulnerability'}</span>
                <span className="font-bold text-rose-400 text-sm">{selectedRegion.vulnerabilityIndex}/100</span>
              </div>
              <div className="bg-[#070F1E] p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{t.activeDemands || 'Active Demands'}</span>
                <span className="font-bold text-cyan-300 text-sm">{selectedRegion.activeRequestsCount}</span>
              </div>
            </div>

            {/* Gemini AI Sentinel Live Briefing Card with Voice Synthesizer */}
            <div className="bg-[#070F1E] border border-blue-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow">
                    <div className="w-full h-full bg-[#070F1E] rounded-[6px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{t.geminiSentinel || 'Gemini Regional Sentinel'}</span>
                    <p className="text-[10px] text-slate-400">
                      Live DPI Synthesis • {currentLanguageInfo.nativeName} ({currentLanguageInfo.name})
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSpeakBriefing}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse shadow-md'
                      : 'bg-[#0A192F] text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/60'
                  }`}
                  title={t.speakText}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-bold">
                    {isSpeaking ? (speakingLanguageName ? `${t.speaking || 'Speaking'}...` : (t.stopAudio || 'Stop Audio')) : (t.listenInAiVoice || 'Listen in Gemini AI Voice')}
                  </span>
                </button>
              </div>

              {isAgentIntelLoading ? (
                <div className="p-3 text-xs text-cyan-300 flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing regional infrastructure intelligence...</span>
                </div>
              ) : (
                <div className="text-xs text-slate-300 leading-relaxed bg-[#0A192F] p-3 rounded-xl border border-slate-800 space-y-2">
                  <p>{agentIntelData?.briefingText || selectedRegion.riskAlert || agentIntelData?.primaryBottleneck}</p>
                  {agentIntelData?.citizenReassuranceBroadcast && (
                    <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-500/20 text-[11px] text-cyan-200 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{agentIntelData.citizenReassuranceBroadcast}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Associated Hotspots for this Region */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                {t.infrastructureHotspots || 'Direct Infrastructure Action Hotspots'} ({associatedHotspots.length})
              </span>

              {associatedHotspots.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No critical emergency hotspots flagged currently.</p>
              ) : (
                associatedHotspots.map((hotspot) => (
                  <div
                    key={hotspot.id}
                    className="bg-[#070F1E] border border-slate-800 hover:border-blue-500/40 p-3 rounded-xl flex items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white">{hotspot.title}</h5>
                      <span className="text-[10px] text-cyan-400 font-mono">${hotspot.estimatedBudgetM}M CapEx • {hotspot.estimatedBeneficiaries.toLocaleString()} Citizens</span>
                    </div>

                    <button
                      onClick={() => onGenerateDPRForHotspot(hotspot)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0"
                    >
                      <FileText className="w-3 h-3 text-sky-400" />
                      <span>DPR</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
