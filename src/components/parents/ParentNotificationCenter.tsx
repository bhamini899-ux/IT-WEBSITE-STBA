import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Filter, 
  UserCheck, 
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ParentGuardianRecord, NotificationCategory } from '../../types';
import { NOTIFICATION_CATEGORIES_CONFIG } from '../../data/parentData';
import { NotificationPreviewPanel } from './NotificationPreviewPanel';

interface ParentNotificationCenterProps {
  parents: ParentGuardianRecord[];
  onDispatchedNotification: (data: {
    parent: ParentGuardianRecord;
    category: NotificationCategory;
    subject: string;
    message: string;
    channel: string;
  }) => void;
  onSelectParentForInspection: (parent: ParentGuardianRecord) => void;
}

export const ParentNotificationCenter: React.FC<ParentNotificationCenterProps> = ({
  parents,
  onDispatchedNotification,
  onSelectParentForInspection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('ATTENDANCE');
  const [selectedTargetParent, setSelectedTargetParent] = useState<ParentGuardianRecord | null>(null);

  // Compute targeted parents who would receive the selected notification category
  const categoryRecipients = useMemo(() => {
    switch (selectedCategory) {
      case 'ATTENDANCE':
        // Students absent or late today, or with attendance < 80%
        return parents.filter(p => p.todayAttendance === 'absent' || p.todayAttendance === 'late' || p.attendanceRate < 80);
      case 'FEES':
        // Parents with pending or overdue fees
        return parents.filter(p => p.feeStatus === 'Overdue' || p.feePendingAmount > 0);
      case 'BUS':
        // Students using school transport
        return parents.filter(p => p.transportRoute.includes('Route'));
      case 'EXAMS':
        // Senior and secondary classes
        return parents.filter(p => ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'].includes(p.className));
      case 'EVENTS':
        // Parents with pending PTM confirmation
        return parents.filter(p => p.ptmStatus === 'Pending' || p.ptmStatus === 'Confirmed');
      case 'ACADEMICS':
        // All parents
        return parents;
      case 'ENTRY':
      case 'EXIT':
      case 'ANNOUNCEMENTS':
      default:
        return parents;
    }
  }, [parents, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Category Selection Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Parent Notification Center</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any category to review targeted guardians, preview communication templates, and dispatch notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50">
              {categoryRecipients.length} Targeted Recipients
            </span>
          </div>
        </div>

        {/* Categories Grid (9 Major Categories) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {NOTIFICATION_CATEGORIES_CONFIG.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedTargetParent(null);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{cat.emoji}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                </div>
                <div className="mt-2">
                  <p className={`text-xs font-bold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {cat.id === 'ATTENDANCE' ? 'Roll call alerts' : cat.id === 'ENTRY' ? 'RFID gate check-in' : cat.id === 'BUS' ? 'Fleet updates' : 'School notice'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Workspace: Recipient List & Notification Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Targeted Guardians List (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col max-h-[640px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Targeted Guardians
              </h3>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                {categoryRecipients.length} Parents for {selectedCategory}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              Auto-filtered
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 mt-2 pr-1 space-y-1">
            {categoryRecipients.map((p) => {
              const isSelected = selectedTargetParent?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedTargetParent(p)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.studentPhotoUrl}
                      alt={p.linkedStudentName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {p.primaryContactName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {p.linkedStudentName} • <span className="font-semibold text-blue-600">{p.className}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.preferredChannel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Notification Preview & Dispatch Panel (8 Cols) */}
        <div className="lg:col-span-8">
          <NotificationPreviewPanel
            selectedCategory={selectedCategory}
            selectedParent={selectedTargetParent}
            allParents={categoryRecipients.length > 0 ? categoryRecipients : parents}
            onDispatchedSuccess={onDispatchedNotification}
          />
        </div>
      </div>
    </div>
  );
};
