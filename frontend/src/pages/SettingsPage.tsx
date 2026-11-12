import { useNavigate } from 'react-router-dom';
import { User, Globe2, Calendar, Wallet, LogOut, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { COUNTRY_LIST, PURPOSE_LABELS } from '@/data/countries';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, travelProfile, countryData, budget, resetOnboarding } = useAppStore();

  if (!user || !travelProfile) return null;

  const origin = COUNTRY_LIST.find((c) => c.code === travelProfile.originCountryCode);
  const destination = COUNTRY_LIST.find((c) => c.code === travelProfile.destinationCountryCode);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Profile & Settings</h1>
        <p className="text-surface-500 mt-1">Your journey profile and account settings.</p>
      </div>

      {/* Profile card */}
      <Card className="mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="text-xl font-bold text-surface-900">{user.fullName}</div>
            <div className="text-surface-500">{user.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Globe2} label="Origin" value={`${origin?.flag} ${origin?.name}`} />
          <InfoRow icon={Globe2} label="Destination" value={`${destination?.flag} ${destination?.name}`} />
          <InfoRow icon={User} label="Purpose" value={PURPOSE_LABELS[travelProfile.purpose]} />
          <InfoRow
            icon={Calendar}
            label="Arrival"
            value={travelProfile.arrivalDate ? formatDate(travelProfile.arrivalDate) : 'Not set'}
          />
          <InfoRow
            icon={Calendar}
            label="Length of stay"
            value={`${travelProfile.lengthOfStayDays} days`}
          />
          {budget && (
            <InfoRow
              icon={Wallet}
              label="Total budget"
              value={formatCurrency(budget.totalAmount, budget.currency)}
            />
          )}
        </div>
      </Card>

      {/* Journey reset */}
      <Card className="border-red-100 bg-red-50/40">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <CardTitle className="text-red-700">Reset Journey</CardTitle>
        </div>
        <p className="text-sm text-surface-600 mb-4">
          Starting a new journey will clear all your current profile data, tasks, budget, and payment history. 
          This cannot be undone.
        </p>
        <Button
          variant="danger"
          size="md"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={() => {
            resetOnboarding();
            navigate('/');
          }}
        >
          Start New Journey
        </Button>
      </Card>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
      <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
      <div>
        <div className="text-xs text-surface-400">{label}</div>
        <div className="text-sm font-medium text-surface-900">{value}</div>
      </div>
    </div>
  );
}
