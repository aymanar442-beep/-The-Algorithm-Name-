const fs = require('fs');

// 1. ShaheenPayKernel.ts
let kernelPath = 'src/services/ShaheenPayKernel.ts';
if (fs.existsSync(kernelPath)) {
  let content = fs.readFileSync(kernelPath, 'utf8');
  content = content
    .replace("تم تفعيل التدمير الذاتي وتطهير الذاكرة وإسقاط الوثيقة في الدرج السري المشفر.", "Self-destruct activated, memory purged, and document dropped into encrypted secret drawer.")
    .replace("تم حقن العلامة المائية الصفرية وحماية السيناريو من التسريب بدقة جنائية.", "Zero-width watermark injected and scenario protected from leakage with forensic accuracy.")
    .replace("النظام مراقب عبر التوأم المعاكس للواقع.", "System monitored via counter-factual twin.")
    .replace("تم تأكيد انعدام المخاطر بنسبة 100% وجاهز للتنفيذ الفوري.", "100% zero-risk confirmed and ready for immediate execution.")
    .replace("تم بث البيانات عبر شبكة ميزانية مستقلة.", "Data broadcast over independent budget network.");
  fs.writeFileSync(kernelPath, content, 'utf8');
  console.log('Updated ShaheenPayKernel.ts');
}

// 2. ShaheenPayPalRevolution.tsx
let revPath = 'src/components/ShaheenPayPalRevolution.tsx';
if (fs.existsSync(revPath)) {
  let content = fs.readFileSync(revPath, 'utf8');
  content = content
    .replace("{lang === 'en' ? '🇬🇧 English (Switch to AR)' : '🇸🇦 العربية (Switch to EN)'}", "{'🇬🇧 English Sovereign UI'}")
    .replace("البنية المالية السيادية للمهندس", "Sovereign Financial Architecture by Eng.")
    .replace("أيمن العريشي", "Ayman Al-Araishi")
    .replace("تجمع بين محرك", "Combining")
    .replace("وخزنة", "and sovereign vault")
    .replace("المال لا يصل للنصاب ولا يتجمد 180 يوماً — بل يُعزل في خزنة مشفرة مع استرداد ذاتي في ثانية واحدة!", "Funds never reach fraudsters and never face 180-day freezes — isolated in encrypted escrow with 1-second self-reversal!")
    .replace("ابتكار يحل معضلة تسريب الوثائق البنكية عبر محارف يونيكود صفرية متبدلة غير مرئية تفلت من أي فلتر، مع بروتوكول تحوط فوري في 3 ثوانٍ لحماية رأس المال عند انقطاع الإنترنت.", "Innovation solving banking document leak dilemmas via dynamic invisible zero-width unicode characters escaping filters, with 3-second instant capital hedging during outages.")
    .replace("Algorithmic Phagocytosis (البلعمة الرقمية)", "Algorithmic Phagocytosis")
    .replace("بدلاً من طرد الهجمات السيبرانية (Firewall Drop) ليعود الهاكر غداً بسلاح مطور، تبتلع المنظومة الهجوم ككرات الدم البيضاء، وتهضمه لاستخلاص المصل المضاد (Anti-Venom) عبر 100,000 سيناريو، وتحول طاقته الحركية (+142%) إلى وقود وترقية فورية!", "Instead of dropping cyberattacks (Firewall Drop) for hackers to return tomorrow with improved weapons, the system engulfs attacks like white blood cells, digests them to extract anti-venom across 100,000 scenarios, and converts their kinetic energy (+142%) into fuel and instant upgrade!")
    .replace("The 4 Phases of Algorithmic Phagocytosis (البلعمة الرقمية)", "The 4 Phases of Algorithmic Phagocytosis");
  fs.writeFileSync(revPath, content, 'utf8');
  console.log('Updated ShaheenPayPalRevolution.tsx');
}

// 3. LanguageContext.tsx
let langPath = 'src/context/LanguageContext.tsx';
if (fs.existsSync(langPath)) {
  let content = `import React, { createContext, useContext, useState, useEffect } from 'react';
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
`;
  fs.writeFileSync(langPath, content, 'utf8');
  console.log('Updated LanguageContext.tsx to 100% English');
}
