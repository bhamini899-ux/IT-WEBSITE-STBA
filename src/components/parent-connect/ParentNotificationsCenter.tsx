import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  CheckCheck, 
  LogIn, 
  LogOut, 
  UserCheck, 
  Bus, 
  BookOpen, 
  Calendar, 
  Award, 
  CreditCard, 
  HeartHandshake, 
  Sparkles, 
  Megaphone,
  CheckCircle2,
  Mail,
  ArrowRight,
  Filter
} from 'lucide-react';
import { ParentConnectNotification, ParentConnectTab } from '../../types/parentConnect';

interface ParentNotificationsCenterProps {
  notifications: ParentConnectNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToTab: (tab: ParentConnectTab) => void;
}

export const ParentNotificationsCenter: React.FC<ParentNotificationsCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const categories: { key: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'ALL', label: 'All Alerts', icon: Bell },
    { key: 'ENTRY', label: 'Entry', icon: LogIn },
    { key: 'EXIT', label: 'Exit', icon: LogOut },
    { key: 'ATTENDANCE', label: 'Attendance', icon: UserCheck },
    { key: 'BUS', label: 'Bus & Transport', icon: Bus },
    { key: 'HOMEWORK', label: 'Homework', icon: BookOpen },
    { key: 'EXAM', label: 'Exams', icon: Calendar },
    { key: 'RESULT', label: 'Results', icon: Award },
    { key: 'FEES', label: 'Fees', icon: CreditCard },
    { key: 'PTM', label: 'PTM', icon: HeartHandshake },
    { key: 'EVENTS', label: 'Events', icon: Sparkles },
    { key: 'ANNOUNCEMENTS', label: 'Announcements', icon: Megaphone }
  ];

  const filteredNotifications = notifications.filter(n => {
    if (showUnreadOnly && n.read) return false;
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: ParentConnectNotification['category']) => {
    switch (category) {
      case 'ENTRY': return <LogIn className="w-4 h-4 text-emerald-600" />;
      case 'EXIT': return <LogOut className="w-4 h-4 text-blue-600" />;
      case 'ATTENDANCE': return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'BUS': return <Bus className="w-4 h-4 text-amber-600" />;
      case 'HOMEWORK': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'EXAM': return <Calendar className="w-4 h-4 text-rose-600" />;
      case 'RESULT': return <Award className="w-4 h-4 text-amber-500" />;
      case 'FEES': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'PTM': return <HeartHandshake className="w-4 h-4 text-indigo-600" />;
      case 'EVENTS': return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'ANNOUNCEMENTS': return <Megaphone className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryBadgeClass = (category: ParentConnectNotification['category']) => {
    switch (category) {
      case 'ENTRY': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'EXIT': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'ATTENDANCE': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'BUS': return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'HOMEWORK': return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'EXAM': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'RESULT': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'FEES': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'PTM': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'EVENTS': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'ANNOUNCEMENTS': return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Centralized Notification Center
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, entry/exit, bus, attendance, academic, fee, and institutional alerts
          </p>
        </div>

        {/* Gmail API Gateway Sync Tag */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-700 dark:text-blue-300 font-medium">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Gmail API Dispatch Enabled</span>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications by keyword, subject, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Unread Toggle */}
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              showUnreadOnly
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Unread Only</span>
          </button>
        </div>

        {/* 11 Categories Horizontal Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Notifications Found
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-90'
                  : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Category Icon Badge */}
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${getCategoryBadgeClass(notif.category)}`}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${getCategoryBadgeClass(notif.category)}`}>
                        {notif.category}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {notif.timestamp}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action navigation button if defined */}
                    {notif.actionTab && notif.actionLabel && (
                      <div className="pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notif.id);
                            onNavigateToTab(notif.actionTab!);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {!notif.read ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                      New
                    </span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
