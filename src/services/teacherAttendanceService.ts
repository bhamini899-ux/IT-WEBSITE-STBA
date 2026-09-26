import { 
  Teacher, 
  TeacherLeaveRequest, 
  TeacherAttendanceRecord, 
  TeacherAttendanceRecordStatus 
} from '../types';

const ATTENDANCE_STORAGE_KEY = 'stba_teacher_attendance_records_v1';

// Helper to check if a date (YYYY-MM-DD) falls between startDate and endDate
export function isDateWithinRange(targetDate: string, startDate: string, endDate: string): boolean {
  if (!targetDate || !startDate) return false;
  const target = new Date(targetDate).getTime();
  const start = new Date(startDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : start;
  return target >= start && target <= end;
}

export function getAllStoredTeacherAttendance(): Record<string, TeacherAttendanceRecord[]> {
  try {
    const data = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse teacher attendance records', err);
  }
  return {};
}

export function saveAllTeacherAttendance(allData: Record<string, TeacherAttendanceRecord[]>): void {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(allData));
  } catch (err) {
    console.error('Failed to save teacher attendance', err);
  }
}

export function getTeacherAttendanceForDate(
  date: string,
  teachers: Teacher[],
  leaveRequests: TeacherLeaveRequest[] = []
): TeacherAttendanceRecord[] {
  const allStored = getAllStoredTeacherAttendance();
  const existingForDate = allStored[date] || [];

  // Identify teachers who have an approved leave covering this date
  const approvedLeavesOnDate = leaveRequests.filter(
    l => l.status === 'Approved' && isDateWithinRange(date, l.startDate, l.endDate)
  );
  const approvedTeacherIds = new Set(approvedLeavesOnDate.map(l => l.teacherId));

  // Build records for each active teacher
  return teachers.map(teacher => {
    const existing = existingForDate.find(r => r.teacherId === teacher.id);
    const hasApprovedLeave = approvedTeacherIds.has(teacher.id);

    if (hasApprovedLeave) {
      return {
        id: existing?.id || `att-${teacher.id}-${date}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        employeeId: teacher.employeeId,
        date,
        status: 'ON LEAVE' as TeacherAttendanceRecordStatus,
        checkIn: undefined,
        checkOut: undefined,
        remarks: 'Approved Leave in Portal',
        isApprovedLeave: true,
        recordedAt: existing?.recordedAt || new Date().toISOString()
      };
    }

    if (existing) {
      return existing;
    }

    // Default status if not yet recorded: check teacher's current status or default to PRESENT
    const defaultStatus: TeacherAttendanceRecordStatus = 
      teacher.currentStatus === 'Absent' ? 'ABSENT' :
      teacher.currentStatus === 'On Leave' ? 'ON LEAVE' : 'PRESENT';

    return {
      id: `att-${teacher.id}-${date}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      employeeId: teacher.employeeId,
      date,
      status: defaultStatus,
      checkIn: defaultStatus === 'PRESENT' ? '08:15 AM' : undefined,
      checkOut: undefined,
      remarks: '',
      isApprovedLeave: false,
      recordedAt: new Date().toISOString()
    };
  });
}

export function saveTeacherAttendanceForDate(
  date: string,
  records: TeacherAttendanceRecord[]
): void {
  const allStored = getAllStoredTeacherAttendance();
  allStored[date] = records;
  saveAllTeacherAttendance(allStored);
}

export function markAllTeachersPresent(
  date: string,
  teachers: Teacher[],
  leaveRequests: TeacherLeaveRequest[] = []
): TeacherAttendanceRecord[] {
  const approvedLeavesOnDate = leaveRequests.filter(
    l => l.status === 'Approved' && isDateWithinRange(date, l.startDate, l.endDate)
  );
  const approvedTeacherIds = new Set(approvedLeavesOnDate.map(l => l.teacherId));

  return teachers.map(teacher => {
    const hasApprovedLeave = approvedTeacherIds.has(teacher.id);
    if (hasApprovedLeave) {
      return {
        id: `att-${teacher.id}-${date}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        employeeId: teacher.employeeId,
        date,
        status: 'ON LEAVE' as TeacherAttendanceRecordStatus,
        checkIn: undefined,
        checkOut: undefined,
        remarks: 'Approved Leave in Portal',
        isApprovedLeave: true,
        recordedAt: new Date().toISOString()
      };
    }
    return {
      id: `att-${teacher.id}-${date}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      employeeId: teacher.employeeId,
      date,
      status: 'PRESENT' as TeacherAttendanceRecordStatus,
      checkIn: '08:15 AM',
      checkOut: undefined,
      remarks: 'Marked Present (Bulk)',
      isApprovedLeave: false,
      recordedAt: new Date().toISOString()
    };
  });
}

export function getTeacherAttendanceHistory(
  teacherId: string
): TeacherAttendanceRecord[] {
  const allStored = getAllStoredTeacherAttendance();
  const history: TeacherAttendanceRecord[] = [];

  Object.values(allStored).forEach(dayRecords => {
    const match = dayRecords.find(r => r.teacherId === teacherId);
    if (match) {
      history.push(match);
    }
  });

  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function calculateTeacherAttendanceStats(
  records: TeacherAttendanceRecord[],
  totalTeachers: number
) {
  if (totalTeachers === 0 || records.length === 0) {
    return {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      onLeave: 0,
      holiday: 0,
      rate: 0
    };
  }

  const present = records.filter(r => r.status === 'PRESENT').length;
  const late = records.filter(r => r.status === 'LATE').length;
  const halfDay = records.filter(r => r.status === 'HALF DAY').length;
  const absent = records.filter(r => r.status === 'ABSENT').length;
  const onLeave = records.filter(r => r.status === 'ON LEAVE').length;
  const holiday = records.filter(r => r.status === 'HOLIDAY').length;

  const attended = present + late + (halfDay * 0.5);
  const rate = Number(((attended / records.length) * 100).toFixed(1));

  return {
    total: records.length,
    present,
    absent,
    late,
    halfDay,
    onLeave,
    holiday,
    rate
  };
}
