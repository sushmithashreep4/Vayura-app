import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User, TravelProfile, TravelPurpose, CountryData, LocalApp, ArrivalPlan,
  ArrivalTask, Budget, Payment, Document, Reminder,
  AIConversation, ChatMessage, OnboardingFormData, AppState,
} from '@/types';
import { getCountry } from '@/data/countries';
import { getAppsForProfile } from '@/data/localApps';
import { generateTasks } from '@/data/arrivalTasks';
import { uuid } from '@/lib/uuid';

interface AppActions {
  // Onboarding
  completeOnboarding: (data: OnboardingFormData) => void;
  resetOnboarding: () => void;

  // Destination & Purpose dynamic switching
  setDestinationCountry: (countryCode: string) => void;
  setPurpose: (purpose: TravelPurpose) => void;

  // Arrival Plan
  updateTask: (taskId: string, updates: Partial<ArrivalTask>) => void;
  completeTask: (taskId: string) => void;
  recalculateReadiness: () => void;

  // Budget
  setBudget: (budget: Budget) => void;
  addExpense: (categoryId: string, description: string, amount: number, paymentId?: string) => void;

  // Payments
  addPayment: (payment: Payment) => void;
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => void;

  // AI Chat
  startConversation: () => string;
  addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setCurrentConversation: (id: string) => void;

  // Documents
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;

  // Reminders
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  completeReminder: (id: string) => void;

  // General
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User) => void;
}

