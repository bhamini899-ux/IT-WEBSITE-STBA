import { UserAccount, SystemRole } from '../types';

const USERS_STORAGE_KEY = 'stba_user_accounts_v1';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'ADMIN-001',
    name: 'School Administrator',
    username: 'SMART SCHOOL 360',
    passwordHash: 'SMART SCHOOL 360',
    role: 'Administrator',
    status: 'Active',
    createdAt: '2026-01-15',
    email: 'admin@bafna.edu.in',
    phone: '+91 94140 33001',
    designation: 'Head / Principal Office',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-1001',
    name: 'Natik Kothari',
    username: 'teacher.natik',
    passwordHash: 'teacher123',
    role: 'Teacher',
    status: 'Active',
    createdAt: '2026-03-01',
    teacherId: 'T-1001',
    employeeId: 'EMP-1001',
    department: 'Mathematics',
    designation: 'Class Teacher 10-A',
    subject: 'Mathematics',
    className: '10-A',
    classTeacherOf: '10-A',
    email: 'natik.kothari@bafna.edu.in',
    phone: '+91 98290 11001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-1002',
    name: 'Chitra Jain',
    username: 'teacher.chitra',
    passwordHash: 'teacher123',
    role: 'Teacher',
    status: 'Active',
    createdAt: '2026-03-01',
    teacherId: 'T-1002',
    employeeId: 'EMP-1002',
    department: 'English',
    designation: 'Class Teacher 10-B',
    subject: 'English',
    className: '10-B',
    classTeacherOf: '10-B',
    email: 'chitra.jain@bafna.edu.in',
    phone: '+91 98290 11002',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-1003',
    name: 'Bhuvnesh Sir',
    username: 'teacher.bhuvnesh',
    passwordHash: 'teacher123',
    role: 'Teacher',
    status: 'Active',
    createdAt: '2026-03-01',
    teacherId: 'T-1003',
    employeeId: 'EMP-1003',
    department: 'Science',
    designation: 'Class Teacher 10-E',
    subject: 'Science',
    className: '10-E',
    classTeacherOf: '10-E',
    email: 'bhuvnesh.sir@bafna.edu.in',
    phone: '+91 98290 11003',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-1004',
    name: 'Krishna Sharma',
    username: 'teacher.krishna',
    passwordHash: 'teacher123',
    role: 'Teacher',
    status: 'Active',
    createdAt: '2026-03-01',
    teacherId: 'T-1004',
    employeeId: 'EMP-1004',
    department: 'Science',
    designation: 'Class Teacher 10-C',
    subject: 'Science',
    className: '10-C',
    classTeacherOf: '10-C',
    email: 'krishna.sharma@bafna.edu.in',
    phone: '+91 98290 44104',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TCH-1005',
    name: 'Sanwarlal Prajapat',
    username: 'teacher.sanwarlal',
    passwordHash: 'teacher123',
    role: 'Teacher',
    status: 'Active',
    createdAt: '2026-03-01',
    teacherId: 'T-1005',
    employeeId: 'EMP-1005',
    department: 'Mathematics',
    designation: 'Class Teacher 10-D',
    subject: 'Mathematics',
    className: '10-D',
    classTeacherOf: '10-D',
    email: 'sanwarlal.prajapat@bafna.edu.in',
    phone: '+91 98290 44105',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'STU-1001',
    name: 'AASTHA',
    username: 'student.aastha',
    passwordHash: 'student123',
    role: 'Student',
    status: 'Active',
    createdAt: '2026-04-10',
    studentId: 'STU-10A-01',
    className: '10-A',
    section: 'A',
    rollNo: 1,
    parentId: 'PAR-1001',
    email: 'aastha@student.bafna.edu.in',
    phone: 'Not Provided',
    avatar: 'https://ui-avatars.com/api/?name=AASTHA&background=0284c7&color=ffffff&bold=true'
  },
  {
    id: 'PAR-1001',
    name: 'Guardian of AASTHA',
    username: 'parent.aastha',
    passwordHash: 'parent123',
    role: 'Parent',
    status: 'Active',
    createdAt: '2026-04-10',
    parentId: 'PAR-1001',
    linkedStudentIds: ['STU-10A-01'],
    email: 'guardian.aastha@gmail.com',
    phone: 'Not Provided',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export function getUserAccounts(): UserAccount[] {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure the Admin user and Class 10 default accounts are present
        const hasAdmin = parsed.some(u => u.username === 'SMART SCHOOL 360');
        if (!hasAdmin) {
          parsed.unshift(INITIAL_USER_ACCOUNTS[0]);
        }
        INITIAL_USER_ACCOUNTS.forEach(initUser => {
          if (!parsed.some(u => u.username === initUser.username)) {
            parsed.push(initUser);
          }
        });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load user accounts from storage', err);
  }
  // Initialize default
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USER_ACCOUNTS));
  } catch (err) {
    console.error('Failed to seed user accounts', err);
  }
  return INITIAL_USER_ACCOUNTS;
}

export function saveUserAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save user accounts', err);
  }
}

