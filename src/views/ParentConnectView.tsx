import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  LogIn, 
  UserCheck, 
  Bus, 
  Award, 
  BookOpen, 
  Calendar, 
  CreditCard, 
  Bell, 
  HeartHandshake, 
  MessageSquare, 
  FileText, 
  PhoneCall,
  UserPlus,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { 
  ParentConnectTab, 
  ChildProfile, 
  ParentSchoolDocument, 
  ParentLeaveRequest, 
  TeacherCommunicationThread,
  ParentConnectNotification,
  ChildFeeSummary
} from '../types/parentConnect';
import { deletePersistentStudent } from '../services/studentPersistenceService';
import { 
  mockParentAccount, 
  mockEntryExitRecords, 
  mockAttendanceDays, 
  mockLeaveRequests, 
  mockTransportDetails, 
  mockAcademics, 
  mockHomeworkList, 
  mockWeeklyTimetable, 
  mockFeeSummary, 
  mockNotifications, 
  mockPTMList, 
  mockEventsList, 
  mockCommunicationThreads, 
  mockSchoolDocuments, 
  mockEmergencyContacts 
} from '../data/parentConnectData';

import { ChildSwitcherBar } from '../components/parent-connect/ChildSwitcherBar';
import { DocumentViewerModal } from '../components/parent-connect/DocumentViewerModal';
import { ParentDashboardOverview } from '../components/parent-connect/ParentDashboardOverview';
import { ChildEntryExitCard } from '../components/parent-connect/ChildEntryExitCard';
import { ChildAttendanceSection } from '../components/parent-connect/ChildAttendanceSection';
import { ChildTransportLiveSection } from '../components/parent-connect/ChildTransportLiveSection';
import { ChildAcademicsSection } from '../components/parent-connect/ChildAcademicsSection';
import { ChildHomeworkSection } from '../components/parent-connect/ChildHomeworkSection';
import { ChildTimetableSection } from '../components/parent-connect/ChildTimetableSection';
import { ChildFeesSection } from '../components/parent-connect/ChildFeesSection';
import { ParentNotificationsCenter } from '../components/parent-connect/ParentNotificationsCenter';
import { ParentPTMEventsSection } from '../components/parent-connect/ParentPTMEventsSection';
import { ParentTeacherCommunication } from '../components/parent-connect/ParentTeacherCommunication';
import { ParentDocumentsVault } from '../components/parent-connect/ParentDocumentsVault';
import { ParentEmergencyContacts } from '../components/parent-connect/ParentEmergencyContacts';

const PARENT_LINKS_STORAGE_KEY = 'stba_parent_connections_v1';

