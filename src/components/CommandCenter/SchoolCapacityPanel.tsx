import React from 'react';
import { 
  Building2, 
  Users, 
  DoorOpen, 
  Bus, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { AppSection } from '../../types';

interface SchoolCapacityPanelProps {
  onNavigate: (section: AppSection) => void;
  studentCapacity?: number;
  currentStudents?: number;
}

export const SchoolCapacityPanel: React.FC<SchoolCapacityPanelProps> = ({
  onNavigate,
  studentCapacity = 250,
  currentStudents = 0,
}) => {
  const meters = [
    {
      label: 'Campus Physical Occupancy',
      value: 82,
      subtitle: `${currentStudents} / ${studentCapacity} students on site`,
      icon: Users,
      color: 'bg-blue-600',
      section: 'attendance' as AppSection,
    },
    {
      label: 'Classroom Space Utilization',
      value: 74,
      subtitle: '31 of 42 active instruction rooms',
      icon: DoorOpen,
      color: 'bg-indigo-600',
      section: 'classrooms' as AppSection,
    },
    {
      label: 'Fleet Bus Seat Utilization',
      value: 68,
      subtitle: '320 / 470 passenger seats occupied',
      icon: Bus,
      color: 'bg-amber-500',
      section: 'transport' as AppSection,
    },
    {
      label: 'Library Reading Hall Capacity',
      value: 62,
      subtitle: '74 of 120 study carrels occupied',
      icon: BookOpen,
      color: 'bg-purple-600',
      section: 'library' as AppSection,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Campus Capacity & Resource Load</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Infrastructure headroom & seat allocations</p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            Safe Operating Band
          </span>
        </div>

        {/* Meters List */}
        <div className="space-y-4 my-3">
          {meters.map((meter) => {
            const Icon = meter.icon;
            return (
              <div 
                key={meter.label}
                onClick={() => onNavigate(meter.section)}
                className="group p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                    <span className="font-bold text-slate-900 dark:text-white">{meter.label}</span>
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white">{meter.value}%</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${meter.color} transition-all duration-500`}
                    style={{ width: `${meter.value}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>{meter.subtitle}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">Drilldown →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Active Class 10 capacity: <strong>250 students (Sections A-E)</strong></span>
        <button
          onClick={() => onNavigate('dashboard')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          View Full Facility Map
        </button>
      </div>
    </div>
  );
};
