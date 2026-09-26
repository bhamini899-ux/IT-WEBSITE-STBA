import React, { useState } from 'react';
import { 
  School, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Percent, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ClassAttendanceDetail } from '../../data/attendanceData';

interface ClassWiseAttendanceSectionProps {
  classes: ClassAttendanceDetail[];
  selectedClass: string;
  onSelectClass: (className: string) => void;
}

export const ClassWiseAttendanceSection: React.FC<ClassWiseAttendanceSectionProps> = ({
  classes,
  selectedClass,
  onSelectClass,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const getStatusBadge = (status: ClassAttendanceDetail['status'], rate: number) => {
    if (rate >= 95) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Excellent
        </span>
      );
    }
    if (rate >= 92) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Normal
        </span>
      );
    }
    if (rate >= 90) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Attention
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Low Threshold
      </span>
    );
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Class-Wise Attendance Distribution
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              14 Classes (6-A to 12-B)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time enrollment, active headcounts, and rate status across all secondary and senior sections.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {classes.map((cls) => {
            const isSelected = selectedClass === cls.className;
            return (
              <div
                key={cls.className}
                onClick={() => onSelectClass(isSelected ? 'all' : cls.className)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-100 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Header row: Class Name + Status badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Section {cls.section}
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      Class {cls.className}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      Teacher: {cls.classTeacher}
                    </p>
                  </div>
                  {getStatusBadge(cls.status, cls.attendanceRate)}
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Attendance:</span>
                    <span className={`font-bold ${
                      cls.attendanceRate >= 95 
                        ? 'text-emerald-600' 
                        : cls.attendanceRate >= 90 
                        ? 'text-amber-600' 
                        : 'text-rose-600'
                    }`}>
                      {cls.attendanceRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cls.attendanceRate >= 95
                          ? 'bg-emerald-500'
                          : cls.attendanceRate >= 90
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, cls.attendanceRate)}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown metrics pills */}
                <div className="grid grid-cols-4 gap-1.5 mt-3.5 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="text-xs font-bold text-slate-700">{cls.totalStudents}</span>
                  </div>
                  <div className="bg-emerald-50/60 p-1.5 rounded-lg">
                    <span className="text-[10px] text-emerald-600 block">Present</span>
                    <span className="text-xs font-bold text-emerald-700">{cls.present}</span>
                  </div>
                  <div className="bg-rose-50/60 p-1.5 rounded-lg">
                    <span className="text-[10px] text-rose-600 block">Absent</span>
                    <span className="text-xs font-bold text-rose-700">{cls.absent}</span>
                  </div>
                  <div className="bg-amber-50/60 p-1.5 rounded-lg">
                    <span className="text-[10px] text-amber-600 block">Late</span>
                    <span className="text-xs font-bold text-amber-700">{cls.late}</span>
                  </div>
                </div>

                {/* Click to filter hint */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-blue-600 opacity-80 group-hover:opacity-100">
                  <span>{isSelected ? '✓ Filter active' : 'Filter roster to class'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode (responsive scrollable) */
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Class Teacher</th>
                <th className="py-3 px-4">Room</th>
                <th className="py-3 px-4 text-right">Students</th>
                <th className="py-3 px-4 text-right text-emerald-600">Present</th>
                <th className="py-3 px-4 text-right text-rose-600">Absent</th>
                <th className="py-3 px-4 text-right text-amber-600">Late</th>
                <th className="py-3 px-4 text-right">Attendance %</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cls) => (
                <tr 
                  key={cls.className} 
                  className={`hover:bg-slate-50/80 transition-colors ${
                    selectedClass === cls.className ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    Class {cls.className}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-700">
                    {cls.classTeacher}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {cls.room}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {cls.totalStudents}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    {cls.present}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600">
                    {cls.absent}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-600">
                    {cls.late}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    {cls.attendanceRate.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(cls.status, cls.attendanceRate)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectClass(selectedClass === cls.className ? 'all' : cls.className)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {selectedClass === cls.className ? 'Clear' : 'Filter'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
