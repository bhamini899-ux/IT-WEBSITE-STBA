import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  X, 
  ArrowRight, 
  CalendarClock, 
  AlertTriangle, 
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  getNotificationsForRole, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  SchoolNotificationItem 
} from '../../services/schoolDataHub';
import { UserAccount } from '../../types';

interface NotificationBellDrawerProps {
  currentUser: UserAccount;
  onViewAll?: () => void;
}

export const NotificationBellDrawer: React.FC<NotificationBellDrawerProps> = ({
  currentUser,
  onViewAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SchoolNotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    const list = getNotificationsForRole(
      currentUser.role,
      currentUser.id || currentUser.username,
      currentUser.className,
      currentUser.section
    );
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadList = notifications.filter(n => !n.readBy.includes(currentUser.id || currentUser.username));
  const unreadCount = unreadList.length;

  const handleMarkRead = (id: string) => {
    markNotificationAsRead(id, currentUser.id || currentUser.username);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(currentUser.id || currentUser.username, currentUser.role);
    loadNotifications();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="btn-notification-bell"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
        title="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] text-center rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs animate-in zoom-in-50">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown / Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer inline-flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications available
              </div>
            ) : (
              notifications.slice(0, 6).map(notif => {
                const isUnread = !notif.readBy.includes(currentUser.id || currentUser.username);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id)}
                    className={`p-3 text-xs transition-colors cursor-pointer ${
                      isUnread
                        ? 'bg-blue-50/50 dark:bg-blue-950/30 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                        <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded ${
                          notif.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {notif.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {notif.createdAt}
                        </span>
                      </div>
                    </div>

                    <h5 className={`text-xs text-slate-900 dark:text-white ${isUnread ? 'font-black' : 'font-semibold'}`}>
                      {notif.title}
                    </h5>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {onViewAll && (
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onViewAll();
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All Circulars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
