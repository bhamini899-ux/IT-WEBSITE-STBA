import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  User, 
  Sparkles,
  Clock,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ParentGuardianRecord, NotificationCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { sendEmailNotification, EmailPayload } from '../../services/gmailNotificationService';
import { ConfirmEmailSendModal } from '../notifications/ConfirmEmailSendModal';

interface NotificationPreviewPanelProps {
  selectedCategory: NotificationCategory;
  selectedParent: ParentGuardianRecord | null;
  allParents: ParentGuardianRecord[];
  onDispatchedSuccess: (notificationData: {
    parent: ParentGuardianRecord;
    category: NotificationCategory;
    subject: string;
    message: string;
    channel: string;
  }) => void;
}

export const NotificationPreviewPanel: React.FC<NotificationPreviewPanelProps> = ({
  selectedCategory,
  selectedParent,
  allParents,
  onDispatchedSuccess,
}) => {
  const { user, gmailProfile, accessToken, login } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingEmailPayload, setPendingEmailPayload] = useState<EmailPayload | null>(null);
  const [gmailError, setGmailError] = useState<string | null>(null);

  // Target parent selection (fallback to Kabir Jain if none selected or Aarav Sharma)
  const defaultTarget = selectedParent || allParents.find(p => p.todayAttendance === 'absent') || allParents[0];
  const [activeParent, setActiveParent] = useState<ParentGuardianRecord>(defaultTarget);
  const [channel, setChannel] = useState<'Email' | 'App' | 'SMS' | 'WhatsApp'>('Email');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isQueuedSuccess, setIsQueuedSuccess] = useState(false);

  // Update active parent when prop changes
  React.useEffect(() => {
    if (selectedParent) {
      setActiveParent(selectedParent);
      setIsQueuedSuccess(false);
    }
  }, [selectedParent]);

  // Reset success state on category change
  React.useEffect(() => {
    setIsQueuedSuccess(false);
  }, [selectedCategory]);

  // Generate dynamic content based on category
  const categoryTemplates: Record<NotificationCategory, {
    title: string;
    badgeColor: string;
    subject: string;
    message: string;
    actionNote: string;
  }> = {
    ENTRY: {
      title: 'CAMPUS ENTRY NOTIFICATION',
      badgeColor: 'bg-emerald-500 text-white',
      subject: `Gate Entry Confirmation: ${activeParent.linkedStudentName}`,
      message: `Dear Parent, ${activeParent.linkedStudentName} (${activeParent.className}) swiped their biometric smart ID at South Gate turnstile at 08:14 AM and has safely entered the academy premises.`,
      actionNote: 'Real-time RFID turnstile sync event'
    },
    EXIT: {
      title: 'CAMPUS DISPERSAL & EXIT ALERT',
      badgeColor: 'bg-blue-600 text-white',
      subject: `Campus Departure: ${activeParent.linkedStudentName}`,
      message: `Dear Parent, ${activeParent.linkedStudentName} (${activeParent.className}) has checked out through Main Gate at 03:15 PM and boarded designated transport.`,
      actionNote: 'Gate check-out event'
    },
    ATTENDANCE: {
      title: 'ATTENDANCE ALERT',
      badgeColor: 'bg-amber-600 text-white',
      subject: `Attendance Alert: ${activeParent.linkedStudentName} marked Absent`,
      message: `Dear ${activeParent.primaryContactName}, your ward ${activeParent.linkedStudentName} (Class ${activeParent.className}) was marked ABSENT at morning roll call today (18 September 2026). Please verify or submit an electronic leave request.`,
      actionNote: 'Daily morning roll-call discrepancy trigger'
    },
    BUS: {
      title: 'SMART TRANSPORT ALERT',
      badgeColor: 'bg-amber-700 text-white',
      subject: `Transport Update: ${activeParent.linkedStudentName} Boarded ${activeParent.busNumber}`,
      message: `Dear Parent, ${activeParent.linkedStudentName} boarded ${activeParent.busNumber} (${activeParent.transportRoute}) at designated stop (${activeParent.busStop}). Next Stop: Civil Lines. Current ETA: 7 min.`,
      actionNote: 'GPS Fleet Management Geofence event'
    },
    ACADEMICS: {
      title: 'ACADEMIC PERFORMANCE & HOMEWORK',
      badgeColor: 'bg-purple-600 text-white',
      subject: `Academic Progress: ${activeParent.linkedStudentName}`,
      message: `Dear Parent, Unit Test marks and teacher evaluation remarks for ${activeParent.linkedStudentName} have been recorded on the portal. Term Average: ${activeParent.academicAverage}%.`,
      actionNote: 'Curriculum & Examination system integration'
    },
    FEES: {
      title: 'FEE STATEMENT & DUE REMINDER',
      badgeColor: 'bg-rose-600 text-white',
      subject: `Fee Installment Reminder: ${activeParent.linkedStudentName}`,
      message: `Dear Parent, account statement update for ${activeParent.linkedStudentName}. Outstanding dues: ₹${activeParent.feePendingAmount.toLocaleString()}. Next due date: ${activeParent.nextFeeDueDate || '15 Jan 2027'}. Receipts accessible in app.`,
      actionNote: 'Institutional Finance ledger update'
    },
    EVENTS: {
      title: 'PTM & ACADEMY EVENT INVITATION',
      badgeColor: 'bg-indigo-600 text-white',
      subject: `Term 1 PTM Invitation: ${activeParent.linkedStudentName}`,
      message: `Dear Parent, Seth Tolaram Bafna Academy cordially invites you to the Term 1 Parent-Teacher Meeting on Saturday, 22 September 2026. Your slot: ${activeParent.ptmSlot || '10:30 AM'}.`,
      actionNote: 'Academic Directorate scheduling calendar'
    },
    EXAMS: {
      title: 'EXAMINATION DATESHEET CIRCULAR',
      badgeColor: 'bg-cyan-700 text-white',
      subject: `CBSE Model Examination Datesheet — Class ${activeParent.className}`,
      message: `Dear Parent, the official timetable and sitting arrangement for upcoming Term 1 CBSE Model examinations has been finalized for Class ${activeParent.className}. Full schedule available in parent dashboard.`,
      actionNote: 'Controller of Examinations release'
    },
    ANNOUNCEMENTS: {
      title: 'OFFICIAL ACADEMY CIRCULAR',
      badgeColor: 'bg-slate-700 text-white',
      subject: `Official Notice: Seth Tolaram Bafna Academy`,
      message: `Dear Parent, please review the latest academy circular regarding upcoming institutional schedules and campus safety protocols.`,
      actionNote: 'Principal office official bulletin'
    }
  };

  const template = categoryTemplates[selectedCategory] || categoryTemplates.ATTENDANCE;
  const currentSubject = customSubject || template.subject;
  const currentMessage = customMessage || template.message;

  const handleSendNotification = () => {
    if (channel === 'Email') {
      const payload: EmailPayload = {
        to: activeParent.email,
        subject: currentSubject,
        bodyText: currentMessage,
        category: selectedCategory,
        recipientName: activeParent.primaryContactName,
        studentName: activeParent.linkedStudentName,
        studentClass: activeParent.className,
        studentRollNo: activeParent.rollNo,
        severity: 'medium',
        senderName: 'Seth Tolaram Bafna Academy'
      };
      setPendingEmailPayload(payload);
      setShowConfirmModal(true);
      return;
    }

    // SMS / WhatsApp / App notification simulation
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsQueuedSuccess(true);
      onDispatchedSuccess({
        parent: activeParent,
        category: selectedCategory,
        subject: currentSubject,
        message: currentMessage,
        channel: channel
      });
    }, 700);
  };

  const handleConfirmGmailSend = async () => {
    if (!pendingEmailPayload) return;
    setIsSending(true);
    setGmailError(null);

    try {
      if (!user) {
        const ok = await login();
        if (!ok) {
          throw new Error('Google Sign-In required to dispatch official email via Gmail.');
        }
      }

      await sendEmailNotification(pendingEmailPayload, accessToken);
      setIsSending(false);
      setShowConfirmModal(false);
      setIsQueuedSuccess(true);
      onDispatchedSuccess({
        parent: activeParent,
        category: selectedCategory,
        subject: currentSubject,
        message: currentMessage,
        channel: 'Gmail API'
      });
    } catch (err: any) {
      setIsSending(false);
      setGmailError(err.message || 'Failed to dispatch email via Gmail API');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Notification Preview Panel
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {template.actionNote}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {template.title}
          </h3>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['Email', 'App', 'SMS', 'WhatsApp'] as const).map(ch => (
            <button
              key={ch}
              onClick={() => {
                setChannel(ch);
                setIsQueuedSuccess(false);
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                channel === ch
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Target Recipient Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-500 font-medium">Recipient Guardian:</span>
          <select
            id="notification-recipient-select"
            value={activeParent.id}
            onChange={(e) => {
              const found = allParents.find(p => p.id === e.target.value);
              if (found) {
                setActiveParent(found);
                setIsQueuedSuccess(false);
              }
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            {allParents.map(p => (
              <option key={p.id} value={p.id}>
                {p.primaryContactName} ({p.relationship} of {p.linkedStudentName} • {p.className})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <span>{channel === 'Email' ? activeParent.email : activeParent.phone}</span>
        </div>
      </div>

      {/* Realistic Card Preview Box (as specified in user prompt) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5 space-y-3 font-sans shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${template.badgeColor}`}>
              {selectedCategory}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {template.title}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            18 September 2026 • Live Queue
          </span>
        </div>

        {/* Structured Spec Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs py-1">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Student</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">
              {activeParent.linkedStudentName}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Class</span>
            <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {activeParent.className} (Roll #{activeParent.rollNo})
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Status</span>
            <p className={`font-bold mt-0.5 capitalize ${
              selectedCategory === 'ATTENDANCE' 
                ? (activeParent.todayAttendance === 'absent' ? 'text-rose-600' : activeParent.todayAttendance === 'late' ? 'text-amber-600' : 'text-emerald-600')
                : 'text-slate-800 dark:text-slate-200'
            }`}>
              {selectedCategory === 'ATTENDANCE' ? activeParent.todayAttendance : 'Ready to Send'}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold">Parent / Guardian</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
              {activeParent.primaryContactName}
            </p>
          </div>
        </div>

        {/* Subject & Body */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Subject:</span>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">{currentSubject}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            {currentMessage}
          </div>
        </div>

        {/* Dispatch Footnote */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span>Communication: <strong>{channel} / App Notification</strong></span>
          <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">Ready to Send</strong></span>
        </div>
      </div>

      {/* Action Strip: Send Notification + Success State */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div>
          {gmailError && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{gmailError}</span>
            </div>
          )}
          {!gmailError && isQueuedSuccess ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>✓ Notification dispatched successfully via {channel === 'Email' ? 'Gmail API' : channel} to {activeParent.primaryContactName} ({activeParent.email})</span>
            </div>
          ) : !gmailError && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {channel === 'Email' ? (
                <span>Authenticated via Google Workspace Gmail Gateway (Sender: {gmailProfile?.emailAddress || user?.email || 'Authorized School Account'}).</span>
              ) : (
                <span>Targeted channel simulation for SMS / WhatsApp / App notification pipeline.</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isQueuedSuccess && (
            <button
              onClick={() => setIsQueuedSuccess(false)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            id="btn-send-notification-action"
            onClick={handleSendNotification}
            disabled={isSending}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Dispatching...' : channel === 'Email' ? 'Send via Gmail' : 'Send Notification'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmEmailSendModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmGmailSend}
        emailPayload={pendingEmailPayload}
        senderEmail={gmailProfile?.emailAddress || user?.email || 'girishsardameonly@gmail.com'}
        isSending={isSending}
      />
    </div>
  );
};
