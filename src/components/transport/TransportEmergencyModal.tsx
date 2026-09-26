import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  Bus as BusIcon, 
  Phone, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Send
} from 'lucide-react';
import { DetailedBus } from '../../types/transportManagement';

interface TransportEmergencyModalProps {
  buses: DetailedBus[];
  isOpen: boolean;
  onClose: () => void;
  onTriggerEmergency: (busId: string, emergencyType: string, notes: string) => void;
}

export const TransportEmergencyModal: React.FC<TransportEmergencyModalProps> = ({
  buses,
  isOpen,
  onClose,
  onTriggerEmergency
}) => {
  const [selectedBusId, setSelectedBusId] = useState<string>(buses[0]?.id || 'bus-1');
  const [emergencyType, setEmergencyType] = useState<string>('Mechanical Breakdown');
  const [notes, setNotes] = useState<string>('');
  const [dispatched, setDispatched] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeBus = buses.find(b => b.id === selectedBusId) || buses[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerEmergency(selectedBusId, emergencyType, notes);
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/50 space-y-5">
        {/* HEADER */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Emergency & SOS Dispatch Protocol
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seth Tolaram Bafna Academy Rapid Incident Response
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DISCLAIMER BOX */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Safe Simulation Protocol:</strong> This triggers internal academy safety alerts and automated parent notices. It does not contact external municipal emergency lines directly in prototype mode.
        </div>

        {dispatched ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <div className="text-base font-bold text-slate-900 dark:text-white">
              Emergency Broadcast Dispatched
            </div>
            <p className="text-xs text-slate-500">
              Academy safety coordinator, backup transport unit, and parent notification gateway activated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Select Involved Bus
              </label>
              <select
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
              >
                {buses.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.busNumber} — {b.routeName} (Driver: {b.driverName})
                  </option>
                ))}
              </select>
            </div>

            {/* BUS DETAILS SUMMARY */}
            {activeBus && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Driver Phone:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeBus.driverPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Waypoint:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{activeBus.currentStop}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Students Onboard:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{activeBus.studentsOnboard} Students</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Emergency Incident Category
              </label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
              >
                <option value="Mechanical Breakdown">Mechanical Breakdown (Engine/Transmission)</option>
                <option value="Road Accident / Collision">Road Accident / Minor Collision</option>
                <option value="Medical Emergency Onboard">Medical Emergency Onboard</option>
                <option value="Severe Route Obstacle / Railway Gate Block">Severe Route Obstacle / Railway Gate Block</option>
                <option value="Severe Weather / Flooding">Severe Weather / Sandstorm / Flash Flooding</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Field Coordinator Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional instructions for replacement bus dispatch or parent SMS text..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Broadcast Emergency Dispatch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
