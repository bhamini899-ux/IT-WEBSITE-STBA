export interface ClassTeacherAssignment {
  section: '10-A' | '10-B' | '10-C' | '10-D' | '10-E';
  teacherName: string; // e.g. 'Natik Kothari', 'Chitra Jain', 'Not Assigned', 'Bhuvnesh Sir'
  updatedAt?: string;
}

const CLASS_TEACHERS_KEY = 'stba_class10_teachers_v3';
export const CLASS_TEACHER_EVENT = 'stba_class_teachers_updated';

export const INITIAL_CLASS_TEACHERS: Record<string, string> = {
  '10-A': 'Natik Kothari',
  '10-B': 'Chitra Jain',
  '10-C': 'Krishna Sharma',
  '10-D': 'Sanwarlal Prajapat',
  '10-E': 'Bhuvnesh Sir',
};

function normalizeTeacherName(name: string): string {
  const lower = name.toLowerCase().replace(/^(mr\.|mrs\.|ms\.|dr\.)\s*/, '').trim();
  if (lower.includes('natik') || lower.includes('nethi')) return 'natik';
  if (lower.includes('chitra')) return 'chitra';
  if (lower.includes('krishna')) return 'krishna';
  if (lower.includes('sawar') || lower.includes('sanwar')) return 'sawarlal';
  if (lower.includes('bhumi') || lower.includes('bhuvnesh')) return 'bhuvnesh';
  if (lower.includes('bhupesh')) return 'bhupesh';
  if (lower.includes('jitendra')) return 'jitendra';
  if (lower.includes('seema')) return 'seema';
  return lower;
}

export function getClass10Teachers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CLASS_TEACHERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          '10-A': parsed['10-A'] || INITIAL_CLASS_TEACHERS['10-A'],
          '10-B': parsed['10-B'] || INITIAL_CLASS_TEACHERS['10-B'],
          '10-C': parsed['10-C'] || INITIAL_CLASS_TEACHERS['10-C'],
          '10-D': parsed['10-D'] || INITIAL_CLASS_TEACHERS['10-D'],
          '10-E': parsed['10-E'] || INITIAL_CLASS_TEACHERS['10-E'],
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse class teacher assignments from storage', e);
  }

  // Save initial
  try {
    localStorage.setItem(CLASS_TEACHERS_KEY, JSON.stringify(INITIAL_CLASS_TEACHERS));
  } catch (e) {
    console.error('Failed to seed class teacher assignments', e);
  }

  return { ...INITIAL_CLASS_TEACHERS };
}

export function setClass10Teacher(section: string, teacherName: string): Record<string, string> {
  const current = getClass10Teachers();
  const trimmed = teacherName.trim();
  current[section] = trimmed || 'Not Assigned';
  try {
    localStorage.setItem(CLASS_TEACHERS_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(CLASS_TEACHER_EVENT, { detail: current }));
  } catch (e) {
    console.error('Failed to persist class teacher assignment', e);
  }
  return current;
}

export function removeClass10Teacher(section: string): Record<string, string> {
  return setClass10Teacher(section, 'Not Assigned');
}

/**
 * Returns the sections a specific teacher is assigned to (either as Class Teacher or Subject Teacher).
 * Strictly restricts to Class 10 (10-A to 10-E).
 */
export function getAssignedClassesForTeacher(teacherName: string, subjectClasses: string[] = []): string[] {
  const map = getClass10Teachers();
  const assigned = new Set<string>();
  const normTeacher = normalizeTeacherName(teacherName);

  // Add any section where this teacher is the official Class Teacher
  Object.entries(map).forEach(([sec, name]) => {
    if (name && name !== 'Not Assigned') {
      const normMapped = normalizeTeacherName(name);
      if (normMapped === normTeacher || name.trim().toLowerCase() === teacherName.trim().toLowerCase()) {
        assigned.add(sec);
      }
    }
  });

  // Add any subject classes that are valid Class 10 sections
  subjectClasses.forEach((cls) => {
    const raw = String(cls).trim().toUpperCase();
    let formatted = '';
    if (raw.includes('10-')) {
      formatted = raw.match(/10-[A-E]/)?.[0] || '';
    } else if (raw.includes('10')) {
      const secLetter = raw.replace(/[^A-E]/g, '');
      if (secLetter) formatted = `10-${secLetter[0]}`;
    }
    if (['10-A', '10-B', '10-C', '10-D', '10-E'].includes(formatted)) {
      assigned.add(formatted);
    }
  });

  if (assigned.size === 0) {
    assigned.add('10-A');
  }

  return Array.from(assigned).sort();
}
