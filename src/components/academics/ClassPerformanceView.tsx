import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  UserCheck, 
  FileText,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { CLASS_ACADEMIC_DATA } from '../../data/academicData';
import { DETAILED_360_STUDENTS } from '../../data/student360Data';
import { Student } from '../../types';

interface ClassPerformanceViewProps {
  onSelectStudent: (student: Student) => void;
  onNavigateTab: (tabKey: string) => void;
}

export const ClassPerformanceView: React.FC<ClassPerformanceViewProps> = ({
  onSelectStudent,
  onNavigateTab
}) => {
  const [selectedClassName, setSelectedClassName] = useState<string>('10-A');

  const activeClass = CLASS_ACADEMIC_DATA.find(c => c.className === selectedClassName) || CLASS_ACADEMIC_DATA[4];

  // Get students enrolled in this class from the academy's real dataset
  const classStudents = DETAILED_360_STUDENTS.filter(s => s.className === selectedClassName);
  const displayStudents: Student[] = classStudents;

  return (
    <div className="space-y-6">
      {/* Class Selector Horizontal Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Class Section</span>
          <span className="text-xs text-slate-500">{CLASS_ACADEMIC_DATA.length} Active Sections (Class 10-A to 10-E)</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CLASS_ACADEMIC_DATA.map((c) => {
            const isSelected = c.className === selectedClassName;
            return (
              <button
                key={c.className}
                id={`btn-class-${c.className.replace('-', '')}`}
                onClick={() => setSelectedClassName(c.className)}
                className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                Class {c.className}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Class Dashboard Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs">
                Class {activeClass.className}
              </span>
              <span className="text-xs text-slate-500">Class Teacher: <strong className="text-slate-800 dark:text-slate-200">{activeClass.classTeacher}</strong></span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Class {activeClass.className} Academic Performance Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="class-enter-marks-btn"
              onClick={() => onNavigateTab('marks')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Enter Marks for {activeClass.className}</span>
            </button>
            <button
              id="class-report-cards-btn"
              onClick={() => onNavigateTab('reportcards')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
            >
              <span>View Report Cards</span>
            </button>
          </div>
        </div>

        {/* 6 Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Student Count</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeClass.studentCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Enrolled candidates</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Average Score</span>
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {activeClass.averageScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">School avg: 81.4%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Highest Score</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeClass.highestScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Class Topper</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Lowest Score</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeClass.lowestScore}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Support floor</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Attendance Rate</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeClass.attendanceRate}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Roll call rate</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Assignments</span>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeClass.assignmentsCompleted}%
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Completion rate</div>
          </div>
        </div>

        {/* Academic Trend Progression Pill */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">5-Assessment Score Progression:</span>
            <div className="flex items-center gap-1.5">
              {activeClass.trend.map((score, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  T{idx + 1}: {score}%
                </span>
              ))}
            </div>
          </div>

          {activeClass.studentsNeedingAttention > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {activeClass.studentsNeedingAttention} students needing academic attention
              </span>
              <button
                id="btn-filter-attention-class"
                onClick={() => onNavigateTab('attention')}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Review List →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Class Students Roster & Academic Standing */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Students Roster — Class {activeClass.className}
            </h3>
            <p className="text-xs text-slate-500">
              Click any student to view their connected Academic 360° Profile
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {displayStudents.length} Students Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Academic Avg</th>
                <th className="py-3 px-4">Academic Standing</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records found for Class {selectedClassName}.
                  </td>
                </tr>
              ) : (
                displayStudents.map((stu) => {
                const avg = stu.academicAverage || 80;
                const status = avg >= 90 ? 'Distinction (A1)' : avg >= 75 ? 'First Class (A2-B1)' : avg >= 60 ? 'Average' : 'Needs Support';
                return (
                  <tr 
                    key={stu.id}
                    onClick={() => onSelectStudent(stu)}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-400">
                      #{stu.rollNo || 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 group-hover:text-blue-600">
                        <span>{stu.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-slate-400">ID: {stu.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {stu.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {avg}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        avg >= 90 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                          : avg >= 75 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' 
                          : avg >= 60 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <div>{stu.guardianName}</div>
                      <div className="text-[10px] text-slate-400">{stu.guardianPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs font-bold text-blue-600 group-hover:underline inline-flex items-center gap-0.5">
                        Profile <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
