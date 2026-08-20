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
    <div className="space-y-6 text-slate-100">
      {/* Top Banner & Quick Intake CTA */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#10243E] to-[#0A192F] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-500/30">
              Multilingual Citizen Voice Rail
            </span>
            <span className="text-xs text-slate-400">Digital Public Good (DPG) Spec 1.2 • 33 Languages</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Decentralized Citizen Grievance & Development Intake
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Bridging rural and underserved populations directly to municipal ministries through automatic translation, voice processing, and Gemini AI computer vision triage.
          </p>
        </div>

        <button
          id="portal-open-intake-btn"
          onClick={onOpenIntakeModal}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-[#1E3A8A] hover:from-blue-500 hover:to-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-950/40 flex items-center gap-2 shrink-0 transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Submit Voice / Photo Request</span>
        </button>
      </div>

      {/* Main Layout: Left = Citizen Feed (7 cols), Right = WhatsApp DPI Bot Simulator (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filterable Citizen Feed */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-[#0A192F] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by keywords, translation, token ID, or location..."
                  className="w-full bg-[#070F1E] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Country select */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as any)}
                className="bg-[#070F1E] border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:ring-2 focus:ring-blue-500"
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
                  className={`text-xs px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    selectedSector === sector.id
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-[#070F1E] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
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
                    className="bg-[#0A192F] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-4 sm:p-5 shadow-lg transition-all space-y-3"
                  >
                    {/* Card Top: Region, Country, Token, Urgency */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{country?.flag}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {report.regionName}
                            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#070F1E] text-cyan-300 border border-slate-700">
                              #{report.token}
                            </span>
                            <button
                              onClick={() => handleCopy(report.token)}
                              className="text-[10px] text-slate-400 hover:text-white"
                              title="Copy Token"
                            >
                              {copiedToken === report.token ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </h4>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{report.citizenNameOrAnon}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Languages className="w-3 h-3 text-cyan-400" />
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
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                        }`}>
                          Priority: {report.urgencyScore}/10 ({report.severityLevel})
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {report.status}
                        </span>
                      </div>
                    </div>

                    {/* Original Dialect Quote */}
                    <div className="bg-[#070F1E] rounded-xl p-3 border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                        Original Native Submission:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-100 font-serif italic">
                        "{report.originalText}"
                      </p>
                      
                      {report.englishTranslation && report.language !== 'English' && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-200 font-sans">
                          <strong className="text-slate-400 font-medium">English Translation:</strong> "{report.englishTranslation}"
                        </div>
                      )}
                    </div>

                    {/* Transparent Destination Routing Box */}
                    <div className="bg-[#0B1A35] p-2.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span><strong>Routed to:</strong> {report.category} Municipal Works & Regional Triage</span>
                      </div>
                      <div className="text-emerald-400 font-mono text-[11px]">
                        Target SLA: 14 Days (48h Field Triage)
                      </div>
                    </div>

                    {/* Image Attachment & Computer Vision Analysis */}
                    {report.hasPhoto && report.imageUrl && (
                      <div className="flex flex-col sm:flex-row items-start gap-3 bg-[#070F1E] p-3 rounded-xl border border-slate-800">
                        <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-[#0A192F]">
                          <img
                            src={report.imageUrl}
                            alt="Damage evidence"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Gemini Vision Damage Inspector:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {report.imageAnalysis || "Visible physical damage confirmed. Structural deficit logged into sovereign DPI prioritization pipeline."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Key Issues Identified Chips & Upvote Action */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                          {report.category}
                        </span>
                        {report.keyIssues?.map((issue, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#070F1E] text-slate-300 border border-slate-800">
                            {issue}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">
                          Est. Impact: <strong className="text-white">{report.estimatedAffectedPop?.toLocaleString()}</strong> citizens
                        </span>
                        <button
                          onClick={() => onUpvoteReport(report.id)}
                          className="px-3 py-1 rounded-lg bg-[#070F1E] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{report.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#0A192F] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                No citizen reports match the current filters.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: WhatsApp / USSD Low-Bandwidth DPI Chatbot Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0A192F] border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[700px]">
            {/* Simulator Header styled like WhatsApp / DPI messaging window */}
            <div className="bg-[#08121E] text-white p-3.5 flex items-center justify-between border-b border-emerald-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-emerald-200 shadow">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-emerald-200">
                    <span>BRICS PulseGov DPI Bot</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    WhatsApp DPI + USSD *99*6# • 33 BRICS Languages
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  ● Online
                </span>
              </div>
            </div>

            {/* Quick 1-Click Dialect Prompts Bar */}
            <div className="bg-[#060D17] px-3 py-2 border-b border-slate-800 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
              <span className="text-[10px] text-cyan-400 font-semibold whitespace-nowrap">Try Preset:</span>
              {QUICK_BOT_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChatMessage(undefined, p.text)}
                  disabled={isBotTyping}
                  className="text-[10px] px-2 py-1 rounded-lg bg-[#0A192F] hover:bg-blue-900/60 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-all active:scale-95 disabled:opacity-50"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#040A14]">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-[#0E2038] text-slate-100 rounded-tl-none border border-slate-700'
                    }`}
                  >
                    {/* If user attached photo */}
                    {msg.imageUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden max-h-36 border border-emerald-600/40">
                        <img src={msg.imageUrl} alt="Attached damage" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Rich Bot Confirmation Card */}
                    {msg.sender === 'bot' && msg.token && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-700 space-y-2 bg-[#081528] -mx-2 -mb-1 p-2.5 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-cyan-300">
                            Token: #{msg.token}
                          </span>
                          <button
                            onClick={() => handleCopy(msg.token!)}
                            className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 bg-[#0A192F] px-1.5 py-0.5 rounded border border-slate-700"
                          >
                            {copiedToken === msg.token ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedToken === msg.token ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        {msg.category && (
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-cyan-300 font-semibold border border-blue-700/40">
                              {msg.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-900/40 text-rose-300 border border-rose-800/40">
                              Priority: {msg.urgencyScore}/10
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-sky-900/40 text-sky-300 border border-sky-800/40">
                              Target SLA: {msg.slaDays || 7} Days
                            </span>
                          </div>
                        )}

                        {msg.department && (
                          <div className="text-[10px] text-slate-300">
                            <strong>Routing:</strong> {msg.department}
                          </div>
                        )}

                        {msg.reassurance && (
                          <div className="text-[11px] text-emerald-200 font-serif italic bg-[#040E1B] p-1.5 rounded border border-emerald-900/50">
                            "{msg.reassurance}"
                          </div>
                        )}

                        <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Synced with Live Sovereign Public Ledger</span>
                        </div>
                      </div>
                    )}

                    <span className="text-[9px] opacity-60 text-right block mt-1">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 italic bg-[#0E2038] px-3 py-2 rounded-xl w-fit border border-slate-700">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Gemini Sovereign DPI processing & translating native dialect...</span>
                </div>
              )}

              <div ref={botChatEndRef} />
            </div>

            {/* Selected Image Preview if any */}
            {botSelectedImage && (
              <div className="px-3 py-2 bg-[#08121E] border-t border-slate-800 flex items-center justify-between text-xs text-slate-200">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  Photo evidence attached
                </span>
                <button
                  type="button"
                  onClick={() => setBotSelectedImage(null)}
                  className="text-rose-400 hover:text-rose-300 text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Audio Recording Active Bar */}
            {isRecordingBotAudio && (
              <div className="px-3 py-2 bg-rose-950/60 border-t border-rose-800 flex items-center justify-between text-xs text-rose-200">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Recording Voice Memo ({botAudioSeconds}s)...
                </span>
                <button
                  type="button"
                  onClick={handleBotStopVoice}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-bold"
                >
                  Done
                </button>
              </div>
            )}

            {/* Chat Input & Media Actions */}
            <form onSubmit={(e) => handleSendChatMessage(e)} className="p-3 bg-[#08121E] border-t border-slate-800 flex items-center gap-2">
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
                className="p-2 text-cyan-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                title="Attach Photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {!isRecordingBotAudio ? (
                <button
                  type="button"
                  onClick={handleBotStartVoice}
                  className="p-2 text-cyan-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                  title="Record Voice Note"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBotStopVoice}
                  className="p-2 text-rose-400 hover:text-rose-300 bg-rose-900/40 rounded-xl transition-all"
                  title="Stop Recording"
                >
                  <Square className="w-4 h-4 fill-rose-400" />
                </button>
              )}

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message DPI Bot in any of 33 languages..."
                className="flex-1 bg-[#040A14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={(!chatInput.trim() && !botSelectedImage) || isBotTyping}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95"
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
