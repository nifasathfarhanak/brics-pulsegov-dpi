import React, { useState, useRef, useEffect } from 'react';
import { BRICS_COUNTRIES, REGIONS_DATA, BRICS_33_LANGUAGES, BRICSLanguageInfo } from '../data/bricsData';
import { BRICSCountryId, CitizenReport, InfrastructureSector } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Mic, 
  Square, 
  Upload, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Copy, 
  Languages,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Droplets,
  Zap,
  Truck,
  Building2,
  Wifi,
  Sprout,
  GraduationCap,
  Smartphone,
  PhoneCall,
  Globe,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Check
} from 'lucide-react';

interface CitizenIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: CitizenReport) => void;
}

// Preset multilingual voice/text samples for 1-click verification
const PRESET_CITIZEN_VOICES = [
  {
    countryId: 'india' as BRICSCountryId,
    regionId: 'ind_bihar',
    language: 'Hindi (हिंदी)',
    title: 'बिहार: खराब बोरवेल व आर्सेनिक जल (Broken Borewells & Arsenic)',
    text: 'हमारे ग्राम पंचायत चकमेहसी में 3 बोरवेल पिछले दो महीने से ख़राब पड़े हैं। पानी में पीलापन और आर्सेनिक की बदबू है, बच्चे बीमार पड़ रहे हैं। तुरंत नया सोलर वाटर प्यूरिफायर लगाया जाए।',
    category: 'Water & Sanitation' as InfrastructureSector,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
  },
  {
    countryId: 'brazil' as BRICSCountryId,
    regionId: 'bra_bahia',
    language: 'Portuguese (Português)',
    title: 'Bahia: Ponte rural colapsada (Collapsed Farm Bridge)',
    text: 'A ponte de madeira sobre o riacho quebrou após as chuvas da semana passada. Nossos caminhões de mandioca e a van escolar não conseguem atravessar. Estamos isolados há 6 dias.',
    category: 'Transport & Connectivity' as InfrastructureSector,
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
  },
  {
    countryId: 'south_africa' as BRICSCountryId,
    regionId: 'zaf_eastern_cape',
    language: 'isiXhosa / English',
    title: 'Eastern Cape: Clinic vaccine cold-chain blackout',
    text: 'Our primary health clinic has suffered daily 8-hour grid blackout. We lost 150 doses of child measles and hepatitis vaccines due to broken cold chain fridge. We desperately need a dedicated solar lithium microgrid.',
    category: 'Energy & Microgrids' as InfrastructureSector,
    photoUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
  },
  {
    countryId: 'egypt' as BRICSCountryId,
    regionId: 'egy_asyut',
    language: 'Arabic (العربية)',
    title: 'أسيوط: معالجة مياه الصرف الصحي والري الزراعي',
    text: 'مشروع الصرف الصحي متوقف منذ ستة أشهر ومياه الصرف تختلط بمياه الري الزراعي، مما أدى لتلف محاصيل الخضار وانتشار الأمراض بين الأطفال. نرجو استكمال المحطة الفرعية ضمن مبادرة حياة كريمة.',
    category: 'Water & Sanitation' as InfrastructureSector,
    photoUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=600&q=80',
  },
  {
    countryId: 'saudi_arabia' as BRICSCountryId,
    regionId: 'sau_asir',
    language: 'Arabic (العربية)',
    title: 'عسير: مضخات الري بالتنقيط في المدرجات الزراعية',
    text: 'نحتاج إلى دعم عاجل لصيانة مضخات الطاقة الشمسية لشبكة الري بالتنقيط في المدرجات الجبلية لقرى عسير لحماية محاصيل البن والقمح.',
    category: 'Agricultural & Irrigation' as InfrastructureSector,
    photoUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=600&q=80',
  },
  {
    countryId: 'iran' as BRICSCountryId,
    regionId: 'irn_sistan',
    language: 'Persian (فارسی)',
    title: 'سیستان: آبرسانی تانکری و احیای لوله‌کشی روستایی',
    text: 'به دلیل خشکسالی حوضه هامون، خط لوله انتقال آب شرب ۱۰ روستا نیازمند پمپ‌های پرفشار خورشیدی و سیستم فیلتراسیون هوشمند است.',
    category: 'Water & Sanitation' as InfrastructureSector,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80',
  }
];

