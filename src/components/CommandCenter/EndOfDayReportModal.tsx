import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  Bus, 
  Zap, 
  BookOpen, 
  DollarSign, 
  Wrench 
} from 'lucide-react';

interface EndOfDayReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceRate?: number;
  presentCount?: number;
  totalStudents?: number;
}

export const EndOfDayReportModal: React.FC<EndOfDayReportModalProps> = ({
  isOpen,
  onClose,
  attendanceRate = 0,
  presentCount = 0,
  totalStudents = 0,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const absentees = Math.max(0, totalStudents - presentCount);

  const reportText = `SMART SCHOOL 360° — END-OF-DAY EXECUTIVE REPORT
Date: ${today}
Institution: Seth Tolaram Bafna Academy

1. ATTENDANCE SUMMARY:
• Overall Rate: ${attendanceRate}% (${presentCount} Present / ${totalStudents} Enrolled)
• Absentees: ${absentees} | Present: ${presentCount} | Total Enrolled: ${totalStudents}
• Faculty Status: 142/148 Present (6 Approved Medical/Personal Leaves)

2. TRANSPORT & FLEET:
• 8 of 8 Routes completed morning & afternoon loops safely.
• Zero active emergencies. Route 4 delay resolved with 5 min total variance.

3. SMART ENERGY & UTILITIES:
• Total Power Consumed: 1,842 kWh (Down 7.4% vs previous benchmark)
• Solar Generation: 680 kWh (~37% clean energy supply)
• Estimated Daily Utility Cost: ₹15,820

4. LIBRARY CIRCULATION:
• Active Loans Today: 38 books issued, 44 books returned.
• Overdue notices queued: 3 titles. Top discipline: STEM & Robotics.

5. CAMPUS MAINTENANCE & FACILITIES:
• Total Open Tickets: 12 | Critical: 0 (AC Unit resolved) | Completed Today: 8

6. FINANCE & REVENUE:
• Today's Gross Inflow: ₹1,84,500 across 34 transactions.
• Monthly Target Completion: 91% (₹42.8 Lakhs collected).

Status: School operations successfully concluded for the instructional day.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Official Institutional Record
                </span>
                <span className="text-xs text-slate-400">{today}</span>
              </div>
              <h2 className="text-xl font-black mt-1">End-of-Day Administrative Report</h2>
              <p className="text-xs text-slate-400">Seth Tolaram Bafna Academy • Executive Operational Summary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Executive Overview KPI Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Attendance</span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{attendanceRate}%</div>
              <span className="text-[10px] text-emerald-600 font-medium">{presentCount} students</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Transport</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">100%</div>
              <span className="text-[10px] text-slate-500 font-medium">8/8 routes completed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Energy Saved</span>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">-7.4%</div>
              <span className="text-[10px] text-slate-500 font-medium">1,842 kWh total</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Finance Inflow</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹1.84L</div>
              <span className="text-[10px] text-slate-500 font-medium">91% Monthly Target</span>
            </div>
          </div>

          {/* Formatted Report Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
            {reportText}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
