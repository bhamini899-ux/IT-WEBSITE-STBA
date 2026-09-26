import React, { useState } from 'react';
import { 
  X, 
  User, 
  Users, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Bus, 
  CreditCard, 
  CalendarClock, 
  Trophy, 
  ShieldAlert, 
  HeartPulse, 
  FileText, 
  MessageSquare, 
  Clock, 
  Download, 
  Printer, 
  QrCode, 
  IdCard, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Plus,
  Send,
  Trash2
} from 'lucide-react';
import { Student, StudentLeaveRecord, StudentNote } from '../../types';

interface Student360ProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDigitalId: (student: Student) => void;
  onOpenQRCode: (student: Student) => void;
  onOpenMessage: (student: Student) => void;
  onOpenClassEdit?: (student: Student) => void;
  onRequestRemove?: (student: Student) => void;
  onApplyLeave: (studentId: string, leave: Partial<StudentLeaveRecord>) => void;
  onAddNote: (studentId: string, text: string) => void;
  borrowRecords?: any[];
  buses?: any[];
}

type TabType = 
  | 'overview' 
  | 'personal' 
  | 'family' 
  | 'attendance' 
  | 'academics' 
  | 'library' 
  | 'transport' 
  | 'fee' 
  | 'leaves' 
  | 'activities' 
  | 'achievements' 
  | 'discipline' 
  | 'health' 
  | 'documents' 
  | 'communication' 
  | 'timeline';

