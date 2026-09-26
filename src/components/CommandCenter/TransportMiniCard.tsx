import React from 'react';
import { 
  Bus, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Navigation, 
  Radio, 
  Fuel, 
  Users 
} from 'lucide-react';
import { Bus as BusType, AppSection } from '../../types';

interface TransportMiniCardProps {
  buses: BusType[];
  onNavigate: (section: AppSection) => void;
}

export const TransportMiniCard: React.FC<TransportMiniCardProps> = ({
  buses,
  onNavigate,
}) => {
  const activeCount = buses.filter(b => b.status === 'On Route' || b.status === 'Delayed').length;
  const delayedCount = buses.filter(b => b.status === 'Delayed').length;
  const atSchoolCount = buses.filter(b => b.status === 'At School').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Transport Operations</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">GPS telemetry & fleet routing</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/60 dark:border-emerald-800/50">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>GPS Online</span>
          </span>
        </div>

        {/* Fleet Metrics Strip */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">{buses.length}</div>
          </div>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
            <div className="text-[10px] text-blue-600 uppercase font-semibold">On Route</div>
            <div className="text-base font-extrabold text-blue-700 dark:text-blue-300">{activeCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
            <div className="text-[10px] text-emerald-600 uppercase font-semibold">At School</div>
            <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">{atSchoolCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40">
            <div className="text-[10px] text-amber-600 uppercase font-semibold">Delayed</div>
            <div className="text-base font-extrabold text-amber-700 dark:text-amber-300">{delayedCount}</div>
          </div>
        </div>

        {/* Mini Radar / Vector Map Simulation */}
        <div className="relative h-28 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-2 flex flex-col justify-between my-2">
          {/* Subtle Map Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-40 pointer-events-none" />
          
          {/* School HQ Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center animate-ping" />
            <span className="absolute text-[9px] font-bold text-blue-300 whitespace-nowrap -bottom-3 bg-slate-950/80 px-1 rounded">
              Bafna Academy HQ
            </span>
          </div>

          {/* Active Bus Markers on Canvas */}
          {buses.slice(0, 4).map((b, idx) => {
            const posX = Math.min(90, Math.max(10, b.x || (20 + idx * 22)));
            const posY = Math.min(85, Math.max(15, b.y || (25 + idx * 18)));

            return (
              <div 
                key={b.id}
                style={{ left: `${posX}%`, top: `${posY}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title={`${b.busNumber} (${b.routeName})`}
              >
                <div className={`p-1 rounded-full text-white shadow-md flex items-center justify-center ${
                  b.status === 'Delayed' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}>
                  <Bus className="w-2.5 h-2.5" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -top-5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-30">
                  {b.busNumber} • {b.etaMinutes}m ETA
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between text-[10px] text-slate-400 z-10">
            <span className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-400" /> Live Telemetry
            </span>
            <span className="text-slate-400">Seth Tolaram Bafna Campus</span>
          </div>
        </div>

        {/* Bus List Items */}
        <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {buses.slice(0, 3).map((b) => (
            <div 
              key={b.id}
              onClick={() => onNavigate('transport')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-800/80 cursor-pointer flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{b.busNumber}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                    {b.registrationPlate}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{b.routeName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" /> {b.studentsCount} students
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  b.status === 'Delayed'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {b.status}
                </span>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-0.5 flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> ETA {b.etaMinutes}m
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Emergency dispatch: <strong>0 active</strong>
        </span>
        <button
          onClick={() => onNavigate('transport')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>View Transport</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
