import React from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  X, 
  Trash2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AttendanceNotificationEvent } from '../../data/attendanceData';

interface ParentNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: AttendanceNotificationEvent[];
  onClearEvents: () => void;
}

export const ParentNotificationDrawer: React.FC<ParentNotificationDrawerProps> = ({
  isOpen,
  onClose,
  events,
  onClearEvents,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200/80 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Parent Notification Events
              </h3>
              <p className="text-xs text-slate-500">
                Automated SMS & WhatsApp dispatch logs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action toolbar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">
            Total Dispatched: <strong className="text-slate-900">{events.length}</strong>
          </span>
          {events.length > 0 && (
            <button
              onClick={onClearEvents}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {events.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Smartphone className="w-10 h-10 text-slate-300 mb-2" />
              <p className="font-bold text-sm text-slate-600">No dispatch events yet</p>
              <p className="text-xs mt-1 max-w-[220px]">
                Marking any student Absent or Late in the live roll call will instantly log parent alerts here.
              </p>
            </div>
          ) : (
            events.map((ev) => {
              const isAbsent = ev.status === 'absent';
              return (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isAbsent ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        ATTENDANCE DISPATCH
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {ev.timestamp}
                    </span>
                  </div>

                  {/* Exact message format required */}
                  <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {ev.message}
                  </p>

                  {/* Recipient Details */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.guardianPhone}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {ev.deliveryStatus}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-[11px] text-slate-500">
            Integrated with School SMS Gateway (Seth Tolaram Bafna Academy). DLT Approved Sender ID: STBA-SCHL.
          </p>
        </div>
      </div>
    </div>
  );
};