export const Student360ProfileModal: React.FC<Student360ProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  onOpenDigitalId,
  onOpenQRCode,
  onOpenMessage,
  onOpenClassEdit,
  onRequestRemove,
  onApplyLeave,
  onAddNote,
  borrowRecords = [],
  buses = [],
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveCategory, setLeaveCategory] = useState<'Medical' | 'Casual' | 'Sports' | 'Family Function'>('Medical');
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');
  const [printNotification, setPrintNotification] = useState(false);

  if (!isOpen || !student) return null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(student.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleSubmittingLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    const newLeave: Partial<StudentLeaveRecord> = {
      id: `LV-${Date.now().toString().slice(-4)}`,
      category: leaveCategory,
      startDate: 'Tomorrow',
      endDate: leaveDays > 1 ? `In ${leaveDays} days` : 'Tomorrow',
      days: leaveDays,
      reason: leaveReason,
      status: 'Approved',
      appliedAt: 'Today',
      approvedBy: 'Dr. V. K. Saxena (Principal)'
    };
    onApplyLeave(student.id, newLeave);
    setShowLeaveForm(false);
    setLeaveReason('');
  };

  const handlePrintDossier = () => {
    setPrintNotification(true);
    setTimeout(() => setPrintNotification(false), 3000);
  };

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'family', label: 'Family & Guardians', icon: Users },
    { id: 'attendance', label: 'Smart Attendance', icon: Calendar },
    { id: 'academics', label: 'Academics & Grades', icon: GraduationCap },
    { id: 'library', label: 'Smart Library', icon: BookOpen },
    { id: 'transport', label: 'Smart Transport', icon: Bus },
    { id: 'fee', label: 'Fee & Dues', icon: CreditCard },
    { id: 'leaves', label: 'Leaves & Sanctions', icon: CalendarClock },
    { id: 'activities', label: 'Activities & Clubs', icon: Trophy },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'discipline', label: 'Discipline & Behavior', icon: ShieldAlert },
    { id: 'health', label: 'Health & Medical', icon: HeartPulse },
    { id: 'documents', label: 'Documents Vault', icon: FileText },
    { id: 'communication', label: 'Communication Log', icon: MessageSquare },
    { id: 'timeline', label: 'Live Timeline', icon: Clock },
  ];

  // Connected library loans for this student
  const studentLoans = borrowRecords.filter(b => b.studentId === student.id);
  // Connected bus info
  const studentBus = buses.find(b => b.id === student.transportDetails?.busNumber?.replace('Bus ', 'BUS-'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="student-360-modal"
        className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img 
                src={student.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`}
                alt={student.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-xs"
              />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                student.todayStatus === 'present' ? 'bg-emerald-500' : student.todayStatus === 'late' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{student.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {student.id}
                </span>
                {student.isNewAdmission && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    New Admission 2026-27
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>Class {student.className}</span>
                <span>•</span>
                <span>Roll #{student.rollNo || '-'}</span>
                <span>•</span>
                <span>Adm No: {student.admissionNo || 'ADM-2023'}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{student.house ? `House ${student.house}` : 'House Agni'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDigitalId(student)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="Generate Smart Identity Card"
            >
              <IdCard className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Digital ID</span>
            </button>

            <button
              onClick={() => onOpenQRCode(student)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="QR Pass"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">QR Code</span>
            </button>

            <button
              onClick={handlePrintDossier}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              title="Export / Print Dossier"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Print Dossier</span>
            </button>

            {onOpenClassEdit && (
              <button
                onClick={() => onOpenClassEdit(student)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer border border-blue-500 shadow-xs"
                title="Change Student Class & Section"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Change Class</span>
              </button>
            )}

            {onRequestRemove && (
              <button
                onClick={() => onRequestRemove(student)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 text-xs font-semibold transition-colors cursor-pointer border border-rose-700/60"
                title="Remove Student from School Roster"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Remove Student</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {printNotification && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center animate-pulse">
            ✓ Student 360° Comprehensive Dossier compiled. Ready for dispatch / print.
          </div>
        )}

        {/* Horizontal Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-1 shrink-0 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Top Alert Banner if any */}
              {student.smartAlerts && student.smartAlerts.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>System Attention Required</span>
                  </div>
                  <div className="space-y-1">
                    {student.smartAlerts.map((alt) => (
                      <p key={alt.id} className="text-xs text-rose-700 dark:text-rose-400 pl-6">
                        • {alt.message}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 4 Connected Operations Glance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Attendance Glance */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      Attendance
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{student.todayStatus.toUpperCase()}</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {student.attendancePercentage}%
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Last Absence: {student.lastAbsence || 'None in 30 days'}
                  </p>
                </div>

                {/* Academic Glance */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      Academics
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {student.academicStatus || 'Good'}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {student.academicAverage || 88.5}%
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Class Rank: #{student.academicRank || 5} of 42
                  </p>
                </div>

                {/* Library Glance */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      Library
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {student.libraryDetails?.overdueCount ? 'Overdue' : 'Good Standing'}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {student.libraryDetails?.activeIssuedCount ?? studentLoans.length} Issued
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {student.libraryDetails?.totalFinesPending ? `Fine Pending: ₹${student.libraryDetails.totalFinesPending}` : 'Zero Outstanding Fines'}
                  </p>
                </div>

                {/* Transport Glance */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-amber-500" />
                      Transport
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {student.transportDetails?.busNumber || student.transportRoute || 'Private'}
                    </span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white truncate">
                    {student.transportDetails?.stopName || 'Self / Private Commute'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pickup: {student.transportDetails?.morningPickupTime || '07:45 AM'}
                  </p>
                </div>
              </div>

              {/* Quick Contact & House Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Primary Guardian & Emergency Line
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{student.guardianName}</p>
                      <p className="text-xs text-slate-500">{student.family?.fatherOccupation || 'Guardian'}</p>
                    </div>
                    <button
                      onClick={() => onOpenMessage(student)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{student.guardianPhone}</span>
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{student.address || 'Bikaner, Rajasthan'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{student.family?.fatherEmail || 'guardian@smartschool.in'}</span>
                    </p>
                  </div>
                </div>

                {/* Internal Teacher Notes & Actions */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Counselor & Educator Quick Note
                    </h3>
                    {student.notes && student.notes.length > 0 ? (
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                        <p className="italic">"{student.notes[0].text}"</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                          — {student.notes[0].author}, {student.notes[0].date}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                    )}
                  </div>

                  <form onSubmit={handleCreateNote} className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add an educator observation..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL */}
          {activeTab === 'personal' && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Demographics & Institutional Enrollment
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Legal Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.dob || '14 Nov 2010'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Blood Group</span>
                  <span className="font-bold text-rose-600">{student.bloodGroup || 'B+'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gender</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.gender === 'M' ? 'Male' : 'Female'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Admission Number</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Admission Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.admissionDate || '10 Jun 2023'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Aadhaar / National ID</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{student.aadhaarNo || 'XXXX-XXXX-8821'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mother Tongue</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.motherTongue || 'Hindi'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nationality</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.nationality || 'Indian'}</span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 block text-[11px]">Permanent Residential Address</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{student.address || '42, Shanti Nagar, Near Clock Tower, Bikaner, Rajasthan 334001'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY & GUARDIANS */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Father */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500">
                      Father / Primary Guardian
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Primary Contact
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {student.family?.fatherName || student.guardianName}
                    </p>
                    <p className="text-slate-500">Occupation: {student.family?.fatherOccupation || 'Professional'}</p>
                    <p className="text-slate-700 dark:text-slate-300 font-mono">Phone: {student.family?.fatherPhone || student.guardianPhone}</p>
                    <p className="text-slate-500">Email: {student.family?.fatherEmail || 'guardian@smartschool.in'}</p>
                  </div>
                </div>

                {/* Mother */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-slate-500">
                      Mother
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Verified
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {student.family?.motherName || student.motherName || 'Anita Sharma'}
                    </p>
                    <p className="text-slate-500">Occupation: {student.family?.motherOccupation || 'Homemaker / Educator'}</p>
                    <p className="text-slate-700 dark:text-slate-300 font-mono">Phone: {student.family?.motherPhone || '+91 98290 11235'}</p>
                    <p className="text-slate-500">Email: {student.family?.motherEmail || 'mother@smartschool.in'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    Emergency Secondary Contact: {student.family?.emergencyContactName || 'Mahesh Sharma (Uncle)'}
                  </p>
                  <p className="text-amber-700 dark:text-amber-400">
                    Relationship: {student.family?.emergencyContactRelation || 'Uncle'} • Phone: {student.family?.emergencyContactPhone || '+91 94140 33811'}
                  </p>
                </div>
                <button
                  onClick={() => onOpenMessage(student)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Call / Notify
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Overall Attendance Rate</p>
                  <p className="text-3xl font-black text-blue-600 mt-1">{student.attendancePercentage}%</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">CBSE Minimum Requirement: 75%</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Working Days Present</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">118 / 123</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Excused Medical: 3 days</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Tardy / Late Swipes</p>
                  <p className="text-3xl font-black text-amber-600 mt-1">2 times</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Average Arrival: 07:52 AM</p>
                </div>
              </div>

              {/* Monthly Calendar Heatmap Representation */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Recent 14 Days Attendance Log (RFID Turnstile)
                </h4>
                <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const dayNum = 17 - i;
                    const isToday = i === 0;
                    const isAbsent = student.todayStatus === 'absent' && isToday;
                    const isLate = student.todayStatus === 'late' && isToday;
                    const isPastAbsent = (student.id === 'STU-1044' && (i === 3 || i === 7));
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border text-center ${
                          isAbsent || isPastAbsent
                            ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 text-rose-700'
                            : isLate
                            ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 text-amber-700'
                            : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-700'
                        }`}
                      >
                        <p className="text-[9px] font-bold opacity-75">{dayNum > 0 ? `${dayNum} Sep` : 'Aug'}</p>
                        <p className="text-xs font-black mt-0.5">
                          {isAbsent || isPastAbsent ? 'A' : isLate ? 'L' : 'P'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACADEMICS */}
          {activeTab === 'academics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">CBSE Term 1 Scorecard</h3>
                  <p className="text-xs text-slate-500">Cumulative GPA: {student.academicAverage ? (student.academicAverage / 10).toFixed(1) : '9.1'} / 10</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                  Rank #{student.academicRank || 2} in Class {student.className}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Max</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {(student.academicScores || [
                      { subject: 'Mathematics', score: 96, maxScore: 100, grade: 'A1', remarks: 'Exceptional in Problem Solving' },
                      { subject: 'Science', score: 92, maxScore: 100, grade: 'A1', remarks: 'Good in lab experiments' },
                      { subject: 'English', score: 90, maxScore: 100, grade: 'A1', remarks: 'Active in class debates' },
                      { subject: 'Social Science', score: 88, maxScore: 100, grade: 'A2', remarks: 'Consistent assignment submissions' }
                    ]).map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{row.subject}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{row.score}</td>
                        <td className="py-2.5 px-3 text-slate-400">{row.maxScore}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                            {row.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SMART LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart RFID Library Records</h3>
                  <p className="text-xs text-slate-500">Connected with School Central Circulation Desk</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Total Books Read: {student.libraryDetails?.totalReadCount || 18}
                  </span>
                  {student.libraryDetails?.totalFinesPending ? (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200">
                      Fine Due: ₹{student.libraryDetails.totalFinesPending}
                    </span>
                  ) : null}
                </div>
              </div>

              {studentLoans.length > 0 ? (
                <div className="space-y-2">
                  {studentLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                        loan.status === 'overdue'
                          ? 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className={`w-5 h-5 ${loan.status === 'overdue' ? 'text-rose-500' : 'text-blue-500'}`} />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{loan.bookTitle}</p>
                          <p className="text-[11px] text-slate-400">
                            Accession: {loan.bookId} • Borrowed: {loan.borrowDate} • Due: {loan.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          loan.status === 'overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {loan.status.toUpperCase()}
                        </span>
                        {loan.fine ? (
                          <p className="text-xs font-bold text-rose-600 mt-0.5">Fine: ₹{loan.fine}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                  No books currently issued or overdue. Student library account in good standing.
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SMART TRANSPORT */}
          {activeTab === 'transport' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bus className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {student.transportDetails?.busNumber || 'Bus 01'} — {student.transportDetails?.routeName || 'North Town Loop'}
                      </h4>
                      <p className="text-[11px] text-slate-400">RFID Auto-Log Enabled on Entry Door</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                    Active Commuter
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Designated Stop</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {student.transportDetails?.stopName || 'Subhash Nagar Circle'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Morning Pickup</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.transportDetails?.morningPickupTime || '07:35 AM'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Afternoon Drop</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.transportDetails?.afternoonDropTime || '03:15 PM'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Driver</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {student.transportDetails?.driverName || 'Amit Kumar'}
                    </span>
                  </div>
                </div>

                {studentBus && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Live Bus Status: <span className="text-emerald-600 font-bold">{studentBus.status.toUpperCase()}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">Speed: {studentBus.speed} km/h • Current Location: {studentBus.currentStop}</p>
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-semibold">{studentBus.id}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: FEE & DUES */}
          {activeTab === 'fee' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Total Annual Fee</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{student.feeDetails?.totalAnnual?.toLocaleString() || '72,000'}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Paid to Date</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">₹{student.feeDetails?.paidAmount?.toLocaleString() || '72,000'}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Pending / Overdue</p>
                  <p className={`text-2xl font-black mt-1 ${
                    student.feeDetails?.overdueAmount ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    ₹{student.feeDetails?.overdueAmount || student.feeDetails?.pendingAmount || 0}
                  </p>
                </div>
              </div>

              {/* Receipts Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Official Fee Receipts
                  </h4>
                  <span className="text-[11px] text-slate-400">Verified by Accounts</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {(student.feeDetails?.receipts && student.feeDetails.receipts.length > 0) ? (
                    student.feeDetails.receipts.map((rec) => (
                      <div key={rec.id} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{rec.term} — ₹{rec.amount.toLocaleString()}</p>
                          <p className="text-[11px] text-slate-400">Receipt: {rec.id} • Date: {rec.date} • Mode: {rec.mode}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs">Full clearance receipt issued at beginning of term.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: LEAVES & SANCTIONS */}
          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leave Applications & Approvals</h3>
                  <p className="text-xs text-slate-500">Sanctioned absences under school regulations</p>
                </div>
                <button
                  onClick={() => setShowLeaveForm(!showLeaveForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sanction New Leave</span>
                </button>
              </div>

              {showLeaveForm && (
                <form onSubmit={handleSubmittingLeave} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Submit Formal Leave Sanction
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Leave Category</label>
                      <select
                        value={leaveCategory}
                        onChange={(e) => setLeaveCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <option value="Medical">Medical Leave</option>
                        <option value="Casual">Casual Leave</option>
                        <option value="Sports">Official Sports Duty</option>
                        <option value="Family Function">Family Obligation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Duration (Days)</label>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={leaveDays}
                        onChange={(e) => setLeaveDays(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-500 mb-1">Reason / Description</label>
                      <input
                        type="text"
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        placeholder="e.g. Fever with doctor advice or State Athletics meet participation"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLeaveForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!leaveReason.trim()}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
                    >
                      Approve & Log Leave
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {(student.leaves && student.leaves.length > 0) ? (
                  student.leaves.map((lv) => (
                    <div key={lv.id} className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{lv.category} Leave ({lv.days} {lv.days === 1 ? 'day' : 'days'})</span>
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {lv.status}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{lv.reason}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Dates: {lv.startDate} to {lv.endDate} • Sanctioned by: {lv.approvedBy}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                    No leaves requested during current academic semester.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10 & 11: ACTIVITIES & ACHIEVEMENTS */}
          {(activeTab === 'activities' || activeTab === 'achievements') && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Co-Curricular, Sports & Honors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Achievements */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <h4 className="text-xs font-bold text-amber-600 flex items-center gap-1.5 uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Major Honors & Medals
                  </h4>
                  {(student.achievements && student.achievements.length > 0) ? (
                    student.achievements.map((ach) => (
                      <div key={ach.id} className="p-2.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">{ach.title}</p>
                        <p className="text-amber-700 dark:text-amber-400 text-[11px]">{ach.position} • {ach.date}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1">{ach.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No major external awards recorded this term.</p>
                  )}
                </div>

                {/* Clubs & Activities */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <h4 className="text-xs font-bold text-blue-600 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Clubs & Student Representation
                  </h4>
                  {(student.activities && student.activities.length > 0) ? (
                    student.activities.map((act) => (
                      <div key={act.id} className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
                        <p className="font-bold text-slate-900 dark:text-white">{act.title}</p>
                        <p className="text-blue-600 text-[11px]">{act.role} • {act.type}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{act.details}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Participates in regular house events.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: DISCIPLINE */}
          {activeTab === 'discipline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Disciplinary & Conduct Dossier</h3>
              {(student.disciplineRecords && student.disciplineRecords.length > 0) ? (
                student.disciplineRecords.map((dis) => (
                  <div key={dis.id} className={`p-4 rounded-xl border text-xs ${
                    dis.type === 'Positive Recognition'
                      ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20'
                      : 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{dis.category} ({dis.date})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dis.type === 'Positive Recognition' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {dis.type}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">{dis.description}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Reported by: {dis.reportedBy} • Action: {dis.actionTaken}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-400 text-xs">
                  ✓ Exemplary behavioral record. Zero disciplinary infractions logged.
                </div>
              )}
            </div>
          )}

          {/* TAB 13: HEALTH & MEDICAL */}
          {activeTab === 'health' && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  Campus Medical & Emergency Infirmary Record
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Blood Group: {student.bloodGroup || 'B+'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Known Allergies</span>
                  <span className="font-semibold text-rose-600">
                    {student.healthRecords?.allergies?.join(', ') || 'None recorded'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dietary Specifications</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {student.healthRecords?.dietaryRestrictions || 'Standard'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pediatrician Contact</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {student.healthRecords?.pediatricianName || 'Dr. Alok Sen (MD)'} ({student.healthRecords?.pediatricianPhone || '+91 94141 55221'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Vaccinations</span>
                  <span className="font-bold text-emerald-600">Up to date (Verified)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Infirmary Emergency Action Protocol</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {student.healthRecords?.emergencyActionPlan || 'In case of medical emergency, stabilize at school infirmary and notify parents immediately.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: DOCUMENTS VAULT */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Document Vault</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(student.documents && student.documents.length > 0) ? (
                  student.documents.map((doc) => (
                    <div key={doc.id} className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                      <div className="flex items-start gap-2.5">
                        <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[170px]">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.category} • {doc.fileSize}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                        <button
                          onClick={handlePrintDossier}
                          className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                    Standard admission documents archived in Central Registrar Vault.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 15: COMMUNICATION LOG */}
          {activeTab === 'communication' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Communication Audit Log</h3>
                  <p className="text-xs text-slate-500">Automated SMS, WhatsApp & Email messages to guardian</p>
                </div>
                <button
                  onClick={() => onOpenMessage(student)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Immediate Message</span>
                </button>
              </div>

              <div className="space-y-2">
                {(student.communications && student.communications.length > 0) ? (
                  student.communications.map((c) => (
                    <div key={c.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{c.subject}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {c.channel}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{c.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">To: {c.recipient} • Sent by: {c.sentBy} on {c.date} at {c.time}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Delivered
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                    No communication history dispatched in current cycle.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 16: LIVE TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chronological Activity Stream</h3>
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                {(student.timeline && student.timeline.length > 0) ? (
                  student.timeline.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900" />
                      <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{item.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.date} • {item.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <p className="font-bold text-slate-900 dark:text-white">RFID Turnstile Arrival Logged</p>
                    <p className="text-slate-500 mt-0.5">Recorded present at Campus South Entrance.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Today • 08:10 AM</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
