import { Student } from '../types';
import { REAL_CLASS_10_STUDENTS } from '../data/class10RealStudents';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const STUDENTS_STORAGE_KEY = 'stba_real_students_registry_v2';
const DELETED_STUDENTS_KEY = 'stba_deleted_students_ids_v2';
const STUDENTS_INITIALIZED_KEY = 'stba_students_initialized_v2';
const STUDENTS_COLLECTION = 'students';

const VALID_SECTIONS = new Set(['10-A', '10-B', '10-C', '10-D', '10-E']);

/**
 * Normalizes class name to ensure it strictly belongs to Class 10 (10-A to 10-E).
 */
export function normalizeClass10Section(className?: string, section?: string): { className: string; section: string } | null {
  const c = (className || '').toString().trim().toUpperCase();
  const s = (section || '').toString().trim().toUpperCase();

  // If already formatted like "10-A"
  if (VALID_SECTIONS.has(c)) {
    return { className: c, section: c.split('-')[1] };
  }

  // If class is "10" and section is "A"
  if (c === '10' && ['A', 'B', 'C', 'D', 'E'].includes(s)) {
    return { className: `10-${s}`, section: s };
  }

  // If section alone is valid A..E
  if (['A', 'B', 'C', 'D', 'E'].includes(s)) {
    return { className: `10-${s}`, section: s };
  }

  return null;
}

/**
 * Returns set of permanently deleted student IDs.
 */
export function getDeletedStudentIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_STUDENTS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch (err) {
    console.error('Failed to parse deleted student IDs from storage', err);
  }
  return new Set();
}

/**
 * Marks a student ID as permanently deleted.
 */
export function markStudentDeleted(studentId: string): void {
  const deletedSet = getDeletedStudentIds();
  deletedSet.add(studentId);
  try {
    localStorage.setItem(DELETED_STUDENTS_KEY, JSON.stringify(Array.from(deletedSet)));
  } catch (err) {
    console.error('Failed to store deleted student ID', err);
  }
}

/**
 * Unmarks a student ID as deleted (if restored or newly re-enrolled).
 */
export function unmarkStudentDeleted(studentId: string): void {
  const deletedSet = getDeletedStudentIds();
  if (deletedSet.has(studentId)) {
    deletedSet.delete(studentId);
    try {
      localStorage.setItem(DELETED_STUDENTS_KEY, JSON.stringify(Array.from(deletedSet)));
    } catch (err) {
      console.error('Failed to remove student ID from deleted registry', err);
    }
  }
}

/**
 * Validates, filters and cleans a list of students:
 * 1. Excludes deleted students.
 * 2. Strictly enforces Class 10 sections (10-A to 10-E).
 * 3. Removes any obsolete classes (6, 7, 8, 9, 11, 12).
 * 4. Ensures consistent roll numbers section-wise.
 */
export function cleanAndFilterClass10Students(rawStudents: Student[]): Student[] {
  const deletedIds = getDeletedStudentIds();

  const filtered = rawStudents.filter((s) => {
    if (!s || !s.id || !s.name) return false;
    if (deletedIds.has(s.id)) return false;

    const norm = normalizeClass10Section(s.className || s.class, s.section);
    return norm !== null;
  });

  // Verify if raw data has realistic attendance distribution or if previous cache was 100% all-present
  const hasRealisticVariety = filtered.some(s => s.todayStatus === 'absent' || s.todayStatus === 'late');

  return filtered.map((s) => {
    const norm = normalizeClass10Section(s.className || s.class, s.section)!;
    const realStudent = REAL_CLASS_10_STUDENTS.find(
      rs => rs.id === s.id || (rs.name.trim().toLowerCase() === s.name.trim().toLowerCase() && rs.section === norm.section)
    );

    // If cache was 100% all-present without absentees, restore the authoritative realistic distribution from real student roster
    const resolvedTodayStatus = (!hasRealisticVariety && realStudent?.todayStatus)
      ? realStudent.todayStatus
      : (s.todayStatus || realStudent?.todayStatus || 'present');

    return {
      ...s,
      className: norm.className,
      class: '10',
      section: norm.section,
      guardianName: s.guardianName || s.fatherName || realStudent?.guardianName || 'Not Available',
      guardianPhone: s.guardianPhone || s.parentContact || realStudent?.guardianPhone || 'Not Available',
      parentContact: s.parentContact || s.guardianPhone || realStudent?.parentContact || 'Not Available',
      status: s.status || realStudent?.status || 'Active',
      isNewAdmission: s.isNewAdmission !== undefined ? s.isNewAdmission : (realStudent?.isNewAdmission || false),
      todayStatus: resolvedTodayStatus,
      attendancePercentage: Math.min(95, Number(s.attendancePercentage ?? realStudent?.attendancePercentage) || 92),
      feeStatus: s.feeStatus || realStudent?.feeStatus || 'Paid',
      smartAlerts: (s.smartAlerts && s.smartAlerts.length > 0) ? s.smartAlerts : (realStudent?.smartAlerts || []),
      leaves: (s.leaves && s.leaves.length > 0) ? s.leaves : (realStudent?.leaves || []),
      feeDetails: s.feeDetails || realStudent?.feeDetails,
      libraryDetails: s.libraryDetails || realStudent?.libraryDetails,
      rollNo: Number(s.rollNo ?? s.rollNumber ?? realStudent?.rollNo) || 1,
      rollNumber: Number(s.rollNumber ?? s.rollNo ?? realStudent?.rollNo) || 1,
    };
  });
}

