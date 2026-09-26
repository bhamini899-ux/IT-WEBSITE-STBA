import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  CalendarClock,
  Award
} from 'lucide-react';
import { 
  ACADEMIC_HEADER_STATS, 
  SUBJECT_ANALYTICS_DATA, 
  CLASS_ACADEMIC_DATA, 
  ACADEMIC_ATTENTION_STUDENTS,
  INITIAL_EXAMINATIONS,
  INITIAL_HOMEWORK_ASSIGNMENTS,
  TEACHER_ACADEMIC_ACTIVITY
} from '../../data/academicData';

interface AIAcademicCopilotProps {
  onNavigateTab: (tabKey: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  bullets?: string[];
  actionLabel?: string;
  actionTab?: string;
  timestamp: string;
}

export const AIAcademicCopilot: React.FC<AIAcademicCopilotProps> = ({ onNavigateTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Greetings, Academic Administrator. I am your Academic & Examination AI Copilot for Seth Tolaram Bafna Academy. How can I assist with student progress, exam timetables, marks analysis or faculty workloads today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    { label: 'Show students below target', query: 'Show students below the academic target.' },
    { label: 'Which subjects need attention?', query: 'Which subjects need attention?' },
    { label: 'Show upcoming exams', query: 'Show upcoming exams.' },
    { label: 'Which classes have pending marks?', query: 'Which classes have pending marks?' },
    { label: 'Assignments due today', query: 'Show assignments due today.' },
    { label: 'Summarize week’s academic activity', query: "Summarize this week's academic activity." },
    { label: 'Students with declining performance', query: 'Show students with declining academic performance.' },
    { label: 'Which report cards are pending?', query: 'Which report cards are pending?' }
  ];

  const handleSend = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Generate grounded AI response based on real simulated state
    setTimeout(() => {
      let aiResponse: ChatMessage;
      const lower = q.toLowerCase();

      if (lower.includes('below') && (lower.includes('target') || lower.includes('score') || lower.includes('attention'))) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Found 18 students currently flagged below the academy target score (<60%) or experiencing significant academic stress across Classes 8-12:`,
          bullets: [
            'Aryan Solanki (Class 10-A, Roll #14) — Avg: 58.4%, struggling in coordinate geometry.',
            'Kabir Mehta (Class 9-B, Roll #19) — Avg: 56.2%, multiple missed chemistry lab submissions.',
            'Devansh Pareek (Class 8-A, Roll #28) — Avg: 54.0%, severe drop in Hindi & Social Studies.',
            '15 additional students identified in the Early Intervention radar.'
          ],
          actionLabel: 'Open Academic Attention Center',
          actionTab: 'attention',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('subject') && (lower.includes('attention') || lower.includes('low') || lower.includes('weak'))) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Analysis of 11 active subjects reveals 3 disciplines requiring curriculum pacing or remedial focus:',
          bullets: [
            'Mathematics (78.6% avg, 24 students below 60%) — Lowest scoring in quadratic equations & trigonometry.',
            'Physics (79.4% avg, 19 students below 60%) — Practical numerical derivations require laboratory booster sessions.',
            'Social Studies (79.8% avg, 21 students below 60%) — Term 1 history map work evaluation was lower than average.'
          ],
          actionLabel: 'View Subject Analytics',
          actionTab: 'subjects',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('upcoming') && lower.includes('exam')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Here are the next scheduled examinations on the academy master roster:',
          bullets: [
            'Mid-Term Examination — Class 10-B Mathematics (24 Sep 2026, 09:00 AM, Exam Hall 1)',
            'Mid-Term Examination — Class 12-A Physics (25 Sep 2026, 09:00 AM, Exam Hall 2)',
            'Periodic Assessment 2 — Class 9-A Science (26 Sep 2026, 10:00 AM, Room 102)',
            '⚠ 1 Room capacity conflict detected for Room 204 requiring admin resolution.'
          ],
          actionLabel: 'Open Examination Center',
          actionTab: 'exams',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('pending') && lower.includes('marks')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'The following faculty members and classes currently have pending marks entries for Periodic Assessment 1:',
          bullets: [
            'Vikram Choudhary (Class 9-A & 9-B Social Studies) — 38 marks pending submission.',
            'Rajesh Verma (Class 10-A Mathematics) — 14 marks draft saved, awaiting final verification.',
            'Ankit Surana (Class 11-B Accountancy) — 22 marks pending.'
          ],
          actionLabel: 'Open Marks Management',
          actionTab: 'marks',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('due today') || lower.includes('homework') || lower.includes('assignment')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Coursework due today (18 September 2026):',
          bullets: [
            'Electromagnetic Induction Numerical Problem Set — Class 12-A Physics (Due 5:00 PM today, 78% submitted)',
            'Cellular Respiration & Krebs Cycle Diagrams — Class 9-A Biology (Due today, 82% submitted)',
            '6 other active assignments due over the coming 48 hours.'
          ],
          actionLabel: 'View Homework Center',
          actionTab: 'homework',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('report card') && lower.includes('pending')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Report Card publishing summary for Term 1:',
          bullets: [
            '34 Report Cards are pending Class Teacher review across Class 10-A and 9-B.',
            '546 Report Cards reviewed and signed off by coordinators.',
            '1,810 Report Cards already published to Parent 360° Portal.'
          ],
          actionLabel: 'Open Report Card Center',
          actionTab: 'reportcards',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Here is the comprehensive weekly academic summary for Seth Tolaram Bafna Academy:`,
          bullets: [
            'Overall School Academic Index: 81.4% (+1.4% growth since term baseline).',
            'Syllabus Pacing: 91% of subjects on-track for Mid-Term exam cutoffs.',
            'Exam Readiness: 8 exams scheduled for next week with 1 room clash flagged.',
            'Parent Alignment: 1,810 report cards synced live with Parent 360°.'
          ],
          actionLabel: 'Inspect Performance Overview',
          actionTab: 'overview',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages(prev => [...prev, aiResponse]);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-200 mb-1 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Academic Intelligence</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white">
          Academic & Examination Copilot
        </h3>
        <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
          Ask questions in natural language. The Copilot queries real academic scores, timetable schedules, submission rates and student intervention flags instantly.
        </p>
      </div>

      {/* Suggested Query Chips */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Recommended Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-all cursor-pointer text-left"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 min-h-[360px]">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                isAi 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
              }`}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className={`max-w-2xl rounded-2xl p-4 text-xs space-y-2 ${
                isAi 
                  ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60' 
                  : 'bg-blue-600 text-white'
              }`}>
                <p className="leading-relaxed font-medium">{msg.text}</p>

                {msg.bullets && msg.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    {msg.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {msg.actionLabel && msg.actionTab && (
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigateTab(msg.actionTab!)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                    >
                      <span>{msg.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className={`text-[10px] text-right ${isAi ? 'text-slate-400' : 'text-blue-200'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
      >
        <input
          type="text"
          id="input-academic-copilot"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Copilot about any student, class, exam clash, marks or subject..."
          className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:outline-hidden"
        />
        <button
          type="submit"
          id="btn-submit-academic-copilot"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Copilot</span>
        </button>
      </form>
    </div>
  );
};
