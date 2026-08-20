import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Radio, 
  ChevronRight, 
  Compass, 
  Mic, 
  Layers,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface DialogflowAssistantModalProps {
  currentLanguage: string;
  userLocation: string;
  onSelectQuickAction?: (action: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  intent?: string;
  quickActions?: string[];
}

export const DialogflowAssistantModal: React.FC<DialogflowAssistantModalProps> = ({
  currentLanguage,
  userLocation,
  onSelectQuickAction,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello! I am your Google Dialogflow Multilingual Assistant. I am here to guide your sovereign grievance report across all 7 Google AI & Cloud tracks.`,
      timestamp: 'Just now',
      intent: 'GREETING_AND_CAPABILITIES',
      quickActions: [
        '📍 How to drop GPS map pin?',
        '🎙️ How to dictate in native language?',
        '✨ What is Gemini Smart Draft?',
        '⚡ How is Vertex AI SLA predicted?'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsSending(true);

    try {
      const res = await fetch('/api/dialogflow-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: currentLanguage,
          userLocation,
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const botMsg: ChatMessage = {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            text: json.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            intent: json.data.detectedIntent,
            quickActions: json.data.suggestedQuickActions
          };
          setMessages((prev) => [...prev, botMsg]);
          return;
        }
      }
      throw new Error('Fallback triggered');
    } catch (err) {
      console.warn('Dialogflow agent fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: `To submit an effective report: 1) Drop a GPS pin on the map to query IMD rainfall telemetry; 2) Upload a photo for Vertex AI damage detection; 3) Click 'Smart Draft with Gemini' to turn informal notes into a formal report.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: 'COMPLAINT_GUIDE',
        quickActions: ['📍 Drop Pin on Map', '🎙️ Dictate in My Language', '✨ Polish with Gemini']
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Dialogflow Multilingual Assistant Launch Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="dialogflow-floating-btn"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-full shadow-2xl border border-blue-300/40 hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Open Dialogflow Multilingual Virtual Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-indigo-900 animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            Dialogflow AI Assistant
          </span>
          <span className="text-[10px] font-mono bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-400/30">
            33 Langs
          </span>
        </button>
      </div>

      {/* Dialogflow Chat Drawer / Modal */}
      {isOpen && (
        <div 
          id="dialogflow-chat-modal"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[520px] h-[500px] bg-[#0A192F] border border-blue-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-xl"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-950 via-[#0c1e3d] to-indigo-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    Dialogflow CX Multilingual Agent
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-cyan-300">
                  Google Cloud Natural Language + TTS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070F1E]/80 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-[#0f213a] text-slate-200 border border-blue-900/60 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Quick action buttons attached to bot message */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.quickActions.map((qa, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(qa)}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-blue-950/80 hover:bg-blue-900 text-cyan-300 border border-blue-800/60 hover:border-cyan-400 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>{qa}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <Bot className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Dialogflow is formulating response in {currentLanguage}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0A192F] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask in any language (e.g. "How to report?")...`}
              className="flex-1 bg-[#070F1E] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isSending}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
