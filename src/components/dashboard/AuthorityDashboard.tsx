import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ContaminationAlert, 
  CitizenServiceRequest, 
  AIInfrastructureInsight, 
  UserRole, 
  UserProfile 
} from '../../types';
import { 
  INITIAL_CONTAMINATION_ALERTS, 
  INITIAL_CITIZEN_REQUESTS, 
  AI_INFRASTRUCTURE_INSIGHTS 
} from '../../data/governanceData';
import { GeospatialContaminationMap } from './GeospatialContaminationMap';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Activity, 
  Search, 
  Filter, 
  Layers, 
  ArrowUpRight, 
  SlidersHorizontal,
  UserCheck,
  UserX,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';

interface AuthorityDashboardProps {
  onOpenDPRStudio?: (title: string, budgetM: number, sector: string) => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({ onOpenDPRStudio }) => {
  const { authState, allUsers, toggleUserStatus, changeUserRole } = useAuth();
  const user = authState.user;

  // Tabs inside Authority Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'ai-insights' | 'user-mgmt'>('overview');

  // Governance Requests State
  const [requests, setRequests] = useState<CitizenServiceRequest[]>(INITIAL_CITIZEN_REQUESTS);
  const [alerts, setAlerts] = useState<ContaminationAlert[]>(INITIAL_CONTAMINATION_ALERTS);
  const [insights] = useState<AIInfrastructureInsight[]>(AI_INFRASTRUCTURE_INSIGHTS);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live Sync Active');

  // Real-time synchronization simulation (Firebase-like listener)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) => {
        if (prev.length === 0) return prev;
        const randIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        updated[randIndex] = {
          ...updated[randIndex],
          upvotes: updated[randIndex].upvotes + 1,
        };
        return updated;
      });
      setLastSyncTime(`Live Sync: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal / Action State for Approving Request with CapEx
  const [actionRequest, setActionRequest] = useState<CitizenServiceRequest | null>(null);
  const [allocatedBudgetInput, setAllocatedBudgetInput] = useState<number>(5.0);
  const [authorityNoteInput, setAuthorityNoteInput] = useState<string>('');

  // Handle Approve with CapEx
  const handleApproveCapEx = (req: CitizenServiceRequest) => {
    setActionRequest(req);
    setAllocatedBudgetInput(req.allocatedBudgetM || 4.5);
    setAuthorityNoteInput(`Allocated under National Priority Scheme. Direct implementation to begin immediately.`);
  };

  const handleConfirmApproval = () => {
    if (!actionRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === actionRequest.id
          ? {
              ...r,
              status: 'CapEx Approved',
              allocatedBudgetM: allocatedBudgetInput,
              authorityNotes: authorityNoteInput,
              actionTakenBy: `${user?.fullName || 'Authority Admin'} (${user?.designation || 'Director'})`,
            }
          : r
      )
    );
    setActionRequest(null);
  };

  // Handle Quick Status Change
  const handleUpdateStatus = (
    reqId: string,
    newStatus: 'Field Verified' | 'Rejected' | 'Resolved'
  ) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: newStatus,
              actionTakenBy: `${user?.fullName || 'Authority Admin'} (${user?.designation || 'Director'})`,
            }
          : r
      )
    );
  };

  // KPI Calculations
  const totalRequestsCount = requests.length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending Review').length;
  const approvedCapExTotal = requests.reduce((acc, r) => acc + (r.allocatedBudgetM || 0), 0);
  const criticalAlertsCount = alerts.filter((a) => a.riskLevel === 'Critical').length;

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all' || req.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    const matchesCategory =
      selectedCategoryFilter === 'all' || req.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Authority Identity & Role Header */}
      <div className="bg-[#0A192F] border border-[#1E3A8A] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-[#2563EB] to-[#3B82F6] p-0.5 shadow-xl shrink-0">
            <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center">
              <Building2 className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Executive Authority Console
              </span>
              <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline">
                ID: {user?.id || 'AUTH-2026-HQ'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {user?.fullName || 'Dr. Vikramaditya Sen'}
            </h1>
            <p className="text-xs text-[#CBD5E1]">
              {user?.designation || 'Chief Director of Infrastructure Allocation'} • {user?.department || 'Ministry of Public Works'}
            </p>
          </div>
        </div>

        {/* Quick Nav Pill Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0A192F] p-1.5 rounded-xl border border-[#334155]">
          {[
            { id: 'overview', label: 'GIS & Overview', icon: Layers },
            { id: 'requests', label: `Citizen Demands (${requests.length})`, icon: FileText },
            { id: 'ai-insights', label: 'AI Infrastructure Plans', icon: Sparkles },
            { id: 'user-mgmt', label: `User Roles (${allUsers.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Demands */}
        <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Total Citizen Demands
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
              5,420
            </div>
            <div className="text-[11px] text-amber-300 flex items-center gap-1 mt-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingRequestsCount} Pending Ministerial Review</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Critical Contamination Alerts */}
        <div className="bg-[#1E293B]/90 border border-red-800/40 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-red-300 uppercase tracking-wider">
              Critical Alerts (GIS)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono mt-1">
              {criticalAlertsCount} Hotspots
            </div>
            <div className="text-[11px] text-red-300/80 mt-1 font-medium">
              Arsenic, Fluoride & Grid Gaps
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Approved CapEx Budget */}
        <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Approved CapEx Rail
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
              ${approvedCapExTotal.toFixed(1)}M USD
            </div>
            <div className="text-[11px] text-emerald-300 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Sovereign Debt</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: AI Recommendations Ready */}
        <div className="bg-[#1E293B]/90 border border-amber-600/40 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              AI DPR Solutions
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-1">
              {insights.length} Synthesized
            </div>
            <div className="text-[11px] text-amber-200/80 flex items-center gap-1 mt-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Avg 4.1x ROI Multiplier</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* TAB 1: OVERVIEW & GEOSPATIAL MAP */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <GeospatialContaminationMap alerts={alerts} />

          {/* Quick AI Highlight Box */}
          <div className="bg-[#0A192F] border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Primary Infrastructure Priority: Arsenic-Free Solar Water Grid
                  </h3>
                  <p className="text-xs text-[#CBD5E1]">
                    Synthesized from 1,420 citizen voice reports across Sultanganj, Bhagalpur, and Munger (Bihar).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('ai-insights')}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1"
              >
                <span>View All 4 AI Plans</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#0A192F] p-3.5 rounded-xl border border-[#334155] text-xs">
                <div className="text-[#94A3B8]">Estimated CapEx:</div>
                <div className="text-base font-bold text-white font-mono">$14.5 Million USD</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">85% Local Procurement</div>
              </div>

              <div className="bg-[#0A192F] p-3.5 rounded-xl border border-[#334155] text-xs">
                <div className="text-[#94A3B8]">Direct Beneficiaries:</div>
                <div className="text-base font-bold text-amber-300 font-mono">1.42 Million Citizens</div>
                <div className="text-[11px] text-[#CBD5E1] mt-0.5">14 High-Toxicity Blocks</div>
              </div>

              <div className="bg-[#0A192F] p-3.5 rounded-xl border border-[#334155] text-xs">
                <div className="text-[#94A3B8]">Deployment Timeframe:</div>
                <div className="text-base font-bold text-sky-400 font-mono">4 Months (Modular)</div>
                <div className="text-[11px] text-amber-300 mt-0.5">Zero Diesel Fuel Needed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CITIZEN GRIEVANCE MANAGEMENT MATRIX */}
      {activeTab === 'requests' && (
        <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#334155] pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Citizen Development Grievances & Approval Matrix
              </h2>
              <p className="text-xs text-[#CBD5E1]">
                Review, field verify, reject, or approve CapEx budget for incoming citizen requests.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute inset-y-0 left-3 my-auto pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tracking # or region..."
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-[#0A192F] border border-[#334155] rounded-xl px-2.5 py-1.5 text-xs text-[#CBD5E1] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending review">Pending Review</option>
                <option value="field verified">Field Verified</option>
                <option value="capex approved">CapEx Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table of Requests */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A192F] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#334155]">
                <tr>
                  <th className="py-3 px-4">Tracking Code & Citizen</th>
                  <th className="py-3 px-4">Grievance Title & Location</th>
                  <th className="py-3 px-4">Category & AI Severity</th>
                  <th className="py-3 px-4">Status & CapEx</th>
                  <th className="py-3 px-4 text-right">Authority Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#0A192F]/60 transition-colors">
                    
                    {/* Col 1: Tracking & Citizen */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-amber-400">{req.trackingCode}</div>
                      <div className="text-[11px] text-white font-medium mt-0.5">{req.username}</div>
                      <div className="text-[10px] text-[#94A3B8]">{req.userMobile}</div>
                    </td>

                    {/* Col 2: Title & Region */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-white line-clamp-1">{req.title}</div>
                      <div className="text-[11px] text-[#CBD5E1] line-clamp-2 mt-0.5">{req.description}</div>
                      <div className="text-[10px] text-amber-300 mt-1 flex items-center gap-1">
                        <span>📍 {req.location.region}, {req.location.state}</span>
                      </div>
                    </td>

                    {/* Col 3: Category & AI Score */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#0A192F] text-[#CBD5E1] border border-[#334155] text-[10px] font-semibold">
                        {req.category}
                      </span>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] text-[#94A3B8]">AI Score:</span>
                        <span className="font-mono font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/40">
                          {req.aiSeverityScore || '8.5'}/10
                        </span>
                      </div>
                    </td>

                    {/* Col 4: Status & CapEx */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          req.status === 'CapEx Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : req.status === 'Field Verified'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : req.status === 'Rejected'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {req.status}
                      </span>

                      {req.allocatedBudgetM && (
                        <div className="text-[11px] font-mono font-bold text-emerald-400 mt-1">
                          +${req.allocatedBudgetM}M CapEx
                        </div>
                      )}
                    </td>

                    {/* Col 5: Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status !== 'CapEx Approved' && (
                          <button
                            type="button"
                            onClick={() => handleApproveCapEx(req)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shadow"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Approve CapEx</span>
                          </button>
                        )}

                        {req.status === 'Pending Review' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(req.id, 'Field Verified')}
                            className="px-2.5 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Field Verify
                          </button>
                        )}

                        {req.status !== 'Rejected' && req.status !== 'CapEx Approved' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                            className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/40 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AI INFRASTRUCTURE PLANS */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-4">
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-[#1E3A8A] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI-Synthesized Shovel-Ready Infrastructure Solutions
              </h2>
              <p className="text-xs text-[#CBD5E1]">
                Predictive econometric models combining contaminated groundwater sensor feeds with citizen voice signals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {insights.map((item) => (
              <div
                key={item.id}
                className="bg-[#1E293B] border border-[#1E3A8A] hover:border-amber-500/60 rounded-2xl p-6 shadow-xl space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#334155] pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                      {item.regionScope}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-xs text-red-300 font-medium mt-0.5">
                      Target: {item.targetContaminantOrGap}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shrink-0">
                    {item.roiMultiplier}x ROI
                  </span>
                </div>

                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-3 gap-2 bg-[#0A192F] p-3 rounded-xl border border-[#334155] text-center text-xs">
                  <div>
                    <div className="text-[10px] text-[#94A3B8]">CapEx Est:</div>
                    <div className="font-bold text-white font-mono">${item.estimatedCapExM}M</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8]">Timeline:</div>
                    <div className="font-bold text-sky-300 font-mono">{item.timeToDeployMonths} Mos</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8]">Beneficiaries:</div>
                    <div className="font-bold text-amber-300 text-[11px] truncate">{item.directBeneficiaries.split(' ')[0]}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.unSDGs.map((sdg, i) => (
                    <span key={i} className="text-[10px] bg-[#0A192F] text-[#3B82F6] px-2 py-0.5 rounded border border-[#334155]">
                      {sdg}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenDPRStudio) {
                      onOpenDPRStudio(item.title, item.estimatedCapExM, 'Water & Sanitation');
                    }
                  }}
                  className="w-full bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Draft Formal DPR for this Solution</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USER ROLES & SECURITY AUDIT */}
      {activeTab === 'user-mgmt' && (
        <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-[#334155] pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Role-Based Access Control & User Directory
              </h2>
              <p className="text-xs text-[#CBD5E1]">
                Manage Normal Citizens and Authority Officers with dual-factor verification status.
              </p>
            </div>
            <div className="text-xs text-amber-300 font-semibold bg-[#0A192F] px-3 py-1.5 rounded-xl border border-[#334155]">
              Total Active Users: {allUsers.filter((u) => u.isActive).length} / {allUsers.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A192F] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#334155]">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role Access</th>
                  <th className="py-3 px-4">Mobile & Email Verification</th>
                  <th className="py-3 px-4">Registration & Login Audit</th>
                  <th className="py-3 px-4 text-right">Role / Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#0A192F]/60 transition-colors">
                    
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.fullName || u.username}</div>
                      <div className="text-[11px] text-amber-400 font-mono">@{u.username}</div>
                      <div className="text-[10px] text-[#94A3B8]">{u.department || 'Citizen'}</div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          u.role === 'authority'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {u.role === 'authority' ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {u.role} User
                      </span>
                    </td>

                    {/* Verifications */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span className={u.isMobileVerified ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                          {u.mobileNumber} {u.isMobileVerified ? '✓' : '(Pending)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span className={u.isEmailVerified ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                          {u.email} {u.isEmailVerified ? '✓' : '(Pending)'}
                        </span>
                      </div>
                    </td>

                    {/* Audit */}
                    <td className="py-3.5 px-4 text-[11px]">
                      <div>Created: <span className="text-white font-mono">{u.createdAt}</span></div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">
                        Last Active: {u.lastLoginAt || 'Recent'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => changeUserRole(u.id, u.role === 'authority' ? 'normal' : 'authority')}
                          className="px-2.5 py-1 bg-[#0A192F] hover:bg-[#334155] text-white border border-[#1E3A8A] rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Switch to {u.role === 'authority' ? 'Normal' : 'Authority'}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                            u.isActive
                              ? 'bg-red-950/60 text-red-300 border-red-800/40 hover:bg-red-900'
                              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Approve Request with CapEx Allocation */}
      {actionRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A192F] border-2 border-emerald-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                <DollarSign className="w-5 h-5" />
                <span>Approve CapEx for {actionRequest.trackingCode}</span>
              </div>
              <button
                onClick={() => setActionRequest(null)}
                className="text-[#94A3B8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0A192F] p-3 rounded-xl border border-[#334155] space-y-1">
                <div className="font-bold text-white">{actionRequest.title}</div>
                <div className="text-[#94A3B8]">Region: {actionRequest.location.region}, {actionRequest.location.state}</div>
                <div className="text-amber-300">Submitted by: {actionRequest.username} ({actionRequest.userMobile})</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Allocate CapEx Budget ($ Millions USD)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100.0"
                  value={allocatedBudgetInput}
                  onChange={(e) => setAllocatedBudgetInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1">
                  Ministerial Approval Directives & Notes
                </label>
                <textarea
                  rows={3}
                  value={authorityNoteInput}
                  onChange={(e) => setAuthorityNoteInput(e.target.value)}
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActionRequest(null)}
                className="w-1/3 bg-[#0A192F] text-[#CBD5E1] text-xs font-bold py-2.5 rounded-xl border border-[#334155]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm CapEx Allocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
