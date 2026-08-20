import React, { useState, useEffect } from 'react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { BRICSCountryId, MinisterialComplaint } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Activity,
  ArrowLeft,
  RotateCcw,
  Download,
  Building2,
  Globe2,
  ShieldCheck,
  Briefcase,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Radio,
  FileCode,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PolicyCopilotViewProps {
  selectedCountry: BRICSCountryId | 'all';
  onNavigateBack?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  spokenSummary?: string;
  timestamp: string;
  roleContext?: string;
  isDuplicate?: boolean;
  duplicateMessage?: string;
  isValid?: boolean;
  validityFeedback?: string;
  sentiment?: string;
  urgencyLevel?: 'Critical' | 'Medium' | 'Low';
  isEmergencyEscalation?: boolean;
  ministerialDomain?: string;
  policyImpact?: {
    shortTerm?: string;
    longTerm?: string;
    economicMultiplier?: string;
    sdgAlignment?: string[];
  };
  auditTrail?: {
    assignedDepartment?: string;
    slaDays?: number;
    sovereignTrackingCode?: string;
  };
  structuredComplaint?: MinisterialComplaint;
}

const MINISTERIAL_DOMAINS = [
  { id: 'all', name: 'All Sovereign Portfolios', icon: Globe2, desc: 'Holistic cross-border synthesis' },
  { id: 'Infrastructure', name: 'Infrastructure & CapEx', icon: Building2, desc: 'Transport corridors, bridges, roads & freight' },
  { id: 'Water', name: 'Water & Sanitation', icon: Activity, desc: 'Drinking water, borewells, arsenic filtration & pipelines' },
  { id: 'Energy', name: 'Energy & Microgrids', icon: Flame, desc: 'Decentralized solar, cold-chain clinic storage & rural grids' },
  { id: 'Digital Public Infrastructure (DPI)', name: 'Digital Public Infrastructure (DPI)', icon: Cpu, desc: 'OpenG2P, MOSIP biometrics, telemetry & instant settlement' },
];

const STRATEGIC_DIRECTIVES = [
  {
    domain: 'Water',
    label: 'Report failure of 24/7 drinking water & solar power at rural maternity clinic in Tamil Nadu.',
    tamil: 'தமிழ்நாடு கிராமப்புற ஆரம்ப சுகாதார நிலையத்தில் குடிநீர் மற்றும் மின்சார செயலிழப்பு புகார்.',
    hindi: 'तमिलनाडु के ग्रामीण मातृत्व क्लिनिक में पेयजल और बिजली विफलता की शिकायत।'
  },
  {
    domain: 'Infrastructure',
    label: 'Register urgent report: Broken culvert bridge and arsenic contamination in 3 borewells in Bihar.',
    tamil: 'பீகாரில் 3 ஆழ்துளை கிணறுகளில் ஆர்சனிக் நச்சு மற்றும் உடைந்த தரைப்பாலம் புகார்.',
    hindi: 'बिहार में 3 बोरवेल में आर्सेनिक प्रदूषण और टूटी पुलिया की आपातकालीन शिकायत दर्ज करें।'
  },
  {
    domain: 'Energy',
    label: 'Semi-arid community solar microgrid inverter breakdown impacting 320 farmers in Bahia, Brazil.',
    tamil: 'பிரேசிலின் பாஹியாவில் 320 விவசாயிகளை பாதிக்கும் சூரிய மின்கல செயலிழப்பு.',
    hindi: 'ब्राजील के बाहिया में 320 किसानों को प्रभावित करने वाले सोलर माइक्रोग्रिड की खराबी।'
  },
  {
    domain: 'Digital Public Infrastructure (DPI)',
    label: 'Deploy zero-debt OpenG2P telemetry for direct DBT social security transfers in Ethiopia.',
    tamil: 'எத்தியோப்பியாவில் நேரடி சமூகப் பாதுகாப்புக்கான திறந்த மூல டிபிஐ வரிசைப்படுத்தல்.',
    hindi: 'इथियोपिया में प्रत्यक्ष सामाजिक सुरक्षा हस्तांतरण हेतु शून्य-ऋण ओपनजी2पी डीपीआई लागू करें।'
  }
];

