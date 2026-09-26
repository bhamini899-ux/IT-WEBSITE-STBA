import React, { useState } from 'react';
import { 
  X, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  User, 
  FileText,
  UserCheck
} from 'lucide-react';
import { Student } from '../../types';

interface StudentAcademicProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onNotifyParent?: (student: Student) => void;
}

export const StudentAcademicProfileModal: React.FC<StudentAcademicProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onNotifyParent
}) => {
  const [notificationSent, setNotificationSent] = useState(false);

  if (!isOpen || !student) return null;

  const academicAvg = student.academicAverage || 84.5;
  const isDistinction = academicAvg >= 90;
  const isNeedsSupport = academicAvg < 60;

  const defaultScores = student.academicScores || [
    { subject: 'Mathematics', score: 88, maxScore: 100, grade: 'A2', remarks: 'Good analytical reasoning' },
    { subject: 'Science (Physics/Chem)', score: 84, maxScore: 100, grade: 'A2', remarks: 'Consistent practical records' },
    { subject: 'English Communicative', score: 91, maxScore: 100, grade: 'A1', remarks: 'Articulate expressive writing' },
    { subject: 'Social Science', score: 82, maxScore: 100, grade: 'B1', remarks: 'Detailed map work and answers' },
    { subject: 'Hindi Course A', score: 89, maxScore: 100, grade: 'A2', remarks: 'Command over language structure' },
    { subject: 'Information Technology', score: 94, maxScore: 100, grade: 'A1', remarks: 'High proficiency in algorithms' }
  ];

  const handleNotify = () => {
    setNotificationSent(true);
    onNotifyParent?.(student);
    setTimeout(() => setNotificationSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header Profile Info */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md overflow-hidden shrink-0">
              {student.photoUrl ? (
                <img 
                  src={student.photoUrl} 
                  alt={student.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{student.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {student.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs">
                  Class {student.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Roll No: #{student.rollNo || 1} • Admission: {student.admissionNo || 'ADM-2023-0104'} • House: {student.house || 'Agni'}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span>Guardian: <strong>{student.guardianName}</strong></span>
                <span>•</span>
                <span>{student.guardianPhone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Academic KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Avg</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {academicAvg}%
            </div>
            <span className={`text-[10px] font-bold ${isDistinction ? 'text-emerald-600' : isNeedsSupport ? 'text-rose-600' : 'text-blue-600'}`}>
              {student.academicStatus || (isDistinction ? 'Distinction' : isNeedsSupport ? 'Needs Support' : 'First Class')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {student.attendancePercentage}%
            </div>
            <span className="text-[10px] text-slate-500">Roll Call Record</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assignments</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              92%
            </div>
            <span className="text-[10px] text-slate-500">On-Time Submissions</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Academic Trend</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>+3.2%</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Ascending</span>
          </div>
        </div>

        {/* Subject-Wise Academic Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Subject Scores & Evaluation Breakdown
            </h4>
            <span className="text-xs text-slate-400">Term 1 Assessment</span>
          </div>

          <div className="space-y-2.5">
            {defaultScores.map((score, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">{score.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white">{score.score} / {score.maxScore}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {score.grade}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${score.score >= 85 ? 'bg-emerald-500' : score.score >= 70 ? 'bg-blue-600' : 'bg-amber-500'}`}
                    style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                  />
                </div>
                {score.remarks && (
                  <div className="text-[11px] text-slate-500 mt-1.5 italic">
                    Teacher remark: {score.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Examination History & Teacher Remarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Examination History (2026)
            </span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li className="flex justify-between">
                <span>Periodic Assessment 1:</span>
                <strong className="text-slate-900 dark:text-white">{academicAvg}% (Rank 2)</strong>
              </li>
              <li className="flex justify-between">
                <span>Unit Test 1 (July):</span>
                <strong className="text-slate-900 dark:text-white">{academicAvg - 2.5}%</strong>
              </li>
              <li className="flex justify-between">
                <span>Mid-Term (Upcoming):</span>
                <span className="text-blue-600 font-semibold">24 Sep 2026</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Class Teacher Remarks
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {student.name} shows exceptional scholarly aptitude, proactive classroom inquiry, and disciplined participation in academic competitions.
            </p>
          </div>
        </div>

        {/* Areas Requiring Attention */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong>Guidance Recommendation:</strong> Encourage practice in complex coordinate geometry and maintain regular homework submission log.
          </div>
        </div>

        {/* Action Footer: Connect to Parent 360° */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Synchronized with Student 360° and Parent 360° Portals
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleNotify}
              id="btn-notify-parent-academic"
              disabled={notificationSent}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                notificationSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
              }`}
            >
              {notificationSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Notified to Parent 360°!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Notify Parent</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
