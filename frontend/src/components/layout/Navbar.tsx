import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe2, ChevronDown, Sparkles, CreditCard, Compass, Shield, HeartPulse } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getCountryVisual } from '@/data/countryVisuals';
import { DestinationSwitcherModal } from '@/components/destination/DestinationSwitcherModal';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const { user, isOnboarded, selectedDestinationCode, countryData } = useAppStore();
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const currentCode = selectedDestinationCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCode);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Globe2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-white">
                      VAYURA
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                      AI & Fintech
                    </span>
                  </div>
                  <div className="text-[11px] leading-none font-medium text-slate-400">
                    Moving Across Borders. Arrive Connected.
                  </div>
                </div>
              </Link>

              {/* Main Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                <button
                  onClick={() => setIsSwitcherOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Destinations</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                <Link
                  to={isOnboarded ? '/dashboard/discovery' : '/#essentials'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                >
                  <span>Global Essentials</span>
                </Link>

                <Link
                  to={isOnboarded ? '/dashboard/ai' : '/#ai-companion'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Companion</span>
                </Link>

                <Link
                  to={isOnboarded ? '/dashboard/payments' : '/#paypal-payments'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 hover:text-white hover:bg-blue-950/60 border border-blue-900/60 transition"
                >
                  <div className="w-4 h-4 rounded-full bg-[#003087] flex items-center justify-center text-[10px] text-white font-bold">
                    P
                  </div>
                  <span>VAYURA Payments</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="PayPal Sandbox Operational" />
                </Link>

                <Link
                  to={isOnboarded ? '/dashboard/budget' : '/#budget'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                >
                  <span>Smart Budget</span>
                </Link>

                <Link
                  to={isOnboarded ? '/dashboard/emergency' : '/#emergency'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 transition"
                >
                  <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emergency</span>
                </Link>
              </nav>

              {/* Right Side: Destination Pill & Dashboard Access */}
              <div className="hidden sm:flex items-center gap-3">
                {/* 1-Click Interactive Destination Selector Pill */}
                <button
                  onClick={() => setIsSwitcherOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 rounded-full text-xs transition shadow-sm"
                  title="Click to change destination country"
                >
                  <span className="text-base leading-none">{visual.flag}</span>
                  <span className="font-semibold text-slate-200">{visual.countryName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {visual.localCurrencySymbol} {visual.localCurrency}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isOnboarded ? (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                  >
                    <span>My Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/onboarding"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition"
                  >
                    Plan My Journey
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex sm:hidden items-center gap-2">
                <button
                  onClick={() => setIsSwitcherOpen(true)}
                  className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                >
                  {visual.flag}
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="p-2 text-slate-300 hover:text-white"
                >
                  {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3"
              >
                <button
                  onClick={() => {
                    setIsSwitcherOpen(true);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{visual.flag}</span>
                    <div className="text-left">
                      <div className="font-bold">{visual.countryName}</div>
                      <div className="text-slate-400 text-[10px]">{visual.destinationTitle}</div>
                    </div>
                  </div>
                  <span className="text-blue-400 font-semibold">Change ↗</span>
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    to={isOnboarded ? '/dashboard/discovery' : '/#essentials'}
                    onClick={() => setMobileOpen(false)}
                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-medium"
                  >
                    Global Essentials
                  </Link>
                  <Link
                    to={isOnboarded ? '/dashboard/ai' : '/#ai-companion'}
                    onClick={() => setMobileOpen(false)}
                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-medium"
                  >
                    AI Companion
                  </Link>
                  <Link
                    to={isOnboarded ? '/dashboard/payments' : '/#paypal-payments'}
                    onClick={() => setMobileOpen(false)}
                    className="p-3 bg-blue-950/80 rounded-xl border border-blue-900 text-blue-300 font-bold"
                  >
                    VAYURA Payments
                  </Link>
                  <Link
                    to={isOnboarded ? '/dashboard/budget' : '/#budget'}
                    onClick={() => setMobileOpen(false)}
                    className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-medium"
                  >
                    Smart Budget
                  </Link>
                </div>

                <Link
                  to={isOnboarded ? '/dashboard' : '/onboarding'}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full py-3 rounded-xl bg-blue-600 text-center text-white text-xs font-bold"
                >
                  {isOnboarded ? 'Open Dashboard' : 'Plan My Journey'}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Destination Switcher Modal */}
      <DestinationSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
}
