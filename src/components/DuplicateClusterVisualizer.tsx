import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Search, 
  MapPin, 
  ChevronRight, 
  Split, 
  Merge,
  Filter,
  Activity,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface DuplicateComplaint {
  id: string;
  citizenText: string;
  language: string;
  timestamp: string;
  similarityScore: number; // 0.0 - 1.0
  distanceMeters: number;
  channel: string;
}

interface MasterCluster {
  id: string;
  title: string;
  location: string;
  sector: string;
  totalRawComplaints: number;
  aggregateAffectedPop: number;
  clusterRadiusMeters: number;
  masterUrgency: 'Critical' | 'High' | 'Medium';
  assignedContractor: string;
  estimatedSavingsINR: string;
  complaints: DuplicateComplaint[];
}

const SAMPLE_CLUSTERS: MasterCluster[] = [
  {
    id: 'cluster-water-1',
    title: 'Cluster #MC-904: Major Potable Water Main Conduit Fracture & Arterial Flooding',
    location: 'Shivajinagar Junction & Ward 42, Pune, Maharashtra',
    sector: 'Water & Sanitation',
    totalRawComplaints: 48,
    aggregateAffectedPop: 6200,
    clusterRadiusMeters: 180,
    masterUrgency: 'Critical',
    assignedContractor: 'Executive Engineer, Water Supply & Pipeline Maintenance Div 4',
    estimatedSavingsINR: '₹4.8 Lakhs (Prevented 47 redundant dispatch tickets)',
    complaints: [
      {
        id: 'c-101',
        citizenText: 'Shivajinagar chowk par drinking water pipe burst ho gaya hai, road par 2 feet paani hai.',
        language: 'Hindi / Hinglish',
        timestamp: '12 mins ago',
        similarityScore: 0.96,
        distanceMeters: 15,
        channel: 'WhatsApp DPI Bot'
      },
      {
        id: 'c-102',
        citizenText: 'मोठी पाणी लाईन फुटली आहे, ट्रॅफिक पूर्ण जाम झाले आहे. त्वरित दुरुस्ती करा.',
        language: 'Marathi',
        timestamp: '18 mins ago',
        similarityScore: 0.94,
        distanceMeters: 35,
        channel: 'Citizen Mobile App'
      },
      {
        id: 'c-103',
        citizenText: 'Potable water main ruptured opposite Central Bank, flooding basement shops and cutting water supply.',
        language: 'English',
        timestamp: '25 mins ago',
        similarityScore: 0.92,
        distanceMeters: 60,
        channel: 'Web Grievance Portal'
      },
      {
        id: 'c-104',
        citizenText: 'Nal me paani band ho gaya hai aur raste par paani beh raha hai bohot tez.',
        language: 'Hindi',
        timestamp: '32 mins ago',
        similarityScore: 0.89,
        distanceMeters: 110,
        channel: 'Gov Sandes SMS'
      },
      {
        id: 'c-105',
        citizenText: 'Deep sinkhole forming near bus stop due to underground pipe rupture.',
        language: 'English',
        timestamp: '40 mins ago',
        similarityScore: 0.87,
        distanceMeters: 140,
        channel: 'WhatsApp DPI Bot'
      }
    ]
  },
  {
    id: 'cluster-grid-2',
    title: 'Cluster #MC-912: 11kV Distribution Transformer Explosion & Substation Outage',
    location: 'Sector 9 Industrial Zone, Nagpur, Maharashtra',
    sector: 'Energy & Microgrids',
    totalRawComplaints: 64,
    aggregateAffectedPop: 9800,
    clusterRadiusMeters: 250,
    masterUrgency: 'Critical',
    assignedContractor: 'MSEDCL Emergency Grid Response Team',
    estimatedSavingsINR: '₹6.2 Lakhs (Prevented 63 redundant emergency calls)',
    complaints: [
      {
        id: 'c-201',
        citizenText: 'Transformer me aag lag gayi hai aur poore mohalle ki light chali gayi hai.',
        language: 'Hindi',
        timestamp: '8 mins ago',
        similarityScore: 0.97,
        distanceMeters: 20,
        channel: 'WhatsApp DPI Bot'
      },
      {
        id: 'c-202',
        citizenText: 'High voltage blast in power transformer, cold storage hospital vaccines at risk.',
        language: 'English',
        timestamp: '14 mins ago',
        similarityScore: 0.95,
        distanceMeters: 45,
        channel: 'Authority Hotline'
      },
      {
        id: 'c-203',
        citizenText: 'विद्युत रोहित्र जळाले आहे, परिसरात प्रचंड अंधार पसरला आहे.',
        language: 'Marathi',
        timestamp: '22 mins ago',
        similarityScore: 0.93,
        distanceMeters: 90,
        channel: 'Telegram DPI Bot'
      }
    ]
  },
  {
    id: 'cluster-bridge-3',
    title: 'Cluster #MC-925: Heavy Inundation & Culvert Scour on State Highway 14',
    location: 'Chakmehsi Culvert, Samastipur / Patna Corridor, Bihar',
    sector: 'Transport & Connectivity',
    totalRawComplaints: 82,
    aggregateAffectedPop: 14500,
    clusterRadiusMeters: 400,
    masterUrgency: 'Critical',
    assignedContractor: 'Bihar State Bridge Construction Corp (BRPNNL)',
    estimatedSavingsINR: '₹8.1 Lakhs (Consolidated into 1 Emergency Fast-Track DPR)',
    complaints: [
      {
        id: 'c-301',
        citizenText: 'Baadh ke paani se culvert bridge toot gaya hai, ambulance cross nahi kar pa rahi.',
        language: 'Hindi',
        timestamp: '5 mins ago',
        similarityScore: 0.98,
        distanceMeters: 10,
        channel: 'WhatsApp DPI Bot'
      },
      {
        id: 'c-302',
        citizenText: 'Road connection between 8 villages cut off due to washed-away approach slab.',
        language: 'English',
        timestamp: '19 mins ago',
        similarityScore: 0.94,
        distanceMeters: 80,
        channel: 'Web Grievance Portal'
      }
    ]
  }
];