export const PolicyCopilotView: React.FC<PolicyCopilotViewProps> = ({
  selectedCountry,
  onNavigateBack,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('Infrastructure');
  const [activeTabMode, setActiveTabMode] = useState<'advisor' | 'database'>('advisor');
  
  const INITIAL_WELCOME: ChatMessage = {
    id: 'welcome_sovereign_1',
    sender: 'model',
    text: `### 🏛️ BRICS Sovereign Intelligence Hub & Live Voice Agent

Welcome. I am the **BRICS Sovereign Intelligence Hub & Live Voice Agent**, your official real-time Ministerial AI Strategic & Policy Advisor for Digital Public Infrastructure (DPI), CapEx, Infrastructure, Water, Energy, and Sovereign Governance.

**Operational Core Directives:**
- 🌐 **33-Language Multilingual Mastery**: Real-time native voice synthesis and automatic language detection across all 33 official BRICS languages.
- 🛡️ **Strict Duplicate Prevention**: Automatic semantic index matching against active municipal grievance logs before registering any complaint.
- 🔍 **Actionable Validity Filter**: Rigorous evaluation of Infrastructure, CapEx, Water, Energy, and DPI requests.
- ⚡ **Sentiment & Emergency Escalation**: Automated distress classification, department dispatch, and SLA enforcement.
- 📊 **Policy Impact Simulation**: Short-term (0-12m) & Long-term (1-5yr) economic multipliers and zero-debt open standards.

Speak or formulate your sovereign ministerial directive below.`,
    spokenSummary: 'Welcome to the BRICS Sovereign Intelligence Hub. I am your ministerial AI voice and strategic advisor ready to assist across all thirty-three languages.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoSpeakResponse, setAutoSpeakResponse] = useState<boolean>(true);
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = useState<string | null>(null);
  const [registeredComplaints, setRegisteredComplaints] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState<boolean>(false);
  const [selectedJsonRecord, setSelectedJsonRecord] = useState<any | null>(null);

  const {
    currentLanguage,
    currentLanguageInfo,
    speak,
    stopSpeaking,
    isSpeaking,
    startListening,
    stopListening,
    isListening,
    listenError,
    listeningLanguageName,
    isRTL,
    t
  } = useLanguage();

  const fetchComplaintsDB = async () => {
    setIsLoadingDB(true);
    try {
      const res = await fetch('/api/brics-complaints');
      if (res.ok) {
        const data = await res.json();
        setRegisteredComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error('Failed to fetch complaints database:', err);
    } finally {
      setIsLoadingDB(false);
    }
  };

  useEffect(() => {
    fetchComplaintsDB();
  }, []);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMessageId = `user_${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roleContext: `Domain: ${selectedDomain}`,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/policy-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          countryId: selectedCountry,
          ministerialDomain: selectedDomain,
          languageCode: currentLanguage,
          history: messages.slice(-8).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const botMessageId = `model_${Date.now()}`;
      const botResponseText = data.text || 'Sovereign directive processed successfully.';
      const spokenSummary = data.spokenSummary || data.text?.slice(0, 200) || 'Processed directive.';

      const newBotMsg: ChatMessage = {
        id: botMessageId,
        sender: 'model',
        text: botResponseText,
        spokenSummary: spokenSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        roleContext: data.ministerialDomain || selectedDomain,
        isDuplicate: data.isDuplicate || false,
        duplicateMessage: data.duplicateMessage,
        isValid: data.isValid !== false,
        validityFeedback: data.validityFeedback,
        sentiment: data.sentiment,
        urgencyLevel: data.urgencyLevel,
        isEmergencyEscalation: data.isEmergencyEscalation,
        ministerialDomain: data.ministerialDomain,
        policyImpact: data.policyImpact,
        auditTrail: data.auditTrail,
        structuredComplaint: data.structuredComplaint,
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // If registered new structured complaint, refresh DB count
      if (data.structuredComplaint) {
        fetchComplaintsDB();
      }

      // Auto-Speak in Native Language if enabled
      if (autoSpeakResponse && spokenSummary) {
        setCurrentlySpeakingMsgId(botMessageId);
        speak(spokenSummary, currentLanguage);
      }
    } catch (err) {
      console.error('Error in BRICS Sovereign Intelligence Hub Voice Agent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening({
        lang: currentLanguage,
        continuous: false,
        onResult: (transcript) => {
          setInputMessage(transcript);
        },
        onError: (err) => {
          console.warn('Speech recognition notice:', err);
        },
      });
    }
  };

  const handleToggleSpeakMessage = (msg: ChatMessage) => {
    if (isSpeaking && currentlySpeakingMsgId === msg.id) {
      stopSpeaking();
      setCurrentlySpeakingMsgId(null);
    } else {
      stopSpeaking();
      setCurrentlySpeakingMsgId(msg.id);
      speak(msg.spokenSummary || msg.text, currentLanguage);
    }
  };

  const handleResetConversation = () => {
    setMessages([INITIAL_WELCOME]);
    setInputMessage('');
    stopSpeaking();
    stopListening();
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      
      {/* Header Banner */}
      <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
                BRICS Sovereign Intelligence Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-[11px] font-mono border border-blue-700/50 flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                Ministerial AI Voice Agent (33 Languages Active)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>BRICS Sovereign Intelligence Hub & Live Voice Agent</span>
            </h1>
            <p className="text-xs sm:text-sm text-cyan-300 font-medium mt-1">
              Official Real-Time Ministerial AI Strategic & Policy Advisor • BRICS Digital Public Infrastructure & Sovereign CapEx
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Real-time voice dialogue, strict duplicate prevention, automated validity filtering, sentiment & urgency triage, and short-to-long term policy impact simulation.
            </p>
          </div>

          {/* Navigation & Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToPrevious}</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="flex items-center bg-[#070F1E] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTabMode('advisor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTabMode === 'advisor'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Voice Advisor</span>
              </button>
              <button
                onClick={() => {
                  setActiveTabMode('database');
                  fetchComplaintsDB();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTabMode === 'database'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Persisted Records ({registeredComplaints.length})</span>
              </button>
            </div>

            <button
              onClick={handleResetConversation}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Ministerial Domain Selector */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 block">
            Select Active Ministerial Portfolio Scope:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {MINISTERIAL_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all text-left flex items-start gap-2 border ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-700 to-[#1E3A8A] text-white border-blue-400 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-cyan-400'}`} />
                  <div>
                    <div className="font-bold leading-tight">{domain.name}</div>
                    <div className="text-[10px] opacity-75 font-normal line-clamp-1 mt-0.5">{domain.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: Voice Advisor Dialogue & Real-Time Intelligence */}
      {activeTabMode === 'advisor' && (
        <div className="space-y-6">
          {/* Strategic Directives Shelf */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-2.5">
            <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Preset Sovereign Directives & Actionable Complaints (Click to Test):</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Tests Duplicate Prevention & Triage
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {STRATEGIC_DIRECTIVES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDomain(item.domain);
                    handleSendMessage(item.label);
                  }}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-bold">
                      {item.domain}
                    </span>
                  </div>
                  <div className="text-xs text-white font-medium group-hover:text-cyan-300 line-clamp-2">
                    "{item.label}"
                  </div>
                  <div className="text-[10px] text-cyan-200/70 mt-1 line-clamp-1">
                    {item.tamil}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Chat Conversation Container */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col min-h-[520px]">
            
            {/* Chat Header Voice Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Auto-Detected Active Language:</span>
                <span className="px-2.5 py-1 rounded-md bg-blue-900/60 border border-blue-700/50 text-cyan-300 font-mono text-xs font-bold">
                  {currentLanguageInfo.nativeName} ({currentLanguageInfo.name})
                </span>
                {isRTL && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                    RTL Layout Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Auto-Speak Response Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoSpeakResponse(!autoSpeakResponse)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    autoSpeakResponse
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                  title="Automatically vocalize Gemini Sovereign Agent responses aloud in native voice"
                >
                  {autoSpeakResponse ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{autoSpeakResponse ? 'Auto-Voice: ON' : 'Auto-Voice: OFF'}</span>
                </button>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold animate-pulse"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Audio</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 space-y-5 overflow-y-auto pr-1">
              {messages.map((msg) => {
                const isModel = msg.sender === 'model';
                const isThisMsgSpeaking = isSpeaking && currentlySpeakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
                  >
                    {isModel && (
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-500 p-0.5 shrink-0 shadow-md">
                        <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center">
                          <Bot className="w-5 h-5 text-cyan-400" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-3xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                        isModel
                          ? isThisMsgSpeaking
                            ? 'bg-[#0B1A35] border-2 border-cyan-400/80 text-slate-100 ring-2 ring-cyan-500/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-100'
                          : 'bg-[#1E3A8A] text-white'
                      }`}
                    >
                      {/* Message Metadata Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10 text-[11px] font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold">
                            {isModel ? 'BRICS Sovereign Intelligence Hub' : 'Ministerial Directive'}
                          </span>
                          {msg.roleContext && (
                            <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px]">
                              {msg.roleContext}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {isModel && (
                            <button
                              onClick={() => handleToggleSpeakMessage(msg)}
                              className={`transition-colors px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-semibold ${
                                isThisMsgSpeaking
                                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 animate-pulse'
                                  : 'hover:text-emerald-400 text-slate-400 bg-slate-950 hover:bg-slate-800 border border-slate-800'
                              }`}
                              title={isThisMsgSpeaking ? 'Stop voice' : 'Listen in native voice'}
                            >
                              {isThisMsgSpeaking ? (
                                <>
                                  <span className="flex gap-0.5 items-end h-3">
                                    <span className="w-1 bg-emerald-400 animate-ping rounded-full h-full" />
                                    <span className="w-1 bg-emerald-400 animate-pulse rounded-full h-2" />
                                    <span className="w-1 bg-emerald-400 animate-bounce rounded-full h-3" />
                                  </span>
                                  <span>Speaking Native Audio...</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>
                          )}
                          <span className="text-slate-400">{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* 1. DUPLICATE ALERT CARD */}
                      {msg.isDuplicate && (
                        <div className="mb-3 p-3.5 rounded-xl bg-blue-950/80 border-2 border-cyan-500/70 text-cyan-200 space-y-2">
                          <div className="flex items-center gap-2 font-bold text-cyan-300 text-xs">
                            <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>Strict Duplicate Prevention Filter Triggered</span>
                          </div>
                          <p className="text-xs leading-normal">
                            {msg.duplicateMessage || 'This complaint has already been registered in the sovereign municipal logs.'}
                          </p>
                        </div>
                      )}

                      {/* 2. VALIDITY ALERT CARD */}
                      {msg.isValid === false && msg.validityFeedback && (
                        <div className="mb-3 p-3.5 rounded-xl bg-rose-950/60 border-2 border-rose-500/70 text-rose-200 space-y-1.5">
                          <div className="flex items-center gap-2 font-bold text-rose-300 text-xs">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Validity Filter: Non-Actionable Inquiry</span>
                          </div>
                          <p className="text-xs leading-normal">{msg.validityFeedback}</p>
                        </div>
                      )}

                      {/* 3. SENTIMENT, URGENCY & EMERGENCY BADGES */}
                      {isModel && (msg.urgencyLevel || msg.sentiment) && (
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {msg.isEmergencyEscalation && (
                            <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] flex items-center gap-1.5 animate-pulse shadow-md">
                              <Flame className="w-3.5 h-3.5" />
                              Emergency Escalation Protocol Dispatched
                            </span>
                          )}

                          {msg.urgencyLevel && (
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                              msg.urgencyLevel === 'Critical'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : msg.urgencyLevel === 'Medium'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}>
                              Priority: {msg.urgencyLevel}
                            </span>
                          )}

                          {msg.sentiment && (
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                              Sentiment: {msg.sentiment}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Markdown Content */}
                      <div className="prose prose-invert prose-xs sm:prose-sm max-w-none prose-headings:text-cyan-300 prose-strong:text-white prose-a:text-sky-300 leading-relaxed">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>

                      {/* 4. POLICY IMPACT SIMULATION CARD */}
                      {isModel && msg.policyImpact && (
                        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-blue-500/30 space-y-2">
                          <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Projected Policy Impact Simulation (Zero-Debt Sovereignty):</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                              <div className="text-slate-400 text-[10px] uppercase font-bold">Short-Term (0-12 Mo)</div>
                              <div className="text-white mt-0.5">{msg.policyImpact.shortTerm}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                              <div className="text-slate-400 text-[10px] uppercase font-bold">Long-Term (1-5 Yr)</div>
                              <div className="text-white mt-0.5">{msg.policyImpact.longTerm}</div>
                            </div>
                          </div>
                          {msg.policyImpact.economicMultiplier && (
                            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                              <span>ROI Multiplier:</span>
                              <strong>{msg.policyImpact.economicMultiplier}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. STRUCTURED COMPLAINT PERSISTENCE BADGE */}
                      {isModel && msg.structuredComplaint && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Persisted in Sovereign DB: <strong>{msg.structuredComplaint.ComplaintID}</strong></span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedJsonRecord(msg.structuredComplaint);
                              setActiveTabMode('database');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <FileCode className="w-3 h-3" />
                            <span>Inspect JSON Schema</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {!isModel && (
                      <div className="w-9 h-9 rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                        <Briefcase className="w-4 h-4 text-cyan-300" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shrink-0 animate-pulse">
                    <div className="w-full h-full bg-[#0A192F] rounded-[14px] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-cyan-300 flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing sovereign policy analysis & native voice in {currentLanguageInfo.nativeName}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Listening Active Wave Bar */}
            {isListening && (
              <div className="mt-3 p-3.5 rounded-2xl bg-blue-950/80 border-2 border-cyan-500/70 flex items-center justify-between gap-3 text-xs text-cyan-300 animate-pulse shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold">
                    🎙️ Listening in {listeningLanguageName || currentLanguageInfo.nativeName}... Speak your sovereign directive now
                  </span>
                </div>
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-3 py-1 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors shadow"
                >
                  Done Speaking
                </button>
              </div>
            )}

            {/* Listen Error Notice */}
            {listenError && (
              <div className="mt-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/40 p-2 rounded-xl">
                {listenError}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2"
            >
              {/* Voice-to-Text Microphone Button */}
              <button
                type="button"
                id="policy-voice-mic-btn"
                onClick={toggleSpeechRecognition}
                className={`p-3.5 rounded-2xl border transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-600 border-rose-400 text-white ring-4 ring-rose-500/30 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-400 hover:text-cyan-300'
                }`}
                title={isListening ? 'Stop listening' : `Voice Input in ${currentLanguageInfo.nativeName} (${currentLanguageInfo.name})`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                id="policy-chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isListening
                    ? `Listening in ${currentLanguageInfo.nativeName}... speak now`
                    : `Speak or type ministerial directive in ${currentLanguageInfo.nativeName} or English...`
                }
                className={`flex-1 bg-slate-900 border rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  isListening
                    ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                    : 'border-slate-700 focus:border-blue-400'
                }`}
              />

              <button
                type="submit"
                id="policy-chat-send-btn"
                disabled={!inputMessage.trim() || isLoading}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-[#1E3A8A] hover:from-blue-500 hover:to-blue-700 text-white disabled:opacity-50 transition-all shadow-md active:scale-95 shrink-0"
                title="Execute Directive"
              >
                <Send className="w-5 h-5 text-cyan-300" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* VIEW MODE 2: Persisted JSON Records & Sovereign Audit Trail */}
      {activeTabMode === 'database' && (
        <div className="bg-[#0A192F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>Persisted Ministerial Complaints & DPI Audit Logs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured backend persistence store in compliance with specified schema.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchComplaintsDB}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoadingDB ? 'animate-spin' : ''}`} />
                <span>Refresh Logs</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* List of Registered Complaints */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Sovereign Records ({registeredComplaints.length})
              </div>

              {registeredComplaints.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No records persisted yet. Use the Voice Advisor to register a complaint.
                </div>
              ) : (
                registeredComplaints.map((item: any) => {
                  const isSelected = selectedJsonRecord?.ComplaintID === item.ComplaintID;
                  return (
                    <div
                      key={item.ComplaintID}
                      onClick={() => setSelectedJsonRecord(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B1A35] border-cyan-400 shadow-md ring-2 ring-cyan-500/20'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-cyan-300">
                          {item.ComplaintID}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.UrgencyLevel === 'Critical'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {item.UrgencyLevel}
                        </span>
                      </div>

                      <div className="text-xs text-white font-medium line-clamp-2">
                        {item.ComplaintDetails}
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
                        <span>Domain: <strong className="text-cyan-300">{item.MinisterialDomain}</strong></span>
                        <span>Language: <strong>{item.UserLanguage}</strong></span>
                        <span>SLA: <strong>{item.AuditTrail?.slaDays || 7} Days</strong></span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* JSON Schema Inspector */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Structured JSON Schema Output</span>
                </div>

                {selectedJsonRecord && (
                  <button
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(selectedJsonRecord, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedJsonRecord.ComplaintID}.json`;
                      a.click();
                    }}
                    className="text-[11px] text-cyan-300 hover:text-white font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download JSON</span>
                  </button>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[400px] overflow-x-auto font-mono text-xs text-emerald-400">
                {selectedJsonRecord ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(selectedJsonRecord, null, 2)}</pre>
                ) : registeredComplaints.length > 0 ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(registeredComplaints[0], null, 2)}</pre>
                ) : (
                  <div className="text-slate-500 italic">Select a record to inspect its structured JSON output.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
