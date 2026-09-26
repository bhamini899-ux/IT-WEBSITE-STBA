import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Key, 
  ShieldCheck, 
  UserX, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  BookOpen, 
  HeartHandshake, 
  CheckCircle2, 
  AlertCircle,
  X,
  Lock,
  Upload,
  RefreshCw
} from 'lucide-react';
import { UserAccount, SystemRole, Teacher, Student } from '../types';
import { 
  getUserAccounts, 
  createUserAccount, 
  updateUserAccount, 
  resetUserPassword, 
  toggleUserAccountStatus, 
  deleteUserAccount 
} from '../services/userService';

interface UserManagementViewProps {
  teachers: Teacher[];
  students: Student[];
  onAddTeacher?: (newTeacher: Partial<Teacher>) => void;
  onAddStudent?: (newStudent: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  teachers,
  students,
  onAddTeacher,
  onAddStudent,
  onDeleteStudent,
  onShowToast
}) => {
  const [users, setUsers] = useState<UserAccount[]>(getUserAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | SystemRole>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // Form State for New User
  const [userType, setUserType] = useState<SystemRole>('Teacher');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [avatar, setAvatar] = useState('');

  // Teacher specific fields
  const [employeeId, setEmployeeId] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [department, setDepartment] = useState('Mathematics');
  const [designation, setDesignation] = useState('PGT');
  const [subject, setSubject] = useState('Mathematics');
  const [assignedClass, setAssignedClass] = useState('10-B');

  // Student specific fields
  const [studentId, setStudentId] = useState(`STU-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [studentClass, setStudentClass] = useState('10');
  const [studentSection, setStudentSection] = useState('B');
  const [rollNo, setRollNo] = useState('15');

  // Parent specific fields
  const [parentId, setParentId] = useState(`PAR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [linkedChildIds, setLinkedChildIds] = useState<string[]>([]);

  // Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formError, setFormError] = useState('');

  // Reload user list from service
  const refreshUsers = () => {
    setUsers(getUserAccounts());
  };

  // Metrics
  const totalUsers = users.length;
  const teacherCount = users.filter(u => u.role === 'Teacher').length;
  const studentCount = users.filter(u => u.role === 'Student').length;
  const parentCount = users.filter(u => u.role === 'Parent').length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesQuery = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setName('');
    setUsername('');
    setPassword('');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setAvatar('');
    setFormError('');
    setShowPassword(false);
    setUserType('Teacher');
    setEmployeeId(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setStudentId(`STU-2026-${Math.floor(100 + Math.random() * 900)}`);
    setParentId(`PAR-${Math.floor(1000 + Math.random() * 9000)}`);
    setLinkedChildIds([]);
    setIsCreateModalOpen(true);
  };

  // Submit Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !username.trim() || !password.trim()) {
      setFormError('Please fill in Full Name, Username, and Password.');
      return;
    }

    if (password.length < 4) {
      setFormError('Password must be at least 4 characters long.');
      return;
    }

    const payload: Omit<UserAccount, 'id' | 'createdAt'> = {
      name: name.trim(),
      username: username.trim(),
      passwordHash: password.trim(),
      role: userType,
      status,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      avatar: avatar || undefined
    };

    if (userType === 'Teacher') {
      payload.employeeId = employeeId.trim();
      payload.department = department;
      payload.designation = designation;
      payload.subject = subject;
      payload.className = assignedClass;
      payload.teacherId = `T-${employeeId.replace('EMP-', '')}`;

      // Also register teacher into system if handler provided
      if (onAddTeacher) {
        onAddTeacher({
          employeeId: payload.employeeId,
          name: payload.name,
          department: payload.department as any,
          designation: payload.designation as any,
          subjects: [subject],
          classes: [assignedClass],
          email: payload.email || `${username}@bafna.edu.in`,
          phone: payload.phone || '+91 98290 00000',
          avatar: payload.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          currentStatus: 'Present',
          attendanceToday: 'Present',
          attendanceRate: 100,
          workloadWeekly: 20,
          maxWorkloadWeekly: 28,
          joiningDate: new Date().toISOString().slice(0, 10),
          room: 'Staff Room 2',
          qualification: 'M.Sc., B.Ed.'
        });
      }
    } else if (userType === 'Student') {
      payload.studentId = studentId.trim();
      payload.className = studentClass;
      payload.section = studentSection;
      payload.rollNo = parseInt(rollNo, 10) || 1;

      // Also register student into master students list if handler provided
      if (onAddStudent) {
        onAddStudent({
          id: payload.studentId,
          name: payload.name,
          rollNumber: payload.rollNo,
          class: payload.className,
          className: payload.className,
          section: payload.section,
          gender: 'M',
          bloodGroup: 'B+',
          dob: '2010-01-01',
          fatherName: 'Guardian',
          motherName: 'Guardian',
          parentContact: payload.phone || '+91 98290 11111',
          parentEmail: payload.email || `${username}@bafna.edu.in`,
          address: 'Bikaner, Rajasthan',
          admissionDate: new Date().toISOString().slice(0, 10),
          attendancePercentage: 100,
          academicStatus: 'Good',
          feeStatus: 'Paid',
          totalFeesDue: 0,
          tags: ['Newly Enrolled'],
          avatar: payload.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          emergencyContact: payload.phone || '+91 98290 11111',
          todayStatus: 'present',
          lastAbsence: 'None',
          guardianName: 'Guardian',
          guardianPhone: payload.phone || '+91 98290 11111'
        });
      }
    } else if (userType === 'Parent') {
      payload.parentId = parentId.trim();
      payload.linkedStudentIds = linkedChildIds;
    }

    const res = createUserAccount(payload);
    if (!res.success) {
      setFormError(res.error || 'Failed to create user account.');
      return;
    }

    refreshUsers();
    setIsCreateModalOpen(false);
    onShowToast(
      'User Account Created', 
      `${payload.name} (${userType}) can now log in using username "${payload.username}".`, 
      'success'
    );
  };

  // Toggle Account Status
  const handleToggleStatus = (user: UserAccount) => {
    if (user.role === 'Administrator' && user.username === 'SMART SCHOOL 360') {
      onShowToast('Action Blocked', 'Main demo administrator account cannot be deactivated.', 'warning');
      return;
    }
    const updated = toggleUserAccountStatus(user.id);
    if (updated) {
      refreshUsers();
      onShowToast(
        `Account ${updated.status}`, 
        `User ${updated.name}'s account is now marked as ${updated.status.toLowerCase()}.`, 
        updated.status === 'Active' ? 'success' : 'info'
      );
    }
  };

  // Open Reset Password Modal
  const handleOpenResetPassword = (user: UserAccount) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowResetPassword(false);
    setFormError('');
    setIsResetPasswordModalOpen(true);
  };

  // Save Reset Password
  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!newPassword.trim()) {
      setFormError('Please enter a new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('New password and confirm password do not match.');
      return;
    }

    const ok = resetUserPassword(selectedUser.id, newPassword);
    if (ok) {
      refreshUsers();
      setIsResetPasswordModalOpen(false);
      onShowToast('Password Reset Successfully', `Password updated for ${selectedUser.name}.`, 'success');
    } else {
      setFormError('Failed to reset password. Please try again.');
    }
  };

  // Delete User
  const handleDeleteUser = (user: UserAccount) => {
    if (user.role === 'Administrator') {
      onShowToast('Action Blocked', 'Administrator account cannot be deleted.', 'error');
      return;
    }
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    deleteUserAccount(userToDelete.id);
    if (userToDelete.role === 'Student' && userToDelete.studentId && onDeleteStudent) {
      onDeleteStudent(userToDelete.studentId);
    }
    refreshUsers();
    onShowToast('User Deleted', `Account @${userToDelete.username} has been removed.`, 'info');
    setUserToDelete(null);
  };

  // Role Badge Styling
  const getRoleBadge = (role: SystemRole) => {
    switch (role) {
      case 'Administrator':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'Teacher':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'Student':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'Parent':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 text-[11px] font-extrabold uppercase tracking-wide">
              Security & Accounts
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Role Separation & Access Control
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            User Management & Credentials
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Admin controls all school credentials. Create separate accounts for Teachers, Students, and Parents.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            id="create-user-btn"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Users</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalUsers}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Authorized Accounts</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Teachers</div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1">{teacherCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Faculty Portals</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Students</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{studentCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Student Portals</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Parents</div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">{parentCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Parent Connect</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Active</div>
          <div className="text-2xl font-black text-teal-700 dark:text-teal-300 mt-1">{activeCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Login Permitted</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Inactive</div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">{inactiveCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Access Suspended</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Username, ID, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-bold text-slate-900 dark:text-white focus:ring-0 cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-bold text-slate-900 dark:text-white focus:ring-0 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">ID & Entity Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">No user accounts found matching your filters.</p>
                    <p className="text-[11px] mt-1">Click "+ Create User Account" to add teachers, students, or parents.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr 
                    key={user.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700" 
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{user.email || 'No email specified'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-semibold text-[11px]">
                        @{user.username}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                        {user.employeeId || user.studentId || user.parentId || user.id}
                      </span>
                      {user.department && (
                        <p className="text-[10px] text-slate-400">{user.department} • {user.designation}</p>
                      )}
                      {user.className && (
                        <p className="text-[10px] text-slate-400">Class {user.className}{user.section ? `-${user.section}` : ''}</p>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {user.createdAt}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          title="Reset Password"
                          onClick={() => handleOpenResetPassword(user)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        <button
                          title={user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.status === 'Active' 
                              ? 'hover:bg-rose-50 text-slate-500 hover:text-rose-600' 
                              : 'hover:bg-emerald-50 text-slate-500 hover:text-emerald-600'
                          }`}
                        >
                          {user.status === 'Active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>

                        {user.role !== 'Administrator' && (
                          <button
                            title="Delete User"
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================================
          MODAL 1: CREATE USER MODAL
          ======================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 sm:p-7 relative my-8">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Admin Control
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Create New School Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Assign role, credentials, and academic profile links. The user can immediately sign in.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Teacher', 'Student', 'Parent'] as SystemRole[]).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setUserType(r)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        userType === r
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'Teacher' && <GraduationCap className="w-4 h-4" />}
                      {r === 'Student' && <BookOpen className="w-4 h-4" />}
                      {r === 'Parent' && <HeartHandshake className="w-4 h-4" />}
                      <span>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={userType === 'Teacher' ? 'e.g. Rajesh Sharma' : userType === 'Student' ? 'e.g. Aarav Sharma' : 'e.g. Mr. Rakesh Sharma'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={userType === 'Teacher' ? 'teacher.rajesh' : userType === 'Student' ? 'student.aarav' : 'parent.sharma'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@bafna.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / Contact
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98290 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Role-Specific Sections */}
              {userType === 'Teacher' && (
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50 space-y-3">
                  <div className="text-xs font-extrabold text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                    Teacher Academic Assignment
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Computer Science & AI">Computer Science & AI</option>
                        <option value="Arts & Physical Ed">Arts & Physical Ed</option>
                        <option value="Commerce">Commerce</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Designation
                      </label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <option value="PGT">PGT</option>
                        <option value="TGT">TGT</option>
                        <option value="PRT">PRT</option>
                        <option value="Activity Teacher">Activity Teacher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Assigned Class
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10-B"
                        value={assignedClass}
                        onChange={(e) => setAssignedClass(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {userType === 'Student' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 space-y-3">
                  <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                    Student Academic Enrollment
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Student ID
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Class & Section
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          placeholder="10"
                          className="w-1/2 px-2 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        />
                        <input
                          type="text"
                          value={studentSection}
                          onChange={(e) => setStudentSection(e.target.value)}
                          placeholder="B"
                          className="w-1/2 px-2 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Roll No.
                      </label>
                      <input
                        type="number"
                        value={rollNo}
                        onChange={(e) => setRollNo(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {userType === 'Parent' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 space-y-3">
                  <div className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                    Linked Child / Student Access
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Select which student(s) this parent account can view in the Parent Portal:
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {students.slice(0, 15).map(s => {
                      const isSelected = linkedChildIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            if (isSelected) {
                              setLinkedChildIds(linkedChildIds.filter(id => id !== s.id));
                            } else {
                              setLinkedChildIds([...linkedChildIds, s.id]);
                            }
                          }}
                          className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-100/70 dark:bg-amber-900/40 border-amber-300 text-amber-900 dark:text-amber-200 font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-400">{s.id}</span>
                            <span>{s.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">Class {s.class}-{s.section}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {avatar ? (
                    <img src={avatar} alt="Preview" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Upload className="w-4 h-4" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Save & Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL 2: RESET PASSWORD MODAL
          ======================================================= */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 sm:p-7 relative">
            <button
              onClick={() => setIsResetPasswordModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3">
              <Key className="w-5 h-5" />
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter a new secure password for <strong className="text-slate-800 dark:text-slate-200">{selectedUser.name}</strong> (@{selectedUser.username}). Existing password remains masked.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL 4: DELETE USER CONFIRMATION MODAL
          ======================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/50 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-900 to-slate-900 text-white p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <h3 className="text-sm font-black">Delete Account: {userToDelete.name}</h3>
                <p className="text-[11px] text-rose-200/80">@{userToDelete.username} ({userToDelete.role})</p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-rose-800 dark:text-rose-300 text-[11px] leading-relaxed">
                  Are you sure you want to delete user account <strong className="font-bold">"{userToDelete.name}"</strong> (@{userToDelete.username})?
                  {userToDelete.role === 'Student' && ' This will also remove the student enrollment from academy registers.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
