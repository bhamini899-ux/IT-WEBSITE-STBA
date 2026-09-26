import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Percent, 
  Building2, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { AppSection } from '../../types';

interface PrimaryKPIAreaProps {
  onNavigate: (section: AppSection) => void;
  totalStudents?: number;
  studentsPresent?: number;
  studentsAbsent?: number;
  studentsLate?: number;
  attendanceRate?: number;
  teachersPresent?: number;
  totalTeachers?: number;
  staffPresent?: number;
  totalStaff?: number;
}

export const PrimaryKPIArea: React.FC<PrimaryKPIAreaProps> = ({
  onNavigate,
  totalStudents = 0,
  studentsPresent = 0,
  studentsAbsent = 0,
  studentsLate = 0,
  attendanceRate = 0,
  teachersPresent = 0,
  totalTeachers = 0,
  staffPresent = 0,
  totalStaff = 0,
}) => {
  const capacityTotal = totalStudents || 250;
  const occupancyPct = totalStudents > 0 ? ((studentsPresent / totalStudents) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Primary Operational Metrics</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              Live Real-Time
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any metric card to inspect detailed records and breakdown
          </p>
        </div>
      </div>

      {/* Grid of Primary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Students */}
        <div
          id="kpi-total-students"
          onClick={() => onNavigate('students')}
          className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
              <TrendingUp className="w-3 h-3" /> +2.4% MoM
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Enrolled</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
              {totalStudents.toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Grades 1 through 12</span>
              <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 font-semibold">
                Roster <ArrowUpRight className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>

        {/* KPI 2: Students Present */}
        <div
          id="kpi-students-present"
          onClick={() => onNavigate('attendance')}
          className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
              {attendanceRate}% Rate
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Present Today</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight text-emerald-600 dark:text-emerald-400">
              {studentsPresent.toLocaleString()}
            </h3>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${attendanceRate}%` }} 
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Absent & Late Split */}
        <div
          id="kpi-absent-late"
          onClick={() => onNavigate('attendance')}
          className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <UserX className="w-4 h-4" />
              </div>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
              Action Needed
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Absent</p>
              <h4 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
                {studentsAbsent}
              </h4>
              <p className="text-[10px] text-slate-400">5.3% of total</p>
            </div>
            <div className="border-l border-slate-200/80 dark:border-slate-800 pl-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Late</p>
              <h4 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {studentsLate}
              </h4>
              <p className="text-[10px] text-slate-400">Logged gate entry</p>
            </div>
          </div>
        </div>

        {/* KPI 4: Faculty & Staff */}
        <div
          id="kpi-faculty-staff"
          onClick={() => onNavigate('teachers')}
          className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
              96% On-Duty
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Teachers</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {teachersPresent}<span className="text-xs text-slate-400 font-normal">/{totalTeachers}</span>
              </h4>
              <p className="text-[10px] text-rose-500 font-medium">6 On Leave</p>
            </div>
            <div className="border-l border-slate-200/80 dark:border-slate-800 pl-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Staff</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {staffPresent}<span className="text-xs text-slate-400 font-normal">/{totalStaff}</span>
              </h4>
              <p className="text-[10px] text-emerald-600 font-medium">3 On Leave</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Capacity Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/10 text-white shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white">Campus Capacity & Real-Time Headcount</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                Comfortable Safe Load
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Current campus occupancy is <strong className="text-white font-bold">{occupancyPct}%</strong> with <strong className="text-white font-bold">{studentsPresent + teachersPresent + staffPresent} total people</strong> on premises (Capacity: {capacityTotal}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-300">Classroom Utilization</div>
            <div className="text-sm font-bold text-white">31 of 42 active (73.8%)</div>
          </div>
          <button
            onClick={() => onNavigate('classrooms')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs cursor-pointer text-center"
          >
            Inspect Rooms & Wings
          </button>
        </div>
      </div>
    </div>
  );
};