const initialState: AppState = {
  user: null,
  travelProfile: null,
  countryData: getCountry('KR') ?? null,
  selectedDestinationCode: 'KR',
  destinationApps: getAppsForProfile('KR', 'HIGHER_EDUCATION'),
  arrivalPlan: null,
  budget: null,
  payments: [],
  documents: [],
  reminders: [],
  conversations: [],
  currentConversationId: null,
  isOnboarded: false,
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      completeOnboarding: (data: OnboardingFormData) => {
        const userId = get().user?.id ?? uuid();
        const profileId = uuid();
        const planId = uuid();

        const user: User = get().user ?? {
          id: userId,
          email: data.email,
          fullName: data.fullName,
          createdAt: new Date().toISOString(),
        };

        const profile: TravelProfile = {
          id: profileId,
          userId,
          identity: data.identity,
          originCountryCode: data.originCountryCode,
          destinationCountryCode: data.destinationCountryCode,
          purpose: data.purpose,
          arrivalDate: data.arrivalDate,
          lengthOfStayDays: data.lengthOfStayDays,
          budgetAmount: data.budgetAmount,
          budgetCurrency: data.budgetCurrency,
          preferredLanguage: data.preferredLanguage,
          preferences: data.preferences,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const countryData = getCountry(data.destinationCountryCode) ?? null;
        const apps = getAppsForProfile(data.destinationCountryCode, data.purpose);

        // Generate personalised tasks
        const rawTasks = generateTasks(data.destinationCountryCode, data.purpose, planId);
        const tasks: ArrivalTask[] = rawTasks.map((t) => ({ ...t, id: uuid() }));

        const arrivalPlan: ArrivalPlan = {
          id: planId,
          travelProfileId: profileId,
          tasks,
          readinessScore: 0,
          readinessSummary: 'Your arrival plan has been created. Complete tasks to improve your readiness score.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Build budget
        const destCurrency = countryData?.currency ?? data.budgetCurrency;
        const budget: Budget = buildDefaultBudget(profileId, data.budgetAmount, data.budgetCurrency, data.purpose, destCurrency);

        set({
          user,
          travelProfile: profile,
          countryData,
          selectedDestinationCode: data.destinationCountryCode,
          destinationApps: apps,
          arrivalPlan,
          budget,
          isOnboarded: true,
        });
      },

      setDestinationCountry: (countryCode: string) => {
        const code = countryCode.toUpperCase();
        const countryData = getCountry(code) ?? null;
        const currentProfile = get().travelProfile;
        const currentPurpose = currentProfile?.purpose ?? 'HIGHER_EDUCATION';
        const apps = getAppsForProfile(code, currentPurpose);

        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            destinationCountryCode: code,
            updatedAt: new Date().toISOString(),
          };

          // Regenerate destination-aware arrival tasks
          const rawTasks = generateTasks(code, currentPurpose, currentProfile.id);
          const tasks: ArrivalTask[] = rawTasks.map((t) => ({ ...t, id: uuid() }));

          const currentPlan = get().arrivalPlan;
          const updatedPlan: ArrivalPlan = {
            id: currentPlan?.id ?? uuid(),
            travelProfileId: currentProfile.id,
            tasks,
            readinessScore: 0,
            readinessSummary: `Arrival plan updated for ${countryData?.name ?? code}. Complete tasks to improve readiness.`,
            createdAt: currentPlan?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            selectedDestinationCode: code,
            countryData,
            travelProfile: updatedProfile,
            destinationApps: apps,
            arrivalPlan: updatedPlan,
          });

          get().recalculateReadiness();
        } else {
          set({
            selectedDestinationCode: code,
            countryData,
            destinationApps: apps,
          });
        }
      },

      setPurpose: (purpose: TravelPurpose) => {
        const currentProfile = get().travelProfile;
        const currentCountry = get().selectedDestinationCode || currentProfile?.destinationCountryCode || 'KR';
        const apps = getAppsForProfile(currentCountry, purpose);

        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            purpose,
            updatedAt: new Date().toISOString(),
          };

          const rawTasks = generateTasks(currentCountry, purpose, currentProfile.id);
          const tasks: ArrivalTask[] = rawTasks.map((t) => ({ ...t, id: uuid() }));

          const currentPlan = get().arrivalPlan;
          const updatedPlan: ArrivalPlan = {
            id: currentPlan?.id ?? uuid(),
            travelProfileId: currentProfile.id,
            tasks,
            readinessScore: 0,
            readinessSummary: `Arrival plan tailored for ${purpose.replace('_', ' ')}.`,
            createdAt: currentPlan?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set({
            travelProfile: updatedProfile,
            destinationApps: apps,
            arrivalPlan: updatedPlan,
          });

          get().recalculateReadiness();
        } else {
          set({ destinationApps: apps });
        }
      },

      resetOnboarding: () => set(initialState),

      updateTask: (taskId, updates) => {
        const plan = get().arrivalPlan;
        if (!plan) return;
        const tasks = plan.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t);
        set({ arrivalPlan: { ...plan, tasks, updatedAt: new Date().toISOString() } });
        get().recalculateReadiness();
      },

      completeTask: (taskId) => {
        get().updateTask(taskId, {
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
        });
      },

      recalculateReadiness: () => {
        const plan = get().arrivalPlan;
        if (!plan) return;
        const total = plan.tasks.length;
        if (total === 0) return;
        const completed = plan.tasks.filter((t) => t.status === 'COMPLETED').length;
        const critical = plan.tasks.filter((t) => t.priority === 'CRITICAL');
        const criticalCompleted = critical.filter((t) => t.status === 'COMPLETED').length;
        // Weighted: critical tasks count 2x
        const weightedTotal = total + critical.length;
        const weightedCompleted = completed + criticalCompleted;
        const score = Math.round((weightedCompleted / weightedTotal) * 100);

        const pending = plan.tasks.filter((t) => t.status === 'PENDING');
        const urgentPending = pending.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH');
        const summary = urgentPending.length > 0
          ? `${completed} of ${total} tasks completed. ${urgentPending.length} urgent task${urgentPending.length > 1 ? 's' : ''} remaining.`
          : `${completed} of ${total} tasks completed. Great progress!`;

        set({
          arrivalPlan: {
            ...plan,
            readinessScore: score,
            readinessSummary: summary,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setBudget: (budget) => set({ budget }),

      addExpense: (categoryId, description, amount, paymentId) => {
        const budget = get().budget;
        if (!budget) return;
        const expense = {
          id: uuid(),
          budgetId: budget.id,
          categoryId,
          description,
          amount,
          currency: budget.currency,
          date: new Date().toISOString(),
          paymentId,
        };
        const categories = budget.categories.map((c) =>
          c.id === categoryId ? { ...c, spentAmount: c.spentAmount + amount } : c
        );
        const spentAmount = budget.spentAmount + amount;
        set({
          budget: {
            ...budget,
            categories,
            expenses: [...budget.expenses, expense],
            spentAmount,
            remainingAmount: budget.totalAmount - spentAmount,
          },
        });
      },

      addPayment: (payment) => set((s) => ({ payments: [...s.payments, payment] })),

      updatePaymentStatus: (paymentId, status) => {
        set((s) => ({
          payments: s.payments.map((p) => p.id === paymentId ? { ...p, status, updatedAt: new Date().toISOString() } : p),
        }));
      },

      startConversation: () => {
        const id = uuid();
        const conv: AIConversation = {
          id,
          userId: get().user?.id ?? 'guest',
          travelProfileId: get().travelProfile?.id,
          messages: [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          conversations: [...s.conversations, conv],
          currentConversationId: id,
        }));
        return id;
      },

      addMessage: (conversationId, message) => {
        const msg: ChatMessage = {
          id: uuid(),
          ...message,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg] }
              : c
          ),
        }));
      },

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addDocument: (doc) => {
        const d: Document = {
          id: uuid(),
          ...doc,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ documents: [...s.documents, d] }));
      },

      updateDocument: (id, updates) => {
        set((s) => ({
          documents: s.documents.map((d) => d.id === id ? { ...d, ...updates } : d),
        }));
      },

      addReminder: (reminder) => {
        const r: Reminder = { id: uuid(), ...reminder };
        set((s) => ({ reminders: [...s.reminders, r] }));
      },

      completeReminder: (id) => {
        set((s) => ({
          reminders: s.reminders.map((r) => r.id === id ? { ...r, isCompleted: true } : r),
        }));
      },
    }),
    {
      name: 'vayura-app-state',
      partialize: (state) => ({
        user: state.user,
        travelProfile: state.travelProfile,
        countryData: state.countryData,
        destinationApps: state.destinationApps,
        arrivalPlan: state.arrivalPlan,
        budget: state.budget,
        payments: state.payments,
        documents: state.documents,
        reminders: state.reminders,
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);

// ============================================================
// Budget Builder
// ============================================================

function buildDefaultBudget(
  profileId: string,
  totalAmount: number,
  currency: string,
  purpose: string,
  destCurrency: string
): Budget {
  const allocations = getBudgetAllocations(purpose, totalAmount);
  return {
    id: uuid(),
    travelProfileId: profileId,
    totalAmount,
    currency,
    spentAmount: 0,
    remainingAmount: totalAmount,
    categories: allocations,
    expenses: [],
    aiRecommendations: [
      'Book accommodation early to secure lower rates.',
      'Get a local SIM card at the airport for affordable connectivity.',
      'Open a local bank account to avoid foreign transaction fees.',
      'Research student or transit discounts available in your destination.',
    ],
    createdAt: new Date().toISOString(),
  };
}

function getBudgetAllocations(purpose: string, total: number): Budget['categories'] {
  const configs: Record<string, { name: string; pct: number; icon: string; color: string }[]> = {
    HIGHER_EDUCATION: [
      { name: 'Accommodation', pct: 35, icon: '🏠', color: '#6366f1' },
      { name: 'Education & Tuition', pct: 20, icon: '🎓', color: '#8b5cf6' },
      { name: 'Food & Groceries', pct: 20, icon: '🍜', color: '#14b8a6' },
      { name: 'Transportation', pct: 10, icon: '🚆', color: '#f59e0b' },
      { name: 'Connectivity', pct: 5, icon: '📱', color: '#3b82f6' },
      { name: 'Healthcare', pct: 5, icon: '🏥', color: '#10b981' },
      { name: 'Emergency Reserve', pct: 5, icon: '🛡️', color: '#ef4444' },
    ],
    TOURISM: [
      { name: 'Accommodation', pct: 30, icon: '🏨', color: '#6366f1' },
      { name: 'Food & Dining', pct: 25, icon: '🍜', color: '#14b8a6' },
      { name: 'Activities & Attractions', pct: 20, icon: '🎭', color: '#8b5cf6' },
      { name: 'Transportation', pct: 15, icon: '🚆', color: '#f59e0b' },
      { name: 'Shopping', pct: 5, icon: '🛍️', color: '#ec4899' },
      { name: 'Emergency Reserve', pct: 5, icon: '🛡️', color: '#ef4444' },
    ],
    EMPLOYMENT: [
      { name: 'Accommodation', pct: 40, icon: '🏠', color: '#6366f1' },
      { name: 'Food & Groceries', pct: 20, icon: '🍜', color: '#14b8a6' },
      { name: 'Transportation', pct: 15, icon: '🚆', color: '#f59e0b' },
      { name: 'Connectivity', pct: 5, icon: '📱', color: '#3b82f6' },
      { name: 'Healthcare', pct: 5, icon: '🏥', color: '#10b981' },
      { name: 'Professional Setup', pct: 10, icon: '💼', color: '#8b5cf6' },
      { name: 'Emergency Reserve', pct: 5, icon: '🛡️', color: '#ef4444' },
    ],
    DEFAULT: [
      { name: 'Accommodation', pct: 35, icon: '🏠', color: '#6366f1' },
      { name: 'Food & Dining', pct: 25, icon: '🍜', color: '#14b8a6' },
      { name: 'Transportation', pct: 15, icon: '🚆', color: '#f59e0b' },
      { name: 'Local Services', pct: 10, icon: '📱', color: '#3b82f6' },
      { name: 'Healthcare', pct: 5, icon: '🏥', color: '#10b981' },
      { name: 'Other Expenses', pct: 5, icon: '💰', color: '#8b5cf6' },
      { name: 'Emergency Reserve', pct: 5, icon: '🛡️', color: '#ef4444' },
    ],
  };

  const config = configs[purpose] ?? configs.DEFAULT;

  return config.map((c) => ({
    id: uuid(),
    name: c.name,
    icon: c.icon,
    allocatedAmount: Math.round((total * c.pct) / 100),
    spentAmount: 0,
    currency: 'USD',
    color: c.color,
  }));
}
