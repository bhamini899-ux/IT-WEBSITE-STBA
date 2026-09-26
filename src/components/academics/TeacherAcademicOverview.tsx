import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Search,
  CheckCircle,
  AlertCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { TEACHER_ACADEMIC_ACTIVITY } from '../../data/academicData';

interface TeacherAcademicOverviewProps {
  onNavigateTab: (tabKey: string) => void;
}

export const TeacherAcademicOverview: React.FC<TeacherAcademicOverviewProps> = ({ onNavigateTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredTeachers = TEACHER_ACADEMIC_ACTIVITY.filter((t: any) => {
    const classList = (t.classesAssigned || t.classes || []) as string[];
    return (
      t.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classList.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Faculty Academic Activity Overview
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Connected with Faculty & Staff 360°
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track evaluation turnarounds, syllabus milestones, marks entry compliance and homework creation across teaching staff.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty or subject..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Teachers Academic Register Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Assigned Classes</th>
                <th className="py-3 px-4">Assignments</th>
                <th className="py-3 px-4">Assessments Done</th>
                <th className="py-3 px-4">Marks Pending</th>
                <th className="py-3 px-4">Avg Student Score</th>
                <th className="py-3 px-4">Syllabus Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTeachers.map((teacher: any) => (
                <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{teacher.teacherName}</div>
                    <div className="text-[10px] text-slate-400">ID: {teacher.teacherId}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {teacher.subject}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {((teacher.classesAssigned || teacher.classes || []) as string[]).map((cls) => (
                        <span key={cls} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {teacher.assignmentsCreated}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {teacher.assessmentsCompleted}
                  </td>
                  <td className="py-3 px-4">
                    {teacher.marksPending > 0 ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px]">
                        {teacher.marksPending} Pending
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Up to date
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {teacher.averageClassPerformance}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{teacher.syllabusProgress}%</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {teacher.syllabusStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigateTab('marks')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Review Marks →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
