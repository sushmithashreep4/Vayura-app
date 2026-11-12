import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, CheckSquare, Compass,
  Wallet, CreditCard, FileText, AlertTriangle, Settings,
  Globe2, ChevronRight, LogOut, Menu, X, Sparkles, RefreshCw
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn, getInitials } from '@/lib/utils';
import { getCountryVisual } from '@/data/countryVisuals';
import { DestinationSwitcherModal } from '@/components/destination/DestinationSwitcherModal';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Compass, label: 'Explore Destinations', path: '/dashboard/discovery?tab=destinations' },
  { icon: Globe2, label: 'Global Essentials', path: '/dashboard/discovery' },
  { icon: Sparkles, label: 'AI Companion', path: '/dashboard/ai' },
  { icon: CheckSquare, label: 'My Journey', path: '/dashboard/arrival-plan' },
  { icon: CreditCard, label: 'VAYURA Payments', path: '/dashboard/payments', isFintech: true },
  { icon: Wallet, label: 'Smart Budget', path: '/dashboard/budget' },
  { icon: FileText, label: 'Documents & Reminders', path: '/dashboard/documents' },
  { icon: AlertTriangle, label: 'Emergency Support', path: '/dashboard/emergency' },
  { icon: Settings, label: 'Profile & Settings', path: '/dashboard/settings' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { user, travelProfile, countryData, selectedDestinationCode, arrivalPlan, resetOnboarding } = useAppStore();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  const currentCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCode);

  const handleLogout = () => {
    resetOnboarding();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 text-slate-100">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <Globe2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wider">VAYURA</div>
            <div className="text-[10px] text-blue-400 font-medium">AI & Global Fintech</div>
          </div>
        </NavLink>

        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
          Sandbox
        </span>
      </div>

      {/* Active Destination Card with 1-click Switch */}
      <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div
          className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl pointer-events-none opacity-20"
          style={{ backgroundColor: visual.accentTheme.primaryHex }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{visual.flag}</span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{visual.countryName}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {travelProfile ? travelProfile.purpose.replace(/_/g, ' ') : 'Higher Education'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px] flex items-center gap-1"
            title="Switch destination country"
          >
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>Switch</span>
          </button>
        </div>

        {/* Readiness Meter */}
        <div className="mt-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Arrival Readiness</span>
            <span className="font-bold text-blue-400">{arrivalPlan?.readinessScore ?? 0}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${arrivalPlan?.readinessScore ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              )
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>{item.label}</span>
            </div>
            {item.isFintech && (
              <span className="w-2 h-2 rounded-full bg-blue-400" title="PayPal Powered" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user ? getInitials(user.fullName) : 'V'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {user?.fullName ?? 'Traveller'}
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono">
              {visual.localCurrency} Active
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <DestinationSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 w-64 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
