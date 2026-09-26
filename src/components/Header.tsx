import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  PlayCircle, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Mail, 
  ArrowLeft,
  Search,
  Users,
  GraduationCap,
  DoorOpen,
  BookOpen,
  X,
  Shield,
  HeartHandshake
} from 'lucide-react';
import { AppSection, SchoolNotification, Student, Teacher } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentSection: AppSection;
  onOpenMobileMenu: () => void;
  onNavigate: (section: AppSection) => void;
  onStartDemo: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: SchoolNotification[];
  onMarkAllRead: () => void;
  onOpenProfile: () => void;
  onReturnToLanding?: () => void;
  userRole?: 'Parent' | 'Teacher' | 'Administrator' | 'Student' | null;
  onSwitchRole?: (role: 'Administrator' | 'Teacher' | 'Student' | 'Parent') => void;
  students?: Student[];
  teachers?: Teacher[];
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onOpenMobileMenu,
  onNavigate,
  onStartDemo,
  darkMode,
  onToggleDarkMode,
  notifications,
  onMarkAllRead,
  onOpenProfile,
  onReturnToLanding,
  userRole = 'Administrator',
  onSwitchRole,
  students = [],
  teachers = [],
}) => {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user, gmailProfile } = useAuth();

  // Dynamic formatted date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Pre-defined Academy Rooms and Classes for Global Administrative Search
  const ACADEMY_ROOMS = [
    { name: 'Room 101 (Primary Wing)', building: 'Main Building Block A', section: 'timetable' as AppSection },
    { name: 'Room 102 (Junior Wing)', building: 'Main Building Block A', section: 'timetable' as AppSection },
    { name: 'Room 203 (Secondary Wing)', building: 'Academic Block B', section: 'timetable' as AppSection },
    { name: 'Room 204 (Class 10-B)', building: 'Academic Block B', section: 'timetable' as AppSection },
    { name: 'Room 205 (Senior Wing)', building: 'Academic Block B', section: 'timetable' as AppSection },
    { name: 'Room 301 (Senior Secondary)', building: 'Senior Wing Block C', section: 'timetable' as AppSection },
    { name: 'Physics & Robotics Lab', building: 'Science & Innovation Block', section: 'timetable' as AppSection },
    { name: 'Chemistry & Biology Lab', building: 'Science & Innovation Block', section: 'timetable' as AppSection },
    { name: 'Computer & AI Lab', building: 'Technology & AI Wing', section: 'timetable' as AppSection },
    { name: 'Central Library & Reading Hall', building: 'Academic Block B - 1st Floor', section: 'library' as AppSection },
    { name: 'Indoor Sports Arena & Auditorium', building: 'Activity Complex', section: 'timetable' as AppSection }
  ];

  const ACADEMY_CLASSES = [
    { name: 'Class 6-A & 6-B', wing: 'Middle Wing', section: 'academics' as AppSection },
    { name: 'Class 7-A & 7-B', wing: 'Middle Wing', section: 'academics' as AppSection },
    { name: 'Class 8-A & 8-B', wing: 'Middle Wing', section: 'academics' as AppSection },
    { name: 'Class 9-A & 9-B', wing: 'Secondary Wing', section: 'academics' as AppSection },
    { name: 'Class 10-A & 10-B', wing: 'Secondary Wing', section: 'academics' as AppSection },
    { name: 'Class 11-A (Science & Commerce)', wing: 'Senior Secondary', section: 'academics' as AppSection },
    { name: 'Class 12-A & 12-B', wing: 'Senior Secondary', section: 'academics' as AppSection }
  ];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Results Filtering across 4 categories: Students, Teachers, Rooms, Classes
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedStudents = students.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.className.toLowerCase().includes(q) || 
      (s.rollNo && s.rollNo.toString().includes(q))
    ).slice(0, 4);

    const matchedTeachers = teachers.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.subjects.some(sub => sub.toLowerCase().includes(q)) || 
      t.department.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedRooms = ACADEMY_ROOMS.filter(r => 
      r.name.toLowerCase().includes(q) || 
      r.building.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedClasses = ACADEMY_CLASSES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.wing.toLowerCase().includes(q)
    ).slice(0, 3);

    const totalCount = matchedStudents.length + matchedTeachers.length + matchedRooms.length + matchedClasses.length;

    return {
      students: matchedStudents,
      teachers: matchedTeachers,
      rooms: matchedRooms,
      classes: matchedClasses,
      totalCount
    };
  }, [searchQuery, students, teachers]);

  const handleSelectSearchResult = (section: AppSection) => {
    onNavigate(section);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const rolesList: { id: 'Administrator' | 'Teacher' | 'Student' | 'Parent'; label: string; icon: any }[] = [
    { id: 'Administrator', label: 'Admin', icon: Shield },
    { id: 'Teacher', label: 'Teacher', icon: GraduationCap },
    { id: 'Student', label: 'Student', icon: Users },
    { id: 'Parent', label: 'Parent', icon: HeartHandshake },
  ];

  const handleRoleChange = (newRole: 'Administrator' | 'Teacher' | 'Student' | 'Parent') => {
    if (onSwitchRole) {
      onSwitchRole(newRole);
    }
    // Route to the most appropriate section for this role
    if (newRole === 'Administrator') onNavigate('dashboard');
    else if (newRole === 'Teacher') onNavigate('teachers');
    else if (newRole === 'Student') onNavigate('students');
    else if (newRole === 'Parent') onNavigate('parent_connect');
  };

  const sectionTitles: Partial<Record<AppSection, { title: string; subtitle: string }>> = {
    dashboard: {
      title: 'School Command Center',
      subtitle: "Seth Tolaram Bafna Academy • Unified operations status today.",
    },
    students: {
      title: 'Student 360° Management',
      subtitle: 'One intelligent digital identity connected across all school operations.',
    },
    teachers: {
      title: 'Faculty & Staff 360°',
      subtitle: 'Comprehensive teacher profiles, live biometric attendance, leave workflow, and workload analytics.',
    },
    academics: {
      title: 'Academics & Examination 360°',
      subtitle: 'Complete academic performance, examination planning, assessment and learning intelligence.',
    },
    parents: {
      title: 'Parent & Guardian 360°',
      subtitle: 'Connected parent communication, student updates, notifications, approvals and engagement.',
    },
    parent_connect: {
      title: 'Parent Connect 360° (Module 7)',
      subtitle: 'Personalized mobile-first parent dashboard for live gate telemetry, attendance, transport, academics, fees, and communication.',
    },
    timetable: {
      title: 'Smart Timetable & Substitution',
      subtitle: 'Interactive master schedule with live conflict resolution and intelligent AI substitution engine.',
    },
    attendance: {
      title: 'Smart Attendance',
      subtitle: 'Monitor attendance, identify patterns and keep parents informed.',
    },
    library: {
      title: 'Smart Library',
      subtitle: 'Find, issue and manage books effortlessly.',
    },
    transport: {
      title: 'Smart Transport',
      subtitle: 'Track school buses, routes and student safety in one place.',
    },
    energy: {
      title: 'Smart Energy',
      subtitle: 'Monitor consumption and reduce unnecessary energy usage.',
    },
    notifications: {
      title: 'Notification Center',
      subtitle: 'System alerts, safety triggers, and automated updates.',
    },
    settings: {
      title: 'System Settings',
      subtitle: 'Manage academy profile, module thresholds, and preferences.',
    },
    profile: {
      title: 'Administrator Profile',
      subtitle: 'Academic security credentials and management role.',
    },
  };

  const currentInfo = sectionTitles[currentSection] || {
    title: 'School Command Center',
    subtitle: "Seth Tolaram Bafna Academy • Unified operations status.",
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="px-3 sm:px-5 lg:px-7 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile menu toggle & Module title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            id="mobile-menu-toggle"
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight font-sans truncate">
                {currentInfo.title}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xl:block truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Global Administrative Search (Students, Teachers, Rooms, Classes) */}
        <div ref={searchRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="global-admin-search-input"
              type="text"
              placeholder="Search students, faculty, rooms, classes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown Menu */}
          {isSearchOpen && searchResults && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
              {searchResults.totalCount === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matches found for "{searchQuery}". Try a student name, teacher, room (e.g. "Physics Lab"), or class (e.g. "10-B").
                </div>
              ) : (
                <>
                  {/* Students Category */}
                  {searchResults.students.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span>Students ({searchResults.students.length})</span>
                      </div>
                      {searchResults.students.map(s => (
                        <div
                          key={s.id}
                          onClick={() => handleSelectSearchResult('students')}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center">
                              {s.name.charAt(0)}
                            </span>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                              <p className="text-[10px] text-slate-500">Class {s.className} • Roll #{s.rollNo}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">View 360°</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Teachers Category */}
                  {searchResults.teachers.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3 h-3 text-emerald-500" />
                        <span>Faculty & Staff ({searchResults.teachers.length})</span>
                      </div>
                      {searchResults.teachers.map(t => (
                        <div
                          key={t.id}
                          onClick={() => handleSelectSearchResult('teachers')}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center">
                              {t.name.charAt(0)}
                            </span>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{t.name}</p>
                              <p className="text-[10px] text-slate-500">{t.subjects?.join(', ') || t.department} • {t.designation}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Profile</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rooms & Labs Category */}
                  {searchResults.rooms.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <DoorOpen className="w-3 h-3 text-amber-500" />
                        <span>Rooms & Labs ({searchResults.rooms.length})</span>
                      </div>
                      {searchResults.rooms.map((r, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSearchResult(r.section)}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                            <p className="text-[10px] text-slate-500">{r.building}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Timetable</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Classes Category */}
                  {searchResults.classes.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-purple-500" />
                        <span>Academic Classes ({searchResults.classes.length})</span>
                      </div>
                      {searchResults.classes.map((c, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSearchResult(c.section)}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                            <p className="text-[10px] text-slate-500">{c.wing}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">Academics</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right action bar: Role Switcher, Entrance, Notifications, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Obvious & Testable Role Switcher (Section 11) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] font-black uppercase text-slate-400 px-2 py-1 select-none">
              Role:
            </span>
            {rolesList.map((r) => {
              const isSelected = (userRole || 'Administrator') === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  id={`role-switcher-${r.id.toLowerCase()}`}
                  onClick={() => handleRoleChange(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs font-extrabold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={`Switch view context to ${r.label}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Academy Entrance / Home Link */}
          {onReturnToLanding && (
            <button
              id="header-entrance-btn"
              onClick={onReturnToLanding}
              title="Return to Academy Entrance Screen"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">Entrance</span>
            </button>
          )}

          {/* Start Demo Button */}
          <button
            id="header-start-demo-btn"
            onClick={onStartDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo</span>
          </button>

          {/* Theme switcher */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Gmail Status / Notifications shortcut */}
          <button
            id="header-gmail-btn"
            onClick={() => onNavigate('notifications')}
            title={user ? `Gmail Active: ${gmailProfile?.emailAddress || user.email}` : 'Google Workspace Gmail Gateway'}
            className="relative p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Gmail Notifications Gateway"
          >
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {user && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notification dropdown */}
          <div className="relative">
            <button
              id="header-notification-btn"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="relative p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotificationDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotificationDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        School Alerts & Activity
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {unreadCount} unread system notifications
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllRead}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNavigate(notif.targetSection);
                          setShowNotificationDropdown(false);
                        }}
                        className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start gap-2.5 ${
                          !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {notif.severity === 'high' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setShowNotificationDropdown(false);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      View All Notifications ({notifications.length})
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Profile Avatar */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
            title="School Administrator"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
