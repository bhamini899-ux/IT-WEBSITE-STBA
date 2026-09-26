import React from 'react';
import { 
  CheckCircle2, 
  Wifi, 
  ShieldCheck, 
  AlertTriangle, 
  Bus, 
  Zap, 
  DoorOpen, 
  ChevronRight 
} from 'lucide-react';
import { AppSection } from '../../types';

interface SchoolStatusBarProps {
  onNavigate: (section: AppSection) => void;
  openMaintenanceCount?: number;
  activeBusesCount?: number;
  isEmergencyActive?: boolean;
  onOpenEmergencyModal?: () => void;
}

export const SchoolStatusBar: React.FC<SchoolStatusBarProps> = ({
  onNavigate,
  openMaintenanceCount = 3,
  activeBusesCount = 8,
  isEmergencyActive = false,
  onOpenEmergencyModal,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
        {/* Strip item 1: School Status */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/70 dark:border-emerald-800/50 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors shrink-0 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>School Status: <strong className="font-bold">Operational</strong></span>
        </button>

        {/* Strip item 2: Internet */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span>Internet: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online (99.8%)</span></span>
        </div>

        {/* Strip item 3: Emergency */}
        <button
          onClick={onOpenEmergencyModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold border transition-colors shrink-0 cursor-pointer ${
            isEmergencyActive
              ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
              : 'bg-slate-50 text-slate-700 border-slate-200/60 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${isEmergencyActive ? 'text-rose-600' : 'text-emerald-500'}`} />
          <span>Emergency: <strong className={isEmergencyActive ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
            {isEmergencyActive ? 'Active Incident' : 'No Active Emergency'}
          </strong></span>
        </button>

        {/* Strip item 4: Maintenance */}
        <button
          onClick={() => onNavigate('maintenance')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 dark:hover:bg-amber-950/30 transition-colors shrink-0 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Maintenance: <strong className="font-bold text-amber-600 dark:text-amber-400">{openMaintenanceCount} Issues Open</strong></span>
        </button>

        {/* Strip item 5: Buses */}
        <button
          onClick={() => onNavigate('transport')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 dark:hover:bg-blue-950/30 transition-colors shrink-0 cursor-pointer"
        >
          <Bus className="w-3.5 h-3.5 text-blue-500" />
          <span>Buses: <strong className="font-bold text-blue-600 dark:text-blue-400">{activeBusesCount} Active (1 Delayed)</strong></span>
        </button>

        {/* Strip item 6: Energy */}
        <button
          onClick={() => onNavigate('energy')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 dark:hover:bg-emerald-950/30 transition-colors shrink-0 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>Energy: <strong className="font-bold text-emerald-600 dark:text-emerald-400">Normal (1,842 kWh)</strong></span>
        </button>

        {/* Strip item 7: Classrooms */}
        <button
          onClick={() => onNavigate('classrooms')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-300 dark:hover:bg-indigo-950/30 transition-colors shrink-0 cursor-pointer"
        >
          <DoorOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Classrooms: <strong className="font-bold text-indigo-600 dark:text-indigo-400">92% Occupied (31/42)</strong></span>
        </button>
      </div>
    </div>
  );
};
