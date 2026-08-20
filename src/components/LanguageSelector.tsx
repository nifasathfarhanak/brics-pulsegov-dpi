import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Check, Search, Globe, ChevronDown, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'header';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'full' }) => {
  const { currentLanguage, setLanguage, currentLanguageInfo, allLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = allLanguages.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleSelectLanguage = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Group languages for organized UX
  const primaryLanguages = filteredLanguages.filter((l) => ['en', 'hi'].includes(l.code));
  const indianRegionalLanguages = filteredLanguages.filter((l) => 
    ['ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'or', 'ur', 'as', 'mai', 'sa'].includes(l.code)
  );
  const bricsGlobalLanguages = filteredLanguages.filter((l) => 
    !['en', 'hi', 'ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa', 'or', 'ur', 'as', 'mai', 'sa'].includes(l.code)
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <div className="flex items-center gap-1.5">
        {/* Quick 1-Click Toggle for English / Hindi / Current */}
        <div className="hidden sm:flex items-center bg-[#070F1E] p-0.5 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            id="quick-lang-en"
            onClick={() => handleSelectLanguage('en')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              currentLanguage === 'en'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            id="quick-lang-hi"
            onClick={() => handleSelectLanguage('hi')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${
              currentLanguage === 'hi'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Main 33-Language Dropdown Button */}
        <button
          type="button"
          id="global-language-selector-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-blue-500/40 hover:border-blue-400 text-xs font-semibold shadow-sm transition-all focus:outline-none"
        >
          <span className="text-sm">{currentLanguageInfo.regionFlag}</span>
          <span className="text-cyan-300 font-bold max-w-[90px] sm:max-w-[130px] truncate">
            {currentLanguageInfo.nativeName}
          </span>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            ({currentLanguageInfo.name})
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-blue-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Popup Menu (33 BRICS Languages) */}
      {isOpen && (
        <div 
          id="global-language-menu"
          className="fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 top-16 sm:top-auto sm:mt-2 max-w-[calc(100vw-16px)] sm:w-96 rounded-2xl bg-[#0B172E] border border-blue-500/40 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-800 bg-[#070F1E]/95 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                <Languages className="w-4 h-4 text-cyan-400" />
                <span>BRICS 33 Sovereign Languages</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                {allLanguages.length} Dialects
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                id="language-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search English, हिन्दी, தமிழ், 中文, Русский..."
                className="w-full bg-[#0A192F] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>
          </div>

          {/* Languages List Container with Scroll */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-3 divide-y divide-slate-800/80">
            
            {/* Primary / Core Section */}
            {primaryLanguages.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>National Default</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {primaryLanguages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        id={`select-lang-${lang.code}`}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{lang.regionFlag}</span>
                          <div className="truncate">
                            <div className="font-semibold leading-tight truncate">{lang.nativeName}</div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {lang.name}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Indian Regional Languages */}
            {indianRegionalLanguages.length > 0 && (
              <div className="space-y-1 pt-2">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <span>🇮🇳 Indian Regional Languages ({indianRegionalLanguages.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {indianRegionalLanguages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        id={`select-lang-${lang.code}`}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">{lang.regionFlag}</span>
                          <div className="truncate">
                            <div className="font-semibold leading-tight truncate">{lang.nativeName}</div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {lang.name}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Global BRICS Member Nations */}
            {bricsGlobalLanguages.length > 0 && (
              <div className="space-y-1 pt-2">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <span>🌍 BRICS Member Nations ({bricsGlobalLanguages.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {bricsGlobalLanguages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        id={`select-lang-${lang.code}`}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm">{lang.regionFlag}</span>
                          <div className="truncate">
                            <div className="font-semibold leading-tight truncate">{lang.nativeName}</div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {lang.name}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No languages found matching "{searchQuery}".
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="px-3 py-2 bg-[#070F1E] border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Powered by Gemini Multilingual AI</span>
            <span className="text-cyan-400 font-semibold">{currentLanguageInfo.nativeName} Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
