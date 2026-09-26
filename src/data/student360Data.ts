import { Student, StudentAuditLogItem } from '../types';
import { getPersistentStudents } from '../services/studentPersistenceService';

export const SCHOOL_WIDE_STUDENT_METRICS = {
  totalStudents: 0,
  activeStudents: 0,
  newAdmissions: 0,
  studentsOnLeave: 0,
  attendanceAttention: 0,
  pendingStudentActions: 0,
  classDistribution: [],
  feeCollectionStatus: {
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
  },
  transportUsage: {
    busRiders: 0,
    privateCommute: 0,
    walkers: 0
  }
};

// Real student records are maintained in persistent storage (studentPersistenceService)
// Dynamically reads from persistent storage so academic/parent views access real students
export const DETAILED_360_STUDENTS: Student[] = new Proxy([] as Student[], {
  get(_target, prop) {
    const current = getPersistentStudents();
    if (prop === 'length') return current.length;
    if (typeof prop === 'string' && !isNaN(Number(prop))) {
      return current[Number(prop)];
    }
    const val = Reflect.get(current, prop);
    if (typeof val === 'function') {
      return val.bind(current);
    }
    return val;
  }
});

export const INITIAL_STUDENT_AUDIT_LOG: StudentAuditLogItem[] = [];
