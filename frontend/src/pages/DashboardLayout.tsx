import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Globe2, Sparkles, CreditCard } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/useAppStore';
import { getCountryVisual } from '@/data/countryVisuals';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOnboarded, selectedDestinationCode, countryData } = useAppStore();
  const navigate = useNavigate();

  if (!isOnboarded) {
    navigate('/onboarding');
    return null;
  }

  const currentCode = selectedDestinationCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCode);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar (Desktop sticky + Mobile overlay) */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Mobile Top Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xl">{visual.flag}</span>
            <span className="font-extrabold text-white tracking-wide">VAYURA</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {visual.countryName}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <main className="flex-1 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
