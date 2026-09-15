import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Copy, 
  X,
  FileText,
  Building2,
  RefreshCw,
  Radio
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BRICS_33_LANGUAGES } from '../data/bricsData';
import { CitizenReport } from '../types';

interface WhatsAppTelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOnMap?: (regionId: string) => void;
  onAddReport?: (report: CitizenReport) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  hasVoiceNote?: boolean;
  voiceDuration?: string;
  imageUrl?: string;
  metadata?: {
    trackingId?: string;
    slaDays?: number;
    category?: string;
    urgency?: string;
    department?: string;
    regionId?: string;
    regionName?: string;
    country?: string;
    estimatedBeneficiaries?: number;
  };
}

export const WhatsAppTelegramBotModal: React.FC<WhatsAppTelegramBotModalProps> = ({
  isOpen,
  onClose,
  onTrackOnMap,
  onAddReport,
}) => {
  const { currentLanguageInfo, speak, isSpeaking } = useLanguage();
  
  // App Simulation Platform: 'whatsapp' | 'telegram' | 'sandes' (Gov SMS)
  const [platform, setPlatform] = useState<'whatsapp' | 'telegram' | 'sandes'>('whatsapp');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(currentLanguageInfo.code || 'hi');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Welcome Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'bot',
      text: `🇮🇳 *PulseGov Sovereign DPI Citizen Bot v3.7*\n\nNamaste / Welcome! I am your 24/7 Digital Public Works & Grievance AI Bot.\n\nYou can send me:\n• 🎙️ Voice Notes (in 33 native languages)\n• 📸 Infrastructure Photos (Potholes, broken water pipes, dark streetlights)\n• 💬 Text grievances in your local dialect\n\nI will instantly issue an official *Government Tracking ID*, estimate resolution SLA, and dispatch to the designated municipal engineering team.`,
      timestamp: '10:00 AM',
      status: 'read'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isBotTyping, isOpen]);

  if (!isOpen) return null;

  const currentLang = BRICS_33_LANGUAGES.find(l => l.code === selectedLanguageCode) || BRICS_33_LANGUAGES[0];

  // Quick Grievance Prompts
  const SAMPLE_MESSAGES = [
    {
      lang: 'hi',
      name: 'Hindi',
      text: 'हमारे ग्राम पंचायत में 3 बोरवेल पिछले दो महीने से ख़राब हैं और पानी में पीलापन है। कृपया तुरंत ठीक कराएं।',
      category: 'Water & Sanitation',
      region: 'ind_bihar',
      regionName: 'Bihar, India'
    },
    {
      lang: 'ta',
      name: 'Tamil',
      text: 'தமிழ்நாடு ஆரம்ப சுகாதார நிலையத்தில் 3 நாட்களாக மின்சாரம் இல்லை. அவசர சிகிச்சை பாதிக்கப்பட்டுள்ளது.',
      category: 'Health Infrastructure',
      region: 'ind_tamilnadu',
      regionName: 'Tamil Nadu, India'
    },
    {
      lang: 'mr',
      name: 'Marathi',
      text: 'नागपूर-पुणे मुख्य रस्त्यावरील पूल खचला आहे. वाहतूक ठप्प झाली असून मोठा अपघात होण्याची भीती आहे.',
      category: 'Transport & Connectivity',
      region: 'ind_maharashtra',
      regionName: 'Maharashtra, India'
    },
    {
      lang: 'bn',
      name: 'Bengali',
      text: 'সুন্দরবনের নদীর বাঁধ ভেঙে নোনা জল চাষের জমিতে ঢুকছে। স্লুইস গেট অবিলম্বে মেরামত দরকার।',
      category: 'Agricultural & Irrigation',
      region: 'ind_westbengal',
      regionName: 'West Bengal, India'
    },
    {
      lang: 'pt',
      name: 'Português',
      text: 'A ponte de madeira que liga as comunidades rurais em Bahia quebrou após as fortes chuvas.',
      category: 'Transport & Connectivity',
      region: 'bra_bahia',
      regionName: 'Bahia, Brazil'
    },
    {
      lang: 'ar',
      name: 'العربية',
      text: 'انقطاع خط مياه الشرب الرئيسي في حي الروضة منذ 48 ساعة ويوجد تسرب كبير في الشارع العام.',
      category: 'Water & Sanitation',
      region: 'uae_dubai',
      regionName: 'Dubai / Abu Dhabi, UAE'
    }
  ];

  const handleSendMessage = async (textToSend?: string, isVoice: boolean = false, imageUrl?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() && !imageUrl && !isVoice) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: rawText || (isVoice ? '🎙️ [Voice Grievance Recorded - 14s]' : '📸 [Infrastructure Photo Uploaded]'),
      timestamp: userTimestamp,
      status: 'delivered',
      hasVoiceNote: isVoice,
      voiceDuration: isVoice ? '0:14' : undefined,
      imageUrl: imageUrl || (attachedImage || undefined)
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setAttachedImage(null);
    setIsBotTyping(true);

    // If it's a simple greeting or short message, act like a chat bot
    const wordCount = rawText.trim().split(/\\s+/).length;
    
    // Check if the message contains obvious grievance keywords even if it's short
    const lowerText = rawText.toLowerCase();
    const hasGrievanceKeyword = 
      lowerText.includes('water') || lowerText.includes('pani') || lowerText.includes('पानी') ||
      lowerText.includes('road') || lowerText.includes('sarak') || lowerText.includes('सड़क') ||
      lowerText.includes('power') || lowerText.includes('electricity') || lowerText.includes('bijli') || lowerText.includes('बिजली') ||
      lowerText.includes('leak') || lowerText.includes('broken') || lowerText.includes('hole') || lowerText.includes('outage');
      
    const isSimpleMessage = wordCount <= 4 && !isVoice && !imageUrl && !hasGrievanceKeyword;
    
    if (isSimpleMessage) {
      try {
        const response = await fetch('/api/dialogflow-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: rawText,
            language: currentLang.name,
            userLocation: 'India'
          })
        });
        const result = await response.json();
        const replyText = result.data?.reply || `Hello! I'm here to help you register public infrastructure issues. Could you please describe the issue in more detail?`;
        
        const greetingBotMsg: ChatMessage = {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };
        setMessages(prev => [...prev, greetingBotMsg]);
      } catch (err) {
        console.error('Dialogflow fetch error:', err);
      } finally {
        setIsBotTyping(false);
      }
      return;
    }

    // Call backend API for AI Grievance Triaging
    try {
      const response = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          imageBase64: imageUrl ? 'dummy_base64_for_demo' : undefined,
          country: 'India',
          preferredLanguage: currentLang.name
        })
      });
      const result = await response.json();
      const data = result.data || {};
      
      const trackingToken = `IN-DPI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const nativeBotReply = data.citizenReassuranceMessage || 'Grievance Registered Successfully.';
      
      const botMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: `✅ *Grievance Registered Successfully! (Sovereign DPI)*\n\n📌 *Official Tracking Code:* \`${trackingToken}\`\n🏛️ *Assigned Authority:* ${data.assignedDepartment || 'Municipal Council'}\n⚡ *Triage Urgency:* ${data.severityLevel || 'High'}\n⏱️ *Predicted SLA Resolution:* ${data.estimatedSlaDays || 7} Working Days\n👥 *Impact Scope:* ${data.estimatedAffectedPopulation?.toLocaleString() || 5000} Residents\n\n${nativeBotReply}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        metadata: {
          trackingId: trackingToken,
          slaDays: data.estimatedSlaDays || 7,
          category: data.category || 'Public Works',
          urgency: data.severityLevel || 'High',
          department: data.assignedDepartment || 'Municipal Council',
          regionId: 'ind_all',
          regionName: 'India',
          estimatedBeneficiaries: data.estimatedAffectedPopulation || 5000
        }
      };

      setMessages(prev => [...prev, botMsg]);
      
      if (onAddReport) {
        const newCitizenReport: CitizenReport = {
          id: `rep-${Date.now()}`,
          token: trackingToken,
          countryId: 'india',
          regionId: 'ind_all',
          regionName: 'India',
          citizenNameOrAnon: 'Mobile Messaging Citizen (Verified)',
          language: data.detectedLanguage || currentLang.name,
          languageCode: data.languageCode || currentLang.code,
          originalText: rawText,
          englishTranslation: data.englishTranslation || rawText,
          category: data.category || 'Public Works',
          urgencyScore: data.urgencyScore || 8,
          severityLevel: data.severityLevel || 'High',
          status: 'Under Triage - Work Order Dispatched',
          timestamp: 'Just now',
          estimatedAffectedPop: data.estimatedAffectedPopulation || 5000,
          upvotes: 1,
          hasPhoto: !!imageUrl || !!attachedImage,
          imageUrl: imageUrl || (attachedImage || undefined),
          channel: platform === 'whatsapp' ? 'WhatsApp Citizen Bot' : platform === 'telegram' ? 'Telegram DPI Bot' : 'Gov SMS (Sandes)',
          keyIssues: data.keyIssuesIdentified || [],
          recommendedAction: data.recommendedAction || 'Dispatch municipal engineer immediately.',
          citizenReassuranceMessage: nativeBotReply
        };
        onAddReport(newCitizenReport);
      }
    } catch (err) {
      console.error('Analyze report fetch error:', err);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleCopyTrackingToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleSampleClick = (sample: typeof SAMPLE_MESSAGES[0]) => {
    setSelectedLanguageCode(sample.lang);
    handleSendMessage(sample.text);
  };

  const handleSimulatePhotoUpload = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584463699039-445a498db257?w=600&auto=format&fit=crop&q=80'
    ];
    const chosen = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setAttachedImage(chosen);
    handleSendMessage('📸 [Citizen Uploaded Road & Pipeline Breach Image]', false, chosen);
  };

  const handleSimulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceText = currentLang.sampleGrievance || 'हमारे गांव में पेयजल की मुख्य पाइपलाइन टूट गई है और 400 घरों में पानी नहीं आ रहा है।';
      handleSendMessage(voiceText, true);
    }, 2000);
  };

  // Color schemes based on simulated platform
  const headerBg = platform === 'whatsapp' 
    ? 'bg-[#005c4b]' 
    : platform === 'telegram' 
      ? 'bg-[#229ED9]' 
      : 'bg-[#1E3A8A]';

  const userBubbleBg = platform === 'whatsapp'
    ? 'bg-[#005c4b] text-white'
    : platform === 'telegram'
      ? 'bg-[#2B5278] text-white'
      : 'bg-[#1E3A8A] text-white';

  const botBubbleBg = 'bg-[#1F2C34] text-slate-100 border border-slate-700/60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111B21] rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        
        {/* Top Header: Platform Switcher & Sovereign Bot Identity */}
        <div className={`${headerBg} px-4 py-3 text-white transition-colors duration-300 shrink-0`}>
          <div className="flex items-center justify-between mb-2">
            
            {/* Left: Bot Avatar & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/30 flex items-center justify-center font-bold text-base shadow-inner">
                  {platform === 'whatsapp' ? '💬' : platform === 'telegram' ? '✈️' : '🇮🇳'}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#111B21] rounded-full animate-pulse"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    {platform === 'whatsapp' ? 'WhatsApp DPI Bot' : platform === 'telegram' ? 'Telegram PulseGov Bot' : 'Sandes Gov SMS Bot'}
                  </h3>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono font-medium">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-none">
                  {isBotTyping ? 'typing response...' : 'Online • Official Sovereign DPI Gateway'}
                </p>
              </div>
            </div>

            {/* Right: Close Button */}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
              title="Close Bot Simulator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Tab Toggles */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl">
              <button
                onClick={() => setPlatform('whatsapp')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  platform === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setPlatform('telegram')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  platform === 'telegram' ? 'bg-[#0088cc] text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                Telegram
              </button>
              <button
                onClick={() => setPlatform('sandes')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  platform === 'sandes' ? 'bg-blue-700 text-white shadow' : 'text-white/70 hover:text-white'
                }`}
              >
                Gov Sandes
              </button>
            </div>

            {/* 33-Dialect Badge */}
            <div className="flex items-center gap-1 text-[11px] bg-white/10 px-2 py-1 rounded-lg border border-white/20">
              <span>{currentLang.regionFlag}</span>
              <span className="font-semibold">{currentLang.nativeName}</span>
            </div>
          </div>
        </div>

        {/* Chat History Canvas */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-[#0B141A] bg-opacity-95 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px]">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div 
                  className={`p-3 rounded-2xl max-w-[88%] sm:max-w-[82%] shadow-md text-xs sm:text-sm whitespace-pre-wrap break-words ${
                    isUser ? userBubbleBg : botBubbleBg
                  }`}
                >
                  {/* Image Attachment (if any) */}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
                      <img 
                        src={msg.imageUrl} 
                        alt="Infrastructure Evidence" 
                        className="w-full h-36 object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Voice Note Audio Waveform Bar */}
                  {msg.hasVoiceNote && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/30 mb-2 border border-white/10">
                      <button 
                        onClick={() => speak(msg.text, selectedLanguageCode)}
                        className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shrink-0 transition"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="h-1.5 w-full bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-2/3 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                          <span>Voice Note ({msg.voiceDuration || '0:14'})</span>
                          <span>33-Lang AI Transcribed</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Body */}
                  <div>{msg.text}</div>

                  {/* Bot Interactive Action Cards (Tracking, Map Navigation & Audio) */}
                  {msg.metadata?.trackingId && (
                    <div className="mt-3 pt-2 border-t border-slate-700/80 flex flex-col gap-2">
                      
                      {/* Copy Token Button */}
                      <button
                        onClick={() => handleCopyTrackingToken(msg.metadata!.trackingId!)}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-mono font-semibold transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Code: {msg.metadata.trackingId}</span>
                        </span>
                        <span>{copiedToken === msg.metadata.trackingId ? 'Copied!' : <Copy className="w-3 h-3" />}</span>
                      </button>

                      {/* Action Row: Listen Audio & Track on Map */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => speak(msg.text, selectedLanguageCode)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-cyan-300 flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{isSpeaking ? 'Stop Voice' : 'Listen Reply'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (onTrackOnMap && msg.metadata?.regionId) {
                              onTrackOnMap(msg.metadata.regionId);
                              onClose();
                            }
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-1.5 text-xs font-bold transition shadow"
                        >
                          <MapPin className="w-3.5 h-3.5 text-slate-950" />
                          <span>Track on GIS Map</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Timestamp & Status Indicator */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {isUser && (
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bot Typing Indicator */}
          {isBotTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2 rounded-xl bg-[#1F2C34] w-fit border border-slate-700/50">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Vertex AI & Gemini triaging complaint...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts Tray */}
        <div className="px-3 py-2 bg-[#182229] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">
            Quick Prompts:
          </span>
          {SAMPLE_MESSAGES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium whitespace-nowrap transition flex items-center gap-1 shrink-0"
            >
              <span>{sample.name}:</span>
              <span className="max-w-[140px] truncate">{sample.text}</span>
            </button>
          ))}
        </div>

        {/* Bottom Input Controls */}
        <div className="p-3 bg-[#202C33] border-t border-slate-700 flex items-center gap-2 shrink-0">
          
          {/* Photo Upload Simulator */}
          <button
            onClick={handleSimulatePhotoUpload}
            title="Attach Infrastructure Photo"
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition shrink-0"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Voice Note Recording Simulator */}
          <button
            onClick={handleSimulateVoiceRecording}
            title="Record Voice Grievance (33 Languages)"
            className={`p-2.5 rounded-full border transition shrink-0 ${
              isRecording
                ? 'bg-red-600 text-white border-red-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Type grievance in ${currentLang.nativeName} or English...`}
            className="flex-1 bg-[#2A3942] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-400 placeholder:text-slate-400"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold transition shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
