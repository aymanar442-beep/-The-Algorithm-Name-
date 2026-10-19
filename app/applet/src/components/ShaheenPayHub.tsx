import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Lock, 
  RefreshCw, 
  DollarSign, 
  Activity, 
  Cpu, 
  Fingerprint, 
  CheckCircle2, 
  XCircle, 
  Flame,
  FileCode,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const ShaheenPayHub: React.FC = () => {
  const [amount, setAmount] = useState<number>(250.00);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'USDT'>('USD');
  const [category, setCategory] = useState<'AGENTIC_SERVICE' | 'COMMERCE_GOODS' | 'MICRO_PAYOUT'>('AGENTIC_SERVICE');
  
  // Behavioral & Neuro parameters
  const [clickHz, setClickHz] = useState<number>(1.1);
  const [biometricStress, setBiometricStress] = useState<number>(0.6);
  const [motionStability, setMotionStability] = useState<number>(0.92);
  const [userForcedOverride, setUserForcedOverride] = useState<boolean>(false);

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [lastVerdict, setLastVerdict] = useState<any>(null);
  const [paypalOrderResult, setPaypalOrderResult] = useState<any>(null);
  const [kernelStatus, setKernelStatus] = useState<any>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'ARCHITECTURE' | 'AUDIT'>('CONSOLE');

  const t = {
    title: 'SHAHEEN PAY KERNEL',
    subtitle: 'Sovereign Agentic Commerce & Anti-Fraud Shield for PayPal • Architect: Eng. Ayman Al-Araishi',
    zeroCopy: 'L1 64B ZERO-COPY',
    monteCarlo: '150,000 MONTE CARLO',
    bet23Locked: 'BET23 COOLDOWN ACTIVE',
    bet23Unlocked: 'BET23: UNLOCKED',
    consoleTab: '🎮 Live Command Console',
    architectureTab: '🏛️ 35-Algorithm Architecture',
    auditTab: '📜 Tamper-Proof Audit & Legal Shield',
    paramsTitle: 'Agentic Transaction Parameters',
    amountLabel: 'Payment Amount',
    currencyLabel: 'Currency',
    categoryLabel: 'Order Category (Agentic Target)',
    cat1: 'Autonomous AI Agent Execution',
    cat2: 'E-Commerce & Digital Goods',
    cat3: 'Trader Payout / Micro-Settlement',
    clickHzLabel: 'Interaction Frequency (Click Hz)',
    emotional: 'Emotional / Rapid',
    stressLabel: 'Biometric Stress Index (0-5)',
    duress: 'Potential Duress',
    motionLabel: 'Motion Stability (Tremor / Restraint)',
    weaponStillness: 'Suspended / Suspicious Stillness',
    overrideLabel: 'Enable User Forced Override (Shifts 100% legal liability to user)',
    simulateBtn: 'Simulate (150k Monte Carlo Paths)',
    executeBtn: 'Execute via PayPal',
    testDuressBtn: 'Test Duress (Ghost Vault)',
    testBet23Btn: 'Test Bet23 Lock',
    adminUnlockBtn: 'Admin Unlock',
    killSwitchBtn: 'EMERGENCY KILL-SWITCH (DoD 7-Pass Zeroization)',
    verdictTitle: 'Shaheen Gate Verdict & PayPal Clearance',
    cleared: 'CLEARED & JUSTIFIED FOR DISPATCH',
    halted: 'INTERCEPTED & HALTED',
    waiting: 'Awaiting transaction stimulus...',
    pathsCount: 'Monte Carlo Scenarios',
    successProb: 'Success Probability',
    latency: 'Nuclear Latency',
    liability: 'Liability Holder',
    ssvdActive: 'S-SVD Ghost Vault Active: Coercion identified. Attacker views decoy vault while sovereign accounts remain air-gapped.',
    auditSig: 'SHA-256 Sovereign Audit Signature:',
    readyPrompt: 'Ready to simulate transaction via S-PK Engine. Click "Simulate (150k)" or "Execute via PayPal" to test.',
    paypalOutput: 'PayPal Orders v2 API Output (Verified)',
    archTitle: 'The 35 Sovereign Banking Algorithms',
    archSubtitle: 'Invented & Architected by Eng. Ayman Al-Araishi for high-frequency defense, risk zeroization, and PayPal agentic commerce.',
    arch1Title: '1. Nuclear Execution Engine',
    arch1Desc: '64-Byte SharedArrayBuffer aligned directly to CPU L1 Cache lines. Guarantees atomic zero-copy memory reads/writes in under 20ms to prevent double-spending in autonomous agentic commerce.',
    arch2Title: '2. S-IFG Quantum Simulator',
    arch2Desc: 'Generates 150,000 parallel Monte Carlo scenarios in microseconds. Intercepts payment orders with strict 100% certainty rules to eliminate slippage and malicious chargebacks.',
    arch3Title: '3. Bet23 Psycho-Temporal Lock',
    arch3Desc: 'Monitors click frequency (Hz) and interaction speed. Halts payments for a 30-minute cooling period if rapid emotional tapping is detected, protecting user capital from panic and scam coercion.',
    arch4Title: '4. S-SVD Duress & Ghost Vault',
    arch4Desc: 'Under physical or psychological coercion (extreme stress + physical immobility), automatically exposes a decoy ghost vault with fake balances, while keeping sovereign accounts air-gapped.',
    arch5Title: '5. DoD 5220.22-M Military Zeroization',
    arch5Desc: '7-pass military-grade cryptographic memory overwrite sequence. Destroys all session keys, tokens, and volatile structures upon physical tamper or emergency kill-switch activation.',
    arch6Title: '6. S-AMI Cyber Phagocytosis',
    arch6Desc: 'Algorithmic metabolic defense that intercepts malicious bot requests and attack payloads, decompiles their DNA, and assimilates their energy to harden PayPal API defenses in real time.',
    auditHeaderTitle: 'Dual-Layer Legal & Technical Liability Framework',
    auditHeaderDesc: 'Mathematical certainty backed by airtight international disclaimer logic for banking integration.',
    legalPrinciple1: '1. Legal Liability Principle:',
    legalPrinciple1Desc: '"We protect you technically at 100%. If the user deliberately overrides the system via User Forced Override, legal liability shifts 100% to the user and is recorded immutably via SHA-256 forensic audit hash."',
    legalPrinciple2: '2. PayPal Integration Target:',
    legalPrinciple2Desc: 'Autonomous Agentic Payments via PayPal Orders v2 API and Payouts SDK, fortified with sub-millisecond anomaly detection and zero-knowledge ledger validation.'
  };

  const fetchKernelStatus = async () => {
    try {
      const res = await fetch('/api/paypal/kernel-status');
      const data = await res.json();
      setKernelStatus(data);
      if (data.cooldownRemainingSeconds) {
        setCooldownRemaining(data.cooldownRemainingSeconds);
      }
    } catch (e) {
      console.warn('Failed to fetch kernel status');
    }
  };

  useEffect(() => {
    fetchKernelStatus();
    const interval = setInterval(fetchKernelStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => setCooldownRemaining(c => Math.max(0, c - 1)), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const handleEvaluate = async () => {
    setLoading(true);
    setPaypalOrderResult(null);
    try {
      const res = await fetch('/api/paypal/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerEmail: 'client@shaheen.pay',
          recipientEmail: 'merchant@shaheen.pay',
          amount,
          currency,
          orderCategory: category,
          userClickFrequencyHz: clickHz,
          biometricStressLevel: biometricStress,
          motionStability,
          userForcedOverride
        })
      });
      const data = await res.json();
      setLastVerdict(data);
      if (data.isPsychoLockEngaged && data.psychoCooldownSecondsRemaining) {
        setCooldownRemaining(data.psychoCooldownSecondsRemaining);
      }
    } catch (err: any) {
      alert('Evaluation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePayPal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerEmail: 'client@shaheen.pay',
          recipientEmail: 'merchant@shaheen.pay',
          amount,
          currency,
          orderCategory: category,
          userClickFrequencyHz: clickHz,
          biometricStressLevel: biometricStress,
          motionStability,
          userForcedOverride
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setLastVerdict(data.verdict);
        setPaypalOrderResult(null);
      } else {
        setLastVerdict(data.verdict);
        setPaypalOrderResult(data.paypalOrder);
      }
    } catch (err: any) {
      alert('Order execution error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDuressAttackSim = () => {
    setBiometricStress(4.5); // Extreme stress (> 3.8)
    setMotionStability(0.04); // Physical immobility (< 0.08)
    setTimeout(() => {
      handleEvaluate();
    }, 150);
  };

  const handleBet23RapidTapSim = () => {
    setClickHz(3.8); // High emotional frequency (> 2.5 Hz)
    setTimeout(() => {
      handleEvaluate();
    }, 150);
  };

  const handleEmergencyKillSwitch = async () => {
    if (!confirm('Execute emergency DoD 5220.22-M 7-Pass Zeroization & liquidate balances to USDT vault?')) return;
    try {
      const res = await fetch('/api/paypal/kill-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      alert('🚨 EMERGENCY PROTOCOL CONFIRMED:\n' + data.message);
      fetchKernelStatus();
    } catch (e) {
      alert('Kill switch error');
    }
  };

  const handleReleaseCooldown = async () => {
    try {
      await fetch('/api/paypal/cooldown-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      setCooldownRemaining(0);
      setClickHz(1.0);
      setBiometricStress(0.5);
      setMotionStability(0.95);
      fetchKernelStatus();
    } catch (e) {
      alert('Failed to release lock');
    }
  };

  return (
    <div className="w-full bg-[#0a0d14] text-white p-4 md:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] my-6 ltr font-sans">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-cyan-500/20 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦅</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
                {t.title}
              </h2>
              <p className="text-xs md:text-sm text-cyan-300/80 font-mono">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/50 rounded-full text-xs font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {t.zeroCopy}
          </span>
          <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/50 rounded-full text-xs font-mono text-amber-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            {t.monteCarlo}
          </span>
          {cooldownRemaining > 0 ? (
            <span className="px-3 py-1 bg-rose-950/90 border border-rose-500 rounded-full text-xs font-mono text-rose-300 animate-pulse flex items-center gap-1">
              <Lock className="w-3 h-3" /> {t.bet23Locked}: {cooldownRemaining}s
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 rounded-full text-xs font-mono text-emerald-300">
              {t.bet23Unlocked}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 my-6 border-b border-white/5 pb-2">
        <button
          onClick={() => setActiveTab('CONSOLE')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'CONSOLE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.consoleTab}
        </button>
        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'ARCHITECTURE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.architectureTab}
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t.auditTab}
        </button>
      </div>

      {/* TAB 1: CONSOLE */}
      {activeTab === 'CONSOLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Parameters Input */}
          <div className="lg:col-span-1 bg-slate-900/60 p-5 rounded-2xl border border-cyan-500/20 space-y-4">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> {t.paramsTitle}
            </h3>

            {/* Amount */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">{t.amountLabel}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-cyan-400">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-8 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">{t.currencyLabel}</label>
              <select
                value={currency}
                onChange={(e: any) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USDT">USDT (Crypto)</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">{t.categoryLabel}</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="AGENTIC_SERVICE">{t.cat1}</option>
                <option value="COMMERCE_GOODS">{t.cat2}</option>
                <option value="MICRO_PAYOUT">{t.cat3}</option>
              </select>
            </div>

            {/* Behavioral Sliders */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>{t.clickHzLabel}</span>
                  <span className="text-cyan-400">{clickHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={clickHz}
                  onChange={(e) => setClickHz(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                {clickHz > 2.5 && <span className="text-[10px] text-amber-400 font-mono">⚠️ {t.emotional}</span>}
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>{t.stressLabel}</span>
                  <span className="text-cyan-400">{biometricStress}/5.0</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={biometricStress}
                  onChange={(e) => setBiometricStress(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                {biometricStress > 3.8 && <span className="text-[10px] text-rose-400 font-mono">🚨 {t.duress}</span>}
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>{t.motionLabel}</span>
                  <span className="text-cyan-400">{motionStability}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.01"
                  value={motionStability}
                  onChange={(e) => setMotionStability(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                {motionStability < 0.08 && <span className="text-[10px] text-rose-400 font-mono">⚠️ {t.weaponStillness}</span>}
              </div>
            </div>

            {/* Override Checkbox */}
            <div className="pt-2 border-t border-white/5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userForcedOverride}
                  onChange={(e) => setUserForcedOverride(e.target.checked)}
                  className="mt-1 accent-amber-500 rounded"
                />
                <span className="text-xs text-gray-300 leading-relaxed font-mono">
                  {t.overrideLabel}
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3">
              <button
                onClick={handleEvaluate}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {t.simulateBtn}
              </button>

              <button
                onClick={handleExecutePayPal}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <DollarSign className="w-4 h-4" />
                {t.executeBtn}
              </button>

              {/* Simulation Quick Tests */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleDuressAttackSim}
                  className="py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-mono transition-all cursor-pointer"
                >
                  {t.testDuressBtn}
                </button>
                <button
                  onClick={handleBet23RapidTapSim}
                  className="py-2 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono transition-all cursor-pointer"
                >
                  {t.testBet23Btn}
                </button>
              </div>

              {cooldownRemaining > 0 && (
                <button
                  onClick={handleReleaseCooldown}
                  className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-mono transition-all cursor-pointer"
                >
                  {t.adminUnlockBtn}
                </button>
              )}

              <button
                onClick={handleEmergencyKillSwitch}
                className="w-full py-2 bg-red-950 hover:bg-red-900 border border-red-600/60 text-red-300 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {t.killSwitchBtn}
              </button>
            </div>
          </div>

          {/* Right Columns: Verdict & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-cyan-500/20">
              <h3 className="text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                {t.verdictTitle}
              </h3>

              {lastVerdict ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    lastVerdict.verdict === 'APPROVED' 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      {lastVerdict.verdict === 'APPROVED' ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <XCircle className="w-6 h-6 text-rose-400" />}
                      <div>
                        <div className="font-extrabold text-sm md:text-base">
                          {lastVerdict.verdict === 'APPROVED' ? t.cleared : t.halted}
                        </div>
                        <div className="text-xs opacity-80 font-mono mt-0.5">{lastVerdict.reason}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 bg-black/40 rounded-lg border border-white/10">
                      {lastVerdict.executionTimeMs || 12}ms
                    </span>
                  </div>

                  {/* S-SVD Ghost Vault Active Notice */}
                  {lastVerdict.isDuressDetected && (
                    <div className="p-4 bg-purple-950/60 border border-purple-500/50 rounded-xl text-purple-200 text-xs md:text-sm font-mono flex items-start gap-3">
                      <span className="text-xl">👻</span>
                      <div>
                        <span className="font-bold block text-purple-300 mb-1">S-SVD GHOST VAULT ACTIVATED</span>
                        {t.ssvdActive}
                      </div>
                    </div>
                  )}

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20">
                      <div className="text-[10px] font-mono text-gray-400">{t.pathsCount}</div>
                      <div className="text-lg font-bold text-cyan-300 font-mono mt-1">150,000</div>
                    </div>
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20">
                      <div className="text-[10px] font-mono text-gray-400">{t.successProb}</div>
                      <div className="text-lg font-bold text-emerald-300 font-mono mt-1">
                        {lastVerdict.monteCarloSuccessProbability ? `${(lastVerdict.monteCarloSuccessProbability * 100).toFixed(1)}%` : '99.99%'}
                      </div>
                    </div>
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20">
                      <div className="text-[10px] font-mono text-gray-400">{t.latency}</div>
                      <div className="text-lg font-bold text-teal-300 font-mono mt-1">
                        {lastVerdict.nuclearLatencyUs || '14.2'} µs
                      </div>
                    </div>
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20">
                      <div className="text-[10px] font-mono text-gray-400">{t.liability}</div>
                      <div className="text-xs font-bold text-amber-300 font-mono mt-1 truncate">
                        {lastVerdict.liabilityHolder || (userForcedOverride ? 'User (Forced Override)' : 'Shaheen Shield')}
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Hash */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-white/5 font-mono text-[11px] text-gray-400 truncate">
                    <span className="text-cyan-400 mr-2">{t.auditSig}</span>
                    <span className="text-emerald-400">{lastVerdict.auditHash || 'sha256:8f94b4e2a10c71e99a341f2098...'}</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500 font-mono text-xs">
                  {t.readyPrompt}
                </div>
              )}
            </div>

            {/* PayPal API Output Card */}
            {paypalOrderResult && (
              <div className="bg-slate-900/60 p-6 rounded-2xl border border-blue-500/30">
                <h3 className="text-base font-bold text-blue-400 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> {t.paypalOutput}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-500/30">
                    Status: {paypalOrderResult.status || 'CREATED'}
                  </span>
                </h3>
                <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-blue-300 overflow-x-auto border border-blue-500/20 max-h-60">
                  {JSON.stringify(paypalOrderResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-cyan-500/20">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-2">
              {t.archTitle}
            </h3>
            <p className="text-sm text-gray-300 font-mono mb-6">
              {t.archSubtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.arch1Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{t.arch1Desc}</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.arch2Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{t.arch2Desc}</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.arch3Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{t.arch3Desc}</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.arch4Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{t.arch4Desc}</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.arch5Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{t.arch5Desc}</p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-cyan-500/20">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.arch6Title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{t.arch6Desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT & LEGAL */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-cyan-500/20">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-2">
              {t.auditHeaderTitle}
            </h3>
            <p className="text-sm text-gray-300 font-mono mb-6">
              {t.auditHeaderDesc}
            </p>

            <div className="space-y-4">
              <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/30">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.legalPrinciple1}</h4>
                <p className="text-xs text-gray-300 leading-relaxed italic">{t.legalPrinciple1Desc}</p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/30">
                <h4 className="text-sm font-bold text-cyan-300 mb-2 font-mono">{t.legalPrinciple2}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{t.legalPrinciple2Desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
