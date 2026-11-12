import { useState } from 'react';
import { Phone, ExternalLink, Shield, AlertTriangle, Globe, Heart, RefreshCw, Hospital, HeartPulse } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getCountryVisual } from '@/data/countryVisuals';
import { DestinationSwitcherModal } from '@/components/destination/DestinationSwitcherModal';

export function EmergencyPage() {
  const { countryData, selectedDestinationCode, travelProfile } = useAppStore();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const currentCountryCode = selectedDestinationCode || travelProfile?.destinationCountryCode || countryData?.code || 'KR';
  const visual = getCountryVisual(currentCountryCode);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Verified Emergency Directory
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800">
              {visual.flag} {visual.countryName}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight flex items-center gap-2.5">
            <HeartPulse className="w-8 h-8 text-rose-500" />
            <span>Emergency Services & Local Support</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Official emergency hotlines, multilingual consular helplines, hospital triage, and verified government crisis portals for {visual.countryName}.
          </p>
        </div>

        <button
          onClick={() => setIsSwitcherOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Switch Country ({visual.flag})</span>
        </button>
      </div>

      {/* ── Prominent Emergency Dial Hotline Cards ── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-900/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Direct National Emergency Numbers</h2>
              <div className="text-xs text-rose-300/90">{visual.countryName} · Country Code {visual.callingCode}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
            Toll-Free & 24/7
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {(countryData?.emergencyContacts ?? [
            { service: 'Police', number: '112' },
            { service: 'Fire & Ambulance', number: '119' },
            { service: 'Foreign Helpline', number: '1345', notes: '24/7 Multilingual' },
            { service: 'Tourist Hotline', number: '1330', notes: 'Travel Emergency' },
          ]).map((ec) => (
            <a
              key={ec.service}
              href={`tel:${ec.number}`}
              className="p-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-rose-900/40 hover:border-rose-500/60 transition group text-center block"
            >
              <div className="text-3xl font-black text-white group-hover:text-rose-400 transition-colors font-mono">
                {ec.number}
              </div>
              <div className="text-xs font-semibold text-rose-300 mt-1">{ec.service}</div>
              {ec.notes && (
                <div className="text-[10px] text-slate-400 mt-0.5">{ec.notes}</div>
              )}
            </a>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Sourced from official government telecommunication directives. Local SIM cards and international roaming devices can dial these numbers without area codes.</span>
        </div>
      </div>

      {/* ── Official Government Portals ── */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">Official Government & Immigration Authorities</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(countryData?.governmentPortals ?? [
            { name: 'Hi Korea Portal', url: 'https://www.hikorea.go.kr', description: 'Official Immigration e-Application Authority', category: 'Immigration' },
            { name: 'Korea Tourism Organization', url: 'https://english.visitkorea.or.kr', description: 'Official national tourism authority', category: 'General' },
          ]).map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition flex items-center justify-between group"
            >
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {portal.category}
                </span>
                <div className="font-bold text-white text-sm mt-1 group-hover:text-blue-400 transition-colors">
                  {portal.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">
                  {portal.description}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Embassy & Healthcare Guide ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Healthcare & Hospital Access */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Hospital className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Hospital & Medical Care</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In {visual.countryName}, major university and metropolitan hospitals operate International Healthcare Centers with English-speaking physicians and translation staff.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Tips for Arriving Travellers:</div>
            <div>• Always carry your physical passport and proof of international travel health insurance.</div>
            <div>• Emergency rooms (ER) are open 24/7 across all metropolitan districts.</div>
          </div>
        </div>

        {/* Consular Registration */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Consular & Embassy Registration</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Register with your home country's embassy or consulate upon arrival in {visual.countryName}. This allows your diplomatic mission to reach you in emergencies or extreme weather.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-200">Recommended Portals:</div>
            <div>• US Citizens: STEP (Smart Traveler Enrollment Program)</div>
            <div>• Indian Citizens: MADAD / Consular Services Portal</div>
            <div>• EU / UK Citizens: Foreign Commonwealth & Development Office (FCDO)</div>
          </div>
        </div>
      </div>

      <DestinationSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
