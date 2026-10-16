import React, { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
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
  },
  ar: {
    appTitle: 'نظام شاهين S-AMI-METABOLIC v7.0-GOLD وثورة بايبال السيادية',
    tabPaypalShaheen: 'باي بال وشاهين المركزي',
    tabDiscordHub: 'مركز ديسكورد السيادي',
    tabDashboard: 'التداول والتحكيم',
    tabMarket: 'رادار السوق',
    tabSignals: 'إشارات الذكاء الاصطناعي',
    tabAgencies: 'الوكالات الاستراتيجية',
    tabStaff: 'مكتب الدعم',
    tabAcademy: 'الأكاديمية والتدريب',
    tabKnowledge: 'قاعدة المعرفة',
    tabCommunity: 'المجتمع السيادي',
    tabAdmin: 'تحكم المشرف',
    executiveReport: 'تقرير الملخص التنفيذي',
    downloadPdf: 'تحميل التقرير التنفيذي PDF',
    countryRegion: 'الدولة / المنطقة:',
    securityHardness: 'تصنيف صلابة الأمان',
    latency: 'زمن الاستجابة',
    nodeCount: 'عدد العقد',
    projectedFinancialImpact: 'الأثر المالي المتوقع',
    switchLanguage: 'اللغة',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  dir: 'ltr',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('shaheen_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('shaheen_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className={dir === 'rtl' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold shadow-md">
      <Globe size={14} className="text-cyan-400" />
      <span className="opacity-90">Language:</span>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 rounded-md transition-all ${
          language === 'en'
            ? 'bg-[#003087] text-white font-black shadow'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        English
      </button>
      <span className="opacity-40">|</span>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-2 py-0.5 rounded-md transition-all ${
          language === 'ar'
            ? 'bg-[#003087] text-white font-black shadow'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        العربية
      </button>
    </div>
  );
};
