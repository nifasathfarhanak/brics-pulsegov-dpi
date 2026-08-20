import React, { useState, useEffect } from 'react';
import { AlertTriangle, Radio, ShieldAlert, ChevronRight, Activity, BellRing, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CriticalAlert {
  id: string;
  title: string;
  location: string;
  domain: string;
  timestamp: string;
  status: string;
  trackingCode: string;
  language: string;
  languageCode: string;
  urgencyScore: number;
}

interface LiveEmergencyTickerProps {
  onNavigateToCrisis?: () => void;
}

export const LiveEmergencyTicker: React.FC<LiveEmergencyTickerProps> = ({ onNavigateToCrisis }) => {
  const { speak, isSpeaking, stopSpeaking, currentLanguage, t } = useLanguage();
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [criticalCount, setCriticalCount] = useState(4);

  // Fetch real-time crisis alerts
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/complaints/stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.criticalAlerts && data.criticalAlerts.length > 0) {
            setAlerts(data.criticalAlerts);
            setCriticalCount(data.criticalPriorityCount || data.criticalAlerts.length);
          }
        }
      } catch (err) {
        console.warn('Failed to load live crisis stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000); // 15s live polling
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fallback default critical alerts if empty
  const activeAlerts = alerts.length > 0 ? alerts : [
    {
      id: 'BRICS-MIN-2026-0891',
      title: 'Rural maternity clinic facing continuous water & power outage in Tamil Nadu',
      location: 'Tamil Nadu, India',
      domain: 'Water',
      timestamp: new Date().toISOString(),
      status: 'Registered - Immediate Action Dispatched',
      trackingCode: 'TN-WATER-CLINIC-7701',
      language: 'Tamil (தமிழ்)',
      languageCode: 'ta',
      urgencyScore: 9.9,
    },
    {
      id: 'BRICS-MIN-2026-0744',
      title: '150 vaccine doses at risk due to cold-chain solar failure in KwaZulu-Natal',
      location: 'KwaZulu-Natal, South Africa',
      domain: 'Health',
      timestamp: new Date().toISOString(),
      status: 'Registered - Immediate Action Dispatched',
      trackingCode: 'ZA-KZN-MED-3341',
      language: 'isiZulu',
      languageCode: 'zu',
      urgencyScore: 9.8,
    },
    {
      id: 'BRICS-MIN-2026-0633',
      title: 'Critical river erosion fractures in 3 embankments, tidal surge breach imminent in Sundarbans',
      location: 'West Bengal, India',
      domain: 'Infrastructure',
      timestamp: new Date().toISOString(),
      status: 'Registered - Immediate Action Dispatched',
      trackingCode: 'WB-SUNDARBAN-EMB-1082',
      language: 'Bengali (বাংলা)',
      languageCode: 'bn',
      urgencyScore: 9.7,
    },
    {
      id: 'BRICS-MIN-2026-0519',
      title: 'Coastal borewells heavily saline contaminated, 500 families stranded without drinking water',
      location: 'Odisha, India',
      domain: 'Water',
      timestamp: new Date().toISOString(),
      status: 'Registered - Immediate Action Dispatched',
      trackingCode: 'OD-WATER-PURI-9102',
      language: 'Odia (ଓଡ଼ିଆ)',
      languageCode: 'or',
      urgencyScore: 9.6,
    },
  ];

  // Auto rotate alerts
  useEffect(() => {
    if (isPaused || activeAlerts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAlerts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, activeAlerts.length]);

  const currentAlert = activeAlerts[currentIndex] || activeAlerts[0];

  const handleSpeakAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else if (currentAlert) {
      const speechText = `Critical Priority Alert: Sector ${currentAlert.domain} in ${currentAlert.location}. ${currentAlert.title}. Sovereign Action: ${currentAlert.status}.`;
      speak(speechText, currentAlert.languageCode || currentLanguage);
    }
  };

  return (
    <div
      id="live-emergency-ticker-ribbon"
      className="relative bg-gradient-to-r from-red-950/90 via-slate-900 to-blue-950/90 border-y border-red-500/40 text-white px-4 py-2 text-xs select-none shadow-md z-40 transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <div className="flex items-center gap-1.5 bg-red-900/60 border border-red-500/50 text-red-200 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase text-[10px]">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>{t.criticalPriorityTag || 'CRITICAL PRIORITY (9/10)'}</span>
            <span className="bg-red-600 text-white px-1 rounded text-[9px] ml-0.5">{criticalCount}</span>
          </div>
        </div>

        {/* Middle Scrolling / Rotating Active Alert */}
        <div className="flex-1 overflow-hidden min-w-0 flex items-center gap-2.5">
          <span className="bg-blue-900/60 text-blue-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-blue-700/50 shrink-0">
            {currentAlert.location}
          </span>
          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px] shrink-0 border border-slate-700">
            {currentAlert.domain}
          </span>
          <p className="truncate text-slate-200 font-medium text-xs tracking-tight">
            {currentAlert.title}
          </p>
          <span className="hidden md:inline-flex items-center text-emerald-400 bg-emerald-950/50 border border-emerald-600/40 text-[10px] px-1.5 py-0.2 rounded shrink-0">
            <Activity className="w-3 h-3 mr-1 animate-spin" />
            {t.registeredImmediateAction || currentAlert.status}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* TTS Audio Button */}
          <button
            id="ticker-tts-listen-btn"
            onClick={handleSpeakAlert}
            className={`p-1.5 rounded transition flex items-center gap-1 border ${
              isSpeaking
                ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Listen to Sovereign Alert Broadcast in Gemini Voice"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-300" />
                <span className="hidden sm:inline text-[10px]">{t.speaking || 'Speaking...'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden sm:inline text-[10px]">{t.geminiVoice || 'Gemini Voice'}</span>
              </>
            )}
          </button>

          {/* Inspect Crisis Button */}
          <button
            id="ticker-inspect-crisis-btn"
            onClick={onNavigateToCrisis}
            className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 text-white px-2.5 py-1 rounded font-medium text-[11px] transition shadow-sm border border-red-500/50"
          >
            <span>{t.liveCrisisRoom || 'Live Crisis Room'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
