import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Plus, AlertTriangle, TrendingDown, Lightbulb, CreditCard, Shield, Sparkles, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getCountryVisual } from '@/data/countryVisuals';

const SAMPLE_EXCHANGE_RATES: Record<string, { rate: number; label: string }> = {
  KR: { rate: 1342.50, label: '1 USD ≈ ₩1,342.50 KRW' },
  JP: { rate: 154.20, label: '1 USD ≈ ¥154.20 JPY' },
  DE: { rate: 0.92, label: '1 USD ≈ €0.92 EUR' },
  SG: { rate: 1.35, label: '1 USD ≈ S$1.35 SGD' },
  AE: { rate: 3.67, label: '1 USD ≈ 3.67 AED' },
  GB: { rate: 0.79, label: '1 USD ≈ £0.79 GBP' },
  US: { rate: 1.00, label: 'Base USD' },
  IN: { rate: 84.10, label: '1 USD ≈ ₹84.10 INR' },
};

export function BudgetPage() {
  const { budget, travelProfile, selectedDestinationCode, countryData, payments, addExpense } = useAppStore();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    categoryId: '',
    description: '',
    amount: '',
  });

  const currentCountryCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCountryCode);
  const exchangeInfo = SAMPLE_EXCHANGE_RATES[currentCountryCode] ?? { rate: 1, label: '1 USD ≈ 1 USD' };

  if (!budget) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Budget not configured. Please complete your onboarding journey first.</p>
      </div>
    );
  }

  const spentPercent = budget.totalAmount > 0
    ? Math.round((budget.spentAmount / budget.totalAmount) * 100)
    : 0;

  const pieData = budget.categories.map((c) => ({
    name: c.name,
    value: c.allocatedAmount,
    color: c.color,
  }));

  const barData = budget.categories.map((c) => ({
    name: c.name.split(' ')[0],
    allocated: c.allocatedAmount,
    spent: c.spentAmount,
  }));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.categoryId || !expenseForm.description || !expenseForm.amount) return;
    addExpense(expenseForm.categoryId, expenseForm.description, Number(expenseForm.amount));
    setExpenseForm({ categoryId: '', description: '', amount: '' });
    setShowAddExpense(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              VAYURA Smart Budget & Currency
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
              {exchangeInfo.label}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            International Journey Spending Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-currency budget allocation for your {visual.countryName} journey. Confirmed PayPal transactions automatically update category spending and remaining balance.
          </p>
        </div>

        <button
          onClick={() => setShowAddExpense(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* ── Key Financial Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Allocated */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Total Allocated Budget</span>
          <div className="text-3xl font-black text-white mt-1">
            {formatCurrency(budget.totalAmount, budget.currency)}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 font-mono">
            ≈ {(budget.totalAmount * exchangeInfo.rate).toLocaleString([], { maximumFractionDigits: 0 })} {visual.localCurrency}
          </div>
        </div>

        {/* Remaining */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Remaining Balance</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {formatCurrency(budget.remainingAmount, budget.currency)}
          </div>
          <div className="text-xs text-emerald-500/80 mt-1.5">
            {100 - spentPercent}% Available for journey
          </div>
        </div>

        {/* Confirmed Spent */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Spent / Committed</span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
              PayPal Synced
            </span>
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {formatCurrency(budget.spentAmount, budget.currency)}
          </div>
          <div className="text-xs text-slate-400 mt-1.5">
            {spentPercent}% of total allocation used
          </div>
        </div>
      </div>

      {/* ── Visual Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Allocated vs Spent */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base">Category Budget vs. Spent</h3>
            <span className="text-xs text-slate-400">Values in {budget.currency}</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="#10b981" name="Actual Spent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Allocation Distribution */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <h3 className="font-bold text-white text-base mb-2">Planned Distribution</h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2 overflow-y-auto max-h-32 text-[11px] pr-1">
            {budget.categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300 truncate">{c.name}</span>
                </div>
                <span className="font-mono text-slate-400">
                  {formatCurrency(c.allocatedAmount, budget.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transaction & Expense History ── */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Recorded Expenses & Transactions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Includes manual entries and automatically captured PayPal orders.
            </p>
          </div>
        </div>

        {budget.expenses.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No expenses recorded yet. Captured PayPal payments will appear here automatically.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {budget.expenses.map((expense) => {
              const matchedCategory = budget.categories.find((c) => c.id === expense.categoryId);

              return (
                <div key={expense.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0">
                      {expense.paymentId ? '💳' : '📝'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{expense.description}</div>
                      <div className="text-[10px] text-slate-400">
                        {matchedCategory?.name ?? 'Local Expense'} · {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    {expense.paymentId && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900 font-bold">
                        PayPal
                      </span>
                    )}
                    <div className="font-mono font-bold text-white text-sm">
                      -{formatCurrency(expense.amount, expense.currency)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Expense Modal ── */}
      <AnimatePresence>
        {showAddExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">Record New Expense</h3>
                <button onClick={() => setShowAddExpense(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={expenseForm.categoryId}
                    onChange={(e) => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a Category...</option>
                    {budget.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Convenience store groceries, Subway ride"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Amount ({budget.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition mt-2"
                >
                  Save Expense
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
