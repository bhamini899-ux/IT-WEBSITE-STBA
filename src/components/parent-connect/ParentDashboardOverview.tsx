import React from 'react';
import { 
  LogIn, 
  LogOut, 
  Calendar, 
  BookOpen, 
  Bus, 
  Clock, 
  CreditCard, 
  Bell, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Phone,
  FileText,
  UserCheck
} from 'lucide-react';
import { 
  ChildProfile, 
  ParentConnectTab, 
  ChildHomeworkItem, 
  ParentConnectNotification, 
  DayTimetable, 
  ChildFeeSummary,
  SchoolEventItem
} from '../../types/parentConnect';

interface ParentDashboardOverviewProps {
  child: ChildProfile;
  timetable: DayTimetable;
  pendingHomework: ChildHomeworkItem[];
  recentNotifications: ParentConnectNotification[];
  feeSummary: ChildFeeSummary;
  upcomingEvents: SchoolEventItem[];
  onNavigateTab: (tab: ParentConnectTab) => void;
  onOpenReportCard: () => void;
}

export const ParentDashboardOverview: React.FC<ParentDashboardOverviewProps> = ({
  child,
  timetable,
  pendingHomework,
  recentNotifications,
  feeSummary,
  upcomingEvents,
  onNavigateTab,
  onOpenReportCard,
}) => {
  return (
    <div className="space-y-6">
      {/* Personalized Child Header Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={child.avatar}
                alt={child.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-blue-400/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {child.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Class {child.className}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-slate-800">
                  Roll #{child.rollNo}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Seth Tolaram Bafna Academy • Admission ID: <span className="font-mono text-slate-300">{child.admissionNo}</span>
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                <span>Class Teacher: <strong className="text-white">{child.classTeacher}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {child.todayStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics in Hero */}
          <div className="flex items-center gap-3 sm:gap-4 bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Attendance
              </span>
              <span className="text-xl font-extrabold text-emerald-400">
                {child.attendanceRate}%
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Academics
              </span>
              <span className="text-xl font-extrabold text-blue-400">
                {child.academicAverage}%
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pending Due
              </span>
              <span className="text-xl font-extrabold text-white">
                ₹{feeSummary.pendingAmount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Highlights: Today's Status & Live Telemetry Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Child Entry / Exit Snapshot */}
        <div 
          onClick={() => onNavigateTab('entry_exit')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <LogIn className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Gate Entry & Campus Telemetry
              </h4>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">Morning Gate In:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {child.entryTimeToday || '07:48 AM'} • Gate 1
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">Afternoon Dispersal:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {child.exitTimeToday || 'Scheduled 02:30 PM'}
              </span>
            </div>
          </div>
        </div>

        {/* Bus / Transport Snapshot */}
        <div 
          onClick={() => onNavigateTab('transport')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-amber-400 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Bus & Fleet Telemetry
              </h4>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">Assigned Bus:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Bus 01 • North Town Loop (RJ 07 PA 4412)
              </span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-500">Morning Pickup / Drop:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Safely Delivered to Campus at 07:48 AM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable & Homework Double Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Timetable Snapshot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Timetable
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Week</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {timetable.periods.slice(0, 5).map((p) => (
                <div 
                  key={p.periodNumber}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    p.isCurrent
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[11px] font-mono text-slate-400">
                      P{p.periodNumber}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {p.subject}
                    </span>
                    {p.isCurrent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500 text-white">
                        Now
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                    <span>{p.timeSlot}</span>
                    <span>•</span>
                    <span>{p.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              Shift terminates at 02:30 PM • Dispersal via Bus Bay A
            </span>
          </div>
        </div>

        {/* Pending Homework Snapshot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Pending Homework ({pendingHomework.length})
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('homework')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {pendingHomework.slice(0, 3).map((hw) => (
                <div 
                  key={hw.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {hw.subject}
                    </span>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                      Due: {hw.dueDate}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white">{hw.title}</h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{hw.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Mark completed items in Homework tab</span>
            <button
              onClick={() => onNavigateTab('homework')}
              className="text-blue-600 font-bold hover:underline"
            >
              Update Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Institutional Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Recent School Alerts
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('notifications')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Notification Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {recentNotifications.slice(0, 3).map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onNavigateTab('notifications')}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events & PTM */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming PTM & Events
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('ptm_events')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {upcomingEvents.slice(0, 3).map((evt) => (
              <div 
                key={evt.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">{evt.title}</h5>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{evt.venue}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">{evt.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold font-mono text-[11px] shrink-0">
                  {evt.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
