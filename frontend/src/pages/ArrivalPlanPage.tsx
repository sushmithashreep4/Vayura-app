import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink,
  Zap, Calendar, AlertCircle, Sparkles, CreditCard, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getCountryVisual } from '@/data/countryVisuals';
import { PHASE_LABELS, PHASE_ICONS, PRIORITY_CONFIG } from '@/data/arrivalTasks';
import { PayPalServiceCheckoutModal } from '@/components/payments/PayPalServiceCheckoutModal';
import type { ArrivalTask, TaskPhase, TaskPriority, LocalApp } from '@/types';
import toast from 'react-hot-toast';

const PHASE_ORDER: TaskPhase[] = ['BEFORE_DEPARTURE', 'ARRIVAL_DAY', 'FIRST_WEEK', 'FIRST_MONTH'];

export function ArrivalPlanPage() {
  const { arrivalPlan, travelProfile, countryData, selectedDestinationCode, destinationApps, completeTask, updateTask } = useAppStore();
  const [expandedPhases, setExpandedPhases] = useState<Set<TaskPhase>>(
    new Set(['BEFORE_DEPARTURE', 'ARRIVAL_DAY', 'FIRST_WEEK'])
  );
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [checkoutApp, setCheckoutApp] = useState<LocalApp | null>(null);

  const currentCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCode);

  if (!arrivalPlan) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>No arrival plan found. Complete your travel profile to generate your plan.</p>
      </div>
    );
  }

  const togglePhase = (phase: TaskPhase) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  const tasks = arrivalPlan.tasks ?? [];
  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter((t) => t.status === 'COMPLETED').length;
  const criticalPending = tasks.filter((t) => t.priority === 'CRITICAL' && t.status === 'PENDING').length;
  const highPending = tasks.filter((t) => t.priority === 'HIGH' && t.status === 'PENDING').length;

  const handleToggleTask = (task: ArrivalTask) => {
    if (task.status === 'COMPLETED') {
      updateTask(task.id, { status: 'PENDING', completedAt: undefined });
      toast('Task marked as pending', { icon: '↩️' });
    } else {
      completeTask(task.id);
      toast.success(`Completed: ${task.title}`, { icon: '🎯' });
    }
  };

  const handleTaskAction = (task: ArrivalTask) => {
    // If task has related service or matches an essential app that supports PayPal
    const matchedApp = destinationApps.find(
      (a) =>
        a.integrationAvailable &&
        (task.title.toLowerCase().includes(a.name.toLowerCase().slice(0, 4)) ||
         (a.tags && a.tags.some((tag) => task.title.toLowerCase().includes(tag))))
    );

    if (matchedApp) {
      setCheckoutApp(matchedApp);
    } else {
      toast('Navigating to related service details...', { icon: '🔍' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              VAYURA Arrival Autopilot
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
              {visual.flag} {visual.countryName}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            Personalised International Arrival Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Step-by-step pre-departure and post-arrival execution checklist. Synchronized with your {visual.countryName} everyday apps and verified government requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING', 'COMPLETED'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === mode
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ── Readiness Score Card ── */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-slate-900 border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {arrivalPlan.readinessScore}%
          </div>
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mt-1">
            Arrival Readiness Score
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 text-center">
            Weighted algorithm based on verified arrival criteria
          </div>
        </div>

        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">
              {arrivalPlan.readinessScore < 40
                ? 'Phase 1: Pre-Departure Fundamentals'
                : arrivalPlan.readinessScore < 80
                ? 'Phase 2: Transition & Booking in Progress'
                : 'Phase 3: Arrival Ready'}
            </h3>
            <span className="text-xs text-blue-400 font-mono">
              {totalCompleted} / {totalTasks} Tasks
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {arrivalPlan.readinessSummary}
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
              <div className="text-lg font-bold text-emerald-400">{totalCompleted}</div>
              <div className="text-[10px] text-slate-400 uppercase">Completed</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
              <div className="text-lg font-bold text-slate-300">{totalTasks - totalCompleted}</div>
              <div className="text-[10px] text-slate-400 uppercase">Remaining</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-center">
              <div className="text-lg font-bold text-rose-400">{criticalPending}</div>
              <div className="text-[10px] text-slate-400 uppercase">Urgent Action</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Next-Step Intelligence ── */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-slate-300">
            <strong>AI Recommendation:</strong> Prioritize securing your local eSIM and airport express train before boarding your flight to {visual.countryName}.
          </span>
        </div>
        <button
          onClick={() => {
            const esimApp = destinationApps.find((a) => a.category === 'MOBILE_CONNECTIVITY' && a.integrationAvailable);
            if (esimApp) setCheckoutApp(esimApp);
            else toast('Check Global Essentials for connectivity passes.', { icon: 'ℹ️' });
          }}
          className="flex-shrink-0 text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
        >
          <span>Order via PayPal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Phase-Organized Checklists ── */}
      <div className="space-y-6">
        {PHASE_ORDER.map((phase) => {
          const phaseTasks = tasks.filter((t) => t.phase === phase);
          const filtered = phaseTasks.filter((t) => {
            if (filter === 'PENDING') return t.status === 'PENDING';
            if (filter === 'COMPLETED') return t.status === 'COMPLETED';
            return true;
          });

          if (filtered.length === 0 && filter !== 'ALL') return null;

          const isExpanded = expandedPhases.has(phase);
          const phaseCompleted = phaseTasks.filter((t) => t.status === 'COMPLETED').length;

          return (
            <div
              key={phase}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg"
            >
              {/* Phase Header Accordion */}
              <button
                onClick={() => togglePhase(phase)}
                className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-900 hover:bg-slate-850 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{PHASE_ICONS[phase]}</span>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {PHASE_LABELS[phase]}
                    </h3>
                    <div className="text-xs text-slate-400">
                      {phaseCompleted} of {phaseTasks.length} tasks completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: phaseTasks.length > 0 ? `${(phaseCompleted / phaseTasks.length) * 100}%` : '0%',
                      }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Task Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 sm:p-5 pt-0 divide-y divide-slate-800/60"
                  >
                    {filtered.map((task) => {
                      const isDone = task.status === 'COMPLETED';
                      const pConfig = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.MEDIUM;

                      // Check if there is an instant PayPal action for this task
                      const hasPayPalService = destinationApps.some(
                        (a) =>
                          a.integrationAvailable &&
                          (task.title.toLowerCase().includes(a.name.toLowerCase().slice(0, 4)) ||
                           (a.tags && a.tags.some((tag) => task.title.toLowerCase().includes(tag))))
                      );

                      return (
                        <div
                          key={task.id}
                          className="py-3.5 flex items-start justify-between gap-4 group"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Checkbox */}
                            <button
                              onClick={() => handleToggleTask(task)}
                              className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition flex-shrink-0 ${
                                isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'border border-slate-700 hover:border-blue-400 bg-slate-950'
                              }`}
                              aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              {isDone && <CheckCircle2 className="w-4 h-4" />}
                            </button>

                            <div className="min-w-0">
                              <div
                                onClick={() => handleToggleTask(task)}
                                className={`text-sm font-semibold cursor-pointer ${
                                  isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-blue-300'
                                }`}
                              >
                                {task.title}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                {task.description}
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pConfig.bg} ${pConfig.color}`}>
                                  {task.priority}
                                </span>
                                {task.dueDate && (
                                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                                    <Calendar className="w-3 h-3" />
                                    <span>{task.dueDate}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Action Button */}
                          {hasPayPalService && !isDone && (
                            <button
                              onClick={() => handleTaskAction(task)}
                              className="flex-shrink-0 py-1.5 px-3 rounded-lg bg-[#0070ba] hover:bg-[#005ea6] text-white text-[11px] font-bold flex items-center gap-1 transition shadow"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Pay with PayPal</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── PayPal Service Checkout Modal ── */}
      <PayPalServiceCheckoutModal
        app={checkoutApp}
        isOpen={!!checkoutApp}
        onClose={() => setCheckoutApp(null)}
      />
    </div>
  );
}
