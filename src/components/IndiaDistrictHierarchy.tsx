import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  Droplets, 
  Activity, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ExternalLink,
  Award,
  Layers,
  ArrowRight,
  Compass
} from 'lucide-react';

export interface IndianDistrict {
  id: string;
  name: string;
  type: 'Aspirational District' | 'Municipal Corporation Ward' | 'Rural Panchayat Block';
  nitiAayogRank?: number;
  jalJeevanCoveragePercent: number;
  swachhBharatScore: number; // 0-100
  activeGrievancesCount: number;
  resolvedPercent: number;
  keyInfrastructureGap: string;
  recommendedDPI: string;
  population: string;
}

export interface IndianState {
  id: string;
  name: string;
  nativeName: string;
  capital: string;
  regionId: string;
  totalDistricts: number;
  cwmiWaterScore: number; // 0-100
  dpiReadinessScore: number; // 0-100
  activeGrievancesTotal: number;
  districts: IndianDistrict[];
}

export const INDIAN_STATES_DATA: IndianState[] = [
  {
    id: 'state-mh',
    name: 'Maharashtra',
    nativeName: 'महाराष्ट्र',
    capital: 'Mumbai',
    regionId: 'ind_maharashtra',
    totalDistricts: 36,
    cwmiWaterScore: 74,
    dpiReadinessScore: 92,
    activeGrievancesTotal: 184,
    districts: [
      {
        id: 'dist-bmc-gnorth',
        name: 'BMC Ward G-North (Dharavi / Dadar)',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 88,
        swachhBharatScore: 78,
        activeGrievancesCount: 42,
        resolvedPercent: 86,
        keyInfrastructureGap: 'Stormwater drainage capacity & community sanitation block refurbishment',
        recommendedDPI: 'OpenG2P Sanitation Telemetry & Microgrid Pumps',
        population: '1.2M'
      },
      {
        id: 'dist-pune-shivajinagar',
        name: 'Pune Municipal Corp - Shivajinagar Ward',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 94,
        swachhBharatScore: 91,
        activeGrievancesCount: 28,
        resolvedPercent: 92,
        keyInfrastructureGap: 'Potable water distribution pipeline pressure stabilization',
        recommendedDPI: 'IoT Pressure Transducers & SCADA Grid',
        population: '640K'
      },
      {
        id: 'dist-gadchiroli',
        name: 'Gadchiroli (NITI Aayog Aspirational District)',
        type: 'Aspirational District',
        nitiAayogRank: 14,
        jalJeevanCoveragePercent: 62,
        swachhBharatScore: 68,
        activeGrievancesCount: 36,
        resolvedPercent: 72,
        keyInfrastructureGap: 'All-weather road connectivity & solar cold-chain for tribal clinics',
        recommendedDPI: 'Decentralized Solar Microgrid & PMGSY Satellite Monitoring',
        population: '1.1M'
      }
    ]
  },
  {
    id: 'state-tn',
    name: 'Tamil Nadu',
    nativeName: 'தமிழ்நாடு',
    capital: 'Chennai',
    regionId: 'ind_tamilnadu',
    totalDistricts: 38,
    cwmiWaterScore: 82,
    dpiReadinessScore: 96,
    activeGrievancesTotal: 142,
    districts: [
      {
        id: 'dist-chennai-tapt',
        name: 'Greater Chennai Corp - Teynampet (Zone 9)',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 96,
        swachhBharatScore: 89,
        activeGrievancesCount: 24,
        resolvedPercent: 94,
        keyInfrastructureGap: 'Tertiary reverse osmosis treated water distribution lines',
        recommendedDPI: 'Smart Desalination Telemetry & Smart Meters',
        population: '820K'
      },
      {
        id: 'dist-ramanathapuram',
        name: 'Ramanathapuram (NITI Aayog Aspirational District)',
        type: 'Aspirational District',
        nitiAayogRank: 8,
        jalJeevanCoveragePercent: 68,
        swachhBharatScore: 74,
        activeGrievancesCount: 38,
        resolvedPercent: 81,
        keyInfrastructureGap: 'Coastal groundwater salinity intrusion mitigation & solar desalination',
        recommendedDPI: 'Solar Brackish Reverse Osmosis & Jal Jeevan IoT Hub',
        population: '1.4M'
      },
      {
        id: 'dist-coimbatore-north',
        name: 'Coimbatore North Industrial Corridor',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 92,
        swachhBharatScore: 93,
        activeGrievancesCount: 19,
        resolvedPercent: 95,
        keyInfrastructureGap: 'Heavy freight corridor pavement & industrial effluent separation',
        recommendedDPI: 'PM GatiShakti Multi-Modal Logistics Platform',
        population: '950K'
      }
    ]
  },
  {
    id: 'state-ka',
    name: 'Karnataka',
    nativeName: 'ಕರ್ನಾಟಕ',
    capital: 'Bengaluru',
    regionId: 'ind_karnataka',
    totalDistricts: 31,
    cwmiWaterScore: 76,
    dpiReadinessScore: 95,
    activeGrievancesTotal: 168,
    districts: [
      {
        id: 'dist-bbmp-142',
        name: 'BBMP Bengaluru - Ward 142 (Sunkenahalli / Outer Ring)',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 91,
        swachhBharatScore: 84,
        activeGrievancesCount: 52,
        resolvedPercent: 88,
        keyInfrastructureGap: 'Arterial rainwater stormwater drain desilting & pothole restoration',
        recommendedDPI: 'AI Vision Drone Survey & Automated Pothole Patching',
        population: '750K'
      },
      {
        id: 'dist-mandya-rural',
        name: 'Mandya Rural Agrarian Panchayat Block',
        type: 'Rural Panchayat Block',
        jalJeevanCoveragePercent: 78,
        swachhBharatScore: 81,
        activeGrievancesCount: 34,
        resolvedPercent: 85,
        keyInfrastructureGap: 'Cauvery irrigation feeder channel desilting & solar drip pumping',
        recommendedDPI: 'Command Area Drone Telemetry & Smart Solar Pumps',
        population: '890K'
      },
      {
        id: 'dist-yadgir',
        name: 'Yadgir (NITI Aayog Aspirational District)',
        type: 'Aspirational District',
        nitiAayogRank: 22,
        jalJeevanCoveragePercent: 59,
        swachhBharatScore: 66,
        activeGrievancesCount: 45,
        resolvedPercent: 71,
        keyInfrastructureGap: 'Arsenic/Fluoride filtration plants for 42 rural habited villages',
        recommendedDPI: 'Jal Jeevan Mission IoT Fluoride Telemetry',
        population: '1.2M'
      }
    ]
  },
  {
    id: 'state-br',
    name: 'Bihar',
    nativeName: 'बिहार',
    capital: 'Patna',
    regionId: 'ind_bihar',
    totalDistricts: 38,
    cwmiWaterScore: 58,
    dpiReadinessScore: 84,
    activeGrievancesTotal: 215,
    districts: [
      {
        id: 'dist-patna-kankarbagh',
        name: 'Patna Municipal Corp - Kankarbagh Ward 32',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 79,
        swachhBharatScore: 71,
        activeGrievancesCount: 64,
        resolvedPercent: 74,
        keyInfrastructureGap: 'High-capacity stormwater sump pumps & drainage embankment reconstruction',
        recommendedDPI: 'Automated Dewatering Telemetry & SCADA Sump Stations',
        population: '920K'
      },
      {
        id: 'dist-samastipur',
        name: 'Samastipur (Chakmehsi & Flood Basin Block)',
        type: 'Rural Panchayat Block',
        jalJeevanCoveragePercent: 64,
        swachhBharatScore: 65,
        activeGrievancesCount: 58,
        resolvedPercent: 69,
        keyInfrastructureGap: 'Burigandak river flood culverts & arsenic water filtration kiosks',
        recommendedDPI: 'Precast Box-Culvert Fast-Track & Har Ghar Nal Ka Jal',
        population: '1.8M'
      },
      {
        id: 'dist-nawada',
        name: 'Nawada (NITI Aayog Aspirational District)',
        type: 'Aspirational District',
        nitiAayogRank: 19,
        jalJeevanCoveragePercent: 57,
        swachhBharatScore: 62,
        activeGrievancesCount: 48,
        resolvedPercent: 68,
        keyInfrastructureGap: 'Semi-arid groundwater recharge check dams & rural solar clinics',
        recommendedDPI: 'Soil Aquifer Recharge Telemetry & Solar Cold-Chain',
        population: '2.2M'
      }
    ]
  },
  {
    id: 'state-up',
    name: 'Uttar Pradesh',
    nativeName: 'उत्तर प्रदेश',
    capital: 'Lucknow',
    regionId: 'ind_uttarpradesh',
    totalDistricts: 75,
    cwmiWaterScore: 68,
    dpiReadinessScore: 89,
    activeGrievancesTotal: 260,
    districts: [
      {
        id: 'dist-varanasi-cantt',
        name: 'Varanasi Municipal Corp - Cantt & Ghat Zone',
        type: 'Municipal Corporation Ward',
        jalJeevanCoveragePercent: 87,
        swachhBharatScore: 88,
        activeGrievancesCount: 39,
        resolvedPercent: 91,
        keyInfrastructureGap: 'Heritage electrical cable undergrounding & Ganga sewage interception',
        recommendedDPI: 'Smart City SCADA & Real-Time Effluent Quality Monitors',
        population: '1.4M'
      },
      {
        id: 'dist-chandauli',
        name: 'Chandauli (NITI Aayog Aspirational District)',
        type: 'Aspirational District',
        nitiAayogRank: 11,
        jalJeevanCoveragePercent: 66,
        swachhBharatScore: 72,
        activeGrievancesCount: 44,
        resolvedPercent: 78,
        keyInfrastructureGap: 'Canal tail-end irrigation water flow & rural road connectivity',
        recommendedDPI: 'PMKSY Canal Telemetry & OpenG2P Contractor Audit',
        population: '1.9M'
      }
    ]
  }
];

