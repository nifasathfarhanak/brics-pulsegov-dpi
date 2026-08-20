import React from 'react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { BRICSCountryId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Radio,
  Building2,
  Lock,
  ExternalLink
} from 'lucide-react';

interface SovereignBRICSFooterProps {
  selectedCountry: BRICSCountryId | 'all';
  onSelectCountry: (countryId: BRICSCountryId | 'all') => void;
  onNavigateToTab?: (tab: string) => void;
}

// Ordered strictly according to diplomatic BRICS member federation protocol:
// Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, UAE
const ORDERED_BRICS_IDS: BRICSCountryId[] = [
  'brazil',
  'russia',
  'india',
  'china',
  'south_africa',
  'egypt',
  'ethiopia',
  'iran',
  'saudi_arabia',
  'uae'
];

export const SovereignBRICSFooter: React.FC<SovereignBRICSFooterProps> = ({
  selectedCountry,
  onSelectCountry,
  onNavigateToTab,
}) => {
  const { t, currentLanguageInfo, adaptLanguageForCountry } = useLanguage();

  const handleCountryClick = (cId: BRICSCountryId | 'all') => {
    onSelectCountry(cId);
    if (cId !== 'all') {
      adaptLanguageForCountry(cId);
    }
  };

  const orderedCountries = ORDERED_BRICS_IDS
    .map(id => BRICS_COUNTRIES.find(c => c.id === id))
    .filter(Boolean);

  return (
    <footer className="bg-slate-50 border-t border-slate-300 mt-14 text-slate-700 text-xs">
      
      {/* Official BRICS Sovereign Member Flags Section */}
      <div className="border-b border-slate-200 py-7 px-3 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Official Diplomatic Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shadow-xs shrink-0" />
              <h3 className="text-xs uppercase font-bold tracking-widest text-blue-900 flex items-center gap-2">
                <span>Official BRICS Sovereign Member States</span>
                <span className="text-[10px] text-slate-500 font-normal font-mono">• 10 Nations Digital Public Federation</span>
              </h3>
            </div>
            
            <div className="flex items-center gap-3 text-[11px] text-slate-600">
              <button
                type="button"
                id="footer-flag-all"
                onClick={() => handleCountryClick('all')}
                className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCountry === 'all'
                    ? 'bg-blue-700 text-white border-blue-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>🌍</span>
                <span>All 10 Sovereign Nations</span>
              </button>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline text-[11px] text-slate-500 font-mono">
                Click any sovereign flag to synchronize regional feeds & 33-language models
              </span>
            </div>
          </div>

          {/* 10 BRICS National Flags in a Horizontal, Evenly Spaced Row */}
          <div className="grid grid-cols-2 xs:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3 w-full">
            {orderedCountries.map((country) => {
              if (!country) return null;
              const isSelected = selectedCountry === country.id;
              return (
                <button
                  key={country.id}
                  type="button"
                  id={`footer-flag-${country.id}`}
                  onClick={() => handleCountryClick(country.id)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-between group relative overflow-hidden min-h-[108px] cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-sm ring-2 ring-blue-500/30 transform scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-800 shadow-xs'
                  }`}
                  title={`${country.name} (${country.nativeName}) - Click to focus regional DPI`}
                >
                  {/* Flag Icon with Subtle Depth */}
                  <span className="text-3xl filter drop-shadow-xs group-hover:scale-110 transition-transform duration-200 select-none mb-1">
                    {country.flag}
                  </span>

                  {/* Nation Name */}
                  <div className="w-full">
                    <span className="text-xs font-bold leading-tight block truncate text-slate-900 group-hover:text-blue-700">
                      {country.name}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block truncate font-sans opacity-90 mt-0.5">
                      {country.nativeName}
                    </span>
                  </div>

                  {/* ISO Sovereign Code Badge */}
                  <div className="mt-1.5">
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                      isSelected 
                        ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:text-blue-700'
                    }`}>
                      {country.code}
                    </span>
                  </div>

                  {/* Active Indicator Top Light */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-xs animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Diplomatic Federation Strategic Architecture Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Platform & Sovereign Intelligence Hub */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 p-0.5 shadow-xs">
                <div className="w-full h-full bg-blue-700 rounded-[10px] flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">BRICS PulseGov DPI</span>
                <p className="text-[10px] text-blue-700 font-mono font-semibold">Sovereign AI Infrastructure</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decentralized Digital Public Infrastructure (DPI) uniting 10 sovereign member nations with real-time Gemini strategic intelligence, 33 native languages voice synthesis, and zero-debt open technology.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-blue-800 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dual-Verified SHA256 Audit Trail</span>
            </div>
          </div>

          {/* Col 2: Gemini Sovereign Voice Agent */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-blue-900 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-700" />
              <span>Sovereign Voice & Strategic Hub</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>33 BRICS & Regional Native Languages</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Zero-Debt Open Digital Public Goods (DPG)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Real-Time Multimodal Computer Vision Triage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>ISO-37120 Smart City Urgency Metric</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Zero-Debt Open DPG Rails */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-blue-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Open DPG Infrastructure Rails</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-600 shrink-0" />
                <span>MOSIP Sovereign Biometric Authentication</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-600 shrink-0" />
                <span>OpenG2P Direct Maintenance Settlement</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-600 shrink-0" />
                <span>JalSoochna Real-Time Water IoT Telemetry</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Beckn Unified Mobility Protocol</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Active Locale & Sovereign Scope */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-blue-900">
              Active Sovereign Session
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Territory Scope:</span>
                <span className="font-bold text-slate-900 truncate max-w-[140px] text-right">
                  {selectedCountry === 'all' ? 'All 10 BRICS Nations' : BRICS_COUNTRIES.find((c) => c.id === selectedCountry)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">UI & Voice Locale:</span>
                <span className="font-mono text-blue-800 font-bold">
                  {currentLanguageInfo.nativeName} ({currentLanguageInfo.code})
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Security Standard:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Zero-Backdoor RBAC
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Official Diplomatic Footer & Copyright Notice */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-semibold text-slate-900">© BRICS Digital Public Infrastructure</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-mono text-[11px]">Sovereign Interoperability Network</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Official Diplomatic Platform uniting Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, and UAE.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono text-slate-600">
            {orderedCountries.map((c) => (
              <span key={c?.id} className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 shadow-xs">
                {c?.flag} {c?.code}
              </span>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

