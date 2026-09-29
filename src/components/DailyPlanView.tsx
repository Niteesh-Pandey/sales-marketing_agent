import React, { useState } from 'react';
import {
  CalendarCheck,
  Zap,
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Task, Lead, DayPlanSlot } from '../types';

interface DailyPlanViewProps {
  tasks: Task[];
  leads: Lead[];
  onToggleTaskStatus: (taskId: string, currentStatus: string) => void;
  onCreateTask: (task: Partial<Task>) => void;
  onNavigateToSales: (leadId: string) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  tasks,
  leads,
  onToggleTaskStatus,
  onCreateTask,
  onNavigateToSales
}) => {
  const [dayPlan, setDayPlan] = useState<DayPlanSlot[] | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // New task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [taskType, setTaskType] = useState<'CALL' | 'EMAIL' | 'MEETING' | 'PROPOSAL' | 'REVIEW' | 'MARKETING'>('CALL');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().slice(0, 10));

  const priorityLeadsToday = leads
    .filter((l) => l.status === 'HOT' || l.lead_score >= 80)
    .slice(0, 5);

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    try {
      const res = await fetch('/api/gemini/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setDayPlan(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleCreateTaskSubmit = () => {
    if (!taskTitle.trim()) return;
    onCreateTask({
      title: taskTitle,
      description: taskDesc,
      priority: taskPriority,
      type: taskType,
      due_date: taskDueDate,
      status: 'TODO'
    });
    setTaskTitle('');
    setTaskDesc('');
    setShowTaskModal(false);
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'DONE');
  const completedTasks = tasks.filter((t) => t.status === 'DONE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-400" />
            Today&apos;s Command Center &amp; AI Day Plan
          </h2>
          <p className="text-xs text-slate-400">
            Synthesize priority leads, meetings, pending tasks &amp; pipeline urgency into an evidence-backed day schedule
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New Task</span>
          </button>
          <button
            onClick={handleGeneratePlan}
            disabled={generatingPlan}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{generatingPlan ? 'Generating Schedule...' : 'Create My Day Plan'}</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards for Today */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority Leads Due Today</span>
            <div className="text-2xl font-black text-rose-400 mt-1">{priorityLeadsToday.length}</div>
            <span className="text-[11px] text-slate-400">Score &ge; 80 / Hot Intent</span>
          </div>
          <Flame className="w-8 h-8 text-rose-500/40" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Action Items</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{pendingTasks.length}</div>
            <span className="text-[11px] text-slate-400">{completedTasks.length} tasks completed</span>
          </div>
          <Clock className="w-8 h-8 text-amber-500/40" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Negotiation Deals</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ₹{(leads.filter(l => l.stage === 'NEGOTIATION').reduce((acc, l) => acc + l.budget, 0) / 10000000).toFixed(2)} Cr
            </div>
            <span className="text-[11px] text-slate-400">Closing decisions this week</span>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500/40" />
        </div>
      </div>

      {/* AI Chronological Day Plan (Morning / Midday / Afternoon / EOD) */}
      {dayPlan && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/30 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-extrabold text-white">
                Optimized Day Plan — {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
            </div>
            <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
              Evidence Grounded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dayPlan.map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300 pb-2 border-b border-slate-800">
                    <span className="uppercase tracking-wider">{slot.timeSlot}</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>

                  <div className="space-y-3 mt-3">
                    {slot.tasks.map((t, i) => (
                      <div key={i} className="space-y-1.5 text-xs">
                        <div className="flex items-start justify-between gap-1.5">
                          <strong className="text-white font-bold leading-snug">{t.task}</strong>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                              t.priority === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{t.reason}</p>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800/60 text-[10px] space-y-0.5 text-slate-400">
                          <div>
                            <strong className="text-emerald-400">Impact:</strong> {t.expectedImpact}
                          </div>
                          <div>
                            <strong className="text-indigo-400">Effort:</strong> {t.estimatedEffort}
                          </div>
                          <div>
                            <strong className="text-slate-300">Evidence:</strong> {t.evidence}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Columns: Priority Queue & Task Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Lead Queue (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Priority Call Queue Today
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">{priorityLeadsToday.length} Hot Leads</span>
          </div>

          <div className="space-y-2.5">
            {priorityLeadsToday.map((lead) => (
              <div
                key={lead.lead_id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{lead.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                      {lead.lead_score}/100
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lead.product_interest} &bull; ₹{(lead.budget / 10000000).toFixed(2)}Cr
                  </div>
                  <div className="text-[10px] text-indigo-400 font-medium">
                    Action: {lead.recommended_next_action || 'CALL'}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToSales(lead.lead_id)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shrink-0 cursor-pointer shadow-sm"
                >
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management List (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Action Items &amp; Task Pipeline
            </h3>
            <span className="text-[11px] text-slate-400">
              {pendingTasks.length} pending &bull; {completedTasks.length} completed
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {tasks.map((task) => {
              const isDone = task.status === 'DONE';
              return (
                <div
                  key={task.task_id}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 text-xs ${
                    isDone
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => onToggleTaskStatus(task.task_id, task.status)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className={`font-semibold text-slate-200 ${isDone ? 'line-through text-slate-500' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 leading-snug">{task.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                        <span className="font-medium text-slate-400">{task.type}</span>
                        <span>&bull;</span>
                        <span>Due: {task.due_date}</span>
                        {task.related_lead_name && (
                          <>
                            <span>&bull;</span>
                            <span className="text-indigo-400">{task.related_lead_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      task.priority === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : task.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create New Task</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Confirm tandem parking with Worli project manager"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                rows={3}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Details, evidence needed, or milestone references..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTaskSubmit}
                disabled={!taskTitle.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
