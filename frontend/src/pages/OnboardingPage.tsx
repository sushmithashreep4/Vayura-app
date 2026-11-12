import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Globe2, CheckCircle2, Search } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { useAppStore } from '@/store/useAppStore';
import { COUNTRY_LIST } from '@/data/countries';
import { COUNTRY_VISUALS } from '@/data/countryVisuals';
import type { OnboardingFormData, TravelPurpose, UserIdentity } from '@/types';

// ─── Step count ───────────────────────────────────────────────
const TOTAL_STEPS = 7;

// ─── Identity Options ─────────────────────────────────────────
const IDENTITIES: { value: UserIdentity; label: string; emoji: string; desc: string }[] = [
  { value: 'INTERNATIONAL_STUDENT', label: 'International Student', emoji: '🎓', desc: 'University, college or language programs' },
  { value: 'WORKING_PROFESSIONAL', label: 'Working Professional', emoji: '💼', desc: 'New job, company transfer or assignment' },
  { value: 'JOB_SEEKER', label: 'Job Seeker', emoji: '🔍', desc: 'Looking for employment or attending interviews' },
  { value: 'TOURIST', label: 'Tourist / Traveller', emoji: '✈️', desc: 'Holiday, solo travel or family vacation' },
  { value: 'BUSINESS_TRAVELLER', label: 'Business Traveller', emoji: '📊', desc: 'Meetings, conferences or exhibitions' },
  { value: 'EXCHANGE_STUDENT', label: 'Exchange Student', emoji: '🤝', desc: 'Academic exchange or Erasmus programme' },
  { value: 'DIGITAL_NOMAD', label: 'Digital Nomad', emoji: '💻', desc: 'Remote work and long-term travel' },
  { value: 'RELOCATING_FAMILY', label: 'Relocating with Family', emoji: '🏠', desc: 'Permanent or long-term relocation' },
  { value: 'OTHER', label: 'Other', emoji: '🌐', desc: 'Research, volunteer work or other purpose' },
];

// ─── Purpose options per identity ─────────────────────────────
const PURPOSES_BY_IDENTITY: Record<UserIdentity, { value: TravelPurpose; label: string; emoji: string }[]> = {
  INTERNATIONAL_STUDENT: [
    { value: 'HIGHER_EDUCATION', label: 'Higher Education', emoji: '🎓' },
    { value: 'EXCHANGE_PROGRAMME', label: 'Exchange Programme', emoji: '🤝' },
    { value: 'JOB_SEARCH', label: 'Internship / Research', emoji: '🔬' },
    { value: 'OTHER', label: 'Language Programme', emoji: '🗣️' },
  ],
  WORKING_PROFESSIONAL: [
    { value: 'EMPLOYMENT', label: 'New Job / Career Move', emoji: '💼' },
    { value: 'BUSINESS', label: 'Company Transfer', emoji: '🏢' },
    { value: 'DIGITAL_NOMAD', label: 'Remote Working', emoji: '💻' },
    { value: 'OTHER', label: 'Business Assignment', emoji: '📋' },
  ],
  JOB_SEEKER: [
    { value: 'JOB_SEARCH', label: 'Looking for Employment', emoji: '🔍' },
    { value: 'BUSINESS', label: 'Attending Interviews', emoji: '📝' },
    { value: 'JOB_SEARCH', label: 'Networking & Career', emoji: '🤝' },
    { value: 'OTHER', label: 'Skill Development', emoji: '📚' },
  ],
  TOURIST: [
    { value: 'TOURISM', label: 'Holiday / Vacation', emoji: '🏖️' },
    { value: 'TOURISM', label: 'Solo Adventure', emoji: '🎒' },
    { value: 'TOURISM', label: 'Cultural Exploration', emoji: '🏛️' },
    { value: 'TOURISM', label: 'Family Trip', emoji: '👨‍👩‍👧' },
  ],
  BUSINESS_TRAVELLER: [
    { value: 'BUSINESS', label: 'Business Meetings', emoji: '🤝' },
    { value: 'BUSINESS', label: 'Conference / Exhibition', emoji: '🎪' },
    { value: 'BUSINESS', label: 'Business Partnership', emoji: '🏢' },
    { value: 'BUSINESS', label: 'Investment / Deal', emoji: '📈' },
  ],
  EXCHANGE_STUDENT: [
    { value: 'EXCHANGE_PROGRAMME', label: 'Academic Exchange', emoji: '🎓' },
    { value: 'EXCHANGE_PROGRAMME', label: 'Erasmus Programme', emoji: '🇪🇺' },
    { value: 'HIGHER_EDUCATION', label: 'Short-Term Study', emoji: '📖' },
    { value: 'OTHER', label: 'Cultural Exchange', emoji: '🌍' },
  ],
  DIGITAL_NOMAD: [
    { value: 'DIGITAL_NOMAD', label: 'Remote Work & Travel', emoji: '💻' },
    { value: 'DIGITAL_NOMAD', label: 'Long-Term Stay', emoji: '🏡' },
    { value: 'TOURISM', label: 'Work & Explore', emoji: '🌐' },
    { value: 'OTHER', label: 'Freelancing', emoji: '✍️' },
  ],
  RELOCATING_FAMILY: [
    { value: 'PERMANENT_RELOCATION', label: 'Permanent Relocation', emoji: '🏠' },
    { value: 'EMPLOYMENT', label: 'Family Sponsorship', emoji: '👨‍👩‍👧' },
    { value: 'OTHER', label: 'Long-Term Settlement', emoji: '📍' },
    { value: 'OTHER', label: 'Partner / Spouse Visa', emoji: '💍' },
  ],
  OTHER: [
    { value: 'OTHER', label: 'Research / Academia', emoji: '🔬' },
    { value: 'TOURISM', label: 'Volunteer Work', emoji: '🤲' },
    { value: 'OTHER', label: 'Medical Visit', emoji: '🏥' },
    { value: 'OTHER', label: 'Other Purpose', emoji: '🌐' },
  ],
};

