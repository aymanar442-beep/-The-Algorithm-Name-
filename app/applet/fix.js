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
  console.log('Successfully updated ShaheenPayKernel.ts');
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
  console.log('Successfully updated ShaheenPayPalRevolution.tsx');
}
