import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppSidebar, NavTabId } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { SessionTimeoutWarning } from './components/auth/SessionTimeoutWarning';
import { AuthorityDashboard } from './components/dashboard/AuthorityDashboard';
import { NormalUserDashboard } from './components/dashboard/NormalUserDashboard';
import { GeospatialHotspotMap } from './components/GeospatialHotspotMap';
import { CitizenIntakeModal } from './components/CitizenIntakeModal';
import { CitizenPortalView } from './components/CitizenPortalView';
import { CitizenComplaintPage } from './components/CitizenComplaintPage';
import { HotspotsView } from './components/HotspotsView';
import { DPRStudioView } from './components/DPRStudioView';
import { PolicyCopilotView } from './components/PolicyCopilotView';
import { CrisisDashboardView } from './components/CrisisDashboardView';
import { BudgetSimulatorModal } from './components/BudgetSimulatorModal';
import { SovereignBRICSFooter } from './components/SovereignBRICSFooter';

// Flagship Sovereign DPI & Multi-Agent Components
import { WhatsAppTelegramBotModal } from './components/WhatsAppTelegramBotModal';
import { MinisterialPolicyDebate } from './components/MinisterialPolicyDebate';
import { DuplicateClusterVisualizer } from './components/DuplicateClusterVisualizer';
import { IndiaDistrictHierarchy } from './components/IndiaDistrictHierarchy';
import { CrisisSimulationModal } from './components/CrisisSimulationModal';
import { JudgesDemoGuideModal } from './components/JudgesDemoGuideModal';

import { BRICSCountryId, CitizenReport, DemandHotspot, RegionData, UserRole } from './types';
import { INITIAL_CITIZEN_REPORTS, DEMAND_HOTSPOTS, REGIONS_DATA } from './data/bricsData';
import { X } from 'lucide-react';

