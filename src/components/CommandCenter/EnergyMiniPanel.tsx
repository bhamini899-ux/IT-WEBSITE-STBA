import React, { useState } from 'react';
import { 
  Zap, 
  TrendingDown, 
  IndianRupee, 
  AlertTriangle, 
  ArrowRight, 
  Power, 
  Check, 
  Leaf 
} from 'lucide-react';
import { AppSection } from '../../types';
import { HOURLY_ENERGY_PEAKS } from '../../data/initialData';

interface EnergyMiniPanelProps {
  onNavigate: (section: AppSection) => void;
  todayKwh?: number;
  estimatedCost?: number;
  savingsPct?: number;
  monthlySavedKwh?: number;
}

export const EnergyMiniPanel: React.FC<EnergyMiniPanelProps> = ({
  onNavigate,
  todayKwh = 1842,
  estimatedCost = 15820,
  savingsPct = 7.4,
  monthlySavedKwh = 2184,
}) => {
  const [room204Fixed, setRoom204Fixed] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Energy & Carbon Grid</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">IoT power meters & solar telemetry</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/50">
            <Leaf className="w-3 h-3" /> Eco Mode Active
          </span>
        </div>

        {/* Primary Usage Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Today's Consumption</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-baseline gap-1">
              <span>{todayKwh.toLocaleString()}</span>
              <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="w-3 h-3" /> -{savingsPct}% vs yesterday
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Estimated Cost</span>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-baseline">
              <span>₹{estimatedCost.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Tariff: Commercial B2
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">Saved This Month</span>
            <div className="text-lg font-black text-emerald-800 dark:text-emerald-200 mt-0.5">
              {monthlySavedKwh.toLocaleString()} <span className="text-xs font-normal">kWh</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
              ~1.7 Tons CO₂ avoided
            </div>
          </div>
        </div>

        {/* Hourly Peak Consumption Micro Graph */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 my-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <span>Hourly Load Profile</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
              Peak Hours: 11:00 AM – 01:00 PM
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 items-end h-16 pt-1">
            {HOURLY_ENERGY_PEAKS.map((pt) => {
              const heightPct = Math.min(100, Math.round((pt.kwh / 360) * 100));
              const isPeak = pt.hour === '11:00' || pt.hour === '12:00';

              return (
                <div key={pt.hour} className="flex flex-col items-center gap-1 group">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-12 flex items-end overflow-hidden">
                    <div 
                      className={`w-full rounded transition-all duration-300 ${isPeak ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ height: `${heightPct}%` }}
                      title={`${pt.hour}: ${pt.kwh} kWh`}
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono scale-90">{pt.hour.slice(0, 2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Energy Wastage Alert with 1-Click Fix */}
        <div className={`p-3 rounded-xl border transition-all text-xs my-2 ${
          room204Fixed
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
            : 'bg-amber-50 border-amber-200/80 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${room204Fixed ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div>
                <span className="font-bold">
                  {room204Fixed ? 'Auto-Shutdown Dispatched' : 'Room 204: AC running while occupancy = 0'}
                </span>
                <p className="text-[11px] mt-0.5 opacity-90 leading-tight">
                  {room204Fixed
                    ? 'Command confirmed: Relay shut down Room 204 AC remotely. 1.8 kWh saved.'
                    : 'Classroom vacant since 08:20 AM. Continuous idle power draw detected.'}
                </p>
              </div>
            </div>

            {!room204Fixed ? (
              <button
                onClick={() => setRoom204Fixed(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Power className="w-3 h-3" />
                <span>Fix Remote</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check className="w-3.5 h-3.5" /> Fixed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Solar rooftop yield: <strong>680 kWh generated</strong>
        </span>
        <button
          onClick={() => onNavigate('energy')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
        >
          <span>Open Energy Management</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
