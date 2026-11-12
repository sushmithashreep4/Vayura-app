import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

// Layout
import { Navbar } from '@/components/layout/Navbar';

// Pages
import { LandingPage } from '@/pages/LandingPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardLayout } from '@/pages/DashboardLayout';
import { DashboardOverview } from '@/pages/DashboardOverview';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { ArrivalPlanPage } from '@/pages/ArrivalPlanPage';
import { DiscoveryPage } from '@/pages/DiscoveryPage';
import { BudgetPage } from '@/pages/BudgetPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { EmergencyPage } from '@/pages/EmergencyPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  const { isOnboarded } = useAppStore();

  return (
    <Routes>
      {/* Public routes with Navbar */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <LandingPage />
          </>
        }
      />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Dashboard routes — protected */}
      <Route
        path="/dashboard"
        element={
          isOnboarded ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="ai" element={<AIAssistantPage />} />
        <Route path="arrival-plan" element={<ArrivalPlanPage />} />
        <Route path="discovery" element={<DiscoveryPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
