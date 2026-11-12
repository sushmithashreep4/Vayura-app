import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, CheckCircle2, AlertTriangle, Shield, ExternalLink,
  Plus, ArrowRight, Download, RefreshCw, Sparkles, Filter, X,
  ChevronDown, ChevronUp, Receipt, Clock, AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PayPalServiceCheckoutModal } from '@/components/payments/PayPalServiceCheckoutModal';
import { getCountryVisual } from '@/data/countryVisuals';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { LocalApp, Payment } from '@/types';
import toast from 'react-hot-toast';

export function PaymentsPage() {
  const { user, travelProfile, budget, payments, destinationApps, selectedDestinationCode, countryData } = useAppStore();

  const [checkoutApp, setCheckoutApp] = useState<LocalApp | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CAPTURED' | 'CREATED' | 'FAILED'>('ALL');

  const currentCountryCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCountryCode);

  // Filter services that have PayPal integration enabled
  const payPalServices = destinationApps.filter((a) => a.integrationAvailable && a.payableAmount);

  const capturedPayments = payments.filter((p) => p.status === 'CAPTURED');
  const totalSpent = capturedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalBudget = budget?.totalAmount ?? 3500;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const filteredPayments = payments.filter((p) => {
    if (statusFilter === 'ALL') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* ── Top Header & Sandbox Badge ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#003087] flex items-center justify-center text-xs font-black text-white shadow">
              P
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              PayPal Developer Hackathon Integration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sandbox Orders API v2</span>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            VAYURA Payments & Expense Ledger
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Direct, end-to-end PayPal integration. Pre-book destination transit passes, 5G travel eSIMs, and essential arrivals services with server-side authorization and automatic budget synchronization.
          </p>
        </div>

        {/* Security / Non-Autonomous Policy Notice */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs max-w-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Zero-Risk Sandbox Environment</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            All payments require explicit user authorization. AI cannot execute transactions automatically.
          </p>
        </div>
      </div>

      {/* ── Global Spending Intelligence Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Total Confirmed Spending</span>
          <div className="text-2xl font-black text-white mt-1">
            ${totalSpent.toFixed(2)} USD
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{capturedPayments.length} payments</span>
            <span>captured via PayPal</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Remaining Travel Budget</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${remainingBudget.toFixed(2)} USD
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Total Allocated: ${totalBudget.toFixed(2)} USD
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Destination Currency</span>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {visual.localCurrencySymbol} {visual.localCurrency}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Auto-converted in ledger & budget
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">API Status</span>
          <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Operational</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            api-m.sandbox.paypal.com
          </div>
        </div>
      </div>

      {/* ── Supported Arrival Services Catalog (Payable with PayPal) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Available Arrival Passes for {visual.countryName}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any verified service to test the full create order → user approval → capture order lifecycle.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payPalServices.map((service) => (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {service.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-400">{visual.flag} {visual.countryName}</span>
                </div>

                <h3 className="font-bold text-white text-base">{service.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Standard Price</div>
                  <div className="text-lg font-black text-white">
                    ${service.payableAmount?.toFixed(2)} USD
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutApp(service)}
                  className="py-2.5 px-4 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-blue-900/30"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Book with PayPal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PayPal Orders API Architecture Flow Diagram ── */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <span>Official PayPal Orders API v2 Lifecycle</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-blue-400 mb-1">1. Discover</div>
            <div className="text-[11px] text-slate-400">User selects local verified service</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-blue-400 mb-1">2. Create Order</div>
            <div className="text-[11px] text-slate-400">POST /api/payments/create-order</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-blue-400 mb-1">3. Present SDK</div>
            <div className="text-[11px] text-slate-400">@paypal/react-paypal-js renders button</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-blue-400 mb-1">4. User Approves</div>
            <div className="text-[11px] text-slate-400">Explicit biometric / login consent</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-blue-400 mb-1">5. Capture Order</div>
            <div className="text-[11px] text-slate-400">Backend captures & checks idempotency</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-emerald-400 mb-1">6. Ledger Sync</div>
            <div className="text-[11px] text-slate-400">Persists DB, updates budget & tasks</div>
          </div>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <TransactionHistory payments={filteredPayments} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {/* ── PayPal Service Checkout Modal ── */}
      <PayPalServiceCheckoutModal
        app={checkoutApp}
        isOpen={!!checkoutApp}
        onClose={() => setCheckoutApp(null)}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Transaction History — expandable rows, type badges, inline receipt
// ═══════════════════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<string, {
  label: string; dot: string; badge: string; row: string;
}> = {
  CAPTURED: {
    label: 'Captured',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    row: 'hover:bg-emerald-950/10',
  },
  CREATED: {
    label: 'Pending',
    dot: 'bg-blue-400',
    badge: 'bg-blue-950 text-blue-300 border-blue-800',
    row: 'hover:bg-blue-950/10',
  },
  APPROVED: {
    label: 'Approved',
    dot: 'bg-indigo-400',
    badge: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    row: 'hover:bg-indigo-950/10',
  },
  FAILED: {
    label: 'Failed',
    dot: 'bg-red-400',
    badge: 'bg-red-950 text-red-300 border-red-800',
    row: 'hover:bg-red-950/10',
  },
  CANCELLED: {
    label: 'Cancelled',
    dot: 'bg-slate-500',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    row: 'hover:bg-slate-800/20',
  },
  REFUNDED: {
    label: 'Refunded',
    dot: 'bg-amber-400',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    row: 'hover:bg-amber-950/10',
  },
};

const MODE_CONFIG: Record<string, { label: string; badge: string }> = {
  SANDBOX: {
    label: 'Sandbox',
    badge: 'bg-blue-950 text-blue-400 border-blue-800',
  },
  DEMO: {
    label: 'Demo',
    badge: 'bg-amber-950 text-amber-400 border-amber-800',
  },
  LIVE: {
    label: 'Live',
    badge: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  },
};

function downloadReceipt(p: Payment) {
  const mode = p.transactionMode ?? (p.isSandbox ? 'SANDBOX' : 'DEMO');
  const lines = [
    '══════════════════════════════════════════',
    '       VAYURA PAYMENT RECEIPT',
    '══════════════════════════════════════════',
    '',
    `  Merchant      : VAYURA Global Arrivals`,
    `  Service       : ${p.description}`,
    '',
    `  Amount        : ${formatCurrency(p.amount, p.currency)}`,
    `  Currency      : ${p.currency}`,
    `  Date          : ${formatDate(p.createdAt)}`,
    '',
    `  Order ID      : ${p.paypalOrderId}`,
    `  Capture ID    : ${p.captureId ?? 'N/A'}`,
    `  Internal ID   : ${p.id}`,
    `  Status        : ${p.status}`,
    `  Method        : PayPal`,
    `  Mode          : ${mode}`,
    '',
    '──────────────────────────────────────────',
    mode === 'DEMO'
      ? '  ⚠  DEMO RECEIPT — SIMULATED TRANSACTION'
      : '  ✓  SANDBOX RECEIPT — NO REAL FUNDS MOVED',
    '──────────────────────────────────────────',
    '',
    '  VAYURA · PayPal Developer Hackathon',
    '',
    '══════════════════════════════════════════',
  ].join('\n');

  const blob = new Blob([lines], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VAYURA-Receipt-${p.id.slice(0, 8).toUpperCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function TransactionHistory({
  payments,
  statusFilter,
  setStatusFilter,
}: {
  payments: Payment[];
  statusFilter: 'ALL' | 'CAPTURED' | 'CREATED' | 'FAILED';
  setStatusFilter: (f: 'ALL' | 'CAPTURED' | 'CREATED' | 'FAILED') => void;
}) {
  const allPayments = useAppStore((s) => s.payments);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = {
    ALL: allPayments.length,
    CAPTURED: allPayments.filter((p) => p.status === 'CAPTURED').length,
    CREATED: allPayments.filter((p) => p.status === 'CREATED').length,
    FAILED: allPayments.filter((p) => p.status === 'FAILED').length,
  };

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All persisted records · click any row to expand details and download receipt
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'CAPTURED', 'CREATED', 'FAILED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'ALL' ? `All (${counts.ALL})` : `${f} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {payments.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6 text-slate-500" />
          </div>
          <p className="font-semibold text-white">No transactions yet</p>
          <p className="text-xs text-slate-400">
            Select an arrival service above to test the full PayPal payment journey.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/80 divide-y divide-slate-800/60">
          {/* Table head */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4
                          px-4 py-2.5 bg-slate-950 border-b border-slate-800
                          text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span>Service</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Mode</span>
            <span>Date</span>
          </div>

          {/* Rows */}
          {payments.map((p) => {
            const sc = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.CREATED;
            const mode = p.transactionMode ?? (p.isSandbox ? 'SANDBOX' : 'DEMO');
            const mc = MODE_CONFIG[mode] ?? MODE_CONFIG.SANDBOX;
            const isOpen = expandedId === p.id;

            return (
              <div key={p.id} className="transition-colors">
                {/* Summary row */}
                <button
                  onClick={() => toggle(p.id)}
                  className={`w-full text-left px-4 py-3.5 flex sm:grid
                    sm:grid-cols-[1fr_auto_auto_auto_auto]
                    items-center gap-3 sm:gap-4 transition-colors ${sc.row}`}
                >
                  {/* Service name + order ID */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {p.description}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 truncate hidden sm:block">
                        {p.paypalOrderId}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-sm font-black text-white tabular-nums whitespace-nowrap">
                    {formatCurrency(p.amount, p.currency)}
                  </div>

                  {/* Status badge */}
                  <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5
                      rounded-full text-[10px] font-bold border ${sc.badge}`}>
                    {sc.label}
                  </span>

                  {/* Mode badge */}
                  <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5
                      rounded-full text-[10px] font-bold border ${mc.badge}`}>
                    {mc.label}
                  </span>

                  {/* Date + chevron */}
                  <div className="flex items-center gap-2 text-slate-400 text-xs whitespace-nowrap">
                    <span className="hidden sm:inline">{formatDate(p.createdAt)}</span>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                  </div>
                </button>

                {/* Expanded detail panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/60">
                        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                          {/* Detail rows */}
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 font-mono text-xs">
                            <DetailField label="Merchant" value="VAYURA Global Arrivals" mono={false} />
                            <DetailField label="Service" value={p.description} mono={false} />
                            <DetailField label="Amount" value={formatCurrency(p.amount, p.currency)} highlight />
                            <DetailField label="Currency" value={p.currency} />
                            <DetailField label="Status" value={p.status} highlight />
                            <DetailField label="Payment Method" value="PayPal" mono={false} />
                            <DetailField label="Transaction Mode" value={mode} />
                            <DetailField label="Date" value={formatDate(p.createdAt)} mono={false} />
                            <DetailField label="PayPal Order ID" value={p.paypalOrderId} truncate />
                            {p.captureId && (
                              <DetailField label="Capture ID" value={p.captureId} truncate />
                            )}
                            <DetailField label="Internal ID" value={p.id} truncate />
                          </div>

                          {/* Mode disclaimer */}
                          <div className={`mx-4 mb-4 px-3 py-2 rounded-lg border text-[11px] flex items-start gap-2
                            ${mode === 'DEMO'
                              ? 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                              : 'bg-blue-950/30 border-blue-800/40 text-blue-300'}`}>
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>
                              {mode === 'DEMO'
                                ? 'DEMO TRANSACTION — Simulated payment. No real PayPal order was created.'
                                : 'SANDBOX TRANSACTION — Real PayPal API call. No actual funds moved.'}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="px-4 pb-4 flex flex-wrap gap-2">
                            {p.status === 'CAPTURED' && (
                              <button
                                onClick={() => downloadReceipt(p)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                           bg-slate-800 hover:bg-slate-700 border border-slate-700
                                           text-xs font-semibold text-slate-200 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download Receipt
                              </button>
                            )}
                            {(p.status === 'FAILED' || p.status === 'CANCELLED') && (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                              text-xs font-medium text-slate-500">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                No receipt — payment not completed
                              </span>
                            )}
                            {p.status === 'CREATED' && (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                              text-xs font-medium text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                Awaiting approval
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {Object.entries(MODE_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badge}`}>
              {cfg.label}
            </span>
            <span className="text-[11px] text-slate-500">
              {key === 'SANDBOX' && '— Real PayPal API, no funds moved'}
              {key === 'DEMO' && '— Simulated, no PayPal API call'}
              {key === 'LIVE' && '— Real payment'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailField({
  label, value, highlight = false, truncate = false, mono = true,
}: {
  label: string; value: string;
  highlight?: boolean; truncate?: boolean; mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      <span
        className={`${mono ? 'font-mono' : 'font-sans text-sm'}
          ${highlight ? 'text-emerald-400 font-bold'
            : truncate ? 'text-slate-300 text-[11px] break-all'
            : 'text-slate-200'}`}
      >
        {value}
      </span>
    </div>
  );
}