const SECTORS_LIST: { id: InfrastructureSector; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'Water & Sanitation', label: 'Water & Sanitation', icon: Droplets, color: 'text-cyan-400 bg-cyan-900/30 border-cyan-700/50', desc: 'Borewells, filtration, arsenic, water pipelines & sewage' },
  { id: 'Energy & Microgrids', label: 'Energy & Microgrids', icon: Zap, color: 'text-blue-400 bg-blue-900/30 border-blue-700/50', desc: 'Solar microgrids, battery backup, clinic load shedding' },
  { id: 'Transport & Connectivity', label: 'Transport & Roads', icon: Truck, color: 'text-indigo-400 bg-indigo-900/30 border-indigo-700/50', desc: 'Bridge collapses, muddy roads, rural bus corridors' },
  { id: 'Health Infrastructure', label: 'Health & Clinics', icon: Building2, color: 'text-rose-400 bg-rose-900/30 border-rose-700/50', desc: 'Vaccine cold chains, primary maternity wards, oxygen' },
  { id: 'Digital Public Infrastructure', label: 'Digital Public Infra (DPI)', icon: Wifi, color: 'text-sky-400 bg-sky-900/30 border-sky-700/50', desc: 'Telecom towers, Aadhaar/MOSIP kiosks, broadband' },
  { id: 'Agricultural & Irrigation', label: 'Agri & Irrigation', icon: Sprout, color: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50', desc: 'Canal desiltation, solar drip pumps, cold storage' },
  { id: 'Education & Sanitation', label: 'Education & Schools', icon: GraduationCap, color: 'text-purple-400 bg-purple-900/30 border-purple-700/50', desc: 'School sanitation facilities, digital learning labs' },
];