/**
 * Returns saved students from local storage immediately.
 * Restricted strictly to Class 10 (10-A, 10-B, 10-C, 10-D, 10-E).
 * Permanently respects student deletions.
 */
export function getPersistentStudents(): Student[] {
  const isInitialized = localStorage.getItem(STUDENTS_INITIALIZED_KEY) === 'true';

  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = cleanAndFilterClass10Students(parsed);
        // If initialized and cleaned is empty (all deleted), do NOT re-seed fake students!
        if (isInitialized) {
          return cleaned;
        }
        if (cleaned.length > 0) {
          localStorage.setItem(STUDENTS_INITIALIZED_KEY, 'true');
          return cleaned;
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse persistent students from storage', err);
  }

  // If already initialized before and raw was empty/deleted, return empty array (PART 13: NO FAKE FALLBACK)
  if (isInitialized) {
    return [];
  }

  // First-run initialization with the authoritative real 219 Class 10 students from official PDF
  const initialClean = cleanAndFilterClass10Students(REAL_CLASS_10_STUDENTS);
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(initialClean));
    localStorage.setItem(STUDENTS_INITIALIZED_KEY, 'true');
  } catch (err) {
    console.error('Failed to seed real Class 10 students to localStorage', err);
  }

  return initialClean;
}

/**
 * Saves students to localStorage and persists cleanly.
 */
export function savePersistentStudentsLocally(students: Student[]): void {
  try {
    const cleaned = cleanAndFilterClass10Students(students);
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(cleaned));
    localStorage.setItem(STUDENTS_INITIALIZED_KEY, 'true');
  } catch (err) {
    console.error('Failed to save students to localStorage', err);
  }
}

/**
 * Reassigns roll numbers section-wise alphabetically.
 * Section A: A->Z = 1..N
 * Section B: A->Z = 1..N
 * Section C: A->Z = 1..N
 * Section D: A->Z = 1..N
 * Section E: A->Z = 1..N
 */
export function reassignSectionRollNumbers(students: Student[]): Student[] {
  const sections = ['A', 'B', 'C', 'D', 'E'] as const;
  const updated: Student[] = [];

  sections.forEach((sec) => {
    const secStudents = students.filter((s) => (s.section || '').toUpperCase() === sec);
    secStudents.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));
    secStudents.forEach((student, index) => {
      const roll = index + 1;
      const paddedRoll = roll < 10 ? `0${roll}` : `${roll}`;
      updated.push({
        ...student,
        rollNo: roll,
        rollNumber: roll,
        id: `STU-10${sec}-${paddedRoll}`,
        className: `10-${sec}`,
        class: '10',
        section: sec,
      });
    });
  });

  savePersistentStudentsLocally(updated);
  return updated;
}

/**
 * One-time validated import function for the 219 Class 10 PDF students.
 */
export function importClass10PdfStudents(): { imported: number; total: number } {
  // Clear any past deleted tracking for initial fresh PDF import
  try {
    localStorage.removeItem(DELETED_STUDENTS_KEY);
  } catch (e) {}

  const initialClean = cleanAndFilterClass10Students(REAL_CLASS_10_STUDENTS);
  savePersistentStudentsLocally(initialClean);
  return {
    imported: initialClean.length,
    total: initialClean.length,
  };
}

