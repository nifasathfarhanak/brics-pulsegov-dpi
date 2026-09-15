import React from 'react';
import { 
  Globe2, 
  MapPin, 
  Flame, 
  FileText, 
  Bot, 
  Radio, 
  LayoutDashboard, 
  MessageSquarePlus, 
  Layers, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  MessageSquare, 
  Scale, 
  Network, 
  Building2,
  BookOpen,
  HelpCircle,
  TrendingUp,
  User,
  LogIn
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export type NavTabId = 
  | 'map' 
  | 'citizen-portal' 
  | 'hotspots' 
  | 'dpr-studio' 
  | 'copilot' 
  | 'crisis-dashboard' 
  | 'dashboard' 
  | 'login' 
  | 'signup' 
  | 'raise-complaint';

interface AppSidebarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  // Modal triggers for Sovereign DPI features
  onOpenWhatsAppBot: () => void;
  onOpenPolicyDebate: () => void;
  onOpenDuplicateInspector: () => void;
  onOpenIndiaHierarchy: () => void;
  onOpenCrisisSimulation: () => void;
  onOpenJudgesGuide: () => void;
  // Stats
  hotspotsCount?: number;
  criticalAlertsCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenWhatsAppBot,
  onOpenPolicyDebate,
  onOpenDuplicateInspector,
  onOpenIndiaHierarchy,
  onOpenCrisisSimulation,
  onOpenJudgesGuide,
  hotspotsCount = 8,
  criticalAlertsCount = 4
}) => {
  const { authState } = useAuth();
  const { t } = useLanguage();

  const mainNavGroups = [
    {
      groupLabel: 'Core Spatial & Intelligence',
      items: [
        {
          id: 'map' as NavTabId,
          label: 'GIS Geospatial Canvas',
          icon: Globe2,
          badge: 'Live',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
          id: 'hotspots' as NavTabId,
          label: 'Demand Hotspots Matrix',
          icon: Flame,
          badge: `${hotspotsCount}`,
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
        },
        {
          id: 'dpr-studio' as NavTabId,
          label: 'AI DPR Studio & Gantt',
          icon: FileText,
          badge: 'DPI',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
          id: 'copilot' as NavTabId,
          label: 'Gemini Policy Copilot',
          icon: Bot,
          badge: 'AI 3.7',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
        },
      ]
    },
    {
      groupLabel: 'Citizen Engagement',
      items: [
        {
          id: 'raise-complaint' as NavTabId,
          label: 'File Grievance / Intake',
          icon: MessageSquarePlus,
          badge: 'New',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          highlight: true
        },
        {
          id: 'citizen-portal' as NavTabId,
          label: 'Public Grievance Feed',
          icon: MessageSquare,
        },
        {
          id: 'crisis-dashboard' as NavTabId,
          label: 'Ministerial Crisis Room',
          icon: Radio,
          badge: `${criticalAlertsCount} Alert`,
          badgeColor: 'bg-red-50 text-red-700 border-red-200 animate-pulse'
        },
      ]
    },
    {
      groupLabel: 'Administration & Workspaces',
      items: [
        {
          id: 'dashboard' as NavTabId,
          label: authState.isAuthenticated ? (authState.user?.role === 'authority' ? 'Authority Console' : 'Citizen Dashboard') : 'User Portal',
          icon: LayoutDashboard,
          badge: authState.isAuthenticated ? 'Auth' : undefined,
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200'
        },
      ]
    }
  ];

  const quickToolModals = [
    {
      name: 'WhatsApp / Telegram Bot',
      icon: MessageSquare,
      action: onOpenWhatsAppBot,
      color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
    },
    {
      name: 'Ministerial Policy Debate',
      icon: Scale,
      action: onOpenPolicyDebate,
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    {
      name: 'AI Duplicate Cluster Visualizer',
      icon: Layers,
      action: onOpenDuplicateInspector,
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
    },
    {
      name: 'India District Hierarchy',
      icon: Building2,
      action: onOpenIndiaHierarchy,
      color: 'text-amber-600 bg-amber-50 hover:bg-amber-100'
    },
    {
      name: 'Live Crisis Simulation',
      icon: Activity,
      action: onOpenCrisisSimulation,
      color: 'text-rose-600 bg-rose-50 hover:bg-rose-100'
    },
    {
      name: 'Judges Demo Guide',
      icon: Sparkles,
      action: onOpenJudgesGuide,
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <aside 
        className={`sticky top-0 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('map')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-base tracking-tight font-mono">PulseGov</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    DPI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 truncate font-medium">BRICS Sovereign AI Hub</span>
              </div>
            </div>
          ) : (
            <div className="mx-auto cursor-pointer" onClick={() => setActiveTab('map')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <Globe2 className="w-5 h-5" />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer hidden md:flex items-center justify-center"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
          {mainNavGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {!isCollapsed && (
                <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {group.groupLabel}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  const buttonContent = (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer relative ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                          : item.highlight
                            ? 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-rose-600' : 'text-slate-500'}`} />
                      
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-1.5 ${
                              isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          {buttonContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-800 text-blue-200">
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return buttonContent;
                })}
              </div>
            </div>
          ))}

          {/* Quick DPI Modals & Launchers */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            {!isCollapsed && (
              <div className="px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Sovereign DPI Toolkit</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">Live</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-1">
              {quickToolModals.map((tool, tIdx) => {
                const ToolIcon = tool.icon;
                const toolBtn = (
                  <button
                    key={tIdx}
                    onClick={tool.action}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer ${
                      isCollapsed ? 'justify-center px-0' : ''
                    }`}
                  >
                    <div className={`p-1.5 rounded-md shrink-0 ${tool.color}`}>
                      <ToolIcon className="w-4 h-4" />
                    </div>
                    {!isCollapsed && (
                      <span className="truncate">{tool.name}</span>
                    )}
                  </button>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={tIdx}>
                      <TooltipTrigger asChild>
                        {toolBtn}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {tool.name}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return toolBtn;
              })}
            </div>
          </div>
        </div>

        {/* User Account / Footer Console */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {authState.isAuthenticated ? (authState.user?.fullName?.[0] || 'U') : 'G'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {authState.isAuthenticated ? authState.user?.fullName : 'Guest Citizen'}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {authState.isAuthenticated ? (authState.user?.role || 'Citizen') : 'Public Access'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab(authState.isAuthenticated ? 'dashboard' : 'login')}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                title={authState.isAuthenticated ? "View Profile" : "Sign In"}
              >
                {authState.isAuthenticated ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab(authState.isAuthenticated ? 'dashboard' : 'login')}
                  className="w-full flex items-center justify-center py-2 text-slate-600 hover:text-blue-600"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    {authState.isAuthenticated ? (authState.user?.fullName?.[0] || 'U') : <User className="w-4 h-4" />}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {authState.isAuthenticated ? `${authState.user?.fullName} (${authState.user?.role})` : 'Sign In'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};
