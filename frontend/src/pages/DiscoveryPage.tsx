import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ExternalLink, ShieldCheck, Info, Download, Globe,
  CreditCard, Sparkles, RefreshCw, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getCountryVisual } from '@/data/countryVisuals';
import { DestinationSwitcherModal } from '@/components/destination/DestinationSwitcherModal';
import { PayPalServiceCheckoutModal } from '@/components/payments/PayPalServiceCheckoutModal';
import {
  VERIFICATION_LABELS, CATEGORY_LABELS, CATEGORY_ICONS
} from '@/data/localApps';
import type { LocalApp, AppCategory } from '@/types';

const AVAILABILITY_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  AVAILABLE: { label: 'Available', badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
  TEMPORARILY_UNAVAILABLE: { label: 'Temporarily Unavailable', badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  COUNTRY_RESTRICTED: { label: 'Country Restricted', badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-800' },
  INTEGRATION_NOT_AVAILABLE: { label: 'Information Only', badgeClass: 'bg-slate-800 text-slate-400 border-slate-700' },
  VERIFICATION_PENDING: { label: 'Verification Pending', badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800' },
  INFORMATION_ONLY: { label: 'Information Only', badgeClass: 'bg-slate-800 text-slate-400 border-slate-700' },
};

export function DiscoveryPage() {
  const { destinationApps, countryData, selectedDestinationCode, travelProfile } = useAppStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'ALL'>('ALL');
  const [selectedApp, setSelectedApp] = useState<LocalApp | null>(null);
  const [checkoutApp, setCheckoutApp] = useState<LocalApp | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const currentCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCode);

  const categories = Array.from(
    new Set(destinationApps.map((a) => a.category))
  ) as AppCategory[];

  const filtered = destinationApps.filter((app) => {
    const matchSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase()) ||
      app.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'ALL' || app.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Global Essentials Ecosystem
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
              {visual.flag} {visual.countryName}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            Your Destination. Your Everyday Essentials.
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Essential everyday applications and services verified for {visual.countryName}. Filtered for your{' '}
            <span className="text-slate-200 font-medium">{travelProfile?.purpose.replace(/_/g, ' ') ?? 'Higher Education'}</span> journey.
          </p>
        </div>

        <button
          onClick={() => setIsSwitcherOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Switch Country ({visual.flag})</span>
        </button>
      </div>

      {/* ── Search & Verification Legend ── */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified apps by name, keywords (e.g. eSIM, train, subway, baemin, suica, maps)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Verification Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Trust Labels:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800 text-[11px] flex items-center gap-1">
            <span>🏛️</span> Official Government Service
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800 text-[11px] flex items-center gap-1">
            <span>✅</span> Government-Regulated
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-950/70 text-indigo-300 border border-indigo-800 text-[11px] flex items-center gap-1">
            <span>🔵</span> Verified Commercial
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-300 border border-amber-800 text-[11px] flex items-center gap-1">
            <span>💳</span> PayPal Express Checkout
          </span>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
            selectedCategory === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          All ({destinationApps.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{CATEGORY_ICONS[cat] ?? '📱'}</span>
            <span>{CATEGORY_LABELS[cat] ?? cat}</span>
          </button>
        ))}
      </div>

      {/* ── Apps Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((app) => {
          const statusConfig = VERIFICATION_LABELS[app.verificationStatus] ?? VERIFICATION_LABELS.VERIFIED_COMMERCIAL;
          const availConfig = AVAILABILITY_CONFIG[app.availabilityStatus] ?? AVAILABILITY_CONFIG.AVAILABLE;

          return (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{statusConfig.label}</span>
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${availConfig.badgeClass}`}>
                    {availConfig.label}
                  </span>
                </div>

                {/* App Name & Category */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-base leading-snug">{app.name}</h3>
                  <span className="text-xs">{CATEGORY_ICONS[app.category] ?? '📱'}</span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {app.description}
                </p>

                {/* Metadata tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                    {app.category.replace(/_/g, ' ')}
                  </span>
                  {app.languages && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400">
                      🗣️ {app.languages.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
                {app.integrationAvailable && app.payableAmount ? (
                  <>
                    <div>
                      <div className="text-[10px] text-slate-400">Fixed Rate</div>
                      <div className="text-sm font-extrabold text-blue-400">
                        ${app.payableAmount.toFixed(2)} USD
                      </div>
                    </div>
                    <button
                      onClick={() => setCheckoutApp(app)}
                      className="py-2 px-3.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay with PayPal</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <a
                      href={app.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── App Detail Modal ── */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedApp.category.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{selectedApp.name}</h3>
                  <div className="text-xs text-slate-400">{visual.countryName}</div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-300 leading-relaxed">{selectedApp.description}</p>

                <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Eligibility:</span>
                    <span className="text-slate-200 text-right">{selectedApp.eligibility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification:</span>
                    <span className="text-emerald-400">{selectedApp.verificationStatus}</span>
                  </div>
                  {selectedApp.verificationSource && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Source:</span>
                      <a
                        href={selectedApp.verificationSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline truncate max-w-[200px]"
                      >
                        {selectedApp.verificationSource}
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Verified:</span>
                    <span className="text-slate-400">{selectedApp.lastChecked}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <a
                    href={selectedApp.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-center font-semibold text-white transition flex items-center justify-center gap-1"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Destination Switcher Modal */}
      <DestinationSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />

      {/* PayPal Service Checkout Modal */}
      <PayPalServiceCheckoutModal
        app={checkoutApp}
        isOpen={!!checkoutApp}
        onClose={() => setCheckoutApp(null)}
      />
    </div>
  );
}
