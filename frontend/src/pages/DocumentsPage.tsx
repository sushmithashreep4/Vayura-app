import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, CheckCircle2, AlertCircle, Clock, Bell, Shield, Calendar, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { formatDate, daysUntil } from '@/lib/utils';
import type { Document } from '@/types';
import toast from 'react-hot-toast';

const DEFAULT_DOCUMENTS = [
  { name: 'Passport (Valid 6+ Months)', category: 'Identity', status: 'PENDING' as const },
  { name: 'Visa / Entry Permit / eTA', category: 'Immigration', status: 'PENDING' as const },
  { name: 'University Admission / Employment Contract', category: 'Purpose', status: 'PENDING' as const },
  { name: 'Travel & Health Insurance Certificate', category: 'Insurance', status: 'PENDING' as const },
  { name: 'Accommodation Lease / Confirmation', category: 'Housing', status: 'PENDING' as const },
  { name: 'Financial Solvency Proof / Bank Statement', category: 'Finance', status: 'PENDING' as const },
  { name: 'Tuberculosis (TB) / Vaccination Certificate', category: 'Health', status: 'PENDING' as const },
  { name: 'Passport Biometric Photographs', category: 'Identity', status: 'PENDING' as const },
];

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  PENDING: { label: 'Pending', badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  IN_PROGRESS: { label: 'In Progress', badgeClass: 'bg-blue-950/80 text-blue-300 border-blue-800' },
  READY: { label: 'Ready & Confirmed', badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  SUBMITTED: { label: 'Submitted', badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
};

export function DocumentsPage() {
  const { documents, reminders, addDocument, updateDocument, addReminder, completeReminder } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '', category: 'Identity', status: 'PENDING' as Document['status'], expiryDate: '', notes: '',
  });

  const handleAddDefaults = () => {
    DEFAULT_DOCUMENTS.forEach((d) => {
      if (!documents.find((doc) => doc.name === d.name)) {
        addDocument({ ...d, userId: 'guest' });
      }
    });
    toast.success('Default document checklist loaded');
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name) return;
    addDocument({
      name: newDoc.name,
      category: newDoc.category,
      status: newDoc.status,
      expiryDate: newDoc.expiryDate || undefined,
      notes: newDoc.notes || undefined,
      userId: 'guest',
    });
    setNewDoc({ name: '', category: 'Identity', status: 'PENDING', expiryDate: '', notes: '' });
    setShowAdd(false);
    toast.success('Document added to checklist');
  };

  const readyCount = documents.filter((d) => d.status === 'READY' || d.status === 'SUBMITTED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              VAYURA Document Autopilot
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
              {readyCount} of {documents.length} Ready
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            Document Readiness & Reminders
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Track preparation progress for international travel documents, passports, and visa applications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {documents.length === 0 && (
            <button
              onClick={handleAddDefaults}
              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Load Standard Checklist
            </button>
          )}

          <button
            onClick={() => setShowAdd(true)}
            className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* ── Security & Non-Collection Disclaimer ── */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-white">Privacy by Design:</span>
          <p className="text-slate-400">
            VAYURA tracks preparation status only. We do not store, scan, or verify sensitive passports, bank details, or government identity files. Always carry physical originals for border control.
          </p>
        </div>
      </div>

      {/* ── Document List Card ── */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Preparation Checklist</h3>
          <span className="text-xs text-slate-400 font-mono">
            {readyCount} / {documents.length} Verified Ready
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">No documents tracked yet</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Click below to populate standard immigration documents.
              </p>
            </div>
            <button
              onClick={handleAddDefaults}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              Add Standard Documents
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {documents.map((doc) => {
              const status = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.PENDING;

              return (
                <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm">{doc.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {doc.category}
                      </span>
                    </div>

                    {doc.notes && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{doc.notes}</p>
                    )}

                    {doc.expiryDate && (
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>Expires: {doc.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={doc.status}
                      onChange={(e) => updateDocument(doc.id, { status: e.target.value as Document['status'] })}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border bg-slate-950 focus:outline-none ${status.badgeClass}`}
                    >
                      <option value="PENDING">⏳ Pending</option>
                      <option value="IN_PROGRESS">🔄 In Progress</option>
                      <option value="READY">✅ Ready</option>
                      <option value="SUBMITTED">📤 Submitted</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Document Modal ── */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">Add Document Reminder</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Health Insurance Card, University Admission"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Identity">Identity</option>
                    <option value="Immigration">Immigration & Visa</option>
                    <option value="Purpose">Purpose (Education / Work)</option>
                    <option value="Housing">Housing & Accommodation</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Health">Health & Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Notes / Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Requires 2 certified apostilled copies"
                    value={newDoc.notes}
                    onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition mt-2"
                >
                  Save Document
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
