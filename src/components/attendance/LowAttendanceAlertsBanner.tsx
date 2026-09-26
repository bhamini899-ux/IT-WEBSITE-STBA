import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Send, 
  PhoneCall, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SmartAttendanceStudent } from '../../data/attendanceData';

interface LowAttendanceAlertsBannerProps {
  students: SmartAttendanceStudent[];
  threshold?: number;
  onSelectStudent: (student: SmartAttendanceStudent) => void;
  onNotifyGuardian: (student: SmartAttendanceStudent) => void;
}

export const LowAttendanceAlertsBanner: React.FC<LowAttendanceAlertsBannerProps> = ({
  students,
  threshold = 75,
  onSelectStudent,
  onNotifyGuardian,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter students below threshold
  const lowAttendanceStudents = students.filter(
    (s) => s.attendancePercentage < threshold || s.requiresAttention
  );

  if (lowAttendanceStudents.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50/90 rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-xs transition-all">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-amber-950">
                Low Attendance Alert: {lowAttendanceStudents.length} Students Below {threshold}% Threshold
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-200/80 text-amber-900">
                CBSE Guideline
              </span>
            </div>
            <p className="text-xs text-amber-800/90 mt-0.5">
              These students risk exam eligibility disqualification. Immediate parent intervention and counselor review recommended.
            </p>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Affected Students' : `Review ${lowAttendanceStudents.length} Students`}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded List of Affected Students */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowAttendanceStudents.map((student) => (
              <div
                key={student.id}
                className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs flex flex-col justify-between space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900">
                        {student.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {student.className}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Roll #{student.rollNo} • {student.guardianName}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {student.attendancePercentage.toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${student.attendancePercentage}%` }}
                  />
                </div>

                <p className="text-[11px] text-amber-900 line-clamp-1">
                  Missed {student.absentDays} days this term • Phone: {student.guardianPhone}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onNotifyGuardian(student)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send SMS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
