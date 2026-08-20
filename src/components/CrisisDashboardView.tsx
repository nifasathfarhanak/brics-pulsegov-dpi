import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  Flame,
  CheckCircle2,
  Clock,
  Radio,
  Volume2,
  VolumeX,
  RefreshCw,
  Send,
  Zap,
  Filter,
  Search,
  Building2,
  MapPin,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  HeartPulse,
  Droplets,
  ZapOff,
  Navigation,
  Sparkles,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BRICS_COUNTRIES } from '../data/bricsData';

interface StoredComplaint {
  ComplaintID: string;
  Timestamp: string;
  UserLanguage: string;
  UserLanguageCode: string;
  MinisterialDomain: string;
  UrgencyLevel: string;
  ImageVerified: string;
  GPS_Coordinates: string;
  ResolutionPlan: string;
  ComplaintDetails: string;
  ResolutionStrategy?: string;
  Sentiment?: string;
  EmergencyEscalation?: boolean;
  Status?: string;
  PolicyImpact?: {
    shortTerm?: string;
    longTerm?: string;
    economicMultiplier?: string;
    sdgAlignment?: string[];
  };
  Location?: {
    country?: string;
    region?: string;
  };
  AuditTrail?: {
    assignedDepartment?: string;
    slaDays?: number;
    sovereignTrackingCode?: string;
  };
}

interface CrisisDashboardViewProps {
  onOpenDPRStudio?: (complaint?: StoredComplaint) => void;
  onOpenGISHotspot?: (regionName?: string) => void;
}

