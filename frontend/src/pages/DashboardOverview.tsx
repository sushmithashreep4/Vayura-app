import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare, Wallet, Compass, MessageSquare,
  AlertTriangle, CalendarDays, TrendingUp, Clock,
  CreditCard, Sparkles, ArrowRight, ShieldCheck, RefreshCw,
  ExternalLink, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CinematicVideoBackground } from '@/components/media/CinematicVideoBackground';
import { DestinationSwitcherModal } from '@/components/destination/DestinationSwitcherModal';
import { PayPalServiceCheckoutModal } from '@/components/payments/PayPalServiceCheckoutModal';
import { getCountryVisual } from '@/data/countryVisuals';
import { formatCurrency, daysUntil, formatDate } from '@/lib/utils';
import { VERIFICATION_LABELS } from '@/data/localApps';
import type { LocalApp } from '@/types';

export function DashboardOverview() {
  const navigate = useNavigate();
  const {
    user, travelProfile, countryData, selectedDestinationCode,
    arrivalPlan, budget, payments, destinationApps, completeTask
  } = useAppStore();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [selectedCheckoutApp, setSelectedCheckoutApp] = useState<LocalApp | null>(null);

  if (!travelProfile && !countryData) return null;

  const currentCountryCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCountryCode);

  const daysLeft = travelProfile?.arrivalDate ? daysUntil(travelProfile.arrivalDate) : null;

  const pendingTasks = arrivalPlan?.tasks.filter((t) => t.status === 'PENDING') ?? [];
  const completedTasks = arrivalPlan?.tasks.filter((t) => t.status === 'COMPLETED') ?? [];
  const criticalPending = pendingTasks.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH');

  const recentPayments = payments.slice(-3).reverse();
  const featuredApps = destinationApps.filter((a) => a.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* ═══════════════════════════════════════════
          SECTION 1: CINEMATIC DESTINATION DASHBOARD HERO
      ═══════════════════════════════════════════ */}
      <CinematicVideoBackground
        countryCode={currentCountryCode}
        minHeight="min-h-[380px] lg:min-h-[420px]"
        overlayOpacity="cinematic"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col justify-end min-h-[380px] lg:min-h-[420px]">
          {/* Top Bar: Purpose & Destination Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700/80 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{travelProfile ? travelProfile.purpose.replace(/_/g, ' ') : 'Higher Education'}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-blue-950/80 backdrop-blur-md text-blue-300 border border-blue-800/80">
                {visual.localCurrencySymbol} {visual.localCurrency} · {visual.timezone}
              </span>
            </div>

            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white transition shadow-lg"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Switch Destination</span>
            </button>
          </div>

          {/* Destination Title & Welcome */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl">{visual.flag}</span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {visual.destinationTitle}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 font-medium mt-0.5">
                    {visual.countryName} · <span className="text-blue-400">{visual.nativeName}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl mt-3 leading-relaxed">
                {visual.destinationTagline}
              </p>
            </div>

            {/* Arrival Countdown Pill */}
            <div className="lg:col-span-4 flex lg:justify-end">
              {daysLeft !== null ? (
                <div className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 flex items-center gap-3 shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">
                      {daysLeft > 0 ? `${daysLeft} Days` : daysLeft === 0 ? 'Today!' : 'Arrived'}
                    </div>
                    <div className="text-xs text-slate-400">Until Scheduled Arrival</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 flex items-center gap-3 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Journey Active</div>
                    <div className="text-xs text-slate-400">Arrival Autopilot Connected</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CinematicVideoBackground>

      {/* ═══════════════════════════════════════════
          SECTION 2: CORE FINTECH & READINESS METRICS
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Readiness Score */}
          <div
            onClick={() => navigate('/dashboard/arrival-plan')}
            className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 cursor-pointer transition shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Arrival Readiness</span>
              <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                {arrivalPlan?.readinessScore ?? 0}%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {(arrivalPlan?.readinessScore ?? 0) < 40
                ? 'Getting Prepared'
                : (arrivalPlan?.readinessScore ?? 0) < 80
                ? 'Strong Progress'
                : 'Ready to Touchdown'}
            </div>
            <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${arrivalPlan?.readinessScore ?? 0}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              {completedTasks.length} of {arrivalPlan?.tasks.length ?? 0} tasks completed
            </div>
          </div>

          {/* Metric 2: Smart Budget (PayPal Synced) */}
          <div
            onClick={() => navigate('/dashboard/budget')}
            className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Remaining Budget</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                {budget ? budget.currency : 'USD'}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {budget ? formatCurrency(budget.remainingAmount, budget.currency) : '$3,500.00'}
            </div>
            <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{
                  width: budget
                    ? `${Math.max(5, (budget.remainingAmount / budget.totalAmount) * 100)}%`
                    : '100%',
                }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
              <span>Spent: {budget ? formatCurrency(budget.spentAmount, budget.currency) : '$0.00'}</span>
              <span className="text-emerald-400 font-medium">PayPal Linked 🟢</span>
            </div>
          </div>

          {/* Metric 3: Critical Journey Tasks */}
          <div
            onClick={() => navigate('/dashboard/arrival-plan')}
            className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 cursor-pointer transition shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">High-Priority Tasks</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                {criticalPending.length} Urgent
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {pendingTasks.length} Action Items
            </div>
            <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">
                {criticalPending.length > 0
                  ? criticalPending[0].title
                  : 'All urgent arrival tasks clear!'}
              </span>
            </div>
            <div className="text-[11px] text-blue-400 mt-2 font-medium">
              View complete autopilot checklist →
            </div>
          </div>

          {/* Metric 4: VAYURA Payments & PayPal Sandbox */}
          <div
            onClick={() => navigate('/dashboard/payments')}
            className="p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">VAYURA Payments</span>
              <div className="w-5 h-5 rounded-md bg-[#003087] flex items-center justify-center text-[11px] font-bold text-white">
                P
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {payments.filter((p) => p.status === 'CAPTURED').length} Confirmed
            </div>
            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
              <span>Total Processed:</span>
              <span className="font-mono text-slate-200 font-bold">
                ${payments
                  .filter((p) => p.status === 'CAPTURED')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toFixed(2)} USD
              </span>
            </div>
            <div className="text-[11px] text-blue-400 mt-2 flex items-center gap-1">
              <span>Instant checkout available</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3: DESTINATION DAILY ESSENTIALS & PAYPAL ACTIONS
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Everyday Applications & Services
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                {visual.countryName}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Your Destination. Your Everyday Essentials.
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified local services for food, transit, connectivity, and banking. Pre-book essentials directly with PayPal.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard/discovery')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition"
          >
            <span>View All Applications ({destinationApps.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Application Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredApps.map((app) => {
            const statusConfig = VERIFICATION_LABELS[app.verificationStatus] ?? VERIFICATION_LABELS.VERIFIED_COMMERCIAL;

            return (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Verification pill & PayPal badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{statusConfig.label}</span>
                    </span>

                    {app.integrationAvailable && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                        <span className="font-extrabold">PayPal</span> Express
                      </span>
                    )}
                  </div>

                  {/* App Title & Description */}
                  <h3 className="font-bold text-white text-base">{app.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                      {app.category.replace(/_/g, ' ')}
                    </span>
                    {app.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  {app.integrationAvailable && app.payableAmount ? (
                    <>
                      <div>
                        <div className="text-[10px] text-slate-400">Payable Fee</div>
                        <div className="text-sm font-bold text-white">
                          ${app.payableAmount.toFixed(2)} USD
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCheckoutApp(app)}
                        className="py-2 px-3.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay with PayPal</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-slate-400">Official Portal</span>
                      <a
                        href={app.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition"
                      >
                        <span>Open Site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 4: ARRIVAL AUTOPILOT & RECENT PAYMENTS
      ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Immediate Arrival Tasks */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  <span>Arrival Autopilot Checklist</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-priority tasks for your {visual.countryName} journey
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard/arrival-plan')}
                className="text-xs text-blue-400 hover:underline"
              >
                View Plan →
              </button>
            </div>

            <div className="space-y-2.5">
              {(arrivalPlan?.tasks ?? []).slice(0, 4).map((task) => {
                const isDone = task.status === 'COMPLETED';

                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      if (!isDone) completeTask(task.id);
                    }}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isDone
                        ? 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'border border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Phase: {task.phase.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
                        task.priority === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-900'
                          : task.priority === 'HIGH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-900'
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

          {/* Right Column: AI Global Companion Inline & PayPal History */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Assistant Quick Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-900/60 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">VAYURA AI Companion</h4>
                    <span className="text-[10px] text-blue-300">Context: {visual.countryName}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/ai')}
                  className="text-xs font-semibold text-blue-400 hover:underline"
                >
                  Chat →
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                "Ready for your departure to {visual.countryName}? I can recommend verified subway navigation, help you calculate leftover budget, or guide you through foreign registration."
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => navigate('/dashboard/ai')}
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-left text-[11px] text-slate-200 transition"
                >
                  💡 What apps should I install?
                </button>
                <button
                  onClick={() => navigate('/dashboard/ai')}
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-left text-[11px] text-slate-200 transition"
                >
                  💳 PayPal arrival passes?
                </button>
              </div>
            </div>

            {/* Recent PayPal Transactions */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Recent PayPal Activity</span>
                </h4>
                <button
                  onClick={() => navigate('/dashboard/payments')}
                  className="text-xs text-blue-400 hover:underline"
                >
                  View All →
                </button>
              </div>

              {recentPayments.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No payments yet. Book local transit or eSIM passes above with PayPal.
                </div>
              ) : (
                <div className="space-y-2">
                  {recentPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{p.description}</div>
                        <div className="text-[10px] text-slate-500">{formatDate(p.createdAt)}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-mono font-bold text-emerald-400">${p.amount.toFixed(2)} {p.currency}</div>
                        <span className="text-[9px] uppercase font-bold text-blue-400">Sandbox Capt.</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Destination Switcher Modal */}
      <DestinationSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />

      {/* PayPal Service Checkout Modal */}
      <PayPalServiceCheckoutModal
        app={selectedCheckoutApp}
        isOpen={!!selectedCheckoutApp}
        onClose={() => setSelectedCheckoutApp(null)}
      />
    </div>
  );
}
