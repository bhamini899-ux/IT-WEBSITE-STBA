import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  GraduationCap, 
  Bus, 
  CalendarPlus, 
  Wrench, 
  Megaphone, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { SchoolEvent, SchoolAnnouncement, MaintenanceIssue, Bus as BusType } from '../../types';

interface QuickActionModalProps {
  type: 'student' | 'teacher' | 'bus' | 'event' | 'maintenance' | 'announcement' | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onAddEvent?: (event: SchoolEvent) => void;
  onAddAnnouncement?: (announcement: SchoolAnnouncement) => void;
  onAddMaintenance?: (issue: MaintenanceIssue) => void;
  onAddBus?: (bus: BusType) => void;
}

export const QuickActionModals: React.FC<QuickActionModalProps> = ({
  type,
  onClose,
  onSuccess,
  onAddEvent,
  onAddAnnouncement,
  onAddMaintenance,
  onAddBus,
}) => {
  if (!type) return null;

  // Local form states
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (field: string, val: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'student') {
      onSuccess(`Student "${formData.name || 'New Student'}" enrolled successfully with RFID assigned.`);
    } else if (type === 'teacher') {
      onSuccess(`Faculty member "${formData.name || 'New Faculty'}" added to Department schedule.`);
    } else if (type === 'bus') {
      if (onAddBus) {
        onAddBus({
          id: `bus-${Date.now()}`,
          busNumber: formData.busNumber || 'Bus 09',
          routeName: formData.routeName || 'Route 9',
          routeId: 'ROUTE-09',
          driverName: formData.driverName || 'Driver Assigned',
          driverPhone: '+91 98765 43210',
          registrationPlate: formData.plate || 'RJ-07-SB-9999',
          capacity: Number(formData.capacity) || 50,
          studentsCount: 0,
          currentStop: 'Terminal A',
          nextStop: 'School Campus',
          status: 'At School',
          etaMinutes: 0,
          speedKmh: 0,
          fuelLevel: 100,
          x: 48,
          y: 62,
          stops: [
            { name: 'Terminal A', time: '07:30 AM', studentsCount: 15, reached: false },
            { name: 'School Campus', time: '08:15 AM', studentsCount: 0, reached: false }
          ],
          fuelLevelPct: 100,
          currentLocation: 'Campus Garage'
        });
      }
      onSuccess(`Bus "${formData.busNumber || 'Bus 09'}" registered to Smart Fleet system.`);
    } else if (type === 'event') {
      if (onAddEvent) {
        onAddEvent({
          id: `evt-${Date.now()}`,
          name: formData.name || 'Campus Academic Assembly',
          date: formData.date || 'Sep 25, 2026',
          time: formData.time || '10:00 AM',
          location: formData.location || 'Main Auditorium',
          type: formData.type || 'Academic',
          status: 'Scheduled',
          registeredCount: 120,
          description: 'Institutional academic gathering and student recognition program.',
        });
      }
      onSuccess(`Event "${formData.name || 'Campus Assembly'}" scheduled on Master Calendar.`);
    } else if (type === 'announcement') {
      if (onAddAnnouncement) {
        onAddAnnouncement({
          id: `ann-${Date.now()}`,
          title: formData.title || 'General Campus Update',
          category: formData.category || 'General',
          content: formData.content || 'Notice published to school mobile app & portal.',
          author: 'Administrative Office',
          time: 'Just now',
          audience: formData.audience || 'All School Community',
          priority: formData.priority || 'Medium',
          read: false,
        });
      }
      onSuccess(`Notice "${formData.title || 'Campus Update'}" broadcasted successfully.`);
    } else if (type === 'maintenance') {
      if (onAddMaintenance) {
        onAddMaintenance({
          id: `maint-${Date.now()}`,
          room: formData.room || 'Room 101',
          equipment: formData.equipment || 'Ceiling Light / Fixture',
          issue: formData.issue || 'Electrical malfunction',
          priority: formData.priority || 'Medium',
          status: 'Open',
          reportedAt: 'Just now',
          reportedTime: 'Just now',
          assignedTechnician: 'Duty Electrician',
          estimatedFixTime: '2 hours',
        });
      }
      onSuccess(`Maintenance ticket for "${formData.room || 'Facility'}" logged & dispatched.`);
    }

    onClose();
  };

  const getModalConfig = () => {
    switch (type) {
      case 'student':
        return {
          title: 'Register New Student',
          subtitle: 'Issue RFID card & sync academic record',
          icon: UserPlus,
          color: 'bg-blue-600',
        };
      case 'teacher':
        return {
          title: 'Onboard Faculty Member',
          subtitle: 'Assign staff ID, subject & timetable slots',
          icon: GraduationCap,
          color: 'bg-indigo-600',
        };
      case 'bus':
        return {
          title: 'Add Fleet Transport Bus',
          subtitle: 'Pair GPS IoT tracking & configure pickup route',
          icon: Bus,
          color: 'bg-amber-600',
        };
      case 'event':
        return {
          title: 'Create School Event',
          subtitle: 'Publish fixture to academic & public calendar',
          icon: CalendarPlus,
          color: 'bg-teal-600',
        };
      case 'announcement':
        return {
          title: 'Broadcast Announcement',
          subtitle: 'Publish notification across app, SMS & web portals',
          icon: Megaphone,
          color: 'bg-amber-600',
        };
      case 'maintenance':
      default:
        return {
          title: 'Log Facility Repair Ticket',
          subtitle: 'Dispatch campus engineering & electrical crew',
          icon: Wrench,
          color: 'bg-rose-600',
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className={`p-5 text-white ${config.color} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black">{config.title}</h3>
              <p className="text-xs text-white/80">{config.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {type === 'student' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ishaan Verma"
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Grade & Section</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 10-A"
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 142"
                    onChange={(e) => handleInputChange('roll', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Assigned RFID Tag UID</label>
                <input
                  type="text"
                  placeholder="e.g. RFID-8894-TX"
                  onChange={(e) => handleInputChange('rfid', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {type === 'teacher' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Meera Nambiar"
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Subject / Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Chemistry"
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Room / Lab</label>
                  <input
                    type="text"
                    placeholder="e.g. Chemistry Lab B"
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'bus' && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Bus Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bus 09"
                    onChange={(e) => handleInputChange('busNumber', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">License Plate</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RJ-07-SB-9921"
                    onChange={(e) => handleInputChange('plate', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Route Name & Areas</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 9: South Extension & Ring Road"
                  onChange={(e) => handleInputChange('routeName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Driver Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Singh"
                    onChange={(e) => handleInputChange('driverName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    defaultValue="50"
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'event' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual STEM & Robotics Expo"
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Date</label>
                  <input
                    type="text"
                    defaultValue="Oct 04, 2026"
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Time</label>
                  <input
                    type="text"
                    defaultValue="10:00 AM"
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Venue / Location</label>
                  <input
                    type="text"
                    defaultValue="Senior Wing Atrium"
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'announcement' && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early dispersal tomorrow due to state board evaluations"
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Detailed Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide complete details for parents, faculty, and students..."
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Audience</label>
                  <select
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="All Parents & Students">All Parents & Students</option>
                    <option value="Senior Classes (9-12)">Senior Classes (9-12)</option>
                    <option value="Primary School">Primary School</option>
                    <option value="Faculty Only">Faculty Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Priority</label>
                  <select
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'maintenance' && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Room / Wing</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 302 (Block C)"
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Equipment</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Board Display"
                    onChange={(e) => handleInputChange('equipment', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issue Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe electrical, mechanical or structural defect..."
                  onChange={(e) => handleInputChange('issue', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Urgency</label>
                <select
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical (Immediate Hazard)</option>
                </select>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
            >
              Save & Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
