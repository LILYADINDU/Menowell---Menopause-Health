import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  User, 
  HeartPulse, 
  Loader2, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { UserProfile, DailyLog } from '../types';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentLog: DailyLog;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  currentLog,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello ${profile.name || 'there'}, I'm Dr. Sophia Vance, your evidence-based menopause health counselor. I'm here to support you with tailored dietary adjustments, sleep architecture optimization, mood reframing, and preparing for your doctor visits.\n\nHow are you feeling today, or what symptom can we address together?`,
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    "What foods can stop my 3 AM night sweats?",
    "How can I talk to my doctor about transdermal HRT?",
    "Why does my anxiety feel worse in the morning?",
    "Best supplements for bone density and joint ache?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build history
      const history = messages.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content,
      }));

      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          userProfile: profile,
          currentLog: {
            sleepHours: currentLog.sleepHours,
            sleepQuality: currentLog.sleepQuality,
            nightSweats: currentLog.nightSweats,
            nightSweatCount: currentLog.nightSweatEpisodes,
            mood: currentLog.mood,
            calmScore: currentLog.calmScore,
            hotFlashCount: currentLog.hotFlashCount,
            dietSummary: `${currentLog.phytoestrogenServings} phytoestrogen servings, ${currentLog.waterOz}oz water`,
          },
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || "I am listening closely. What other changes have you noticed lately?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having a brief connection pause, but remember: keeping your nervous system calm and tracking daily triggers is key. Let's try again in a moment.",
        time: 'Just now',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-serif-display text-stone-900 text-base">
                  Dr. Sophia Vance
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  AI Specialist
                </span>
              </div>
              <p className="text-xs text-stone-500">
                NAMS Clinical Guidelines • Gemini 3.8 Powered
              </p>
            </div>
          </div>
          <button
            id="close-ai-drawer-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="px-4 py-2 bg-purple-50/80 border-b border-purple-100 text-[11px] text-purple-900 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-700 shrink-0" />
          <span>Educational health advisor. Always consult your licensed physician for medical prescriptions.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <HeartPulse className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-stone-50 text-stone-800 border border-stone-200 rounded-tl-xs whitespace-pre-line'
                }`}
              >
                {msg.content}
                <div
                  className={`text-[10px] mt-1.5 font-medium ${
                    msg.role === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
                <span>Dr. Vance is evaluating your clinical notes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompts */}
        <div className="p-3 bg-stone-50 border-t border-stone-200">
          <div className="text-[11px] font-semibold text-stone-500 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-xs bg-white hover:bg-purple-50 text-stone-700 hover:text-purple-900 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-coach-input"
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Dr. Vance about diet, mood swings, or night sweats..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-purple-400"
              disabled={isLoading}
            />
            <button
              id="ai-coach-send-btn"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
