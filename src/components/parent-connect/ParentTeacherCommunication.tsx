import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Plus,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { TeacherCommunicationThread, ChildProfile } from '../../types/parentConnect';

interface ParentTeacherCommunicationProps {
  child: ChildProfile;
  threads: TeacherCommunicationThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onStartNewThread: (teacherName: string, teacherRole: string, subject: string, initialMessage: string) => void;
}

export const ParentTeacherCommunication: React.FC<ParentTeacherCommunicationProps> = ({
  child,
  threads,
  onSendMessage,
  onStartNewThread,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // New thread form state
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState(0);
  const [subjectTitle, setSubjectTitle] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');

  const teacherDirectory = [
    { name: 'Mrs. Neha Verma', role: 'Class Teacher & Science Faculty', email: 'neha.verma@stba.edu.in', hours: '02:30 PM - 03:30 PM' },
    { name: 'Mr. Rajesh Sharma', role: 'Senior Mathematics Faculty', email: 'rajesh.sharma@stba.edu.in', hours: '01:00 PM - 02:00 PM' },
    { name: 'Mr. Amitav Sen', role: 'Computer Science & AI Head', email: 'amitav.sen@stba.edu.in', hours: '11:00 AM - 12:00 PM' },
    { name: 'Mrs. Priya Nair', role: 'English Literature Faculty', email: 'priya.nair@stba.edu.in', hours: '02:00 PM - 03:00 PM' }
  ];

  const currentThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentThread) return;
    onSendMessage(currentThread.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectTitle.trim() || !newThreadMessage.trim()) return;

    const teacher = teacherDirectory[selectedTeacherIndex];
    onStartNewThread(teacher.name, teacher.role, subjectTitle.trim(), newThreadMessage.trim());

    setSubjectTitle('');
    setNewThreadMessage('');
    setIsComposeOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Parent-Teacher Communication Desk
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Official Desk
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send formal inquiries, schedule consultations, and receive academic feedback from {child.name}'s educators
          </p>
        </div>

        <button
          onClick={() => setIsComposeOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Compose New Note</span>
        </button>
      </div>

      {/* Main Communication Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Threads List (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Active Inquiries ({threads.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto flex-1">
            {threads.map((thread) => {
              const isSelected = thread.id === currentThread?.id;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-l-blue-600' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {thread.teacherName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {thread.lastUpdated}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {thread.subject}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Message History & Reply Box (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden">
          {currentThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentThread.subject}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>With: <strong>{currentThread.teacherName}</strong> ({currentThread.teacherRole})</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  currentThread.status === 'Open'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {currentThread.status}
                </span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                {currentThread.messages.map((msg) => {
                  const isParent = msg.senderRole === 'Parent';

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                        isParent
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700'
                      }`}>
                        <div className="flex items-center justify-between gap-3 text-[11px] mb-1 opacity-80">
                          <span className="font-bold">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Write a note to ${currentThread.teacherName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Select a thread to view communication logs.
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Compose Note to Faculty
            </h4>

            <form onSubmit={handleCreateNewThread} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Recipient Educator
                </label>
                <select
                  value={selectedTeacherIndex}
                  onChange={(e) => setSelectedTeacherIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  {teacherDirectory.map((t, idx) => (
                    <option key={idx} value={idx}>
                      {t.name} — {t.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Fair Guidance or Extra Mathematics Doubt Session"
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your question or meeting request details here..."
                  value={newThreadMessage}
                  onChange={(e) => setNewThreadMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Teacher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
