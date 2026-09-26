import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  User, 
  GraduationCap, 
  Bus, 
  BookOpen, 
  DoorOpen, 
  Calendar, 
  ArrowRight,
  FileText,
  Megaphone,
  Layers,
  Sparkles
} from 'lucide-react';
import { AppSection, Student, Teacher, ClassAttendanceSummary } from '../../types';
import { getSchoolExams, getSchoolHomework, getSchoolNotifications, getSchoolCalendarEvents } from '../../services/schoolDataHub';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: AppSection) => void;
  students?: Student[];
  teachers?: Teacher[];
  classes?: ClassAttendanceSummary[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  students = [],
  teachers = [],
  classes = []
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const searchableItems = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'Student' | 'Teacher' | 'Class' | 'Bus' | 'Book' | 'Exam' | 'Homework' | 'Announcement' | 'Event';
      title: string;
      subtitle: string;
      section: AppSection;
      badge?: string;
    }> = [];

    // 1. Live Students
    students.forEach(s => {
      items.push({
        id: `stu-${s.id}`,
        type: 'Student',
        title: s.name,
        subtitle: `Class ${s.className}${s.section ? '-' + s.section : ''} • Roll #${s.rollNo || '-'} • Attendance ${s.attendancePercentage}%`,
        section: 'attendance',
        badge: s.id
      });
    });

    // 2. Live Teachers
    teachers.forEach(t => {
      items.push({
        id: `tea-${t.id}`,
        type: 'Teacher',
        title: t.name,
        subtitle: `${t.department} • Subject: ${t.subjects.join(', ')} • Classes: ${t.classes.join(', ')}`,
        section: 'teachers',
        badge: t.employeeId
      });
    });

    // 3. Classes & Sections
    classes.forEach(c => {
      items.push({
        id: `cls-${c.className}`,
        type: 'Class',
        title: `Class ${c.className}`,
        subtitle: `${c.total} Students • Present Today: ${c.present} • Attendance: ${c.attendanceRate}%`,
        section: 'attendance',
        badge: 'Class Section'
      });
    });

    // 4. Exams
    try {
      const exams = getSchoolExams();
      exams.forEach(e => {
        items.push({
          id: `ex-${e.id}`,
          type: 'Exam',
          title: `${e.examName} (${e.subject})`,
          subtitle: `Class ${e.className}-${e.section} • Date: ${e.examDate} • Max Marks: ${e.maxMarks}`,
          section: 'academics',
          badge: e.status
        });
      });
    } catch (e) {}

    // 5. Homework
    try {
      const homeworks = getSchoolHomework();
      homeworks.forEach(h => {
        items.push({
          id: `hw-${h.id}`,
          type: 'Homework',
          title: `${h.title} (${h.subject})`,
          subtitle: `Class ${h.className}-${h.section} • Due: ${h.dueDate} • By ${h.teacherName}`,
          section: 'academics',
          badge: 'Homework'
        });
      });
    } catch (e) {}

    // 6. Announcements
    try {
      const notifs = getSchoolNotifications();
      notifs.forEach(n => {
        items.push({
          id: `notif-${n.id}`,
          type: 'Announcement',
          title: n.title,
          subtitle: `Audience: ${n.audience} • Priority: ${n.priority} • ${n.createdAt.slice(0, 10)}`,
          section: 'announcements',
          badge: n.priority
        });
      });
    } catch (e) {}

    // 7. Calendar Events
    try {
      const events = getSchoolCalendarEvents();
      events.forEach(ev => {
        items.push({
          id: `ev-${ev.id}`,
          type: 'Event',
          title: ev.title,
          subtitle: `${ev.category} • Date: ${ev.date} ${ev.time ? '• ' + ev.time : ''}`,
          section: 'calendar',
          badge: ev.category
        });
      });
    } catch (e) {}

    // 8. Buses
    const buses = [
      { num: 'Bus 01', route: 'Route 1: Vyas Colony & Station', status: 'En Route', count: 42 },
      { num: 'Bus 02', route: 'Route 2: Green Park & Sector 14', status: 'At School', count: 38 },
      { num: 'Bus 04', route: 'Route 4: Civil Lines & Station', status: 'En Route', count: 44 },
      { num: 'Bus 06', route: 'Route 6: Airport Bypass', status: 'En Route', count: 29 },
    ];
    buses.forEach(b => {
      items.push({
        id: `bus-${b.num}`,
        type: 'Bus',
        title: `${b.num} — ${b.route}`,
        subtitle: `Occupancy: ${b.count} Students • Status: ${b.status}`,
        section: 'transport',
        badge: 'Transport'
      });
    });

    return items;
  }, [students, teachers, classes]);

  const filtered = useMemo(() => {
    let result = searchableItems;

    if (selectedCategory !== 'all') {
      result = result.filter(item => item.type.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (!query.trim()) {
      return result.slice(0, 8);
    }

    const q = query.toLowerCase();
    return result.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [searchableItems, query, selectedCategory]);

  if (!isOpen) return null;

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Student': return <User className="w-4 h-4 text-blue-500" />;
      case 'Teacher': return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case 'Class': return <Layers className="w-4 h-4 text-emerald-500" />;
      case 'Bus': return <Bus className="w-4 h-4 text-amber-500" />;
      case 'Book': return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'Exam': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'Homework': return <BookOpen className="w-4 h-4 text-cyan-500" />;
      case 'Announcement': return <Megaphone className="w-4 h-4 text-orange-500" />;
      case 'Event': 
      default:
        return <Calendar className="w-4 h-4 text-purple-500" />;
    }
  };

  const handleSelect = (section: AppSection) => {
    onNavigate(section);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, classes, exams, homework, announcements..."
            autoFocus
            className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
          {['all', 'student', 'teacher', 'class', 'exam', 'homework', 'announcement', 'event', 'bus'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Records' : cat + 's'}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-600 dark:text-slate-400">No matching school records found</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching by student name, roll number, faculty subject, or class.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.section)}
                className="p-3 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 rounded-xl transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                        {item.type}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 shrink-0 hidden sm:inline">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 pl-2">
                  <span className="text-[10px] font-bold capitalize hidden sm:inline">
                    Open {item.section}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between px-4">
          <span className="font-medium">
            Found {filtered.length} result{filtered.length !== 1 ? 's' : ''} across active school operating databases
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Press ESC to dismiss
          </span>
        </div>
      </div>
    </div>
  );
};
