import React, { useState, useMemo } from 'react';
import { 
  Bus as BusIcon, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Phone, 
  Clock, 
  Users, 
  Navigation, 
  AlertTriangle, 
  Route, 
  Fuel, 
  Gauge, 
  School,
  X,
  Compass,
  Radio,
  FileSpreadsheet,
  Calendar,
  Wrench,
  Search,
  SlidersHorizontal,
  Mail,
  Activity,
  Layers
} from 'lucide-react';
import { Bus, TransportRoute } from '../types';
import { 
  DetailedBus, 
  DetailedTransportRoute, 
  TransportTab, 
  StudentTransportAllocation,
  TransportBoardingRecord,
  TransportAlertItem,
  DriverConductorProfile,
  BusMaintenanceRecord,
  TransportExpenseLog,
  BusOperationalStatus
} from '../types/transportManagement';
import {
  DETAILED_BUSES,
  DETAILED_ROUTES,
  STUDENT_TRANSPORT_ALLOCATIONS,
  TRANSPORT_BOARDING_RECORDS,
  TRANSPORT_ALERTS,
  STAFF_PROFILES,
  BUS_MAINTENANCE_RECORDS,
  TRANSPORT_EXPENSE_LOGS
} from '../data/transportManagementData';

// Import subcomponents
import { TransportCommandCenter } from '../components/transport/TransportCommandCenter';
import { BusFleetManagement } from '../components/transport/BusFleetManagement';
import { RouteManagementSection } from '../components/transport/RouteManagementSection';
import { BusStopsSection } from '../components/transport/BusStopsSection';
import { StudentTransportAllocationSection } from '../components/transport/StudentTransportAllocation';
import { BoardingExitTracking } from '../components/transport/BoardingExitTracking';
import { LiveBusMonitoring } from '../components/transport/LiveBusMonitoring';
import { TransportAlertsCenter } from '../components/transport/TransportAlertsCenter';
import { DriverConductorManagement } from '../components/transport/DriverConductorManagement';
import { BusMaintenanceSection } from '../components/transport/BusMaintenanceSection';
import { FuelExpenseTracking } from '../components/transport/FuelExpenseTracking';
import { TransportAttendanceSection } from '../components/transport/TransportAttendanceSection';
import { TransportReportsAnalytics } from '../components/transport/TransportReportsAnalytics';
import { TransportEmergencyModal } from '../components/transport/TransportEmergencyModal';
import { ParentTransportConnectionModal } from '../components/transport/ParentTransportConnectionModal';

interface TransportViewProps {
  buses?: Bus[];
  routes?: TransportRoute[];
  onTriggerEmergencyAlert?: () => void;
  selectedBusId?: string;
}

