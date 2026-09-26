import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Users, 
  Bus as BusIcon, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Navigation
} from 'lucide-react';
import { DetailedTransportRoute, TransportStop } from '../../types/transportManagement';

interface BusStopsSectionProps {
  routes: DetailedTransportRoute[];
  onSelectBus: (busId: string) => void;
}

export const BusStopsSection: React.FC<BusStopsSectionProps> = ({
  routes,
  onSelectBus
}) => {
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('All');
  const [searchStopQuery, setSearchStopQuery] = useState<string>('');

  // Collect all stops with their parent route information
  const allStopsWithRoute = routes.flatMap(route => 
    route.stops.map(stop => ({
      ...stop,
      routeId: route.routeId,
      routeName: route.routeName,
      routeNumber: route.routeNumber,
      assignedBusId: route.assignedBusId,
      assignedBusNumber: route.assignedBusNumber
    }))
  );

  const filteredStops = allStopsWithRoute.filter(stop => {
    const matchesRoute = selectedRouteFilter === 'All' || stop.routeId === selectedRouteFilter;
    const matchesSearch = searchStopQuery.trim() === '' || 
      stop.name.toLowerCase().includes(searchStopQuery.toLowerCase()) ||
      stop.landmark.toLowerCase().includes(searchStopQuery.toLowerCase()) ||
      stop.routeName.toLowerCase().includes(searchStopQuery.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bus Stop Operations & Sequences</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            All designated pickup and drop-off stations across Bikaner with scheduled arrival times and boarding counts.
          </p>
        </div>

        {/* SEARCH & ROUTE SELECTOR */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchStopQuery}
              onChange={(e) => setSearchStopQuery(e.target.value)}
              placeholder="Search stop name or landmark..."
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Routes ({routes.length})</option>
            {routes.map(r => (
              <option key={r.routeId} value={r.routeId}>
                {r.routeNumber} - {r.routeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STOPS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Seq</th>
                <th className="py-3 px-4">Stop Station Name</th>
                <th className="py-3 px-4">Landmark / Area</th>
                <th className="py-3 px-4">Route & Bus</th>
                <th className="py-3 px-4">Arrival</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4 text-center">Boarding</th>
                <th className="py-3 px-4 text-center">Drop-Off</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredStops.map((stop) => (
                <tr key={`${stop.routeId}-${stop.id}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-400">
                    #{stop.sequenceOrder}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{stop.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {stop.landmark}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{stop.routeNumber}</div>
                    <button
                      onClick={() => onSelectBus(stop.assignedBusId)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BusIcon className="w-3 h-3" />
                      <span>{stop.assignedBusNumber}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    {stop.arrivalTime}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {stop.departureTime}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                      {stop.boardingCount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold">
                      {stop.dropOffCount}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      stop.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200' :
                      stop.status === 'Approaching' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 animate-pulse' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {stop.status === 'Passed' && <CheckCircle2 className="w-3 h-3" />}
                      <span>{stop.status}</span>
                    </span>
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
