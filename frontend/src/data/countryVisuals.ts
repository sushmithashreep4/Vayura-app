// ============================================================
// VAYURA — Country Visual Configuration & Media Registry
// Unique, high-definition cinematic visual configurations
// for every supported destination country.
// ============================================================

export interface AccentTheme {
  primary: string;       // Tailwind color or hex
  primaryHex: string;
  accentHex: string;
  bgGlow: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface CountryVisualConfig {
  countryCode: string;
  countryName: string;
  nativeName: string;
  flag: string;
  destinationTitle: string;
  destinationTagline: string;
  destinationDescription: string;
  heroVideo: string;
  heroVideoBackup: string;
  fallbackImage: string;
  accentTheme: AccentTheme;
  landmarks: string[];
  localCurrency: string;
  localCurrencySymbol: string;
  callingCode: string;
  timezone: string;
  capitalCity: string;
  culturalHighlights: string[];
}

export const COUNTRY_VISUALS: Record<string, CountryVisualConfig> = {
  KR: {
    countryCode: 'KR',
    countryName: 'South Korea',
    nativeName: '대한민국',
    flag: '🇰🇷',
    destinationTitle: 'Seoul & Beyond',
    destinationTagline: 'Dynamic innovation, hyper-connected lifestyle & world-class education',
    destinationDescription: 'From the neon avenues of Gangnam and historic palaces of Jongno to high-tech universities and ultra-fast 5G networks, South Korea is one of the world\'s most digitally sophisticated societies.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-seoul-city-night-traffic-4581/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-seoul-city-skyline-at-night-42866-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'indigo-500',
      primaryHex: '#6366f1',
      accentHex: '#06b6d4',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'border-indigo-500/30',
      badgeBg: 'bg-indigo-950/70',
      badgeText: 'text-indigo-300',
      gradientFrom: 'from-indigo-600',
      gradientTo: 'to-cyan-500',
    },
    landmarks: ['N Seoul Tower', 'Bukchon Hanok Village', 'Han River Park', 'Gangnam District', 'Hongdae University Zone'],
    localCurrency: 'KRW',
    localCurrencySymbol: '₩',
    callingCode: '+82',
    timezone: 'Asia/Seoul (KST)',
    capitalCity: 'Seoul',
    culturalHighlights: ['T-Money universal mobility', 'B-Mart 30-min grocery delivery', 'Alien Registration (HiKorea)', 'Fast-paced campus culture'],
  },

  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    nativeName: '日本',
    flag: '🇯🇵',
    destinationTitle: 'Tokyo & Metropolitan Japan',
    destinationTagline: 'Flawless precision, timeless tradition & unmatched urban mobility',
    destinationDescription: 'A harmonious blend of cutting-edge robotics, high-speed Shinkansen transit, world-renowned culinary mastery, and meticulous civic harmony.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-tokyo-traffic-at-night-5321/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-tokyo-shinjuku-crossing-41553-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'rose-500',
      primaryHex: '#f43f5e',
      accentHex: '#fb7185',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-950/70',
      badgeText: 'text-rose-300',
      gradientFrom: 'from-rose-600',
      gradientTo: 'to-amber-500',
    },
    landmarks: ['Shibuya Crossing', 'Tokyo Skytree', 'Mount Fuji', 'Shinjuku Gyoen', 'Akihabara Tech Hub'],
    localCurrency: 'JPY',
    localCurrencySymbol: '¥',
    callingCode: '+81',
    timezone: 'Asia/Tokyo (JST)',
    capitalCity: 'Tokyo',
    culturalHighlights: ['Suica & Pasmo contactless transit', 'Konbini 24/7 lifestyle ecosystem', 'English Navitime transit', 'Respectful quiet civic etiquette'],
  },

  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    destinationTitle: 'Berlin & Central Europe',
    destinationTagline: 'Engineering powerhouse, academic excellence & European connectivity',
    destinationDescription: 'Europe\'s strongest economy offering tuition-free higher education, progressive green mobility, rich historical culture, and thriving startup ecosystems.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-berlin-city-and-tv-tower-3498/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-berlin-city-center-with-tv-tower-42867-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'amber-500',
      primaryHex: '#f59e0b',
      accentHex: '#d97706',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-amber-500/30',
      badgeBg: 'bg-amber-950/70',
      badgeText: 'text-amber-300',
      gradientFrom: 'from-amber-600',
      gradientTo: 'to-yellow-500',
    },
    landmarks: ['Brandenburg Gate', 'Berlin TV Tower (Fernsehturm)', 'Museum Island', 'Neuschwanstein Castle', 'Munich Marienplatz'],
    localCurrency: 'EUR',
    localCurrencySymbol: '€',
    callingCode: '+49',
    timezone: 'Europe/Berlin (CET)',
    capitalCity: 'Berlin',
    culturalHighlights: ['Deutschland-Ticket €49/mo pass', 'City registration (Anmeldung)', 'Public healthcare coverage', 'Recycling & Sunday quiet rest laws'],
  },

  SG: {
    countryCode: 'SG',
    countryName: 'Singapore',
    nativeName: 'Singapura',
    flag: '🇸🇬',
    destinationTitle: 'The Garden City of Asia',
    destinationTagline: 'Global finance, biometric infrastructure & immaculate smart city living',
    destinationDescription: 'A pinnacle of safety, global trade, and cosmopolitan multiculturalism. Where future-forward architecture meets lush tropical rainforest parks.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-singapore-skyline-and-marina-bay-sands-5124/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-singapore-marina-bay-sands-at-dusk-42868-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'emerald-500',
      primaryHex: '#10b981',
      accentHex: '#14b8a6',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'border-emerald-500/30',
      badgeBg: 'bg-emerald-950/70',
      badgeText: 'text-emerald-300',
      gradientFrom: 'from-emerald-600',
      gradientTo: 'to-teal-500',
    },
    landmarks: ['Marina Bay Sands', 'Gardens by the Bay', 'Jewel Changi Airport', 'Sentosa Island', 'Chinatown & Little India'],
    localCurrency: 'SGD',
    localCurrencySymbol: 'S$',
    callingCode: '+65',
    timezone: 'Asia/Singapore (SGT)',
    capitalCity: 'Singapore',
    culturalHighlights: ['EZ-Link & SimplyGo transit', 'Hawker culture UNESCO dining', 'Singpass digital governance', 'Zero tolerance for street litter'],
  },

  AE: {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    nativeName: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    destinationTitle: 'Dubai & The Emirates',
    destinationTagline: 'Bold futuristic ambition, world-class business hubs & luxury hospitality',
    destinationDescription: 'The crossroad of global trade connecting East and West. Home to the world\'s tallest architectural marvels, tax-friendly business freezones, and premier global living.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-dubai-skyline-with-burj-khalifa-4932/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-dubai-downtown-skyline-at-night-42869-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'yellow-500',
      primaryHex: '#eab308',
      accentHex: '#ca8a04',
      bgGlow: 'rgba(234, 179, 8, 0.15)',
      borderColor: 'border-yellow-500/30',
      badgeBg: 'bg-yellow-950/70',
      badgeText: 'text-yellow-300',
      gradientFrom: 'from-yellow-600',
      gradientTo: 'to-amber-500',
    },
    landmarks: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall & Fountain', 'Sheikh Zayed Grand Mosque', 'Museum of the Future'],
    localCurrency: 'AED',
    localCurrencySymbol: 'AED',
    callingCode: '+971',
    timezone: 'Asia/Dubai (GST)',
    capitalCity: 'Abu Dhabi',
    culturalHighlights: ['NOL card for driverless metro', 'Emirates ID digital residency', 'Extensive English communication', 'World-class air-conditioned transit'],
  },

  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    destinationTitle: 'London & Great Britain',
    destinationTagline: 'Centuries of heritage, world-leading universities & vibrant global finance',
    destinationDescription: 'From historic Oxford and Cambridge colleges to the international financial capitals of London and Edinburgh, the UK remains a premier global destination for scholars, founders, and professionals.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-london-tower-bridge-traffic-3871/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-london-city-skyline-41555-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'sky-500',
      primaryHex: '#0284c7',
      accentHex: '#0369a1',
      bgGlow: 'rgba(2, 132, 199, 0.15)',
      borderColor: 'border-sky-500/30',
      badgeBg: 'bg-sky-950/70',
      badgeText: 'text-sky-300',
      gradientFrom: 'from-sky-600',
      gradientTo: 'to-blue-600',
    },
    landmarks: ['Tower Bridge', 'Big Ben & Palace of Westminster', 'The Shard', 'British Museum', 'Edinburgh Castle'],
    localCurrency: 'GBP',
    localCurrencySymbol: '£',
    callingCode: '+44',
    timezone: 'Europe/London (GMT/BST)',
    capitalCity: 'London',
    culturalHighlights: ['London Underground Oyster card', 'NHS free emergency care triage', 'Contactless card ubiquity', 'Rich public library network'],
  },

  US: {
    countryCode: 'US',
    countryName: 'United States',
    nativeName: 'United States of America',
    flag: '🇺🇸',
    destinationTitle: 'New York & The United States',
    destinationTagline: 'Unbounded opportunity, technological frontier & dynamic diversity',
    destinationDescription: 'The global capital of technology innovation, Ivy League research universities, capital markets, and diverse metropolitan cultures from coast to coast.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-new-york-city-manhattan-skyline-4299/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-new-york-city-traffic-and-skyscrapers-41552-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'blue-500',
      primaryHex: '#3b82f6',
      accentHex: '#2563eb',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'border-blue-500/30',
      badgeBg: 'bg-blue-950/70',
      badgeText: 'text-blue-300',
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-indigo-600',
    },
    landmarks: ['Manhattan Skyline', 'Statue of Liberty', 'Central Park', 'Golden Gate Bridge', 'Times Square'],
    localCurrency: 'USD',
    localCurrencySymbol: '$',
    callingCode: '+1',
    timezone: 'America/New_York (EST)',
    capitalCity: 'Washington D.C.',
    culturalHighlights: ['MTA contactless OMNY subway', 'Social Security & bank account prep', '24/7 retail convenience', 'Tipping standards (15-20%)'],
  },

  IN: {
    countryCode: 'IN',
    countryName: 'India',
    nativeName: 'भारत',
    flag: '🇮🇳',
    destinationTitle: 'Mumbai & Digital India',
    destinationTagline: 'Vibrant cultural tapestry, digital public infrastructure & booming tech hubs',
    destinationDescription: 'The world\'s fastest-growing major economy, driven by world-leading UPI digital payments, renowned academic institutions, and unmatched cultural dynamism.',
    heroVideo: 'https://cdn.coverr.co/videos/coverr-mumbai-marine-drive-traffic-night-5412/1080p.mp4',
    heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-mumbai-bandra-worli-sea-link-42870-large.mp4',
    fallbackImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2000&q=85',
    accentTheme: {
      primary: 'orange-500',
      primaryHex: '#f97316',
      accentHex: '#ea580c',
      bgGlow: 'rgba(249, 115, 22, 0.15)',
      borderColor: 'border-orange-500/30',
      badgeBg: 'bg-orange-950/70',
      badgeText: 'text-orange-300',
      gradientFrom: 'from-orange-600',
      gradientTo: 'to-amber-500',
    },
    landmarks: ['Gateway of India (Mumbai)', 'India Gate (New Delhi)', 'Taj Mahal', 'Marine Drive', 'Bengaluru Tech Corridor'],
    localCurrency: 'INR',
    localCurrencySymbol: '₹',
    callingCode: '+91',
    timezone: 'Asia/Kolkata (IST)',
    capitalCity: 'New Delhi',
    culturalHighlights: ['UPI contactless instant QR payments', 'Metro networks in 20+ cities', 'Warm and welcoming hospitality', 'Hyper-local grocery delivery'],
  },
};

