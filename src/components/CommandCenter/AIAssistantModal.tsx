import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight, 
  Lightbulb, 
  RefreshCw 
} from 'lucide-react';
import { AppSection, Teacher, SubstitutionRecord, TimetableSlot } from '../../types';
import { querySchoolCopilot } from '../../utils/aiSchoolCopilot';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
  teachers?: Teacher[];
  substitutions?: SubstitutionRecord[];
  timetableSlots?: TimetableSlot[];
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  targetSection?: AppSection;
  actionLabel?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  teachers = [],
  substitutions = [],
  timetableSlots = []
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello Principal. I am the Seth Tolaram Bafna Academy AI Operations Copilot. I actively track student & staff attendance, live period timetable slots, free teachers, substitutions, transit telemetry, and smart energy grids. How can I assist your administration right now?",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Which teachers are absent today?",
    "Who can substitute for 10-B Period 3?",
    "Which teachers are free right now?",
    "Show teachers with high workload",
    "Find timetable conflicts",
    "Show me today's attendance anomalies",
    "Which buses are currently delayed?"
  ];

  const handleSend = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: Message = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      // Query the live copilot engine with real state!
      const copilotResponse = querySchoolCopilot(queryText, teachers, substitutions, timetableSlots);

      const aiResponse: Message = {
        sender: 'ai',
        text: copilotResponse.answer,
        targetSection: copilotResponse.targetSection || copilotResponse.actions?.[0]?.targetSection,
        actionLabel: copilotResponse.actionLabel || copilotResponse.actions?.[0]?.label,
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <Bot className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black">Seth Tolaram Bafna Academy AI Copilot</h3>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  Gemini Flash Live
                </span>
              </div>
              <p className="text-xs text-blue-200">Autonomous School Intelligence & Coordination Core</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs font-semibold whitespace-nowrap border border-slate-200 dark:border-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                {m.targetSection && (
                  <button
                    onClick={() => {
                      onNavigate(m.targetSection!);
                      onClose();
                    }}
                    className="mt-2.5 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-colors"
                  >
                    <span>{m.actionLabel || 'Navigate'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="p-2 rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span>Analyzing live faculty rosters and campus streams...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputPrompt)}
            placeholder="Ask anything about teachers, substitutions, periods, attendance, buses..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend(inputPrompt)}
            disabled={!inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
