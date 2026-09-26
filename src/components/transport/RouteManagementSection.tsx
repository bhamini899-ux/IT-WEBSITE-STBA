import React, { useState } from 'react';
import { 
  Route as RouteIcon, 
  MapPin, 
  Clock, 
  Bus as BusIcon, 
  User, 
  Users, 
  ChevronRight, 
  Compass, 
  ArrowRight,
  Navigation,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DetailedTransportRoute } from '../../types/transportManagement';

interface RouteManagementSectionProps {
  routes: DetailedTransportRoute[];
  onSelectRouteBus: (busId: string) => void;
}

export const RouteManagementSection: React.FC<RouteManagementSectionProps> = ({
  routes,
  onSelectRouteBus
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.routeId || 'Route 01');

  const activeRoute = routes.find(r => r.routeId === selectedRouteId) || routes[0];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Route Network Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered school transit corridors covering Bikaner urban and suburban zones with real-time waypoint schedules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ROUTE LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Academy Bus Corridors ({routes.length})</span>
            <span>Est. Total Distance: 55.9 KM</span>
          </div>

          <div className="space-y-3">
            {routes.map((route) => {
              const isSelected = route.routeId === selectedRouteId;
              return (
                <div
                  key={route.routeId}
                  onClick={() => setSelectedRouteId(route.routeId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                        {route.routeNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {route.routeName}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                      route.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      route.status === 'Delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{route.startPoint}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{route.destinationPoint}</span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Stops</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{route.stops.length} Stations</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Travel Time</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{route.estimatedTravelTimeMin} Mins</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Riders</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{route.assignedStudentsCount} Students</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED ROUTE VISUALIZER & TIMELINE (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeRoute && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6">
              {/* ROUTE HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs">
                      {activeRoute.routeNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeRoute.routeName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Morning Run: {activeRoute.morningStartTime} &rarr; School Reach: {activeRoute.morningSchoolReachTime}
                  </p>
                </div>

                <button
                  onClick={() => onSelectRouteBus(activeRoute.assignedBusId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <BusIcon className="w-3.5 h-3.5" />
                  <span>Assigned: {activeRoute.assignedBusNumber}</span>
                </button>
              </div>

              {/* ROUTE QUICK METRICS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[11px] text-slate-400">Total Distance</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeRoute.totalDistanceKm} KM
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[11px] text-slate-400">Total Run Time</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeRoute.estimatedTravelTimeMin} Mins
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[11px] text-slate-400">Assigned Driver</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    {activeRoute.assignedDriverName}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="text-[11px] text-slate-400">Dispersal Run</div>
                  <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {activeRoute.afternoonDispersalTime}
                  </div>
                </div>
              </div>

              {/* VISUAL SCHEMATIC TIMELINE / MAP-STYLE STOPS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Waypoints & Stop Sequence ({activeRoute.stops.length} Stops)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">Bikaner Municipal Transit Grid</span>
                </div>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900">
                  {activeRoute.stops.map((stop, idx) => (
                    <div key={stop.id} className="relative flex items-start justify-between gap-4 text-xs">
                      {/* NODE BULLET */}
                      <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white dark:ring-slate-900 ${
                        stop.status === 'Passed' ? 'bg-emerald-600 text-white' :
                        stop.status === 'Approaching' ? 'bg-amber-500 text-white animate-pulse' :
                        'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>

                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                          {stop.name}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            stop.status === 'Passed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            stop.status === 'Approaching' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {stop.status}
                          </span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{stop.landmark}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Boarding: <strong className="text-slate-700 dark:text-slate-300">{stop.boardingCount}</strong> students • Drop-off: <strong className="text-slate-700 dark:text-slate-300">{stop.dropOffCount}</strong> students
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {stop.arrivalTime}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Dep: {stop.departureTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
