import type { ArrivalTask, TravelPurpose, TaskPriority, TaskPhase } from '@/types';

// ============================================================
// Arrival Task Templates — Country & Purpose Aware
// ============================================================

interface TaskTemplate {
  title: string;
  description: string;
  priority: TaskPriority;
  phase: TaskPhase;
  category: string;
  relatedAppId?: string;
  actionUrl?: string;
  purposes: TravelPurpose[];
  countries?: string[]; // if undefined, applies to all
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // ============ BEFORE DEPARTURE — Universal ============
  {
    title: 'Check visa requirements for your destination',
    description: 'Verify the correct visa category, required documents, and processing times for your destination country.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Immigration',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'JOB_SEARCH', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },
  {
    title: 'Ensure passport is valid for at least 6 months',
    description: 'Most countries require your passport to be valid for 6 months beyond your planned stay.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Documents',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'JOB_SEARCH', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },
  {
    title: 'Arrange travel insurance',
    description: 'Get comprehensive travel insurance covering medical emergencies, trip cancellation, and loss of belongings.',
    priority: 'HIGH',
    phase: 'BEFORE_DEPARTURE',
    category: 'Insurance',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },
  {
    title: 'Notify your bank about international travel',
    description: 'Inform your home bank about your travel to prevent card freezes. Set up international transfers.',
    priority: 'HIGH',
    phase: 'BEFORE_DEPARTURE',
    category: 'Finance',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'TOURISM', 'BUSINESS', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'JOB_SEARCH'],
  },
  {
    title: 'Research local currency and exchange rates',
    description: 'Understand the destination currency, current exchange rates, and best methods for currency exchange.',
    priority: 'MEDIUM',
    phase: 'BEFORE_DEPARTURE',
    category: 'Finance',
    purposes: ['HIGHER_EDUCATION', 'TOURISM', 'BUSINESS', 'EMPLOYMENT', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },

  // ============ BEFORE DEPARTURE — Higher Education ============
  {
    title: 'Confirm university admission and enrollment',
    description: 'Confirm your offer letter, complete enrollment procedures, and obtain your student ID or enrollment certificate.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Education',
    purposes: ['HIGHER_EDUCATION', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Apply for student visa',
    description: 'Complete the student visa application with all required documents including admission letter, financial proof, and medical certificates.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Immigration',
    purposes: ['HIGHER_EDUCATION', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Research university accommodation or off-campus housing',
    description: 'Apply for university dormitories or research private accommodation options near your campus.',
    priority: 'HIGH',
    phase: 'BEFORE_DEPARTURE',
    category: 'Accommodation',
    purposes: ['HIGHER_EDUCATION', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Prepare financial proof documentation',
    description: 'Prepare bank statements showing sufficient funds for tuition, living expenses, and return travel.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Finance',
    purposes: ['HIGHER_EDUCATION', 'EXCHANGE_PROGRAMME'],
  },

  // ============ BEFORE DEPARTURE — South Korea Specific ============
  {
    title: 'Register on HiKorea portal',
    description: 'Create an account on the official Korean immigration portal (hikorea.go.kr) to manage your immigration status and apply for Alien Registration.',
    priority: 'HIGH',
    phase: 'BEFORE_DEPARTURE',
    category: 'Immigration',
    relatedAppId: 'kr-hikorea',
    actionUrl: 'https://www.hikorea.go.kr',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'EXCHANGE_PROGRAMME', 'PERMANENT_RELOCATION'],
    countries: ['KR'],
  },
  {
    title: 'Explore Study in Korea portal for scholarships',
    description: 'Review available scholarships including GKS (Government Scholarship) on the official Study in Korea portal.',
    priority: 'HIGH',
    phase: 'BEFORE_DEPARTURE',
    category: 'Education',
    relatedAppId: 'kr-studyinkorea',
    actionUrl: 'https://www.studyinkorea.go.kr',
    purposes: ['HIGHER_EDUCATION', 'EXCHANGE_PROGRAMME'],
    countries: ['KR'],
  },
  {
    title: 'Install KakaoTalk before departure',
    description: 'KakaoTalk is the dominant communication platform in Korea. Install it and set up your account to stay connected with university and local contacts.',
    priority: 'HIGH',
    phase: 'BEFORE_DEPARTURE',
    category: 'Communication',
    relatedAppId: 'kr-kakao',
    actionUrl: 'https://www.kakaocorp.com/page/service/service/KakaoTalk',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'EXCHANGE_PROGRAMME'],
    countries: ['KR'],
  },

  // ============ BEFORE DEPARTURE — Employment ============
  {
    title: 'Secure employment documentation',
    description: 'Obtain your job offer letter, employment contract, and any required employer sponsorship documents.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Employment',
    purposes: ['EMPLOYMENT'],
  },
  {
    title: 'Apply for work visa',
    description: 'Submit your work visa application with employment documentation, qualifications, and required supporting documents.',
    priority: 'CRITICAL',
    phase: 'BEFORE_DEPARTURE',
    category: 'Immigration',
    purposes: ['EMPLOYMENT'],
  },

  // ============ ARRIVAL DAY ============
  {
    title: 'Complete immigration and customs clearance',
    description: 'Have all entry documents ready. Declare required items at customs. Follow official immigration officer instructions.',
    priority: 'CRITICAL',
    phase: 'ARRIVAL_DAY',
    category: 'Immigration',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'JOB_SEARCH', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },
  {
    title: 'Activate or purchase local SIM card',
    description: 'Get a local SIM card for connectivity. Available at the airport for most destinations. Compare providers and plans before buying.',
    priority: 'HIGH',
    phase: 'ARRIVAL_DAY',
    category: 'Connectivity',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },
  {
    title: 'Arrange transportation to accommodation',
    description: 'Plan your route from the airport to your accommodation. Research public transit, taxi, or shuttle options in advance.',
    priority: 'HIGH',
    phase: 'ARRIVAL_DAY',
    category: 'Transportation',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },
  {
    title: 'Check in to accommodation',
    description: 'Complete check-in and ensure your accommodation is as booked. Save the address and emergency contact for the property.',
    priority: 'CRITICAL',
    phase: 'ARRIVAL_DAY',
    category: 'Accommodation',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'TOURISM', 'BUSINESS', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD', 'PERMANENT_RELOCATION', 'OTHER'],
  },

  // ============ FIRST WEEK ============
  {
    title: 'Register with local authorities',
    description: 'Complete any mandatory foreigner registration requirements in your destination country.',
    priority: 'CRITICAL',
    phase: 'FIRST_WEEK',
    category: 'Immigration',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'PERMANENT_RELOCATION', 'DIGITAL_NOMAD', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Open a local bank account',
    description: 'Open a local bank account for everyday transactions, salary deposits, and bill payments. Research which banks accept foreigners.',
    priority: 'HIGH',
    phase: 'FIRST_WEEK',
    category: 'Finance',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'PERMANENT_RELOCATION', 'DIGITAL_NOMAD', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Register with your university or employer',
    description: 'Complete official registration with your university or start your onboarding process with your employer.',
    priority: 'CRITICAL',
    phase: 'FIRST_WEEK',
    category: 'Education / Employment',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Set up local transportation card',
    description: 'Get a transit card or pass for public transportation in your city.',
    priority: 'HIGH',
    phase: 'FIRST_WEEK',
    category: 'Transportation',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'PERMANENT_RELOCATION', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD'],
  },

  // ============ FIRST WEEK — South Korea ============
  {
    title: 'Apply for Alien Registration Card (ARC)',
    description: 'Within 90 days of arrival, foreigners staying over 90 days must register at the nearest immigration office to obtain an ARC.',
    priority: 'CRITICAL',
    phase: 'FIRST_WEEK',
    category: 'Immigration',
    relatedAppId: 'kr-hikorea',
    actionUrl: 'https://www.hikorea.go.kr',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'EXCHANGE_PROGRAMME', 'PERMANENT_RELOCATION'],
    countries: ['KR'],
  },
  {
    title: 'Apply for T-Money or Korea Pass transit card',
    description: 'Get a T-Money card for public transportation in Seoul and other Korean cities. Available at convenience stores and metro stations.',
    priority: 'HIGH',
    phase: 'FIRST_WEEK',
    category: 'Transportation',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'TOURISM', 'EXCHANGE_PROGRAMME'],
    countries: ['KR'],
  },

  // ============ FIRST MONTH ============
  {
    title: 'Register with your home country embassy',
    description: 'Register with your home country\'s embassy or consulate for safety and emergency notification services.',
    priority: 'MEDIUM',
    phase: 'FIRST_MONTH',
    category: 'Safety',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'PERMANENT_RELOCATION', 'DIGITAL_NOMAD', 'EXCHANGE_PROGRAMME'],
  },
  {
    title: 'Explore healthcare options and register with a provider',
    description: 'Understand your health insurance coverage and register with a local doctor or clinic.',
    priority: 'HIGH',
    phase: 'FIRST_MONTH',
    category: 'Healthcare',
    purposes: ['HIGHER_EDUCATION', 'EMPLOYMENT', 'PERMANENT_RELOCATION', 'EXCHANGE_PROGRAMME', 'DIGITAL_NOMAD'],
  },
  {
    title: 'Set up utility connections if renting long-term',
    description: 'Arrange electricity, water, gas, and internet connections for your accommodation if staying long-term.',
    priority: 'MEDIUM',
    phase: 'FIRST_MONTH',
    category: 'Accommodation',
    purposes: ['EMPLOYMENT', 'PERMANENT_RELOCATION', 'DIGITAL_NOMAD'],
  },
];

