import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  School, 
  Users,
  Filter
} from 'lucide-react';
import { SmartAttendanceStudent, ClassAttendanceDetail } from '../../data/attendanceData';

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: SmartAttendanceStudent[];
  classes: ClassAttendanceDetail[];
}

export const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({
  isOpen,
  onClose,
  students,
  classes,
}) => {
  const [reportType, setReportType] = useState<'daily' | 'classes' | 'students' | 'low'>('daily');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = students.length;
  const present = students.filter(s => s.todayStatus === 'present').length;
  const absent = students.filter(s => s.todayStatus === 'absent').length;
  const late = students.filter(s => s.todayStatus === 'late').length;
  const rate = total > 0 ? (present / total) * 100 : 94.8;
  const lowAttendanceList = students.filter(s => s.attendancePercentage < 75);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'daily' || reportType === 'students') {
      csvContent += 'Admission No,Student Name,Class,Roll No,Status,Check In Time,Term Attendance %,Guardian Name,Guardian Phone\r\n';
      students.forEach(s => {
        csvContent += `"${s.admissionNo}","${s.name}","${s.className}",${s.rollNo},"${s.todayStatus}","${s.checkInTime}",${s.attendancePercentage.toFixed(1)},"${s.guardianName}","${s.guardianPhone}"\r\n`;
      });
    } else if (reportType === 'classes') {
      csvContent += 'Class,Section,Class Teacher,Total Students,Present,Absent,Late,Attendance Rate %\r\n';
      classes.forEach(c => {
        csvContent += `"${c.className}","${c.section}","${c.classTeacher}",${c.totalStudents},${c.present},${c.absent},${c.late},${c.attendanceRate.toFixed(1)}\r\n`;
      });
    } else if (reportType === 'low') {
      csvContent += 'Admission No,Student Name,Class,Roll No,Term Attendance %,Days Missed,Guardian Phone,Reason\r\n';
      lowAttendanceList.forEach(s => {
        csvContent += `"${s.admissionNo}","${s.name}","${s.className}",${s.rollNo},${s.attendancePercentage.toFixed(1)},${s.absentDays},"${s.guardianPhone}","${s.attentionReason || 'Below 75% threshold'}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `STBA_Attendance_${reportType.toUpperCase()}_17Sep2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Report exported as STBA_Attendance_${reportType.toUpperCase()}_17Sep2026.csv`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Official Attendance Report Generator
              </h3>
              <p className="text-xs text-slate-500">
                Generate, preview, print, or export institutional attendance summaries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Type Selector Pills */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Report Format:
          </span>
          <button
            onClick={() => setReportType('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'daily'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Daily Roll Call Summary
          </button>
          <button
            onClick={() => setReportType('classes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'classes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            14-Class Comparison
          </button>
          <button
            onClick={() => setReportType('students')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'students'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Complete Student Register
          </button>
          <button
            onClick={() => setReportType('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === 'low'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Critical Shortage (&lt;75%)
          </button>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Formatted Report Preview (Document style) */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 font-sans">
          {/* Institution Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
              Seth Tolaram Bafna Academy
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              CBSE Affiliated Senior Secondary School • Nokha Road, Bikaner, Rajasthan
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-700 pt-2">
              <span>Date: 17 September 2026</span>
              <span>•</span>
              <span className="uppercase">{reportType} Attendance Record</span>
              <span>•</span>
              <span>Academic Year 2026-27</span>
            </div>
          </div>

          {/* Quick Metrics Summary Banner */}
          <div className="grid grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Enrolled</span>
              <span className="text-base sm:text-lg font-black text-slate-900">{total}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Present Today</span>
              <span className="text-base sm:text-lg font-black text-emerald-700">{present}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Absent Today</span>
              <span className="text-base sm:text-lg font-black text-rose-700">{absent}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Rate</span>
              <span className="text-base sm:text-lg font-black text-blue-700">{rate.toFixed(1)}%</span>
            </div>
          </div>

          {/* Report Specific Table View */}
          {reportType === 'daily' && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Today's Absentee & Late Roster (Parent Contact Log)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Roll</th>
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Class</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Guardian Phone</th>
                      <th className="p-2.5">Notification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.filter(s => s.todayStatus !== 'present').map(s => (
                      <tr key={s.id}>
                        <td className="p-2.5 font-mono font-bold">#{s.rollNo}</td>
                        <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2.5">{s.className}</td>
                        <td className="p-2.5 font-bold uppercase">
                          <span className={s.todayStatus === 'absent' ? 'text-rose-600' : 'text-amber-600'}>
                            {s.todayStatus}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono">{s.guardianPhone}</td>
                        <td className="p-2.5 text-emerald-700 font-semibold">SMS Transmitted</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'classes' && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Class-Wise Summary Across 14 Sections
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Class</th>
                      <th className="p-2.5">Teacher</th>
                      <th className="p-2.5 text-right">Students</th>
                      <th className="p-2.5 text-right text-emerald-600">Present</th>
                      <th className="p-2.5 text-right text-rose-600">Absent</th>
                      <th className="p-2.5 text-right">Rate %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classes.map(c => (
                      <tr key={c.className}>
                        <td className="p-2.5 font-bold text-slate-900">Class {c.className}</td>
                        <td className="p-2.5 text-slate-600">{c.classTeacher}</td>
                        <td className="p-2.5 text-right">{c.totalStudents}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-600">{c.present}</td>
                        <td className="p-2.5 text-right font-bold text-rose-600">{c.absent}</td>
                        <td className="p-2.5 text-right font-black">{c.attendanceRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'low' && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                Students With Attendance Below CBSE 75% Threshold ({lowAttendanceList.length} Students)
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-rose-50 font-bold text-rose-900">
                    <tr>
                      <th className="p-2.5">Roll</th>
                      <th className="p-2.5">Student</th>
                      <th className="p-2.5">Class</th>
                      <th className="p-2.5 text-right">Attendance %</th>
                      <th className="p-2.5 text-right">Days Missed</th>
                      <th className="p-2.5">Guardian Phone</th>
                      <th className="p-2.5">Action Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowAttendanceList.map(s => (
                      <tr key={s.id}>
                        <td className="p-2.5 font-mono">#{s.rollNo}</td>
                        <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                        <td className="p-2.5">{s.className}</td>
                        <td className="p-2.5 text-right font-extrabold text-rose-600">
                          {s.attendancePercentage.toFixed(1)}%
                        </td>
                        <td className="p-2.5 text-right font-bold">{s.absentDays}</td>
                        <td className="p-2.5 font-mono">{s.guardianPhone}</td>
                        <td className="p-2.5 text-amber-800 font-semibold">Counseling Required</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Signature Block */}
          <div className="pt-8 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
            <div className="text-center">
              <div className="w-36 border-b border-slate-300 pb-1 font-bold text-slate-700">
                Dr. Alok Nath Tripathy
              </div>
              <span className="text-[10px] mt-0.5 block">Attendance Officer</span>
            </div>

            <div className="text-center">
              <div className="w-36 border-b border-slate-300 pb-1 font-bold text-slate-700">
                Mr. Ravindra S. Bafna
              </div>
              <span className="text-[10px] mt-0.5 block">Principal / Headmaster</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Preview</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
