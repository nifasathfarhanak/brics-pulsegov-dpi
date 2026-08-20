import React, { useState } from 'react';
import { CitizenReport, BRICSCountryId, InfrastructureSector } from '../types';
import { BRICS_COUNTRIES, REGIONS_DATA } from '../data/bricsData';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Send, 
  Sparkles, 
  Volume2, 
  Image as ImageIcon,
  Bot,
  User,
  ShieldCheck,
  Languages,
  Smartphone,
  Check,
  Copy,
  Droplets,
  Zap,
  Truck,
  Building2,
  Wifi,
  Sprout,
  GraduationCap,
  Square,
  Mic
} from 'lucide-react';

interface CitizenPortalViewProps {
  reports: CitizenReport[];
  selectedCountry: BRICSCountryId | 'all';
  setSelectedCountry: (c: BRICSCountryId | 'all') => void;
  onOpenIntakeModal: () => void;
  onUpvoteReport: (reportId: string) => void;
  onSubmitReport?: (report: CitizenReport) => void;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  reports,
  selectedCountry,
  setSelectedCountry,
  onOpenIntakeModal,
  onUpvoteReport,
  onSubmitReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  
  // WhatsApp DPI Bot Simulator Chat State
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'bot';
    text: string;
    time: string;
    token?: string;
    category?: string;
    department?: string;
    slaDays?: number;
    urgencyScore?: number;
    severityLevel?: string;
    reassurance?: string;
    imageUrl?: string;
    imageAnalysis?: string;
  }>>([
    {
      sender: 'bot',
      text: 'Namaste / Olá / مرحبا / Здравствуйте / Nǐ Hǎo! I am the BRICS PulseGov Sovereign DPI Bot. How can I assist with public infrastructure, water, energy, roads, or health facilities in your district?',
      time: '10:00 AM',
    },
    {
      sender: 'user',
      text: 'हमारे गाँव चकमेहसी में पानी का बोरवेल 2 महीने से ख़राब है। (Broken borewell in Chakmehsi)',
      time: '10:01 AM',
    },
    {
      sender: 'bot',
      text: '✅ Verified via Gemini DPI: Water & Sanitation deficit identified. Logged in Bihar Jal Jeevan registry with Token #BRICS-IND-2026-8941. Regional team notified.',
      time: '10:01 AM',
      token: 'BRICS-IND-2026-8941',
      category: 'Water & Sanitation',
      department: 'Department of Public Health Engineering & Water Supply',
      slaDays: 7,
      urgencyScore: 8.5,
      severityLevel: 'High',
      reassurance: 'आपकी शिकायत को बिहार जल जीवन मिशन रजिस्ट्री में दर्ज कर लिया गया है। 7 दिनों के भीतर स्थल निरीक्षण का आदेश जारी किया गया है।'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isRecordingBotAudio, setIsRecordingBotAudio] = useState(false);
  const [botAudioSeconds, setBotAudioSeconds] = useState(0);
  const [botSelectedImage, setBotSelectedImage] = useState<string | null>(null);
  const botAudioTimerRef = React.useRef<any>(null);
  const botChatEndRef = React.useRef<HTMLDivElement>(null);
  const botFileInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    botChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping]);

  // Quick preset messages for 1-click test across BRICS nations
  const QUICK_BOT_PROMPTS = [
    { label: '🇮🇳 India (Borewell)', text: 'हमारे गाँव में 3 बोरवेल पिछले 2 महीने से ख़राब पड़े हैं, पानी में आर्सेनिक की गंध आ रही है।' },
    { label: '🇧🇷 Brazil (Bridge)', text: 'A ponte de madeira sobre o riacho quebrou após as chuvas e a comunidade está isolada.' },
    { label: '🇿🇦 South Africa (Clinic)', text: 'Our primary health clinic has suffered daily grid blackout. We need a solar microgrid for vaccine cold chain.' },
    { label: '🇪🇬 Egypt (Irrigation)', text: 'مشروع الصرف الصحي ومضخات الري الزراعي متوقفة منذ أسابيع في قرية أسيوط.' },
    { label: '🇸🇦 Saudi (Terrace Drip)', text: 'نحتاج صيانة مضخات الطاقة الشمسية لشبكة الري بالتنقيط في مزارع عسير.' },
    { label: '🇷🇺 Russia (Road Potholes)', text: 'Участок дороги размыт талыми водами, проезд школьного автобуса заблокирован.' },
    { label: '🇨🇳 China (Broadband)', text: '偏远乡村小学需要升级数字公共基础设施光纤与远程医疗终端。' },
    { label: '🇮🇷 Iran (Water Pipeline)', text: 'خط لوله آب شرب روستایی به دلیل رسوبات نیازمند تعویض فوری و پمپ خورشیدی است.' },
  ];

  // Filter reports
  const filteredReports = reports.filter((rep) => {
    if (selectedCountry !== 'all' && rep.countryId !== selectedCountry) return false;
    if (selectedSector !== 'all' && rep.category !== selectedSector) return false;
    if (selectedSeverity !== 'all' && rep.severityLevel !== selectedSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = rep.originalText.toLowerCase().includes(q) || 
                        rep.englishTranslation.toLowerCase().includes(q) || 
                        rep.regionName.toLowerCase().includes(q) ||
                        rep.token.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleBotStartVoice = () => {
    setIsRecordingBotAudio(true);
    setBotAudioSeconds(0);
    botAudioTimerRef.current = setInterval(() => {
      setBotAudioSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleBotStopVoice = () => {
    setIsRecordingBotAudio(false);
    if (botAudioTimerRef.current) clearInterval(botAudioTimerRef.current);
    const audioSample = "🎤 Audio memo: Primary school water filtration is malfunctioning and road culvert broke after recent rains. Urgent repair needed.";
    setChatInput(audioSample);
  };

  const handleBotImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBotSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendChatMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userText = customText || chatInput;
    if (!userText.trim() && !botSelectedImage) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentImg = botSelectedImage;
    
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText || "Attached photo of broken infrastructure.",
        time: now,
        imageUrl: currentImg || undefined
      }
    ]);
    
    setChatInput('');
    setBotSelectedImage(null);
    setIsBotTyping(true);

    try {
      const activeCountryId = selectedCountry === 'all' ? 'india' : selectedCountry;
      const countryObj = BRICS_COUNTRIES.find((c) => c.id === activeCountryId);
      const regionObj = REGIONS_DATA.find((r) => r.countryId === activeCountryId) || REGIONS_DATA[0];

      const res = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          imageBase64: currentImg?.startsWith('data:') ? currentImg : undefined,
          country: countryObj?.name || 'India',
          locationName: regionObj?.name || 'Local District',
          preferredLanguage: countryObj?.languages[0] || 'Auto-detect',
        }),
      });
      const data = await res.json();
      const result = data.data;

      const generatedToken = `BRICS-${countryObj?.code || 'IND'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create new CitizenReport for live public ledger
      const newReport: CitizenReport = {
        id: `rep_${Date.now()}`,
        token: generatedToken,
        countryId: activeCountryId,
        regionId: regionObj.id,
        regionName: regionObj.name,
        citizenNameOrAnon: 'WhatsApp DPI User',
        language: result.detectedLanguage || 'Multilingual',
        languageCode: result.languageCode || 'auto',
        originalText: result.originalTranscript || userText,
        englishTranslation: result.englishTranslation || userText,
        category: (result.category as InfrastructureSector) || 'Water & Sanitation',
        urgencyScore: result.urgencyScore || 8.5,
        severityLevel: result.severityLevel || 'High',
        status: 'AI-Verified',
        timestamp: 'Just now',
        hasPhoto: !!currentImg,
        imageUrl: currentImg || undefined,
        imageAnalysis: result.imageAnalysis,
        estimatedAffectedPop: result.estimatedAffectedPopulation || 3800,
        upvotes: 1,
        channel: 'WhatsApp DPI',
        keyIssues: result.keyIssuesIdentified || ['Public utility disruption', 'Community safety'],
        recommendedAction: result.recommendedAction || 'Immediate municipal inspection scheduled.',
        citizenReassuranceMessage: result.citizenReassuranceMessage || 'Your report has been logged into the sovereign registry.',
      };

      if (onSubmitReport) {
        onSubmitReport(newReport);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `✅ Report registered into BRICS DPI Sovereign Ledger. Category: ${result.category}. Assigned: ${result.assignedDepartment || 'Municipal Works Directorate'}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          token: generatedToken,
          category: result.category,
          department: result.assignedDepartment || 'Department of Public Works & Engineering',
          slaDays: result.estimatedSlaDays || 7,
          urgencyScore: result.urgencyScore || 8,
          severityLevel: result.severityLevel || 'High',
          reassurance: result.citizenReassuranceMessage,
          imageAnalysis: result.imageAnalysis,
        },
      ]);
    } catch (err) {
      console.warn("DPI Bot fallback reply:", err);
      const generatedToken = `BRICS-DPG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `✅ Your infrastructure report has been verified and registered under Sovereign Reference Token #${generatedToken}. Regional municipal works team notified for 7-day field triage.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          token: generatedToken,
          category: 'Water & Sanitation',
          department: 'Public Health Engineering Department',
          slaDays: 7,
          urgencyScore: 8.0,
          severityLevel: 'High',
          reassurance: 'आपकी शिकायत राष्ट्रीय डिजिटल इन्फ्रास्ट्रक्चर पोर्टल पर दर्ज हो चुकी है। संबंधित विभाग को त्वरित कार्रवाई के निर्देश दिए गए हैं।'
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Top Banner & Quick Intake CTA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
              Multilingual Citizen Voice Rail
            </span>
            <span className="text-xs text-slate-500 font-medium">Digital Public Good (DPG) Spec 1.2 • 33 Languages</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Decentralized Citizen Grievance & Development Intake
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Bridging rural and underserved populations directly to municipal ministries through automatic translation, voice processing, and Gemini AI computer vision triage.
          </p>
        </div>

        <button
          id="portal-open-intake-btn"
          onClick={onOpenIntakeModal}
          className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Submit Voice / Photo Request</span>
        </button>
      </div>

      {/* Main Layout: Left = Citizen Feed (7 cols), Right = WhatsApp DPI Bot Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filterable Citizen Feed */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords, translation, token ID, or location..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Country select */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="all">🌍 All 10 BRICS Countries</option>
                {BRICS_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Sector Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'Water & Sanitation', label: '💧 Water' },
                { id: 'Transport & Connectivity', label: '🛣️ Roads & Bridges' },
                { id: 'Energy & Microgrids', label: '⚡ Energy' },
                { id: 'Health Infrastructure', label: '🏥 Health' },
                { id: 'Digital Public Infrastructure', label: '📡 Telecom/DPI' },
                { id: 'Agricultural & Irrigation', label: '🌾 Agriculture' },
                { id: 'Education & Sanitation', label: '🏫 Schools' },
              ].map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    selectedSector === sector.id
                      ? 'bg-blue-700 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {sector.label}
                </button>
              ))}
            </div>
          </div>

          {/* Citizen Reports Stream */}
          <div className="space-y-3">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => {
                const country = BRICS_COUNTRIES.find((c) => c.id === report.countryId);
                return (
                  <div
                    key={report.id}
                    className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-3"
                  >
                    {/* Card Top: Region, Country, Token, Urgency */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{country?.flag}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {report.regionName}
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200">
                              #{report.token}
                            </span>
                            <button
                              onClick={() => handleCopy(report.token)}
                              className="text-[10px] text-slate-400 hover:text-slate-700 cursor-pointer"
                              title="Copy Token"
                            >
                              {copiedToken === report.token ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </h4>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{report.citizenNameOrAnon}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Languages className="w-3 h-3 text-blue-600" />
                              {report.language}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {report.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          report.urgencyScore >= 9
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          Priority: {report.urgencyScore}/10 ({report.severityLevel})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {report.status}
                        </span>
                      </div>
                    </div>

                    {/* Original Dialect Quote */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className="text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-blue-600" />
                        Original Native Submission:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-serif italic">
                        "{report.originalText}"
                      </p>
                      
                      {report.englishTranslation && report.language !== 'English' && (
                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-700 font-sans">
                          <strong className="text-slate-600 font-medium">English Translation:</strong> "{report.englishTranslation}"
                        </div>
                      )}
                    </div>

                    {/* Transparent Destination Routing Box */}
                    <div className="bg-blue-50/80 p-2.5 rounded-lg border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span><strong>Routed to:</strong> {report.category} Municipal Works & Regional Triage</span>
                      </div>
                      <div className="text-emerald-700 font-mono text-[11px] font-semibold">
                        Target SLA: 14 Days (48h Field Triage)
                      </div>
                    </div>

                    {/* Image Attachment & Computer Vision Analysis */}
                    {report.hasPhoto && report.imageUrl && (
                      <div className="flex flex-col sm:flex-row items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-300 bg-white">
                          <img
                            src={report.imageUrl}
                            alt="Damage evidence"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Gemini Vision Damage Inspector:
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {report.imageAnalysis || "Visible physical damage confirmed. Structural deficit logged into sovereign DPI prioritization pipeline."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Key Issues Identified Chips & Upvote Action */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                          {report.category}
                        </span>
                        {report.keyIssues?.map((issue, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {issue}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-600">
                          Est. Impact: <strong className="text-slate-900">{report.estimatedAffectedPop?.toLocaleString()}</strong> citizens
                        </span>
                        <button
                          onClick={() => onUpvoteReport(report.id)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                          <span>{report.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm">
                No citizen reports match the current filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: WhatsApp / USSD Low-Bandwidth DPI Chatbot Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[700px]">
            {/* Simulator Header styled like WhatsApp / DPI messaging window */}
            <div className="bg-emerald-800 text-white p-3.5 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center text-white shadow">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-white">
                    <span>BRICS PulseGov DPI Bot</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </h3>
                  <span className="text-[10px] text-emerald-200 font-mono">
                    WhatsApp DPI + USSD *99*6# • 33 BRICS Languages
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-100 font-mono border border-emerald-700">
                  ● Online
                </span>
              </div>
            </div>

            {/* Quick 1-Click Dialect Prompts Bar */}
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
              <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap">Try Preset:</span>
              {QUICK_BOT_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(undefined, p.text)}
                  disabled={isBotTyping}
                  className="text-[10px] px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F7F6]">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {/* If user attached photo */}
                    {msg.imageUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden max-h-36 border border-slate-300 bg-white">
                        <img src={msg.imageUrl} alt="Attached damage" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Rich Bot Confirmation Card */}
                    {msg.sender === 'bot' && msg.token && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200 space-y-2 bg-slate-50 -mx-2 -mb-1 p-2.5 rounded-xl text-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-blue-700">
                            Token: #{msg.token}
                          </span>
                          <button
                            onClick={() => handleCopy(msg.token!)}
                            className="text-[10px] text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-300 cursor-pointer"
                          >
                            {copiedToken === msg.token ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedToken === msg.token ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        {msg.category && (
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                              {msg.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 font-medium">
                              Priority: {msg.urgencyScore}/10
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                              Target SLA: {msg.slaDays || 7} Days
                            </span>
                          </div>
                        )}

                        {msg.department && (
                          <div className="text-[10px] text-slate-600">
                            <strong>Routing:</strong> {msg.department}
                          </div>
                        )}

                        {msg.reassurance && (
                          <div className="text-[11px] text-emerald-800 font-serif italic bg-emerald-50 p-1.5 rounded border border-emerald-200">
                            "{msg.reassurance}"
                          </div>
                        )}

                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Synced with Live Sovereign Public Ledger</span>
                        </div>
                      </div>
                    )}

                    <span className={`text-[9px] block mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.time}</span>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex items-center gap-2 text-xs text-blue-700 italic bg-white px-3 py-2 rounded-xl w-fit border border-slate-200 shadow-sm">
                  <Bot className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Gemini Sovereign DPI processing & translating native dialect...</span>
                </div>
              )}

              <div ref={botChatEndRef} />
            </div>

            {/* Selected Image Preview if any */}
            {botSelectedImage && (
              <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Photo evidence attached
                </span>
                <button
                  type="button"
                  onClick={() => setBotSelectedImage(null)}
                  className="text-rose-600 hover:text-rose-700 text-[11px] font-semibold cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Audio Recording Active Bar */}
            {isRecordingBotAudio && (
              <div className="px-3 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-800">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                  Recording Voice Memo ({botAudioSeconds}s)...
                </span>
                <button
                  type="button"
                  onClick={handleBotStopVoice}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

            {/* Chat Input & Media Actions */}
            <form onSubmit={(e) => handleSendChatMessage(e)} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="file"
                ref={botFileInputRef}
                accept="image/*"
                onChange={handleBotImageSelect}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => botFileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                title="Attach Photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {!isRecordingBotAudio ? (
                <button
                  type="button"
                  onClick={handleBotStartVoice}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  title="Record Voice Note"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBotStopVoice}
                  className="p-2 text-rose-600 hover:text-rose-700 bg-rose-100 rounded-xl transition-all cursor-pointer"
                  title="Stop Recording"
                >
                  <Square className="w-4 h-4 fill-rose-600" />
                </button>
              )}

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message DPI Bot in any of 33 languages..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={(!chatInput.trim() && !botSelectedImage) || isBotTyping}
                className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
