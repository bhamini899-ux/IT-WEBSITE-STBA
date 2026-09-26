import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  Users, 
  Plus, 
  Eye, 
  X, 
  Filter, 
  Search, 
  FileText, 
  CheckCheck,
  Building,
  GraduationCap,
  Clock,
  Briefcase
} from 'lucide-react';
import { 
  getSchoolNotifications, 
  createSchoolNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getNotificationsForRole, 
  getTeacherApplications, 
  reviewTeacherApplication, 
  SchoolNotificationItem, 
  TeacherApplicationItem 
} from '../../services/schoolDataHub';
import { UserAccount, SystemRole } from '../../types';

interface SchoolNotificationCenterProps {
  currentUser?: UserAccount;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const DEFAULT_ADMIN_USER: UserAccount = {
  id: 'ADMIN-DEFAULT',
  username: 'admin',
  passwordHash: '',
  name: 'Academy Administrator',
  role: 'Administrator',
  status: 'Active',
  createdAt: '2026-01-01',
  email: 'admin@bafna.edu.in'
};

export const SchoolNotificationCenter: React.FC<SchoolNotificationCenterProps> = ({
  currentUser = DEFAULT_ADMIN_USER,
  onShowToast
}) => {
  const triggerToast = (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => {
    if (onShowToast) {
      onShowToast(title, description, type);
    }
  };

  const [notifications, setNotifications] = useState<SchoolNotificationItem[]>([]);
  const [applications, setApplications] = useState<TeacherApplicationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'create' | 'applications' | 'history'>('all');
  
  // Create Notification Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'Everyone' | 'Teachers' | 'Students' | 'Parents' | 'Specific Class'>('Everyone');
  const [targetClass, setTargetClass] = useState('10');
  const [targetSection, setTargetSection] = useState('B');
  const [category, setCategory] = useState<'General' | 'Academic' | 'Holiday' | 'Exam' | 'Attendance' | 'Event' | 'Transport' | 'Emergency'>('General');
  const [priority, setPriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');

  // Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [rejectionModalAppId, setRejectionModalAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const isAdmin = currentUser.role === 'Administrator';

  // Load Data
  const loadData = () => {
    const notifs = getNotificationsForRole(
      currentUser.role,
      currentUser.id || currentUser.username,
      currentUser.className,
      currentUser.section
    );
    setNotifications(notifs);

    if (isAdmin) {
      setApplications(getTeacherApplications());
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Handle Send Notification
  const handleConfirmSend = () => {
    if (!title.trim() || !message.trim()) {
      triggerToast('Missing Fields', 'Please fill in both the title and message.', 'warning');
      return;
    }

    createSchoolNotification({
      title: title.trim(),
      message: message.trim(),
      category,
      priority,
      audience,
      ...(audience === 'Specific Class' ? { targetClass, targetSection } : {}),
      createdBy: currentUser.name || 'Administration'
    });

    triggerToast('Notification Broadcasted', `Notification sent to ${audience}.`, 'success');
    setIsPreviewOpen(false);
    setTitle('');
    setMessage('');
    setActiveTab('all');
    loadData();
  };

  // Mark single as read
  const handleMarkRead = (id: string) => {
    markNotificationAsRead(id, currentUser.id || currentUser.username);
    loadData();
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(currentUser.id || currentUser.username, currentUser.role);
    triggerToast('All Read', 'Marked all notifications as read.', 'info');
    loadData();
  };

  // Approve Application
  const handleApproveApplication = (appId: string) => {
    reviewTeacherApplication(appId, 'Approved', 'Approved by Principal / Admin Office', currentUser.name);
    triggerToast('Application Approved', 'Teacher application status updated to Approved.', 'success');
    loadData();
  };

  // Reject Application
  const handleRejectApplication = () => {
    if (!rejectionModalAppId) return;
    reviewTeacherApplication(rejectionModalAppId, 'Rejected', rejectionReason || 'Declined as per academic calendar', currentUser.name);
    triggerToast('Application Rejected', 'Teacher application status updated to Rejected.', 'info');
    setRejectionModalAppId(null);
    setRejectionReason('');
    loadData();
  };

  const unreadCount = notifications.filter(n => !n.readBy.includes(currentUser.id || currentUser.username)).length;
  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>School Circulars & Alerts</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                {unreadCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('create')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Notification</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'applications'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Teacher Applications</span>
                {pendingAppsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                    {pendingAppsCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* TAB 1: School Circulars & Alerts Feed */}
      {activeTab === 'all' && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No notifications available yet.
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Official school announcements, holiday updates, and academic notifications will appear here.
              </p>
            </div>
          ) : (
            notifications.map(notif => {
              const isUnread = !notif.readBy.includes(currentUser.id || currentUser.username);
              return (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isUnread
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          notif.priority === 'Urgent'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : notif.priority === 'Important'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {notif.priority}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100/70 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                          {notif.category}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Audience: <strong className="text-slate-600 dark:text-slate-300">{notif.audience}</strong>
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          • {notif.createdAt}
                        </span>
                      </div>

                      <h4 className={`text-sm sm:text-base text-slate-900 dark:text-white ${isUnread ? 'font-black' : 'font-bold'}`}>
                        {notif.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Issued by: <strong>{notif.createdBy}</strong></span>
                        {isUnread && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Admin Create Notification Form */}
      {isAdmin && activeTab === 'create' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-2xl mx-auto">
          <div className="mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Broadcast New School Notification</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send announcements directly to teachers, students, and parents
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsPreviewOpen(true); }} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. School Closed Tomorrow, Mid-Term Exam Schedule, PTM Reminder"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message Body *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter the detailed announcement message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience *
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Everyone">Everyone (All Portals)</option>
                  <option value="Teachers">Teachers & Faculty</option>
                  <option value="Students">Students Only</option>
                  <option value="Parents">Parents Only</option>
                  <option value="Specific Class">Specific Class</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Exam">Examination</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Event">Event</option>
                  <option value="Transport">Transport</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Priority *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {audience === 'Specific Class' && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Class
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Section
                  </label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Notification</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Admin Review Teacher Applications */}
      {isAdmin && activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Faculty Applications & Leave Approval</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review submitted teacher requests and update approval status
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {applications.length} Applications Total
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No applications submitted yet.
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                When teachers submit leave or official duty applications, they will appear here for administrative approval.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-xs font-bold text-blue-600">
                          {app.applicationType}
                        </span>
                        <span className="text-xs text-slate-400">
                          • Submitted: {app.submittedAt}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {app.teacherName} <span className="text-xs font-normal text-slate-400">({app.department || 'Faculty'})</span>
                      </h4>

                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        <strong>Period:</strong> {app.startDate} to {app.endDate} ({app.days} Day{app.days > 1 ? 's' : ''})
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        <strong>Reason:</strong> {app.reason}
                      </div>

                      {app.adminRemarks && (
                        <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                          <strong>Admin Remark:</strong> {app.adminRemarks} (by {app.reviewedBy || 'Admin'})
                        </div>
                      )}
                    </div>

                    {app.status === 'Pending' && (
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleApproveApplication(app.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          APPROVE
                        </button>
                        <button
                          onClick={() => setRejectionModalAppId(app.id)}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          REJECT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PREVIEW MODAL BEFORE SENDING */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Notification Preview
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 mb-5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {priority}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {category}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {message}
              </p>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                Audience: <strong>{audience}</strong> {audience === 'Specific Class' ? `(Class ${targetClass}-${targetSection})` : ''}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Notification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION NOTE MODAL */}
      {rejectionModalAppId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Reject Teacher Application
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Please provide a reason or administrative remarks for declining this application:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Exam invigilation duty assigned, Academic revision week, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs mb-4"
            ></textarea>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectionModalAppId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectApplication}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
