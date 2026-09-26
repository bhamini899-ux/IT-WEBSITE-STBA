import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Filter, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Teacher, TeacherTask, TeacherDepartment } from '../../types';
import { TEACHER_DEPARTMENTS } from '../../data/teacherData';

interface TeacherWorkloadTasksProps {
  teachers: Teacher[];
  tasks: TeacherTask[];
  onToggleTaskStatus: (taskId: string) => void;
  onAddTask: (newTask: Omit<TeacherTask, 'id'>) => void;
  onSelectTeacher?: (teacher: Teacher) => void;
}

export const TeacherWorkloadTasks: React.FC<TeacherWorkloadTasksProps> = ({
  teachers,
  tasks,
  onToggleTaskStatus,
  onAddTask,
  onSelectTeacher,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTeacherId, setTaskTeacherId] = useState(teachers[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskCategory, setTaskCategory] = useState<TeacherTask['category']>('Marks Submission');
  const [taskDeadline, setTaskDeadline] = useState('2026-09-22');

  // Compute departmental average workloads
  const deptWorkloads = TEACHER_DEPARTMENTS.map(dept => {
    const deptTeachers = teachers.filter(t => t.department === dept);
    const totalPeriods = deptTeachers.reduce((sum, t) => sum + t.workloadWeekly, 0);
    const avg = deptTeachers.length > 0 ? (totalPeriods / deptTeachers.length).toFixed(1) : '0';
    return {
      department: dept,
      count: deptTeachers.length,
      avgPeriods: Number(avg)
    };
  });

  const highLoadTeachers = teachers.filter(t => t.workloadWeekly >= 26);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesDept = selectedDeptFilter === 'All' || t.department === selectedDeptFilter;
    const matchesPri = selectedPriorityFilter === 'All' || t.priority === selectedPriorityFilter;
    return matchesDept && matchesPri;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const teacherObj = teachers.find(t => t.id === taskTeacherId) || teachers[0];
    if (!teacherObj) return;

    onAddTask({
      teacherId: teacherObj.id,
      teacherName: teacherObj.name,
      department: teacherObj.department,
      title: taskTitle.trim(),
      priority: taskPriority,
      category: taskCategory,
      deadline: taskDeadline,
      status: 'Pending'
    });

    setTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-6">
      {/* Workload Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Workload Bar Chart Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Departmental Teaching Workload Distribution
              </h3>
              <p className="text-xs text-slate-500">Average periods assigned per faculty member / week</p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Target: 22 - 25 Periods
            </span>
          </div>

          <div className="space-y-3">
            {deptWorkloads.map(d => (
              <div key={d.department} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.department}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    {d.avgPeriods} periods/wk <span className="text-[10px] text-slate-400">({d.count} faculty)</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      d.avgPeriods >= 26 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, (d.avgPeriods / 30) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Workload Alerts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Workload Stamina Alerts
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {highLoadTeachers.length} Flagged
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Faculty members near or at max capacity (≥26 periods/week).
            </p>

            <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {highLoadTeachers.slice(0, 5).map(t => (
                <div 
                  key={t.id}
                  onClick={() => onSelectTeacher && onSelectTeacher(t)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.department}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                    {t.workloadWeekly} periods
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-900 dark:text-blue-200">
            💡 <strong>AI Workload Balancing:</strong> Emergency substitution engine automatically shifts substitute requests away from these faculty.
          </div>
        </div>
      </div>

      {/* Task Management Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              Faculty Academic Tasks & Deadlines ({tasks.length})
            </h3>
            <p className="text-xs text-slate-500">Track CBSE submissions, marks uploading, question papers & invigilation</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Departments</option>
              {TEACHER_DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <button
              onClick={() => setIsAddingTask(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign New Task</span>
            </button>
          </div>
        </div>

        {/* Add Task Modal / Drawer */}
        {isAddingTask && (
          <form onSubmit={handleCreateTask} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Assign Faculty Task</h4>
              <button 
                type="button" 
                onClick={() => setIsAddingTask(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CBSE Term 1 Question Paper"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Assign To Teacher</label>
                <select
                  value={taskTeacherId}
                  onChange={(e) => setTaskTeacherId(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                >
                  {teachers.length === 0 ? (
                    <option value="">No faculty added yet</option>
                  ) : (
                    teachers.slice(0, 30).map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Category & Priority</label>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="Marks Submission">Marks Submission</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Homework Verification">Homework Verification</option>
                    <option value="Department Meeting">Department Meeting</option>
                    <option value="CBSE Portal">CBSE Portal</option>
                    <option value="Lesson Plan">Lesson Plan</option>
                  </select>

                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Deadline</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shrink-0"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Task List Table */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTasks.map(task => (
            <div key={task.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleTaskStatus(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    task.status === 'Completed'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                  }`}
                >
                  {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div>
                  <p className={`text-xs font-bold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned to: <strong className="text-slate-700 dark:text-slate-300">{task.teacherName}</strong> • {task.department} • Category: {task.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  task.priority === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                  task.priority === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {task.priority}
                </span>

                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {task.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