interface IndiaDistrictHierarchyProps {
  onSelectDistrict?: (district: IndianDistrict, state: IndianState) => void;
  onTrackOnMap?: (regionId: string) => void;
}

export const IndiaDistrictHierarchy: React.FC<IndiaDistrictHierarchyProps> = ({
  onSelectDistrict,
  onTrackOnMap
}) => {
  const [selectedState, setSelectedState] = useState<IndianState>(INDIAN_STATES_DATA[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<IndianDistrict>(INDIAN_STATES_DATA[0].districts[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStates = INDIAN_STATES_DATA.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nativeName.includes(searchQuery) ||
    s.districts.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full bg-[#0C1A32] rounded-3xl border border-slate-700/80 p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-orange-950 border border-orange-600/50 text-orange-400">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
              Pan-India Governance Hierarchy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            National ➔ State ➔ NITI Aayog District & Ward Drill-Down
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Proven multi-tier depth across India: From metro municipal wards (BMC Mumbai, BBMP Bengaluru) to NITI Aayog Aspirational Districts and rural gram panchayats.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state, district, ward..."
            className="w-full bg-slate-900 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* State Selector Tabs */}
      <div className="my-6">
        <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Select State / UT ({INDIAN_STATES_DATA.length} Major Jurisdictions)</span>
          <span className="text-cyan-400 font-mono">NITI Aayog Aligned</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {filteredStates.map((st) => {
            const isSelected = st.id === selectedState.id;
            return (
              <div
                key={st.id}
                onClick={() => {
                  setSelectedState(st);
                  setSelectedDistrict(st.districts[0]);
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-cyan-300">{st.nativeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{st.totalDistricts} Dist.</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{st.name}</h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">CWMI: {st.cwmiWaterScore}/100</span>
                  <span className="text-orange-400 font-mono font-bold">{st.activeGrievancesTotal} Active</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State Aggregates & District Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Selected State Profile Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                State Governance Profile
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold">
                DPI Ready ({selectedState.dpiReadinessScore}%)
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mt-1">
              {selectedState.name} ({selectedState.nativeName})
            </h3>
            <p className="text-xs text-slate-400">
              State Capital: <strong className="text-slate-200">{selectedState.capital}</strong> • 3-Tier Panchayati Raj & ULB Integrated
            </p>

            {/* State High-Level Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">NITI Aayog CWMI Score</span>
                <span className="text-lg font-bold text-cyan-300 font-mono">{selectedState.cwmiWaterScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Active Civic Grievances</span>
                <span className="text-lg font-bold text-orange-400 font-mono">{selectedState.activeGrievancesTotal}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onTrackOnMap) onTrackOnMap(selectedState.regionId);
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Compass className="w-4 h-4" />
            <span>Open {selectedState.name} on Live GIS Map</span>
          </button>
        </div>

        {/* Right: District & Ward Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Districts & Corporation Wards in {selectedState.name} ({selectedState.districts.length})</span>
            <span className="text-cyan-400 font-mono">Ward-Level Resolution Metrics</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {selectedState.districts.map((dist) => {
              const isSelected = dist.id === selectedDistrict.id;
              return (
                <div
                  key={dist.id}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/80 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{dist.name}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                          dist.type === 'Aspirational District'
                            ? 'bg-amber-950 text-amber-300 border-amber-600'
                            : dist.type === 'Municipal Corporation Ward'
                              ? 'bg-blue-950 text-cyan-300 border-blue-600'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                        }`}>
                          {dist.type} {dist.nitiAayogRank ? `(Rank #${dist.nitiAayogRank})` : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Pop: {dist.population} • JJM Coverage: <strong className="text-cyan-300">{dist.jalJeevanCoveragePercent}%</strong> • Swachh Bharat: <strong className="text-emerald-300">{dist.swachhBharatScore}/100</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-xs">
                        <span className="text-orange-400 font-mono font-bold block">{dist.activeGrievancesCount} Reports</span>
                        <span className="text-[10px] text-emerald-400">{dist.resolvedPercent}% Resolved</span>
                      </div>
                    </div>
                  </div>

                  {/* Infrastructure Deficit & Recommended DPI */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="text-slate-300 text-[11px]">
                      <strong className="text-slate-100">Primary Gap: </strong>
                      {dist.keyInfrastructureGap}
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold shrink-0">
                      DPI: {dist.recommendedDPI}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
