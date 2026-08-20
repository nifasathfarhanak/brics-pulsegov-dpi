import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  CitizenServiceRequest, 
  ContaminationAlert 
} from '../../types';
import { 
  INITIAL_CITIZEN_REQUESTS, 
  INITIAL_CONTAMINATION_ALERTS, 
  AVAILABLE_PUBLIC_SERVICES 
} from '../../data/governanceData';
import { GeospatialContaminationMap } from './GeospatialContaminationMap';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ThumbsUp, 
  Send, 
  Sparkles, 
  Layers, 
  Droplets, 
  SunMedium, 
  Truck, 
  Activity, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const NormalUserDashboard: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;

  // Active Tab for Normal User
  const [activeTab, setActiveTab] = useState<'tracker' | 'new-request' | 'gis-map' | 'services'>('tracker');

  // Requests State
  const [requests, setRequests] = useState<CitizenServiceRequest[]>(INITIAL_CITIZEN_REQUESTS);
  const [alerts] = useState<ContaminationAlert[]>(INITIAL_CONTAMINATION_ALERTS);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Real-time synchronization simulation (Firebase-like stream)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) => {
        if (prev.length === 0) return prev;
        // Randomly simulate community activity on random request
        const randIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        updated[randIndex] = {
          ...updated[randIndex],
          upvotes: updated[randIndex].upvotes + 1,
        };
        return updated;
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // New Request Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Water & Sanitation' | 'Energy & Microgrids' | 'Transport & Roads' | 'Public Health'>('Water & Sanitation');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Sultanganj Block, Bhagalpur');
  const [state, setState] = useState(user?.state || 'Bihar');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('High');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Filter My Requests
  const myRequests = requests.filter(
    (r) => r.userId === user?.id || r.username === user?.username || r.userId === 'user_rahul'
  );

  const handleUpvote = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randTracking = Math.floor(1000 + Math.random() * 9000);
      const newReq: CitizenServiceRequest = {
        id: `REQ-${Date.now()}`,
        trackingCode: `PULSE-${state.substring(0, 2).toUpperCase()}-${randTracking}`,
        userId: user?.id || 'user_citizen',
        username: user?.username || 'citizen_user',
        userMobile: user?.mobileNumber || '+91 98451 23456',
        title,
        category,
        description,
        location: {
          region,
          state,
        },
        urgency,
        status: 'Pending Review',
        upvotes: 1,
        submittedAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
        aiSeverityScore: urgency === 'Emergency' ? 9.5 : urgency === 'High' ? 8.2 : 6.5,
      };

      setRequests((prev) => [newReq, ...prev]);
      setSubmitSuccess(`Grievance lodged successfully! Tracking Code: ${newReq.trackingCode}.`);
      setTitle('');
      setDescription('');
      setIsSubmitting(false);
      setActiveTab('tracker');
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Citizen Profile & Verification Badges */}
      <div className="bg-[#0A192F] border border-[#1E3A8A] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#3B82F6] p-0.5 shadow-xl shrink-0">
            <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center">
              <User className="w-7 h-7 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Dual-Verified Citizen
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">
                Jurisdiction: {user?.state || 'Bihar, India'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              Welcome, {user?.fullName || user?.username || 'Rahul Sharma'}
            </h1>
            
            {/* Contact Verifications */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#CBD5E1] mt-1">
              <span className="flex items-center gap-1 text-emerald-300">
                <Phone className="w-3.5 h-3.5" />
                {user?.mobileNumber || '+91 98451 23456'} (OTP Verified)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Mail className="w-3.5 h-3.5" />
                {user?.email || 'citizen@domain.in'} (Confirmed)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tabs Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0A192F] p-1.5 rounded-xl border border-[#334155]">
          {[
            { id: 'tracker', label: `My Requests (${myRequests.length})`, icon: FileText },
            { id: 'new-request', label: 'Submit Grievance', icon: PlusCircle },
            { id: 'gis-map', label: 'Contamination GIS', icon: Layers },
            { id: 'services', label: 'Public Services', icon: Sparkles },
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

      {/* Notifications */}
      {submitSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess(null)} className="text-emerald-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: MY REQUESTS & LIVE STATUS TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  My Development Grievances & Live Status Tracker
                </h2>
                <p className="text-xs text-[#CBD5E1]">
                  Real-time status tracking with ministerial directives and CapEx allocation updates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('new-request')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Lodge New Grievance</span>
              </button>
            </div>

            {/* Request Cards */}
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#0A192F] border border-[#334155] rounded-2xl p-5 shadow-lg space-y-4 hover:border-[#2563EB] transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#334155] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                          {req.trackingCode}
                        </span>
                        <span className="text-xs text-[#94A3B8]">• {req.submittedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {req.title}
                      </h3>
                      <div className="text-xs text-amber-300 mt-0.5">
                        📍 {req.location.region}, {req.location.state}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          req.status === 'CapEx Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : req.status === 'Field Verified'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    {req.description}
                  </p>

                  {/* 4-Step Visual Progress Stepper */}
                  <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold mb-2">
                      Grievance Resolution Lifecycle:
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { label: '1. Lodged', active: true },
                        { label: '2. Field Verified', active: req.status === 'Field Verified' || req.status === 'CapEx Approved' || req.status === 'Resolved' },
                        { label: '3. CapEx Approved', active: req.status === 'CapEx Approved' || req.status === 'Resolved' },
                        { label: '4. Works Completed', active: req.status === 'Resolved' },
                      ].map((step, idx) => (
                        <div key={idx} className="space-y-1">
                          <div
                            className={`h-2 rounded-full ${
                              step.active ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-[#0A192F]'
                            }`}
                          />
                          <span className={`text-[10px] font-semibold ${step.active ? 'text-emerald-300' : 'text-[#94A3B8]'}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Authority Directives Note if present */}
                  {req.authorityNotes && (
                    <div className="bg-amber-950/40 border border-amber-600/40 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Executive Authority Directive:</span>
                      </div>
                      <p className="text-amber-200/90">{req.authorityNotes}</p>
                      {req.actionTakenBy && (
                        <div className="text-[10px] text-amber-400/80 font-mono pt-1">
                          Approved by: {req.actionTakenBy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upvote & Community Engagement */}
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpvote(req.id)}
                      className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1] px-3 py-1.5 rounded-lg border border-[#334155] transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{req.upvotes} Community Endorsements</span>
                    </button>
                    <span className="font-mono text-[10px] text-emerald-400">
                      AI Priority Score: {req.aiSeverityScore || 8.5}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT NEW CITIZEN GRIEVANCE */}
      {activeTab === 'new-request' && (
        <div className="bg-[#1E293B]/90 border border-[#1E3A8A] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="border-b border-[#334155] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              Lodge Infrastructure Grievance / Service Form
            </h2>
            <p className="text-xs text-[#CBD5E1]">
              Direct submission to the National Jal Jeevan, Energy, and Rural Transport Ministry dashboard.
            </p>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Grievance Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="Water & Sanitation">Water & Contamination (Arsenic/Fluoride/Well Failures)</option>
                  <option value="Energy & Microgrids">Energy & Power Grid (Outages, Transformer Burnout)</option>
                  <option value="Transport & Roads">Transport & Rural Connectivity (Culvert Washing, Road Scouring)</option>
                  <option value="Public Health">Public Health Sanitation & Drainage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Severity & Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="Emergency">Emergency (Immediate Community Hazard / Health Epidemic)</option>
                  <option value="High">High Priority (Severe Deficit affecting &gt;500 residents)</option>
                  <option value="Medium">Medium Priority (Seasonal Maintenance / Upgrade)</option>
                  <option value="Low">Low Priority (General Maintenance Inquiry)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Grievance Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Arsenic detected in handpumps at Sultanganj primary school"
                className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  Village / Ward / Landmark Location
                </label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Ward 4, Sultanganj Block"
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                  State / District
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Bihar"
                  className="w-full bg-[#0A192F] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                Detailed Problem Description & Estimated Affected Population
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the exact infrastructure failure, laboratory readings if tested, water color/smell, road cutoff details, and how many households are affected..."
                className="w-full bg-[#0A192F] border border-[#334155] rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 via-[#2563EB] to-amber-700 hover:from-amber-700 hover:to-[#1E3A8A] text-white font-bold py-3.5 px-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Grievance to National Priority Rail</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CONTAMINATION GIS MAP */}
      {activeTab === 'gis-map' && (
        <div className="space-y-4">
          <GeospatialContaminationMap alerts={alerts} />
        </div>
      )}

      {/* TAB 4: PUBLIC SERVICES DIRECTORY */}
      {activeTab === 'services' && (
        <div className="space-y-5">
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-[#1E3A8A]">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Official Government Services & Grant Applications
            </h2>
            <p className="text-xs text-[#CBD5E1]">
              One-click sovereign applications for water testing, solar subsidies, and road petitions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AVAILABLE_PUBLIC_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#1E293B] border border-[#1E3A8A] hover:border-amber-500/60 rounded-2xl p-5 shadow-xl space-y-3 transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    {srv.badge}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] font-mono">
                    TAT: {srv.processingDays}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#334155] flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8] font-semibold">
                    Category: {srv.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle(`Application for ${srv.title}`);
                      setDescription(`Formal request submitted under ${srv.title} for local gram panchayat area in ${user?.state || 'Bihar'}.`);
                      setActiveTab('new-request');
                    }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
