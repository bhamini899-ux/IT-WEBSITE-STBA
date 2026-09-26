import React from 'react';
import { 
  Bus as BusIcon, 
  Navigation, 
  School, 
  Users, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Activity,
  ArrowUpRight,
  Radio,
  Search,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { DetailedBus, TransportTab, TransportAlertItem } from '../../types/transportManagement';

interface TransportCommandCenterProps {
  buses: DetailedBus[];
  alerts: TransportAlertItem[];
  activeTab: TransportTab;
  setActiveTab: (tab: TransportTab) => void;
  onOpenEmergencyModal: () => void;
  onSelectBus: (busId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const TransportCommandCenter: React.FC<TransportCommandCenterProps> = ({
  buses,
  alerts,
  setActiveTab,
  onOpenEmergencyModal,
  onSelectBus,
  searchQuery,
  setSearchQuery
}) => {
  const totalBuses = buses.length;
  const onRouteCount = buses.filter(b => b.operationalStatus === 'On Route').length;
  const atSchoolCount = buses.filter(b => b.operationalStatus === 'At School').length;
  const delayedCount = buses.filter(b => b.operationalStatus === 'Delayed').length;
  const issueCount = buses.filter(b => b.operationalStatus === 'Issue').length;
  const inactiveCount = buses.filter(b => b.operationalStatus === 'Inactive').length;
  const activeBuses = onRouteCount + atSchoolCount;
  
  const totalStudentsTravelling = buses.reduce((acc, b) => acc + (b.operationalStatus === 'On Route' || b.operationalStatus === 'Delayed' ? b.studentsOnboard : 0), 0);
  const totalAssignedStudents = buses.reduce((acc, b) => acc + b.studentsAssigned, 0);
  const activeAlerts = alerts.filter(a => a.status === 'Active');

  return (
    <div className="space-y-6">
      {/* Top Banner & Emergency SOS Action */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Telemetry Active • Refresh: 10s (Simulated Engine)</span>
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
            Prototype / Simulated Transport Allocation — Bound to Real Class 10 Students (Max 219)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Seth Tolaram Bafna Academy — Fleet Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Centralized monitoring of all 5 official academy buses, transit safety geofences, RFID student boarding logs, and driver dispatch across Bikaner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            id="btn-trigger-emergency-sos"
            onClick={onOpenEmergencyModal}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency / SOS Dispatch</span>
          </button>
          <button
            id="btn-switch-live-radar"
            onClick={() => setActiveTab('live_monitoring')}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Live Radar Map</span>
          </button>
        </div>
      </div>

      {/* OPERATIONAL STATUS BADGES BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Fleet Live Status Indicators
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total Fleet: <strong>{totalBuses} Buses</strong> • Total Riders: <strong>{totalAssignedStudents} Students</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🟢 On Route</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{onRouteCount} Buses</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60">
            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-900 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🔵 At School</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{atSchoolCount} Buses</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-900 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🟡 Delayed</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{delayedCount} Bus</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-900 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">🔴 Issue</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{issueCount} Bus</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-400 ring-4 ring-slate-200 dark:ring-slate-700 flex-shrink-0" />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">⚪ Inactive</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{inactiveCount} Bus</div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE OPERATIONAL METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Fleet Active</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BusIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeBuses} <span className="text-sm font-normal text-slate-400">/ {totalBuses}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>90% Fleet operational</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Students Currently Travelling</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalStudentsTravelling}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Onboard morning transit runs</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Completed Trips</span>
            <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              6 <span className="text-sm font-normal text-slate-400">/ 20 Trips</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-sky-600 dark:text-sky-400 font-medium">
              <span>Morning intake concluding</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Transport Alerts</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeAlerts.length} <span className="text-sm font-normal text-slate-400">pending</span>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="flex items-center gap-1 mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              <span>View alerts feed</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK GLOBAL SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="global-transport-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Transport Search: Enter Bus number, Driver name, Route, Bus Stop or Student name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* ACTIVE BUS TELEMETRY SNAPSHOT TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Transit Runs Snapshot</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live monitoring of vehicles currently traversing academy loops</p>
          </div>
          <button
            onClick={() => setActiveTab('fleet')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Fleet</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Route Name</th>
                <th className="py-3 px-4">Driver & Contact</th>
                <th className="py-3 px-4">Current Stop</th>
                <th className="py-3 px-4">Next Stop (ETA)</th>
                <th className="py-3 px-4">Onboard / Cap</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {buses.slice(0, 5).map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{bus.busNumber}</div>
                    <div className="text-[11px] text-slate-400">{bus.registrationPlate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{bus.routeName}</div>
                    <div className="text-[11px] text-slate-400">{bus.routeId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>{bus.driverName}</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400">{bus.driverPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-medium">{bus.currentStop}</td>
                  <td className="py-3 px-4">
                    <div>{bus.nextStop}</div>
                    <div className="text-[11px] text-amber-600 font-semibold">{bus.nextStopEtaMinutes} mins away</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold">{bus.studentsOnboard} / {bus.capacity}</div>
                    <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full rounded-full ${bus.studentsOnboard / bus.capacity > 0.9 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                        style={{ width: `${Math.min(100, (bus.studentsOnboard / bus.capacity) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      bus.operationalStatus === 'On Route' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200' :
                      bus.operationalStatus === 'At School' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200' :
                      bus.operationalStatus === 'Delayed' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200' :
                      bus.operationalStatus === 'Issue' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        bus.operationalStatus === 'On Route' ? 'bg-emerald-500' :
                        bus.operationalStatus === 'At School' ? 'bg-sky-500' :
                        bus.operationalStatus === 'Delayed' ? 'bg-amber-500' :
                        bus.operationalStatus === 'Issue' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} />
                      {bus.operationalStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onSelectBus(bus.id);
                        setActiveTab('fleet');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
