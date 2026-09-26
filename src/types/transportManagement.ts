import { Bus, TransportRoute } from '../types';

export type TransportTab = 
  | 'command_center'
  | 'fleet'
  | 'routes'
  | 'stops'
  | 'students'
  | 'student_allocation'
  | 'boarding_tracking'
  | 'boarding_exit'
  | 'live_monitoring'
  | 'alerts'
  | 'drivers_conductors'
  | 'crew'
  | 'maintenance'
  | 'fuel_expenses'
  | 'expenses'
  | 'attendance'
  | 'reports_analytics'
  | 'reports'
  | 'parent_bridge';

export type BusOperationalStatus = 'On Route' | 'At School' | 'Delayed' | 'Issue' | 'Inactive';

export interface TransportEquipmentChecklist {
  cctvInstalled: boolean;
  cctvWorking: boolean;
  firstAidKitPresent: boolean;
  fireExtinguisherValid: boolean;
  speedGovernorFitted: boolean;
  speedLimitKmh: number;
  panicButtonsFunctional: boolean;
  gpsTransponderActive: boolean;
}

export interface DetailedBus extends Bus {
  conductorName: string;
  conductorPhone: string;
  capacity: number;
  studentsAssigned: number;
  studentsOnboard: number;
  currentTrip: 'Morning Pickup' | 'Afternoon Drop' | 'Extracurricular Run' | 'Idle' | 'Maintenance';
  lastUpdatedTime: string;
  odometerKm: number;
  operationalStatus: BusOperationalStatus;
  makeModel: string;
  manufactureYear: number;
  insuranceValidTill: string;
  fitnessCertValidTill: string;
  pucValidTill: string;
  permitType: string;
  equipment: TransportEquipmentChecklist;
  currentStopIndex: number;
  nextStopEtaMinutes: number;
  averageMileageKmpl: number;
}

export interface TransportStop {
  id: string;
  name: string;
  landmark: string;
  arrivalTime: string;
  departureTime: string;
  sequenceOrder: number;
  studentsAssigned: number;
  boardingCount: number;
  dropOffCount: number;
  status: 'Passed' | 'Approaching' | 'Pending';
  geoCoordinates: { lat: number; lng: number; x: number; y: number };
}

export interface DetailedTransportRoute {
  routeId: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  destinationPoint: string;
  totalDistanceKm: number;
  estimatedTravelTimeMin: number;
  assignedBusId: string;
  assignedBusNumber: string;
  assignedDriverName: string;
  assignedDriverPhone: string;
  assignedStudentsCount: number;
  morningStartTime: string;
  morningSchoolReachTime: string;
  afternoonDispersalTime: string;
  stops: TransportStop[];
  status: 'Active' | 'At School' | 'Completed' | 'Delayed';
}

export interface StudentTransportAllocation {
  studentId: string;
  studentName: string;
  rollNo: number;
  className: string;
  section: string;
  gender: 'M' | 'F';
  avatar: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  assignedBusId: string;
  assignedBusNumber: string;
  assignedRouteId: string;
  assignedRouteName: string;
  assignedStopName: string;
  pickupTime: string;
  dropOffTime: string;
  transportFeeStatus: 'Paid' | 'Pending' | 'Exempt';
  transportStatus: 'Active' | 'On Leave' | 'Suspended';
  address: string;
}

export interface TransportBoardingRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  busNumber: string;
  stopName: string;
  scheduledTime: string;
  boardingTime?: string;
  exitTime?: string;
  status: 'Boarded' | 'Reached School' | 'Awaiting Pickup' | 'Not Boarded' | 'Exception';
  rfidCardId: string;
  exceptionReason?: string;
  date: string;
  tripType: 'Morning Pickup' | 'Afternoon Drop';
  parentNotified: boolean;
}

export type AlertSeverity = 'High' | 'Medium' | 'Low' | 'All';
export type AlertCategory = 'All' | 'Delay' | 'Mechanical' | 'Safety' | 'Attendance' | 'Emergency' | string;

