import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Clock, 
  Calendar, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  Search, 
  Filter,
  Check,
  X,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StaffMember, TeacherLeaveRequest, StaffAttendanceStatus, Teacher } from '../../types';

interface StaffAttendancePanelProps {
  staffMembers: StaffMember[];
  leaveRequests: TeacherLeaveRequest[];
  onUpdateStaffStatus: (staffId: string, newStatus: StaffAttendanceStatus) => void;
  onApproveLeave: (leave: TeacherLeaveRequest) => void;
  onRejectLeave: (leaveId: string) => void;
  onSimulateQrScan?: () => void;
  onOpenSubstitutionCenter?: () => void;
}

export const StaffAttendancePanel: React.FC<StaffAttendancePanelProps> = ({
  staffMembers,
  leaveRequests,
  onUpdateStaffStatus,
  onApproveLeave,
  onRejectLeave,
  onSimulateQrScan,
  onOpenSubstitutionCenter
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Teacher' | 'Administrative' | 'Support'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Compute stats
  const totalStaff = staffMembers.length;
  const presentStaff = staffMembers.filter(s => s.status === 'Present' || s.status === 'On Duty').length;
  const lateStaff = staffMembers.filter(s => s.status === 'Late').length;
  const absentStaff = staffMembers.filter(s => s.status === 'Absent').length;
  const onLeaveStaff = staffMembers.filter(s => s.status === 'On Leave').length;
  const attendanceRate = totalStaff > 0 ? ((presentStaff / totalStaff) * 100).toFixed(1) : '0';

  // Filter staff list
  const filteredStaff = staffMembers.filter(s => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');

  const handleSimulateScan = () => {
    setScannerActive(true);
    setTimeout(() => {
      // Find someone who is marked Late or Absent or pick someone
      const target = staffMembers.find(s => s.status === 'Late' || s.status === 'Absent') || staffMembers[0];
      if (target) {
        onUpdateStaffStatus(target.id, 'Present');
        setScanSuccessMessage(`Biometric verified: ${target.name} (${target.employeeId}) logged at Main Gate 1.`);
      }
      setScannerActive(false);
      setTimeout(() => setScanSuccessMessage(null), 4000);
    }, 800);
  };

  const getStatusColor = (status: StaffAttendanceStatus) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'Late':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'Absent':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'On Leave':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'On Duty':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'Half Day':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Attendance Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Staff</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalStaff}</p>
          <span className="text-[11px] text-slate-400">148 Faculty + 42 Support</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Present Today</span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{presentStaff}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold">{attendanceRate}% Rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/60 shadow-xs">
          <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Absent Today</span>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-1">{absentStaff}</p>
          <span className="text-[11px] text-rose-600 dark:text-rose-500 font-bold">Unplanned absence</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 shadow-xs">
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Sanctioned Leave</span>
          <p className="text-2xl font-black text-purple-700 dark:text-purple-400 mt-1">{onLeaveStaff}</p>
          <span className="text-[11px] text-purple-600 dark:text-purple-500 font-bold">Approved in advance</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Late Arrival</span>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">{lateStaff}</p>
          <span className="text-[11px] text-amber-600 dark:text-amber-500">Transit delay</span>
        </div>
      </div>

      {/* Leave Approval Alerts (Requirement 10: Automatic Substitution creation) */}
      {pendingLeaves.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Pending Staff Leave Requests ({pendingLeaves.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full">
              Requires Admin Sanction
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            <strong>Note:</strong> Approving any teacher leave for today will automatically scan their teaching schedule and generate <strong>Substitution Required</strong> slots in the Substitution Center.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingLeaves.map(leave => (
              <div key={leave.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{leave.teacherName}</h4>
                      <p className="text-[11px] text-slate-500">{leave.department} • {leave.employeeId}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                      {leave.leaveType} Leave ({leave.days}d)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                    "{leave.reason}"
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Dates: {leave.startDate} to {leave.endDate} • {leave.affectedPeriodsCount} teaching period(s) affected today
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onRejectLeave(leave.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApproveLeave(leave)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Auto-Substitute</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Attendance Toolbar & Gate Scanner Simulator */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['All', 'Teacher', 'Administrative', 'Support'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'All Staff (190)' : cat === 'Teacher' ? 'Faculty (148)' : cat === 'Administrative' ? 'Admin (8)' : 'Support (34)'}
              </button>
            ))}
          </div>

          {/* Quick Scanner Simulator Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateScan}
              disabled={scannerActive}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <QrCode className={`w-3.5 h-3.5 ${scannerActive ? 'animate-spin' : ''}`} />
              <span>Simulate Gate RFID/QR Scan</span>
            </button>
          </div>
        </div>

        {scanSuccessMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scanSuccessMessage}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name, employee code, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Staff Attendance Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200/80 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Role & Category</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Gate Check-In Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Update Today's Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.slice(0, 20).map(member => (
                <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{member.name}</p>
                        <span className="text-[10px] font-mono text-slate-400">{member.employeeId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{member.designation}</p>
                    <span className="text-[10px] text-slate-400">{member.category}</span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                    {member.department}
                  </td>

                  <td className="py-2.5 px-3">
                    {member.checkInTime ? (
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{member.checkInTime}</span>
                    ) : (
                      <span className="text-slate-400 italic">Not checked in</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onUpdateStaffStatus(member.id, 'Present')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          member.status === 'Present' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                        title="Mark Present"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => onUpdateStaffStatus(member.id, 'Late')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          member.status === 'Late' 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
                        }`}
                        title="Mark Late"
                      >
                        Late
                      </button>
                      <button
                        onClick={() => onUpdateStaffStatus(member.id, 'Absent')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          member.status === 'Absent' 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-rose-100 hover:text-rose-800'
                        }`}
                        title="Mark Absent"
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => onUpdateStaffStatus(member.id, 'On Leave')}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                          member.status === 'On Leave'
                            ? 'bg-purple-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-purple-100 hover:text-purple-800'
                        }`}
                        title="Mark On Leave"
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 text-center">
          Showing 20 of {filteredStaff.length} staff records • Verified by RFID Gate 1 Access Controllers
        </div>
      </div>
    </div>
  );
};