export const TransportView: React.FC<TransportViewProps> = ({
  onTriggerEmergencyAlert,
  selectedBusId: initialBusId = 'bus-4'
}) => {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<TransportTab>('command_center');

  // Core domain state for Module 8
  const [detailedBuses, setDetailedBuses] = useState<DetailedBus[]>(DETAILED_BUSES);
  const [detailedRoutes, setDetailedRoutes] = useState<DetailedTransportRoute[]>(DETAILED_ROUTES);
  const [studentAllocations, setStudentAllocations] = useState<StudentTransportAllocation[]>(STUDENT_TRANSPORT_ALLOCATIONS);
  const [boardingRecords, setBoardingRecords] = useState<TransportBoardingRecord[]>(TRANSPORT_BOARDING_RECORDS);
  const [transportAlerts, setTransportAlerts] = useState<TransportAlertItem[]>(TRANSPORT_ALERTS);
  const [staffList, setStaffList] = useState<DriverConductorProfile[]>(STAFF_PROFILES);
  const [maintenanceRecords, setMaintenanceRecords] = useState<BusMaintenanceRecord[]>(BUS_MAINTENANCE_RECORDS);
  const [expenseLogs, setExpenseLogs] = useState<TransportExpenseLog[]>(TRANSPORT_EXPENSE_LOGS);

  // Active selections & search
  const [selectedBusId, setSelectedBusId] = useState<string>(initialBusId);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isParentConnectModalOpen, setIsParentConnectModalOpen] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setFeedbackToast({ title, desc });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  // Status updates
  const handleUpdateBusStatus = (busId: string, status: BusOperationalStatus) => {
    setDetailedBuses(prev => prev.map(b => b.id === busId ? { ...b, operationalStatus: status } : b));
    showToast('Bus Status Updated', `${busId} status set to ${status}.`);
  };

  // Advance simulation tick
  const handleSimulateTick = () => {
    setDetailedBuses(prev => prev.map(b => {
      if (b.operationalStatus === 'On Route' || b.operationalStatus === 'Delayed') {
        // slight jitter coordinates
        const deltaX = (Math.random() - 0.5) * 2;
        const deltaY = (Math.random() - 0.5) * 2;
        const newSpeed = Math.floor(25 + Math.random() * 15);
        const newEta = Math.max(1, b.nextStopEtaMinutes - 1);
        return {
          ...b,
          x: Math.max(10, Math.min(90, b.x + deltaX)),
          y: Math.max(10, Math.min(90, b.y + deltaY)),
          speedKmh: newSpeed,
          nextStopEtaMinutes: newEta,
          lastUpdatedTime: 'Just now'
        };
      }
      return b;
    }));
  };

  // RFID simulation tap
  const handleSimulateRfidTap = (recordId: string) => {
    setBoardingRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        let nextStatus: TransportBoardingRecord['status'] = 'Boarded';
        let newBoarding = rec.boardingTime || '07:22 AM';
        let newExit = rec.exitTime;

        if (rec.status === 'Awaiting Pickup') {
          nextStatus = 'Boarded';
          newBoarding = '07:25 AM';
        } else if (rec.status === 'Boarded') {
          nextStatus = 'Reached School';
          newExit = '07:52 AM';
        } else if (rec.status === 'Reached School') {
          nextStatus = 'Awaiting Pickup';
          newBoarding = '';
          newExit = '';
        }

        return {
          ...rec,
          status: nextStatus,
          boardingTime: newBoarding,
          exitTime: newExit
        };
      }
      return rec;
    }));
    showToast('RFID Conductor Tap Recorded', 'Student status updated & synchronized with Parent Connect.');
  };

  // Staff duty toggle
  const handleToggleDutyStatus = (staffId: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const nextStatus = s.dutyStatus === 'On Duty' ? 'Off Duty' : 'On Duty';
        return { ...s, dutyStatus: nextStatus };
      }
      return s;
    }));
    showToast('Crew Duty Status Modified', 'Shift log updated in academy registry.');
  };

  // Reassign staff
  const handleReassignStaff = (staffId: string, newBusId: string, newBusNumber: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return { ...s, assignedBusId: newBusId, assignedBusNumber: newBusNumber };
      }
      return s;
    }));
    showToast('Staff Reassigned', `Assigned to ${newBusNumber}.`);
  };

  // Update student allocation
  const handleUpdateAllocation = (updated: StudentTransportAllocation) => {
    setStudentAllocations(prev => prev.map(a => a.studentId === updated.studentId ? updated : a));
    showToast('Allocation Saved', `Transport details updated for ${updated.studentName}.`);
  };

  // Alerts actions
  const handleAcknowledgeAlert = (alertId: string) => {
    setTransportAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Acknowledged' } : a));
    showToast('Alert Acknowledged', 'Dispatched to fleet coordinator.');
  };

  const handleResolveAlert = (alertId: string) => {
    setTransportAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
    showToast('Alert Resolved', 'Incident closed successfully.');
  };

  const handleBroadcastParentNotice = (alert: TransportAlertItem) => {
    setTransportAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, parentNotified: true } : a));
    showToast('Parent Broadcast Sent', `Gmail advisory dispatched for ${alert.busNumber}: ${alert.description}`);
  };

  // Emergency dispatch
  const handleTriggerEmergency = (busId: string, emergencyType: string, notes: string) => {
    const targetBus = detailedBuses.find(b => b.id === busId);
    if (onTriggerEmergencyAlert) {
      onTriggerEmergencyAlert();
    }
    const newAlert: TransportAlertItem = {
      id: `alert-em-${Date.now()}`,
      busId,
      type: 'Emergency Alert',
      busNumber: targetBus?.busNumber || 'Bus',
      routeName: targetBus?.routeName || 'Corridor',
      timestamp: 'Just now',
      severity: 'High',
      category: 'Emergency',
      description: `SOS: ${emergencyType} reported near ${targetBus?.currentStop || 'Transit Loop'}. ${notes}`,
      status: 'Active',
      parentNotified: true
    };
    setTransportAlerts(prev => [newAlert, ...prev]);
    showToast('Emergency SOS Dispatched', `High-priority protocol active for ${targetBus?.busNumber}. Parents & administration alerted.`);
  };

  // Add maintenance & fuel
  const handleAddMaintenance = (rec: BusMaintenanceRecord) => {
    setMaintenanceRecords(prev => [rec, ...prev]);
    showToast('Service Record Saved', `Workshop entry recorded for ${rec.busNumber}.`);
  };

  const handleAddExpense = (entry: TransportExpenseLog) => {
    setExpenseLogs(prev => [entry, ...prev]);
    showToast('Fuel Log Recorded', `Refueling of ${entry.fuelLiters}L added for ${entry.busNumber}.`);
  };

  // TABS CONFIGURATION
  const tabsList: { id: TransportTab; label: string; icon: any; count?: number }[] = [
    { id: 'command_center', label: 'Command Center', icon: Activity },
    { id: 'fleet', label: 'Bus Fleet', icon: BusIcon, count: detailedBuses.length },
    { id: 'routes', label: 'Routes Network', icon: Route, count: detailedRoutes.length },
    { id: 'stops', label: 'Bus Stops', icon: MapPin },
    { id: 'student_allocation', label: 'Student Roster', icon: Users, count: studentAllocations.length },
    { id: 'boarding_exit', label: 'Boarding & RFID', icon: Radio },
    { id: 'live_monitoring', label: 'Live Radar', icon: Navigation },
    { id: 'alerts', label: 'Incidents & Alerts', icon: AlertTriangle, count: transportAlerts.filter(a => a.status === 'Active').length },
    { id: 'crew', label: 'Drivers & Crew', icon: School, count: staffList.length },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'expenses', label: 'Fuel & Expenses', icon: Fuel },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* GLOBAL FEEDBACK TOAST */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">{feedbackToast.title}</div>
            <div className="text-slate-300 text-[11px]">{feedbackToast.desc}</div>
          </div>
        </div>
      )}

      {/* TOP HEADER & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[11px] font-bold">
              Module 8
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
              Smart Transport Management
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Simulated GPS Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Seth Tolaram Bafna Academy Unified Fleet Operations, Route Geofencing & Simulated Bus Tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsParentConnectModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>Parent Connect & Gmail</span>
          </button>

          <button
            id="btn-emergency-alert-top"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Emergency SOS</span>
          </button>
        </div>
      </div>

      {/* PROTOTYPE / SIMULATED TRANSPORT ALLOCATION BANNER (RULE 31 & 32) */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <span className="font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] tracking-wide">
            Prototype / Simulated Transport Allocation
          </span>
          <span className="font-medium">
            Currently allocated: <strong>{studentAllocations.length}</strong> of <strong>219</strong> real Class 10 students across the 5 official academy bus routes (remainder commute privately). Total assigned never exceeds 219.
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
          5 Academy Buses • 5 Active Routes
        </span>
      </div>

      {/* HORIZONTAL SUB-NAVIGATION TABS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {tabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE TAB CONTENT VIEW */}
      <div>
        {activeTab === 'command_center' && (
          <TransportCommandCenter
            buses={detailedBuses}
            alerts={transportAlerts}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onSelectBus={(busId) => {
              setSelectedBusId(busId);
              setActiveTab('fleet');
            }}
            searchQuery={globalSearchQuery}
            setSearchQuery={setGlobalSearchQuery}
          />
        )}

        {activeTab === 'fleet' && (
          <BusFleetManagement
            buses={detailedBuses}
            selectedBusId={selectedBusId}
            onSelectBus={setSelectedBusId}
            onUpdateBusStatus={handleUpdateBusStatus}
            onOpenLiveRadar={(busId) => {
              setSelectedBusId(busId);
              setActiveTab('live_monitoring');
            }}
          />
        )}

        {activeTab === 'routes' && (
          <RouteManagementSection
            routes={detailedRoutes}
            onSelectRouteBus={(busId) => {
              setSelectedBusId(busId);
              setActiveTab('fleet');
            }}
          />
        )}

        {activeTab === 'stops' && (
          <BusStopsSection
            routes={detailedRoutes}
            onSelectBus={(busId) => {
              setSelectedBusId(busId);
              setActiveTab('fleet');
            }}
          />
        )}

        {activeTab === 'student_allocation' && (
          <StudentTransportAllocationSection
            allocations={studentAllocations}
            buses={detailedBuses}
            routes={detailedRoutes}
            onUpdateAllocation={handleUpdateAllocation}
          />
        )}

        {activeTab === 'boarding_exit' && (
          <BoardingExitTracking
            records={boardingRecords}
            onSimulateRfidTap={handleSimulateRfidTap}
            onSendParentNotification={(student, event) => {
              showToast('Parent Notification Queued', `Message sent for ${student}: ${event}.`);
            }}
          />
        )}

        {activeTab === 'live_monitoring' && (
          <LiveBusMonitoring
            buses={detailedBuses}
            routes={detailedRoutes}
            selectedBusId={selectedBusId}
            onSelectBus={setSelectedBusId}
            onSimulateTick={handleSimulateTick}
          />
        )}

        {activeTab === 'alerts' && (
          <TransportAlertsCenter
            alerts={transportAlerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onResolveAlert={handleResolveAlert}
            onBroadcastParentNotice={handleBroadcastParentNotice}
          />
        )}

        {activeTab === 'crew' && (
          <DriverConductorManagement
            staffList={staffList}
            buses={detailedBuses}
            onToggleDutyStatus={handleToggleDutyStatus}
            onReassignStaff={handleReassignStaff}
          />
        )}

        {activeTab === 'maintenance' && (
          <BusMaintenanceSection
            maintenanceRecords={maintenanceRecords}
            buses={detailedBuses}
            onAddMaintenanceRecord={handleAddMaintenance}
            onUpdateIssueStatus={(recId, status) => {
              setMaintenanceRecords(prev => prev.map(m => m.id === recId ? { ...m, status } : m));
              showToast('Maintenance Status Updated', `Status changed to ${status}.`);
            }}
          />
        )}

        {activeTab === 'expenses' && (
          <FuelExpenseTracking
            expenseLogs={expenseLogs}
            buses={detailedBuses}
            onAddExpense={handleAddExpense}
          />
        )}

        {activeTab === 'attendance' && (
          <TransportAttendanceSection
            records={boardingRecords}
            buses={detailedBuses}
          />
        )}

        {activeTab === 'reports' && (
          <TransportReportsAnalytics
            buses={detailedBuses}
            routes={detailedRoutes}
          />
        )}
      </div>

      {/* EMERGENCY SOS DISPATCH MODAL */}
      <TransportEmergencyModal
        buses={detailedBuses}
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onTriggerEmergency={handleTriggerEmergency}
      />

      {/* PARENT CONNECT & GMAIL GATEWAY MODAL */}
      <ParentTransportConnectionModal
        isOpen={isParentConnectModalOpen}
        onClose={() => setIsParentConnectModalOpen(false)}
        onSendNotice={(name, ev) => {
          showToast('Gmail Broadcast Sent', `Sample notification dispatched for ${name} (${ev}).`);
        }}
      />
    </div>
  );
};
