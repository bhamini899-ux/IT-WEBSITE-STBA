import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldAlert, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { SmartAlertItem, AppSection } from '../../types';

interface SmartAlertsPanelProps {
  alerts: SmartAlertItem[];
  onNavigate: (section: AppSection) => void;
  onResolveAlert: (id: string) => void;
}

export const SmartAlertsPanel: React.FC<SmartAlertsPanelProps> = ({
  alerts,
  onNavigate,
  onResolveAlert,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedCount = alerts.filter(a => a.resolved).length;

  const filteredAlerts = filterSeverity === 'all'
    ? alerts
    : alerts.filter(a => a.severity.toLowerCase() === filterSeverity.toLowerCase());

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'CRITICAL',
          badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'high':
        return {
          label: 'HIGH',
          badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
        };
      case 'medium':
        return {
          label: 'MEDIUM',
          badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'info':
      default:
        return {
          label: 'INFO',
          badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
          icon: <Info className="w-3.5 h-3.5 text-blue-600" />,
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Active Smart Alerts</span>
                {activeAlerts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                    {activeAlerts.length} Active
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Multi-system autonomous priority dispatch</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterSeverity === 'critical'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterSeverity('high')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterSeverity === 'high'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setFilterSeverity('medium')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                filterSeverity === 'medium'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
              }`}
            >
              Med
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 mt-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {filteredAlerts.map((alert) => {
            const badge = getSeverityBadge(alert.severity);

            return (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border transition-all ${
                  alert.resolved
                    ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-60'
                    : alert.severity === 'critical'
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${badge.badgeClass}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                      {alert.module}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {alert.time}
                  </span>
                </div>

                <div className="mt-1.5">
                  <h4 className={`text-xs font-bold ${alert.resolved ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigate(alert.targetSection)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 cursor-pointer"
                  >
                    <span>{alert.actionLabel || 'View in Module'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {alert.resolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 text-[11px] font-bold border border-emerald-200/60 dark:border-emerald-800/60 cursor-pointer transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{resolvedCount} alerts handled today</span>
        <button
          onClick={() => onNavigate('smart_alerts')}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Incident Center & Policies
        </button>
      </div>
    </div>
  );
};