export const DuplicateClusterVisualizer: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<MasterCluster>(SAMPLE_CLUSTERS[0]);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(85);
  const [spatialRadius, setSpatialRadius] = useState<number>(250);

  // Overall Statistics across all clusters
  const totalRawComplaints = SAMPLE_CLUSTERS.reduce((acc, c) => acc + c.totalRawComplaints, 0);
  const totalMasterTickets = SAMPLE_CLUSTERS.length;
  const duplicateTicketsEliminated = totalRawComplaints - totalMasterTickets;
  const deduplicationRate = ((duplicateTicketsEliminated / totalRawComplaints) * 100).toFixed(1);

  return (
    <div className="w-full bg-[#0C1A32] rounded-3xl border border-slate-700/80 p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-600/50 text-indigo-400">
              <Merge className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
              Gemini Semantic Deduplication Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Semantic Duplicate Clustering & Dispatch Inspector
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            When a major infrastructure failure occurs, dozens of citizens submit reports in different languages. PulseGov uses Gemini vector embeddings and spatial radiuses to merge them into 1 actionable Master Ticket.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-indigo-500/40 text-xs font-mono text-indigo-300 shrink-0">
          <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Vector Cosine Clustering Active</span>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-6">
        
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-semibold">Raw Citizen Complaints</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
            {totalRawComplaints}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-channel & multi-lingual</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-semibold">Master Hotspot Tickets</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-2">
            {totalMasterTickets}
          </div>
          <div className="text-[11px] text-cyan-300/80 mt-1">1 unified work order per incident</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/60 bg-emerald-950/20 flex flex-col justify-between">
          <div className="text-xs text-emerald-400 font-semibold">Deduplication Efficiency</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono mt-2">
            {deduplicationRate}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">{duplicateTicketsEliminated} redundant tickets merged</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-900/60 bg-amber-950/20 flex flex-col justify-between">
          <div className="text-xs text-amber-400 font-semibold">Municipal Budget Saved</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-2">
            ₹19.1L
          </div>
          <div className="text-[11px] text-amber-400 mt-1">Zero redundant contractor dispatches</div>
        </div>

      </div>

      {/* Interactive Threshold & Radius Sliders */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-6">
          
          {/* Spatial Radius Slider */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Spatial Cluster Radius:
              </span>
              <span className="text-cyan-300 font-mono font-bold">{spatialRadius} meters</span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={25}
              value={spatialRadius}
              onChange={(e) => setSpatialRadius(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Semantic Similarity Threshold Slider */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Embedding Similarity Threshold:
              </span>
              <span className="text-indigo-300 font-mono font-bold">{similarityThreshold}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={98}
              step={1}
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
            />
          </div>

        </div>

        <div className="text-right shrink-0 hidden lg:block">
          <div className="text-[10px] text-slate-400 font-mono">Algorithm: Gemini text-embedding-004</div>
          <div className="text-xs text-emerald-400 font-bold">Auto-Calibrated for ISO-37120</div>
        </div>
      </div>

      {/* Cluster Selector & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Cluster List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Deduplicated Clusters ({SAMPLE_CLUSTERS.length})
          </div>

          {SAMPLE_CLUSTERS.map((cluster) => {
            const isSelected = cluster.id === selectedCluster.id;
            return (
              <div
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/80 border-cyan-400 shadow-lg ring-1 ring-cyan-400/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold font-mono border border-cyan-800">
                      {cluster.totalRawComplaints} Reports Merged
                    </span>
                    <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                      {cluster.masterUrgency}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                    {cluster.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    {cluster.location}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{cluster.sector}</span>
                  <span className="text-emerald-400 font-semibold">{cluster.estimatedSavingsINR}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Master Ticket Details & Individual Raw Submissions */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Master Unified Work Order Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0D1F3D] to-[#0A192F] border border-cyan-500/40 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Synthesized Master Work Order
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">
                  {selectedCluster.title}
                </h3>
              </div>

              <div className="px-3 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold shrink-0">
                {selectedCluster.totalRawComplaints} Verified Sources
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
              <div className="p-2.5 rounded-xl bg-black/30 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Incident Location</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">{selectedCluster.location}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Aggregate Beneficiaries</span>
                <span className="font-bold text-cyan-300 font-mono block mt-0.5">{selectedCluster.aggregateAffectedPop.toLocaleString()} Citizens</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Assigned Directorate</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">{selectedCluster.assignedContractor}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <strong className="text-cyan-400">Gemini Synthesis: </strong>
              Consolidated {selectedCluster.totalRawComplaints} citizen grievances filed across WhatsApp, Mobile App, and Web into a single dispatch ticket. All reports describe the same structural failure within a {selectedCluster.clusterRadiusMeters}m spatial radius with &gt;92% semantic embedding match.
            </div>
          </div>

          {/* Individual Citizen Raw Reports in the Cluster */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Sample Raw Citizen Reports in this Cluster ({selectedCluster.complaints.length} shown)</span>
              <span className="text-indigo-400 font-mono">Semantic Cosine Match</span>
            </div>

            {selectedCluster.complaints.map((comp) => (
              <div
                key={comp.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {comp.language}
                    </span>
                    <span className="text-[10px] text-slate-400">{comp.channel}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-400">{comp.timestamp}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{comp.distanceMeters}m from center</span>
                  </div>
                  <p className="text-slate-200 italic">
                    "{comp.citizenText}"
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-xs shrink-0">
                  {(comp.similarityScore * 100).toFixed(0)}% Match
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