export const CrisisDashboardView: React.FC<CrisisDashboardViewProps> = ({
  onOpenDPRStudio,
  onOpenGISHotspot,
}) => {
  const { speak, isSpeaking, stopSpeaking, currentLanguage } = useLanguage();

  const [complaints, setComplaints] = useState<StoredComplaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics' | 'dispatch-log'>('feed');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Fetch real complaints from backend API
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ministerial-complaints');
      if (res.ok) {
        const data = await res.json();
        if (data.complaints) {
          setComplaints(data.complaints);
        }
      }
    } catch (err) {
      console.warn('Error fetching crisis complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 20000); // 20s auto-refresh
    return () => clearInterval(interval);
  }, []);

  // Handle Crisis Action (Dispatch Emergency, Fast Track CapEx, Resolve)
  const handleComplaintAction = async (complaintId: string, actionType: string) => {
    try {
      const res = await fetch('/api/ministerial-complaints/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintId, actionType }),
      });
      if (res.ok) {
        setActionSuccessMsg(`Directive executed: Action [${actionType.replace('_', ' ').toUpperCase()}] dispatched for #${complaintId}`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
        fetchComplaints();
      }
    } catch (e) {
      console.warn('Failed to post crisis action:', e);
    }
  };

  // Play audio in citizen's native language using guaranteed 100% TTS
  const handleListenCrisis = (complaint: StoredComplaint) => {
    if (isSpeaking && currentlySpeakingId === complaint.ComplaintID) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      setCurrentlySpeakingId(complaint.ComplaintID);
      const textToSpeak = `Grievance Report from ${complaint.Location?.region || 'Territory'}, ${complaint.Location?.country || 'BRICS Member'}. Sector: ${complaint.MinisterialDomain}. Details: ${complaint.ComplaintDetails}. Gemini Sovereign Directive: ${complaint.ResolutionPlan || complaint.ResolutionStrategy || 'Under active triage.'}`;
      speak(textToSpeak, complaint.UserLanguageCode || currentLanguage, {
        onEnd: () => setCurrentlySpeakingId(null),
      });
    }
  };

  // Filter complaints based on user matrix selection
  const filteredComplaints = complaints.filter((c) => {
    if (selectedDomain !== 'all' && c.MinisterialDomain.toLowerCase() !== selectedDomain.toLowerCase()) {
      return false;
    }
    if (selectedUrgency !== 'all') {
      if (selectedUrgency === 'critical' && c.UrgencyLevel.toLowerCase() !== 'critical') return false;
      if (selectedUrgency === 'high' && c.UrgencyLevel.toLowerCase() !== 'high') return false;
      if (selectedUrgency === 'medium' && c.UrgencyLevel.toLowerCase() !== 'medium') return false;
    }
    if (selectedCountry !== 'all' && c.Location?.country?.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDetails = c.ComplaintDetails.toLowerCase().includes(q);
      const matchId = c.ComplaintID.toLowerCase().includes(q);
      const matchLocation = `${c.Location?.region} ${c.Location?.country}`.toLowerCase().includes(q);
      const matchDomain = c.MinisterialDomain.toLowerCase().includes(q);
      if (!matchDetails && !matchId && !matchLocation && !matchDomain) return false;
    }
    return true;
  });

  // Calculate high-level stats
  const totalCount = complaints.length;
  const criticalCount = complaints.filter((c) => c.UrgencyLevel === 'Critical' || c.EmergencyEscalation).length;
  const inProgressCount = complaints.filter((c) => c.Status?.includes('In Progress') || c.Status?.includes('Dispatched')).length;
  const verifiedPhotoCount = complaints.filter((c) => c.ImageVerified === 'True').length;

  return (
    <div id="crisis-dashboard-view" className="min-h-screen bg-[#071326] text-slate-100 p-4 md:p-6 lg:p-8">
      {/* Top Header & Sovereign Authority Bar */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="bg-red-950/80 text-red-300 text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-red-800/60 uppercase tracking-wider">
                Sovereign Real-Time Crisis Grid
              </span>
              <span className="bg-blue-950 text-blue-300 text-[11px] font-mono px-2 py-0.5 rounded border border-blue-800/60">
                100% Zero-Debt Open Source Triage
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
              Live Ministerial Crisis Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time multi-sovereign grievance analytics, urgent triage workflows, and autonomous DPI field dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="refresh-crisis-grid-btn"
              onClick={fetchComplaints}
              disabled={loading}
              className="flex items-center gap-1.5 bg-[#1E3A8A] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition border border-blue-500/40 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* Action Flash Message */}
        {actionSuccessMsg && (
          <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* 4 Core Crisis KPI Cards (Strict Navy/Royal Blue/Slate Theme) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Registered Complaints */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Grievances</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{totalCount}</span>
              <span className="text-xs text-blue-300 font-medium">Logged in Sovereign DB</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>100% immutable audit trail</span>
            </div>
          </div>

          {/* Card 2: Critical Priority (9/10) */}
          <div className="bg-[#0A192F] border border-red-900/60 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-300 uppercase tracking-wider">Critical Escalations</span>
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-400 font-mono">{criticalCount}</span>
              <span className="text-xs text-red-300 bg-red-950/60 border border-red-800 px-1.5 py-0.5 rounded font-mono">
                Urgency 9-10/10
              </span>
            </div>
            <div className="mt-3 text-[11px] text-red-300/80 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
              <span>Requires immediate ministerial dispatch</span>
            </div>
          </div>

          {/* Card 3: In-Progress / Dispatched */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Active Field Action</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400 font-mono">{inProgressCount}</span>
              <span className="text-xs text-slate-300">Units Deployed</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Mean SLA target: &lt; 72 Hours</span>
            </div>
          </div>

          {/* Card 4: Multimodal Forensic Verification */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Forensic Proof</span>
              <FileCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-400 font-mono">{verifiedPhotoCount}</span>
              <span className="text-xs text-slate-300">Photo & GPS Locks</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Gemini 2.5 Flash Vision verified</span>
            </div>
          </div>
        </div>

        {/* Filter and Triage Matrix Controls */}
        <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, keyword, territory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#071326] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Country Filter */}
              <select
                id="crisis-country-filter"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-[#071326] border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="all">🌍 All BRICS Nations</option>
                {BRICS_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>

              {/* Urgency Filter */}
              <select
                id="crisis-urgency-filter"
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="bg-[#071326] border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="all">⚡ All Urgencies</option>
                <option value="critical">🚨 Critical (9-10)</option>
                <option value="high">⚠️ High Priority</option>
                <option value="medium">🔹 Medium</option>
              </select>

              {/* Domain Filter */}
              <select
                id="crisis-domain-filter"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-[#071326] border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="all">🏛️ All Sectors</option>
                <option value="water">💧 Water & Sanitation</option>
                <option value="energy">⚡ Energy & Microgrids</option>
                <option value="infrastructure">🏗️ Infrastructure & Roads</option>
                <option value="health">🏥 Health & Clinics</option>
                <option value="digital public infrastructure (dpi)">🌐 Digital Public Infrastructure</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Triage Incident Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              <span>Real-Time Incident Stream ({filteredComplaints.length} Records)</span>
            </h2>
            <span className="text-xs text-slate-400">
              Sorted by urgency rating & submission freshness
            </span>
          </div>

          {loading && complaints.length === 0 ? (
            <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
              <p className="font-semibold text-sm">Querying Sovereign Grievance Database...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-[#0A192F] border border-slate-800 rounded-xl p-12 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="font-semibold text-sm text-slate-200">No active incidents matching the selected filter criteria.</p>
              <p className="text-xs text-slate-500 mt-1">All municipal sectors in this category are operating within standard SLA limits.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => {
                const isCritical = complaint.UrgencyLevel === 'Critical' || complaint.EmergencyEscalation;
                const isItemSpeaking = isSpeaking && currentlySpeakingId === complaint.ComplaintID;

                return (
                  <div
                    key={complaint.ComplaintID}
                    id={`crisis-card-${complaint.ComplaintID}`}
                    className={`bg-[#0A192F] border rounded-xl p-5 transition hover:border-slate-600 shadow-md ${
                      isCritical ? 'border-red-800/80 bg-gradient-to-r from-red-950/20 via-[#0A192F] to-[#0A192F]' : 'border-slate-800'
                    }`}
                  >
                    {/* Top Row: Meta Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* ID Tag */}
                        <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-800/70 px-2 py-0.5 rounded">
                          #{complaint.ComplaintID}
                        </span>

                        {/* Urgency Badge */}
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            isCritical
                              ? 'bg-red-950/90 text-red-300 border-red-600 animate-pulse'
                              : complaint.UrgencyLevel === 'High'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {isCritical && <AlertTriangle className="w-3 h-3 text-red-400" />}
                          <span>{complaint.UrgencyLevel.toUpperCase()} (URGENCY {isCritical ? '9.8' : '7.0'}/10)</span>
                        </span>

                        {/* Domain Tag */}
                        <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-700 font-medium">
                          {complaint.MinisterialDomain}
                        </span>

                        {/* Location */}
                        <span className="text-xs text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span>
                            {complaint.Location?.region || 'Region'}, {complaint.Location?.country || 'BRICS'}
                          </span>
                        </span>
                      </div>

                      {/* Right Tag: Status */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                          <Activity className="w-3 h-3 animate-spin" />
                          <span>{complaint.Status || 'Registered'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Grievance Content & Forensic Badges */}
                    <div className="my-3 space-y-2">
                      <p className="text-sm font-medium text-slate-100 leading-relaxed">
                        {complaint.ComplaintDetails}
                      </p>

                      {/* Forensic Badges */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(complaint.Timestamp).toLocaleString()}</span>
                        </span>

                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-blue-300">
                          Language: {complaint.UserLanguage} ({complaint.UserLanguageCode})
                        </span>

                        {complaint.ImageVerified === 'True' && (
                          <span className="bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                            <FileCheck className="w-3 h-3 text-cyan-400" />
                            <span>Photo Evidence Verified</span>
                          </span>
                        )}

                        {complaint.GPS_Coordinates && (
                          <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
                            GPS: {complaint.GPS_Coordinates}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Gemini AI Resolution Directive Box */}
                    <div className="bg-[#071326] border border-blue-900/50 rounded-lg p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-blue-300 font-semibold border-b border-blue-950 pb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          <span>Gemini Sovereign Strategic Resolution Directive</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          SLA Target: {complaint.AuditTrail?.slaDays || 7} Days
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {complaint.ResolutionPlan || complaint.ResolutionStrategy || 'Autonomous triage and contractor dispatch queued.'}
                      </p>

                      {/* Policy Impact Indicators */}
                      {complaint.PolicyImpact && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-300">
                            <span className="text-blue-400 font-bold block mb-0.5">Short-Term Relief:</span>
                            <span>{complaint.PolicyImpact.shortTerm}</span>
                          </div>
                          <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-300">
                            <span className="text-emerald-400 font-bold block mb-0.5">
                              Long-Term Multiplier ({complaint.PolicyImpact.economicMultiplier || '3.5x'}):
                            </span>
                            <span>{complaint.PolicyImpact.longTerm}</span>
                          </div>
                        </div>
                      )}

                      {/* Directorate Assignment */}
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>{complaint.AuditTrail?.assignedDepartment || 'Ministry of Digital Public Infrastructure'}</span>
                        </span>
                        <span className="font-mono text-slate-500 text-[10px]">
                          Audit Code: {complaint.AuditTrail?.sovereignTrackingCode || complaint.ComplaintID}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Directive Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800">
                      {/* Left: Multilingual TTS Audio Button */}
                      <button
                        id={`btn-listen-${complaint.ComplaintID}`}
                        onClick={() => handleListenCrisis(complaint)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                          isItemSpeaking
                            ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {isItemSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-300" />
                            <span>Stop Speaking ({complaint.UserLanguage})</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                            <span>Listen in Citizen Voice ({complaint.UserLanguage})</span>
                          </>
                        )}
                      </button>

                      {/* Right: Ministerial Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Dispatch Emergency Button */}
                        <button
                          id={`btn-dispatch-${complaint.ComplaintID}`}
                          onClick={() => handleComplaintAction(complaint.ComplaintID, 'dispatch_emergency')}
                          className="flex items-center gap-1 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-500/50 shadow-sm transition"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Dispatch Emergency Unit</span>
                        </button>

                        {/* Fast Track CapEx */}
                        <button
                          id={`btn-capex-${complaint.ComplaintID}`}
                          onClick={() => handleComplaintAction(complaint.ComplaintID, 'approve_capex')}
                          className="flex items-center gap-1 bg-[#1E3A8A] hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-500/40 shadow-sm transition"
                        >
                          <TrendingUp className="w-3 h-3 text-cyan-300" />
                          <span>Fast-Track CapEx</span>
                        </button>

                        {/* Open in DPR Studio */}
                        {onOpenDPRStudio && (
                          <button
                            id={`btn-dpr-${complaint.ComplaintID}`}
                            onClick={() => onOpenDPRStudio(complaint)}
                            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
                            title="Generate DPR Blueprint & Gantt Schedule"
                          >
                            <span>DPR Studio</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}

                        {/* Mark Resolved */}
                        <button
                          id={`btn-resolve-${complaint.ComplaintID}`}
                          onClick={() => handleComplaintAction(complaint.ComplaintID, 'resolve')}
                          className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-emerald-700/60 transition"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Resolve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
