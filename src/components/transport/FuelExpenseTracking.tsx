import React, { useState } from 'react';
import { 
  Fuel, 
  DollarSign, 
  TrendingUp, 
  Gauge, 
  Plus, 
  Calendar, 
  X, 
  FileSpreadsheet,
  Bus as BusIcon
} from 'lucide-react';
import { TransportExpenseLog, DetailedBus } from '../../types/transportManagement';

interface FuelExpenseTrackingProps {
  expenseLogs: TransportExpenseLog[];
  buses: DetailedBus[];
  onAddExpense: (entry: TransportExpenseLog) => void;
}

export const FuelExpenseTracking: React.FC<FuelExpenseTrackingProps> = ({
  expenseLogs,
  buses,
  onAddExpense
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [busNumber, setBusNumber] = useState<string>(buses[0]?.busNumber || 'Bus 01');
  const [liters, setLiters] = useState<number>(45);
  const [rate, setRate] = useState<number>(93.5);
  const [tolls, setTolls] = useState<number>(100);
  const [stationName, setStationName] = useState<string>('Indian Oil, Kote Gate Bikaner');

  const totalFuelCost = expenseLogs.reduce((acc, l) => acc + (l.totalFuelCost || l.fuelCost || 0), 0);
  const totalTolls = expenseLogs.reduce((acc, l) => acc + (l.tollAndMiscExpenses || l.tollExpense || 0), 0);
  const totalLiters = expenseLogs.reduce((acc, l) => acc + (l.fuelLiters || 0), 0);
  const grandTotal = totalFuelCost + totalTolls;
  const avgRate = (totalFuelCost / (totalLiters || 1)).toFixed(2);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBus = buses.find(b => b.busNumber === busNumber);
    const newEntry: TransportExpenseLog = {
      id: `exp-${Date.now()}`,
      busId: targetBus?.id || 'bus-1',
      busNumber,
      date: new Date().toISOString().split('T')[0],
      fuelLiters: Number(liters),
      fuelRatePerLiter: Number(rate),
      totalFuelCost: Number(liters) * Number(rate),
      odometerAtRefill: (targetBus?.odometerKm || 45000) + 120,
      fuelStationName: stationName,
      driverName: targetBus?.driverName || 'Rameshwar Singh',
      tollAndMiscExpenses: Number(tolls),
      grandTotal: (Number(liters) * Number(rate)) + Number(tolls)
    };
    onAddExpense(newEntry);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Diesel & Operating Expense Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fuel dispensation records, toll receipts, cost-per-kilometer audits and pump vouchers for Bikaner operations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Fuel Refill</span>
        </button>
      </div>

      {/* EXPENSE SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Fuel Dispensed</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {totalLiters.toFixed(0)} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <span className="text-[11px] text-slate-400">High-speed diesel (BS-VI)</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Fuel Expenditure</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ₹{totalFuelCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Avg ₹{avgRate}/L</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tolls & Parking</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ₹{totalTolls.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">FASTag auto-debit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Fleet Net Disbursal</span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
            ₹{grandTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Monthly operating budget</span>
        </div>
      </div>

      {/* FUEL LOGS TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Refueling Receipts & Station Logs</h3>
          <span className="text-xs text-slate-400">{expenseLogs.length} Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Bus</th>
                <th className="py-3 px-4">Pump Station</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Fuel Bill</th>
                <th className="py-3 px-4">FASTag/Misc</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {expenseLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{log.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.busNumber}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.fuelStationName || 'BPCL / IOCL Hub'}</td>
                  <td className="py-3 px-4">{log.driverName || 'Designated Driver'}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.fuelLiters} L</td>
                  <td className="py-3 px-4 font-mono text-slate-500">₹{log.fuelRatePerLiter || 93}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">₹{(log.totalFuelCost || log.fuelCost || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">₹{log.tollAndMiscExpenses || log.tollExpense || 0}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{(log.grandTotal || log.totalDayExpense || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD FUEL RECORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Diesel Refuel Vitals
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Select Bus</label>
                <select
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.busNumber}>{b.busNumber} ({b.driverName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Liters Dispensed</label>
                  <input
                    type="number"
                    value={liters}
                    onChange={(e) => setLiters(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Rate / Liter (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Toll & FASTag (INR)</label>
                  <input
                    type="number"
                    value={tolls}
                    onChange={(e) => setTolls(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Bill (Auto)</label>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white">
                    ₹{((liters * rate) + tolls).toFixed(0)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Fuel Station</label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save Refuel Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
