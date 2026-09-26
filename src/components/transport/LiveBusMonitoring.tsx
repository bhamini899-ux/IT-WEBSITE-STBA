import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Bus as BusIcon, 
  Clock, 
  Users, 
  Play, 
  Pause, 
  RotateCw, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  Phone,
  Info
} from 'lucide-react';
import { DetailedBus, DetailedTransportRoute } from '../../types/transportManagement';

interface LiveBusMonitoringProps {
  buses: DetailedBus[];
  routes: DetailedTransportRoute[];
  selectedBusId: string;
  onSelectBus: (busId: string) => void;
  onSimulateTick: () => void;
}

export const LiveBusMonitoring: React.FC<LiveBusMonitoringProps> = ({
  buses,
  routes,
  selectedBusId,
  onSelectBus,
  onSimulateTick
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto tick every 8 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onSimulateTick();
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying, onSimulateTick]);

  const activeBus = buses.find(b => b.id === selectedBusId) || buses[0];

  return (
    <div className="space-y-6">
      {/* HEADER & DISCLAIMER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Live-Style Bus Telemetry Radar</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[11px] font-bold">
              Simulated Telemetry
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time visual monitoring of all 10 buses across Bikaner coordinates with stop ETA projections.
          </p>
        </div>

        {/* SIMULATION CONTROLS */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
              isPlaying 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Sim Running' : 'Paused'}</span>
          </button>

          <button
            onClick={onSimulateTick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Advance Step</span>
          </button>
        </div>
      </div>

      {/* DISCLAIMER NOTICE CARD */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Notice:</strong> This screen visualizes realistic simulated transit telemetry for the prototype demonstration. No external GPS tracking hardware is currently connected. When real IoT GPS transponders are bound, this canvas updates automatically via web-sockets.
        </div>
      </div>

      {/* RADAR MAP & INSPECTION SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP CANVAS (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg text-white relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          {/* MAP BACKGROUND GRID LINES */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          {/* SIMULATED ROADS / RADIAL RINGS */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[320px] h-[320px] rounded-full border border-indigo-400" />
            <div className="w-[520px] h-[520px] rounded-full border border-indigo-500" />
            <div className="w-[720px] h-[720px] rounded-full border border-indigo-600" />
          </div>

          {/* ACADEMY CENTRAL HUB (CAMPUS) */}
          <div 
            className="absolute z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-default"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white shadow-xl flex items-center justify-center ring-4 ring-indigo-400/30">
              <BusIcon className="w-5 h-5" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-bold text-indigo-300 border border-indigo-500/40 whitespace-nowrap">
              Seth Tolaram Bafna Academy
            </span>
          </div>

          {/* BUS VEHICLE NODES ON MAP */}
          {buses.map((bus) => {
            const isSelected = bus.id === selectedBusId;
            return (
              <div
                key={bus.id}
                onClick={() => onSelectBus(bus.id)}
                className={`absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer group ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                style={{ left: `${bus.x}%`, top: `${bus.y}%` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                  bus.operationalStatus === 'On Route' ? 'bg-emerald-500 text-white ring-4 ring-emerald-400/30' :
                  bus.operationalStatus === 'At School' ? 'bg-sky-500 text-white ring-4 ring-sky-400/30' :
                  bus.operationalStatus === 'Delayed' ? 'bg-amber-500 text-white ring-4 ring-amber-400/30 animate-bounce' :
                  bus.operationalStatus === 'Issue' ? 'bg-rose-500 text-white ring-4 ring-rose-400/30' :
                  'bg-slate-600 text-slate-200'
                }`}>
                  {bus.busNumber.replace('Bus ', '')}
                </div>

                <div className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap transition-opacity ${
                  isSelected 
                    ? 'bg-indigo-600 text-white ring-2 ring-white/40' 
                    : 'bg-slate-900/80 text-slate-300 border border-slate-700'
                }`}>
                  {bus.busNumber} • {bus.speedKmh} km/h
                </div>
              </div>
            );
          })}

          {/* MAP BOTTOM OVERLAY CONTROLS */}
          <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> On Route
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> At School
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Delayed
              </span>
            </div>
            <span>Bikaner Grid Telemetry</span>
          </div>
        </div>

        {/* SELECTED BUS TELEMETRY INSPECTOR (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeBus && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-5">
              {/* TOP PROFILE */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <BusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeBus.busNumber}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {activeBus.registrationPlate}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  activeBus.operationalStatus === 'On Route' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  activeBus.operationalStatus === 'Delayed' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                }`}>
                  {activeBus.operationalStatus}
                </span>
              </div>

              {/* TELEMETRY READINGS */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Assigned Route</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeBus.routeId}</span>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {activeBus.routeName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Current Station</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate">
                      {activeBus.currentStop}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Next Destination</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate">
                      {activeBus.nextStop}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Estimated Arrival</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                      {activeBus.nextStopEtaMinutes} Minutes
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-[11px] text-slate-400 block">Current Velocity</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                      {activeBus.speedKmh} KM/H
                    </span>
                  </div>
                </div>

                {/* CREW */}
                <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Driver in Command</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{activeBus.driverName}</div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">{activeBus.driverPhone}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                  <span>Students Onboard: <strong className="text-slate-700 dark:text-slate-300">{activeBus.studentsOnboard} / {activeBus.capacity}</strong></span>
                  <span>Ping: {activeBus.lastUpdatedTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