// Global default visual for homepage before destination is chosen
export const GLOBAL_VISUAL: CountryVisualConfig = {
  countryCode: 'GLOBAL',
  countryName: 'Global Gateway',
  nativeName: 'VAYURA',
  flag: '🌐',
  destinationTitle: 'The Connected World',
  destinationTagline: 'Moving Across Borders. Arrive Connected.',
  destinationDescription: 'Your world connected through one intelligent platform. Seamlessly discover destinations, access verified local daily essentials, and manage international payments powered by PayPal.',
  heroVideo: 'https://cdn.coverr.co/videos/coverr-flying-above-the-clouds-at-sunset-5231/1080p.mp4',
  heroVideoBackup: 'https://assets.mixkit.co/videos/preview/mixkit-airplane-flying-over-clouds-during-sunset-41554-large.mp4',
  fallbackImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85',
  accentTheme: {
    primary: 'blue-500',
    primaryHex: '#0070ba', // PayPal signature blue
    accentHex: '#003087',
    bgGlow: 'rgba(0, 112, 186, 0.2)',
    borderColor: 'border-blue-500/30',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-cyan-500',
  },
  landmarks: ['Incheon', 'Haneda', 'Frankfurt', 'Changi', 'Dubai', 'Heathrow', 'JFK'],
  localCurrency: 'USD',
  localCurrencySymbol: '$',
  callingCode: '+',
  timezone: 'UTC',
  capitalCity: 'Global',
  culturalHighlights: ['Cross-border intelligence', 'PayPal Developer integration', 'Verified daily essentials', 'Context-aware AI assistance'],
};

export function getCountryVisual(code?: string): CountryVisualConfig {
  if (!code) return GLOBAL_VISUAL;
  return COUNTRY_VISUALS[code.toUpperCase()] ?? GLOBAL_VISUAL;
}

