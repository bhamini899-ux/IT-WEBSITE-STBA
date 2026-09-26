import React from 'react';
import { Mail, AlertTriangle, ShieldCheck, X, Send, User } from 'lucide-react';
import { EmailPayload } from '../../services/gmailNotificationService';

interface ConfirmEmailSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  emailPayload: EmailPayload | null;
  senderEmail: string;
  isSending: boolean;
}

export const ConfirmEmailSendModal: React.FC<ConfirmEmailSendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  emailPayload,
  senderEmail,
  isSending
}) => {
  if (!isOpen || !emailPayload) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Confirm Gmail Email Dispatch
              </h3>
              <p className="text-xs text-blue-100">
                Google Workspace OAuth • Institutional Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-bold">Outgoing Email Confirmation:</span> You are about to dispatch an official school communication from your connected Gmail account (<strong>{senderEmail}</strong>).
            </div>
          </div>

          {/* Email metadata overview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium">To Recipient:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {emailPayload.recipientName ? `${emailPayload.recipientName} <${emailPayload.to}>` : emailPayload.to}
              </span>
            </div>

            {emailPayload.studentName && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500 font-medium">Linked Student:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {emailPayload.studentName} {emailPayload.studentClass ? `(${emailPayload.studentClass})` : ''}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 font-medium">Category:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {emailPayload.category || 'GENERAL'}
              </span>
            </div>

            <div className="py-1">
              <span className="text-slate-500 font-medium block mb-1">Subject:</span>
              <p className="font-bold text-slate-900 dark:text-white text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                {emailPayload.subject}
              </p>
            </div>

            {emailPayload.bodyText && (
              <div className="py-1">
                <span className="text-slate-500 font-medium block mb-1">Message Preview:</span>
                <div className="text-slate-700 dark:text-slate-300 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 max-h-24 overflow-y-auto leading-relaxed">
                  {emailPayload.bodyText}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated RFC 2822 MIME message via Seth Tolaram Bafna Academy secure server API.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSending}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending via Gmail...' : 'Confirm & Dispatch via Gmail'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
