import React from 'react';
import { X, Printer, Download, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ReportCardItem } from '../../types';

interface ReportCardPreviewModalProps {
  reportCard: ReportCardItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishSingle?: (reportId: string) => void;
}

export const ReportCardPreviewModal: React.FC<ReportCardPreviewModalProps> = ({
  reportCard,
  isOpen,
  onClose,
  onPublishSingle
}) => {
  if (!isOpen || !reportCard) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Top Control Bar (Do not print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Official CBSE Format Preview
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              reportCard.status === 'Published'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {reportCard.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Report Card Document */}
        <div className="p-8 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white text-slate-900 shadow-xs space-y-6">
          {/* Header Banner */}
          <div className="text-center pb-4 border-b-2 border-blue-900">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 text-amber-400 mb-2 font-black text-xl shadow-xs">
              STB
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-blue-950">
              Seth Tolaram Bafna Academy
            </h1>
            <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
              Affiliated to CBSE, New Delhi (Affiliation No: 1730248) • Bikaner, Rajasthan
            </p>
            <div className="inline-block mt-2 px-4 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-blue-900 uppercase tracking-wider">
              Academic Performance Report • Session 2026-2027
            </div>
          </div>

          {/* Student Bio Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-bold block">Student Name:</span>
              <span className="font-black text-slate-900 text-sm">{reportCard.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">Class & Section:</span>
              <span className="font-black text-slate-900 text-sm">Class {reportCard.className}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">Roll Number:</span>
              <span className="font-black text-slate-900 text-sm">#{reportCard.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block">Admission No:</span>
              <span className="font-semibold text-slate-900 text-sm">{reportCard.studentId}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-bold block">Father / Guardian Name:</span>
              <span className="font-semibold text-slate-900">{reportCard.guardianName || 'Guardian Record'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 font-bold block">Class Teacher:</span>
              <span className="font-semibold text-slate-900">Dr. Rajesh Verma, M.Sc., B.Ed.</span>
            </div>
          </div>

          {/* Scholastic Marks & Grades Table */}
          <div>
            <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider mb-2">
              Part 1: Scholastic Performance
            </h4>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-blue-900 text-white font-bold text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3 border border-blue-950">Subject Code & Name</th>
                  <th className="py-2.5 px-3 border border-blue-950 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 border border-blue-950 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 border border-blue-950 text-center">Percentage</th>
                  <th className="py-2.5 px-3 border border-blue-950 text-center">CBSE Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(reportCard.scholasticScores || reportCard.subjects || []).map((sub: any, idx: number) => {
                  const marks = sub.marks ?? sub.marksObtained ?? 0;
                  const maxMarks = sub.maxMarks || 100;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-2 px-3 border border-slate-300 font-bold text-slate-800">{sub.subject}</td>
                      <td className="py-2 px-3 border border-slate-300 text-center text-slate-600">{maxMarks}</td>
                      <td className="py-2 px-3 border border-slate-300 text-center font-black text-slate-900">{marks}</td>
                      <td className="py-2 px-3 border border-slate-300 text-center font-semibold text-slate-800">
                        {Math.round((marks / maxMarks) * 100)}%
                      </td>
                      <td className="py-2 px-3 border border-slate-300 text-center font-black text-blue-900">{sub.grade}</td>
                    </tr>
                  );
                })}
                {/* Total Row */}
                <tr className="bg-blue-50 font-black text-slate-900 border-t-2 border-blue-900">
                  <td className="py-2.5 px-3 border border-slate-300 uppercase">Grand Cumulative Total</td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    {(reportCard.scholasticScores || reportCard.subjects || []).reduce((sum: number, s: any) => sum + (s.maxMarks || 100), 0)}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-blue-900 text-sm">
                    {(reportCard.scholasticScores || reportCard.subjects || []).reduce((sum: number, s: any) => sum + (s.marks ?? s.marksObtained ?? 0), 0)}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-sm">
                    {reportCard.overallPercentage ?? reportCard.percentage}%
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-emerald-700 text-sm">
                    {reportCard.grade ?? reportCard.academicStatus}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Co-Scholastic & Attendance */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-blue-950 uppercase text-[11px] block mb-1">
                Attendance Record
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{reportCard.attendancePercentage}%</span>
                <span className="text-slate-500 text-[11px] font-medium">({reportCard.daysPresent} of {reportCard.totalWorkingDays} school days attended)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-blue-950 uppercase text-[11px] block mb-1">
                Co-Scholastic & Discipline
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-700">Discipline: A</span>
                <span>•</span>
                <span className="font-bold text-emerald-700">Work Education: A</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-blue-950 block mb-1">Class Teacher Remarks:</span>
            <p className="text-slate-700 italic leading-relaxed">
              "{reportCard.teacherRemarks || reportCard.remarks}"
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2 font-semibold text-slate-700">
              Class Teacher Signature
            </div>
            <div className="flex flex-col items-center justify-center -mt-4">
              <div className="w-14 h-14 rounded-full border-2 border-blue-900/30 flex items-center justify-center text-[10px] text-blue-900 font-bold uppercase rotate-12">
                Academy Seal
              </div>
            </div>
            <div className="border-t border-slate-400 pt-2 font-semibold text-slate-700">
              Principal Signature & Seal
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            Certified document issued by Seth Tolaram Bafna Academy Examination Board
          </span>
          <div className="flex items-center gap-2">
            {reportCard.status !== 'Published' && onPublishSingle && (
              <button
                onClick={() => onPublishSingle(reportCard.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish to Parent Portal</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