export const ParentConnectView: React.FC = () => {
  // Navigation & Child Selection State
  const [activeTab, setActiveTab] = useState<ParentConnectTab>('dashboard');
  const [selectedChildId, setSelectedChildId] = useState<string>(mockParentAccount.children[0]?.id || '');
  
  // Interactive Data State for Prototype
  const [children, setChildren] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem(PARENT_LINKS_STORAGE_KEY);
      if (saved) {
        const links = JSON.parse(saved);
        if (typeof links === 'object' && links !== null) {
          return mockParentAccount.children.map(c => {
            if (links[c.id]) {
              return {
                ...c,
                parentLinked: true,
                guardianName: links[c.id].guardianName || 'Guardian',
                guardianPhone: links[c.id].guardianPhone || 'Not Available',
                guardianEmail: links[c.id].guardianEmail || 'Not Available',
              };
            }
            return c;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load parent links', e);
    }
    return mockParentAccount.children;
  });

  // Admin Parent Linking & Student Deletion Modals State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [guardianNameInput, setGuardianNameInput] = useState('');
  const [guardianPhoneInput, setGuardianPhoneInput] = useState('');
  const [guardianRelationInput, setGuardianRelationInput] = useState('Father');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [entryExitRecords, setEntryExitRecords] = useState(mockEntryExitRecords);
  const [homeworkList, setHomeworkList] = useState(mockHomeworkList);
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [feeSummaries, setFeeSummaries] = useState<Record<string, ChildFeeSummary>>({
    'STU-1021': mockFeeSummary,
    'STU-1088': {
      ...mockFeeSummary,
      totalAnnualFee: 58000,
      paidAmount: 53500,
      pendingAmount: 4500,
      nextDueDate: '30 Sep 2026',
      installments: [
        { id: 'inst-a1', term: 'Term 1 Tuition (Apr - Jul)', amount: 20000, dueDate: '15 Apr 2026', status: 'Paid', receiptNo: 'STBA-RCP-2026-6819', paidDate: '10 Apr 2026' },
        { id: 'inst-a2', term: 'Term 2 Tuition (Aug - Nov)', amount: 20000, dueDate: '15 Aug 2026', status: 'Paid', receiptNo: 'STBA-RCP-2026-7244', paidDate: '12 Aug 2026' },
        { id: 'inst-a3', term: 'Activity & Lab Fee', amount: 13500, dueDate: '30 Aug 2026', status: 'Paid', receiptNo: 'STBA-RCP-2026-7689', paidDate: '28 Aug 2026' },
        { id: 'inst-a4', term: 'Annual Sports & RoboKids Fee', amount: 4500, dueDate: '30 Sep 2026', status: 'Pending' },
      ],
      paymentHistory: [
        { receiptNo: 'STBA-RCP-2026-7689', date: '28 Aug 2026', amount: 13500, title: 'Activity & Robotics Clearance', paymentMode: 'UPI AutoPay', status: 'Success', downloadable: true },
        { receiptNo: 'STBA-RCP-2026-7244', date: '12 Aug 2026', amount: 20000, title: 'Second Quarter Tuition Fee', paymentMode: 'NetBanking', status: 'Success', downloadable: true },
        { receiptNo: 'STBA-RCP-2026-6819', date: '10 Apr 2026', amount: 20000, title: 'First Quarter Admission & Tuition', paymentMode: 'NetBanking', status: 'Success', downloadable: true }
      ]
    }
  });
  const [notifications, setNotifications] = useState<ParentConnectNotification[]>(mockNotifications);
  const [communicationThreads, setCommunicationThreads] = useState<TeacherCommunicationThread[]>(mockCommunicationThreads);
  const [transportState, setTransportState] = useState(mockTransportDetails);

  // Document Viewer Modal State
  const [activeDocument, setActiveDocument] = useState<ParentSchoolDocument | null>(null);

  const currentChild = children.find(c => c.id === selectedChildId) || children[0];
  const currentFeeSummary = feeSummaries[currentChild.id] || mockFeeSummary;

  // Handler: Toggle Homework Status
  const handleToggleHomework = (homeworkId: string) => {
    setHomeworkList(prev => prev.map(hw => {
      if (hw.id === homeworkId) {
        const nextCompleted = !hw.completed;
        return {
          ...hw,
          completed: nextCompleted,
          completedAt: nextCompleted ? 'Just now' : undefined
        };
      }
      return hw;
    }));
  };

  // Handler: Submit Leave Request
  const handleSubmitLeave = (newReq: Omit<ParentLeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const created: ParentLeaveRequest = {
      ...newReq,
      id: `leave-${Date.now()}`,
      appliedDate: 'Today',
      status: 'Pending'
    };
    setLeaveRequests(prev => [created, ...prev]);

    // Also add a system notification
    const notif: ParentConnectNotification = {
      id: `notif-${Date.now()}`,
      title: `Leave Application Submitted`,
      message: `Your leave application for ${currentChild.name} (${newReq.fromDate} to ${newReq.toDate}) has been submitted to ${currentChild.classTeacher}.`,
      timestamp: 'Just now',
      category: 'ATTENDANCE',
      severity: 'low',
      read: false,
      childId: currentChild.id,
      actionTab: 'attendance',
      actionLabel: 'Check Status'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Handler: Simulate Gate Tap
  const handleSimulateGateTap = () => {
    const isInside = currentChild.todayStatus === 'In School';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChildren(prev => prev.map(c => {
      if (c.id === currentChild.id) {
        return {
          ...c,
          todayStatus: isInside ? 'At Home' : 'In School',
          exitTimeToday: isInside ? nowTime : null,
          entryTimeToday: !isInside ? nowTime : c.entryTimeToday
        };
      }
      return c;
    }));

    // Add entry/exit record
    if (isInside) {
      setEntryExitRecords(prev => [
        {
          id: `rec-${Date.now()}`,
          date: 'Today (Live)',
          day: 'Friday',
          entryTime: currentChild.entryTimeToday || '07:48 AM',
          exitTime: nowTime,
          entryGate: 'Main Campus Gate 1',
          exitGate: 'Dispersal Gate 2 (Bus Bay A)',
          status: 'Normal Dispersal',
          verifiedBy: 'Havildar R. S. Rathore (Head Security)',
          rfidCardId: 'RFID-STU-1021-A',
          notes: 'Biometric RFID gate exit tapped successfully.'
        },
        ...prev
      ]);

      const exitNotif: ParentConnectNotification = {
        id: `notif-${Date.now()}`,
        title: `Campus Exit: ${currentChild.name}`,
        message: `${currentChild.name} tapped RFID exit at Dispersal Gate 2 at ${nowTime}.`,
        timestamp: 'Just now',
        category: 'EXIT',
        severity: 'medium',
        read: false,
        childId: currentChild.id,
        actionTab: 'entry_exit',
        actionLabel: 'View Gate Log'
      };
      setNotifications(prev => [exitNotif, ...prev]);
    } else {
      const entryNotif: ParentConnectNotification = {
        id: `notif-${Date.now()}`,
        title: `Campus Entry: ${currentChild.name}`,
        message: `${currentChild.name} entered school campus via Gate 1 at ${nowTime}.`,
        timestamp: 'Just now',
        category: 'ENTRY',
        severity: 'medium',
        read: false,
        childId: currentChild.id,
        actionTab: 'entry_exit',
        actionLabel: 'View Gate Log'
      };
      setNotifications(prev => [entryNotif, ...prev]);
    }
  };

  // Handler: Simulate Transport Return Trip
  const handleSimulateReturnTrip = () => {
    setTransportState(prev => ({
      ...prev,
      speedKmh: prev.speedKmh > 0 ? 0 : 28,
      currentStatus: prev.speedKmh > 0 ? 'Reached School' : 'Dispersal In Transit'
    }));
  };

  // Handler: Pay Fee Demo Simulator
  const handlePayFee = (installmentId: string, amount: number) => {
    const newReceiptNo = `STBA-RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = '18 Sep 2026';

    setFeeSummaries(prev => {
      const existing = prev[currentChild.id] || mockFeeSummary;
      const updatedInstallments = existing.installments.map(inst => {
        if (inst.id === installmentId) {
          return {
            ...inst,
            status: 'Paid' as const,
            receiptNo: newReceiptNo,
            paidDate: todayStr
          };
        }
        return inst;
      });

      const updatedHistory = [
        {
          receiptNo: newReceiptNo,
          date: todayStr,
          amount,
          title: updatedInstallments.find(i => i.id === installmentId)?.term || 'Tuition Clearance',
          paymentMode: 'Online NetBanking (Simulated)',
          status: 'Success' as const,
          downloadable: true
        },
        ...existing.paymentHistory
      ];

      return {
        ...prev,
        [currentChild.id]: {
          ...existing,
          paidAmount: existing.paidAmount + amount,
          pendingAmount: Math.max(0, existing.pendingAmount - amount),
          installments: updatedInstallments,
          paymentHistory: updatedHistory
        }
      };
    });

    // Add notification
    const feeNotif: ParentConnectNotification = {
      id: `notif-${Date.now()}`,
      title: `Fee Payment Received: ₹${amount.toLocaleString('en-IN')}`,
      message: `Official receipt ${newReceiptNo} generated for ${currentChild.name}. Thank you!`,
      timestamp: 'Just now',
      category: 'FEES',
      severity: 'medium',
      read: false,
      childId: currentChild.id,
      actionTab: 'fees',
      actionLabel: 'View Receipt'
    };
    setNotifications(prev => [feeNotif, ...prev]);
  };

  // Handler: View Receipt Document
  const handleViewReceiptDoc = (receiptNo: string) => {
    const foundDoc = mockSchoolDocuments.find(d => d.title.includes(receiptNo) || d.category === 'Fee Receipt');
    if (foundDoc) {
      setActiveDocument({
        ...foundDoc,
        title: `Fee Receipt: ${receiptNo}`
      });
    } else {
      setActiveDocument(mockSchoolDocuments[1]);
    }
  };

  // Handler: Open Report Card
  const handleOpenReportCard = () => {
    const reportCard = mockSchoolDocuments.find(d => d.category === 'Report Card') || mockSchoolDocuments[0];
    setActiveDocument(reportCard);
  };

  // Handler: Notifications actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Handler: Send teacher message
  const handleSendMessage = (threadId: string, text: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: mockParentAccount.parentName,
      senderRole: 'Parent' as const,
      timestamp: 'Just now',
      text
    };

    setCommunicationThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          lastUpdated: 'Just now',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));
  };

  const handleStartNewThread = (teacherName: string, teacherRole: string, subject: string, initialMessage: string) => {
    const newThread: TeacherCommunicationThread = {
      id: `thread-${Date.now()}`,
      childId: currentChild.id,
      teacherName,
      teacherRole,
      teacherEmail: `${teacherName.toLowerCase().replace(/[^a-z]/g, '')}@stba.edu.in`,
      subject,
      lastUpdated: 'Just now',
      status: 'Open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: mockParentAccount.parentName,
          senderRole: 'Parent',
          timestamp: 'Just now',
          text: initialMessage
        }
      ]
    };

    setCommunicationThreads(prev => [newThread, ...prev]);
  };

  // Navigation tabs definition with badges
  const navTabs: { id: ParentConnectTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Parent Dashboard', icon: LayoutDashboard },
    { id: 'entry_exit', label: 'Child Entry & Exit', icon: LogIn, badge: currentChild.todayStatus === 'In School' ? 'In Campus' : undefined },
    { id: 'attendance', label: 'Attendance', icon: UserCheck, badge: `${currentChild.attendanceRate}%` },
    { id: 'transport', label: 'Bus & Transport', icon: Bus, badge: 'Live GPS' },
    { id: 'academics', label: 'Academics', icon: Award, badge: `${currentChild.academicAverage}%` },
    { id: 'homework', label: 'Homework', icon: BookOpen, badge: homeworkList.filter(h => h.childId === currentChild.id && !h.completed).length || undefined },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'fees', label: 'Fees', icon: CreditCard, badge: currentFeeSummary.pendingAmount > 0 ? `Due ₹${currentFeeSummary.pendingAmount}` : undefined },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length || undefined },
    { id: 'ptm_events', label: 'PTM & Events', icon: HeartHandshake },
    { id: 'teacher_chat', label: 'Teacher Desk', icon: MessageSquare },
    { id: 'documents', label: 'Documents Vault', icon: FileText },
    { id: 'emergency', label: 'Emergency Contacts', icon: PhoneCall },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Child Switcher Header */}
      <ChildSwitcherBar
        childrenList={children}
        selectedChild={currentChild}
        onSelectChild={(c) => setSelectedChildId(c.id)}
        onOpenEmergency={() => setActiveTab('emergency')}
        unreadCount={notifications.filter(n => !n.read).length}
      />

      {/* Module Navigation Tabs (Responsive with smooth horizontal scroll for mobile) */}
      <div className="bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof tab.badge === 'number'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Render Switch */}
      <main className="transition-all duration-200">
        {activeTab === 'dashboard' && (
          <ParentDashboardOverview
            child={currentChild}
            timetable={mockWeeklyTimetable[4]} // Friday schedule
            pendingHomework={homeworkList.filter(h => h.childId === currentChild.id && !h.completed)}
            recentNotifications={notifications}
            feeSummary={currentFeeSummary}
            upcomingEvents={mockEventsList}
            onNavigateTab={setActiveTab}
            onOpenReportCard={handleOpenReportCard}
          />
        )}

        {activeTab === 'entry_exit' && (
          <ChildEntryExitCard
            child={currentChild}
            records={entryExitRecords}
            onSimulateGateTap={handleSimulateGateTap}
          />
        )}

        {activeTab === 'attendance' && (
          <ChildAttendanceSection
            child={currentChild}
            attendanceDays={mockAttendanceDays}
            leaveRequests={leaveRequests}
            onSubmitLeaveRequest={handleSubmitLeave}
          />
        )}

        {activeTab === 'transport' && (
          <ChildTransportLiveSection
            child={currentChild}
            transportDetails={transportState}
            onSimulateReturnTrip={handleSimulateReturnTrip}
          />
        )}

        {activeTab === 'academics' && (
          <ChildAcademicsSection
            child={currentChild}
            academics={mockAcademics}
            onViewReportCard={handleOpenReportCard}
          />
        )}

        {activeTab === 'homework' && (
          <ChildHomeworkSection
            child={currentChild}
            homeworkList={homeworkList}
            onToggleHomeworkStatus={handleToggleHomework}
          />
        )}

        {activeTab === 'timetable' && (
          <ChildTimetableSection
            child={currentChild}
            weeklyTimetable={mockWeeklyTimetable}
          />
        )}

        {activeTab === 'fees' && (
          <ChildFeesSection
            child={currentChild}
            feeSummary={currentFeeSummary}
            onPayFee={handlePayFee}
            onViewReceipt={handleViewReceiptDoc}
          />
        )}

        {activeTab === 'notifications' && (
          <ParentNotificationsCenter
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationRead}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'ptm_events' && (
          <ParentPTMEventsSection
            child={currentChild}
            ptmList={mockPTMList}
            eventsList={mockEventsList}
            onConfirmPTM={() => {}}
          />
        )}

        {activeTab === 'teacher_chat' && (
          <ParentTeacherCommunication
            child={currentChild}
            threads={communicationThreads.filter(t => t.childId === currentChild.id)}
            onSendMessage={handleSendMessage}
            onStartNewThread={handleStartNewThread}
          />
        )}

        {activeTab === 'documents' && (
          <ParentDocumentsVault
            child={currentChild}
            documents={mockSchoolDocuments}
            onOpenDocument={setActiveDocument}
          />
        )}

        {activeTab === 'emergency' && (
          <ParentEmergencyContacts
            child={currentChild}
            contacts={mockEmergencyContacts}
          />
        )}
      </main>

      {/* Universal Document Preview / Download Modal */}
      {activeDocument && (
        <DocumentViewerModal
          document={activeDocument}
          child={currentChild}
          onClose={() => setActiveDocument(null)}
          onDownload={() => {}}
        />
      )}
    </div>
  );
};
