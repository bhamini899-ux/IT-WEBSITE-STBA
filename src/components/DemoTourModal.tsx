import React, { useState } from 'react';
import { 
  PlayCircle, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  UserCheck, 
  BookOpen, 
  Bus, 
  Zap, 
  LayoutDashboard,
  BellRing,
  Sparkles
} from 'lucide-react';
import { AppSection } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
  onTriggerParentNotificationDemo?: () => void;
  onTriggerBookReturnDemo?: () => void;
  onTriggerEnergyOptimizationDemo?: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerParentNotificationDemo,
  onTriggerBookReturnDemo,
  onTriggerEnergyOptimizationDemo,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      section: 'attendance' as AppSection,
      title: 'Step 1 — Smart Attendance',
      subtitle: '3 students are absent today.',
      description:
        'The system automatically tracks classroom attendance in real-time. Students below the 75% threshold (like Kabir Jain in 10-B) are highlighted, allowing administrators to notify parents with a single simulated SMS.',
      actionLabel: 'Simulate Parent Notification for Kabir Jain',
      icon: UserCheck,
      color: 'blue',
      triggerAction: onTriggerParentNotificationDemo,
    },
    {
      stepNumber: 2,
      section: 'library' as AppSection,
      title: 'Step 2 — Smart Library',
      subtitle: '12 books are due today across classes.',
      description:
        'Digitally tracks 4,860 cataloged books, real-time availability, and overdue fines (₹5/day). Experience fast category filtering, copy reservation, and instant return processing.',
      actionLabel: 'Perform Sample Library Return & Fine Calculation',
      icon: BookOpen,
      color: 'indigo',
      triggerAction: onTriggerBookReturnDemo,
    },
    {
      stepNumber: 3,
      section: 'transport' as AppSection,
      title: 'Step 3 — Smart Transport',
      subtitle: 'Bus Route 04 is currently active.',
      description:
        'Provides a visual school transport route map. Click Bus 04 (RJ-07-SB-1024) to inspect live stops (Station Road → Civil Lines), 7 min ETA, 42 onboard students, and automated safety alerts.',
      actionLabel: 'Inspect Bus 04 Route Details',
      icon: Bus,
      color: 'amber',
      triggerAction: undefined,
    },
    {
      stepNumber: 4,
      section: 'energy' as AppSection,
      title: 'Step 4 — Smart Energy',
      subtitle: 'Room 204 has no occupants but lights and fans are ON.',
      description:
        'Sensors detect empty classrooms consuming power. Smart School 360° isolates wastage and provides 1-click automatic optimization to power down idle devices and log energy savings.',
      actionLabel: 'Optimize Room 204 (Save 1.8 kWh)',
      icon: Zap,
      color: 'emerald',
      triggerAction: onTriggerEnergyOptimizationDemo,
    },
    {
      stepNumber: 5,
      section: 'dashboard' as AppSection,
      title: 'Step 5 — Unified School Overview',
      subtitle: 'All 4 smart modules synced in real-time.',
      description:
        'Notice how attendance, library inventory, transit safety, and power savings seamlessly reflect on the central administrator command dashboard.',
      actionLabel: 'View Final Dashboard & Status',
      icon: LayoutDashboard,
      color: 'sky',
      triggerAction: undefined,
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const goToStep = (index: number) => {
    setCurrentStep(index);
    onNavigate(steps[index].section);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-blue-500/50 shadow-2xl p-5 text-slate-900 dark:text-white animate-in slide-in-from-bottom-5 duration-200">
        {/* Top bar with step indicators */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
              Judge Demonstration Mode
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === currentStep
                    ? 'w-6 bg-blue-600'
                    : i < currentStep
                    ? 'bg-blue-300 dark:bg-blue-800'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
            <button
              onClick={onClose}
              className="ml-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Exit Demo Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
            <StepIcon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{current.title}</span>
            </h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              "{current.subtitle}"
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {current.description}
            </p>

            {/* Interactive demo action button if available */}
            {current.triggerAction && (
              <div className="mt-2.5">
                <button
                  onClick={() => current.triggerAction && current.triggerAction()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{current.actionLabel}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Exit Demonstration
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
