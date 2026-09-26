import React from 'react';
import { 
  LayoutDashboard, 
  Users,
  UserCheck, 
  BookOpen, 
  Bus, 
  Zap, 
  Bell, 
  Settings, 
  User, 
  PlayCircle,
  School,
  LogOut,
  X,
  GraduationCap,
  Calendar,
  HeartHandshake,
  Award,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { AppSection } from '../types';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
  unreadNotificationsCount: number;
  onStartDemo: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onReturnToLanding?: () => void;
  userRole?: 'Parent' | 'Teacher' | 'Administrator' | 'Student' | null;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  unreadNotificationsCount,
  onStartDemo,
  onOpenProfile,
  onLogout,
  onReturnToLanding,
  userRole,
  isMobileOpen,
  onCloseMobile,
}) => {
  interface NavCategory {
    title: string;
    items: { id: AppSection; label: string; icon: React.FC<{ className?: string }> }[];
  }

  const navCategories: NavCategory[] = [
    {
      title: 'Command',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
      ]
    },
    {
      title: 'People & Community',
      items: [
        { id: 'students', label: 'Student 360°', icon: Users },
        { id: 'teachers', label: 'Faculty & Staff 360°', icon: GraduationCap },
        { id: 'parents', label: 'Parent & Guardian 360°', icon: HeartHandshake },
        { id: 'parent_connect', label: 'Parent Connect', icon: Smartphone },
      ]
    },
    {
      title: 'Academics & Timetable',
      items: [
        { id: 'academics', label: 'Academics & Exams', icon: Award },
        { id: 'timetable', label: 'Smart Timetable', icon: Calendar },
      ]
    },
    {
      title: 'Operations & Campus',
      items: [
        { id: 'attendance', label: 'Attendance Monitoring', icon: UserCheck },
        { id: 'transport', label: 'Transport Fleet', icon: Bus },
        { id: 'library', label: 'Library System', icon: BookOpen },
        { id: 'energy', label: 'Energy & Green Campus', icon: Zap },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'users', label: 'User & Account Security', icon: ShieldCheck },
      ]
    }
  ];

  const handleNavClick = (section: AppSection) => {
    onNavigate(section);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div 
            onClick={onReturnToLanding}
            className="flex items-center gap-3 cursor-pointer group"
            title="Return to Academy Entrance"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition-colors">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none font-sans group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                SMART SCHOOL
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">360°</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Seth Tolaram Bafna</span>
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Competition Demo Action Banner */}
        <div className="p-3.5 mx-3.5 my-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              National Innovation Project
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
              Prototype
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug mb-2">
            CBSE smart school connected operations model.
          </p>
          <button
            id="start-demo-sidebar-btn"
            onClick={onStartDemo}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Start Guided Demo</span>
          </button>
        </div>

        {/* Navigation list grouped categorically */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
          {navCategories.map((category) => (
            <div key={category.title} className="space-y-1">
              <p className="px-3 pt-1 pb-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {category.title}
              </p>
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom utility navigation */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
          <p className="px-3 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            System & Account
          </p>

          <button
            id="nav-notifications"
            onClick={() => handleNavClick('notifications')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              currentSection === 'notifications'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            id="nav-settings"
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              currentSection === 'settings'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Settings</span>
          </button>

          {/* User Card */}
          <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-2">
            <button
              id="admin-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 text-left cursor-pointer group flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-200">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  {userRole === 'Parent' ? 'Parent Portal' : userRole === 'Teacher' ? 'Faculty Portal' : userRole === 'Student' ? 'Student Portal' : 'School Admin'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Seth Tolaram Bafna
                </p>
              </div>
            </button>
            <button
              id="logout-btn"
              onClick={onLogout}
              title="Return to Academy Entrance"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
