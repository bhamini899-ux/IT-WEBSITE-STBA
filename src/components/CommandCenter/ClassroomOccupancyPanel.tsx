import React from 'react';
import { 
  DoorOpen, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ArrowRight, 
  Users 
} from 'lucide-react';
import { AppSection } from '../../types';
import { INITIAL_BLOCK_OCCUPANCY } from '../../data/initialData';

interface ClassroomOccupancyPanelProps {
  onNavigate: (section: AppSection) => void;
  totalRooms?: number;
  occupiedRooms?: number;
  availableRooms?: number;
  maintenanceRooms?: number;
}

export const ClassroomOccupancyPanel: React.FC<ClassroomOccupancyPanelProps> = ({
  onNavigate,
  totalRooms = 42,
  occupiedRooms = 31,
  availableRooms = 9,
  maintenanceRooms = 2,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Classroom Occupancy & Space</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">PIR motion sensors & active lecture halls</p>
            </div>
          </div>

          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200/50">
            {Math.round((occupiedRooms / totalRooms) * 100)}% Utilized
          </span>
        </div>

        {/* 4 Summary Counter Chips */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Total</span>
            <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{totalRooms}</div>
          </div>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold uppercase">Occupied</span>
            <div className="text-base font-extrabold text-indigo-700 dark:text-indigo-300 mt-0.5">{occupiedRooms}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold uppercase">Available</span>
            <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">{availableRooms}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold uppercase">Maint.</span>
            <div className="text-base font-extrabold text-amber-700 dark:text-amber-300 mt-0.5">{maintenanceRooms}</div>
          </div>
        </div>

        {/* Wing / Block Breakdown */}
        <div className="space-y-2.5 my-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Wing-by-Wing Utilization
          </span>

          {INITIAL_BLOCK_OCCUPANCY.map((block) => (
            <div key={block.blockName} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{block.blockName}</span>
                <span className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">{block.occupiedRooms}</strong>/{block.totalRooms} ({block.utilizationPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${block.utilizationPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Smart HVAC automation enabled
        </span>
        <button
          onClick={() => onNavigate('classrooms')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>Inspect All Classrooms</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