export interface TransportAlertItem {
  id: string;
  busId?: string;
  routeId?: string;
  title?: string;
  type: 
    | 'Bus Delayed' 
    | 'Bus Stopped Unexpectedly' 
    | 'Route Deviation' 
    | 'Bus Capacity Warning' 
    | 'Student Not Boarded' 
    | 'Student Not Exited' 
    | 'Vehicle Issue' 
    | 'Driver Issue' 
    | 'Emergency Alert' 
    | string;
  category?: string;
  severity: 'High' | 'Medium' | 'Low' | string;
  busNumber: string;
  routeName: string;
  timestamp: string;
  description: string;
  status?: 'Active' | 'Acknowledged' | 'Resolved' | string;
  reportedBy?: string;
  suggestedAction?: string;
  parentNotified?: boolean;
  acknowledged?: boolean;
}

export interface DriverConductorProfile {
  id: string;
  employeeId?: string;
  name: string;
  role: 'Driver' | 'Conductor';
  avatar?: string;
  phone: string;
  alternatePhone?: string;
  photoUrl?: string;
  emergencyContact?: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedBusId?: string;
  assignedBusNumber: string;
  assignedRouteId?: string;
  assignedRouteName?: string;
  dutyStatus?: 'On Duty' | 'Off Duty' | 'On Leave';
  status?: 'Active' | 'On Duty' | 'Off Duty' | 'On Leave' | string;
  experienceYears: number;
  tripsCompletedToday?: number;
  totalTripsMonth?: number;
  rating: number;
  incidentsReported?: number;
  backgroundCheckVerified?: boolean;
  bloodGroup: string;
  address?: string;
}

export interface BusMaintenanceRecord {
  id: string;
  busId?: string;
  busNumber: string;
  date?: string;
  performedBy?: string;
  registrationPlate?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  nextServiceDue?: string;
  nextDueDate?: string;
  maintenanceStatus?: 'Fit' | 'Scheduled Soon' | 'Overdue' | 'Under Repair' | string;
  status?: 'Fit' | 'Scheduled Soon' | 'Overdue' | 'Under Repair' | string;
  description?: string;
  odometerKm?: number;
  odometerReading?: number;
  odometerAtService?: number;
  serviceDate?: string;
  serviceType?: string;
  technicianNotes?: string;
  costInr?: number;
  cost?: number;
  notes?: string;
  serviceHistory?: {
    date: string;
    serviceType: string;
    workshop: string;
    cost: number;
    notes: string;
    technician: string;
  }[];
  reportedIssues?: {
    id: string;
    reportedAt: string;
    issueDescription: string;
    severity: 'Critical' | 'Moderate' | 'Minor';
    status: 'Open' | 'In Progress' | 'Resolved';
  }[];
}

export interface TransportExpenseLog {
  id: string;
  busId?: string;
  busNumber: string;
  category?: string;
  amount?: number;
  invoiceNumber?: string;
  odometerReading?: number;
  approvedBy?: string;
  ratePerLitre?: number;
  date: string;
  driverName?: string;
  fuelStationName?: string;
  fuelLiters?: number;
  litres?: number;
  fuelCost?: number;
  totalFuelCost?: number;
  fuelRatePerLiter?: number;
  maintenanceCost?: number;
  tollExpense?: number;
  tollAndMiscExpenses?: number;
  driverAllowance?: number;
  totalDayExpense?: number;
  grandTotal?: number;
  currentOdometer?: number;
  odometerAtRefill?: number;
  distanceTraveledKm?: number;
}

export interface TransportEmergencyEvent {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeName: string;
  currentLocationName: string;
  studentsOnboardCount: number;
  emergencyType: 'Accident' | 'Mechanical Breakdown' | 'Medical Emergency' | 'Severe Traffic Block' | 'Weather Hazard';
  alertStatus: 'Broadcast Sent' | 'Assistance Dispatched' | 'Resolved';
  timestamp: string;
  details: string;
  notifiedAuthorities: string[];
}
