import React, { useState } from 'react';
import { 
  Bus as BusIcon, 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Gauge, 
  Fuel, 
  Calendar, 
  FileText, 
  Video, 
  Flame, 
  Plus, 
  SlidersHorizontal,
  Navigation
} from 'lucide-react';
import { DetailedBus, BusOperationalStatus } from '../../types/transportManagement';

interface BusFleetManagementProps {
  buses: DetailedBus[];
  selectedBusId: string;
  onSelectBus: (id: string) => void;
  onUpdateBusStatus: (busId: string, status: BusOperationalStatus) => void;
  onOpenLiveRadar: (busId: string) => void;
}

export const BusFleetManagement: React.FC<BusFleetManagementProps> = ({
  buses,
  selectedBusId,
  onSelectBus,
  onUpdateBusStatus,
  onOpenLiveRadar
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [inspectModalBus, setInspectModalBus] = useState<DetailedBus | null>(null);

  const filteredBuses = buses.filter(bus => {
    if (filterStatus === 'All') return true;
    return bus.operationalStatus === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bus Fleet Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor, inspect and configure the 10 dedicated academy buses with live mechanical specs and staff assignments.
          </p>
        </div>

        {/* STATUS FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'On Route', 'At School', 'Delayed', 'Issue', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* FLEET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuses.map((bus) => {
          const loadPercentage = Math.round((bus.studentsAssigned / bus.capacity) * 100);
          return (
            <div
              key={bus.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                bus.id === selectedBusId 
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* TOP ROW: BUS NUMBER & STATUS */}
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <BusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {bus.busNumber}
                        <span className="text-xs font-mono font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                          {bus.registrationPlate}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                        {bus.routeName}
                      </div>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    bus.operationalStatus === 'On Route' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' :
                    bus.operationalStatus === 'At School' ? 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300' :
                    bus.operationalStatus === 'Delayed' ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300' :
                    bus.operationalStatus === 'Issue' ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300' :
                    'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      bus.operationalStatus === 'On Route' ? 'bg-emerald-500' :
                      bus.operationalStatus === 'At School' ? 'bg-sky-500' :
                      bus.operationalStatus === 'Delayed' ? 'bg-amber-500' :
                      bus.operationalStatus === 'Issue' ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    {bus.operationalStatus}
                  </span>
                </div>

                {/* CREW INFO: DRIVER & CONDUCTOR */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Driver</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{bus.driverName}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 text-[11px] block">{bus.driverPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Conductor</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">{bus.conductorName}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 text-[11px] block">{bus.conductorPhone}</span>
                  </div>
                </div>

                {/* CAPACITY LOAD BAR */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Student Ridership Load</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {bus.studentsAssigned} / {bus.capacity} seats ({loadPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        loadPercentage > 95 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, loadPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* CURRENT TRIP & LAST UPDATE */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Trip: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{bus.currentTrip}</strong></span>
                  <span>Updated: {bus.lastUpdatedTime}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex items-center gap-2 pt-2">
                <button
                  id={`btn-inspect-bus-${bus.id}`}
                  onClick={() => setInspectModalBus(bus)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  View Details & Diagnostics
                </button>
                <button
                  onClick={() => {
                    onSelectBus(bus.id);
                    onOpenLiveRadar(bus.id);
                  }}
                  title="Track on Live Radar"
                  className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED BUS INSPECTION MODAL */}
      {inspectModalBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <BusIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {inspectModalBus.busNumber}
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg text-slate-600 dark:text-slate-300 font-normal">
                      {inspectModalBus.registrationPlate}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {inspectModalBus.makeModel} • Model Year {inspectModalBus.manufactureYear}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectModalBus(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MECHANICAL & SENSOR VITALS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="text-[11px] text-slate-400 font-medium">Odometer</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {inspectModalBus.odometerKm.toLocaleString()} KM
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="text-[11px] text-slate-400 font-medium">Fuel Level</div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {inspectModalBus.fuelLevel}% Tank
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="text-[11px] text-slate-400 font-medium">Current Speed</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {inspectModalBus.speedKmh} km/h
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="text-[11px] text-slate-400 font-medium">Mileage Avg</div>
                <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {inspectModalBus.averageMileageKmpl} km/L
                </div>
              </div>
            </div>

            {/* MANDATORY SAFETY & EQUIPMENT CHECKLIST */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Statutory School Bus Safety Checklist (Rajasthan RTO Compliant)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-indigo-500" />
                    <span>Dual CCTV Cameras (Front & Cabin)</span>
                  </div>
                  {inspectModalBus.equipment.cctvWorking ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Working
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Service Due
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-indigo-500" />
                    <span>Electronic Speed Governor (Max 40 km/h)</span>
                  </div>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Calibrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-indigo-500" />
                    <span>Dry Powder Fire Extinguisher (ABC)</span>
                  </div>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span>SOS Passenger Panic Alert Switches</span>
                  </div>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </div>
            </div>

            {/* RTO CERTIFICATES & VALIDITY STATUS */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Statutory Compliance & Legal Certificates
              </h4>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-slate-400 text-[11px]">Fitness Expiry</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {inspectModalBus.fitnessCertValidTill}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-slate-400 text-[11px]">Insurance Expiry</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {inspectModalBus.insuranceValidTill}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="text-slate-400 text-[11px]">PUC Pollution Cert</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {inspectModalBus.pucValidTill}
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS UPDATE CONTROLS */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Administrator Override: Update Operational Status
              </div>
              <div className="flex flex-wrap gap-2">
                {(['On Route', 'At School', 'Delayed', 'Issue', 'Inactive'] as BusOperationalStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onUpdateBusStatus(inspectModalBus.id, status);
                      setInspectModalBus({ ...inspectModalBus, operationalStatus: status });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inspectModalBus.operationalStatus === status
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-100'
                    }`}
                  >
                    Set {status}
                  </button>
                ))}
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setInspectModalBus(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
