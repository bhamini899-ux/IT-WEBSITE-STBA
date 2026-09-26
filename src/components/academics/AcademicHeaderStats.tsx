import React from 'react';
import { 
  CalendarClock, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Award,
  Sparkles
} from 'lucide-react';
import { ACADEMIC_HEADER_STATS } from '../../data/academicData';

interface AcademicHeaderStatsProps {
  onNavigateTab: (tabKey: string) => void;
}

export const AcademicHeaderStats: React.FC<AcademicHeaderStatsProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-4">
      {/* Academy Header Banner with 4 Primary Actions */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Seth Tolaram Bafna Academy — Academic Session 2026-2027</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Academics & Examination 360°
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
              Academic curriculum progress, central examination schedules, assessment reports and marks management.
            </p>
          </div>

          {/* 4 Prioritized Primary Actions (# 3 in design specification) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="header-action-add-exam"
              onClick={() => onNavigateTab('exams')}
              className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CalendarClock className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
            <button
              id="header-action-enter-marks"
              onClick={() => onNavigateTab('marks')}
              className="px-3.5 py-2 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span>Enter Marks</span>
            </button>
            <button
              id="header-action-view-results"
              onClick={() => onNavigateTab('overview')}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Results</span>
            </button>
            <button
              id="header-action-generate-report"
              onClick={() => onNavigateTab('reportcards')}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 4 Clear Primary Visible Information Cards (# 2 in design specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Current Academic Overview */}
        <div 
          onClick={() => onNavigateTab('overview')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Academic Overview</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {ACADEMIC_HEADER_STATS.averageAcademicScore}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Overall Average • 520 Students
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            +2.4% vs Term 1 Baseline
          </div>
        </div>

        {/* 2. Upcoming Exams */}
        <div 
          onClick={() => onNavigateTab('exams')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Exams</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <CalendarClock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Mid-Term Exam
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Starts 24 Sep • Classes 8-12
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
            {ACADEMIC_HEADER_STATS.upcomingExams} Scheduled papers
          </div>
        </div>

        {/* 3. Recent Results */}
        <div 
          onClick={() => onNavigateTab('marks')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Results</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            Unit Test 2
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            84.2% Passed • 6% Distinction
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
            {ACADEMIC_HEADER_STATS.examsCompleted} Cycles completed
          </div>
        </div>

        {/* 4. Important Academic Alerts */}
        <div 
          onClick={() => onNavigateTab('attention')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Academic Alerts</span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {ACADEMIC_HEADER_STATS.studentsNeedingAttention} Students
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Average &lt;60% or declining
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
            1 Room conflict detected
          </div>
        </div>
      </div>
    </div>
  );
};
