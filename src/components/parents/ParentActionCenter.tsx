import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Calendar, 
  CreditCard, 
  Bus, 
  Eye, 
  BellRing,
  RotateCw
} from 'lucide-react';
import { ParentActionItem } from '../../types';
import { INITIAL_PARENT_ACTIONS } from '../../data/parentData';

interface ParentActionCenterProps {
  onExecuteAction: (action: ParentActionItem) => void;
  onFilterDirectory: (filterKeyword: string) => void;
}

export const ParentActionCenter: React.FC<ParentActionCenterProps> = ({
  onExecuteAction,
  onFilterDirectory,
}) => {
  const [actions, setActions] = useState<ParentActionItem[]>(INITIAL_PARENT_ACTIONS);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const handleActionClick = (item: ParentActionItem) => {
    onExecuteAction(item);
    setResolvedIds(prev => [...prev, item.id]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'attendance':
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'ptm':
        return <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'consent':
        return <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'fees':
        return <CreditCard className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'transport':
        return <Bus className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <BellRing className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Pending Parent Actions
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              {actions.filter(a => !resolvedIds.includes(a.id)).length} Active Queues
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational bottlenecks and guardian approvals requiring administrative resolution or follow-up dispatches.
          </p>
        </div>
      </div>

      {/* Grid of Pending Parent Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((item) => {
          const isResolved = resolvedIds.includes(item.id);
          return (
            <div
              key={item.id}
              id={`action-item-${item.id}`}
              className={`p-4 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-75'
                  : item.severity === 'critical'
                  ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 hover:border-rose-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                        : item.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                    }`}>
                      {item.severity}
                    </span>

                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {item.affectedCount} Parents
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => onFilterDirectory(item.filterKeyword)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Filtered List</span>
                    </button>

                    <button
                      id={`btn-action-${item.id}`}
                      onClick={() => handleActionClick(item)}
                      disabled={isResolved}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Executed</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{item.actionLabel}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