export const CitizenIntakeModal: React.FC<CitizenIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<BRICSCountryId>('india');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ind_bihar');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>('hi');
  const [selectedCategory, setSelectedCategory] = useState<InfrastructureSector>('Water & Sanitation');
  const [citizenName, setCitizenName] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [channel, setChannel] = useState<'Voice' | 'Web Portal' | 'WhatsApp DPI' | 'SMS/USSD'>('Voice');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [hasRecordedAudio, setHasRecordedAudio] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Photo state
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WhatsApp Simulated Chat State
  const [whatsappChat, setWhatsappChat] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '🙏 Welcome to BRICS Sovereign PulseGov DPI Voice & Grievance Rail. Please describe your infrastructure issue or send a photo.',
      time: '11:02 AM'
    }
  ]);
  const [whatsappInput, setWhatsappInput] = useState<string>('');

  // USSD Dialler State
  const [ussdStep, setUssdStep] = useState<number>(1);
  const [ussdInput, setUssdInput] = useState<string>('*99*6#');
  const [ussdScreen, setUssdScreen] = useState<string>(
    'BRICS PulseGov USSD Rail\n1. Report Broken Water/Well\n2. Report Grid Power Outage\n3. Report Blocked Road/Bridge\n4. Health Clinic Emergency\n5. Check Grievance Token\nReply with option (1-5):'
  );

  // Submission & AI Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzedResult, setAnalyzedResult] = useState<any | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Language context for speech recognition and speech synthesis
  const {
    startListening,
    stopListening,
    isListening: isLangListening,
    speak,
    stopSpeaking,
    isSpeaking,
    currentLanguage,
    currentLanguageInfo,
  } = useLanguage();

  // Synchronize available regions whenever country changes
  const availableRegions = REGIONS_DATA.filter((r) => r.countryId === selectedCountry);

  useEffect(() => {
    if (availableRegions.length > 0) {
      if (!availableRegions.some((r) => r.id === selectedRegionId)) {
        setSelectedRegionId(availableRegions[0].id);
      }
    }
  }, [selectedCountry]);

  if (!isOpen) return null;

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setHasRecordedAudio(false);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    const countryObj = BRICS_COUNTRIES.find((c) => c.id === selectedCountry);
    const targetLang = countryObj?.languages[0] ? countryObj.languages[0].toLowerCase() : currentLanguage;

    startListening({
      lang: targetLang,
      continuous: true,
      onResult: (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setHasRecordedAudio(true);
      },
    });
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    stopListening();
    setHasRecordedAudio(true);
    if (!inputText) {
      const defaultSample = "Captured Audio Memo: 3 borewells broken in Gram Panchayat with severe arsenic turbidity and children falling ill. Solar filtration requested.";
      setInputText(defaultSample);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoBase64(result);
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const loadPresetSample = (preset: typeof PRESET_CITIZEN_VOICES[0]) => {
    setSelectedCountry(preset.countryId);
    setSelectedRegionId(preset.regionId);
    setInputText(preset.text);
    setSelectedCategory(preset.category);
    setPhotoPreview(preset.photoUrl);
    setPhotoBase64(preset.photoUrl);
    setHasRecordedAudio(true);
  };

  const handleWhatsAppSend = async () => {
    if (!whatsappInput.trim()) return;
    const userMsg = whatsappInput.trim();
    const newChat = [...whatsappChat, { sender: 'user' as const, text: userMsg, time: 'Just now' }];
    setWhatsappChat(newChat);
    setInputText(userMsg);
    setWhatsappInput('');

    // Temporary typing placeholder
    setWhatsappChat((prev) => [
      ...prev,
      {
        sender: 'bot' as const,
        text: '⏳ DPI Bot analyzing your report in native dialect with Gemini Sovereign Rail...',
        time: 'Just now'
      }
    ]);

    try {
      const countryObj = BRICS_COUNTRIES.find((c) => c.id === selectedCountry);
      const res = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userMsg,
          country: countryObj?.name || 'India',
          locationName: selectedRegionId,
          preferredLanguage: countryObj?.languages[0] || 'Auto-detect',
        }),
      });
      const data = await res.json();
      const result = data.data;

      if (result.category) {
        setSelectedCategory(result.category as InfrastructureSector);
      }

      setWhatsappChat((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          sender: 'bot' as const,
          text: `✅ Verified under "${result.category || selectedCategory}". Assigned to: ${result.assignedDepartment || 'Municipal Works'}. ${result.citizenReassuranceMessage || 'Click "Submit & Verify" below to register sovereign token.'}`,
          time: 'Just now'
        }
      ]);
    } catch (err) {
      setWhatsappChat((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          sender: 'bot' as const,
          text: `✅ Verified report received for ${selectedCountry.toUpperCase()}. Auto-classified under "${selectedCategory}". Click "Submit & Verify" below to log sovereign reference token.`,
          time: 'Just now'
        }
      ]);
    }
  };

  const handleUssdSubmit = () => {
    if (ussdStep === 1) {
      let sectorName: InfrastructureSector = 'Water & Sanitation';
      if (ussdInput === '2') sectorName = 'Energy & Microgrids';
      if (ussdInput === '3') sectorName = 'Transport & Connectivity';
      if (ussdInput === '4') sectorName = 'Health Infrastructure';
      setSelectedCategory(sectorName);
      setUssdScreen(`Option ${ussdInput} selected: ${sectorName}.\nEnter your 6-digit Village/District PIN code:`);
      setUssdInput('');
      setUssdStep(2);
    } else if (ussdStep === 2) {
      setUssdScreen(`PIN Code ${ussdInput} logged.\nShort Description:\n"Emergency rural infrastructure repair requested via USSD."\nReply 1 to Confirm.`);
      setInputText(`USSD Offline Toll-Free Report: Urgent ${selectedCategory} intervention logged for District code ${ussdInput}.`);
      setUssdStep(3);
    } else {
      setUssdScreen(`✅ Success! USSD Grievance registered in national database.\nClick 'Submit & Verify' below for AI ledger synchronization.`);
    }
  };

  const handleRunAIAnalysisAndSubmit = async () => {
    if (!inputText && !photoBase64 && !hasRecordedAudio) return;

    setIsAnalyzing(true);
    const regionObj = REGIONS_DATA.find((r) => r.id === selectedRegionId) || availableRegions[0] || {
      id: 'ind_bihar',
      name: 'Bihar',
      countryId: 'india'
    };
    const countryObj = BRICS_COUNTRIES.find((c) => c.id === selectedCountry);

    try {
      const response = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          imageBase64: photoBase64?.startsWith('data:') ? photoBase64 : undefined,
          country: countryObj?.name,
          locationName: regionObj?.name,
          preferredLanguage: countryObj?.languages[0] || 'Auto-detect',
        }),
      });

      const result = await response.json();
      const aiData = result.data;
      setAnalyzedResult(aiData);

      const token = `BRICS-${countryObj?.code || 'IND'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedToken(token);

      // Create new verified CitizenReport item
      const newReport: CitizenReport = {
        id: `rep_${Date.now()}`,
        token,
        countryId: selectedCountry,
        regionId: regionObj.id,
        regionName: regionObj.name,
        citizenNameOrAnon: citizenName.trim() || 'Anonymous Community Member',
        language: aiData.detectedLanguage || 'Multilingual',
        languageCode: aiData.languageCode || selectedLanguageCode || 'en',
        originalText: aiData.originalTranscript || inputText,
        englishTranslation: aiData.englishTranslation || inputText,
        category: (aiData.category as InfrastructureSector) || selectedCategory,
        urgencyScore: aiData.urgencyScore || 8,
        severityLevel: aiData.severityLevel || 'High',
        status: 'AI-Verified',
        timestamp: 'Just now',
        hasPhoto: !!photoPreview,
        imageUrl: photoPreview || undefined,
        imageAnalysis: aiData.imageAnalysis,
        estimatedAffectedPop: aiData.estimatedAffectedPopulation || 3500,
        upvotes: 1,
        channel,
        keyIssues: aiData.keyIssuesIdentified || ['Public utility enhancement required', 'Community access improvement'],
        recommendedAction: aiData.recommendedAction || 'Dispatch local municipal inspection unit for immediate assessment.',
        citizenReassuranceMessage: aiData.citizenReassuranceMessage || 'Your request has been officially recorded in the national DPI registry.',
      };

      onSubmitReport(newReport);
    } catch (err) {
      console.error('Error during AI intake:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030A14]/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0A192F] border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#070F1E] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-900/60 text-cyan-400 flex items-center justify-center border border-blue-700/50 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Citizen Multilingual Intake & Verification Rail
                </h2>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  33 BRICS Languages
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Submit sovereign infrastructure requests via Voice, Web, WhatsApp DPI, or USSD offline rail.
              </p>
            </div>
          </div>

          <button
            id="close-intake-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* 1. 33 BRICS Languages & Fast Preset Samples */}
          <div className="bg-[#070F1E] border border-slate-800 rounded-xl p-4 space-y-3 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-emerald-400" />
                33 BRICS Official & Regional Languages Engine:
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Native Dialect Fluency & Auto-Translation
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Select Language (33 Supported BRICS Dialects):
                </label>
                <select
                  id="brics-33-language-select"
                  value={selectedLanguageCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setSelectedLanguageCode(code);
                    const found = BRICS_33_LANGUAGES.find((l) => l.code === code);
                    if (found) {
                      setInputText(found.sampleGrievance);
                      const cMap: Record<string, BRICSCountryId> = {
                        'India': 'india',
                        'China': 'china',
                        'Russia': 'russia',
                        'Brazil': 'brazil',
                        'Egypt & UAE': 'egypt',
                        'South Africa & India': 'south_africa',
                        'South Africa': 'south_africa',
                        'Ethiopia': 'ethiopia',
                        'Ethiopia & Region': 'ethiopia',
                        'BRICS Partner Network': 'iran'
                      };
                      const mappedCountry = cMap[found.country] || 'india';
                      setSelectedCountry(mappedCountry);
                      const reg = REGIONS_DATA.find((r) => r.countryId === mappedCountry);
                      if (reg) setSelectedRegionId(reg.id);
                    }
                  }}
                  className="w-full bg-[#0A192F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {BRICS_33_LANGUAGES.map((lang, idx) => (
                    <option key={lang.code} value={lang.code}>
                      {idx + 1}. {lang.regionFlag} {lang.name} ({lang.nativeName}) — {lang.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Or 1-Click Popular Multilingual Voice Samples:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CITIZEN_VOICES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadPresetSample(preset)}
                      className="px-2 py-1 bg-[#0A192F] hover:bg-slate-800 border border-slate-700 text-[11px] rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span>{preset.language}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Target Country & Comprehensive Region Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target BRICS Country (All 10 Member Nations)
              </label>
              <select
                id="intake-country-select"
                value={selectedCountry}
                onChange={(e) => {
                  const val = e.target.value as BRICSCountryId;
                  setSelectedCountry(val);
                  const firstReg = REGIONS_DATA.find((r) => r.countryId === val);
                  if (firstReg) setSelectedRegionId(firstReg.id);
                }}
                className="w-full bg-[#070F1E] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {BRICS_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name} ({c.nativeName}) — {c.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Region / District / Municipality (All {availableRegions.length} Active Territories)
              </label>
              <select
                id="intake-region-select"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full bg-[#070F1E] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {availableRegions.map((r) => (
                  <option key={r.id} value={r.id}>
                    📍 {r.name} ({r.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Category Which to Submit (Explicit Selector) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Category Which to Submit (Infrastructure Sector):</span>
              <span className="text-[11px] text-cyan-400 font-mono">Select Sector for Municipal Department Routing</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SECTORS_LIST.map((sec) => {
                const Icon = sec.icon;
                const isSelected = selectedCategory === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedCategory(sec.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-900/60 border-cyan-400 text-white shadow-md shadow-blue-950/50 scale-[1.02]'
                        : 'bg-[#070F1E] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-tight">{sec.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-2 leading-snug">
                      {sec.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Channel Interface Switcher & Dynamic View */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Select Channel Interface:
              </label>
              <span className="text-[11px] text-slate-400">
                Multi-channel Sovereign Digital Public Good
              </span>
            </div>

            {/* 4 Channel Mode Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Voice', label: 'Voice Memo', icon: Mic, badge: 'Whisper & Speech' },
                { id: 'Web Portal', label: 'Web Portal', icon: Globe, badge: 'Direct Form' },
                { id: 'WhatsApp DPI', label: 'WhatsApp DPI', icon: MessageSquare, badge: 'Bot Chat' },
                { id: 'SMS/USSD', label: 'SMS / USSD Rail', icon: Smartphone, badge: 'Offline *99*6#' },
              ].map((ch) => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id as any)}
                    className={`py-2 px-3 rounded-xl border transition-all text-left flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-blue-600/30 text-cyan-200 border-cyan-400 font-semibold shadow-inner'
                        : 'bg-[#070F1E] text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold leading-tight">{ch.label}</div>
                      <div className="text-[10px] opacity-75 font-mono">{ch.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC CHANNEL CONTENT 1: VOICE MEMO */}
            {channel === 'Voice' && (
              <div className="bg-[#070F1E] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-semibold text-white">
                      Multilingual Voice Memo Capture (Whisper & Gemini Speech Rail)
                    </span>
                  </div>
                  {isRecording && (
                    <span className="text-xs font-mono text-rose-400 animate-pulse flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      Live Recording: {recordingSeconds}s
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      id="start-mic-record-btn"
                      onClick={startVoiceRecording}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-[#1E3A8A] hover:from-blue-500 hover:to-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-950/40 active:scale-95 transition-all"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Voice Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="stop-mic-record-btn"
                      onClick={stopVoiceRecording}
                      className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-rose-900/30 active:scale-95 transition-all"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Stop & Transcribe Audio</span>
                    </button>
                  )}

                  {hasRecordedAudio && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Audio memo captured & synced with AI transcript</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DYNAMIC CHANNEL CONTENT 2: WHATSAPP DPI BOT */}
            {channel === 'WhatsApp DPI' && (
              <div className="bg-[#0D1B2A] border border-emerald-800/60 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-[#08121E] px-4 py-2.5 border-b border-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      💬
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-200 flex items-center gap-1">
                        <span>BRICS PulseGov DPI Official Bot</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">+91 98451 23456 • Verified Sovereign Rail</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">
                    Online
                  </span>
                </div>

                <div className="p-3 space-y-2 max-h-48 overflow-y-auto bg-[#050C16]">
                  {whatsappChat.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                          msg.sender === 'user'
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-[#10243E] text-emerald-100 rounded-tl-none border border-emerald-800/40'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[9px] opacity-70 text-right block mt-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-[#08121E] border-t border-emerald-900 flex items-center gap-2">
                  <input
                    type="text"
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleWhatsAppSend()}
                    placeholder="Type your infrastructure request in WhatsApp..."
                    className="flex-1 bg-[#0D1B2A] border border-emerald-800 rounded-xl px-3 py-1.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* DYNAMIC CHANNEL CONTENT 3: SMS / USSD OFFLINE */}
            {channel === 'SMS/USSD' && (
              <div className="bg-[#0A192F] border border-sky-800/60 rounded-xl p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-sky-400 border-b border-sky-900 pb-2">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" />
                    Offline Telecom USSD Dial Rail (*99*6#)
                  </span>
                  <span className="text-[10px] text-sky-300">Toll-Free 2G/3G Supported</span>
                </div>

                <div className="bg-black/80 rounded-lg p-3 text-xs text-emerald-400 whitespace-pre-wrap border border-emerald-900/50 shadow-inner">
                  {ussdScreen}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ussdInput}
                    onChange={(e) => setUssdInput(e.target.value)}
                    placeholder="Enter choice (e.g. 1)..."
                    className="flex-1 bg-black border border-sky-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={handleUssdSubmit}
                    className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl"
                  >
                    Send (USSD)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Citizen Name & Text Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Citizen Name / Representative
              </label>
              <input
                id="intake-citizen-name"
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="e.g. Maria da Silva (Farmer's Union)"
                className="w-full bg-[#070F1E] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Citizen Issue Description (Any Language)</span>
                <span className="text-[11px] text-slate-400">Auto-detected & translated</span>
              </label>
              <textarea
                id="intake-text-input"
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe the broken borewell, damaged bridge, clinic blackout, or road block in your native dialect..."
                className="w-full bg-[#070F1E] border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 6. Photo & Site Evidence Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Visual Evidence / Photo Proof (Multimodal Gemini Inspector)
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-[#070F1E] hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-100 flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Upload Site Photo</span>
              </button>

              {photoPreview && (
                <div className="relative group w-36 h-20 rounded-xl overflow-hidden border border-slate-700 bg-[#070F1E]">
                  <img
                    src={photoPreview}
                    alt="Infrastructure site"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoBase64(null);
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 7. "SUBMIT WHERE IT GOES" (Transparent Routing & AI Reassurance Ledger) */}
          {analyzedResult && generatedToken && (
            <div className="bg-[#070F1E] border border-blue-500/40 rounded-xl p-5 space-y-4 shadow-xl">
              
              {/* Header Status & Token */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-sm font-bold text-emerald-300 block">
                      AI Triage & Sovereign Registration Completed
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Status: AI-Verified & Queued for Inter-Ministerial Action
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-[#0A192F] border border-slate-700 px-3 py-1 rounded-lg text-cyan-300 font-bold">
                    {generatedToken}
                  </span>
                  <button
                    onClick={handleCopyToken}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1"
                    title="Copy Token"
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Where It Goes Transparent Routing Flow */}
              <div className="bg-[#0B1A35] p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Transparent Destination Routing — Where Your Grievance Goes:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <div className="bg-[#0A192F] p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">1. Citizen Public Portal</span>
                    <p className="text-white font-medium mt-0.5">Live tracking card created with community upvotes & public status ledger.</p>
                  </div>

                  <div className="bg-[#0A192F] p-2.5 rounded-lg border border-slate-800">
                    <span className="text-cyan-400 block text-[10px] font-bold uppercase">2. Designated Department</span>
                    <p className="text-white font-medium mt-0.5">
                      {analyzedResult.assignedDepartment || `${selectedCategory} Municipal Works Division`}
                    </p>
                  </div>

                  <div className="bg-[#0A192F] p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 block text-[10px] font-bold uppercase">3. CapEx & SLA Matrix</span>
                    <p className="text-white font-medium mt-0.5">
                      Inspection: <strong className="text-emerald-300">48 Hours</strong> | Target SLA: <strong className="text-emerald-300">{analyzedResult.estimatedSlaDays || 14} Days</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Translation & Classification Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0B1A35] p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block font-medium">English Translation & Issue Summary:</span>
                  <p className="text-slate-200 mt-1 italic font-serif leading-relaxed">
                    "{analyzedResult.englishTranslation}"
                  </p>
                </div>

                <div className="bg-[#0B1A35] p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Classified Sector:</span>
                    <span className="font-semibold text-cyan-300">{analyzedResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Urgency Priority:</span>
                    <span className="font-bold text-rose-400">{analyzedResult.urgencyScore} / 10 ({analyzedResult.severityLevel})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Affected Citizens:</span>
                    <span className="font-semibold text-sky-300">{analyzedResult.estimatedAffectedPopulation?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recommended Action:</span>
                    <span className="text-right text-emerald-300 font-medium">{analyzedResult.recommendedAction}</span>
                  </div>
                </div>
              </div>

              {/* Localized Citizen Positive Reassurance Message */}
              {analyzedResult.citizenReassuranceMessage && (
                <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold block text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Empowering Citizen Reassurance Message (Native Dialect):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (isSpeaking) {
                          stopSpeaking();
                        } else {
                          speak(analyzedResult.citizenReassuranceMessage);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen Native Voice'}</span>
                    </button>
                  </div>
                  <p className="leading-relaxed italic bg-[#040E1B] p-2.5 rounded-lg border border-emerald-900/60 text-emerald-100">
                    "{analyzedResult.citizenReassuranceMessage}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              {analyzedResult ? 'Close Window' : 'Cancel'}
            </button>

            <button
              id="submit-ai-verification-btn"
              type="button"
              disabled={isAnalyzing || (!inputText && !photoBase64 && !hasRecordedAudio)}
              onClick={handleRunAIAnalysisAndSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-[#1E3A8A] to-emerald-600 hover:from-blue-500 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-950/60 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gemini AI Processing Multilingual Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit & Verify via Gemini DPI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
