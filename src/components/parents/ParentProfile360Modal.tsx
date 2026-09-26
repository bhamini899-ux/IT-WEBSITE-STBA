import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Bus, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send, 
  MessageSquare,
  ShieldCheck,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ParentGuardianRecord, ParentCommunicationItem } from '../../types';

interface ParentProfile360ModalProps {
  parent: ParentGuardianRecord | null;
  communications: ParentCommunicationItem[];
  onClose: () => void;
  onSendNotification: (parent: ParentGuardianRecord) => void;
}

export const ParentProfile360Modal: React.FC<ParentProfile360ModalProps> = ({
  parent,
  communications,
  onClose,
  onSendNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'transport' | 'attendance' | 'fees' | 'history'>('overview');
  const [showFeeDetailsModal, setShowFeeDetailsModal] = useState(false);

  if (!parent) return null;

  // Filter communications linked to this student/parent
  const parentComms = communications.filter(
    c => c.parentId === parent.id || c.studentId === parent.linkedStudentId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="parent-360-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {parent.primaryContactName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {parent.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  {parent.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                  {parent.accountStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guardian for <strong className="text-slate-800 dark:text-slate-200">{parent.linkedStudentName}</strong> ({parent.className} • Roll #{parent.rollNo})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-modal-send-notif"
              onClick={() => onSendNotification(parent)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send Notification</span>
              <span className="sm:hidden">Notify</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          {[
            { id: 'overview', label: '360° Overview', icon: User },
            { id: 'academics', label: 'Academic View', icon: GraduationCap },
            { id: 'transport', label: 'Transport View', icon: Bus },
            { id: 'attendance', label: 'Attendance View', icon: Clock },
            { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
            { id: 'history', label: 'Communication Log', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-parent-modal-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Linked Student Summary Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={parent.studentPhotoUrl}
                    alt={parent.linkedStudentName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {parent.linkedStudentName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                        Class {parent.className}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Roll No: <strong>{parent.rollNo}</strong> • Student ID: <strong>{parent.linkedStudentId}</strong>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                        Attendance: {parent.attendanceRate}%
                      </span>
                      <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-900/50 px-2 py-0.5 rounded-md">
                        Academic: {parent.academicAverage}% ({parent.academicStatus})
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        {parent.busNumber} • {parent.transportRoute}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto border-blue-200/60 dark:border-blue-800/60">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                    parent.feeStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                  }`}>
                    Fee: {parent.feeStatus} {parent.feePendingAmount > 0 && `(₹${parent.feePendingAmount.toLocaleString()})`}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    PTM: {parent.ptmStatus}
                  </p>
                </div>
              </div>

              {/* Two Column Cards: Parent Information + Quick Operational Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Guardian Information Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Parent / Guardian Information</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Primary Contact:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{parent.primaryContactName} ({parent.relationship})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {parent.phone}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{parent.email}</span>
                    </div>
                    {parent.secondaryName && (
                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">Secondary Contact:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{parent.secondaryName} ({parent.secondaryRelation})</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Preferred Channel:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{parent.preferredChannel}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500">Address:</span>
                      <span className="text-right text-slate-700 dark:text-slate-300 max-w-[220px]">{parent.address}</span>
                    </div>
                  </div>
                </div>

                {/* Operations & Action Status Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Communication & Pending Actions</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Last Notification Sent:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{parent.lastNotificationType}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {parent.lastNotificationDate}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1.5">Pending Action Items:</span>
                      {parent.pendingActionsList.length === 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>All actions acknowledged and up to date</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {parent.pendingActionsList.map((act, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="font-medium text-xs">{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500">PTM Reservation:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {parent.ptmSlot || `${parent.ptmStatus}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Communication Log for this parent */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recent Notifications Dispatched to this Guardian
                </h4>

                {parentComms.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    No recent notifications logged for this parent yet today.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {parentComms.slice(0, 4).map(comm => (
                      <div
                        key={comm.id}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {comm.subject}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {comm.category}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                            {comm.message}
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 text-slate-400 text-[10px]">
                          <span>{comm.date} • {comm.time}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ {comm.status} ({comm.channel})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC PARENT VIEW (Requirement 11) */}
          {activeTab === 'academics' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200">
                    Academic Performance Portal
                  </h3>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Accessible to parents via Smart School 360 mobile app.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-purple-900 dark:text-purple-100">
                    {parent.academicAverage}%
                  </span>
                  <p className="text-[10px] font-semibold uppercase text-purple-600 dark:text-purple-300">
                    Class Rank #{parent.academicRank}
                  </p>
                </div>
              </div>

              {/* Academic Highlights Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 font-medium">CBSE Status:</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {parent.academicStatus}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Eligible for Board Honors</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 font-medium">Homework Compliance:</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    94% Submitted
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">1 overdue worksheet</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500 font-medium">Upcoming Assessment:</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Half-Yearly Exams
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Starts 06 Oct 2026</p>
                </div>
              </div>

              {/* Teacher Remarks & Library Status */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Teacher Remarks Shared with Guardian</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{parent.linkedStudentName} shows consistent engagement and intellectual curiosity. Recommended to focus on structured revision for the upcoming Term 1 CBSE Model examinations."
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <span>Library Books Currently Issued: <strong>{parent.libraryActiveCount}</strong></span>
                  <span className={parent.libraryOverdueCount > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                    Overdue Copies: {parent.libraryOverdueCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSPORT PARENT VIEW (Requirement 12) */}
          {activeTab === 'transport' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                      {parent.busNumber}
                    </span>
                    <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                      {parent.transportRoute}
                    </h3>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Designated Stop: <strong>{parent.busStop}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 border border-amber-300">
                    Status: {parent.busBoardingStatus}
                  </span>
                  <p className="text-[11px] text-amber-800 dark:text-amber-200 font-semibold mt-1">
                    {parent.busEta}
                  </p>
                </div>
              </div>

              {/* Transport Telemetry Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Live Route Checkpoints</h4>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Last Checkpoint: Gandhi Chowk (Passed 08:02 AM)</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                      <span>Next Stop: {parent.busStop} (ETA: 7 min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      <span>Destination: Seth Tolaram Bafna Academy Bay #4</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Guardian Transport Notifications</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    Automated SMS/App alerts are dispatched when bus is 5 minutes from designated stop and when child boards or disembarks.
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                    GPS Geofence Alerts: Enabled
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE PARENT VIEW (Requirement 13) */}
          {activeTab === 'attendance' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Attendance Progress & Tracking
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    CBSE requires minimum 75% attendance for examination qualification.
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${
                    parent.attendanceRate >= 75 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {parent.attendanceRate}%
                  </span>
                  <p className="text-[10px] uppercase font-bold text-slate-500">
                    Monthly Average
                  </p>
                </div>
              </div>

              {/* Attendance metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Today's Status:</span>
                  <p className={`font-bold capitalize text-sm mt-0.5 ${
                    parent.todayAttendance === 'present' ? 'text-emerald-600' : parent.todayAttendance === 'absent' ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {parent.todayAttendance}
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Days Attended:</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    78 / 82 Days
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Late Arrivals:</span>
                  <p className="font-bold text-amber-600 text-sm mt-0.5">
                    2 times
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Last Absence:</span>
                  <p className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 truncate">
                    {parent.lastAbsenceDate || 'None recorded'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Parent Attendance Alerts Dispatched
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every absence or tardy entry triggers an immediate SMS and app push notice to {parent.phone} and {parent.email}.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: FEES & PAYMENT STATUS (Requirement 14) */}
          {activeTab === 'fees' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    Fee Status & Parent Invoicing
                  </h3>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    Annual Tuition & Composite Fee: ₹{parent.totalFeeAnnual.toLocaleString()}
                  </p>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    parent.feeStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                  }`}>
                    {parent.feeStatus}
                  </span>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 font-medium mt-1">
                    {parent.feePendingAmount > 0 ? `Pending: ₹${parent.feePendingAmount.toLocaleString()}` : 'No dues pending'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Paid to Date:</span>
                  <p className="text-sm font-bold text-emerald-600 mt-1">
                    ₹{(parent.totalFeeAnnual - parent.feePendingAmount).toLocaleString()}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Last Payment Date:</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {parent.lastPaymentDate || 'N/A'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-500">Next Installment Due:</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {parent.nextFeeDueDate || '15 Jan 2027'}
                  </p>
                </div>
              </div>

              {/* View Fee Details Action */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Detailed Fee Breakdown</h4>
                  <p className="text-[11px] text-slate-500">View official receipt ledger and term breakdown</p>
                </div>
                <button
                  id="btn-view-fee-details"
                  onClick={() => setShowFeeDetailsModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  View Fee Details
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: COMMUNICATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Complete Communication Log ({parentComms.length} items)
                </h3>
              </div>

              {parentComms.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No communication records found for this parent.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {parentComms.map(comm => (
                    <div
                      key={comm.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {comm.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {comm.date} • {comm.time}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs">
                        {comm.message}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                        <span>Channel: <strong>{comm.channel}</strong></span>
                        <span className="font-semibold text-emerald-600">Status: {comm.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Registered Guardian ID: <strong>{parent.id}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>

      {/* Internal Fee Details Modal */}
      {showFeeDetailsModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Official Fee Details & Receipts
              </h3>
              <button
                onClick={() => setShowFeeDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Annual Tuition & Lab:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{parent.totalFeeAnnual.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-semibold text-emerald-600">₹{(parent.totalFeeAnnual - parent.feePendingAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Outstanding Balance:</span>
                <span className="font-semibold text-rose-600">₹{parent.feePendingAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Last Receipt Date:</span>
                <span className="text-slate-800 dark:text-slate-200">{parent.lastPaymentDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Next Installment Due:</span>
                <span className="text-slate-800 dark:text-slate-200">{parent.nextFeeDueDate || '15 Jan 2027'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowFeeDetailsModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
