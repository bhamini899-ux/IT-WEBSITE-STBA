import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, User, AlertTriangle, BookOpen, Bus, CreditCard, ChevronRight } from 'lucide-react';
import { Student } from '../../types';

interface StudentCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onOpenProfile: (student: Student) => void;
}

interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedStudents?: Student[];
  actionRecommendation?: string;
}

export const StudentCopilotModal: React.FC<StudentCopilotModalProps> = ({
  isOpen,
  onClose,
  students,
  onOpenProfile,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: "Hello Principal! I am your AI Student Copilot. I analyze all attendance swipes, academic ranks, bus routes, library loans, and fee ledgers in real-time. Ask me anything about your students, or click any prompt below.",
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
    };

    // Synthesize intelligent response based on current students data
    let responseText = '';
    let matches: Student[] = [];
    let recommendation = '';
    const qLower = q.toLowerCase();

    if (qLower.includes('below 75') || qLower.includes('low attendance') || qLower.includes('attendance attention')) {
      matches = students.filter(s => s.attendancePercentage < 75);
      responseText = `Found ${matches.length} students with attendance below the CBSE 75% board requirement threshold. These students are at academic risk:`;
      recommendation = 'Recommendation: Dispatch automated parental counseling notices and schedule academic coordinator reviews.';
    } else if (qLower.includes('kabir')) {
      const kabir = students.find(s => s.name.toLowerCase().includes('kabir'));
      if (kabir) {
        matches = [kabir];
        responseText = `360° Summary for ${kabir.name} (Class ${kabir.className}, ID: ${kabir.id}):\n• Attendance is critical at 71% (Absent today)\n• Has 1 overdue library book ("Computer Basics", fine: ₹20)\n• Term 2 tuition fee of ₹36,000 is 38 days overdue\n• Academic average: 64.2% (Needs remedial support in Mathematics)`;
        recommendation = 'Action Required: Follow up with father Rakesh Jain (+91 98290 33456) regarding fee and attendance.';
      }
    } else if (qLower.includes('library') || qLower.includes('overdue book') || qLower.includes('fine')) {
      matches = students.filter(s => (s.libraryDetails?.overdueCount && s.libraryDetails.overdueCount > 0));
      responseText = `Found ${matches.length} student(s) currently possessing overdue library materials from the Central Library:`;
      recommendation = 'Auto-SMS circulation reminder queued for dispatch.';
    } else if (qLower.includes('bus') || qLower.includes('route 01') || qLower.includes('transport')) {
      matches = students.filter(s => s.transportRoute === 'Route 01' || s.transportDetails?.busNumber === 'Bus 01');
      responseText = `Found ${matches.length} student(s) assigned to Bus 01 (Route 01 - North Town Loop, Driver: Amit Kumar):`;
      recommendation = 'All listed students have morning pickup confirmed at their designated turnstile stops.';
    } else if (qLower.includes('topper') || qLower.includes('distinction') || qLower.includes('top academic') || qLower.includes('rank')) {
      matches = students.filter(s => s.academicStatus === 'Distinction' || (s.academicAverage && s.academicAverage >= 90));
      responseText = `Identified ${matches.length} top academic distinction achievers (>=90% marks or Rank #1-3 in their respective classes):`;
      recommendation = 'Nominated for Annual Academic Excellence Citations.';
    } else if (qLower.includes('fee') || qLower.includes('pending fee') || qLower.includes('overdue fee')) {
      matches = students.filter(s => s.feeStatus === 'Overdue' || s.feeStatus === 'Pending');
      responseText = `Found ${matches.length} students with unsettled fee installments:`;
      recommendation = 'Accounts department has fee challans ready for electronic reconciliation.';
    } else {
      matches = students.slice(0, 3);
      responseText = `I searched the School 360 database for "${q}". Here are the most relevant matching student profiles:`;
    }

    const aiMsg: CopilotMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      matchedStudents: matches,
      actionRecommendation: recommendation,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setQuery('');
  };

  const presetQueries = [
    'Which students have attendance below 75%?',
    "Summarize Kabir Jain's 360 profile",
    'Who has overdue library books right now?',
    'Show students riding Bus 01',
    'Who are the top academic performers?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black flex items-center gap-1.5">
                AI Student Copilot <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[11px] text-slate-400">
                Connected to Attendance, Academics, Library, Transport & Fee streams
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                {/* Render matched students cards if any */}
                {m.matchedStudents && m.matchedStudents.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    {m.matchedStudents.map((stu) => (
                      <div
                        key={stu.id}
                        className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={stu.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.name)}`}
                            alt={stu.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{stu.name}</p>
                            <p className="text-[10px] text-slate-500">
                              Class {stu.className} • Att: {stu.attendancePercentage}% • Fee: {stu.feeStatus}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenProfile(stu);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span>Open 360°</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendation pill */}
                {m.actionRecommendation && (
                  <div className="mt-2.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300 text-[11px] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{m.actionRecommendation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Try:</span>
          {presetQueries.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-600 whitespace-nowrap cursor-pointer transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Copilot about any student, class, bus, library loan or fee status..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
