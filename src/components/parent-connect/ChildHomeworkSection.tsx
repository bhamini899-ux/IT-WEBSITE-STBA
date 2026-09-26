import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  FileText, 
  BookOpen, 
  Calendar,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { ChildHomeworkItem, ChildProfile } from '../../types/parentConnect';

interface ChildHomeworkSectionProps {
  child: ChildProfile;
  homeworkList: ChildHomeworkItem[];
  onToggleHomeworkStatus: (homeworkId: string) => void;
}

export const ChildHomeworkSection: React.FC<ChildHomeworkSectionProps> = ({
  child,
  homeworkList,
  onToggleHomeworkStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const childHomework = homeworkList.filter(h => h.childId === child.id);
  const pendingCount = childHomework.filter(h => !h.completed).length;
  const completedCount = childHomework.filter(h => h.completed).length;

  const subjects = ['all', ...Array.from(new Set(childHomework.map(h => h.subject)))];

  const filteredItems = childHomework.filter(h => {
    if (filter === 'pending' && h.completed) return false;
    if (filter === 'completed' && !h.completed) return false;
    if (selectedSubject !== 'all' && h.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Assignments & Homework
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Class {child.className}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily assignments, teacher guidelines, due dates, and mark student submissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
              Pending
            </span>
            <span className="text-lg font-extrabold text-amber-800 dark:text-amber-200">
              {pendingCount}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
              Completed
            </span>
            <span className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">
              {completedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Subject Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({childHomework.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'pending' 
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-2xs font-bold' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'completed' 
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs font-bold' 
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Subject Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-xs hidden sm:inline">Subject:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium"
          >
            {subjects.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Subjects' : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Assignments in this Category
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              All tasks for this filter have been addressed.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.completed
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-85'
                  : 'bg-white dark:bg-slate-900 border-blue-100 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left Content */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {item.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Assigned by {item.teacherName}
                    </span>
                    {item.completed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <Clock className="w-3 h-3" /> Pending Submission
                      </span>
                    )}
                  </div>

                  <h4 className={`text-base font-bold text-slate-900 dark:text-white ${item.completed ? 'line-through text-slate-500' : ''}`}>
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {item.teacherRemarks && (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white font-semibold">Teacher Remark: </strong>
                      <span>{item.teacherRemarks}</span>
                    </div>
                  )}

                  {/* Dates & Attachment bar */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Assigned: {item.assignedDate}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                      <Clock className="w-3.5 h-3.5" />
                      Due Date: {item.dueDate}
                    </span>
                    {item.attachmentName && (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
                        <FileText className="w-3.5 h-3.5" />
                        {item.attachmentName}
                      </span>
                    )}
                    {item.completedAt && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Finished on {item.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Interactive Toggle Button */}
                <div className="shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => onToggleHomeworkStatus(item.id)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                      item.completed
                        ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    {item.completed ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Mark as Pending</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
