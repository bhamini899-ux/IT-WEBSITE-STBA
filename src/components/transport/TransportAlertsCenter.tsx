import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Send, 
  Filter, 
  Bus as BusIcon, 
  Mail, 
  Check, 
  X,
  MessageSquare
} from 'lucide-react';
import { TransportAlertItem, AlertSeverity, AlertCategory } from '../../types/transportManagement';

interface TransportAlertsCenterProps {
  alerts: TransportAlertItem[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onBroadcastParentNotice: (alert: TransportAlertItem) => void;
}

export const TransportAlertsCenter: React.FC<TransportAlertsCenterProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onBroadcastParentNotice
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('Active');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transport Incident & Alert Feed</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time geofence breaches, mechanical alerts, unexpected delays, and safety exceptions across the fleet.
          </p>
        </div>

        {/* STATUS TOGGLE */}
        <div className="flex items-center gap-2">
          {['Active', 'Resolved', 'All'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {st} ({alerts.filter(a => st === 'All' ? true : a.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* SEVERITY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Severity:</span>
        {['All', 'High', 'Medium', 'Low'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              severityFilter === sev
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* ALERTS LIST */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">No Incidents Matching Selected Filter</div>
            <p className="text-xs text-slate-400 mt-1">All academy transport corridors operating within safe parameters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alert.severity === 'High' 
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10' 
                  : alert.severity === 'Medium'
                  ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    alert.severity === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    alert.severity === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {alert.severity} Priority
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                    {alert.category}
                  </span>

                  <span className="text-xs text-slate-400">
                    Bus: <strong className="text-slate-700 dark:text-slate-300">{alert.busNumber}</strong> ({alert.routeName})
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {alert.description}
                </p>

                {alert.parentNotified && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Parent broadcast dispatched via Gmail / SMS</span>
                  </div>
                )}
              </div>

              {/* ACTION CONTROLS */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                {alert.status === 'Active' ? (
                  <>
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => onBroadcastParentNotice(alert)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Notify Parents</span>
                    </button>
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