function MainAppContent() {
  const { authState } = useAuth();
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTabId>(
    authState.isAuthenticated ? 'dashboard' : 'map'
  );

  const [selectedCountry, setSelectedCountry] = useState<BRICSCountryId | 'all'>('all');
  
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Data state
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [hotspots, setHotspots] = useState<DemandHotspot[]>(DEMAND_HOTSPOTS);

  // Modals & Cross-tab navigation state
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);
  const [selectedHotspotForDPR, setSelectedHotspotForDPR] = useState<DemandHotspot | null>(null);
  const [budgetModalRegion, setBudgetModalRegion] = useState<RegionData | null>(null);

  // Sovereign DPI Feature Modals
  const [isWhatsAppBotOpen, setIsWhatsAppBotOpen] = useState<boolean>(false);
  const [isPolicyDebateOpen, setIsPolicyDebateOpen] = useState<boolean>(false);
  const [isDuplicateInspectorOpen, setIsDuplicateInspectorOpen] = useState<boolean>(false);
  const [isIndiaHierarchyOpen, setIsIndiaHierarchyOpen] = useState<boolean>(false);
  const [isCrisisSimulationOpen, setIsCrisisSimulationOpen] = useState<boolean>(false);
  const [isJudgesGuideOpen, setIsJudgesGuideOpen] = useState<boolean>(false);

  // Stats calculation
  const totalBeneficiariesNum = hotspots.reduce((acc, h) => acc + h.estimatedBeneficiaries, 0);
  const totalBeneficiariesFormatted = `${(totalBeneficiariesNum / 1000000).toFixed(1)}M citizens`;
  const totalBudgetGapM = REGIONS_DATA.reduce((acc, r) => acc + r.deficitBudgetM, 0);

  const handleAddNewReport = (newReport: CitizenReport) => {
    setReports((prev) => [newReport, ...prev]);
    setHotspots((prev) =>
      prev.map((h) =>
        h.regionId === newReport.regionId && h.sector === newReport.category
          ? { 
              ...h, 
              demandIntensity: (typeof h.demandIntensity === 'number' ? h.demandIntensity : 0) + 1, 
              associatedReportsCount: (h.associatedReportsCount || 0) + 1 
            }
          : h
      )
    );
  };

  const handleUpvoteReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleNavigateToDPR = (hotspot: DemandHotspot) => {
    setSelectedHotspotForDPR(hotspot);
    setActiveTab('dpr-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBudgetModal = (region: RegionData) => {
    setBudgetModalRegion(region);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setActiveTab('dashboard');
  };

  const handleSignUpComplete = () => {
    setActiveTab('login');
  };

  const handleTabSelect = (tab: NavTabId) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Session Inactivity Timeout Modal Warning */}
      <SessionTimeoutWarning />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={handleTabSelect}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenWhatsAppBot={() => setIsWhatsAppBotOpen(true)}
          onOpenPolicyDebate={() => setIsPolicyDebateOpen(true)}
          onOpenDuplicateInspector={() => setIsDuplicateInspectorOpen(true)}
          onOpenIndiaHierarchy={() => setIsIndiaHierarchyOpen(true)}
          onOpenCrisisSimulation={() => setIsCrisisSimulationOpen(true)}
          onOpenJudgesGuide={() => setIsJudgesGuideOpen(true)}
          hotspotsCount={hotspots.length}
          criticalAlertsCount={4}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col relative animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 z-10 cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
            <AppSidebar
              activeTab={activeTab}
              setActiveTab={handleTabSelect}
              isCollapsed={false}
              setIsCollapsed={() => {}}
              onOpenWhatsAppBot={() => {
                setIsMobileSidebarOpen(false);
                setIsWhatsAppBotOpen(true);
              }}
              onOpenPolicyDebate={() => {
                setIsMobileSidebarOpen(false);
                setIsPolicyDebateOpen(true);
              }}
              onOpenDuplicateInspector={() => {
                setIsMobileSidebarOpen(false);
                setIsDuplicateInspectorOpen(true);
              }}
              onOpenIndiaHierarchy={() => {
                setIsMobileSidebarOpen(false);
                setIsIndiaHierarchyOpen(true);
              }}
              onOpenCrisisSimulation={() => {
                setIsMobileSidebarOpen(false);
                setIsCrisisSimulationOpen(true);
              }}
              onOpenJudgesGuide={() => {
                setIsMobileSidebarOpen(false);
                setIsJudgesGuideOpen(true);
              }}
              hotspotsCount={hotspots.length}
              criticalAlertsCount={4}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Column: Header + Dynamic Page Content + Footer */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        
        {/* Modern Top Header Bar */}
        <AppHeader
          activeTab={activeTab}
          setActiveTab={handleTabSelect}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          onOpenIntakeModal={() => handleTabSelect('raise-complaint')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          stats={{
            totalReports: reports.length,
            hotspotsCount: hotspots.length,
            totalBeneficiaries: totalBeneficiariesFormatted,
            budgetGapM: totalBudgetGapM,
          }}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
          
          {/* VIEW 0: DEDICATED RAISE COMPLAINT PAGE */}
          {activeTab === 'raise-complaint' && (
            <CitizenComplaintPage
              onReportSubmitted={handleAddNewReport}
              onNavigateToFeed={() => handleTabSelect('citizen-portal')}
              selectedCountry={selectedCountry}
            />
          )}

          {/* VIEW 1: AUTHENTICATION - LOGIN */}
          {activeTab === 'login' && (
            <LoginPage
              onNavigateToSignUp={() => handleTabSelect('signup')}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {/* VIEW 2: AUTHENTICATION - SIGN UP (4-Step Wizard) */}
          {activeTab === 'signup' && (
            <SignUpPage
              onNavigateToLogin={() => handleTabSelect('login')}
              onRegistrationComplete={handleSignUpComplete}
            />
          )}

          {/* VIEW 3: ROLE-BASED DASHBOARDS (Authority vs Normal User) */}
          {activeTab === 'dashboard' && (
            <>
              {authState.isAuthenticated ? (
                authState.user?.role === 'authority' ? (
                  <AuthorityDashboard
                    onOpenDPRStudio={(title, budgetM, sector) => {
                      handleTabSelect('dpr-studio');
                    }}
                  />
                ) : (
                  <NormalUserDashboard />
                )
              ) : (
                <LoginPage
                  onNavigateToSignUp={() => handleTabSelect('signup')}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
            </>
          )}

          {/* VIEW 4: GEOSPATIAL MAP */}
          {activeTab === 'map' && (
            <GeospatialHotspotMap
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              hotspots={hotspots}
              onSelectHotspot={handleNavigateToDPR}
              onGenerateDPRForHotspot={handleNavigateToDPR}
              onOpenBudgetSimulator={handleOpenBudgetModal}
              onOpenWhatsAppBot={() => setIsWhatsAppBotOpen(true)}
              onOpenPolicyDebate={() => setIsPolicyDebateOpen(true)}
              onOpenDuplicateInspector={() => setIsDuplicateInspectorOpen(true)}
              onOpenIndiaHierarchy={() => setIsIndiaHierarchyOpen(true)}
              onOpenCrisisSimulation={() => setIsCrisisSimulationOpen(true)}
              onOpenJudgesGuide={() => setIsJudgesGuideOpen(true)}
            />
          )}

          {/* VIEW 5: CITIZEN PORTAL */}
          {activeTab === 'citizen-portal' && (
            <CitizenPortalView
              reports={reports}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              onOpenIntakeModal={() => handleTabSelect('raise-complaint')}
              onUpvoteReport={handleUpvoteReport}
            />
          )}

          {/* VIEW 6: DEMAND HOTSPOTS (Prioritization Matrix) */}
          {activeTab === 'hotspots' && (
            <HotspotsView
              hotspots={hotspots}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              onGenerateDPR={handleNavigateToDPR}
              onOpenBudgetSimulator={handleOpenBudgetModal}
            />
          )}

          {/* VIEW 7: AI DPR & CAPEX ALLOCATION STUDIO */}
          {activeTab === 'dpr-studio' && (
            <DPRStudioView
              initialHotspot={selectedHotspotForDPR}
              selectedCountry={selectedCountry}
            />
          )}

          {/* VIEW 8: POLICY COPILOT */}
          {activeTab === 'copilot' && (
            <PolicyCopilotView
              selectedCountry={selectedCountry}
              onNavigateBack={() => handleTabSelect('map')}
            />
          )}

          {/* VIEW 9: LIVE MINISTERIAL CRISIS DASHBOARD */}
          {activeTab === 'crisis-dashboard' && (
            <CrisisDashboardView
              onOpenDPRStudio={(complaint) => {
                handleTabSelect('dpr-studio');
              }}
              onOpenGISHotspot={(region) => {
                handleTabSelect('map');
              }}
            />
          )}

        </main>

        {/* Global Modals */}
        <CitizenIntakeModal
          isOpen={isIntakeModalOpen}
          onClose={() => setIsIntakeModalOpen(false)}
          onSubmitReport={handleAddNewReport}
        />

        <BudgetSimulatorModal
          isOpen={!!budgetModalRegion}
          onClose={() => setBudgetModalRegion(null)}
          region={budgetModalRegion}
        />

        {/* 1. WhatsApp & Telegram DPI Citizen Intake Simulator */}
        <WhatsAppTelegramBotModal
          isOpen={isWhatsAppBotOpen}
          onClose={() => setIsWhatsAppBotOpen(false)}
          onTrackOnMap={(regionId) => {
            setIsWhatsAppBotOpen(false);
            handleTabSelect('map');
          }}
          onAddReport={(report) => {
            handleAddNewReport(report);
          }}
        />

        {/* 2. Ministerial Policy Chamber Modal */}
        {isPolicyDebateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-5xl w-full p-4 sm:p-6 my-auto shadow-2xl relative">
              <button
                onClick={() => setIsPolicyDebateOpen(false)}
                className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer z-10 font-semibold"
              >
                ✕ Close
              </button>
              <div className="mt-2">
                <MinisterialPolicyDebate
                  onApproveFunding={(summary, budgetM) => {
                    setIsPolicyDebateOpen(false);
                    handleTabSelect('dpr-studio');
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Semantic Duplicate Clustering Inspector Modal */}
        {isDuplicateInspectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-5xl w-full p-4 sm:p-6 my-auto shadow-2xl relative">
              <button
                onClick={() => setIsDuplicateInspectorOpen(false)}
                className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer z-10 font-semibold"
              >
                ✕ Close
              </button>
              <div className="mt-2">
                <DuplicateClusterVisualizer />
              </div>
            </div>
          </div>
        )}

        {/* 4. Pan-India District & Ward Hierarchy Drilldown Modal */}
        {isIndiaHierarchyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-5xl w-full p-4 sm:p-6 my-auto shadow-2xl relative">
              <button
                onClick={() => setIsIndiaHierarchyOpen(false)}
                className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer z-10 font-semibold"
              >
                ✕ Close
              </button>
              <div className="mt-2">
                <IndiaDistrictHierarchy />
              </div>
            </div>
          </div>
        )}

        {/* 5. Live Disaster Simulation Engine Modal */}
        <CrisisSimulationModal
          isOpen={isCrisisSimulationOpen}
          onClose={() => setIsCrisisSimulationOpen(false)}
          onInjectReports={(newSimReports) => {
            setReports((prev) => [...newSimReports, ...prev]);
          }}
          onNavigateToMap={(regionId) => {
            setIsCrisisSimulationOpen(false);
            handleTabSelect('map');
          }}
          onNavigateToDPRStudio={(title, budgetM, sector) => {
            setIsCrisisSimulationOpen(false);
            handleTabSelect('dpr-studio');
          }}
        />

        {/* 6. Hackathon Evaluators Tour Guide Modal */}
        <JudgesDemoGuideModal
          isOpen={isJudgesGuideOpen}
          onClose={() => setIsJudgesGuideOpen(false)}
          onLaunchWhatsAppBot={() => {
            setIsJudgesGuideOpen(false);
            setIsWhatsAppBotOpen(true);
          }}
          onLaunchPolicyDebate={() => {
            setIsJudgesGuideOpen(false);
            setIsPolicyDebateOpen(true);
          }}
          onLaunchDuplicateInspector={() => {
            setIsJudgesGuideOpen(false);
            setIsDuplicateInspectorOpen(true);
          }}
          onLaunchIndiaHierarchy={() => {
            setIsJudgesGuideOpen(false);
            setIsIndiaHierarchyOpen(true);
          }}
          onLaunchCrisisSimulation={() => {
            setIsJudgesGuideOpen(false);
            setIsCrisisSimulationOpen(true);
          }}
          onNavigateToMap={() => {
            setIsJudgesGuideOpen(false);
            handleTabSelect('map');
          }}
          onNavigateToDPRStudio={() => {
            setIsJudgesGuideOpen(false);
            handleTabSelect('dpr-studio');
          }}
        />

        {/* Official 10 BRICS Sovereign Member Footer */}
        <SovereignBRICSFooter
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
          onNavigateToTab={(tab) => handleTabSelect(tab as any)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
