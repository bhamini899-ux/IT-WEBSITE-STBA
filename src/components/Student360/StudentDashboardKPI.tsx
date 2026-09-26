import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  CalendarClock, 
  AlertTriangle, 
  ClipboardList,
  Plus, 
  Upload, 
  Download, 
  IdCard, 
  QrCode, 
  SlidersHorizontal,
  BarChart3,
  Bot
} from 'lucide-react';
import { Student } from '../../types';

interface StudentDashboardKPIProps {
  students?: Student[];
  onOpenAddStudent: () => void;
  onOpenBulkActions: () => void;
  onOpenAnalytics: () => void;
  onOpenAICopilot: () => void;
  onExport: () => void;
  onImport: () => void;
  onFilterByStatus: (filterType: string) => void;
  activeFilterBadge?: string;
  totalLoaded: number;
}

export const StudentDashboardKPI: React.FC<StudentDashboardKPIProps> = ({
  students = [],
  onOpenAddStudent,
  onOpenBulkActions,
  onOpenAnalytics,
  onOpenAICopilot,
  onExport,
  onImport,
  onFilterByStatus,
  activeFilterBadge,
  totalLoaded,
}) => {
  const totalCount = students.length > 0 ? students.length : totalLoaded;
  const activeCount = students.filter(s => s.status === 'Active' || !s.status).length;
  const newCount = students.filter(s => s.isNewAdmission).length;
  const leaveCount = students.filter(s => s.status === 'On Leave' || s.todayStatus === 'excused' || (s.todayStatus as string) === 'leave').length;
  const attentionCount = students.filter(s => (s.attendancePercentage || 100) < 75).length;
  const pendingActionsCount = students.filter(s => (s.smartAlerts && s.smartAlerts.length > 0) || s.feeStatus === 'Overdue').length;

  const kpis = [
    {
      id: 'total',
      label: 'Total Students',
      value: totalCount.toString(),
      subtext: `${totalCount} Enrolled in System`,
      badge: `${totalCount} Registered`,
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/60',
      filterKey: 'all',
    },
    {
      id: 'active',
      label: 'Active Students',
      value: activeCount.toString(),
      subtext: totalCount > 0 ? `${((activeCount / totalCount) * 100).toFixed(1)}% active enrollment` : '0% active',
      badge: 'Normal Status',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/60',
      filterKey: 'Active',
    },
    {
      id: 'new_admissions',
      label: 'New Admissions',
      value: newCount.toString(),
      subtext: 'Current academic session',
      badge: newCount > 0 ? 'Verified' : 'None',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      icon: UserPlus,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/60',
      filterKey: 'new_admissions',
    },
    {
      id: 'leave',
      label: 'Students on Leave',
      value: leaveCount.toString(),
      subtext: 'Sanctioned & medical leaves',
      badge: `${leaveCount} Active`,
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: CalendarClock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/60',
      filterKey: 'On Leave',
    },
    {
      id: 'attention',
      label: 'Attendance Attention',
      value: attentionCount.toString(),
      subtext: '< 75% CBSE threshold',
      badge: attentionCount > 0 ? 'Risk Flag' : 'Clear',
      badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: AlertTriangle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900/60',
      filterKey: 'attendance_attention',
    },
    {
      id: 'pending_actions',
      label: 'Pending Actions',
      value: pendingActionsCount.toString(),
      subtext: 'Fees & system alerts',
      badge: pendingActionsCount > 0 ? 'Needs Review' : 'Up to Date',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      icon: ClipboardList,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-100 dark:border-purple-900/60',
      filterKey: 'pending_actions',
    },
  ];

  return (
    <div className="space-y-4">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isSelected = activeFilterBadge === kpi.filterKey;
          return (
            <button
              key={kpi.id}
              onClick={() => onFilterByStatus(kpi.filterKey)}
              className={`p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border relative overflow-hidden group ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 ring-2 ring-blue-600 dark:ring-blue-400 shadow-md'
                  : 'bg-white dark:bg-slate-900/90 hover:shadow-md hover:-translate-y-0.5 shadow-xs'
              } ${kpi.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
                {kpi.value}
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {kpi.label}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {kpi.subtext}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Action Strip */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <button
            id="student-add-btn"
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <button
            id="student-bulk-btn"
            onClick={onOpenBulkActions}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Bulk Operations</span>
          </button>

          <button
            id="student-analytics-btn"
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Analytics Visualizer</span>
          </button>

          <button
            id="student-copilot-btn"
            onClick={onOpenAICopilot}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Student Copilot</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="student-import-btn"
            onClick={onImport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            title="Import Students CSV"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            id="student-export-btn"
            onClick={onExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            title="Export Student Directory"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};
