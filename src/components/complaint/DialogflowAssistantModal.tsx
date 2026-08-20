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
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[520px] h-[500px] bg-white border border-slate-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 backdrop-blur-xl"
        >
          {/* Modal Header */}
          <div className="bg-blue-900 p-4 border-b border-blue-950 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white tracking-wide">
                    Dialogflow CX Multilingual Agent
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] font-mono text-blue-200">
                  Google Cloud Natural Language + TTS
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-700 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
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
                        className="text-[10px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 hover:border-blue-400 transition flex items-center gap-1 cursor-pointer font-medium shadow-xs"
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
              <div className="flex items-center gap-2 text-slate-500 text-xs py-1">
                <Bot className="w-3.5 h-3.5 text-blue-600 animate-spin" />
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
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask in any language (e.g. "How to report?")...`}
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isSending}
              className="p-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
