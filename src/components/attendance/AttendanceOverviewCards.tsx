import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Percent, 
  AlertTriangle,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface AttendanceOverviewCardsProps {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
  lowAttendanceClassesCount: number;
  attentionStudentsCount: number;
  onFilterClick?: (filterType: 'all' | 'present' | 'absent' | 'late' | 'attention') => void;
  activeFilter?: string;
}

export const AttendanceOverviewCards: React.FC<AttendanceOverviewCardsProps> = ({
  totalStudents,
  presentCount,
  absentCount,
  lateCount,
  attendanceRate,
  lowAttendanceClassesCount,
  attentionStudentsCount,
  onFilterClick,
  activeFilter = 'all'
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
      {/* 1. Total Students */}
      <div 
        onClick={() => onFilterClick?.('all')}
        className={`p-4 rounded-2xl bg-white border shadow-xs transition-all cursor-pointer ${
          activeFilter === 'all' 
            ? 'border-blue-500 ring-2 ring-blue-100' 
            : 'border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalStudents}</p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Active academic roster</p>
        </div>
      </div>

      {/* 2. Present Today */}
      <div 
        onClick={() => onFilterClick?.('present')}
        className={`p-4 rounded-2xl bg-white border shadow-xs transition-all cursor-pointer ${
          activeFilter === 'present' 
            ? 'border-emerald-500 ring-2 ring-emerald-100' 
            : 'border-slate-200/80 hover:border-emerald-200 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">{presentCount}</p>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">Live</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">In classrooms now</p>
        </div>
      </div>

      {/* 3. Absent Today */}
      <div 
        onClick={() => onFilterClick?.('absent')}
        className={`p-4 rounded-2xl bg-white border shadow-xs transition-all cursor-pointer ${
          activeFilter === 'absent' 
            ? 'border-rose-500 ring-2 ring-rose-100' 
            : 'border-slate-200/80 hover:border-rose-200 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent Today</span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">{absentCount}</p>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">Alerts Queued</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Unexcused / illness</p>
        </div>
      </div>

      {/* 4. Late Today */}
      <div 
        onClick={() => onFilterClick?.('late')}
        className={`p-4 rounded-2xl bg-white border shadow-xs transition-all cursor-pointer ${
          activeFilter === 'late' 
            ? 'border-amber-500 ring-2 ring-amber-100' 
            : 'border-slate-200/80 hover:border-amber-200 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late Arrivals</span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">{lateCount}</p>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">Tracked</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">After 08:30 AM gate</p>
        </div>
      </div>

      {/* 5. Attendance Percentage */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate Today</span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{attendanceRate.toFixed(1)}%</p>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +1.2%
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Benchmark: 75% min</p>
        </div>
      </div>

      {/* 6. Classes With Low Attendance */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Classes</span>
          <div className="p-2 rounded-xl bg-yellow-50 text-yellow-700">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">{lowAttendanceClassesCount}</p>
            <span className="text-[10px] font-bold text-amber-800 bg-yellow-100 px-1.5 py-0.5 rounded-md">10-B, 11-B</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Below 92% goal</p>
        </div>
      </div>

      {/* 7. Students Requiring Attention */}
      <div 
        onClick={() => onFilterClick?.('attention')}
        className={`p-4 rounded-2xl bg-white border shadow-xs transition-all cursor-pointer ${
          activeFilter === 'attention' 
            ? 'border-yellow-500 ring-2 ring-yellow-100 bg-yellow-50/20' 
            : 'border-slate-200/80 hover:border-yellow-300 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Need Attention</span>
          <div className="p-2 rounded-xl bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">{attentionStudentsCount}</p>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">&lt; 75%</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">Critical shortage</p>
        </div>
      </div>
    </div>
  );
};
