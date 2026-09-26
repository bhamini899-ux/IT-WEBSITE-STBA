import React, { useState } from 'react';
import { X, Send, MessageSquare, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types';

interface SendMessageModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (studentId: string, channel: 'SMS' | 'WhatsApp' | 'Email', subject: string, message: string) => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  student,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [channel, setChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');
  const [template, setTemplate] = useState('custom');
  const [subject, setSubject] = useState('School Advisory');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !student) return null;

  const handleTemplateChange = (tmpl: string) => {
    setTemplate(tmpl);
    switch (tmpl) {
      case 'absence':
        setSubject('Daily Absence Alert');
        setMessage(`Dear Parent, this is to notify that ${student.name} (Class ${student.className}) has been marked absent today. Please reply or contact the class teacher if this was unplanned.`);
        break;
      case 'fee':
        setSubject('Fee Installment Advisory');
        setMessage(`Dear Parent, this is a reminder regarding tuition dues for ${student.name}. Kindly clear the pending balance through the Smart School 360 portal.`);
        break;
      case 'library':
        setSubject('Overdue Library Material');
        setMessage(`Dear Parent, library book(s) issued to ${student.name} are overdue. Kindly request the student to return them to the Central Circulation Desk.`);
        break;
      case 'commendation':
        setSubject('Commendation & Academic Recognition');
        setMessage(`Dear Parent, we are delighted to inform you that ${student.name} has demonstrated exemplary conduct and academic excellence this week!`);
        break;
      default:
        setSubject('School Advisory');
        setMessage('');
        break;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(student.id, channel, subject, message.trim());
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-black">Direct Guardian Communication</h3>
              <p className="text-xs text-slate-400">Recipient: {student.guardianName} ({student.guardianPhone})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess && (
          <div className="bg-emerald-600 text-white py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Message successfully dispatched via {channel} gateway!</span>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSend} className="p-6 space-y-3.5 text-xs">
          {/* Channel Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Dispatch Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'SMS', label: 'SMS Gateway', icon: Phone },
                { id: 'WhatsApp', label: 'WhatsApp API', icon: MessageSquare },
                { id: 'Email', label: 'Official Email', icon: Mail },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = channel === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChannel(c.id as any)}
                    className={`py-2 px-3 rounded-lg font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Templates */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Template
            </label>
            <select
              value={template}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="custom">Custom Message</option>
              <option value="absence">Absence Alert (Unplanned Absence)</option>
              <option value="fee">Fee Reminder / Challan Due</option>
              <option value="library">Library Book Overdue Notice</option>
              <option value="commendation">Positive Behavior / Academic Commendation</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subject Header
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Message Text
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type official communication..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg text-[11px] text-slate-500">
            Dispatched via Smart School 360° notification cluster. All outbound transmissions are encrypted and logged into student communication timeline.
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to {student.guardianPhone}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
