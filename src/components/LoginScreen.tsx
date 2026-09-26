import React, { useState } from 'react';
import { 
  School, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  KeyRound, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  BookOpen, 
  HeartHandshake, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, SystemRole } from '../types';
import { authenticateUserWithRole } from '../services/userService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (role: SystemRole) => {
    setSelectedRole(role);
    setUsername('');
    setPassword('');
    setError('');
    setSuccessMessage('');
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setError('');
    setSuccessMessage('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedRole) {
      setError('Please select a portal first.');
      return;
    }

    if (!username.trim()) {
      setError('Please enter your ID.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUserWithRole(username, password, selectedRole);
      setIsLoading(false);

      if (result.success && result.user) {
        setSuccessMessage('Login successful. Redirecting...');
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 400);
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 py-10 transition-colors">
      <div className="w-full max-w-lg">
        {/* Main Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-7 sm:p-9 relative overflow-hidden">
          {/* Top Indicator Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

          {/* School Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-blue-500/25">
              <School className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              SMART SCHOOL 360°
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              Seth Tolaram Bafna Academy — Digital School System
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Secure Role-Based Portal</span>
            </div>
          </div>

          {/* STEP 1: Portal Selection (When no role selected) */}
          {!selectedRole && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center mb-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  SELECT YOUR PORTAL
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Choose your designated role to enter credentials
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Admin Portal Card */}
                <button
                  id="select-portal-admin"
                  type="button"
                  onClick={() => handleSelectRole('Administrator')}
                  className="p-4 rounded-2xl border border-purple-200/80 dark:border-purple-800/60 bg-purple-50/50 hover:bg-purple-100/70 dark:bg-purple-950/30 text-left transition-all cursor-pointer group hover:shadow-md hover:border-purple-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2.5 shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-black text-purple-950 dark:text-purple-200">
                    Admin Portal
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300/80 mt-0.5 font-medium">
                    Secure administrator access
                  </div>
                </button>

                {/* Teacher Portal Card */}
                <button
                  id="select-portal-teacher"
                  type="button"
                  onClick={() => handleSelectRole('Teacher')}
                  className="p-4 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 bg-blue-50/50 hover:bg-blue-100/70 dark:bg-blue-950/30 text-left transition-all cursor-pointer group hover:shadow-md hover:border-blue-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2.5 shadow-sm">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-black text-blue-950 dark:text-blue-200">
                    Teacher Portal
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300/80 mt-0.5 font-medium">
                    Faculty access
                  </div>
                </button>

                {/* Student Portal Card */}
                <button
                  id="select-portal-student"
                  type="button"
                  onClick={() => handleSelectRole('Student')}
                  className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/50 hover:bg-emerald-100/70 dark:bg-emerald-950/30 text-left transition-all cursor-pointer group hover:shadow-md hover:border-emerald-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2.5 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                    Student Portal
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5 font-medium">
                    Student access
                  </div>
                </button>

                {/* Parent Portal Card */}
                <button
                  id="select-portal-parent"
                  type="button"
                  onClick={() => handleSelectRole('Parent')}
                  className="p-4 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/50 hover:bg-amber-100/70 dark:bg-amber-950/30 text-left transition-all cursor-pointer group hover:shadow-md hover:border-amber-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2.5 shadow-sm">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-black text-amber-950 dark:text-amber-200">
                    Parent Portal
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5 font-medium">
                    Parent access
                  </div>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[11px] text-slate-400">
                  Select a portal above to enter your credentials. Credentials are role-verified.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 & 3: Role-Specific Login Form (When a role is selected) */}
          {selectedRole && (
            <div className="animate-in fade-in duration-200">
              {/* Role Title Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    {selectedRole === 'Administrator' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                    {selectedRole === 'Teacher' && <GraduationCap className="w-4 h-4 text-blue-600" />}
                    {selectedRole === 'Student' && <BookOpen className="w-4 h-4 text-emerald-600" />}
                    {selectedRole === 'Parent' && <HeartHandshake className="w-4 h-4 text-amber-600" />}
                    <span>{selectedRole === 'Administrator' ? 'Admin' : selectedRole} Portal Login</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your {selectedRole.toLowerCase()} credentials to authenticate
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBackToRoles}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role</span>
                </button>
              </div>

              {/* Error Message Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Quick Demo Credentials Assistant */}
              <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quick Demo Accounts ({selectedRole === 'Administrator' ? 'Admin' : selectedRole})
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Tap to autofill</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRole === 'Teacher' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('teacher.natik');
                          setPassword('teacher123');
                          setError('');
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Natik K. (10-A)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('teacher.chitra');
                          setPassword('teacher123');
                          setError('');
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Chitra J. (10-B)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('teacher.krishna');
                          setPassword('teacher123');
                          setError('');
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Krishna S. (10-C)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('teacher.sanwarlal');
                          setPassword('teacher123');
                          setError('');
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Sanwarlal P. (10-D)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUsername('teacher.bhuvnesh');
                          setPassword('teacher123');
                          setError('');
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        Bhuvnesh S. (10-E)
                      </button>
                    </>
                  )}
                  {selectedRole === 'Administrator' && (
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('SMART SCHOOL 360');
                        setPassword('SMART SCHOOL 360');
                        setError('');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-500 hover:text-purple-600 transition-colors cursor-pointer"
                    >
                      Admin (SMART SCHOOL 360)
                    </button>
                  )}
                  {selectedRole === 'Student' && (
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('student.aastha');
                        setPassword('student123');
                        setError('');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      Aastha (Class 10-A Roll #1)
                    </button>
                  )}
                  {selectedRole === 'Parent' && (
                    <button
                      type="button"
                      onClick={() => {
                        setUsername('parent.aastha');
                        setPassword('parent123');
                        setError('');
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      Guardian of Aastha
                    </button>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {selectedRole === 'Administrator' ? 'Admin ID / Username' : `${selectedRole} ID / Username`}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      autoFocus
                      placeholder={`Enter ${selectedRole === 'Administrator' ? 'Admin' : selectedRole} ID`}
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <button
                  id="signin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleBackToRoles}
                    className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Portal Selection</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="mt-6 text-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            Official Bafna Academy Security • Accounts & passwords are managed by School Administrator.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center mt-5">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            SMART SCHOOL 360° • Seth Tolaram Bafna Academy, Bikaner
          </p>
        </div>
      </div>
    </div>
  );
};
