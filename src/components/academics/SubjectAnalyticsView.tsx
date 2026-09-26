import React, { useState } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Award, 
  AlertCircle, 
  User, 
  Calendar,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { SUBJECT_ANALYTICS_DATA } from '../../data/academicData';
import { AcademicSubjectStat } from '../../types';

interface SubjectAnalyticsViewProps {
  onSelectSubject?: (subjectId: string) => void;
  onNavigateTab: (tabKey: string) => void;
}

export const SubjectAnalyticsView: React.FC<SubjectAnalyticsViewProps> = ({
  onSelectSubject,
  onNavigateTab
}) => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = ['all', 'Science', 'Mathematics', 'English', 'Social Studies', 'Hindi', 'Computer Science & AI', 'Commerce', 'Arts & Physical Ed'];

  const filteredSubjects = SUBJECT_ANALYTICS_DATA.filter((sub) => {
    const matchesDept = departmentFilter === 'all' || sub.department === departmentFilter;
    const matchesSearch = sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Department Filters Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="search-subject-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject, code or teacher..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {dept === 'all' ? 'All Departments (11)' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSubjects.map((sub: AcademicSubjectStat) => {
          const isHigh = sub.averageScore >= 85;
          const isAttention = sub.averageScore < 80;

          return (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Title & Code */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      {sub.code} • {sub.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {sub.subject}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {sub.trend === 'up' && (
                      <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" title="Performance Trending Up">
                        <TrendingUp className="w-4 h-4" />
                      </span>
                    )}
                    {sub.trend === 'down' && (
                      <span className="p-1 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400" title="Performance Declining">
                        <TrendingDown className="w-4 h-4" />
                      </span>
                    )}
                    {sub.trend === 'stable' && (
                      <span className="p-1 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800" title="Performance Stable">
                        <Minus className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Score Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500">Average</div>
                    <div className={`text-lg font-black mt-0.5 ${
                      isHigh ? 'text-emerald-600 dark:text-emerald-400' : isAttention ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {sub.averageScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Highest</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {sub.highestScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Pass Rate</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">
                      {sub.passPercentage}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Performance Index</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.averageScore} / 100</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isHigh ? 'bg-emerald-500' : isAttention ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${sub.averageScore}%` }}
                    />
                  </div>
                </div>

                {/* Subject Details */}
                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Faculty In-Charge:</span>
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{sub.teacherName}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Homework Submissions:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.assignmentCompletion}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Students Below Target (&lt;60%):</span>
                    <span className={`font-bold ${sub.studentsBelowTarget > 15 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {sub.studentsBelowTarget} students
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Recent assessment */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Recent: {sub.recentAssessment}</span>
                </div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    id={`btn-subject-marks-${sub.id}`}
                    onClick={() => onNavigateTab('marks')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    View Marks Table →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
