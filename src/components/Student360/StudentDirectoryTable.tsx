import React from 'react';
import { 
  Eye, 
  Edit3, 
  MessageSquare, 
  IdCard, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Bus, 
  ShieldAlert,
  ChevronRight,
  Trash2,
  Users
} from 'lucide-react';
import { Student } from '../../types';

interface StudentDirectoryTableProps {
  students: Student[];
  selectedStudentIds: string[];
  onToggleSelectStudent: (studentId: string) => void;
  onToggleSelectAll: () => void;
  onOpenProfile: (student: Student) => void;
  onOpenEdit: (student: Student) => void;
  onOpenMessage: (student: Student) => void;
  onOpenDigitalId: (student: Student) => void;
  onOpenQRCode: (student: Student) => void;
  onRequestRemove?: (student: Student) => void;
}

export const StudentDirectoryTable: React.FC<StudentDirectoryTableProps> = ({
  students,
  selectedStudentIds,
  onToggleSelectStudent,
  onToggleSelectAll,
  onOpenProfile,
  onOpenEdit,
  onOpenMessage,
  onOpenDigitalId,
  onOpenQRCode,
  onRequestRemove,
}) => {
  const allSelected = students.length > 0 && selectedStudentIds.length === students.length;
  const isIndeterminate = selectedStudentIds.length > 0 && selectedStudentIds.length < students.length;

  const getHouseColor = (house?: string) => {
    switch (house) {
      case 'Agni':
        return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'Surya':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Prithvi':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Vayu':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Trishul':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  const getAcademicBadge = (status?: string, avg?: number) => {
    switch (status) {
      case 'Distinction':
        return { label: 'Distinction', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200' };
      case 'Excellent':
        return { label: 'Excellent', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200' };
      case 'Good':
        return { label: 'Good', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200' };
      case 'Needs Support':
        return { label: 'Needs Support', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200' };
      default:
        return { label: 'Average', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200' };
    }
  };

  const getAttendanceColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500';
    if (pct >= 75) return 'text-amber-600 dark:text-amber-400 bg-amber-500';
    return 'text-rose-600 dark:text-rose-400 bg-rose-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                />
              </th>
              <th className="py-3 px-3">Student</th>
              <th className="py-3 px-3">ID / Roll</th>
              <th className="py-3 px-3">Class & House</th>
              <th className="py-3 px-3">Attendance %</th>
              <th className="py-3 px-3">Academics</th>
              <th className="py-3 px-3">Transport</th>
              <th className="py-3 px-3">Fee Status</th>
              <th className="py-3 px-3">Library</th>
              <th className="py-3 px-3">Alerts</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
            {students.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">No students added yet.</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Use the "Enroll Student" button above to add real student records or adjust your search filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const acad = getAcademicBadge(student.academicStatus, student.academicAverage);
                const hasAlerts = (student.smartAlerts && student.smartAlerts.length > 0) || student.attendancePercentage < 75 || student.feeStatus === 'Overdue';

                return (
                  <tr
                    key={student.id}
                    id={`student-row-${student.id}`}
                    className={`transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                      isSelected ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectStudent(student.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                      />
                    </td>

                    {/* Student Basic */}
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => onOpenProfile(student)}
                        className="flex items-center gap-2.5 text-left group cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                            alt={student.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                              student.todayStatus === 'present'
                                ? 'bg-emerald-500'
                                : student.todayStatus === 'late'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            title={`Today: ${student.todayStatus}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{student.name}</span>
                            {student.isNewAdmission && (
                              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 shrink-0">
                                NEW
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {student.admissionNo || 'ADM-2024-001'} • {student.guardianName || student.fatherName || 'Guardian'}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* ID & Roll */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {student.id}
                      </span>
                      <p className="text-[10px] text-slate-400">Roll #{student.rollNo || '-'}</p>
                    </td>

                    {/* Class & House */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          Class {student.className}
                        </span>
                        {student.house && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${getHouseColor(student.house)} w-fit`}>
                            {student.house}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Attendance % */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="w-24">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold ${getAttendanceColor(student.attendancePercentage).split(' ')[0]}`}>
                            {student.attendancePercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {student.todayStatus}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getAttendanceColor(student.attendancePercentage).split(' ')[1]}`}
                            style={{ width: `${Math.min(student.attendancePercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Academics */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${acad.color}`}>
                        {acad.label}
                      </span>
                      {student.academicAverage && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Avg: {student.academicAverage}% {student.academicRank ? `(Rank #${student.academicRank})` : ''}
                        </p>
                      )}
                    </td>

                    {/* Transport */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">
                            {student.transportDetails?.busNumber || student.transportRoute || 'Walker'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                            {student.transportDetails?.stopName || 'Self Pickup'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Fee Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.feeStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : student.feeStatus === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          student.feeStatus === 'Paid' ? 'bg-emerald-500' : student.feeStatus === 'Overdue' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        {student.feeStatus || 'Paid'}
                      </span>
                    </td>

                    {/* Library */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {student.libraryDetails?.overdueCount && student.libraryDetails.overdueCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{student.libraryDetails.overdueCount} Overdue</span>
                        </span>
                      ) : student.libraryDetails?.activeIssuedCount && student.libraryDetails.activeIssuedCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                          <span>{student.libraryDetails.activeIssuedCount} Issued</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Clean</span>
                      )}
                    </td>

                    {/* Alerts */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {hasAlerts ? (
                        <div className="flex items-center gap-1">
                          {student.attendancePercentage < 75 && (
                            <span title="Low Attendance Alert (<75%)" className="p-1 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              <AlertTriangle className="w-3 h-3" />
                            </span>
                          )}
                          {student.feeStatus === 'Overdue' && (
                            <span title="Fee Overdue Alert" className="p-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                              ₹!
                            </span>
                          )}
                          {student.libraryDetails?.overdueCount && student.libraryDetails.overdueCount > 0 ? (
                            <span title="Library Book Overdue" className="p-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                              <BookOpen className="w-3 h-3" />
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenProfile(student)}
                          title="Open 360° Profile"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/60 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenDigitalId(student)}
                          title="Generate Student ID Card"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenQRCode(student)}
                          title="Generate / Scan QR Badge"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenMessage(student)}
                          title="Message Parent / Guardian"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenEdit(student)}
                          title="Edit Student Record"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-amber-950/60 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {onRequestRemove && (
                          <button
                            onClick={() => onRequestRemove(student)}
                            title="Remove Student from School Roster"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-300 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
