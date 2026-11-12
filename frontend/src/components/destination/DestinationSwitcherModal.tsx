import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check, Globe2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { COUNTRY_VISUALS, type CountryVisualConfig } from '@/data/countryVisuals';
import toast from 'react-hot-toast';

interface DestinationSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry?: (countryCode: string) => void;
}

export function DestinationSwitcherModal({
  isOpen,
  onClose,
  onSelectCountry,
}: DestinationSwitcherModalProps) {
  const { selectedDestinationCode, setDestinationCountry, countryData } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentCode = selectedDestinationCode || countryData?.code || 'KR';

  const allDestinations = Object.values(COUNTRY_VISUALS);

  const filtered = allDestinations.filter((dest) => {
    const q = searchQuery.toLowerCase();
    return (
      dest.countryName.toLowerCase().includes(q) ||
      dest.destinationTitle.toLowerCase().includes(q) ||
      dest.capitalCity.toLowerCase().includes(q) ||
      dest.countryCode.toLowerCase().includes(q)
    );
  });

  const handleSelect = (dest: CountryVisualConfig) => {
    setDestinationCountry(dest.countryCode);
    toast.success(`Destination transformed to ${dest.flag} ${dest.countryName}!`, {
      icon: '🌍',
    });
    if (onSelectCountry) onSelectCountry(dest.countryCode);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Select Your Destination</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch destinations to instantly update cinematic backgrounds, local applications, currency, and AI assistance.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 bg-slate-900 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by country, city (e.g. South Korea, Tokyo, Berlin, Dubai)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                autoFocus
              />
            </div>
          </div>

          {/* Countries Grid */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((dest) => {
              const isSelected = dest.countryCode === currentCode;

              return (
                <div
                  key={dest.countryCode}
                  onClick={() => handleSelect(dest)}
                  className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50 shadow-lg shadow-blue-950/50'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  {/* Subtle Background Glow */}
                  <div
                    className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: dest.accentTheme.primaryHex }}
                  />

                  <div className="flex items-start gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/60 bg-slate-800">
                      <img
                        src={dest.fallbackImage}
                        alt={dest.countryName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1 right-1 text-base">{dest.flag}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base truncate">{dest.countryName}</h3>
                          <span className="text-xs text-slate-400 font-mono">({dest.countryCode})</span>
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/50">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-medium">
                        {dest.destinationTitle} · {dest.capitalCity}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 flex-wrap">
                        <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          {dest.localCurrencySymbol} {dest.localCurrency}
                        </span>
                        <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          {dest.callingCode}
                        </span>
                        <span className="text-slate-400 line-clamp-1 text-[10px]">
                          {dest.landmarks[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover visual accent indicator */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Cinematic Video & Daily Essentials ready</span>
                    </span>
                    <span className="text-blue-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px]">
                      Select <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>8 Supported Global Destinations · High Definition Video Backgrounds</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Full PayPal Developer Sandbox Integration</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