export function authenticateUser(
  usernameInput: string,
  passwordInput: string
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanUsername = usernameInput.trim();
  const cleanPassword = passwordInput.trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, error: 'Please enter your username and password.' };
  }

  const accounts = getUserAccounts();
  const matched = accounts.find(
    u => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );

  if (!matched || matched.passwordHash !== cleanPassword) {
    return { success: false, error: 'Invalid username or password.' };
  }

  if (matched.status === 'Inactive') {
    return {
      success: false,
      error: 'This account is currently inactive. Please contact the school administrator.'
    };
  }

  return { success: true, user: matched };
}

export function authenticateUserWithRole(
  identifierInput: string,
  passwordInput: string,
  selectedRole: SystemRole
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanId = identifierInput.trim();
  const cleanPassword = passwordInput.trim();

  if (!cleanId) {
    return { success: false, error: 'Please enter your ID.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Please enter your password.' };
  }

  const accounts = getUserAccounts();
  const lower = cleanId.toLowerCase();
  const matched = accounts.find(u => 
    u.username.toLowerCase() === lower ||
    (u.studentId && u.studentId.toLowerCase() === lower) ||
    (u.teacherId && u.teacherId.toLowerCase() === lower) ||
    (u.employeeId && u.employeeId.toLowerCase() === lower) ||
    (u.parentId && u.parentId.toLowerCase() === lower)
  );

  const roleName = selectedRole === 'Administrator' ? 'Admin' : selectedRole;

  if (!matched || matched.passwordHash !== cleanPassword || matched.role !== selectedRole) {
    return { 
      success: false, 
      error: `Invalid ${roleName} ID or password. Please check your credentials and try again.` 
    };
  }

  if (matched.status === 'Inactive') {
    return {
      success: false,
      error: 'This account is inactive. Please contact the school administrator.'
    };
  }

  return { success: true, user: matched };
}

export function createUserAccount(
  accountData: Omit<UserAccount, 'id' | 'createdAt'>
): { success: boolean; error?: string; user?: UserAccount } {
  const cleanUsername = accountData.username.trim();
  if (!cleanUsername) {
    return { success: false, error: 'Username is required.' };
  }
  if (!accountData.name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!accountData.passwordHash.trim()) {
    return { success: false, error: 'Password is required.' };
  }

  const accounts = getUserAccounts();
  const exists = accounts.some(
    u => u.username.toLowerCase() === cleanUsername.toLowerCase()
  );
  if (exists) {
    return {
      success: false,
      error: 'Username already exists. Please choose another username.'
    };
  }

  const prefix = accountData.role === 'Teacher' ? 'TCH' : accountData.role === 'Student' ? 'STU' : accountData.role === 'Parent' ? 'PAR' : 'ADM';
  const newAccount: UserAccount = {
    ...accountData,
    id: `${prefix}-${Date.now().toString().slice(-4)}`,
    username: cleanUsername,
    createdAt: new Date().toISOString().slice(0, 10),
    status: accountData.status || 'Active'
  };

  const updated = [newAccount, ...accounts];
  saveUserAccounts(updated);
  return { success: true, user: newAccount };
}

export function updateUserAccount(
  id: string,
  updates: Partial<UserAccount>
): { success: boolean; error?: string } {
  const accounts = getUserAccounts();
  const index = accounts.findIndex(u => u.id === id);
  if (index === -1) {
    return { success: false, error: 'User account not found.' };
  }

  // Check username collision if username is being changed
  if (updates.username && updates.username.toLowerCase() !== accounts[index].username.toLowerCase()) {
    const collision = accounts.some(
      u => u.id !== id && u.username.toLowerCase() === updates.username!.toLowerCase()
    );
    if (collision) {
      return { success: false, error: 'Username already exists. Please choose another username.' };
    }
  }

  accounts[index] = {
    ...accounts[index],
    ...updates
  };
  saveUserAccounts(accounts);
  return { success: true };
}

export function resetUserPassword(id: string, newPassword: string): boolean {
  if (!newPassword.trim()) return false;
  const accounts = getUserAccounts();
  const index = accounts.findIndex(u => u.id === id);
  if (index === -1) return false;

  accounts[index].passwordHash = newPassword.trim();
  saveUserAccounts(accounts);
  return true;
}

export function toggleUserAccountStatus(id: string): UserAccount | null {
  const accounts = getUserAccounts();
  const index = accounts.findIndex(u => u.id === id);
  if (index === -1) return null;

  accounts[index].status = accounts[index].status === 'Active' ? 'Inactive' : 'Active';
  saveUserAccounts(accounts);
  return accounts[index];
}

export function deleteUserAccount(id: string): boolean {
  const accounts = getUserAccounts();
  const filtered = accounts.filter(u => u.id !== id);
  if (filtered.length === accounts.length) return false;
  saveUserAccounts(filtered);
  return true;
}

const CURRENT_USER_SESSION_KEY = 'stba_active_session_v1';

export function getCurrentUserSession(): UserAccount | null {
  try {
    const data = localStorage.getItem(CURRENT_USER_SESSION_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.id && parsed.role) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load user session', err);
  }
  return null;
}

export function setCurrentUserSession(user: UserAccount): void {
  try {
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user session', err);
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear user session', err);
  }
}

