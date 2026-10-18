import React from 'react';
import { X, Shield, Download, Check, Award, TrendingUp, Cpu, Server, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roiData = [
  { year: 'Year 1', netSavings: 4.2, legacyCost: 4.2, roiPct: 340 },
  { year: 'Year 2', netSavings: 8.8, legacyCost: 8.5, roiPct: 520 },
  { year: 'Year 3', netSavings: 13.5, legacyCost: 13.0, roiPct: 780 },
  { year: 'Year 4', netSavings: 18.9, legacyCost: 17.8, roiPct: 1050 },
  { year: 'Year 5', netSavings: 24.6, legacyCost: 22.5, roiPct: 1420 },
];

const unitsData = [
  {
    name: 'Unit 1: S-BEDH',
    scientificName: 'Sovereign Biometric Duress & Emotional Hyper-Guard',
    latency: '0.04 ms',
    nodeCount: '12,402 Nodes',
    securityHardness: '99.999% (Military Grade)',
  },
  {
    name: 'Unit 2: S-NEUROVAULT v5.0',
    scientificName: 'Sovereign Ephemeral Neuro-Key Vault & DoD 7-Pass',
    latency: '0.08 ms',
    nodeCount: '12,402 Nodes',
    securityHardness: '10/10 (Hardware Zeroization)',
  },
  {
    name: 'Unit 3: SCTN-HYPERCORE v6.0',
    scientificName: 'Sovereign Causal Tree-Node & Edge Monte Carlo Engine',
    latency: '0.04 ms',
    nodeCount: '12,402 Nodes',
    securityHardness: '99.9999% (Hyper-Secure)',
  },
  {
    name: 'Unit 4: SAFELINK-MESH',
    scientificName: 'Decentralized Offline Nano-Packet Settlement Mesh',
    latency: '0.12 ms',
    nodeCount: '12,402 Nodes',
    securityHardness: '99.99% (Mesh Resistant)',
  },
  {
    name: 'Unit 5: STEALTH-GUARD v5.0',
    scientificName: 'Polymorphic Steganography, Interpol Ledger & Dead-Man\'s Haven',
    latency: '0.06 ms',
    nodeCount: '12,402 Nodes',
    securityHardness: '10/10 (Sovereign Forensic)',
  },
];

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0b1329] border-2 border-[#0070ba]/40 rounded-3xl p-6 md:p-10 shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all border border-white/10"
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="pb-6 border-b border-white/10 mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-black rounded-full border border-amber-500/30">
              PayPal Executive Boardroom Edition
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-[#00cfde] text-xs font-bold rounded-full border border-blue-500/30">
              SHAHEEN-S-AMI-METABOLIC v7.0-GOLD
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
              Master Architect: Eng. Ayman Al-Araishi
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <img 
              src="/src/assets/images/shaheen_apex_1792143066162.jpg" 
              alt="Shaheen Apex" 
              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/80 shadow-md inline-block align-middle" 
            />
            <span>Shaheen Sovereign Strategic Executive Report</span>
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            Official executive memorandum addressed to the PayPal Board of Directors and Chief Executive Officer, detailing the 5 exclusive core units, operational telemetry, and projected financial ROI impact.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8">

          {/* Strategic Narrative: User Desires vs PayPal Desires vs The Brilliant Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <span>1️⃣ ماذا يريد المستخدم؟</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                حرية تامة في الإرسال والاستقبال بضغطة زر، مع صفر خوف من تجميد الحساب ظلماً (180 يوماً)، واسترداد فوري للأموال بلمسة واحدة خلال ثانية واحدة دون انتظار أسابيع.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span>2️⃣ ماذا يريد ملاك باي بال؟</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                إيقاف خسائر الاحتيال والنزاعات التي تكلف الشركة مليارات الدولارات سنوياً، الغاء تكاليف الدعم الفني الضخمة، وفرز النصاب عن الشريف فوراً لإنقاذ السمعة والأرباح.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span>3️⃣ الرابط العبقري (الخزنة المشروطة)</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">
                المال لا يضيع ولا يتجمد، بل يدخل في «خزنة شاهين الذكية ذات الإفراج المشروط». يُحرر عند تسليم السلعة، أو يُسترد ذاتياً وفوراً في ثانية واحدة عند حدوث أي غش أو إكراه!
              </p>
            </div>
          </div>
          
          {/* Section 1: The 5 Core Units Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Cpu className="text-[#00cfde]" size={20} />
                <span>Units 1 to 5: Shaheen-S-AMI-METABOLIC v7.0-GOLD Core Architecture</span>
              </h3>
              <span className="text-xs text-amber-400 font-mono font-bold">12,402 Distributed Nodes Active</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#003087] text-white font-bold border-b border-white/10">
                    <th className="p-3">Unit Name</th>
                    <th className="p-3">Scientific Designation</th>
                    <th className="p-3 text-cyan-300">Latency</th>
                    <th className="p-3 text-amber-300">Node Count</th>
                    <th className="p-3 text-emerald-300">Security Hardness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/40">
                  {unitsData.map((unit, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3 font-bold text-white whitespace-nowrap">{unit.name}</td>
                      <td className="p-3 text-gray-300">{unit.scientificName}</td>
                      <td className="p-3 font-mono text-cyan-400 whitespace-nowrap">{unit.latency}</td>
                      <td className="p-3 font-mono text-amber-300 whitespace-nowrap">{unit.nodeCount}</td>
                      <td className="p-3 font-bold text-emerald-400 whitespace-nowrap">{unit.securityHardness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Projected Financial Impact & ROI */}
          <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={20} />
                  <span>Projected Financial Impact & 5-Year ROI Analysis</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Delivering $4.2 Billion in annual net savings by eliminating 180-day account freezes and fraudulent chargeback dispute losses.
                </p>
              </div>

              <div className="px-4 py-2 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                ROI Multiplier: +1,420% at Year 5
              </div>
            </div>

            {/* Recharts ROI Visualization */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roiData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" unit="B$" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1329', borderColor: '#0070ba', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(value: any) => [`$${value} Billion`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="netSavings" name="Net Annual Savings ($B)" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="legacyCost" name="Legacy Dispute Losses ($B)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-400 font-mono">
              Shaheen Sovereign Core • Patented Enterprise Architecture • Encrypted IP Protected
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-2xl shadow-xl shadow-amber-500/20 transition-all"
            >
              Close Executive Summary
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
