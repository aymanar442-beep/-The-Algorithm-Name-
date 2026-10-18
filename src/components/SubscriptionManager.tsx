import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, CheckCircle2, ShieldCheck, Zap, AlertTriangle, 
  RefreshCw, Clock, ArrowRight, UserCheck, Star, Sparkles, 
  DollarSign, Check, X, FileText, ChevronRight, ExternalLink,
  Shield, Flame, Lock, Crown
} from 'lucide-react';
import { toast } from 'sonner';

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceUSD: number;
  stripePriceId: string;
  billingPeriod: 'monthly' | 'quarterly' | 'yearly';
  roleGranted: 'PAYPAL_MERCHANT' | 'ENTERPRISE_SHIELD' | 'SOVEREIGN_PATRON';
  badge: string;
  color: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_merchant',
    name: 'PayPal Merchant Protect',
    priceUSD: 29,
    stripePriceId: 'price_paypal_merchant_29',
    billingPeriod: 'monthly',
    roleGranted: 'PAYPAL_MERCHANT',
    badge: 'Essential Protection',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
    features: [
      'Activate Zero-180-Day Freeze Protocol',
      'Conditional Escrow & Smart Vault Protection',
      'Real-Time Live Transaction Ledger & Telemetry',
      'Instant Excel & PDF Financial Report Export'
    ]
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise Escrow Pro',
    priceUSD: 79,
    stripePriceId: 'price_paypal_enterprise_79',
    billingPeriod: 'monthly',
    roleGranted: 'ENTERPRISE_SHIELD',
    badge: 'Most Popular ⭐',
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-400',
    features: [
      'All Essential Protection Features Unlimited',
      'Nuclear Execution Engine (<20ms Atomic L1 Cache)',
      'Stealth-Guard Polymorphic Document Watermarking',
      'Merchant Dispute Shield & False Chargeback Defense',
      'Priority Sovereign Verification & Support'
    ]
  },
  {
    id: 'plan_sovereign_patron',
    name: 'Humanitarian & Child Protection Hub',
    priceUSD: 199,
    stripePriceId: 'price_paypal_humanitarian_199',
    billingPeriod: 'monthly',
    roleGranted: 'SOVEREIGN_PATRON',
    badge: 'Sovereign Patron 👑',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    features: [
      'All Enterprise Escrow Pro + Charitable Fund Routing',
      'Priority Protection for Child Welfare & Donation Funds',
      '1-on-1 Consultation for UN & Giveth Integration',
      'Fermat Sovereign Mesh Node Cross-Border Settlement'
    ]
  }
];

interface UserSubscriptionState {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  tierId: string;
  role: string;
  autoRenew: boolean;
  currentPeriodEnd: number;
}

export const SubscriptionManager: React.FC = () => {
  const [subscription, setSubscription] = useState<UserSubscriptionState>({
    status: 'active',
    tierId: 'plan_enterprise',
    role: 'ENTERPRISE_SHIELD',
    autoRenew: true,
    currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setSubscription({
        status: 'active',
        tierId: plan.id,
        role: plan.roleGranted,
        autoRenew: true,
        currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000
      });
      toast.success(`✅ Account successfully upgraded to "${plan.name}" with Sovereign Shield active!`);
    } catch (err) {
      toast.error('Error processing upgrade.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#0a0a0b] text-gray-100 font-sans">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-3">
          <Shield className="w-4 h-4" />
          <span>PayPal Enterprise & Merchant Protection Tiers</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          PayPal Sovereign Protection Tiers & Billing
        </h2>
        <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
          Choose the sovereign protection level tailored for your PayPal merchant account to eliminate 180-day freezes and guarantee secure instantaneous settlement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = subscription.tierId === plan.id;
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl bg-gray-900/80 border p-6 flex flex-col justify-between backdrop-blur-xl transition-all shadow-xl ${
                isCurrent ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${plan.color}`}>
                    {plan.badge}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" /> Active Tier
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-white">${plan.priceUSD}</span>
                  <span className="text-gray-400 text-sm">/ month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading || isCurrent}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isCurrent
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400 shadow-amber-500/20'
                }`}
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : isCurrent ? (
                  'Current Active Tier'
                ) : (
                  <>
                    <span>Activate Protection Tier</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
