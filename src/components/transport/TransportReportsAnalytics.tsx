import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Fuel, 
  Users, 
  FileSpreadsheet 
} from 'lucide-react';
import { DetailedBus, DetailedTransportRoute } from '../../types/transportManagement';

interface TransportReportsAnalyticsProps {
  buses: DetailedBus[];
  routes: DetailedTransportRoute[];
}

export const TransportReportsAnalytics: React.FC<TransportReportsAnalyticsProps> = ({
  buses,
  routes
}) => {
  const handleExportCSV = () => {
    const headers = "Bus Number,Registration,Route,Driver,Capacity,Students Assigned,Load %,Status,Speed,Fuel %\n";
    const rows = buses.map(b => 
      `"${b.busNumber}","${b.registrationPlate}","${b.routeName}","${b.driverName}",${b.capacity},${b.studentsAssigned},${Math.round((b.studentsAssigned / b.capacity) * 100)}%,"${b.operationalStatus}",${b.speedKmh},${b.fuelLevel}%`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Seth_Tolaram_Bafna_Transport_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transport Operational Analytics & Executive Reports</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Capacity utilization, punctuality KPIs, corridor fuel efficiency, and route coverage statistics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Fleet Data (CSV)</span>
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Overall Fleet Load</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            87.7%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Optimal seat utilization</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">On-Time Performance</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            94.2%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">+2.1% from last month</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Corridor Transit</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            44.6 <span className="text-xs font-normal text-slate-400">Mins</span>
          </div>
          <span className="text-[11px] text-slate-400">Per morning loop</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Fleet Mileage Economy</span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            4.8 <span className="text-xs font-normal text-slate-400">KM/L</span>
          </div>
          <span className="text-[11px] text-slate-400">BS-VI BharatBenz/Tata</span>
        </div>
      </div>

      {/* CAPACITY UTILIZATION PROGRESS BARS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Bus-Wise Seating Load Factor</span>
          <span className="text-xs font-normal text-slate-400">Target: 80-95% Safe Capacity</span>
        </h3>

        <div className="space-y-3">
          {buses.map((bus) => {
            const pct = Math.round((bus.studentsAssigned / bus.capacity) * 100);
            return (
              <div key={bus.id} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-800 dark:text-slate-200">
                    <strong>{bus.busNumber}</strong> ({bus.routeName})
                  </span>
                  <span className="text-slate-500">
                    {bus.studentsAssigned} / {bus.capacity} seats ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      pct > 95 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELAY REASONS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transit Delay Root Causes</h3>
          <p className="text-xs text-slate-400">Analysis of the 8 logged delays over the past 30 operating days in Bikaner</p>
          
          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Level Crossing / Railway Gate Wait (Lalgarh)</span>
              <span className="font-bold text-slate-900 dark:text-white">4 instances (50%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Morning Fog / Reduced Visibility (Winter Season)</span>
              <span className="font-bold text-slate-900 dark:text-white">2 instances (25%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Traffic Congestion near Kote Gate Market</span>
              <span className="font-bold text-slate-900 dark:text-white">1 instance (12.5%)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Mechanical Tyre Puncture / Valve Repair</span>
              <span className="font-bold text-slate-900 dark:text-white">1 instance (12.5%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Route Network Coverage</h3>
          <p className="text-xs text-slate-400">Breakdown of student catchment zones across municipal sectors</p>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">JN Vyas Colony & Sadul Ganj Corridors</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">86 Students</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Kanta Khaturia Colony & Civil Lines</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">82 Students</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Ganga Shahar & Bhinasar Corridors</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">80 Students</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-700 dark:text-slate-300">Pawan Puri & Lalgarh Station Outer Loops</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">77 Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