/**
 * Add a new real student permanently to persistent storage & Firestore.
 */
export async function addPersistentStudent(student: Student): Promise<void> {
  // Unmark if previously deleted
  unmarkStudentDeleted(student.id);

  const current = getPersistentStudents();
  const filtered = current.filter((s) => s.id !== student.id);
  const updated = [student, ...filtered];
  savePersistentStudentsLocally(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    const sanitized = JSON.parse(JSON.stringify(student));
    await setDoc(docRef, sanitized);
  } catch (error) {
    console.warn('Could not sync student addition to Firestore; saved locally:', error);
  }
}

/**
 * Update an existing student permanently.
 */
export async function updatePersistentStudent(student: Student): Promise<void> {
  const current = getPersistentStudents();
  const updated = current.map((s) => (s.id === student.id ? student : s));
  savePersistentStudentsLocally(updated);

  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    const sanitized = JSON.parse(JSON.stringify(student));
    await setDoc(docRef, sanitized);
  } catch (error) {
    console.warn('Could not sync student update to Firestore; saved locally:', error);
  }
}

/**
 * Permanently delete a student. Stays deleted on refresh, logout/login, and re-renders.
 */
export async function deletePersistentStudent(studentId: string): Promise<void> {
  // 1. Mark permanently deleted in tombstone storage
  markStudentDeleted(studentId);

  // 2. Remove from local list
  const current = getPersistentStudents();
  const updated = current.filter((s) => s.id !== studentId);
  savePersistentStudentsLocally(updated);

  // 3. Delete from Firestore
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Could not sync student deletion to Firestore; deleted locally:', error);
  }
}

/**
 * Permanently bulk delete multiple students.
 */
export async function bulkDeletePersistentStudents(studentIds: string[]): Promise<void> {
  studentIds.forEach(id => markStudentDeleted(id));

  const idSet = new Set(studentIds);
  const current = getPersistentStudents();
  const updated = current.filter((s) => !idSet.has(s.id));
  savePersistentStudentsLocally(updated);

  try {
    await Promise.allSettled(
      studentIds.map((id) => deleteDoc(doc(db, STUDENTS_COLLECTION, id)))
    );
  } catch (error) {
    console.warn('Could not sync bulk student deletions to Firestore; deleted locally:', error);
  }
}

/**
 * Attaches real-time listener to Firestore to synchronize changes from other devices/tabs.
 * Strictly prevents resurrecting deleted students or obsolete classes.
 */
export function subscribeToPersistentStudents(
  onUpdate: (students: Student[]) => void
): () => void {
  try {
    const colRef = collection(db, STUDENTS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const deletedIds = getDeletedStudentIds();

        if (!snapshot.empty) {
          const remoteStudents: Student[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Student;
            // Purge deleted student if it arrived from remote snapshot
            if (deletedIds.has(docSnap.id) || deletedIds.has(data.id)) {
              deleteDoc(doc(db, STUDENTS_COLLECTION, docSnap.id)).catch(() => {});
              return;
            }
            // Enforce Class 10 only
            const norm = normalizeClass10Section(data.className || data.class, data.section);
            if (!norm) {
              return; // Ignore obsolete class documents
            }
            remoteStudents.push({
              ...data,
              className: norm.className,
              class: '10',
              section: norm.section
            });
          });

          // Sort by section and roll number
          remoteStudents.sort((a, b) => {
            if (a.section !== b.section) return (a.section || '').localeCompare(b.section || '');
            return (a.rollNo || 0) - (b.rollNo || 0);
          });

          // Save and update
          savePersistentStudentsLocally(remoteStudents);
          onUpdate(remoteStudents);
        } else {
          // If Firestore is empty, check local state
          const local = getPersistentStudents();
          if (local.length > 0) {
            // First time sync local to Firestore
            local.forEach((s) => {
              const sanitized = JSON.parse(JSON.stringify(s));
              setDoc(doc(db, STUDENTS_COLLECTION, s.id), sanitized).catch(() => {});
            });
            onUpdate(local);
          } else {
            onUpdate([]);
          }
        }
      },
      (error) => {
        console.warn('Firestore onSnapshot notice; using local persistent store:', error.message);
        onUpdate(getPersistentStudents());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to Firestore students:', err);
    return () => {};
  }
}
