import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  UserX,
  ChevronRight,
  Send
} from 'lucide-react';
import { SubstitutionRecord, SubstitutionRecommendation, Teacher, TimetableSlot } from '../../types';

interface SubstitutionCenterProps {
  substitutions: SubstitutionRecord[];
  teachers: Teacher[];
  onAssignSubstitute: (substitutionId: string, teacherId: string, teacherName: string) => void;
  onOpenTimetableSlot?: (slotId: string) => void;
}

export const SubstitutionCenter: React.FC<SubstitutionCenterProps> = ({
  substitutions,
  teachers,
  onAssignSubstitute,
  onOpenTimetableSlot
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(substitutions[0]?.id || '');
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  const selectedSub = substitutions.find(s => s.id === selectedSubId) || substitutions[0];
  const pendingCount = substitutions.filter(s => s.status === 'Pending').length;
  const assignedCount = substitutions.filter(s => s.status === 'Assigned').length;

  const handleAssign = (subId: string, rec: SubstitutionRecommendation) => {
    onAssignSubstitute(subId, rec.teacherId, rec.teacherName);
    setNotifiedId(rec.teacherId);
    setTimeout(() => setNotifiedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md border border-blue-800/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Automated Substitution Center
            </span>
            <span className="text-xs text-blue-200/80">Seth Tolaram Bafna Academy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
            Live Period Coverage & Substitution Engine
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl">
            Detects faculty absences and automatically pairs affected classes with qualified, free teachers balanced by weekly workload.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
            <p className="text-xs text-blue-200">Pending</p>
            <p className="text-2xl font-black text-rose-300 mt-0.5">{pendingCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center">
            <p className="text-xs text-blue-200">Covered</p>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">{assignedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Affected Periods List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-500" />
              Affected Periods Today ({substitutions.length})
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Today: Monday</span>
          </div>

          <div className="space-y-2.5">
            {substitutions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              const isPending = sub.status === 'Pending';

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold text-xs">
                          Class {sub.className}
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Period {sub.periodNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">({sub.timeRange})</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1.5">
                        {sub.subject} • {sub.room}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Absent: <span className="font-semibold text-rose-600 dark:text-rose-400">{sub.absentTeacherName}</span> ({sub.reason})
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                      isPending
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>

                  {sub.assignedTeacherName && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Assigned: <strong>{sub.assignedTeacherName}</strong>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">{sub.assignedAt || 'Covered'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Recommendations & Assignment Box */}
        <div className="lg:col-span-7">
          {selectedSub ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold text-xs">
                      {selectedSub.className}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Period {selectedSub.periodNumber} ({selectedSub.subject})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Room: {selectedSub.room} • Absent: <strong>{selectedSub.absentTeacherName}</strong> ({selectedSub.reason})
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedSub.status === 'Pending'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {selectedSub.status}
                </span>
              </div>

              {notifiedId && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Substitute assigned & notified! In-app notice & SMS sent to teacher mobile.</span>
                </div>
              )}

              {/* AI Recommendation Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Ranked Substitute Candidates (AI Optimized)
                  </h4>
                  <span className="text-[11px] text-slate-500">Free during Period {selectedSub.periodNumber}</span>
                </div>

                {selectedSub.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSub.recommendations.map((rec, index) => {
                      const isAssigned = selectedSub.assignedTeacherId === rec.teacherId;

                      return (
                        <div
                          key={rec.teacherId}
                          className={`p-4 rounded-xl border transition-all ${
                            isAssigned
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-500/20'
                              : index === 0
                                ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                                  index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {index + 1}
                                </span>
                                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {rec.teacherName}
                                </h5>
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                  ({rec.department})
                                </span>
                                {index === 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                                    Best Match
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                                {rec.reasoning}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                                <span className="font-semibold text-emerald-600">✓ Free Period {selectedSub.periodNumber}</span>
                                <span>• Workload: <strong>{rec.currentWorkload}/28 periods</strong></span>
                                {rec.familiarWithClass && <span className="text-blue-600">• Teaches {selectedSub.className}</span>}
                              </div>
                            </div>

                            <div className="shrink-0 sm:self-center">
                              {isAssigned ? (
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" /> Assigned
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleAssign(selectedSub.id, rec)}
                                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                                >
                                  <span>Assign Substitute</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No immediate free subject teacher found. Select from the general faculty pool.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select an affected period to view candidate teachers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
