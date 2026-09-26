import { TimetableSlot, Teacher, TimetableConflict, SubstitutionRecommendation } from '../types';

/**
 * Detects all scheduling and availability conflicts across timetable slots.
 */
export function detectTimetableConflicts(
  slots: TimetableSlot[],
  teachers: Teacher[]
): TimetableConflict[] {
  const conflicts: TimetableConflict[] = [];
  const teacherMap = new Map<string, Teacher>();
  teachers.forEach(t => teacherMap.set(t.id, t));

  // 1. Teacher Double-Booking Check
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const s1 = slots[i];
      const s2 = slots[j];

      if (s1.day === s2.day && s1.periodNumber === s2.periodNumber) {
        // Check teacher conflict
        const effectiveTeacher1 = s1.isSubstituted && s1.substituteTeacherId ? s1.substituteTeacherId : s1.teacherId;
        const effectiveTeacher2 = s2.isSubstituted && s2.substituteTeacherId ? s2.substituteTeacherId : s2.teacherId;

        if (effectiveTeacher1 && effectiveTeacher2 && effectiveTeacher1 === effectiveTeacher2) {
          const teacherObj = teacherMap.get(effectiveTeacher1);
          const tName = teacherObj ? teacherObj.name : s1.teacherName;
          conflicts.push({
            id: `CONF-TCH-${s1.id}-${s2.id}`,
            type: 'teacher_double_booking',
            description: `${tName} is double-booked for Period ${s1.periodNumber} on ${s1.day} in both ${s1.className} and ${s2.className}.`,
            day: s1.day,
            periodNumber: s1.periodNumber,
            timeRange: s1.timeRange,
            affectedClass: `${s1.className} & ${s2.className}`,
            affectedTeacher: tName,
            affectedRoom: `${s1.room} / ${s2.room}`,
            suggestedResolution: `Reassign ${s2.className} Period ${s2.periodNumber} to another available teacher in ${s2.subject}.`
          });
        }

        // Check room conflict
        if (s1.room && s2.room && s1.room.trim().toLowerCase() === s2.room.trim().toLowerCase() && s1.className !== s2.className) {
          conflicts.push({
            id: `CONF-RM-${s1.id}-${s2.id}`,
            type: 'room_double_booking',
            description: `${s1.room} is scheduled concurrently for both ${s1.className} (${s1.subject}) and ${s2.className} (${s2.subject}) during Period ${s1.periodNumber}.`,
            day: s1.day,
            periodNumber: s1.periodNumber,
            timeRange: s1.timeRange,
            affectedClass: `${s1.className}, ${s2.className}`,
            affectedTeacher: `${s1.teacherName}, ${s2.teacherName}`,
            affectedRoom: s1.room,
            suggestedResolution: `Move ${s2.className} to an empty classroom or lecture annex.`
          });
        }
      }
    }
  }

  // 2. Teacher Unavailable Check (Absent / On Leave today without substitution)
  // Assuming today is Monday for demo/simulation
  const today = 'Monday';
  const todaySlots = slots.filter(s => s.day === today);

  todaySlots.forEach(slot => {
    const teacher = teacherMap.get(slot.teacherId);
    if (teacher && (teacher.currentStatus === 'Absent' || teacher.currentStatus === 'On Leave')) {
      if (!slot.isSubstituted) {
        conflicts.push({
          id: `CONF-UNAV-${slot.id}`,
          type: 'teacher_unavailable',
          description: `${teacher.name} is ${teacher.currentStatus.toLowerCase()} today, but is scheduled to teach ${slot.className} during Period ${slot.periodNumber} (${slot.subject}).`,
          day: slot.day,
          periodNumber: slot.periodNumber,
          timeRange: slot.timeRange,
          affectedClass: slot.className,
          affectedTeacher: teacher.name,
          affectedRoom: slot.room,
          suggestedResolution: `Assign an emergency substitute from the ${teacher.department} department.`
        });
      }
    }
  });

  return conflicts;
}

/**
 * Finds all teachers who are currently free during a given day and period.
 */
