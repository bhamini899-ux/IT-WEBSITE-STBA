import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  RotateCcw,
  Radio,
  User,
  AlertTriangle,
  Send,
  Bell
} from 'lucide-react';
import { ChildTransportDetails, ChildProfile } from '../../types/parentConnect';

interface ChildTransportLiveSectionProps {
  child: ChildProfile;
  transportDetails: ChildTransportDetails;
  onSimulateReturnTrip: () => void;
}

export const ChildTransportLiveSection: React.FC<ChildTransportLiveSectionProps> = ({
  child,
  transportDetails,
  onSimulateReturnTrip,
}) => {
  const [mapMode, setMapMode] = useState<'route' | 'radar'>('route');

  return (
    <div className="space-y-6">
      {/* Live Fleet Telemetry Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {transportDetails.busNumber} • {transportDetails.routeName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GPS Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reg No: <span className="font-mono text-slate-300 font-bold">{transportDetails.vehicleRegNo}</span> • Verified School Fleet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateReturnTrip}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Bus Telemetry</span>
            </button>
          </div>
        </div>

        {/* 3 Status Milestone Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Step 1: Morning Boarding
              </span>
              <span className="font-mono text-[11px] text-emerald-300">07:15 AM</span>
            </div>
            <p className="text-xs font-semibold text-white">Boarded at {transportDetails.pickupStop}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scanned by Bus Conductor Jagdish Prasad</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-4 border border-emerald-500/30">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Step 2: Campus Arrival
              </span>
              <span className="font-mono text-[11px] text-emerald-300">07:48 AM</span>
            </div>
            <p className="text-xs font-semibold text-white">Reached Academy Main Gate 1</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Deboarded safely under teacher duty oversight</p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Step 3: Afternoon Return
              </span>
              <span className="font-mono text-[11px] text-blue-300">ETA 02:55 PM</span>
            </div>
            <p className="text-xs font-semibold text-white">Drop: {transportDetails.dropStop}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled boarding at 02:30 PM dispersal</p>
          </div>
        </div>
      </div>

      {/* Driver & Conductor Verification Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img 
              src={transportDetails.driverPhoto} 
              alt={transportDetails.driverName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {transportDetails.driverName}
                </h4>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Designated Fleet Driver • 12 Yrs Safety Record
              </p>
              <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                {transportDetails.driverPhone}
              </p>
            </div>
          </div>

          <a
            href={`tel:${transportDetails.driverPhone}`}
            className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
            title="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Conductor Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
              <User className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {transportDetails.conductorName}
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Route Safety Conductor • First-Aid Certified
              </p>
              <p className="text-[11px] font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                {transportDetails.conductorPhone}
              </p>
            </div>
          </div>

          <a
            href={`tel:${transportDetails.conductorPhone}`}
            className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Call Conductor"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Simulated Live Route Tracking Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Live Route Progression & Waypoints
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Route 01: North Town Loop to Seth Tolaram Bafna Academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Speed: {transportDetails.speedKmh} km/h
            </span>
          </div>
        </div>

        {/* Route Stops Checklist Visualizer */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-2 sm:before:left-3.5 before:w-0.5 before:bg-blue-200 dark:before:bg-blue-900">
          {transportDetails.routeStops.map((stop, index) => (
            <div key={index} className="relative group">
              {/* Checkpoint Dot */}
              <div className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                stop.completed 
                  ? 'bg-emerald-500 border-emerald-400 text-white' 
                  : stop.isChildStop 
                  ? 'bg-blue-600 border-blue-400 text-white animate-bounce' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
              }`}>
                {stop.completed && <CheckCircle2 className="w-3 h-3" />}
              </div>

              {/* Stop Info */}
              <div className={`p-3 rounded-xl border transition-all ${
                stop.isChildStop 
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' 
                  : stop.isSchool 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {stop.stopName}
                    </span>
                    {stop.isChildStop && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                        Assigned Child Stop
                      </span>
                    )}
                    {stop.isSchool && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider">
                        Academy Destination
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Sched: {stop.scheduledTime} {stop.actualTime && `• Actual: ${stop.actualTime}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transport Notifications Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Recent Bus Dispatch Alerts</span>
        </h4>

        <div className="space-y-2.5 text-xs">
          {transportDetails.transportNotifications.map((notif) => (
            <div 
              key={notif.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
            >
              <div>
                <strong className="text-slate-800 dark:text-slate-200 block">{notif.title}</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{notif.message}</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
