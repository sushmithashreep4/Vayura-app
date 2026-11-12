import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Globe2, Brain, Shield, Zap,
  CheckCircle2, ChevronDown, Sparkles,
  CreditCard, Map, Play, Pause, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { COUNTRY_LIST } from '@/data/countries';
import { COUNTRY_VISUALS } from '@/data/countryVisuals';

const FEATURED_COUNTRIES = ['KR', 'JP', 'DE', 'SG', 'AE', 'GB', 'US', 'IN'];

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Global Companion',
    description: 'Context-aware AI that understands your destination, identity, purpose and budget — giving you relevant guidance at every step.',
    color: 'text-blue-400',
    bg: 'bg-blue-950/50 border-blue-800/40',
  },
  {
    icon: Map,
    title: 'Country-Specific Daily Apps',
    description: 'Automatically surfaces the right apps for your exact destination — from KakaoMap in Seoul to DB Navigator in Berlin.',
    color: 'text-teal-400',
    bg: 'bg-teal-950/50 border-teal-800/40',
  },
  {
    icon: CheckCircle2,
    title: 'Arrival Autopilot',
    description: 'Personalised arrival checklists with readiness scoring. Know exactly what to do before and after landing.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/50 border-emerald-800/40',
  },
  {
    icon: Zap,
    title: 'Smart Budget Intelligence',
    description: 'Country-aware expense planning with real breakdowns, spending alerts and AI-powered recommendations.',
    color: 'text-amber-400',
    bg: 'bg-amber-950/50 border-amber-800/40',
  },
  {
    icon: CreditCard,
    title: 'PayPal-Powered Payments',
    description: 'Pay for verified local services — transit passes, eSIMs, accommodation — directly through PayPal. No surprises.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/50 border-indigo-800/40',
  },
  {
    icon: Shield,
    title: 'Verified, Trustworthy Data',
    description: 'Every service is clearly labelled: Official Government, Government-Licensed, or Verified Commercial.',
    color: 'text-rose-400',
    bg: 'bg-rose-950/50 border-rose-800/40',
  },
];

const IDENTITY_PREVIEWS = [
  { emoji: '🎓', label: 'International Student', country: 'South Korea', purpose: 'Higher Education', color: 'from-blue-600 to-indigo-700' },
  { emoji: '💼', label: 'Working Professional', country: 'Germany', purpose: 'Employment', color: 'from-emerald-600 to-teal-700' },
  { emoji: '✈️', label: 'Tourist', country: 'Japan', purpose: 'Holiday', color: 'from-rose-600 to-pink-700' },
  { emoji: '💻', label: 'Digital Nomad', country: 'Singapore', purpose: 'Remote Work', color: 'from-amber-600 to-orange-700' },
];

// Rotating countries for hero background
const HERO_ROTATION = ['KR', 'JP', 'DE', 'SG', 'GB', 'AE', 'US', 'IN'];

