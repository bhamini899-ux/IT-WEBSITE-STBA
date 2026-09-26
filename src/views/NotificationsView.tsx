import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  BookOpen, 
  Bus, 
  Zap, 
  Trash2, 
  CheckCheck,
  Mail,
  Send,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  LogOut,
  User,
  Megaphone
} from 'lucide-react';
import { SchoolNotification, AppSection } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  fetchNotificationLogs, 
  clearNotificationLogs, 
  ServerNotificationLog 
} from '../services/gmailNotificationService';
import { ComposeSchoolEmailModal } from '../components/notifications/ComposeSchoolEmailModal';
import { SchoolNotificationCenter } from '../components/notifications/SchoolNotificationCenter';

interface NotificationsViewProps {
  notifications: SchoolNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNavigate: (section: AppSection) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll,
  onNavigate,
}) => {
  const { user, gmailProfile, login, logout, isConnecting } = useAuth();

  const [activeTab, setActiveTab] = useState<'system' | 'gmail' | 'broadcasts'>('system');
  const [filter, setFilter] = useState<'all' | 'high' | 'unread'>('all');
  const [gmailLogs, setGmailLogs] = useState<ServerNotificationLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState('');

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeInitialRecipient, setComposeInitialRecipient] = useState<{
    email: string;
    name?: string;
    studentName?: string;
    studentClass?: string;
  } | undefined>(undefined);

  // Load server-side notification logs
  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const logs = await fetchNotificationLogs();
      setGmailLogs(logs);
    } catch (err) {
      console.warn('Could not load notification logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleClearGmailLogs = async () => {
    if (window.confirm('Clear all server-side Gmail notification delivery logs?')) {
      await clearNotificationLogs();
      setGmailLogs([]);
    }
  };

  const filteredSystem = notifications.filter(n => {
    if (filter === 'high') return n.severity === 'high';
    if (filter === 'unread') return !n.read;
    return true;
  });

  const filteredGmailLogs = gmailLogs.filter(log => {
    if (!searchLogQuery) return true;
    const q = searchLogQuery.toLowerCase();
    return (
      log.to.toLowerCase().includes(q) ||
      (log.recipientName && log.recipientName.toLowerCase().includes(q)) ||
      (log.studentName && log.studentName.toLowerCase().includes(q)) ||
      log.subject.toLowerCase().includes(q) ||
      log.category.toLowerCase().includes(q)
    );
  });

  const getIcon = (target: AppSection) => {
    switch (target) {
      case 'attendance':
        return UserCheck;
      case 'library':
        return BookOpen;
      case 'transport':
        return Bus;
      case 'energy':
        return Zap;
      default:
        return Bell;
    }
  };

  const handleQuickDispatchFromAlert = (item: SchoolNotification) => {
    setComposeInitialRecipient({
      email: 'parent.guardian@example.com',
      studentName: item.title.split(' ')[0] || 'Student',
      studentClass: '10-A'
    });
    setIsComposeOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Notification & Outreach Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
              Gmail Gateway 360°
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time automated school telemetry logs and Google Workspace Gmail notification dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setComposeInitialRecipient(undefined);
              setIsComposeOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Compose Email</span>
          </button>

          {activeTab === 'system' ? (
            <>
              <button
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleClearGmailLogs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Outbox</span>
            </button>
          )}
        </div>
      </div>

      {/* Gmail OAuth Connection Banner */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 shadow-xs flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.6L1.9 16.7C3.7 20.4 7.5 23 12 23z"
                />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Google Workspace Gmail Gateway
                </h3>
                {user ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                    Ready to Connect
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {user ? (
                  <span>
                    Dispatches authenticated RFC 2822 emails through <strong className="text-blue-600 dark:text-blue-400">{gmailProfile?.emailAddress || user.email}</strong>.
                    {gmailProfile && ` (Mailbox: ${gmailProfile.messagesTotal.toLocaleString()} messages)`}
                  </span>
                ) : (
                  <span>
                    Connect your institutional Gmail account to enable server-side automated email dispatches for attendance, fees, transport, and report cards.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={loadLogs}
                  disabled={logsLoading}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Sync Outbox"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sync Logs</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                disabled={isConnecting}
                className="gsi-material-button px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{isConnecting ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Telemetry Alerts ({notifications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gmail')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'gmail'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail Outbox & Delivery Logs ({gmailLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'broadcasts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>School Broadcasts & Applications</span>
          </button>
        </div>

        {activeTab === 'system' && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                filter === 'all' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                filter === 'unread' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                filter === 'high' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
            >
              High Priority
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: System Telemetry Alerts */}
      {activeTab === 'system' && (
        <div className="space-y-3">
          {filteredSystem.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Notifications</h3>
              <p className="text-xs text-slate-400 mt-1">All events and system alerts are cleared.</p>
            </div>
          ) : (
            filteredSystem.map((item) => {
              const Icon = getIcon(item.targetSection);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 ${
                    !item.read
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.severity === 'high'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                        : item.severity === 'medium'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {item.message}
                      </p>
                      <div className="mt-2.5 flex items-center gap-3">
                        <button
                          onClick={() => onNavigate(item.targetSection)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Open in {item.targetSection.toUpperCase()} &rarr;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* One-click Gmail dispatch action */}
                  <div className="sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleQuickDispatchFromAlert(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-blue-600 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Dispatch via Gmail</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Gmail Outbox & Delivery Logs */}
      {activeTab === 'gmail' && (
        <div className="space-y-4">
          {/* Search bar for outbox */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search sent notifications by student, parent, email, or category..."
              value={searchLogQuery}
              onChange={(e) => setSearchLogQuery(e.target.value)}
              className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-3">
            {filteredGmailLogs.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <Mail className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Dispatched Emails in Outbox</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Emails dispatched to parents and staff via Gmail API will appear in this authenticated audit ledger.
                </p>
                <button
                  onClick={() => {
                    setComposeInitialRecipient(undefined);
                    setIsComposeOpen(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Send First Email
                </button>
              </div>
            ) : (
              filteredGmailLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                        {log.category}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{log.sentAt}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs py-1 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Recipient:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {log.recipientName || log.to}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono">{log.to}</span>
                    </div>

                    {log.studentName && (
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Student Ward:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {log.studentName} {log.studentClass ? `(${log.studentClass})` : ''}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Gateway Message ID:</span>
                      <span className="font-mono text-[11px] text-slate-500 truncate block">
                        {log.messageId}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <SchoolNotificationCenter />
      )}

      {/* Compose Email Modal */}
      <ComposeSchoolEmailModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSuccess={loadLogs}
        initialRecipient={composeInitialRecipient}
      />
    </div>
  );
};
