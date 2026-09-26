import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  X, 
  Smartphone, 
  Clock, 
  Bus as BusIcon, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface ParentTransportConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendNotice: (studentName: string, eventType: string) => void;
}

export const ParentTransportConnectionModal: React.FC<ParentTransportConnectionModalProps> = ({
  isOpen,
  onClose,
  onSendNotice
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'boarding' | 'reached' | 'delay' | 'dropoff'>('boarding');
  const [studentName, setStudentName] = useState<string>('Aarav Sharma');
  const [parentEmail, setParentEmail] = useState<string>('parent.aarav@example.com');
  const [sentNoticeSuccess, setSentNoticeSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendTest = () => {
    onSendNotice(studentName, selectedTemplate);
    setSentNoticeSuccess(true);
    setTimeout(() => {
      setSentNoticeSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Parent Connect & Gmail Notification Gateway
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Integration with Module 7 (Parent Connect) and authorized Google Workspace Gmail API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TEMPLATE PICKER */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Notification Event Template
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setSelectedTemplate('boarding')}
              className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                selectedTemplate === 'boarding'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              1. Student Boarded Bus
            </button>
            <button
              onClick={() => setSelectedTemplate('reached')}
              className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                selectedTemplate === 'reached'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              2. Bus Reached School
            </button>
            <button
              onClick={() => setSelectedTemplate('delay')}
              className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                selectedTemplate === 'delay'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              3. Route Delay Advisory
            </button>
            <button
              onClick={() => setSelectedTemplate('dropoff')}
              className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                selectedTemplate === 'dropoff'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              4. Evening Drop-Off
            </button>
          </div>
        </div>

        {/* EMAIL PREVIEW CARD */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-[11px] text-slate-400">
            <span>From: <strong>transport@sethtolarambafna.edu.in</strong></span>
            <span>Gmail API: Active</span>
          </div>

          <div className="font-bold text-slate-900 dark:text-white">
            {selectedTemplate === 'boarding' && `[Transit Update] ${studentName} has boarded Bus 01 at Ambedkar Circle`}
            {selectedTemplate === 'reached' && `[Safety Update] Bus 01 has reached Academy Campus Safely`}
            {selectedTemplate === 'delay' && `[Transit Notice] Route 01 experiencing a 10-minute traffic delay`}
            {selectedTemplate === 'dropoff' && `[Transit Complete] ${studentName} dropped off at Ambedkar Circle`}
          </div>

          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
            <p>Dear Parent,</p>
            {selectedTemplate === 'boarding' && (
              <p>
                This is an automated notification from the <strong>Seth Tolaram Bafna Academy Smart Transport System</strong>. Your ward <strong>{studentName}</strong> (Class 10-A) tapped their RFID card and safely boarded <strong>Bus 01</strong> at <strong>07:15 AM</strong>. The bus is in transit under Driver Rameshwar Singh.
              </p>
            )}
            {selectedTemplate === 'reached' && (
              <p>
                We are pleased to notify you that <strong>Bus 01</strong> has safely arrived at the Seth Tolaram Bafna Academy school campus at <strong>07:55 AM</strong>. All students have disembarked under conductor supervision.
              </p>
            )}
            {selectedTemplate === 'delay' && (
              <p>
                Please be advised that <strong>Bus 01</strong> on Route 01 is currently delayed by approximately <strong>10 minutes</strong> due to railway crossing gate congestion at Lalgarh. The updated expected arrival at your stop is <strong>07:35 AM</strong>.
              </p>
            )}
            {selectedTemplate === 'dropoff' && (
              <p>
                Your ward <strong>{studentName}</strong> has been safely dropped off at their designated bus stop <strong>Ambedkar Circle</strong> at <strong>02:40 PM</strong>.
              </p>
            )}
            <p className="pt-1 text-[11px] text-slate-400">
              Warm regards,<br />Transport Department, Seth Tolaram Bafna Academy, Bikaner
            </p>
          </div>
        </div>

        {/* RECIPIENT INPUTS */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Student Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Parent Email</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            />
          </div>
        </div>

        {/* FEEDBACK STATUS & ACTION BUTTON */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            {sentNoticeSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Notification simulated via Gmail gateway!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSendTest}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Sample Notification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
