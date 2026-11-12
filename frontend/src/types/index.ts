// ============================================================
// VAYURA — Core Type Definitions
// ============================================================

export type TravelPurpose =
  | 'HIGHER_EDUCATION'
  | 'EMPLOYMENT'
  | 'JOB_SEARCH'
  | 'TOURISM'
  | 'BUSINESS'
  | 'EXCHANGE_PROGRAMME'
  | 'DIGITAL_NOMAD'
  | 'PERMANENT_RELOCATION'
  | 'OTHER';

export type UserIdentity =
  | 'INTERNATIONAL_STUDENT'
  | 'WORKING_PROFESSIONAL'
  | 'JOB_SEEKER'
  | 'TOURIST'
  | 'BUSINESS_TRAVELLER'
  | 'EXCHANGE_STUDENT'
  | 'DIGITAL_NOMAD'
  | 'RELOCATING_FAMILY'
  | 'OTHER';

export type VerificationStatus =
  | 'OFFICIAL_GOVERNMENT'
  | 'GOVERNMENT_REGULATED'
  | 'GOVERNMENT_LICENSED'
  | 'VERIFIED_COMMERCIAL'
  | 'COMMUNITY_RECOMMENDED'
  | 'VERIFICATION_PENDING';

export type AvailabilityStatus =
  | 'AVAILABLE'
  | 'TEMPORARILY_UNAVAILABLE'
  | 'COUNTRY_RESTRICTED'
  | 'INTEGRATION_NOT_AVAILABLE'
  | 'VERIFICATION_PENDING'
  | 'INFORMATION_ONLY';

export type AppCategory =
  | 'GOVERNMENT_SERVICES'
  | 'IMMIGRATION'
  | 'PUBLIC_TRANSPORTATION'
  | 'TRANSPORT_MOBILITY'
  | 'MAPS_NAVIGATION'
  | 'FOOD_DELIVERY'
  | 'GROCERY_DELIVERY'
  | 'DAILY_ESSENTIALS'
  | 'ACCOMMODATION'
  | 'BANKING_PAYMENTS'
  | 'MONEY_PAYMENTS'
  | 'MOBILE_CONNECTIVITY'
  | 'HEALTHCARE'
  | 'HEALTH_WELLNESS'
  | 'EMERGENCY'
  | 'EMPLOYMENT'
  | 'EDUCATION'
  | 'STUDY_CAREER'
  | 'COMMUNICATION'
  | 'COMMUNICATION_COMMUNITY'
  | 'CURRENCY_FINANCE'
  | 'RIDE_HAILING'
  | 'SOCIAL';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskPhase = 'BEFORE_DEPARTURE' | 'ARRIVAL_DAY' | 'FIRST_WEEK' | 'FIRST_MONTH';

export type PaymentStatus =
  | 'CREATED'
  | 'APPROVED'
  | 'CAPTURED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

// ============================================================
// User & Profile
// ============================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface TravelProfile {
  id: string;
  userId: string;
  identity?: UserIdentity;
  originCountryCode: string;
  destinationCountryCode: string;
  purpose: TravelPurpose;
  arrivalDate: string;
  lengthOfStayDays: number;
  budgetAmount: number;
  budgetCurrency: string;
  preferredLanguage: string;
  preferences?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Country Data
// ============================================================

export interface EmergencyContact {
  service: string;
  number: string;
  notes?: string;
}

export interface GovernmentPortal {
  name: string;
  url: string;
  description: string;
  category: string;
}

export interface CountryData {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  languages: string[];
  timezone: string;
  emergencyContacts: EmergencyContact[];
  governmentPortals: GovernmentPortal[];
  capitalCity: string;
  region: string;
  callingCode: string;
  lastVerified: string;
}

// ============================================================
// Local App Discovery
// ============================================================

export interface LocalApp {
  id: string;
  name: string;
  logoUrl: string;
  countryCode: string;
  supportedPurposes: TravelPurpose[];
  category: AppCategory;
  officialWebsite: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  description: string;
  languages: string[];
  eligibility: string;
  verificationStatus: VerificationStatus;
  verificationSource?: string;
  availabilityStatus: AvailabilityStatus;
  integrationAvailable: boolean;
  payableAmount?: number;
  payableCurrency?: string;
  payPalServiceId?: string;
  lastChecked: string;
  isFeatured: boolean;
  tags: string[];
}

// ============================================================
// Arrival Plan & Tasks
// ============================================================

export interface ArrivalTask {
  id: string;
  arrivalPlanId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  phase: TaskPhase;
  category: string;
  dueDate?: string;
  status: TaskStatus;
  relatedAppId?: string;
  relatedApp?: LocalApp;
  actionUrl?: string;
  completedAt?: string;
}

export interface ArrivalPlan {
  id: string;
  travelProfileId: string;
  tasks: ArrivalTask[];
  readinessScore: number;
  readinessSummary: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Budget
// ============================================================

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocatedAmount: number;
  spentAmount: number;
  currency: string;
  color: string;
}

export interface Expense {
  id: string;
  budgetId: string;
  categoryId: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paymentId?: string;
}

export interface Budget {
  id: string;
  travelProfileId: string;
  totalAmount: number;
  currency: string;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
  expenses: Expense[];
  aiRecommendations: string[];
  createdAt: string;
}

// ============================================================
// Payments
// ============================================================

export type TransactionMode = 'SANDBOX' | 'DEMO' | 'LIVE';

export interface Payment {
  id: string;
  userId: string;
  paypalOrderId: string;
  amount: number;
  currency: string;
  relatedService: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  isSandbox: boolean;
  /** Distinguishes real sandbox, demo simulation, and live payments */
  transactionMode?: TransactionMode;
  /** PayPal capture ID returned after successful capture */
  captureId?: string;
}

// ============================================================
// AI Conversation
// ============================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  disclaimer?: string;
  actionCards?: ActionCard[];
  relatedApps?: LocalApp[];
  taskUpdates?: Partial<ArrivalTask>[];
}

export interface ActionCard {
  id: string;
  title: string;
  description: string;
  actionType: 'TASK' | 'SERVICE' | 'PAYMENT' | 'INFO';
  actionUrl?: string;
  priority: TaskPriority;
  icon: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  travelProfileId?: string;
  messages: ChatMessage[];
  createdAt: string;
}

// ============================================================
// Documents
// ============================================================

export interface Document {
  id: string;
  userId: string;
  name: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY' | 'SUBMITTED';
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: TaskPriority;
  relatedDocumentId?: string;
}

// ============================================================
// App State (Zustand)
// ============================================================

export interface AppState {
  user: User | null;
  travelProfile: TravelProfile | null;
  countryData: CountryData | null;
  selectedDestinationCode: string;
  destinationApps: LocalApp[];
  arrivalPlan: ArrivalPlan | null;
  budget: Budget | null;
  payments: Payment[];
  documents: Document[];
  reminders: Reminder[];
  conversations: AIConversation[];
  currentConversationId: string | null;
  isOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface OnboardingFormData {
  identity: UserIdentity;
  originCountryCode: string;
  destinationCountryCode: string;
  purpose: TravelPurpose;
  arrivalDate: string;
  lengthOfStayDays: number;
  budgetAmount: number;
  budgetCurrency: string;
  preferredLanguage: string;
  preferences?: string;
  fullName: string;
  email: string;
}
