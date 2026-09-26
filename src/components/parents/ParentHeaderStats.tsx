import React from 'react';
import { 
  Users, 
  UserCheck, 
  Send, 
  AlertCircle, 
  MessageSquare, 
  CalendarCheck, 
  UserX, 
  Bus,
  ShieldCheck
} from 'lucide-react';
import { PARENT_360_STATS } from '../../data/parentData';

import { ParentGuardianRecord } from '../../types';

interface ParentHeaderStatsProps {
  onActionClick?: (actionCategory: string) => void;
  parents?: ParentGuardianRecord[];
}

export const ParentHeaderStats: React.FC<ParentHeaderStatsProps> = ({ onActionClick, parents }) => {
  const totalCount = parents ? parents.length : PARENT_360_STATS.totalParents;
  const activeCount = parents ? parents.filter(p => p.accountStatus === 'Active').length : PARENT_360_STATS.activeParents;

  const stats = [
    {
      id: 'total-parents',
      label: 'Linked Guardians',
      value: totalCount.toString(),
      subtext: 'Verified Class 10 guardians',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
    },
    {
      id: 'active-parents',
      label: 'Active Parents',
      value: activeCount.toString(),
      subtext: 'App & SMS connected',
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      id: 'notifs-today',
      label: 'Sent Today',
      value: PARENT_360_STATS.notificationsSentToday.toString(),
      subtext: 'Gate, Bus, Roll call updates',
      icon: Send,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50',
    },
    {
      id: 'pending-actions',
      label: 'Pending Actions',
      value: PARENT_360_STATS.pendingParentActions.toString(),
      subtext: 'RSVPs, acks & waivers',
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
      actionKey: 'pending',
    },
    {
      id: 'unread-messages',
      label: 'Unread Messages',
      value: PARENT_360_STATS.unreadMessages.toString(),
      subtext: 'Inbound guardian queries',
      icon: MessageSquare,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
    },
    {
      id: 'ptm-responses',
      label: 'PTM Responses',
      value: `${PARENT_360_STATS.ptmResponseRate}%`,
      subtext: `${PARENT_360_STATS.ptmConfirmedCount} of ${PARENT_360_STATS.ptmTotalInvites} confirmed`,
      icon: CalendarCheck,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50',
      actionKey: 'ptm',
    },
    {
      id: 'attendance-alerts',
      label: 'Attendance Alerts',
      value: PARENT_360_STATS.attendanceAlertsToday.toString(),
      subtext: 'Absence & late arrival alerts',
      icon: UserX,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50',
      actionKey: 'attendance',
    },
    {
      id: 'transport-alerts',
      label: 'Transport Alerts',
      value: PARENT_360_STATS.transportAlertsToday.toString(),
      subtext: 'Boarding & delay notices',
      icon: Bus,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/50',
      actionKey: 'transport',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Module Title Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Module 5
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" />
                Live Communication Hub
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Parent & Guardian 360°
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Connected parent communication, student updates, notifications, approvals and engagement — all in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Academy Session
              </p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2026–2027 • Term 1
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 8 Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={item.id}
              onClick={() => item.actionKey && onActionClick && onActionClick(item.actionKey)}
              className={`p-3 sm:p-3.5 rounded-xl border bg-white dark:bg-slate-900 transition-all ${item.bg} ${
                item.actionKey ? 'cursor-pointer hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {item.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
              </div>
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {item.value}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-1">
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