// ============================================================
// Generate personalised task list for a travel profile
// ============================================================

export function generateTasks(
  countryCode: string,
  purpose: TravelPurpose,
  arrivalPlanId: string
): Omit<ArrivalTask, 'id'>[] {
  return TASK_TEMPLATES
    .filter((t) => {
      const purposeMatch = t.purposes.includes(purpose);
      const countryMatch = !t.countries || t.countries.includes(countryCode.toUpperCase());
      return purposeMatch && countryMatch;
    })
    .map((t, index) => ({
      arrivalPlanId,
      title: t.title,
      description: t.description,
      priority: t.priority,
      phase: t.phase,
      category: t.category,
      status: 'PENDING' as const,
      relatedAppId: t.relatedAppId,
      actionUrl: t.actionUrl,
      dueDate: undefined,
      completedAt: undefined,
    }));
}

export const PHASE_LABELS: Record<TaskPhase, string> = {
  BEFORE_DEPARTURE: 'Before Departure',
  ARRIVAL_DAY: 'Arrival Day',
  FIRST_WEEK: 'First Week',
  FIRST_MONTH: 'First Month',
};

export const PHASE_ICONS: Record<TaskPhase, string> = {
  BEFORE_DEPARTURE: '📋',
  ARRIVAL_DAY: '✈️',
  FIRST_WEEK: '🗓️',
  FIRST_MONTH: '📅',
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: 'Critical', color: 'text-red-700', bg: 'bg-red-50 text-red-700 border-red-200' },
  HIGH: { label: 'High', color: 'text-orange-700', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
  MEDIUM: { label: 'Medium', color: 'text-yellow-700', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  LOW: { label: 'Low', color: 'text-green-700', bg: 'bg-green-50 text-green-700 border-green-200' },
};
