import React, { useState, useEffect, useRef } from 'react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { BRICSCountryId } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { LiveEmergencyTicker } from './LiveEmergencyTicker';
import { 
  Globe2, 
  MapPin, 
  FileText, 
  MessageSquarePlus, 
  Bot, 
  Radio,
  LogOut, 
  LogIn, 
  UserPlus, 
  LayoutDashboard,
  PlusCircle,
  Volume2,
  VolumeX,
  Menu,
  X,
  User,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Activity,
  Layers,
  MoreHorizontal
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'citizen-portal' | 'hotspots' | 'dpr-studio' | 'copilot' | 'crisis-dashboard' | 'dashboard' | 'login' | 'signup' | 'raise-complaint';
  setActiveTab: (tab: any) => void;
  selectedCountry: BRICSCountryId | 'all';
  setSelectedCountry: (country: BRICSCountryId | 'all') => void;
  onOpenIntakeModal: () => void;
  stats: {
    totalReports: number;
    hotspotsCount: number;
    totalBeneficiaries: string;
    budgetGapM: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCountry,
  setSelectedCountry,
  stats,
}) => {
  const { authState, logout } = useAuth();
  const { 
    t, 
    currentLanguageInfo, 
    speak, 
    isSpeaking, 
    speakingLanguageName,
    adaptLanguageForCountry, 
    adaptationNotice, 
    dismissAdaptationNotice 
  } = useLanguage();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const [liveGrievanceCount, setLiveGrievanceCount] = useState<number>(stats.totalReports || 5);
  const [liveCriticalCount, setLiveCriticalCount] = useState<number>(4);
  const user = authState.user;

  // Close "More Options" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Real-time backend live telemetry polling for dynamic counter
  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const res = await fetch('/api/complaints/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (typeof data.totalComplaints === 'number') {
              setLiveGrievanceCount(data.totalComplaints);
            }
            if (typeof data.criticalPriorityCount === 'number') {
              setLiveCriticalCount(data.criticalPriorityCount);
            }
          }
        }
      } catch (err) {
        console.warn('Live counter fetch notice:', err);
      }
    };

    fetchLiveStats();
    const timer = setInterval(fetchLiveStats, 15000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Close mobile drawer when activeTab changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [activeTab]);

  const handleCountryChange = (cId: string) => {
    setSelectedCountry(cId as any);
    if (cId !== 'all') {
      adaptLanguageForCountry(cId);
    }
  };

  const handleSpeakOverview = () => {
    const speakPhrase = `${t.portalTitle}. ${t.portalSubtitle}. ${t.geminiAgentActive}.`;
    speak(speakPhrase);
  };

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
    setIsMobileDrawerOpen(false);
    setIsMoreDropdownOpen(false);
  };

  const isMoreOptionActive = ['crisis-dashboard', 'hotspots', 'dashboard'].includes(activeTab);

  const handleLogout = () => {
    logout();
    setActiveTab('map');
    setIsMobileDrawerOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-[#0A192F]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl overflow-x-hidden">
      {/* Dynamic Auto-Adaptation Notification Toast */}
      {adaptationNotice && (
        <div className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-[#1E3A8A] px-3 sm:px-4 py-1.5 text-xs text-white flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200 border-b border-blue-600/40">
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm shrink-0">🌐</span>
            <span className="truncate">
              <strong>Language Auto-Adapted:</strong> Interface switched to{' '}
              <span className="font-bold underline text-cyan-300">{adaptationNotice.nativeName} ({adaptationNotice.languageName})</span> for <strong>{adaptationNotice.locationName}</strong>
            </span>
          </div>
          <button
            onClick={dismissAdaptationNotice}
            className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 font-semibold shrink-0 ml-2"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Top Utility Bar (Dedicated Government Utility & Auth Bar) */}
      <div className="w-full bg-[#050C18] border-b border-slate-800/90 text-slate-300">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 text-xs flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          
          {/* Left: Sovereign Identity & Status */}
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-950/90 text-cyan-300 font-semibold border border-blue-700/60 text-[11px] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{t.portalTitle || 'PulseGov DPI'}</span>
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-400 text-[11px] truncate">
              {t.portalSubtitle || 'Sovereign Digital Public Infrastructure'}
            </span>
          </div>

          {/* Right: Accessibility Voice, 33-Languages, Scope & ISOLATED Auth Zone */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono shrink-0 ml-auto">
            
            {/* Gemini AI Voice Synthesizer Button */}
            <button
              type="button"
              id="top-utility-tts-btn"
              onClick={handleSpeakOverview}
              title={t.speakText || 'Speak Overview in Gemini Voice'}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-semibold transition-all shrink-0 ${
                isSpeaking
                  ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse shadow-md'
                  : 'bg-slate-900/90 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/60'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 shrink-0" />}
              <span className="hidden lg:inline text-[11px]">
                {isSpeaking ? (speakingLanguageName ? `Voice: ${speakingLanguageName}` : 'Speaking...') : 'Gemini Voice'}
              </span>
            </button>

            {/* Global Language Selector (33 Sovereign Dialects) */}
            <LanguageSelector />

            {/* Sovereign Territory Scope (10 BRICS Nations) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
              <span className="text-slate-400 text-[10px] hidden md:inline">Scope:</span>
              <select
                id="global-country-select"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="bg-transparent text-slate-100 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-100">{t.allCountries}</option>
                {BRICS_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Critical Incident Ticker Pill */}
            <div 
              id="nav-live-grievances-counter"
              onClick={() => handleTabClick('crisis-dashboard')}
              className="hidden sm:flex items-center gap-1.5 text-[11px] bg-slate-900/90 hover:bg-blue-950/80 px-2 py-1 rounded-lg border border-slate-800 hover:border-blue-700/50 cursor-pointer transition shrink-0"
              title="Click to open Live Crisis Room"
            >
              <Radio className="w-3 h-3 text-red-400 shrink-0 animate-pulse" />
              <span className="text-white font-bold font-mono">{liveGrievanceCount}</span>
              <span className="bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">{liveCriticalCount}</span>
            </div>

            {/* Distinct Vertical Divider */}
            <div className="h-4 w-px bg-slate-700/80 mx-0.5 sm:mx-1 hidden sm:block shrink-0"></div>

            {/* ISOLATED GOVERNMENT AUTHENTICATION ZONE */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" id="top-utility-auth-section">
              {authState.isAuthenticated ? (
                <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-blue-500/40 shrink-0">
                  <button 
                    type="button"
                    onClick={() => handleTabClick('dashboard')}
                    className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    title="Open Sovereign Console"
                  >
                    <div className="w-5 h-5 rounded-md bg-blue-900 border border-blue-400/50 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-100 max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">
                      {user?.fullName?.split(' ')[0] || user?.username}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hidden md:inline">
                      {user?.role === 'authority' ? 'Official' : 'Citizen'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1 rounded text-slate-400 hover:text-red-300 hover:bg-red-950/60 transition-colors ml-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    type="button"
                    id="top-nav-login-btn"
                    onClick={() => handleTabClick('login')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all shrink-0 whitespace-nowrap ${
                      activeTab === 'login'
                        ? 'bg-blue-900 text-white font-bold border border-blue-500'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    <LogIn className="w-3 h-3 text-blue-400 shrink-0" />
                    <span>{t.login}</span>
                  </button>

                  <button
                    type="button"
                    id="top-nav-signup-btn"
                    onClick={() => handleTabClick('signup')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 whitespace-nowrap ${
                      activeTab === 'signup'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm border border-blue-400/40'
                    }`}
                  >
                    <UserPlus className="w-3 h-3 shrink-0" />
                    <span>{t.signUp}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Clean Sovereign Header) */}
      <div className="w-full bg-[#0A192F] border-b border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left: Platform Logo & Title */}
            <div 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0" 
              onClick={() => handleTabClick(authState.isAuthenticated ? 'dashboard' : 'map')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-950/50 shrink-0">
                <div className="w-full h-full bg-[#0A192F] rounded-[10px] flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                    PulseGov
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 uppercase tracking-wide whitespace-nowrap">
                    Sovereign DPI
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 leading-none hidden xs:block truncate">
                  {currentLanguageInfo.nativeName} • {currentLanguageInfo.name}
                </p>
              </div>
            </div>

            {/* Center: Desktop Navigation Tabs (Visible on lg and xl) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium">
              
              {/* 1. GIS Hotspots */}
              <button
                id="nav-tab-map"
                type="button"
                onClick={() => handleTabClick('map')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'map'
                    ? 'bg-blue-900/90 text-white font-semibold shadow-inner border border-blue-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="whitespace-nowrap">{t.gisHotspots}</span>
              </button>

              {/* 2. Citizen Grievances Feed */}
              <button
                id="nav-tab-citizen-portal"
                type="button"
                onClick={() => handleTabClick('citizen-portal')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'citizen-portal'
                    ? 'bg-blue-900/90 text-white font-semibold shadow-inner border border-blue-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <MessageSquarePlus className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="whitespace-nowrap">{t.citizenVoice}</span>
              </button>

              {/* 3. AI DPR Studio */}
              <button
                id="nav-tab-dpr-studio"
                type="button"
                onClick={() => handleTabClick('dpr-studio')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'dpr-studio'
                    ? 'bg-blue-900/90 text-white font-semibold shadow-inner border border-blue-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="whitespace-nowrap">{t.aiDprStudio}</span>
              </button>

              {/* 4. Gemini Sovereign Intelligence Hub */}
              <button
                id="nav-tab-copilot"
                type="button"
                onClick={() => handleTabClick('copilot')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  activeTab === 'copilot'
                    ? 'bg-blue-900/90 text-white font-semibold shadow-inner border border-blue-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">{t.geminiSovereignHub || 'Gemini Sovereign Hub'}</span>
              </button>

              {/* 5. Strategic Modules Dropdown */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  id="nav-tab-more-options"
                  type="button"
                  onClick={() => setIsMoreDropdownOpen((prev) => !prev)}
                  className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isMoreOptionActive
                      ? 'bg-blue-900/90 text-white font-semibold border border-blue-500/40 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                  aria-expanded={isMoreDropdownOpen}
                >
                  <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="whitespace-nowrap">More</span>
                  {isMoreOptionActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isMoreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#0C1A32] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                    <div className="px-3 py-1.5 mb-1 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>Strategic Modules</span>
                      <span className="text-[10px] text-blue-400 font-mono">PulseGov DPI</span>
                    </div>

                    {/* Option 1: Live Ministerial Crisis Dashboard */}
                    <button
                      type="button"
                      id="nav-dropdown-crisis"
                      onClick={() => handleTabClick('crisis-dashboard')}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 group ${
                        activeTab === 'crisis-dashboard'
                          ? 'bg-red-950/80 text-white border border-red-500/40 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold truncate">Live Crisis Room</span>
                          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                            {liveCriticalCount}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">Real-time ministerial triage</p>
                      </div>
                    </button>

                    {/* Option 2: Demand Hotspots Prioritization Matrix */}
                    <button
                      type="button"
                      id="nav-dropdown-hotspots"
                      onClick={() => handleTabClick('hotspots')}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 group mt-1 ${
                        activeTab === 'hotspots'
                          ? 'bg-blue-900/80 text-white border border-blue-500/40 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold block truncate">Prioritization Matrix</span>
                        <p className="text-[10px] text-slate-400 truncate">ISO-37120 urgency & Capex</p>
                      </div>
                    </button>

                    {/* Option 3: Role Dashboard */}
                    {authState.isAuthenticated && (
                      <button
                        type="button"
                        id="nav-dropdown-dashboard"
                        onClick={() => handleTabClick('dashboard')}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 group mt-1 ${
                          activeTab === 'dashboard'
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-400/40 flex items-center justify-center shrink-0">
                          <LayoutDashboard className="w-4 h-4 text-cyan-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold block truncate">
                            {user?.role === 'authority' ? 'Authority Console' : t.dashboard}
                          </span>
                          <p className="text-[10px] text-slate-400 truncate">Audit log & telemetry</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Right: Primary Complaint CTA + Hamburger Menu Button */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Statutory Action CTA: Raise a Complaint */}
              <button
                id="nav-action-raise-complaint"
                onClick={() => handleTabClick('raise-complaint')}
                className={`flex text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-md items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95 shrink-0 whitespace-nowrap ${
                  activeTab === 'raise-complaint'
                    ? 'bg-cyan-400 text-slate-950 font-bold ring-2 ring-cyan-300 shadow-cyan-900/50'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border border-cyan-400/40 shadow-blue-950/80'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-cyan-200 shrink-0" />
                <span className="whitespace-nowrap font-bold">{t.raiseComplaint || 'Raise a Complaint'}</span>
              </button>

              {/* Mobile & Tablet Hamburger Toggle */}
              <div className="flex lg:hidden items-center shrink-0">
                <button
                  type="button"
                  id="mobile-menu-toggle-btn"
                  onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 transition-colors focus:outline-none shrink-0"
                  aria-label="Toggle Sovereign Navigation Menu"
                >
                  {isMobileDrawerOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Tablet Navigation Pills (md to lg) */}
        <div className="hidden md:flex lg:hidden overflow-x-auto py-2 px-3 sm:px-6 gap-1.5 text-xs border-t border-slate-800 no-scrollbar max-w-7xl mx-auto w-full">
          {[
            { id: 'map', label: t.gisHotspots, icon: MapPin },
            { id: 'citizen-portal', label: t.citizenVoice, icon: MessageSquarePlus },
            { id: 'dpr-studio', label: t.aiDprStudio, icon: FileText },
            { id: 'copilot', label: t.geminiSovereignHub || 'Gemini Sovereign Hub', icon: Bot },
            { id: 'crisis-dashboard', label: t.liveCrisisDashboard || 'Crisis Room', icon: ShieldAlert },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id as any)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeTab === item.id
                    ? 'bg-blue-900 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {authState.isAuthenticated && (
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-colors shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-cyan-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{user?.role === 'authority' ? 'Authority Console' : t.dashboard}</span>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Live Emergency Ticker directly under navbar */}
      <LiveEmergencyTicker onNavigateToCrisis={() => handleTabClick('crisis-dashboard')} />

      {/* Mobile Slide-down Menu */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden bg-[#0A192F] border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* User Profile Card in Mobile Drawer */}
            {authState.isAuthenticated ? (
              <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center text-white text-base font-bold shadow-md border border-blue-400/40">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {user?.fullName || user?.username}
                      </h4>
                      <p className="text-xs text-slate-400">{user?.email || 'Authenticated Official'}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-semibold mt-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        <span>{user?.role === 'authority' ? 'Civil Authority Officer' : 'Citizen Contributor'}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleTabClick('dashboard')}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleTabClick('raise-complaint')}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>+ Complaint</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">BRICS PulseGov Access</h4>
                    <p className="text-xs text-slate-400">Login to track grievances or access ministerial consoles</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTabClick('login')}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.login}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabClick('signup')}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t.signUp}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Raise Complaint Button for Mobile */}
            <button
              onClick={() => handleTabClick('raise-complaint')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-700 to-[#1E3A8A] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <PlusCircle className="w-4 h-4 text-cyan-200" />
              <span>{t.raiseComplaint}</span>
            </button>

            {/* Mobile Navigation List */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                Main Portals & Infrastructure Rails
              </div>

              {[
                { id: 'map', label: t.gisHotspots, icon: MapPin, desc: 'Interactive vector GIS & vulnerability index', color: 'text-red-400' },
                { id: 'citizen-portal', label: t.citizenVoice, icon: MessageSquarePlus, desc: 'Dual-verified citizen grievances feed', color: 'text-cyan-400' },
                { id: 'dpr-studio', label: t.aiDprStudio, icon: FileText, desc: 'Gemini Capex feasibility & Gantt charts', color: 'text-sky-400' },
                { id: 'copilot', label: t.geminiSovereignHub || 'Gemini Sovereign Intelligence Hub', icon: Bot, desc: 'Real-time ministerial voice & strategic advisor', color: 'text-emerald-400' },
                { id: 'crisis-dashboard', label: t.liveCrisisDashboard || 'Live Crisis Dashboard', icon: ShieldAlert, desc: 'Real-time multi-sovereign crisis room & field dispatch', color: 'text-red-400' },
              ].map((navItem) => {
                const Icon = navItem.icon;
                const isActive = activeTab === navItem.id;
                return (
                  <button
                    key={navItem.id}
                    onClick={() => handleTabClick(navItem.id as any)}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white font-bold shadow-md border border-blue-500/40'
                        : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className={`p-2 rounded-xl bg-slate-950 ${navItem.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{navItem.label}</div>
                        <div className="text-[10px] text-slate-400">{navItem.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>

            {/* Quick Country Scope Filter Pills in Mobile Drawer */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                <span>Sovereign Territory Focus</span>
                <span className="text-blue-400 font-bold">{selectedCountry.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => handleCountryChange('all')}
                  className={`p-2 rounded-xl text-left flex items-center gap-1.5 transition-colors ${
                    selectedCountry === 'all'
                      ? 'bg-blue-700 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <span>🌐</span>
                  <span>{t.allCountries}</span>
                </button>
                {BRICS_COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCountryChange(c.id)}
                    className={`p-2 rounded-xl text-left flex items-center gap-1.5 truncate transition-colors ${
                      selectedCountry === c.id
                        ? 'bg-blue-800 text-white font-bold border border-blue-400/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile (< 1024px) */}
      <nav 
        id="mobile-bottom-nav" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A192F]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl"
      >
        {/* 1. Map */}
        <button
          onClick={() => handleTabClick('map')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${
            activeTab === 'map' ? 'text-cyan-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 mb-0.5 text-red-400" />
          <span className="text-[10px] leading-tight truncate">Map</span>
        </button>

        {/* 2. Citizen Feed */}
        <button
          onClick={() => handleTabClick('citizen-portal')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${
            activeTab === 'citizen-portal' ? 'text-cyan-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4 mb-0.5 text-cyan-400" />
          <span className="text-[10px] leading-tight truncate">Voices</span>
        </button>

        {/* 3. Center Glowing Raise Complaint Action */}
        <button
          onClick={() => handleTabClick('raise-complaint')}
          className="flex flex-col items-center justify-center -mt-5 relative group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-[#1E3A8A] p-0.5 shadow-xl shadow-blue-900/60 ring-4 ring-[#0A192F] transform group-active:scale-95 transition-transform flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[9px] font-bold text-cyan-300 mt-0.5">Report</span>
        </button>

        {/* 4. Crisis Dashboard */}
        <button
          onClick={() => handleTabClick('crisis-dashboard')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${
            activeTab === 'crisis-dashboard' ? 'text-red-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 mb-0.5 text-red-400 animate-pulse" />
          <span className="text-[10px] leading-tight truncate">Crisis</span>
        </button>

        {/* 5. Dynamic Auth/Dashboard Target */}
        {authState.isAuthenticated ? (
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${
              activeTab === 'dashboard' ? 'text-cyan-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-4 h-4 mb-0.5 rounded-full bg-blue-700 text-white text-[9px] flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <span className="text-[10px] leading-tight truncate">Console</span>
          </button>
        ) : (
          <button
            onClick={() => handleTabClick('login')}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all w-16 ${
              activeTab === 'login' || activeTab === 'signup' ? 'text-cyan-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4 mb-0.5 text-blue-400" />
            <span className="text-[10px] leading-tight truncate">Login</span>
          </button>
        )}
      </nav>
    </header>
  );
};

