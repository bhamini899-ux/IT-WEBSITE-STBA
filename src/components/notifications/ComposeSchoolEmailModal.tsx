import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  X, 
  Sparkles, 
  User, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendEmailNotification, EmailPayload } from '../../services/gmailNotificationService';
import { ConfirmEmailSendModal } from './ConfirmEmailSendModal';

interface ComposeSchoolEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialRecipient?: {
    email: string;
    name?: string;
    studentName?: string;
    studentClass?: string;
  };
}

export const ComposeSchoolEmailModal: React.FC<ComposeSchoolEmailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRecipient
}) => {
  const { user, gmailProfile, accessToken, login } = useAuth();

  const [to, setTo] = useState(initialRecipient?.email || '');
  const [recipientName, setRecipientName] = useState(initialRecipient?.name || '');
  const [studentName, setStudentName] = useState(initialRecipient?.studentName || '');
  const [studentClass, setStudentClass] = useState(initialRecipient?.studentClass || '');
  const [category, setCategory] = useState<string>('ACADEMICS');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<EmailPayload | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (initialRecipient) {
      setTo(initialRecipient.email);
      if (initialRecipient.name) setRecipientName(initialRecipient.name);
      if (initialRecipient.studentName) setStudentName(initialRecipient.studentName);
      if (initialRecipient.studentClass) setStudentClass(initialRecipient.studentClass);
    }
  }, [initialRecipient]);

  if (!isOpen) return null;

  // Preset templates
  const applyTemplate = (type: string) => {
    switch (type) {
      case 'ATTENDANCE':
        setCategory('ATTENDANCE');
        setSubject(`Attendance Notice: Absence Recorded for ${studentName || 'Student'}`);
        setBodyText(`Dear ${recipientName || 'Parent'},\n\nThis is to notify you that your ward, ${studentName || 'your child'} (${studentClass || 'Class'}), was marked absent during the morning biometric roll call today. Kindly verify this status or submit a medical / leave note through the Parent 360° Portal.\n\nWarm regards,\nAttendance & Student Welfare Cell\nSeth Tolaram Bafna Academy`);
        break;
      case 'FEES':
        setCategory('FEES');
        setSubject(`Fee Installment Reminder — ${studentName || 'Student'} (${studentClass || 'Class'})`);
        setBodyText(`Dear ${recipientName || 'Parent'},\n\nWe request your attention regarding the pending academic fee installment for the current term. Timely clearance ensures uninterrupted access to digital learning repositories and transport facilities. Electronic receipts and ledger breakdowns are viewable on your Parent Portal.\n\nSincerely,\nAccounts & Finance Department\nSeth Tolaram Bafna Academy`);
        break;
      case 'ACADEMICS':
        setCategory('ACADEMICS');
        setSubject(`Scholastic Progress Update: ${studentName || 'Student'}`);
        setBodyText(`Dear ${recipientName || 'Parent'},\n\nThe scholastic evaluation and unit test assessments for ${studentName || 'your ward'} (${studentClass || 'Class'}) have been verified and published to the academic portal. We encourage you to review the teacher commentary and progress trajectories.\n\nBest regards,\nAcademic Directorate\nSeth Tolaram Bafna Academy`);
        break;
      case 'EVENTS':
        setCategory('EVENTS');
        setSubject(`Invitation: Upcoming Parent-Teacher Conference — Seth Tolaram Bafna Academy`);
        setBodyText(`Dear ${recipientName || 'Parent'},\n\nYou are cordially invited to attend the upcoming Parent-Teacher Conference scheduled for this Saturday between 09:30 AM and 01:30 PM. This meeting offers a dedicated opportunity to discuss ${studentName || 'your ward\'s'} scholastic milestones and holistic development with subject faculties.\n\nCordially,\nPrincipal & Faculty Council\nSeth Tolaram Bafna Academy`);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !bodyText) {
      setStatusMessage({ type: 'error', text: 'Recipient email, subject, and message are required.' });
      return;
    }

    const payload: EmailPayload = {
      to,
      subject,
      bodyText,
      category,
      recipientName: recipientName || undefined,
      studentName: studentName || undefined,
      studentClass: studentClass || undefined,
      severity,
      senderName: 'Seth Tolaram Bafna Academy'
    };

    setPendingPayload(payload);
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    if (!pendingPayload) return;
    setIsSending(true);
    setStatusMessage(null);

    try {
      // Check if user is signed in with Google
      if (!user) {
        const loggedIn = await login();
        if (!loggedIn) {
          throw new Error('Google authentication required to send email through Gmail.');
        }
      }

      await sendEmailNotification(pendingPayload, accessToken);
      setIsSending(false);
      setShowConfirmModal(false);
      setStatusMessage({
        type: 'success',
        text: `Official notification successfully dispatched to ${pendingPayload.to} via Gmail API!`
      });

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsSending(false);
      setShowConfirmModal(false);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to dispatch email via Gmail API'
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div 
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xs">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Compose School Email Notification
                </h3>
                <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                  <span>Sender Account:</span>
                  <strong className="underline">{gmailProfile?.emailAddress || user?.email || 'girishsardameonly@gmail.com'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {statusMessage && (
              <div className={`p-3.5 rounded-2xl border flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span className="font-semibold">{statusMessage.text}</span>
              </div>
            )}

            {/* Quick Templates Bar */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Load Standard Academy Template:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ATTENDANCE', label: 'Roll Call Absence Alert' },
                  { id: 'FEES', label: 'Fee Due Statement' },
                  { id: 'ACADEMICS', label: 'Progress & Marks Update' },
                  { id: 'EVENTS', label: 'PTM Conference Invite' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => applyTemplate(t.id)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                  >
                    + {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="parent.guardian@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Guardian / Recipient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Rajesh Sharma"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Student & Class association */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Student Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Class / Section
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10-A"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Tag
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ACADEMICS">ACADEMICS</option>
                  <option value="ATTENDANCE">ATTENDANCE</option>
                  <option value="FEES">FEES & DUES</option>
                  <option value="BUS">TRANSPORT FLEET</option>
                  <option value="EXAMS">EXAMINATION</option>
                  <option value="EVENTS">PTM & EVENTS</option>
                  <option value="ENTRY">CAMPUS ENTRY</option>
                  <option value="EXIT">CAMPUS DISPERSAL</option>
                  <option value="GENERAL">GENERAL CIRCULAR</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Subject Line *
              </label>
              <input
                type="text"
                required
                placeholder="Official Notification Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Notification Message Body *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Type the message to be dispatched to the guardian..."
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Security notice */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex items-center justify-between text-[11px] text-blue-800 dark:text-blue-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Encapsulated in Seth Tolaram Bafna Academy branded HTML header and footer.</span>
              </div>
              <span className="font-bold">OAuth 2.0 Verified</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Review & Send via Gmail</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmEmailSendModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
        emailPayload={pendingPayload}
        senderEmail={gmailProfile?.emailAddress || user?.email || 'girishsardameonly@gmail.com'}
        isSending={isSending}
      />
    </>
  );
};
