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
    <div className="w-full bg-[#0a0d14] text-white p-4 md:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] my-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-cyan-500/20 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦅</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
                SHAHEEN PAY KERNEL
              </h2>
              <p className="text-xs md:text-sm text-cyan-300/80 font-mono">
                Sovereign Agentic Commerce & Anti-Fraud Shield for PayPal • Architect: Eng. Ayman Al-Araishi
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/50 rounded-full text-xs font-mono text-cyan-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            L1 64B ZERO-COPY
          </span>
          <span className="px-3 py-1 bg-amber-950/80 border border-amber-500/50 rounded-full text-xs font-mono text-amber-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            150,000 MONTE CARLO
          </span>
          {cooldownRemaining > 0 ? (
            <span className="px-3 py-1 bg-rose-950/90 border border-rose-500 rounded-full text-xs font-mono text-rose-300 animate-pulse flex items-center gap-1">
              <Lock className="w-3 h-3" /> BET23 COOLDOWN: {cooldownRemaining}s
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 rounded-full text-xs font-mono text-emerald-300">
              BET23: UNLOCKED
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
          🎮 Live Command Console
        </button>
        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'ARCHITECTURE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🏛️ 35-Algorithm Architecture
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📜 Tamper-Proof Audit & Legal Shield
        </button>
      </div>

      {activeTab === 'CONSOLE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#0f1422] p-6 rounded-2xl border border-white/10 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4" /> Agentic Transaction Parameters
            </h3>

            {/* Amount & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Payment Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#182033] border border-cyan-500/30 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-500">$</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e: any) => setCurrency(e.target.value)}
                  className="w-full bg-[#182033] border border-cyan-500/30 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USDT">USDT (Crypto)</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Order Category (Agentic Target)</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-[#182033] border border-cyan-500/30 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="AGENTIC_SERVICE">Autonomous AI Agent Execution</option>
                <option value="COMMERCE_GOODS">E-Commerce & Digital Goods</option>
                <option value="MICRO_PAYOUT">Trader Payout / Micro-Settlement</option>
              </select>
            </div>

            {/* Physiological & Behavioral Sliders */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Interaction Frequency (Click Hz)</span>
                  <span className={`font-mono font-bold ${clickHz > 2.5 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {clickHz.toFixed(1)} Hz {clickHz > 2.5 && '(Emotional)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={clickHz}
                  onChange={(e) => setClickHz(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Biometric Stress Index (0-5)</span>
                  <span className={`font-mono font-bold ${biometricStress > 3.8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {biometricStress.toFixed(1)} {biometricStress > 3.8 && '(Duress)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={biometricStress}
                  onChange={(e) => setBiometricStress(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Motion Stability (Tremor / Restraint)</span>
                  <span className={`font-mono font-bold ${motionStability < 0.08 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {motionStability.toFixed(2)} {motionStability < 0.08 && '(Weapon Stillness)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.0"
                  step="0.01"
                  value={motionStability}
                  onChange={(e) => setMotionStability(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Legal Override Switch */}
            <div className="pt-2 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={userForcedOverride}
                  onChange={(e) => setUserForcedOverride(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Enable User Forced Override (Shifts full legal liability to user)</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={handleEvaluate}
                disabled={loading}
                className="w-full bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 font-semibold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Cpu className="w-4 h-4" /> Simulate (150k)
              </button>
              <button
                onClick={handleExecutePayPal}
                disabled={loading || cooldownRemaining > 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" /> PayPal Execute
              </button>
            </div>

            {/* Specialized Scenario Testers */}
            <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2">
              <button
                onClick={handleDuressAttackSim}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Test Duress (Ghost Vault)
              </button>
              <button
                onClick={handleBet23RapidTapSim}
                className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <Activity className="w-3.5 h-3.5" /> Test Bet23 Lock
              </button>
              {cooldownRemaining > 0 && (
                <button
                  onClick={handleReleaseCooldown}
                  className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs flex items-center gap-1 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Admin Unlock
                </button>
              )}
            </div>

            {/* Emergency Kill Switch */}
            <button
              onClick={handleEmergencyKillSwitch}
              className="mt-2 w-full bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Flame className="w-4 h-4 text-red-500" />
              EMERGENCY KILL-SWITCH (DoD 7-Pass Zeroization)
            </button>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Verdict Card */}
            <div className="bg-[#0f1422] p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  Shaheen Gate Verdict & PayPal Clearance
                </h3>
                {lastVerdict ? (
                  lastVerdict.isClearedForPayPalExecution ? (
                    <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CLEARED FOR DISPATCH
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-bold rounded-full flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> INTERCEPTED & HALTED
                    </span>
                  )
                ) : (
                  <span className="text-xs text-gray-500 font-mono">WAITING_FOR_TRIGGER</span>
                )}
              </div>

              {lastVerdict ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border text-sm font-mono ${
                    lastVerdict.isClearedForPayPalExecution
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    {lastVerdict.message}
                  </div>

                  {/* Telemetry Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#182033] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Monte Carlo Paths</span>
                      <span className="text-base font-bold text-cyan-300 font-mono">
                        {lastVerdict.simulationReport?.simulatedPathsCount?.toLocaleString() || 0}
                      </span>
                    </div>

                    <div className="bg-[#182033] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Success Probability</span>
                      <span className="text-base font-bold text-amber-300 font-mono">
                        {lastVerdict.simulationReport?.successProbabilityPercentage}%
                      </span>
                    </div>

                    <div className="bg-[#182033] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Nuclear Latency</span>
                      <span className="text-base font-bold text-teal-300 font-mono">
                        {lastVerdict.simulationReport?.marketLatencyMs} ms
                      </span>
                    </div>

                    <div className="bg-[#182033] p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Liability Holder</span>
                      <span className="text-xs font-bold text-white font-mono truncate block">
                        {lastVerdict.legalLiabilityHolder}
                      </span>
                    </div>
                  </div>

                  {/* Duress & Vault Indicator */}
                  {lastVerdict.isDuressDetected && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span><strong>S-SVD Active:</strong> Coercion identified. The attacker is viewing decoy vault while real balances are air-gapped.</span>
                    </div>
                  )}

                  {/* Audit Hash */}
                  <div className="bg-[#0b0f19] p-3 rounded-xl border border-white/5 text-[11px] font-mono text-gray-400">
                    <span className="text-gray-500 block">SHA-256 Sovereign Audit Signature:</span>
                    <span className="text-cyan-400/90 break-all">{lastVerdict.auditSignature}</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm font-mono border border-dashed border-white/10 rounded-xl">
                  Ready to simulate transaction via S-PK Engine. Click "Simulate (150k)" or "PayPal Execute" to test.
                </div>
              )}
            </div>

            {/* PayPal Orders API Simulated Output */}
            {paypalOrderResult && (
              <div className="bg-[#0f1422] p-5 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20">
                  <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> PayPal Orders v2 Output (Verified)
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">Order ID: {paypalOrderResult.id}</span>
                </div>
                <div className="p-3 bg-[#0a0d14] rounded-xl font-mono text-xs text-gray-300 overflow-x-auto max-h-40">
                  <pre>{JSON.stringify(paypalOrderResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-[#0f1422] p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-cyan-400">
              The 35 Sovereign Banking Algorithms (Architectural Synthesis)
            </h3>
            <p className="text-sm text-gray-400">
              Invented & Architected by Eng. Ayman Al-Araishi for high-frequency defense, risk zeroization, and PayPal agentic commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#182033] p-4 rounded-xl border border-cyan-500/20">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4" /> 1. Nuclear Execution Engine
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                64-Byte SharedArrayBuffer aligned directly to CPU L1 Cache lines. Guarantees atomic zero-copy memory reads/writes in sub-20ms to prevent double-spending in autonomous agentic commerce.
              </p>
            </div>

            <div className="bg-[#182033] p-4 rounded-xl border border-amber-500/20">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" /> 2. S-IFG Quantum Simulator
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Generates 150,000 parallel Monte Carlo scenarios in microseconds. Intercepts payment orders with strict 100% certainty rules to eliminate slippage and malicious chargebacks.
              </p>
            </div>

            <div className="bg-[#182033] p-4 rounded-xl border border-rose-500/20">
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" /> 3. Bet23 Psycho-Temporal Lock
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Monitors click frequency (Hz) and interaction speed. Halts payments for a 30-minute cooling period if rapid emotional tapping is detected, protecting user capital from panic and scam coercion.
              </p>
            </div>

            <div className="bg-[#182033] p-4 rounded-xl border border-teal-500/20">
              <h4 className="text-sm font-bold text-teal-300 flex items-center gap-2 mb-2">
                <Fingerprint className="w-4 h-4" /> 4. S-SVD Duress & Ghost Vault
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Under physical or psychological coercion (extreme stress + physical immobility), automatically exposes a decoy ghost vault with fake balances, while air-gapping sovereign accounts.
              </p>
            </div>

            <div className="bg-[#182033] p-4 rounded-xl border border-red-500/20">
              <h4 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4" /> 5. DoD 5220.22-M Zeroization
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                7-pass military-grade cryptographic memory overwrite sequence. Destroys all session keys, tokens, and volatile structures upon physical tamper or emergency kill-switch activation.
              </p>
            </div>

            <div className="bg-[#182033] p-4 rounded-xl border border-purple-500/20">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4" /> 6. S-AMI Cyber Phagocytosis
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Algorithmic metabolic defense that intercepts malicious bot requests and attack payloads, decompiles their DNA, and assimilates their energy to harden PayPal API defenses in real time.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="bg-[#0f1422] p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-cyan-400">
              Dual-Layer Legal & Technical Liability Framework
            </h3>
            <p className="text-xs text-gray-400">
              Mathematical certainty backed by airtight international disclaimer logic for banking integration.
            </p>
          </div>

          <div className="p-4 bg-[#182033] rounded-xl border border-white/10 text-xs font-mono text-gray-300 space-y-2">
            <p className="text-amber-300 font-bold">1. Legal Liability Principle:</p>
            <p>
              "We protect you technically at 100%. If the user deliberately overrides the system via User Forced Override, legal liability shifts 100% to the user and is recorded immutably via SHA-256 forensic audit hash."
            </p>
            <p className="text-cyan-300 font-bold mt-3">2. PayPal Integration Target:</p>
            <p>
              Autonomous Agentic Payments via PayPal Orders v2 API and Payouts SDK, fortified with sub-millisecond anomaly detection and zero-knowledge ledger validation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