// ─── Default form ──────────────────────────────────────────────
const DEFAULT_FORM: OnboardingFormData = {
  identity: 'INTERNATIONAL_STUDENT',
  fullName: '',
  email: '',
  originCountryCode: 'IN',
  destinationCountryCode: 'KR',
  purpose: 'HIGHER_EDUCATION',
  arrivalDate: '',
  lengthOfStayDays: 365,
  budgetAmount: 3500,
  budgetCurrency: 'USD',
  preferredLanguage: 'en',
  preferences: '',
};

const STEP_LABELS = [
  'Who are you?',
  'Home Country',
  'Destination',
  'Your Purpose',
  'Travel Details',
  'Your Budget',
  'Ready!',
];

// ─── Main component ────────────────────────────────────────────
export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<OnboardingFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingFormData, string>>>({});

  const { completeOnboarding } = useAppStore();
  const navigate = useNavigate();

  const update = <K extends keyof OnboardingFormData>(key: K, value: OnboardingFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (step === 0 && !form.identity) e.identity = 'Please select your identity';
    if (step === 1 && !form.originCountryCode) e.originCountryCode = 'Please select your home country';
    if (step === 2 && !form.destinationCountryCode) e.destinationCountryCode = 'Please select a destination';
    if (step === 2 && form.originCountryCode === form.destinationCountryCode)
      e.destinationCountryCode = 'Destination must differ from origin';
    if (step === 3 && !form.purpose) e.purpose = 'Please select a purpose';
    if (step === 4) {
      if (!form.fullName.trim()) e.fullName = 'Name is required';
      if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
      if (!form.arrivalDate) e.arrivalDate = 'Arrival date required';
      if (form.lengthOfStayDays < 1) e.lengthOfStayDays = 'At least 1 day required';
    }
    if (step === 5 && form.budgetAmount <= 0) e.budgetAmount = 'Please enter a budget';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    if (step < TOTAL_STEPS - 2) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      // Last step — submit
      completeOnboarding(form);
      navigate('/dashboard');
    }
  };

  const goBack = () => {
    if (step === 0) { navigate('/'); return; }
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const destVisual = COUNTRY_VISUALS[form.destinationCountryCode] ?? COUNTRY_VISUALS['KR'];
  const isLastStep = step === TOTAL_STEPS - 2;

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: cinematic destination panel (hidden on mobile) */}
      <div className="hidden lg:block lg:w-[42%] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={form.destinationCountryCode}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={destVisual.fallbackImage}
              alt={destVisual.countryName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/70" />
          </motion.div>
        </AnimatePresence>

        {/* Overlay content */}
        <div className="relative z-10 p-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wide text-white">VAYURA</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={form.destinationCountryCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-10"
            >
              <div className="text-5xl mb-3">
                {COUNTRY_LIST.find((c) => c.code === form.destinationCountryCode)?.flag ?? '🌍'}
              </div>
              <div className="text-3xl font-black text-white leading-tight mb-2">
                {destVisual.destinationTitle}
              </div>
              <div className="text-sm text-white/70 leading-relaxed max-w-xs">
                {destVisual.destinationTagline}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {destVisual.culturalHighlights.slice(0, 3).map((h) => (
                  <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80">
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 bg-slate-950 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Globe2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white">VAYURA</span>
        </div>

        {/* Progress */}
        <div className="px-6 sm:px-10 lg:px-12 pt-8 pb-4">
          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                  i < step ? 'bg-blue-500' : i === step ? 'bg-blue-500/50' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Step {step + 1} of {TOTAL_STEPS - 1}</span>
            <span className="text-xs font-semibold text-blue-400">{STEP_LABELS[step]}</span>
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-12 py-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              {step === 0 && <StepIdentity form={form} errors={errors} update={update} />}
              {step === 1 && <StepOrigin form={form} errors={errors} update={update} />}
              {step === 2 && <StepDestination form={form} errors={errors} update={update} />}
              {step === 3 && <StepPurpose form={form} errors={errors} update={update} />}
              {step === 4 && <StepTravelDetails form={form} errors={errors} update={update} />}
              {step === 5 && <StepBudget form={form} errors={errors} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="px-6 sm:px-10 lg:px-12 py-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 font-medium text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? 'Home' : 'Back'}
          </button>
          <button
            onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg"
          >
            {isLastStep ? '🚀 Launch My Journey' : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 0: WHO ARE YOU?
// ─────────────────────────────────────────────────────────────
function StepIdentity({
  form, errors, update,
}: {
  form: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  update: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void;
}) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-black text-white mb-2">Who are you?</h2>
      <p className="text-slate-400 text-sm mb-8">
        VAYURA personalises your entire experience around your identity. Select the option that best describes you.
      </p>
      {errors.identity && <p className="text-rose-400 text-xs mb-3">{errors.identity}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {IDENTITIES.map((id) => {
          const selected = form.identity === id.value;
          return (
            <button
              key={id.value}
              type="button"
              onClick={() => update('identity', id.value)}
              className={`p-4 rounded-2xl border text-left transition group ${
                selected
                  ? 'bg-blue-950/80 border-blue-500 shadow-lg shadow-blue-900/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="text-3xl mb-2">{id.emoji}</div>
              <div className={`font-bold text-sm mb-0.5 ${selected ? 'text-blue-300' : 'text-white'}`}>
                {id.label}
              </div>
              <div className="text-[11px] text-slate-500">{id.desc}</div>
              {selected && (
                <div className="mt-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 1: WHERE ARE YOU FROM?
// ─────────────────────────────────────────────────────────────
function StepOrigin({
  form, errors, update,
}: {
  form: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  update: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = COUNTRY_LIST.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );
  const selectedCountry = COUNTRY_LIST.find((c) => c.code === form.originCountryCode);

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-black text-white mb-2">Where are you from?</h2>
      <p className="text-slate-400 text-sm mb-8">
        Your home country helps us personalise visa guidance, currency conversions and origin-specific tips.
      </p>

      {selectedCountry && (
        <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center gap-3 mb-5">
          <span className="text-3xl">{selectedCountry.flag}</span>
          <div>
            <div className="font-bold text-white">{selectedCountry.name}</div>
            <div className="text-xs text-blue-300">{selectedCountry.currency} · {selectedCountry.callingCode}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-blue-400 ml-auto" />
        </div>
      )}

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {errors.originCountryCode && <p className="text-rose-400 text-xs mb-2">{errors.originCountryCode}</p>}

      <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
        {filtered.map((c) => {
          const selected = form.originCountryCode === c.code;
          return (
            <button
              key={c.code}
              onClick={() => { update('originCountryCode', c.code); setSearch(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                selected
                  ? 'bg-blue-950/80 border border-blue-700'
                  : 'hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <span className="text-xl">{c.flag}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${selected ? 'text-blue-200' : 'text-slate-200'}`}>{c.name}</div>
              </div>
              <div className="text-xs text-slate-500">{c.currency}</div>
              {selected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 2: WHERE ARE YOU GOING?
// ─────────────────────────────────────────────────────────────
function StepDestination({
  form, errors, update,
}: {
  form: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  update: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void;
}) {
  const [search, setSearch] = useState('');
  const featured = ['KR', 'JP', 'DE', 'SG', 'AE', 'GB', 'US', 'IN'];
  const filtered = search
    ? COUNTRY_LIST.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRY_LIST.filter((c) => featured.includes(c.code));

  const selectedCountry = COUNTRY_LIST.find((c) => c.code === form.destinationCountryCode);
  const visual = COUNTRY_VISUALS[form.destinationCountryCode];

  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-black text-white mb-2">Where are you going?</h2>
      <p className="text-slate-400 text-sm mb-6">
        Select your destination and watch VAYURA transform — unique video background, local apps and country theme.
      </p>

      {errors.destinationCountryCode && (
        <p className="text-rose-400 text-xs mb-3">{errors.destinationCountryCode}</p>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Country grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {filtered.map((c) => {
          const v = COUNTRY_VISUALS[c.code];
          const selected = form.destinationCountryCode === c.code;
          return (
            <button
              key={c.code}
              onClick={() => update('destinationCountryCode', c.code)}
              className={`relative rounded-2xl overflow-hidden aspect-[3/2] group transition ${
                selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950' : ''
              }`}
            >
              {v ? (
                <img
                  src={v.fallbackImage}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <div className="text-lg">{c.flag}</div>
                <div className="text-[11px] font-semibold text-white leading-tight">{c.name}</div>
              </div>
              {selected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 drop-shadow" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected destination info */}
      {selectedCountry && visual && (
        <AnimatePresence mode="wait">
          <motion.div
            key={form.destinationCountryCode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex items-center gap-4"
          >
            <span className="text-3xl">{selectedCountry.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white">{visual.destinationTitle}</div>
              <div className="text-xs text-slate-400 truncate">{visual.destinationTagline}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-mono text-blue-300">{selectedCountry.currency}</div>
              <div className="text-[10px] text-slate-500">{visual.capitalCity}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 3: PURPOSE
// ─────────────────────────────────────────────────────────────
function StepPurpose({
  form, errors, update,
}: {
  form: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  update: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void;
}) {
  const purposes = PURPOSES_BY_IDENTITY[form.identity] ?? PURPOSES_BY_IDENTITY['OTHER'];
  const identity = IDENTITIES.find((id) => id.value === form.identity);
  const destCountry = COUNTRY_LIST.find((c) => c.code === form.destinationCountryCode);

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-black text-white mb-2">What is your purpose?</h2>
      <p className="text-slate-400 text-sm mb-2">
        As <span className="text-white font-semibold">{identity?.label ?? 'a traveller'}</span> travelling to{' '}
        <span className="text-white font-semibold">{destCountry?.name ?? 'your destination'}</span>, what brings you there?
      </p>
      {errors.purpose && <p className="text-rose-400 text-xs mb-3">{errors.purpose}</p>}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {purposes.map((p) => {
          const selected = form.purpose === p.value;
          return (
            <button
              key={`${p.value}-${p.label}`}
              type="button"
              onClick={() => update('purpose', p.value)}
              className={`p-4 rounded-2xl border text-left transition ${
                selected
                  ? 'bg-blue-950/80 border-blue-500 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="text-2xl mb-2">{p.emoji}</div>
              <div className={`text-sm font-semibold ${selected ? 'text-blue-300' : 'text-white'}`}>{p.label}</div>
              {selected && <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 4: TRAVEL DETAILS (name, email, date, duration, prefs)
// ─────────────────────────────────────────────────────────────
function StepTravelDetails({
  form, errors, update,
}: {
  form: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  update: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void;
}) {
  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-black text-white mb-2">Your travel details</h2>
      <p className="text-slate-400 text-sm mb-8">
        A few more details to complete your personalised VAYURA profile.
      </p>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Your full name"
            placeholder="e.g. Priya Sharma"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expected arrival date"
            type="date"
            value={form.arrivalDate}
            onChange={(e) => update('arrivalDate', e.target.value)}
            error={errors.arrivalDate}
          />
          <Input
            label="Duration of stay (days)"
            type="number"
            min={1}
            max={3650}
            value={form.lengthOfStayDays}
            onChange={(e) => update('lengthOfStayDays', Number(e.target.value))}
            error={errors.lengthOfStayDays as string | undefined}
            hint="Approximate is fine"
          />
        </div>
        <Select
          label="Preferred language"
          value={form.preferredLanguage}
          onChange={(e) => update('preferredLanguage', e.target.value)}
          options={[
            { value: 'en', label: '🇬🇧 English' },
            { value: 'hi', label: '🇮🇳 Hindi' },
            { value: 'ko', label: '🇰🇷 Korean' },
            { value: 'ja', label: '🇯🇵 Japanese' },
            { value: 'de', label: '🇩🇪 German' },
            { value: 'ar', label: '🇦🇪 Arabic' },
            { value: 'zh', label: '🇨🇳 Chinese' },
            { value: 'fr', label: '🇫🇷 French' },
          ]}
        />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Any specific preferences? <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
            placeholder="e.g. Budget accommodation, arriving alone, vegetarian diet preferences..."
            value={form.preferences ?? ''}
            onChange={(e) => update('preferences', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 5: BUDGET
// ─────────────────────────────────────────────────────────────
function StepBudget({
  form, errors, update,
}: {
  form: OnboardingFormData;
  errors: Partial<Record<keyof OnboardingFormData, string>>;
  update: <K extends keyof OnboardingFormData>(k: K, v: OnboardingFormData[K]) => void;
}) {
  const destCountry = COUNTRY_LIST.find((c) => c.code === form.destinationCountryCode);
  const identity = IDENTITIES.find((id) => id.value === form.identity);

  const QUICK_BUDGETS = [
    { label: 'Budget', amount: 1500, suffix: 'USD' },
    { label: 'Comfortable', amount: 3500, suffix: 'USD' },
    { label: 'Premium', amount: 7000, suffix: 'USD' },
    { label: 'Luxury', amount: 15000, suffix: 'USD' },
  ];

  const currencies = [
    { value: 'USD', label: '$ US Dollar' },
    { value: 'EUR', label: '€ Euro' },
    { value: 'GBP', label: '£ British Pound' },
    { value: 'INR', label: '₹ Indian Rupee' },
    { value: 'KRW', label: '₩ Korean Won' },
    { value: 'JPY', label: '¥ Japanese Yen' },
    { value: 'AED', label: 'AED UAE Dirham' },
    { value: 'SGD', label: 'S$ Singapore Dollar' },
  ];

  return (
    <div className="max-w-lg">
      <h2 className="text-3xl font-black text-white mb-2">Your budget</h2>
      <p className="text-slate-400 text-sm mb-6">
        Set your total budget for this journey. VAYURA will create a country-aware expense breakdown automatically.
      </p>

      {destCountry && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 mb-6">
          <span className="text-3xl">{destCountry.flag}</span>
          <div>
            <div className="text-sm font-bold text-white">{destCountry.name}</div>
            <div className="text-xs text-slate-400">Local currency: {destCountry.currency} ({destCountry.currencySymbol})</div>
          </div>
          <span className="ml-auto text-xs text-slate-500 italic">{identity?.label}</span>
        </div>
      )}

      {/* Quick select */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {QUICK_BUDGETS.map((b) => (
          <button
            key={b.label}
            onClick={() => { update('budgetAmount', b.amount); update('budgetCurrency', 'USD'); }}
            className={`p-3 rounded-xl border text-center transition ${
              form.budgetAmount === b.amount && form.budgetCurrency === 'USD'
                ? 'bg-blue-950 border-blue-500 text-blue-200'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <div className="text-xs font-bold text-white">${b.amount.toLocaleString()}</div>
            <div className="text-[10px] mt-0.5">{b.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Total budget amount"
          type="number"
          min={0}
          value={form.budgetAmount}
          onChange={(e) => update('budgetAmount', Number(e.target.value))}
          error={errors.budgetAmount}
        />
        <Select
          label="Currency"
          value={form.budgetCurrency}
          onChange={(e) => update('budgetCurrency', e.target.value)}
          options={currencies}
        />
      </div>

      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-400">
        ⚠️ Budget estimates are illustrative only. VAYURA does not provide financial advice.
        Actual costs vary by lifestyle, location and individual circumstances.
      </div>
    </div>
  );
}
