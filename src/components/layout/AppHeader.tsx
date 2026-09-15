import React from 'react';
import { 
  Globe2, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Menu, 
  PlusCircle, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  ChevronDown, 
  Radio, 
  Sparkles,
  ShieldCheck,
  Building2,
  Share2,
  Bell
} from 'lucide-react';
import { BRICS_COUNTRIES } from '../../data/bricsData';
import { BRICSCountryId } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';
import { LiveEmergencyTicker } from '../LiveEmergencyTicker';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { NavTabId } from './AppSidebar';

interface AppHeaderProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  selectedCountry: BRICSCountryId | 'all';
  setSelectedCountry: (country: BRICSCountryId | 'all') => void;
  onOpenIntakeModal: () => void;
  onToggleMobileSidebar: () => void;
  stats: {
    totalReports: number;
    hotspotsCount: number;
    totalBeneficiaries: string;
    budgetGapM: number;
  };
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCountry,
  setSelectedCountry,
  onOpenIntakeModal,
  onToggleMobileSidebar,
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

  const activeCountryObj = BRICS_COUNTRIES.find((c) => c.id === selectedCountry);

  const handleCountrySelect = (cId: string) => {
    setSelectedCountry(cId as any);
    if (cId !== 'all') {
      adaptLanguageForCountry(cId);
    }
  };

  const handleSpeakOverview = () => {
    const speakPhrase = `${t.portalTitle}. ${t.portalSubtitle}. ${t.geminiAgentActive}.`;
    speak(speakPhrase);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('map');
  };

  const getTabTitle = (tab: NavTabId) => {
    switch (tab) {
      case 'map': return 'Geospatial Command Center';
      case 'hotspots': return 'Demand Hotspots Matrix';
      case 'dpr-studio': return 'National Infrastructure Prioritization Hub';
      case 'copilot': return 'Gemini Policy Copilot';
      case 'raise-complaint': return 'Citizen Grievance Intake';
      case 'citizen-portal': return 'Public Grievance Feed';
      case 'crisis-dashboard': return 'Ministerial Crisis Room';
      case 'dashboard': return 'Command & Control Console';
      case 'login': return 'Sovereign Authentication';
      case 'signup': return 'Citizen Registration';
      default: return 'BRICS DPI Portal';
    }
  };

  const getTabBreadcrumb = (tab: NavTabId) => {
    switch (tab) {
      case 'dpr-studio': return 'AI DPR Studio';
      case 'map': return 'Live GIS';
      case 'hotspots': return 'Analytics';
      case 'copilot': return 'AI Copilot';
      case 'raise-complaint': return 'Intake';
      case 'citizen-portal': return 'Portal';
      case 'crisis-dashboard': return 'Crisis Room';
      case 'dashboard': return 'Console';
      case 'login': return 'Auth';
      case 'signup': return 'Auth';
      default: return String(tab);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Adaptation Notice Banner */}
      {adaptationNotice && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>
              Language automatically adapted to <strong className="font-bold underline text-amber-200">{adaptationNotice.nativeName} ({adaptationNotice.languageName})</strong> for <strong>{adaptationNotice.locationName}</strong>
            </span>
          </div>
          <button 
            onClick={dismissAdaptationNotice}
            className="text-white/80 hover:text-white text-xs underline font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button & Breadcrumb / Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform</span>
              <span className="text-slate-300 text-xs">/</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                {getTabBreadcrumb(activeTab)}
              </span>
            </div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              <span>{getTabTitle(activeTab)}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live DPI
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Live Emergency Alert Ticker (Hidden on small mobile) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-2">
          <LiveEmergencyTicker />
        </div>

        {/* Right Side: Language Switcher, Country Selector, Raise Grievance CTA, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Country Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs">
                <span className="text-base leading-none">
                  {selectedCountry === 'all' ? '🌐' : activeCountryObj?.flag || '🏛️'}
                </span>
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {selectedCountry === 'all' ? 'All BRICS+' : activeCountryObj?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Sovereign Territory</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCountrySelect('all')} className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <span>🌐</span> All BRICS+ Nations
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">All</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {BRICS_COUNTRIES.map((c) => (
                <DropdownMenuItem 
                  key={c.id} 
                  onClick={() => handleCountrySelect(c.id)}
                  className={`flex items-center justify-between ${selectedCountry === c.id ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{c.code}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 33-Language Selector */}
          <LanguageSelector />

          {/* Voice Briefing Button */}
          <button
            onClick={handleSpeakOverview}
            disabled={isSpeaking}
            className={`p-2 rounded-xl border transition-all cursor-pointer hidden md:flex items-center justify-center ${
              isSpeaking
                ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Read Overview in Active Language"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Raise Citizen Grievance Action Button */}
          <button
            onClick={onOpenIntakeModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">File Grievance</span>
            <span className="sm:hidden">File</span>
          </button>

          {/* User Profile & Auth Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pl-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-colors cursor-pointer">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                    {authState.isAuthenticated ? (authState.user?.fullName?.[0] || 'U') : <User className="w-3.5 h-3.5" />}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {authState.isAuthenticated ? (
                <>
                  <div className="p-3 bg-slate-50 border-b border-slate-100 rounded-t-lg">
                    <div className="text-xs font-bold text-slate-900">{authState.user?.fullName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{authState.user?.email || authState.user?.mobileNumber}</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                        {authState.user?.role || 'Citizen'}
                      </span>
                      {authState.user?.department && (
                        <span className="text-[10px] text-slate-500 truncate">
                          {authState.user.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => setActiveTab('dashboard')} className="mt-1">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Control Console</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('citizen-portal')}>
                    <Building2 className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Track My Reports</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Sovereign Authentication</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setActiveTab('login')}>
                    <LogIn className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Sign In to PulseGov</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab('signup')}>
                    <UserPlus className="w-4 h-4 mr-2 text-emerald-600" />
                    <span>Citizen & Authority Registration</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2 text-[11px] text-slate-400">
                    Sovereign RBAC with Aadhaar / Civil Identity integration.
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
};