export function LandingPage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const currentCode = HERO_ROTATION[heroIndex];
  const currentVisual = COUNTRY_VISUALS[currentCode] ?? COUNTRY_VISUALS['KR'];

  // Rotate hero country every 8s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_ROTATION.length);
      setVideoError(false);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ═══════════════════════════════════════════
          CINEMATIC HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden flex flex-col">
        {/* Video / Fallback background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCode}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {!videoError ? (
              <video
                key={currentVisual.heroVideo}
                src={currentVisual.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
              />
            ) : (
              <img
                src={currentVisual.fallbackImage}
                alt={currentVisual.countryName}
                className="w-full h-full object-cover"
              />
            )}
            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Navbar */}
        <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wide text-white">VAYURA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="hidden sm:block text-sm text-slate-300 hover:text-white transition font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition shadow-lg"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-24">
          {/* Country indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="text-2xl">{currentVisual.flag}</span>
              <span className="text-sm font-semibold text-white/80 tracking-wide">{currentVisual.countryName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-xs text-emerald-300 font-medium">Live Destination Preview</span>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI-Powered · PayPal Integrated · 8 Countries · Built for Real Life
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              Moving Across
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-300 to-emerald-300">
                Borders.
              </span>
              <br />
              Arrive Connected.
            </h1>

            <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Your intelligent global lifestyle companion. Discover local apps, manage your budget, track arrival tasks and pay for services — all personalised to your identity and destination.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-slate-100 transition shadow-2xl"
              >
                Start My Journey
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition"
              >
                See How It Works
              </button>
            </div>
          </motion.div>

          {/* Video controls */}
          <div className="absolute bottom-8 right-6 sm:right-10 flex items-center gap-3">
            {/* Country dots */}
            <div className="flex items-center gap-1.5">
              {HERO_ROTATION.map((code, i) => (
                <button
                  key={code}
                  onClick={() => { setHeroIndex(i); setVideoError(false); }}
                  className={`transition-all rounded-full ${
                    i === heroIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 z-10"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          IDENTITY SELECTOR PREVIEW
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-semibold mb-4">
              Personalised for You
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Built for every reason you travel
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Your experience adapts based on who you are, where you're going and why you're going there.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IDENTITY_PREVIEWS.map((identity, i) => (
              <motion.div
                key={identity.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/onboarding')}
                className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 cursor-pointer transition group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${identity.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="text-4xl mb-3">{identity.emoji}</div>
                <div className="font-bold text-white text-sm mb-1">{identity.label}</div>
                <div className="text-xs text-slate-500">
                  {identity.country} · {identity.purpose}
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* All identities */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Business Traveller', 'Job Seeker', 'Exchange Student', 'Relocating with Family', 'Other'].map((id) => (
              <button
                key={id}
                onClick={() => navigate('/onboarding')}
                className="px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-medium hover:border-slate-500 hover:text-white transition"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DESTINATION PREVIEW GRID
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">8 Supported Countries</div>
              <h2 className="text-4xl font-bold text-white">
                Country-specific, day-one ready
              </h2>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Select your destination <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURED_COUNTRIES.map((code, i) => {
              const country = COUNTRY_LIST.find((c) => c.code === code);
              const visual = COUNTRY_VISUALS[code];
              if (!country || !visual) return null;
              return (
                <motion.div
                  key={code}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate('/onboarding')}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3]"
                >
                  <img
                    src={visual.fallbackImage}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-2xl mb-1">{country.flag}</div>
                    <div className="font-bold text-white text-sm">{country.name}</div>
                    <div className="text-xs text-slate-400">{country.currency} · {visual.capitalCity}</div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                    <div className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold">
                      Explore →
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3">Everything in one place</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Arrive with confidence
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Intelligent, country-aware tools built for the modern international traveller, student and professional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${f.bg} transition hover:scale-[1.02]`}
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 7 STEPS
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Your journey in minutes</h2>
            <p className="text-slate-400">Set up once. VAYURA personalises everything automatically.</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { n: '01', title: 'Who are you?', desc: 'Select your identity — International Student, Working Professional, Tourist, Digital Nomad and more.', emoji: '👤' },
              { n: '02', title: 'Where are you from?', desc: 'Your home country helps us personalise visa guidance, currency conversions and origin-specific tips.', emoji: '🏠' },
              { n: '03', title: 'Where are you going?', desc: 'Select your destination and watch the experience transform — unique video, local apps and country theme.', emoji: '🌍' },
              { n: '04', title: 'What is your purpose?', desc: 'Study, work, travel or relocate. Purpose-driven recommendations change everything you see.', emoji: '🎯' },
              { n: '05', title: 'Your travel details', desc: 'Arrival date, duration of stay, language preference and accommodation type.', emoji: '📅' },
              { n: '06', title: 'Set your budget', desc: 'AI-powered expense planning with country-aware breakdowns and PayPal integration.', emoji: '💰' },
              { n: '07', title: 'Your personalised dashboard', desc: 'Everything ready — local apps, arrival autopilot, AI companion, payments and more.', emoji: '🚀' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                  {step.emoji}
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-400 mb-0.5">STEP {step.n}</div>
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PAYPAL SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-300 text-xs font-semibold mb-5">
                <div className="w-4 h-4 rounded bg-[#003087] flex items-center justify-center text-[9px] font-bold text-white">P</div>
                PayPal Orders API v2
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Pay for real services,<br />right from VAYURA
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                VAYURA integrates PayPal Orders API v2 to let you pre-book verified arrival services — transit passes, eSIMs, accommodation bookings — with a single checkout. Every payment requires your explicit approval.
              </p>
              <div className="space-y-3">
                {[
                  'KT 5G eSIM (South Korea) · $28.00',
                  'T-Money Transit Pass · $18.00',
                  'AREX Airport Express · $9.50',
                  'BVG Deutschland-Ticket · $29.00',
                  'Suica Pass (Japan) · $22.00',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#003087] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PP</span>
                </div>
                <div>
                  <div className="font-bold text-white">VAYURA Checkout</div>
                  <div className="text-xs text-slate-400">Powered by PayPal · Sandbox</div>
                </div>
                <div className="ml-auto px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold">
                  Sandbox Active
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="text-sm text-slate-200">KT 5G eSIM — South Korea</div>
                  <div className="font-bold text-white">$28.00</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>PayPal Order Created</span>
                  <span className="text-blue-400 font-mono">3M4A2G...</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs text-slate-400">
                  <span>Customer Approved</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-semibold">Payment Captured ✓</span>
                  <span className="text-emerald-400 font-mono font-bold">$28.00 USD</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/onboarding')}
                className="w-full py-3 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Try the Full Checkout Experience
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-slate-900 to-indigo-950/30" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6">🌍</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">
              Wherever life takes you,<br />arrive connected.
            </h2>
            <p className="text-xl text-slate-400 mb-10">
              Join VAYURA and experience international arrival like it was meant to be.
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-slate-100 transition shadow-2xl mx-auto"
            >
              Start My Journey — It's Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/60 py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Globe2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">VAYURA</span>
              <span className="text-slate-600">· Global Arrival Companion</span>
            </div>
            <div className="text-sm text-slate-500">
              Built for the global traveller · PayPal Integration · AI-Powered · Hackathon Edition
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800/60 text-xs text-slate-600 text-center">
            VAYURA is a demonstration platform. All service information is sourced from official providers.
            PayPal integration uses Sandbox credentials for demonstration. Verification status is clearly labelled.
          </div>
        </div>
      </footer>
    </div>
  );
}
