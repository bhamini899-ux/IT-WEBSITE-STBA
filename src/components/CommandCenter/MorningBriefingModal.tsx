import React from 'react';
import { 
  X, 
  Sun, 
  CloudSun, 
  CheckCircle2, 
  AlertTriangle, 
  Bus, 
  Users, 
  Calendar, 
  Wrench, 
  Sparkles, 
  Printer, 
  ArrowRight 
} from 'lucide-react';
import { AppSection } from '../../types';

interface MorningBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
}

export const MorningBriefingModal: React.FC<MorningBriefingModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
              <Sun className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Executive Briefing
                </span>
                <span className="text-xs text-blue-100">08:00 AM Edition</span>
              </div>
              <h2 className="text-xl font-black mt-1">Good Morning, Principal & Administrator</h2>
              <p className="text-xs text-blue-100/90 mt-0.5">Seth Tolaram Bafna Academy • Operational Day Overview</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Weather & Campus Conditions */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CloudSun className="w-8 h-8 text-amber-500" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">28°C Sunny & Clear</span>
                <p className="text-slate-600 dark:text-slate-300 text-xs">Air Quality Index: 52 (Good) • Outdoor sports approved for Periods 3–6</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
              Grounds Ready
            </span>
          </div>

          {/* Morning Checklist Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Attendance & Faculty</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                • Target Attendance: <strong>95.0%</strong> (Current Projected: 92.6%)<br />
                • Faculty Present: <strong>142/148</strong> (6 approved leaves, all substitutes staffed)
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>Transport & Ingress</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                • 8 Buses Active • <strong>Route 4 delayed 5 mins</strong> via flyover detour.<br />
                • Morning arrival gate turnstiles operating normally.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Today's Major Events</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                • 10:15 AM: Inter-House Sports Captains briefing in Atrium.<br />
                • 02:00 PM: CBSE Class 10 Pre-Board moderation committee meeting.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <Wrench className="w-4 h-4 text-rose-600" />
                <span>Critical Infrastructure</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                • Room 204 Projector: AV technician on-site, resolution by 09:15 AM.<br />
                • Campus solar battery reserve: <strong>94% charged</strong>.
              </p>
            </div>
          </div>

          {/* AI Prescriptive Recommendation */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-900/50">
            <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Prescriptive Focus for Today</span>
            </div>
            <p className="text-purple-950 dark:text-purple-300 text-[11px] leading-relaxed">
              "Prioritize reviewing the Class 10-B absence cluster with medical staff before midday. Verify Route 4 driver's evening route timing to bypass the railway crossing congestion."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Briefing</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Acknowledge & Proceed to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
