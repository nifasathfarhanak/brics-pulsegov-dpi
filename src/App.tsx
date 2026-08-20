import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
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
import { INITIAL_CITIZEN_REPORTS, DEMAND_HOTSPOTS, REGIONS_DATA, BRICS_COUNTRIES } from './data/bricsData';

function MainAppContent() {
  const { authState } = useAuth();
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'login' | 'signup' | 'map' | 'citizen-portal' | 'hotspots' | 'dpr-studio' | 'copilot' | 'crisis-dashboard' | 'raise-complaint'
  >(authState.isAuthenticated ? 'dashboard' : 'map');

  const [selectedCountry, setSelectedCountry] = useState<BRICSCountryId | 'all'>('all');
  
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

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Session Inactivity Timeout Modal Warning */}
      <SessionTimeoutWarning />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onOpenIntakeModal={() => setActiveTab('raise-complaint')}
        stats={{
          totalReports: reports.length,
          hotspotsCount: hotspots.length,
          totalBeneficiaries: totalBeneficiariesFormatted,
          budgetGapM: totalBudgetGapM,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-8 overflow-x-hidden">
        
        {/* VIEW 0: DEDICATED RAISE COMPLAINT PAGE */}
        {activeTab === 'raise-complaint' && (
          <CitizenComplaintPage
            onReportSubmitted={handleAddNewReport}
            onNavigateToFeed={() => setActiveTab('citizen-portal')}
            selectedCountry={selectedCountry}
          />
        )}

        {/* VIEW 1: AUTHENTICATION - LOGIN */}
        {activeTab === 'login' && (
          <LoginPage
            onNavigateToSignUp={() => setActiveTab('signup')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* VIEW 2: AUTHENTICATION - SIGN UP (4-Step Wizard) */}
        {activeTab === 'signup' && (
          <SignUpPage
            onNavigateToLogin={() => setActiveTab('login')}
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
                    setActiveTab('dpr-studio');
                  }}
                />
              ) : (
                <NormalUserDashboard />
              )
            ) : (
              <LoginPage
                onNavigateToSignUp={() => setActiveTab('signup')}
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
            onOpenIntakeModal={() => setActiveTab('raise-complaint')}
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
            onNavigateBack={() => setActiveTab('map')}
          />
        )}

        {/* VIEW 9: LIVE MINISTERIAL CRISIS DASHBOARD */}
        {activeTab === 'crisis-dashboard' && (
          <CrisisDashboardView
            onOpenDPRStudio={(complaint) => {
              setActiveTab('dpr-studio');
            }}
            onOpenGISHotspot={(region) => {
              setActiveTab('map');
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
          setActiveTab('map');
        }}
        onAddReport={(report) => {
          handleAddNewReport(report);
        }}
      />

      {/* 2. Ministerial Policy Chamber Modal */}
      {isPolicyDebateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
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
                  setActiveTab('dpr-studio');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Semantic Duplicate Clustering Inspector Modal */}
      {isDuplicateInspectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
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
          setActiveTab('map');
        }}
        onNavigateToDPRStudio={(title, budgetM, sector) => {
          setIsCrisisSimulationOpen(false);
          setActiveTab('dpr-studio');
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
          setActiveTab('map');
        }}
        onNavigateToDPRStudio={() => {
          setIsJudgesGuideOpen(false);
          setActiveTab('dpr-studio');
        }}
      />

      {/* Official 10 BRICS Sovereign Member Footer */}
      <SovereignBRICSFooter
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onNavigateToTab={(tab) => setActiveTab(tab as any)}
      />
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
