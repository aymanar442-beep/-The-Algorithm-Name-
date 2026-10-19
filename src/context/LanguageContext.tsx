import React, { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'Shaheen S-AMI-METABOLIC v7.0-GOLD & PayPal Sovereign Revolution',
    tabPaypalShaheen: 'PayPal & Shaheen Core',
    tabDiscordHub: 'Discord Sovereign Hub',
    tabDashboard: 'Trading & Arbitrage',
    tabMarket: 'Market Radar',
    tabSignals: 'AI Signals',
    tabAgencies: 'Strategic Agencies',
    tabStaff: 'Support Desk',
    tabAcademy: 'Academy & Training',
    tabKnowledge: 'Knowledge Base',
    tabCommunity: 'Sovereign Community',
    tabAdmin: 'Admin Control',
    executiveReport: 'Executive Summary Report',
    downloadPdf: 'Download Executive PDF',
    countryRegion: 'Country / Region:',
    securityHardness: 'Security Hardness Rating',
    latency: 'Latency',
    nodeCount: 'Node Count',
    projectedFinancialImpact: 'Projected Financial Impact',
    switchLanguage: 'Language',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  dir: 'ltr',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language] = useState<Language>('en');
  const dir = 'ltr';

  useEffect(() => {
    localStorage.setItem('shaheen_lang', 'en');
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  const setLanguage = (_lang: Language) => {};

  const t = (key: string): string => {
    return translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className="font-sans">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSwitcher: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold shadow-md">
      <Globe size={14} className="text-cyan-400" />
      <span className="opacity-90">Sovereign Mode: 100% Professional English (Jury Edition)</span>
    </div>
  );
};
