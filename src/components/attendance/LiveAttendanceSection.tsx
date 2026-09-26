import React from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Filter, 
  Eye, 
  Bell,
  ChevronRight,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { SmartAttendanceStudent } from '../../data/attendanceData';
import { AttendanceStatus } from '../../types';

interface LiveAttendanceSectionProps {
  students: SmartAttendanceStudent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedClass: string;
  onClassChange: (className: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onMarkStatus: (studentId: string, newStatus: AttendanceStatus) => void;
  onSelectStudent: (student: SmartAttendanceStudent) => void;
  onMarkAllPresentInView: () => void;
  classesList: string[];
}

export const LiveAttendanceSection: React.FC<LiveAttendanceSectionProps> = ({
  students,
  searchQuery,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedStatus,
  onStatusChange,
  onMarkStatus,
  onSelectStudent,
  onMarkAllPresentInView,
  classesList,
}) => {
  const getStatusBadge = (status: AttendanceStatus) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Late
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Not Marked
          </span>
        );
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Section Header & Live Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Live Classroom Attendance
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {students.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time roll call register. Changes immediately sync with school metrics and parent notification queue.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onMarkAllPresentInView}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mark All View Present</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar (Section D requirement: Search student by name, roll number or class) */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student by name, roll number or class (e.g. Kabir, 14, 10-B)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Class selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => onClassChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes (6-A to 12-B)</option>
              {classesList.map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>

            {/* Status quick filter */}
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">🟢 Present Only</option>
              <option value="absent">🔴 Absent Only</option>
              <option value="late">🟠 Late Only</option>
              <option value="attention">⚠️ Attendance &lt; 75%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View (hidden on mobile, perfectly readable on desktop) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Check-In Time</th>
              <th className="py-3 px-4">Monthly %</th>
              <th className="py-3 px-4 text-right">Quick Mark Action</th>
              <th className="py-3 px-4 text-center">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-sm">No students match your criteria.</p>
                  <p className="text-xs mt-1">Try resetting the search query or class filter.</p>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const s = (student.todayStatus || '').toLowerCase();
                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          s === 'present' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : s === 'absent' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => onSelectStudent(student)}>
                              {student.name}
                            </span>
                            {student.requiresAttention && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Low attendance alert (<75%)"></span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Roll: #{student.rollNo}</span>
                            <span>•</span>
                            <span>{student.admissionNo}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                        {student.className}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(student.todayStatus)}
                    </td>

                    {/* Check In Time */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {student.checkInTime}
                    </td>

                    {/* Monthly Percentage */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          student.attendancePercentage >= 90
                            ? 'text-emerald-600'
                            : student.attendancePercentage >= 75
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}>
                          {student.attendancePercentage.toFixed(1)}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.attendancePercentage >= 90
                                ? 'bg-emerald-500'
                                : student.attendancePercentage >= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, student.attendancePercentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Action buttons (Present, Absent, Late) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                        <button
                          title="Mark Present"
                          onClick={() => onMarkStatus(student.id, 'present')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            s === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          title="Mark Absent"
                          onClick={() => onMarkStatus(student.id, 'absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            s === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          title="Mark Late"
                          onClick={() => onMarkStatus(student.id, 'late')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            s === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>

                    {/* View Details button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="View Attendance Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (PART 3 Mobile Responsiveness requirement: table converted to responsive cards) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="font-semibold text-sm">No students found.</p>
            <p className="text-xs mt-1">Try changing search query or filters.</p>
          </div>
        ) : (
          students.map((student) => {
            const s = (student.todayStatus || '').toLowerCase();
            return (
              <div 
                key={student.id} 
                className="p-4 bg-white hover:bg-slate-50 transition-colors space-y-3"
              >
                {/* Header row: Avatar + Name + Class badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      s === 'present' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : s === 'absent' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span 
                          onClick={() => onSelectStudent(student)}
                          className="font-bold text-slate-900 text-sm active:text-blue-600 cursor-pointer"
                        >
                          {student.name}
                        </span>
                        {student.requiresAttention && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            &lt;75%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Roll: #{student.rollNo} • Class {student.className}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(student.todayStatus)}
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      {student.checkInTime !== '--' ? student.checkInTime : 'No check-in'}
                    </p>
                  </div>
                </div>

                {/* Progress bar info */}
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-slate-500">Term Attendance:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${
                      student.attendancePercentage >= 90
                        ? 'text-emerald-600'
                        : student.attendancePercentage >= 75
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}>
                      {student.attendancePercentage.toFixed(1)}%
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({student.presentDays}P / {student.absentDays}A / {student.lateDays}L)
                    </span>
                  </div>
                </div>

                {/* Quick Action Touch Bar (min 44px touch targets) */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => onMarkStatus(student.id, 'present')}
                    className={`min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      s === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-emerald-800 active:bg-emerald-100'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => onMarkStatus(student.id, 'absent')}
                    className={`min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      s === 'absent'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-rose-800 active:bg-rose-100'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => onMarkStatus(student.id, 'late')}
                    className={`min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      s === 'late'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-amber-800 active:bg-amber-100'
                    }`}
                  >
                    Late
                  </button>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="min-h-[44px] rounded-xl text-xs font-bold bg-blue-50 text-blue-700 active:bg-blue-100 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
