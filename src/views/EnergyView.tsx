import React, { useState } from 'react';
import { 
  Zap, 
  Lightbulb, 
  Wind, 
  Snowflake, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  TrendingDown, 
  X,
  ShieldCheck,
  Power
} from 'lucide-react';
import { ClassroomEnergy } from '../types';
import { StatCard } from '../components/StatCard';
import { ENERGY_CONSUMPTION_7DAYS } from '../data/initialData';

interface EnergyViewProps {
  rooms: ClassroomEnergy[];
  onToggleDevice: (roomNumber: string, device: 'lights' | 'fans' | 'ac') => void;
  onOptimizeEnergy: () => void;
  isOptimized: boolean;
  todayConsumptionKwh: number;
}

export const EnergyView: React.FC<EnergyViewProps> = ({
  rooms,
  onToggleDevice,
  onOptimizeEnergy,
  isOptimized,
  todayConsumptionKwh,
}) => {
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | null>(null);

  // Selected room for control modal
  const selectedRoom = rooms.find(r => r.roomNumber === selectedRoomNumber);

  // Find wasteful rooms (occupancy === 0 and any device is ON)
  const wastefulRooms = rooms.filter(
    r => r.occupancy === 0 && (r.lights || r.fans || r.ac)
  );

  const totalPotentialSavingsKwh = wastefulRooms.reduce(
    (acc, r) => acc + (r.lights ? r.lightsPowerKwh : 0) + (r.fans ? r.fansPowerKwh : 0) + (r.ac ? r.acPowerKwh : 0),
    0
  );

  const activeRoomsCount = rooms.filter(r => r.lights || r.fans || r.ac).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Quick Optimize Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Smart Energy
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Prototype Simulation
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulated campus energy grid telemetry, classroom automation & conservation audit.
          </p>
        </div>
        {wastefulRooms.length > 0 && (
          <button
            id="btn-optimize-energy-header"
            onClick={onOptimizeEnergy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimize Energy ({totalPotentialSavingsKwh.toFixed(1)} kWh)</span>
          </button>
        )}
      </div>

      {/* SUMMARY CARDS (Section 9: Facility Monitoring) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Current Power Load"
          value="14.2 kW"
          subtitle="Live Academy Demand"
          badge={{ text: 'Live Grid', variant: 'sky' }}
          icon={Zap}
          iconColorClass="text-amber-500 dark:text-amber-400"
          iconBgClass="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          title="Today's Consumption"
          value={`${todayConsumptionKwh.toFixed(1)} kWh`}
          subtitle="Smart IoT Metered"
          badge={{ text: 'Real-time', variant: 'emerald' }}
          icon={TrendingDown}
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          iconBgClass="bg-emerald-50 dark:bg-emerald-950/60"
        />
        <StatCard
          title="Facility Status"
          value={wastefulRooms.length > 0 ? 'Alert' : isOptimized ? 'Optimized' : 'Normal'}
          subtitle={wastefulRooms.length > 0 ? `${wastefulRooms.length} empty room(s) active` : 'Optimal load balance'}
          badge={{ 
            text: wastefulRooms.length > 0 ? 'Action Needed' : 'Efficient', 
            variant: wastefulRooms.length > 0 ? 'rose' : 'emerald' 
          }}
          icon={wastefulRooms.length > 0 ? AlertTriangle : CheckCircle2}
          iconColorClass={wastefulRooms.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}
          iconBgClass={wastefulRooms.length > 0 ? 'bg-rose-50 dark:bg-rose-950/60' : 'bg-emerald-50 dark:bg-emerald-950/60'}
        />
        <StatCard
          title="Active Zones"
          value={`${activeRoomsCount} / 24`}
          subtitle="Classrooms & Labs"
          badge={{ text: 'Sensor Linked', variant: 'sky' }}
          icon={Users}
          iconColorClass="text-blue-600 dark:text-blue-400"
          iconBgClass="bg-blue-50 dark:bg-blue-950/60"
        />
      </div>

      {/* AUTOMATIC ENERGY OPTIMIZATION BANNER (Section 32) */}
      <div
        id="energy-optimization-banner"
        className={`p-5 rounded-3xl border transition-all ${
          wastefulRooms.length > 0
            ? 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-slate-900 dark:text-white'
            : 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-slate-900 dark:text-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              wastefulRooms.length > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {wastefulRooms.length > 0 ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">
                  {wastefulRooms.length > 0 ? 'Smart Optimization Required' : 'Smart Energy State: Optimized'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-900 border border-current">
                  AI Automated Policy
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {wastefulRooms.length > 0
                  ? `Room ${wastefulRooms.map(r => r.roomNumber).join(', ')} has no detected occupants with active power draw. Potential saving: ${totalPotentialSavingsKwh.toFixed(1)} kWh.`
                  : 'All unoccupied rooms have lights, fans, and ACs safely switched off. Zero idle power wastage detected.'}
              </p>
            </div>
          </div>

          {wastefulRooms.length > 0 && (
            <button
              id="btn-optimize-energy-action"
              onClick={onOptimizeEnergy}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Power className="w-4 h-4" />
              <span>Optimize Energy</span>
            </button>
          )}
        </div>
      </div>

      {/* CLASSROOM ENERGY MONITOR GRID (Section 30) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Classroom Energy Monitor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live device status across classrooms. Click any room to open manual override controls.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {rooms.length} Monitored Zones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {rooms.map((room) => {
            const isWasting = room.occupancy === 0 && (room.lights || room.fans || room.ac);
            const totalRoomKwh =
              (room.lights ? room.lightsPowerKwh : 0) +
              (room.fans ? room.fansPowerKwh : 0) +
              (room.ac ? room.acPowerKwh : 0);

            return (
              <div
                key={room.roomNumber}
                id={`room-card-${room.roomNumber}`}
                onClick={() => setSelectedRoomNumber(room.roomNumber)}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer hover:shadow-md ${
                  isWasting
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10 hover:border-rose-400'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-[11px] text-slate-400">{room.wing} • Fl {room.floor}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    isWasting
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      : room.occupancy > 0
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    {isWasting ? '⚠️ Wastage' : room.occupancy > 0 ? 'Active' : 'Standby'}
                  </span>
                </div>

                {/* Device indicators */}
                <div className="space-y-1.5 text-xs py-2 border-y border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Lights</span>
                    </span>
                    <span className={`font-semibold ${room.lights ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                      {room.lights ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Wind className="w-3.5 h-3.5 text-sky-500" />
                      <span>Fans</span>
                    </span>
                    <span className={`font-semibold ${room.fans ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                      {room.fans ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Snowflake className="w-3.5 h-3.5 text-blue-500" />
                      <span>AC</span>
                    </span>
                    <span className={`font-semibold ${room.ac ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                      {room.ac ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Occupancy</span>
                    </span>
                    <span className={`font-bold ${room.occupancy === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                      {room.occupancy} {room.occupancy === 1 ? 'student' : 'students'}
                    </span>
                  </div>
                </div>

                {/* Footer draw */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Load</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {totalRoomKwh.toFixed(1)} kWh
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ENERGY ANALYTICS & 7-DAY CONSUMPTION (Section 33) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Energy Consumption — Last 7 Days
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily actual consumption (kWh) compared to historical baseline
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              -12% lower than average
            </span>
          </div>

          {/* Bar comparison chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {ENERGY_CONSUMPTION_7DAYS.map((item) => {
              const actualHeight = Math.max(12, (item.kwh / 25) * 100);
              const baselineHeight = (item.baseline / 25) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 opacity-90">
                    {item.kwh}k
                  </span>
                  <div className="w-full h-28 flex items-end justify-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-t-lg p-1">
                    {/* Actual Bar */}
                    <div
                      style={{ height: `${actualHeight}%` }}
                      className="w-1/2 bg-emerald-600 dark:bg-emerald-500 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-700"
                      title={`Actual: ${item.kwh} kWh`}
                    ></div>
                    {/* Baseline Bar */}
                    <div
                      style={{ height: `${baselineHeight}%` }}
                      className="w-1/2 bg-slate-300 dark:bg-slate-600 rounded-t-sm"
                      title={`Baseline: ${item.baseline} kWh`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-emerald-600"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Actual Consumption</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-slate-300 dark:bg-slate-600"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Baseline Benchmark</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Sustainability Metrics
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Today's Consumption</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {todayConsumptionKwh.toFixed(1)} kWh
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Eco Mode</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Historical Average</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">22.4 kWh</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">Benchmark</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Estimated Savings</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {isOptimized ? '18% lower' : '12% lower'}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">3.7 kWh saved</span>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-sky-800 dark:text-sky-300 font-semibold">Wasted Energy Avoided</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {isOptimized ? '14.2 kWh this week' : '12.4 kWh this week'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMART ENERGY CONTROLS MODAL (Section 31) */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Room {selectedRoom.roomNumber} Controls
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedRoom.wing}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detected Occupancy: <strong className="text-slate-900 dark:text-white">{selectedRoom.occupancy} students</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRoomNumber(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Device Toggles */}
            <div className="space-y-3 py-4">
              {/* Lights */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRoom.lights ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Room Lights</p>
                    <p className="text-xs text-slate-400">Power draw: {selectedRoom.lightsPowerKwh} kWh</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleDevice(selectedRoom.roomNumber, 'lights')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRoom.lights
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {selectedRoom.lights ? 'Turn OFF' : 'Turn ON'}
                </button>
              </div>

              {/* Fans */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRoom.fans ? 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Ceiling Fans</p>
                    <p className="text-xs text-slate-400">Power draw: {selectedRoom.fansPowerKwh} kWh</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleDevice(selectedRoom.roomNumber, 'fans')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRoom.fans
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {selectedRoom.fans ? 'Turn OFF' : 'Turn ON'}
                </button>
              </div>

              {/* AC */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRoom.ac ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}>
                    <Snowflake className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Air Conditioner</p>
                    <p className="text-xs text-slate-400">Power draw: {selectedRoom.acPowerKwh} kWh</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleDevice(selectedRoom.roomNumber, 'ac')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRoom.ac
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {selectedRoom.ac ? 'Turn OFF' : 'Turn ON'}
                </button>
              </div>
            </div>

            {/* Total Room Consumption (Section 31) */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500 dark:text-slate-400">Lights:</span>
                <span>{selectedRoom.lights ? `${selectedRoom.lightsPowerKwh} kWh` : '0.0 kWh'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500 dark:text-slate-400">Fans:</span>
                <span>{selectedRoom.fans ? `${selectedRoom.fansPowerKwh} kWh` : '0.0 kWh'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500 dark:text-slate-400">AC:</span>
                <span>{selectedRoom.ac ? `${selectedRoom.acPowerKwh} kWh` : '0.0 kWh'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Total Room Consumption:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {(
                    (selectedRoom.lights ? selectedRoom.lightsPowerKwh : 0) +
                    (selectedRoom.fans ? selectedRoom.fansPowerKwh : 0) +
                    (selectedRoom.ac ? selectedRoom.acPowerKwh : 0)
                  ).toFixed(1)} kWh
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRoomNumber(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