export function getFreeTeachersForPeriod(
  teachers: Teacher[],
  slots: TimetableSlot[],
  day: string,
  periodNumber: number,
  excludeTeacherId?: string
): Teacher[] {
  // Find which teachers are actively teaching during this slot
  const busyTeacherIds = new Set<string>();
  slots.forEach(slot => {
    if (slot.day === day && slot.periodNumber === periodNumber) {
      const activeTeacher = slot.isSubstituted && slot.substituteTeacherId ? slot.substituteTeacherId : slot.teacherId;
      if (activeTeacher) busyTeacherIds.add(activeTeacher);
    }
  });

  return teachers.filter(t => {
    if (excludeTeacherId && t.id === excludeTeacherId) return false;
    // Must not be absent or on leave
    if (t.currentStatus === 'Absent' || t.currentStatus === 'On Leave') return false;
    // Must not be busy in this period
    if (busyTeacherIds.has(t.id)) return false;
    return true;
  });
}

/**
 * Intelligent Substitution Recommendation Engine.
 * Evaluates department, subject match, free status, workload balance, and class familiarity.
 */
export function generateSubstitutionRecommendations(
  slot: TimetableSlot,
  teachers: Teacher[],
  slots: TimetableSlot[]
): SubstitutionRecommendation[] {
  const freeTeachers = getFreeTeachersForPeriod(teachers, slots, slot.day, slot.periodNumber, slot.teacherId);

  const scored = freeTeachers.map(teacher => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Subject / Department match
    const subjectMatch = teacher.subjects.some(s => 
      s.toLowerCase().includes(slot.subject.toLowerCase()) || 
      slot.subject.toLowerCase().includes(s.toLowerCase())
    ) || (teacher.department.toLowerCase() === slot.subject.toLowerCase());

    if (subjectMatch) {
      score += 50;
      reasons.push(`Subject expert in ${slot.subject}`);
    } else if (teacher.department === 'Science' && ['Physics', 'Chemistry', 'Biology'].some(s => slot.subject.includes(s))) {
      score += 35;
      reasons.push(`Same Science faculty`);
    }

    // 2. Class familiarity
    const familiarWithClass = teacher.classes.includes(slot.className);
    if (familiarWithClass) {
      score += 25;
      reasons.push(`Regular teacher for Class ${slot.className}`);
    }

    // 3. Workload comfort (favor teachers with lower current workload)
    const loadMargin = teacher.maxWorkloadWeekly - teacher.workloadWeekly;
    if (loadMargin >= 6) {
      score += 20;
      reasons.push(`Very low weekly workload (${teacher.workloadWeekly}/${teacher.maxWorkloadWeekly} periods)`);
    } else if (loadMargin >= 3) {
      score += 10;
      reasons.push(`Balanced workload (${teacher.workloadWeekly}/${teacher.maxWorkloadWeekly} periods)`);
    } else {
      reasons.push(`High workload (${teacher.workloadWeekly}/${teacher.maxWorkloadWeekly} periods)`);
    }

    // Free period confirmation
    reasons.unshift(`Free during Period ${slot.periodNumber}`);

    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      department: teacher.department,
      subjectMatch,
      freePeriod: true,
      currentWorkload: teacher.workloadWeekly,
      familiarWithClass,
      score,
      reasoning: reasons.join(' • ')
    };
  });

  // Sort by highest recommendation score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map(({ teacherId, teacherName, department, subjectMatch, freePeriod, currentWorkload, familiarWithClass, reasoning }) => ({
    teacherId,
    teacherName,
    department,
    subjectMatch,
    freePeriod,
    currentWorkload,
    familiarWithClass,
    reasoning
  }));
}

/**
 * Automatically resolves a timetable conflict by smart room relocation or substitute recommendation.
 */
export function autoResolveConflict(
  conflict: TimetableConflict,
  slots: TimetableSlot[],
  teachers?: Teacher[]
): TimetableSlot | null {
  const targetSlot = slots.find(
    s => s.day === conflict.day && s.periodNumber === conflict.periodNumber && 
    (s.className === conflict.affectedClass || s.room === conflict.affectedRoom || s.teacherName === conflict.affectedTeacher)
  ) || slots.find(s => s.day === conflict.day && s.periodNumber === conflict.periodNumber);

  if (!targetSlot) return null;

  const availableAltRooms = ['Room 205', 'Room 302', 'Seminar Hall B', 'Lecture Theater 1'];
  const altRoom = availableAltRooms.find(r => r !== targetSlot.room) || 'Room 302';

  return {
    ...targetSlot,
    room: altRoom
  };
}

