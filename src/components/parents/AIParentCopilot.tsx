import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Bus, 
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ParentGuardianRecord, ParentCommunicationItem } from '../../types';

interface AIParentCopilotProps {
  parents: ParentGuardianRecord[];
  communications: ParentCommunicationItem[];
  onQuickNavigate?: (filterKey: string) => void;
  onSelectParent?: (parent: ParentGuardianRecord) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  highlights?: Array<{ label: string; detail: string; action?: string }>;
  timestamp: string;
}

export const AIParentCopilot: React.FC<AIParentCopilotProps> = ({
  parents,
  communications,
  onQuickNavigate,
  onSelectParent,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am your Parent & Guardian 360° AI Copilot. I analyze real-time attendance roll calls, bus telemetry, fee ledgers, and PTM RSVPs across all 520 academy families. Click any chip below or type a query.",
      timestamp: 'Just now',
    },
  ]);

  const promptChips = [
    "Show parents with unread attendance alerts",
    "Which parents have not responded to PTM?",
    "Show pending parent actions",
    "Find students whose parents need notification",
    "Summarize today's parent communication",
    "Show transport-related parent alerts",
  ];

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Generate intelligent contextual response
    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let assistantText = '';
      let highlights: Array<{ label: string; detail: string; action?: string }> = [];

      if (lower.includes('attendance alert') || lower.includes('absent')) {
        const absents = parents.filter(p => p.todayAttendance === 'absent' || p.todayAttendance === 'late');
        assistantText = `Identified ${absents.length} students with morning roll-call attendance alerts today:`;
        highlights = absents.map(p => ({
          label: `${p.linkedStudentName} (${p.className})`,
          detail: `Guardian: ${p.primaryContactName} (${p.phone}) • Status: ${p.todayAttendance.toUpperCase()}`,
          action: p.id,
        }));
      } else if (lower.includes('ptm') || lower.includes('responded')) {
        const pendingPTMs = parents.filter(p => p.ptmStatus === 'Pending' || p.ptmStatus === 'Declined');
        assistantText = `Found ${pendingPTMs.length} parents with pending or declined Term 1 PTM consultations:`;
        highlights = pendingPTMs.map(p => ({
          label: `${p.primaryContactName} (Guardian of ${p.linkedStudentName})`,
          detail: `Class ${p.className} • Assigned Teacher: ${p.ptmTeacher || 'Class Teacher'} • Status: ${p.ptmStatus}`,
          action: p.id,
        }));
      } else if (lower.includes('pending parent action') || lower.includes('pending action')) {
        const withActions = parents.filter(p => p.pendingActionCount > 0);
        assistantText = `There are ${withActions.length} parents requiring administrative action or sign-offs:`;
        highlights = withActions.map(p => ({
          label: `${p.primaryContactName} • ${p.linkedStudentName}`,
          detail: p.pendingActionsList.join('; '),
          action: p.id,
        }));
      } else if (lower.includes('transport') || lower.includes('bus')) {
        const busStudents = parents.filter(p => p.transportRoute.includes('Route'));
        assistantText = `Smart Fleet Telemetry summary: 8 transport alerts dispatched today. Active bus routes:`;
        highlights = busStudents.slice(0, 4).map(p => ({
          label: `${p.busNumber} — ${p.transportRoute}`,
          detail: `Ward: ${p.linkedStudentName} (${p.className}) • Designated Stop: ${p.busStop} • Status: ${p.busBoardingStatus} (ETA: 7 min)`,
          action: p.id,
        }));
      } else if (lower.includes('summarize') || lower.includes('summary')) {
        assistantText = `Today's Parent Communication Summary (18 Sep 2026): 142 automated and manual notifications were dispatched across SMS (54%), Mobile App (32%), and Email (14%). Delivery success is 98.4% with an average guardian read turnaround of 14 minutes.`;
        highlights = [
          { label: 'Campus Gate Entries', detail: '312 RFID turnstile entries acknowledged by guardians' },
          { label: 'Absence Notifications', detail: '19 automated SMS & App alerts generated' },
          { label: 'Transport Geofence Alerts', detail: '8 bus arrival updates triggered' },
        ];
      } else {
        assistantText = `Analyzing database for "${promptText}" across 520 parent accounts. All guardian records are active and connected with roll-call, transport, and fee tracking.`;
        highlights = [
          { label: 'Active Parent Ratio', detail: '93.5% authenticated on Smart School 360 App' },
          { label: 'Pending Approvals', detail: '45 action items in queue across academy classes' },
        ];
      }

      const reply: Message = {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        highlights,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, reply]);
    }, 400);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              AI Parent Copilot
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              Admin Assistant
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Query parent status, unacknowledged roll call alerts, PTM RSVPs, or generate targeted communication suggestions.
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Suggested Queries
        </span>
        <div className="flex flex-wrap gap-1.5">
          {promptChips.map((chip, i) => (
            <button
              key={i}
              id={`copilot-chip-${i}`}
              onClick={() => handleSendPrompt(chip)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-slate-600 text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-xl p-3 sm:p-4 max-h-[320px] overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-br-none'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>

              {msg.highlights && msg.highlights.length > 0 && (
                <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {msg.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {item.detail}
                        </span>
                      </div>
                      {item.action && onSelectParent && (
                        <button
                          onClick={() => {
                            const p = parents.find(x => x.id === item.action);
                            if (p) onSelectParent(p);
                          }}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 text-[10px] font-bold hover:bg-blue-100 shrink-0 cursor-pointer"
                        >
                          View 360°
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <span className={`block text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(query);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          id="copilot-query-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Copilot about parent communications, bus updates, attendance alerts..."
          className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <button
          type="submit"
          id="btn-copilot-send"
          disabled={!query.trim()}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask Copilot</span>
        </button>
      </form>
    </div>
  );
};
