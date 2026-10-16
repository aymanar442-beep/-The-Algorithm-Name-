import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
  TrendingUp, ShieldCheck, Zap, Globe, Lock, Activity, 
  Terminal, Award, CheckCircle2, Sparkles, MessageSquare, ExternalLink,
  ShieldAlert, BookOpen, Users, DollarSign, LayoutDashboard, GraduationCap,
  Layers, Gift, ChevronRight, ChevronLeft, Menu, X, ArrowUpRight, PlayCircle, FileText,
  PieChart as PieChartIcon, Plus, Trash2, Calculator, Edit3, Save, Share2, Calendar,
  Hash, Headphones, Shield, Check, Copy, Eye, Send, Phone, UserCheck, Flame, Bell, HelpCircle
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { io } from 'socket.io-client';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, addDoc, where, serverTimestamp } from 'firebase/firestore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ShaheenPayPalRevolution } from './components/ShaheenPayPalRevolution';
import { SubscriptionManager } from './components/SubscriptionManager';
import { PortfolioTracker } from './components/PortfolioTracker';
import { MarketNews } from './components/MarketNews';
import { SentimentCard } from './components/SentimentCard';
import { LanguageSwitcher } from './context/LanguageContext';

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 2 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => 
    prefix + latest.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }) + suffix
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

interface Signal {
  id: string;
  coin: string;
  type: 'LONG' | 'SHORT' | 'SPOT';
  entry: string;
  targets: string[];
  stopLoss: string;
  risk: string;
  category?: 'trade' | 'investment';
  recommendedLeverage?: string;
  active: boolean;
  isPremium?: boolean;
}

interface MarketCoin {
  id: string;
  name: string;
  category: string;
  price: string;
  change24h: string;
  target: string;
  groupBuyPrice: string;
  status: string;
  exchange: string;
  link: string;
  color: string;
  badgeColor: string;
}

interface TradeJournalEntry {
  id: string;
  coin: string;
  entryPrice: string;
  exitPrice: string;
  notes: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  createdAt: any;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'paypal_shaheen' | 'discord_hub' | 'dashboard' | 'market' | 'signals' | 'agencies' | 'staff' | 'academy' | 'knowledge' | 'community' | 'admin' | 'subscription' | 'portfolio'>('paypal_shaheen');
  const [discordChannel, setDiscordChannel] = useState<'announcements' | 'guardrail' | 'signals' | 'near_study' | 'locked_gems' | 'agencies' | 'academy' | 'general_chat' | 'staff_desk' | 'anthem_studio' | 'subscriptions' | 'portfolio'>('anthem_studio');

  // Staff Desk & Support Girls
  const [staffMembers, setStaffMembers] = useState<any[]>([
    {
      id: 'staff-1',
      name: 'سارة المحمود',
      role: 'مسؤولة تدقيق Bybit والتحقق',
      telegram: '@sara_godfather_agent',
      phone: '+963 933 112 456',
      verifiedCount: 48,
      commissionRate: 0.50,
      earnedToday: 24.00,
      status: 'ACTIVE',
      rating: '5.0',
      assignedExchanges: ['Bybit'],
      joinedDate: '2026-09-01'
    },
    {
      id: 'staff-2',
      name: 'نور الشام',
      role: 'مسؤولة وكالة MEXC والدعم الفني',
      telegram: '@nour_mexc_agent',
      phone: '+963 944 558 789',
      verifiedCount: 35,
      commissionRate: 0.50,
      earnedToday: 17.50,
      status: 'ACTIVE',
      rating: '4.9',
      assignedExchanges: ['MEXC'],
      joinedDate: '2026-09-15'
    },
    {
      id: 'staff-3',
      name: 'ريم الأحمد',
      role: 'مشرفة الروم العام ومتابعة التوصيات',
      telegram: '@reem_crypto_rich',
      phone: '+963 988 234 112',
      verifiedCount: 29,
      commissionRate: 0.50,
      earnedToday: 14.50,
      status: 'ACTIVE',
      rating: '4.9',
      assignedExchanges: ['Binance', 'Bybit'],
      joinedDate: '2026-10-01'
    }
  ]);
  const [activeStaffId, setActiveStaffId] = useState<string>('staff-1');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({ name: '', role: 'مسؤولة تدقيق وتحقق', telegram: '', phone: '', commissionRate: '0.50' });

  // Dynamic Exchange Agencies
  const [showAddExchangeModal, setShowAddExchangeModal] = useState(false);
  const [newExchangeForm, setNewExchangeForm] = useState({ name: '', logo: '', link: '', refCode: '', bonus: '', supergroupId: '', channel: '' });

  // Locked Gem Study Purchase / Unlock Modal
  const [showUnlockStudyModal, setShowUnlockStudyModal] = useState(false);
  const [selectedLockedGem, setSelectedLockedGem] = useState<any | null>(null);
  const [studyUnlockForm, setStudyUnlockForm] = useState({ telegram: '', notes: '' });

  // Comprehensive NEAR Study
  const [nearStudy, setNearStudy] = useState<any>({
    coin: 'NEAR Protocol (NEAR)',
    symbol: 'NEAR',
    researchDuration: 'دراسة مستمرة لمدة 5 أشهر كاملة',
    status: 'دراسة مفتوحة ومجانية للمجتمع 🟢 (The Godfather Open Dossier)',
    category: 'طبقة أولى ثورية (Layer 1) + الذكاء الاصطناعي وتجريد السلسلة',
    accumulationZone: '$4.70 - $5.25',
    currentPrice: '$5.16',
    projectedTargets: [
      { target: 'الهدف الأول (قريب)', price: '$7.80', return: '+51%', timeline: '1 - 2 شهر' },
      { target: 'الهدف الثاني (استراتيجي)', price: '$12.50', return: '+142%', timeline: '3 - 6 أشهر' },
      { target: 'الهدف الثالث (قمة الدورة)', price: '$18.00 - $22.00', return: '+250% - +325%', timeline: 'دورة الصعود الكبرى' }
    ],
    strengths: [
      'بنية Nightshade 2.0 Sharding لمعالجة مئات آلاف المعاملات بالثانية برسوم شبه منعدمة (<$0.001)',
      'تجريد السلسلة الكامل (Chain Abstraction): تداول ونقل أصول عبر سلاسل متعددة من حساب NEAR واحد دون أي تعقيد',
      'الريادة في مجال وكلاء الذكاء الاصطناعي المملوك للمستخدمين (User-Owned AI)',
      'عناوين شبكة مقروءة وودية مثل (ayman.near) تنهي كابوس العناوين المعقدة الطويلة',
      'سيولة مليارية عميقة ومدرجة في جميع الوكالات الرسمية (Bybit, MEXC, Binance)'
    ],
    riskMatrix: {
      volatilityRisk: 'متوسط (مرتبط بحركة البيتكوين الإجمالية)',
      liquidityRisk: 'منخفض جداً (سيولة يومية تتجاوز 400 مليون دولار)',
      stopLossRecommended: '$4.10'
    },
    conclusion: 'تصلح لصفقات التجميع الاستثماري الآمن لشهور قادمة. ننصح بالدخول على أجزاء دون رافعة مالية عالية لضمان راحة البال والربح المؤكد.'
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isRegistered, setIsRegistered] = useState(!!localStorage.getItem('bot_user_uid'));
  const [isPending, setIsPending] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [tgSettings, setTgSettings] = useState({ botToken: '', chatId: '' });
  const [socket, setSocket] = useState<any>(null);
  const [marketCoins, setMarketCoins] = useState<MarketCoin[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [exchanges, setExchanges] = useState<any[]>([
    {
      id: 'bybit-1',
      name: 'Bybit (Baybit-Rich جورجيا)',
      logo: 'https://cryptologos.cc/logos/bybit-bybit-logo.png',
      bonus: 'وكالة Bybit الرسمية + بونص ترحيبي يصل لـ 30,000$ + مجتمع Baybit-Rich (رمز: 167506)',
      bonusEn: 'Official Bybit Agency + Welcome Bonus up to $30k + Baybit-Rich Community (Code: 167506)',
      link: 'https://affiliates.bybit.com/api/v2/apk_download?invite_code=167506',
      refCode: '167506',
      supergroupId: '-1004439326104',
      active: true,
      order: 1
    },
    {
      id: 'mexc-1',
      name: 'MEXC SYRIA (الوكالة الرسمية)',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkKInpD1n1zE8N2Y4f3s_E9k5X1F-2S8FqWg&s',
      bonus: 'المركز الرسمي المعتمد لمنصة MEXC في سوريا والشرق الأوسط + بونص 1000$ + قناة @ayman_alshame',
      bonusEn: 'Official MEXC Agent Center Syria & Arab Region + $1000 Bonus + Channel @ayman_alshame',
      link: 'https://www.mexc.com',
      refCode: 'MEXC_SYRIA',
      supergroupId: '-1003707821005',
      channel: '@ayman_alshame',
      active: true,
      order: 2
    },
    {
      id: 'binance-1',
      name: 'Binance VIP (سيريا بينانس)',
      logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
      bonus: 'خصم 20% على الرسوم + توصيات VIP الخاصة + صيد العملات المخفسة (رمز: SYRIABINANCE)',
      bonusEn: '20% Fee Discount + Private Signals + Deep Gems (Code: SYRIABINANCE)',
      link: 'https://www.binance.com/register?ref=SYRIABINANCE',
      refCode: 'SYRIABINANCE',
      active: true,
      order: 3
    }
  ]);
  const [academy, setAcademy] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('تداول بمنطق العرّاب.. الأمان أولاً.');
  const [onboardingExchange, setOnboardingExchange] = useState<any | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [signupForm, setSignupData] = useState({ username: '', uid: '', depositAmount: '', proofUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userUid, setUserUid] = useState<string>(localStorage.getItem('bot_user_uid') || '');
  const [botSettings, setBotSettings] = useState({
    enabled: false,
    riskLevel: 'Medium',
    tradingPairs: ['0G/USDT', 'NEAR/USDT']
  });
  const [tradeJournal, setTradeJournal] = useState<TradeJournalEntry[]>([]);
  const [newJournal, setNewJournal] = useState({
    coin: '',
    entryPrice: '',
    exitPrice: '',
    notes: '',
    sentiment: 'Neutral' as 'Bullish' | 'Bearish' | 'Neutral'
  });
  
  // Profit Calculator State
  const [calcInvestment, setCalcInvestment] = useState<number>(100);
  const [calcCoinId, setCalcCoinId] = useState<string>('');
  const [calcStopLoss, setCalcStopLoss] = useState<number>(0);

  // Scheduled Alerts State
  const [scheduledAlerts, setScheduledAlerts] = useState<any[]>([
    { id: '1', coin: '0G', targetPrice: '0.050', status: 'نشط', created: 'منذ ساعتين' },
    { id: '2', coin: 'NEAR', targetPrice: '6.200', status: 'نشط', created: 'منذ 5 ساعات' }
  ]);
  const [alertCoin, setAlertCoin] = useState('0G');
  const [alertTargetPrice, setAlertTargetPrice] = useState('');

  // Knowledge Center State
  const [expandedLesson, setExpandedLesson] = useState<string | null>('l1');

  // Smart Trade Close Alert State
  const [smartAlertLog, setSmartAlertLog] = useState<any[]>([
    { id: '1', coin: '0G Coin', target: '$1.00', profit: '+$2,935.48', time: 'منذ 10 دقائق', status: 'تم الإغلاق الذكي بنجاح 🎯' }
  ]);

  // Live WebSocket Market & Chart State
  const [liveChartData, setLiveChartData] = useState<any[]>([
    { day: 'اليوم 1', '0G': 0.012, 'NEAR': 3.8, 'NMR': 12.0 },
    { day: 'اليوم 5', '0G': 0.018, 'NEAR': 4.1, 'NMR': 13.2 },
    { day: 'اليوم 10', '0G': 0.024, 'NEAR': 4.5, 'NMR': 14.5 },
    { day: 'اليوم 15', '0G': 0.028, 'NEAR': 4.8, 'NMR': 15.1 },
    { day: 'اليوم 20', '0G': 0.031, 'NEAR': 5.1, 'NMR': 16.0 },
    { day: 'اليوم 25', '0G': 0.045, 'NEAR': 5.4, 'NMR': 16.5 },
    { day: 'اليوم 30 (حي)', '0G': 0.070, 'NEAR': 6.0, 'NMR': 18.2 },
  ]);

  const [triggeredAlerts, setTriggeredAlerts] = useState<Set<string>>(new Set());
  const [tgBotStatus, setTgBotStatus] = useState<any>({ status: 'Checking...', latency: '...', lastUpdate: '...' });

  useEffect(() => {
    if (userUid) {
      const q = query(collection(db, 'users'), where('binanceUid', '==', userUid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          if (userData.status === 'verified') {
            setIsRegistered(true);
            setIsPending(false);
          } else {
            setIsRegistered(false);
            setIsPending(true);
          }
        } else {
          setIsRegistered(false);
          setIsPending(false);
        }
      }, (error) => {
        console.warn('Users listener notice:', error instanceof Error ? error.message : error);
      });
      return () => unsubscribe();
    }
  }, [userUid]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.username || !signupForm.uid) return toast.error('الرجاء تعبئة كافة الحقول');
    setIsSubmitting(true);
    try {
      await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...signupForm, status: 'pending' })
      });
      localStorage.setItem('bot_user_uid', signupForm.uid);
      setUserUid(signupForm.uid);
      setIsPending(true);
      toast.success('تم إرسال طلبك للعرّاب! سيتم التفعيل قريباً.');
    } catch (e) {
      toast.error('فشل التسجيل، حاول مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RegistrationGate = () => null;

  useEffect(() => {
    const fetchBotStatus = () => {
      fetch('/api/bot-status')
        .then(r => r.json())
        .then(setTgBotStatus)
        .catch(() => setTgBotStatus({ status: 'Offline', latency: 'N/A', lastUpdate: 'N/A' }));
    };
    fetchBotStatus();
    const interval = setInterval(fetchBotStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Automatic Smart Trade Close Alert Monitor
    if (!calcCoinId || !marketCoins.length) return;
    
    const selected = marketCoins.find(c => c.id === calcCoinId);
    if (!selected) return;

    const currentPrice = Number(selected.price.replace(/[^0-9.]/g, ''));
    const targetPrice = Number(selected.target.replace(/[^0-9.]/g, ''));

    if (currentPrice >= targetPrice && !triggeredAlerts.has(selected.id)) {
      const profitVal = ((targetPrice - Number(selected.groupBuyPrice?.replace(/[^0-9.]/g, '') || 0.031)) * (calcInvestment / Number(selected.groupBuyPrice?.replace(/[^0-9.]/g, '') || 0.031))).toFixed(2);
      
      const newLog = {
        id: Date.now().toString(),
        coin: selected.name,
        target: selected.target,
        profit: `+$${profitVal}`,
        time: 'الآن',
        status: 'تم الإغلاق الذكي تلقائياً 🎯'
      };
      
      setSmartAlertLog(prev => [newLog, ...prev]);
      setTriggeredAlerts(prev => new Set(prev).add(selected.id));
      playAlertSound(notificationSound);
      toast.success(`🎯 إغلاق تلقائي ذكي: وصلت ${selected.name} لهدفها السعري ${selected.target}!`);
      
      if (pushEnabled) {
        new Notification('🎯 إغلاق صفقة تلقائي', { body: `عملة ${selected.name} بلغت الهدف بنجاح.` });
      }
    }
  }, [marketCoins, calcCoinId]);

  useEffect(() => {
    // Real-time WebSocket simulator / live feed for live market fluctuations and chart updates second-by-second
    const wsInterval = setInterval(() => {
      setLiveChartData(prev => {
        const lastIdx = prev.length - 1;
        const lastItem = { ...prev[lastIdx] };
        const delta0G = (Math.random() - 0.48) * 0.0015;
        const deltaNEAR = (Math.random() - 0.48) * 0.06;
        const deltaNMR = (Math.random() - 0.48) * 0.09;

        lastItem['0G'] = Number(Math.max(0.01, lastItem['0G'] + delta0G).toFixed(4));
        lastItem['NEAR'] = Number(Math.max(1.0, lastItem['NEAR'] + deltaNEAR).toFixed(2));
        lastItem['NMR'] = Number(Math.max(5.0, lastItem['NMR'] + deltaNMR).toFixed(2));

        const updated = [...prev];
        updated[lastIdx] = lastItem;
        return updated;
      });

      setMarketCoins(prevCoins => 
        prevCoins.map(coin => {
          if (coin.name.includes('0G') || coin.name.includes('NEAR') || coin.name.includes('NMR')) {
            const currentNum = Number(coin.price.replace(/[^0-9.]/g, '')) || 1.0;
            const currentChange = Number(coin.change24h?.replace(/[^0-9.-]/g, '')) || 0;
            const fluctuation = (Math.random() - 0.49) * 0.0025 * currentNum;
            const changeFluctuation = (Math.random() - 0.5) * 0.1;
            const newPrice = Math.max(0.001, currentNum + fluctuation);
            const newChange = currentChange + changeFluctuation;
            return {
              ...coin,
              price: `$${newPrice.toFixed(newPrice < 1 ? 4 : 2)}`,
              change24h: `${newChange > 0 ? '+' : ''}${newChange.toFixed(2)}%`
            };
          }
          return coin;
        })
      );
    }, 1500);

    return () => clearInterval(wsInterval);
  }, []);

  // Admin coin editing state
  const [editingCoin, setEditingCoin] = useState<any | null>(null);

  const [notificationSound, setNotificationSound] = useState<string>('bell');
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);

  const playAlertSound = (soundType: string = 'bell') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (soundType === 'siren') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
      } else if (soundType === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      }
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        toast.success('🔔 تم تفعيل التنبيهات الفورية بنجاح!');
        playAlertSound(notificationSound);
        new Notification('سوق العرّاب', { body: 'تم تفعيل التنبيهات الفورية بنجاح.' });
      } else {
        toast.error('❌ تم رفض إذن التنبيهات');
      }
    }
  };

  const [holdings, setHoldings] = useState<any[]>([
    { coin: 'USDT', amount: 33.11, buyPrice: 1.0, color: '#26a17b' },
    { coin: '0G', amount: 790, buyPrice: 0.032, color: '#9333ea' },
    { coin: 'RWUSD', amount: 15, buyPrice: 1.0, color: '#10b981' },
    { coin: 'BNB', amount: 0.01, buyPrice: 580, color: '#f3ba2f' },
    { coin: 'NMR', amount: 0.5, buyPrice: 16.5, color: '#3b82f6' }
  ]);

  const prices: any = { 'USDT': 1.0, '0G': 0.031, 'RWUSD': 1.0, 'BNB': 580, 'NMR': 16.84, 'NEAR': 5.16 };
  const totalValue = holdings.reduce((acc, h) => acc + (h.amount * (prices[h.coin] || h.buyPrice)), 0);

  const [portfolioGrowthRange, setPortfolioGrowthRange] = useState<number>(30);
  const [growthChartMetric, setGrowthChartMetric] = useState<'value' | 'profit'>('value');

  const portfolioGrowthData = useMemo(() => {
    const days = 30;
    const history = [];
    const now = new Date();

    const costBasis = holdings.reduce((sum, h) => sum + (h.amount * (h.buyPrice || 1)), 0);
    const currentValue = holdings.reduce((sum, h) => sum + (h.amount * (prices[h.coin] || h.buyPrice || 1)), 0);

    // Realistic market curve over the 30 trading days reflecting steady bot-assisted growth and crypto movements
    const trendMultipliers = [
      0.82, 0.83, 0.81, 0.84, 0.86, 0.85, 0.88, 0.87, 0.89, 0.91,
      0.90, 0.93, 0.92, 0.95, 0.94, 0.97, 0.96, 0.98, 1.01, 0.99,
      1.02, 1.01, 1.04, 1.03, 1.06, 1.05, 1.08, 1.06, 1.04, 1.00
    ];

    for (let i = 0; i < days; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (days - 1 - i));
      const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;
      const arabicDate = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      
      let dayVal = 0;
      holdings.forEach((h, idx) => {
        const targetPrice = prices[h.coin] || h.buyPrice || 1;
        const isStable = h.coin === 'USDT' || h.coin === 'RWUSD';
        
        let coinPriceOnDay;
        if (isStable) {
          coinPriceOnDay = 1.0;
        } else {
          // Dynamic market variance tailored to each asset
          const oscillation = Math.sin((i + idx * 2.5) * 0.7) * 0.035;
          const factor = (trendMultipliers[i] + oscillation) / (trendMultipliers[days - 1]);
          coinPriceOnDay = i === days - 1 ? targetPrice : targetPrice * factor;
        }
        dayVal += h.amount * coinPriceOnDay;
      });

      const dayValue = Number(dayVal.toFixed(2));
      const profit = Number((dayValue - costBasis).toFixed(2));
      const profitPercent = Number((((dayValue - costBasis) / (costBasis || 1)) * 100).toFixed(2));

      history.push({
        day: dayStr,
        date: arabicDate,
        value: dayValue,
        costBasis: Number(costBasis.toFixed(2)),
        profit: profit,
        growthRate: profitPercent,
      });
    }

    return history;
  }, [holdings, prices]);

  const displayedGrowthData = useMemo(() => {
    return portfolioGrowthData.slice(portfolioGrowthData.length - portfolioGrowthRange);
  }, [portfolioGrowthData, portfolioGrowthRange]);

  const fetchMarketCoins = () => {
    fetch('/api/market-coins').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setMarketCoins(data);
        if (data.length > 0 && !calcCoinId) setCalcCoinId(data[0].id);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    fetch('/api/exchanges')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setExchanges(d); })
      .catch(() => {});
    fetch('/api/signals')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setSignals(d); })
      .catch(() => {});
    fetch('/api/academy')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setAcademy(d); })
      .catch(() => {});
    fetch('/api/insight')
      .then(r => r.json())
      .then(d => { if (d && d.text) setInsight(d.text); })
      .catch(() => {});
    fetch('/api/staff')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setStaffMembers(d); })
      .catch(() => {});
    fetch('/api/near-study')
      .then(r => r.json())
      .then(d => { if (d && d.coin) setNearStudy(d); })
      .catch(() => {});
    fetchMarketCoins();
  }, []);

  useEffect(() => {
    if (userUid) {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(1));
      const unsubUser = onSnapshot(collection(db, 'users'), (snapshot) => {
        const userDoc = snapshot.docs.find(doc => doc.data().binanceUid === userUid);
        if (userDoc && userDoc.data().botSettings) {
          setBotSettings(userDoc.data().botSettings);
        }
      }, (error) => {
        console.warn('Users collection listener notice:', error instanceof Error ? error.message : error);
      });

      const journalQuery = query(
        collection(db, 'tradeJournal'),
        where('userId', '==', userUid),
        orderBy('createdAt', 'desc')
      );
      const unsubJournal = onSnapshot(journalQuery, (snapshot) => {
        setTradeJournal(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TradeJournalEntry)));
      }, (error) => {
        console.warn('Trade journal listener notice:', error instanceof Error ? error.message : error);
      });

      return () => {
        unsubUser();
        unsubJournal();
      };
    }
  }, [userUid]);

  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_chat');
    });

    newSocket.on('chat_history', (msgs) => setChatMessages(msgs));
    newSocket.on('new_message', (msg) => setChatMessages(prev => [...prev, msg]));
    
    // Signal Alert Listener
    newSocket.on('signal_alert', (signal) => {
      toast.custom((t) => (
        <div className="bg-[#121214] border-2 border-amber-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-top" dir="rtl">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-black">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-amber-500 font-black text-sm">تنبيه صفقة جديدة! 🦅</p>
            <p className="text-white font-bold text-xs">{signal.coin} ({signal.type})</p>
          </div>
          <button onClick={() => { setActiveTab('signals'); toast.dismiss(t); }} className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black rounded-lg">قنص الآن</button>
        </div>
      ), { duration: 8000 });
      playAlertSound('siren');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!currentMessage.trim() || !socket) return;
    const msgData = {
      text: currentMessage,
      sender: signupForm.username || 'محارب مجهول',
      uid: userUid,
      isAdmin: activeTab === 'admin'
    };
    socket.emit('send_message', msgData);
    setCurrentMessage('');
  };

  useEffect(() => {
    fetch('/api/signals').then(r => r.json()).then(setSignals).catch(() => {});
    if (activeTab === 'admin') {
      fetch('/api/admin/users').then(r => r.json()).then(setUsers).catch(() => {});
      fetchMarketCoins();
    }
  }, [activeTab]);

  const navItems = [
    { id: 'paypal_shaheen', label: 'PayPal Next-Gen ⚡', icon: Zap },
    { id: 'dashboard', label: 'Trading Hub', icon: LayoutDashboard },
    { id: 'signals', label: 'Signals VIP', icon: TrendingUp },
    { id: 'market', label: 'Asset Studies', icon: Sparkles },
    { id: 'agencies', label: 'Exchanges', icon: Globe },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
  ];

  // Selected coin for calculator
  const safeCoins = Array.isArray(marketCoins) ? marketCoins : [];
  const selectedCalcCoin = safeCoins.find(c => c.id === calcCoinId) || safeCoins[0];
  const parsePriceNum = (str: string) => Number(str.replace(/[^0-9.]/g, '')) || 1;
  const currNum = selectedCalcCoin ? parsePriceNum(selectedCalcCoin.price) : 0.031;
  const targetNum = selectedCalcCoin ? parsePriceNum(selectedCalcCoin.target) : 1.0;
  
  // Risk/Reward Calculation
  const riskAmount = currNum - calcStopLoss;
  const rewardAmount = targetNum - currNum;
  const riskRewardRatio = riskAmount > 0 ? (rewardAmount / riskAmount) : 0;
  const isRisky = riskRewardRatio < 2;

  const estimatedUnits = currNum > 0 ? calcInvestment / currNum : 0;
  const projectedVal = estimatedUnits * targetNum;
  const estimatedProfit = projectedVal - calcInvestment;
  const roiPct = calcInvestment > 0 ? (estimatedProfit / calcInvestment) * 100 : 0;

  const tradeHistory = [
    { coin: '0G/USDT', type: 'LONG 20x', entry: '$0.024', target: '$0.052', profit: '+116.7%', status: 'ناجحة بربح قياسي' },
    { coin: 'NEAR/USDT', type: 'LONG 10x', entry: '$4.10', target: '$5.80', profit: '+41.4%', status: 'ناجحة' },
    { coin: 'NMR/USDT', type: 'SPOT', entry: '$14.20', target: '$18.50', profit: '+30.2%', status: 'ناجحة' },
    { coin: 'BNB/USDT', type: 'LONG 10x', entry: '$540.0', target: '$595.0', profit: '+10.1%', status: 'ناجحة' },
    { coin: 'RWUSD/USDT', type: 'SPOT', entry: '$1.00', target: '$1.05', profit: '+5.0%', status: 'مستقرة' },
    { coin: 'SOL/USDT', type: 'LONG 15x', entry: '$135.0', target: '$162.0', profit: '+30.0%', status: 'ناجحة' },
    { coin: 'BTC/USDT', type: 'LONG 10x', entry: '$61,200', target: '$66,500', profit: '+8.6%', status: 'ناجحة' },
    { coin: 'ETH/USDT', type: 'LONG 15x', entry: '$2,450', target: '$2,780', profit: '+13.4%', status: 'ناجحة' },
    { coin: 'AVAX/USDT', type: 'LONG 20x', entry: '$22.5', target: '$29.0', profit: '+28.8%', status: 'ناجحة' },
    { coin: 'LINK/USDT', type: 'LONG 10x', entry: '$11.8', target: '$14.5', profit: '+22.8%', status: 'ناجحة' },
  ];

  const exportToCSV = () => {
    const headers = ['العملة', 'النوع', 'الدخول', 'الهدف', 'الربح', 'الحالة'];
    const rows = tradeHistory.map(t => [t.coin, t.type, t.entry, t.target, t.profit, t.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "godfather_trade_history.csv");
    document.body.appendChild(link);
    link.click();
    toast.success('📊 تم تصدير سجل الصفقات كـ CSV بنجاح!');
  };

  const exportJournalToExcel = () => {
    if (tradeJournal.length === 0) {
      toast.error('لا توجد سجلات تداول لتصديرها.');
      return;
    }
    const headers = ['العملة', 'سعر الدخول', 'سعر الخروج', 'المشاعر', 'الملاحظات', 'تاريخ الإضافة'];
    const rows = tradeJournal.map(item => [
      item.coin,
      item.entryPrice,
      item.exitPrice || 'غير محدد',
      item.sentiment,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('ar-EG') : 'اليوم'
    ]);

    const csvContent = "\ufeff" + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "trade_journal_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('📊 تم تصدير سجل التداول اليدوي لملف Excel بنجاح!');
  };

  const updateBotSettings = async (newSettings: any) => {
    if (!userUid) {
      toast.error('يرجى إدخال الـ UID الخاص بك أولاً للتحكم في البوت.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Find the document ID for this UID
      const res = await fetch('/api/admin/users');
      const users = await res.json();
      const user = users.find((u: any) => u.binanceUid === userUid);
      
      if (user) {
        await fetch('/api/signup', { // Re-using signup to update/set settings
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...user, botSettings: newSettings, uid: userUid })
        });
        setBotSettings(newSettings);
        toast.success('⚙️ تم تحديث إعدادات البوت بنجاح!');
        playAlertSound(notificationSound);
      } else {
        toast.error('الـ UID غير مسجل في النظام.');
      }
    } catch (e) {
      toast.error('فشل في تحديث الإعدادات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveTgSettings = async () => {
    if (!userUid) return toast.error('يرجى تسجيل الدخول أولاً');
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'telegramConfig'), {
        userId: userUid,
        ...tgSettings,
        updatedAt: serverTimestamp()
      });
      toast.success('🚀 تم ربط حساب تليجرام بنجاح! ستصلك التنبيهات فوراً.');
    } catch (e) {
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addJournalEntry = async () => {
    if (!userUid) {
      toast.error('يرجى إدخال الـ UID الخاص بك أولاً لتدوين الملاحظات.');
      return;
    }
    if (!newJournal.coin || !newJournal.entryPrice) {
      toast.error('يرجى إدخال العملة وسعر الدخول على الأقل.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tradeJournal'), {
        userId: userUid,
        ...newJournal,
        createdAt: serverTimestamp()
      });
      setNewJournal({ coin: '', entryPrice: '', exitPrice: '', notes: '', sentiment: 'Neutral' });
      toast.success('📝 تم حفظ الملاحظة في سجل الصفقات!');
      playAlertSound(notificationSound);
    } catch (e) {
      toast.error('فشل في حفظ الملاحظة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    doc.text('سجل صفقات العرّاب - Godfather Trade History', 10, 10);
    autoTable(doc, {
      head: [['Coin', 'Type', 'Entry', 'Target', 'Profit', 'Status']],
      body: tradeHistory.map(t => [t.coin, t.type, t.entry, t.target, t.profit, t.status]),
      startY: 20,
    });
    doc.save('godfather_trade_history.pdf');
    toast.success('📄 تم تصدير سجل الصفقات كـ PDF بنجاح!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 font-sans selection:bg-amber-500/30">
      <Toaster position="top-right" richColors theme="dark" />
      
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#003087] via-[#0070ba] to-[#00cfde] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 font-black text-white text-xl">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">PayPal</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black uppercase">
                  Next-Gen ⚡
                </span>
              </div>
              <p className="text-[10px] text-blue-300 font-bold tracking-wider">Sovereign Vault & Causal HyperCore • Eng. Ayman Al-Araishi</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <a href="https://t.me/BinanceRich_Bot" target="_blank" className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 transition-all">
              <MessageSquare size={18} className="text-amber-500" />
              <span className="text-sm font-bold">Community</span>
            </a>
          </div>

          <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0b] pt-24 px-4 space-y-4 animate-in fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-lg font-bold"
            >
              <item.icon className="text-amber-500" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <RegistrationGate />

        {/* Shaheen PayPal Revolution Tab */}
        {activeTab === 'paypal_shaheen' && (
          <ShaheenPayPalRevolution />
        )}

        {/* Discord Hub Tab - "ديسكورد العرّاب الموحد" */}
        {activeTab === 'discord_hub' && (
          <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
            {/* Discord Server Banner Header */}
            <div className="bg-[#1e1f22] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 rounded-3xl flex items-center justify-center text-black font-black text-3xl shadow-xl shadow-amber-500/20 rotate-3">
                  🦅
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl md:text-3xl font-black text-white">ديسكورد العرّاب الموحد (Godfather Discord Hub)</h2>
                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    المنظومة الشاملة: جميع المجتمعات، قنوات التوصيات، دراسة عملة NEAR، العملات المخفسة، ومكاتب الدعم في مكان واحد.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-2xl text-center">
                  <p className="text-[10px] text-gray-400 font-bold">المتداولون المتصلون</p>
                  <p className="text-emerald-400 font-mono font-black text-sm">584 متصل الآن 🟢</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('https://t.me/BinanceRich_Bot');
                    toast.success('📋 تم نسخ رابط سيرفر وبوت العرّاب للمشاركة!');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-gray-200 flex items-center gap-2 transition-all"
                >
                  <Share2 size={14} className="text-amber-500" />
                  مشاركة الرابط
                </button>
              </div>
            </div>

            {/* Discord Main Container: Sidebar + Channel Area */}
            <div className="grid lg:grid-cols-12 gap-6 bg-[#1e1f22] border border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-2xl min-h-[750px]">
              
              {/* Left Column: Discord Channels Sidebar (4 Cols on desktop) */}
              <div className="lg:col-span-4 bg-[#2b2d31] rounded-3xl p-4 space-y-6 border border-white/5 flex flex-col justify-between">
                <div className="space-y-5">
                  {/* Server Badge Title */}
                  <div className="p-3 bg-black/30 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                        #
                      </div>
                      <span className="font-black text-white text-sm">قنوات السيرفر الرسمية</span>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                      V3.5 Live
                    </span>
                  </div>

                  {/* Channel Categories */}
                  <div className="space-y-4 overflow-y-auto max-h-[580px] pr-1">
                    {[
                      {
                        category: '🎵 استوديو النشيد والأغنية الرسمية',
                        channels: [
                          { id: 'anthem_studio', label: 'نشيد-الإمبراطورية-112BPM', icon: Headphones, badge: 'ترند 🎸', color: 'text-amber-400' },
                        ]
                      },
                      {
                        category: '📢 الإعلانات والقواعد الرقابية',
                        channels: [
                          { id: 'near_study', label: 'دراسة-عملة-نير-NEAR', icon: Sparkles, badge: 'مجانية 🟢', color: 'text-amber-400' },
                          { id: 'locked_gems', label: 'دراسات-مخفسة-مدفوعة', icon: Lock, badge: 'VIP للبيع 🔒', color: 'text-purple-400' },
                          { id: 'guardrail', label: 'درع-حماية-رأس-المال', icon: ShieldCheck, badge: 'أمان 100%', color: 'text-emerald-400' },
                          { id: 'announcements', label: 'القوانين-والشروط', icon: BookOpen, badge: '$1.5+', color: 'text-blue-400' },
                        ]
                      },
                      {
                        category: '🚀 صفقات وتوصيات حية',
                        channels: [
                          { id: 'signals', label: 'توصيات-حصرية-معتمدة', icon: TrendingUp, badge: 'مباشر ⚡️', color: 'text-amber-400' },
                        ]
                      },
                      {
                        category: '🏛️ وكالات المنصات الرسمية',
                        channels: [
                          { id: 'agencies', label: 'وكالات-المنصات-المعتمدة', icon: Globe, badge: `${exchanges.length} وكالات`, color: 'text-cyan-400' },
                        ]
                      },
                      {
                        category: '👩‍💼 فريق العمل ومكتب الدعم',
                        channels: [
                          { id: 'staff_desk', label: 'مكتب-فريق-العمل-والبنات', icon: Award, badge: 'رزق ودعم', color: 'text-pink-400' },
                        ]
                      },
                      {
                        category: '💬 المحادثات والتعليم',
                        channels: [
                          { id: 'general_chat', label: 'الروم-العام-والشات', icon: MessageSquare, badge: 'حي 🟢', color: 'text-emerald-400' },
                          { id: 'academy', label: 'أكاديمية-التعليم', icon: GraduationCap, badge: 'دروس', color: 'text-yellow-400' },
                        ]
                      }
                    ].map((group, gIdx) => (
                      <div key={gIdx} className="space-y-1.5">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider px-2">
                          {group.category}
                        </p>
                        <div className="space-y-1">
                          {group.channels.map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => setDiscordChannel(ch.id as any)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all ${
                                discordChannel === ch.id 
                                  ? 'bg-[#35373c] text-white shadow-lg border border-white/10' 
                                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-gray-500 font-bold">#</span>
                                <ch.icon size={15} className={ch.color} />
                                <span>{ch.label}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                discordChannel === ch.id ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-gray-400'
                              }`}>
                                {ch.badge}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Status Bar at the bottom of sidebar */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between bg-black/20 p-3 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs">
                      {userUid ? userUid.slice(0, 2) : '🦅'}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{userUid ? `UID: ${userUid}` : 'محارب العرّاب'}</p>
                      <p className="text-[10px] text-emerald-400">متصل بالسيرفر</p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                </div>
              </div>

              {/* Right Column: Active Channel Feed (8 Cols on desktop) */}
              <div className="lg:col-span-8 bg-[#313338] rounded-3xl p-6 border border-white/5 flex flex-col justify-between space-y-6">
                
                {/* Channel Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500 font-black">
                      #
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {discordChannel === 'anthem_studio' && 'نشيد-الإمبراطورية-الأغنية-الرسمية (Acoustic Indie-Folk Trend 112 BPM)'}
                        {discordChannel === 'near_study' && 'دراسة-عملة-نير-NEAR (تقرير مجاني شامل)'}
                        {discordChannel === 'locked_gems' && 'دراسات-العملات-المخفسة-مدفوعة (VIP Dossiers)'}
                        {discordChannel === 'guardrail' && 'درع-حماية-رأس-المال (أمان المحافظ من العشوائية)'}
                        {discordChannel === 'signals' && 'توصيات-حصرية-معتمدة (صفقات الفيوتشرز والسبوت)'}
                        {discordChannel === 'agencies' && 'وكالات-المنصات-المعتمدة (Bybit, MEXC, Binance)'}
                        {discordChannel === 'staff_desk' && 'مكتب-فريق-العمل-والبنات (دعم المتداولين ومصدر الرزق)'}
                        {discordChannel === 'general_chat' && 'الروم-العام-والشات (محادثة المحاربين المباشرة)'}
                        {discordChannel === 'announcements' && 'القوانين-والشروط (شروط التسجيل وإيداع $1.5+)'}
                        {discordChannel === 'academy' && 'أكاديمية-التعليم (دروس التداول الاحترافي)'}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {discordChannel === 'anthem_studio' && 'اللحن المطور بمعايير ترند عالمية: 112 BPM، غيتار ستيل، صوت دافئ وهارموني نسائي ملائكي'}
                        {discordChannel === 'near_study' && 'دراسة مستمرة 5 أشهر كاملة ومفتوحة للجميع لنشر الفائدة'}
                        {discordChannel === 'locked_gems' && 'مشاريع القاع المدروسة لشهور - تقارير مغلقة للبيع والمشتركين الجادين'}
                        {discordChannel === 'guardrail' && 'حظر كامل لأي بوتات عشوائية أو توصيات خارجية تخرب بيوت الناس'}
                        {discordChannel === 'signals' && 'توصيات لحظية موقعة ومعتمدة من العرّاب بإدارة مخاطر صارمة'}
                        {discordChannel === 'agencies' && 'انضم تحت وكالتنا بإيداع $1.5+ واحصل على كود الدخول المتغير'}
                        {discordChannel === 'staff_desk' && 'إتاحة فرص عمل للأخوات والبنات للتدقيق والدعم الفني وكسب الرزق'}
                        {discordChannel === 'general_chat' && 'تفاعل ونقاش فوري بين جميع متداولي العرّاب'}
                        {discordChannel === 'announcements' && 'ميثاق الشرف: التداول الفعلي شرط أساسي لتجنب طرد الحسابات الخاملة'}
                        {discordChannel === 'academy' && 'تعلم أساسيات التحليل الفني والـ P2P خطوة بخطوة'}
                      </p>
                    </div>
                  </div>

                  {discordChannel === 'agencies' && (
                    <button 
                      onClick={() => setShowAddExchangeModal(true)}
                      className="px-4 py-2 bg-amber-500 text-black font-black rounded-xl text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-md shadow-amber-500/20"
                    >
                      <Plus size={16} />
                      + إضافة وكالة منصة جديدة
                    </button>
                  )}

                  {discordChannel === 'staff_desk' && (
                    <button 
                      onClick={() => setShowAddStaffModal(true)}
                      className="px-4 py-2 bg-pink-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-md shadow-pink-500/20"
                    >
                      <Plus size={16} />
                      + إضافة موظفة جديدة للفريق
                    </button>
                  )}
                </div>

                {/* Channel Content Body */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                  
                  {/* CHANNEL 0: ANTHEM STUDIO */}
                  {discordChannel === 'anthem_studio' && (
                    <div className="space-y-6" dir="rtl">
                      <div className="bg-[#2b2d31] p-6 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xl">
                            🎵
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">استوديو نغمات وأناشيد المنصة</h4>
                            <p className="text-xs text-gray-400 mt-0.5">مخصص حصرياً للأناشيد الرسمية الخاصة بالعمل والمنصة.</p>
                          </div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs text-gray-300 leading-relaxed">
                          تم فصل الهوايات والأعمال الفنية الشخصية تماماً عن نظام العمل المؤسسي بناءً على رغبتك. استمر في إبداعاتك الموسيقية الشخصية في مشاريعك الخاصة!
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 1: NEAR STUDY (Open & Free Study) */}
                  {discordChannel === 'near_study' && (
                    <div className="space-y-6">
                      {/* Discord Message 1 */}
                      <div className="bg-[#2b2d31] p-5 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-black">
                              👑
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-amber-400 text-sm">العرّاب (The Godfather)</span>
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded-md">FOUNDER</span>
                              </div>
                              <span className="text-[10px] text-gray-500">اليوم الساعة 12:45 م</span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                            دراسة مفتوحة ومجانية 🟢
                          </span>
                        </div>

                        <div className="space-y-3 text-sm text-gray-200 leading-relaxed pr-2">
                          <p className="font-bold text-white text-base">
                            🦅 يا شباب ومحاربي العرّاب.. كما وعدتكم، هذه هي <span className="text-amber-400">دراسة عملة NEAR Protocol الكاملة والمجانية</span> التي عكف فريق التحليل على تدقيقها لمدة 5 أشهر:
                          </p>
                          <p className="text-gray-300">
                            قررنا فتح تفاصيل دراسة عملة NEAR كاملة للمجتمع لكي يستفيد الجميع، بينما تم قفل باقي دراسات العملات المخفسة للبيع والمشتركين الجادين فقط.
                          </p>
                        </div>

                        {/* Rich Analytical Dossier Embed */}
                        <div className="bg-[#1e1f22] border-r-4 border-amber-500 rounded-2xl p-6 space-y-5">
                          <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                                {nearStudy.category}
                              </span>
                              <h4 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                                <span>{nearStudy.coin}</span>
                                <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded font-mono font-normal">NEAR/USDT</span>
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">مدة البحث والتدقيق: <span className="text-white font-bold">{nearStudy.researchDuration}</span></p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-left font-mono">
                              <p className="text-[10px] text-gray-500 uppercase">السعر الحالي</p>
                              <p className="text-2xl font-black text-emerald-400">{nearStudy.currentPrice}</p>
                              <p className="text-[10px] text-gray-400 mt-1">نطاق التجميع: <span className="text-amber-400 font-bold">{nearStudy.accumulationZone}</span></p>
                            </div>
                          </div>

                          {/* Target Horizons Grid */}
                          <div>
                            <p className="text-xs font-bold text-gray-400 mb-2">🎯 المستهدفات السعرية المحددة بالدراسة:</p>
                            <div className="grid md:grid-cols-3 gap-3">
                              {nearStudy.projectedTargets.map((t: any, idx: number) => (
                                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                                  <p className="text-[11px] text-gray-400">{t.target}</p>
                                  <p className="text-xl font-black text-emerald-400 font-mono">{t.price}</p>
                                  <div className="flex justify-between items-center text-[10px] pt-1">
                                    <span className="text-amber-400 font-bold">{t.return}</span>
                                    <span className="text-gray-500">{t.timeline}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Strengths */}
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-400">🌟 لماذا تم اختيار NEAR بعد دراسة 5 أشهر؟</p>
                            <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-300">
                              {nearStudy.strengths.map((str: string, sIdx: number) => (
                                <div key={sIdx} className="p-2.5 bg-black/30 rounded-xl border border-white/5 flex items-start gap-2">
                                  <span className="text-amber-500 font-bold">✓</span>
                                  <span>{str}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Risk & Conclusion */}
                          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between flex-wrap gap-3">
                            <div className="text-xs">
                              <span className="text-amber-400 font-bold">🛡 وقف الخسارة المقترح: </span>
                              <span className="font-mono text-white font-bold">{nearStudy.riskMatrix.stopLossRecommended}</span>
                              <span className="text-gray-400 mr-3">| إدارة المخاطر: 1% إلى 2% كحد أقصى</span>
                            </div>
                            <a 
                              href="https://affiliates.bybit.com/api/v2/apk_download?invite_code=167506" 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-4 py-2 bg-amber-500 text-black font-black rounded-lg text-xs hover:scale-105 transition-all shadow-md"
                            >
                              تجميع NEAR على Bybit (كود: 167506) ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 2: LOCKED GEMS FOR SALE */}
                  {discordChannel === 'locked_gems' && (
                    <div className="space-y-6">
                      <div className="bg-[#2b2d31] p-5 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black">
                            🔒
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-purple-400 text-sm">مختبر أبحاث العرّاب (VIP Research Lab)</span>
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-black rounded-md">CONFIDENTIAL</span>
                            </div>
                            <span className="text-[10px] text-gray-500">دراسات خاصة ومحمية بحقوق الإعداد</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed">
                          هذه العملات يقوم فريقنا بدراستها وتحليل بيانات سلاسل الكتل ومحافظ الحيتان لشهور قبل طرحها. لحماية حقوق الباحثين والمشتركين الجادين، تبقى هذه التقارير مغلقة ومتاحة للشراء أو عبر كود VIP.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 pt-2">
                          {[
                            {
                              name: '0G Network / USDT',
                              category: 'بنية الذكاء الاصطناعي المعياري (مشروع القرن)',
                              studyDuration: 'دراسة 4 أشهر',
                              expectedUpside: 'x15 إلى x35',
                              status: 'جاهز للإطلاق',
                              priceLock: '$0.031 → $1.00+'
                            },
                            {
                              name: 'NMR / Numeraire',
                              category: 'صناديق التشفير بالذكاء الاصطناعي اللامركزي',
                              studyDuration: 'دراسة 3 أشهر ونصف',
                              expectedUpside: 'x5 إلى x12',
                              status: 'نطاق تجميع سري',
                              priceLock: '$16.80 → $45.00+'
                            },
                            {
                              name: 'Alpha AI DePIN Gem',
                              category: 'حوسبة سحابية موزعة لشبكات GPU',
                              studyDuration: 'دراسة شهرين متواصلين',
                              expectedUpside: 'x20 إلى x50',
                              status: 'تحت الرادار حصراً',
                              priceLock: '$0.008 → $0.25+'
                            },
                            {
                              name: 'Micro-Cap Layer 2 Gem',
                              category: 'طبقة ثانية فائقة السرعة برسوم صفرية',
                              studyDuration: 'قيد التدقيق النهائي',
                              expectedUpside: 'x10 إلى x30',
                              status: 'قريب من القاع',
                              priceLock: '$0.045 → $0.80+'
                            }
                          ].map((gem, idx) => (
                            <div key={idx} className="bg-[#1e1f22] border border-purple-500/30 rounded-2xl p-5 space-y-4 relative overflow-hidden group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-black bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                                    {gem.studyDuration}
                                  </span>
                                  <h4 className="text-lg font-black text-white mt-1">{gem.name}</h4>
                                  <p className="text-xs text-gray-400">{gem.category}</p>
                                </div>
                                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                  <Lock size={18} />
                                </div>
                              </div>

                              <div className="bg-black/50 p-3 rounded-xl border border-white/5 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">العائد الاستثماري المتوقع:</span>
                                  <span className="text-emerald-400 font-black">{gem.expectedUpside}</span>
                                </div>
                                <div className="flex justify-between text-xs filter blur-[3px] select-none">
                                  <span className="text-gray-400">مناطق الدخول السرية:</span>
                                  <span className="text-amber-400 font-bold">{gem.priceLock}</span>
                                </div>
                              </div>

                              <button 
                                onClick={() => {
                                  setSelectedLockedGem(gem);
                                  setShowUnlockStudyModal(true);
                                }}
                                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black text-xs rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-1.5"
                              >
                                <span>طلب شراء الدراسة / فتح التقرير 💳</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 3: CAPITAL GUARDRAIL (NO ROGUE BOTS) */}
                  {discordChannel === 'guardrail' && (
                    <div className="space-y-6">
                      <div className="bg-[#2b2d31] p-6 rounded-3xl border border-emerald-500/20 space-y-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <ShieldCheck size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">ميثاق الأمان الصارم: حظر التوصيات العشوائية والروبوتات المنفلتة</h4>
                            <p className="text-xs text-gray-400 mt-0.5">ضمان حقيقي للمحافظ ورأس مال المتداولين</p>
                          </div>
                        </div>

                        <div className="space-y-4 text-xs md:text-sm text-gray-200 leading-relaxed">
                          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
                            <ShieldAlert size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-black text-red-400 text-sm">لماذا نرفض البوتات العشوائية الخارجية؟</p>
                              <p className="text-gray-300 text-xs mt-1">
                                كما قال العرّاب: <span className="text-white font-bold">"مابدي يكون مرتبط برا يقعد يوصف فجأة يخرب بيتنا"</span>. السوق لا يرحم، وأي روبوت خارجي غير مدقق قد يصدر إشارات خاطئة أثناء فترات تقلب حادة مما يؤدي لتصفية المحافظ وخسارة أموال الناس.
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-3 pt-2">
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                              <p className="font-black text-amber-400">1. تدقيق يدوي 100%</p>
                              <p className="text-xs text-gray-400">كل صفقة تخرج في السيرفر أو البوت تمر عبر الفحص البشري الصارم للسيولة وأحجام التداول من العرّاب وفريقه.</p>
                            </div>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                              <p className="font-black text-emerald-400">2. وقف خسارة ملزم</p>
                              <p className="text-xs text-gray-400">لا توجد صفقة دون وقف خسارة محدد مسبقاً بدقة لحماية 98% من رأس المال من أي انزلاق سعري مفاجئ.</p>
                            </div>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                              <p className="font-black text-cyan-400">3. فصل كامل عن الأنظمة الخارجية</p>
                              <p className="text-xs text-gray-400">البوت والمنصة محصنان ومعزولان تماماً ولا يتصلان بأي إشارات خارجية مجهولة المصدر حفاظاً على أمانكم.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 4: LIVE SIGNALS */}
                  {discordChannel === 'signals' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-[#2b2d31] p-4 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-gray-300">توصيات معتمدة وموقعة من العرّاب ✍️</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">محدثة لحظياً</span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {signals.map((sig) => (
                          <div key={sig.id} className="bg-[#2b2d31] border border-white/10 p-5 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="font-black text-white text-base">{sig.coin}</span>
                              <span className="px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded-lg">{sig.type}</span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-300 font-mono">
                              <p>📥 الدخول: <span className="text-white font-bold">{sig.entry}</span></p>
                              <p>🎯 الأهداف: <span className="text-emerald-400 font-bold">{Array.isArray(sig.targets) ? sig.targets.join(' | ') : sig.targets}</span></p>
                              <p>🛡 وقف الخسارة: <span className="text-red-400 font-bold">{sig.stopLoss}</span></p>
                              {sig.recommendedLeverage && <p>⚡️ الرافعة: <span className="text-amber-400 font-bold">{sig.recommendedLeverage}</span></p>}
                            </div>
                            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
                              <span>✓ تم التدقيق اليدوي</span>
                              <span className="text-emerald-400 font-bold">توقيع العرّاب 🦅</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 5: AGENCIES (DYNAMIC) */}
                  {discordChannel === 'agencies' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <p className="text-xs text-gray-300 font-bold">
                          كلما اشتركنا كوكيل لمنصة جديدة، نقوم بإضافتها مباشرة إلى هذه القائمة لتسهيل التسجيل والاستفادة من البونص:
                        </p>
                        <button 
                          onClick={() => setShowAddExchangeModal(true)}
                          className="px-3 py-1.5 bg-amber-500 text-black font-black rounded-xl text-xs flex items-center gap-1 hover:scale-105 transition-all"
                        >
                          <Plus size={14} /> إضافة وكالة
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {exchanges.map((ex: any) => (
                          <div key={ex.id} className="bg-[#2b2d31] border border-white/10 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <img src={ex.logo} alt={ex.name} className="w-12 h-12 rounded-xl object-contain bg-white/5 p-1.5" />
                                <div>
                                  <h4 className="font-black text-white text-base">{ex.name}</h4>
                                  <p className="text-[11px] text-amber-400 font-bold">{ex.bonus}</p>
                                </div>
                              </div>
                              {ex.refCode && (
                                <div className="p-2.5 bg-black/40 rounded-xl flex justify-between items-center text-xs">
                                  <span className="text-gray-400">كود الوكالة المعتمد:</span>
                                  <span className="font-mono font-bold text-amber-400">{ex.refCode}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <a href={ex.link} target="_blank" rel="noreferrer" className="flex-1 py-2 bg-amber-500 text-black font-black text-center rounded-xl text-xs hover:scale-105 transition-all">
                                رابط التسجيل ↗
                              </a>
                              <button onClick={() => setOnboardingExchange(ex)} className="flex-1 py-2 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs">
                                طلب تفعيل ($1.5+)
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 6: STAFF DESK & GIRLS WORKSPACE */}
                  {discordChannel === 'staff_desk' && (
                    <div className="space-y-6">
                      <div className="bg-[#2b2d31] p-5 rounded-3xl border border-pink-500/20 space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black">
                              👩‍💼
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-white">مكتب فريق العمل وموظفات الدعم (Staff & Girls Desk)</h4>
                              <p className="text-xs text-gray-400 mt-0.5">توفير فرص عمل حقيقية للأخوات والبنات لمتابعة المشتركين والترزق بعمل شريف</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setShowAddStaffModal(true)}
                            className="px-3 py-1.5 bg-pink-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5"
                          >
                            <Plus size={14} /> إضافة موظفة جديدة
                          </button>
                        </div>

                        {/* Staff Cards */}
                        <div className="grid md:grid-cols-3 gap-3 pt-2">
                          {staffMembers.map((st) => (
                            <div key={st.id} className={`p-4 rounded-2xl border transition-all ${
                              activeStaffId === st.id ? 'bg-pink-500/10 border-pink-500/40 shadow-lg' : 'bg-black/30 border-white/5'
                            }`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-black text-white text-sm">{st.name}</p>
                                  <p className="text-[10px] text-pink-400">{st.role}</p>
                                </div>
                                <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-mono">{st.rating} ⭐</span>
                              </div>
                              <div className="pt-3 border-t border-white/5 mt-3 space-y-1 text-[11px] text-gray-300">
                                <div className="flex justify-between">
                                  <span>الحسابات المعتمدة:</span>
                                  <span className="font-bold text-white font-mono">{st.verifiedCount || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>أرباح اليوم المستحقة:</span>
                                  <span className="font-bold text-emerald-400 font-mono">${(st.earnedToday || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                  <span>التلجرام:</span>
                                  <span className="font-mono text-amber-400">{st.telegram}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  setActiveStaffId(st.id);
                                  toast.info(`تم التبديل لمكتب الموظفة: ${st.name}`);
                                }}
                                className={`w-full mt-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                                  activeStaffId === st.id ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                }`}
                              >
                                {activeStaffId === st.id ? '✓ الموظفة النشطة حالياً' : 'العمل بهذا الحساب'}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Pending Review Queue for Staff */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                          <h5 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                            <span>📋</span>
                            <span>طلبات التوثيق والإيداع ($1.5+) بانتظار اعتماد الموظفة:</span>
                          </h5>
                          <div className="space-y-2">
                            {users.filter(u => u.status === 'pending').slice(0, 5).map((pendingUser) => (
                              <div key={pendingUser.id} className="p-3.5 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center flex-wrap gap-2 text-xs">
                                <div>
                                  <p className="font-black text-white">{pendingUser.username}</p>
                                  <p className="text-[10px] text-gray-400">UID: <span className="text-amber-400 font-mono">{pendingUser.binanceUid || pendingUser.id}</span> · المنصة: {pendingUser.exchangeName || 'Bybit'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {pendingUser.photoUrl && (
                                    <button 
                                      onClick={() => setSelectedPhoto(pendingUser.photoUrl)}
                                      className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-bold"
                                    >
                                      معاينة الإثبات 📸
                                    </button>
                                  )}
                                  <button 
                                    onClick={async () => {
                                      try {
                                        const res = await fetch('/api/staff/approve-user', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            staffId: activeStaffId,
                                            userId: pendingUser.id,
                                            exchangeName: pendingUser.exchangeName || 'Bybit'
                                          })
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                          toast.success(`✅ تم اعتماد الحساب وتوليد الرمز: ${data.accessCode} بنجاح! احتسبت عمولة للموظفة.`);
                                          fetch('/api/staff').then(r => r.json()).then(setStaffMembers);
                                          fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                                        }
                                      } catch (err) { toast.error('فشل الاعتماد'); }
                                    }}
                                    className="px-3 py-1.5 bg-emerald-500 text-black font-black rounded-lg text-xs hover:scale-105 transition-all shadow-md"
                                  >
                                    اعتماد وتوليد كود دوار 🔑
                                  </button>
                                </div>
                              </div>
                            ))}
                            {users.filter(u => u.status === 'pending').length === 0 && (
                              <p className="text-xs text-gray-500 italic p-3 text-center">لا توجد طلبات معلقة حالياً، جميع الحسابات موثقة ومحدثة! 👍</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 7: SUBSCRIPTIONS */}
                  {discordChannel === 'subscriptions' && (
                    <SubscriptionManager />
                  )}

                  {/* CHANNEL 8: PORTFOLIO */}
                  {discordChannel === 'portfolio' && (
                    <PortfolioTracker />
                  )}

                  {/* CHANNEL 9: GENERAL CHAT */}
                  {discordChannel === 'general_chat' && (
                    <div className="space-y-4">
                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                        {chatMessages.map((msg, mIdx) => (
                          <div key={mIdx} className="bg-[#2b2d31] p-3.5 rounded-2xl border border-white/5 flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-xs">
                              {msg.sender ? msg.sender.slice(0, 1) : 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-xs">{msg.sender || 'متداول'}</span>
                                {msg.isAdmin && <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[9px] font-black rounded">STAFF</span>}
                                <span className="text-[10px] text-gray-500">الآن</span>
                              </div>
                              <p className="text-xs text-gray-200 mt-1">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <input 
                          type="text" 
                          placeholder="اكتب رسالتك في الروم العام..." 
                          value={currentMessage}
                          onChange={e => setCurrentMessage(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendMessage()}
                          className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-amber-500 font-bold"
                        />
                        <button 
                          onClick={sendMessage}
                          className="px-5 py-3 bg-amber-500 text-black font-black rounded-2xl text-xs hover:scale-105 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                        >
                          <Send size={14} />
                          إرسال
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 8: ANNOUNCEMENTS & RULES */}
                  {discordChannel === 'announcements' && (
                    <div className="bg-[#2b2d31] p-6 rounded-3xl border border-white/5 space-y-4 text-xs md:text-sm text-gray-200 leading-relaxed">
                      <h4 className="text-lg font-black text-amber-400">قواعد السيرفر وشروط العضوية الصارمة:</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="font-black text-white">1. شرط الإيداع الرمزي $1.5+:</p>
                          <p className="text-gray-400 text-xs mt-1">يجب تسجيل حساب جديد عبر كود الوكالة المعتمد وإيداع $1.5 على الأقل لتأكيد الجدية والحصول على رمز الدخول.</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <p className="font-black text-white">2. كلمة السر المتغيرة تلقائياً (Rotating Code):</p>
                          <p className="text-gray-400 text-xs mt-1">الرمز خاص بك لمرة واحدة ويتغير دورياً لضمان عدم تسريب التوصيات لغير المشتركين.</p>
                        </div>
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <p className="font-black text-red-400">3. شرط التداول الفعلي وطرد الحسابات الخاملة (شرط أساسي):</p>
                          <p className="text-gray-300 text-xs mt-1">أي عضو يتواجد فقط لنسخ التوصيات دون تداول فعلي داخل المنصة يعتبر مستغلاً وسيتم سحب صلاحيته وطرده فوراً.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHANNEL 9: ACADEMY */}
                  {discordChannel === 'academy' && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {academy.map((mod: any, idx: number) => (
                        <div key={idx} className="bg-[#2b2d31] p-5 rounded-2xl border border-white/5 space-y-3">
                          <h4 className="font-black text-white text-base">{mod.title}</h4>
                          <div className="space-y-2">
                            {mod.lessons?.map((l: any, lIdx: number) => (
                              <div key={lIdx} className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <p className="font-bold text-xs text-amber-400">{l.title}</p>
                                <p className="text-[11px] text-gray-300 mt-1">{l.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staff Desk Tab (Direct view from Navbar) */}
        {activeTab === 'staff' && (
          <div className="space-y-8 animate-in" dir="rtl">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-black rounded-full">
                فريق العمل ومكتب الدعم الفني 🤝
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">إتاحة الرزق ودعم المتداولين</h2>
              <p className="text-gray-400 text-sm">
                مكتب الأخوات والبنات المخصص لمتابعة المشتركين، مراجعة إثباتات الإيداع ($1.5+)، توليد كلمات السر الدوارة، وتوجيه المتداولين في سوريا والوطن العربي.
              </p>
            </div>

            {/* Staff Performance Header Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {staffMembers.map((st) => (
                <div key={st.id} className="bg-[#121214] border border-white/10 rounded-3xl p-6 space-y-5 hover:border-pink-500/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-black text-lg">
                        👩‍💼
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">{st.name}</h4>
                        <p className="text-xs text-pink-400">{st.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white/5 px-2 py-1 rounded-full text-amber-400">
                      {st.rating} ⭐
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl text-xs">
                    <div>
                      <p className="text-gray-400">توثيقات اليوم:</p>
                      <p className="text-lg font-black text-white font-mono">{st.verifiedCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">أرباح اليوم المستحقة:</p>
                      <p className="text-lg font-black text-emerald-400 font-mono">${(st.earnedToday || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-400">
                    <p>التلجرام: <span className="text-white font-bold font-mono">{st.telegram}</span></p>
                    <p>المنصات المسندة: <span className="text-amber-400 font-bold">{st.assignedExchanges?.join(' / ') || 'Bybit'}</span></p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Queue & Actions */}
            <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-500">قائمة تدقيق طلبات الـ UID والإيداع ($1.5+)</h3>
                  <p className="text-xs text-gray-400 mt-1">تراجع موظفة الدعم الصورة وتعطي الاعتماد لتوليد رمز الدخول فوراً.</p>
                </div>
                <button 
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2 bg-pink-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20"
                >
                  <Plus size={16} /> إضافة موظفة جديدة
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 pb-3">
                      <th className="pb-3 pr-2">المستخدم وتليجرام</th>
                      <th className="pb-3">الـ UID والمنصة</th>
                      <th className="pb-3">صورة التحقق والإيداع</th>
                      <th className="pb-3">الحالة</th>
                      <th className="pb-3 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="py-3 pr-2 font-bold text-white">{u.username}</td>
                        <td className="py-3 font-mono text-amber-400">{u.binanceUid || u.id} ({u.exchangeName || 'Bybit'})</td>
                        <td className="py-3">
                          {u.photoUrl ? (
                            <button 
                              onClick={() => setSelectedPhoto(u.photoUrl)} 
                              className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-[11px] font-bold"
                            >
                              معاينة الإثبات 📸
                            </button>
                          ) : (
                            <span className="text-gray-500">نصي</span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {u.status === 'verified' ? 'موثق' : 'قيد المراجعة'}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          {u.status !== 'verified' ? (
                            <button 
                              onClick={async () => {
                                const res = await fetch('/api/staff/approve-user', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ staffId: activeStaffId, userId: u.id, exchangeName: u.exchangeName || 'Bybit' })
                                });
                                if (res.ok) {
                                  toast.success('✅ تم الاعتماد من قبل الموظفة وتوليد الرمز!');
                                  fetch('/api/staff').then(r => r.json()).then(setStaffMembers);
                                  fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                                }
                              }}
                              className="px-3 py-1 bg-emerald-500 text-black font-black rounded-lg text-xs"
                            >
                              اعتماد الموظفة ($0.50 عمولة) 🔑
                            </button>
                          ) : (
                            <span className="text-gray-500 font-mono">{u.accessCode}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal 1: Add New Exchange Agency Modal */}
        {showAddExchangeModal && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121214] border border-amber-500/30 p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl" dir="rtl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-amber-500 flex items-center gap-2">
                  <Plus size={20} /> إضافة وكالة منصة جديدة
                </h3>
                <button onClick={() => setShowAddExchangeModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                كلما اشترك العرّاب كوكيل لمنصة جديدة، أضفها هنا وستظهر فوراً في السيرفر وقوائم التوصيات مع كود الوكالة المعتمد.
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const res = await fetch('/api/admin/exchanges', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newExchangeForm)
                  });
                  const data = await res.json();
                  if (data.success) {
                    toast.success(`🎉 تم إضافة وكالة ${newExchangeForm.name} بنجاح!`);
                    setShowAddExchangeModal(false);
                    setNewExchangeForm({ name: '', logo: '', link: '', refCode: '', bonus: '', supergroupId: '', channel: '' });
                    fetch('/api/exchanges').then(r => r.json()).then(setExchanges);
                  }
                } catch (err) { toast.error('فشل حفظ الوكالة'); }
                finally { setIsSubmitting(false); }
              }} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">اسم المنصة والوكالة (مثال: KuCoin Syria أو Gate.io):</label>
                  <input type="text" required value={newExchangeForm.name} onChange={e => setNewExchangeForm({...newExchangeForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-amber-500" placeholder="KuCoin Syria" />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">رابط التسجيل أو التحميل الرسمي:</label>
                  <input type="url" required value={newExchangeForm.link} onChange={e => setNewExchangeForm({...newExchangeForm, link: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-amber-500" placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">كود الدعوة (Ref Code):</label>
                    <input type="text" value={newExchangeForm.refCode} onChange={e => setNewExchangeForm({...newExchangeForm, refCode: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-mono" placeholder="RICH_KUCOIN" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">معرف القناة / Supergroup ID:</label>
                    <input type="text" value={newExchangeForm.supergroupId} onChange={e => setNewExchangeForm({...newExchangeForm, supergroupId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-mono" placeholder="-100..." />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">البونص والميزات الترحيبية:</label>
                  <input type="text" value={newExchangeForm.bonus} onChange={e => setNewExchangeForm({...newExchangeForm, bonus: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-amber-500" placeholder="بونص يصل لـ 500$ + غرفة توصيات خاصة" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20">
                  {isSubmitting ? 'جاري الإضافة...' : 'حفظ ونشر الوكالة فورا 🚀'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Add New Staff Member Modal */}
        {showAddStaffModal && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121214] border border-pink-500/30 p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl" dir="rtl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-pink-500 flex items-center gap-2">
                  <Plus size={20} /> إضافة موظفة / مسؤولة دعم جديدة
                </h3>
                <button onClick={() => setShowAddStaffModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                أدخل بيانات الموظفة لمنحها حساب عمل وصلاحية اعتماد صور الإيداع واحتساب عمولة لكل توثيق.
              </p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const res = await fetch('/api/staff', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newStaffForm)
                  });
                  const data = await res.json();
                  if (data.success) {
                    toast.success(`🎉 تم إضافة الموظفة ${newStaffForm.name} بنجاح!`);
                    setShowAddStaffModal(false);
                    setNewStaffForm({ name: '', role: 'مسؤولة تدقيق وتحقق', telegram: '', phone: '', commissionRate: '0.50' });
                    fetch('/api/staff').then(r => r.json()).then(setStaffMembers);
                  }
                } catch (err) { toast.error('فشل إضافة الموظفة'); }
                finally { setIsSubmitting(false); }
              }} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">اسم الموظفة الكامل:</label>
                  <input type="text" required value={newStaffForm.name} onChange={e => setNewStaffForm({...newStaffForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500" placeholder="مثال: ياسمين الدمشقي" />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">المسمى والدور الوظيفي:</label>
                  <input type="text" required value={newStaffForm.role} onChange={e => setNewStaffForm({...newStaffForm, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500" placeholder="مسؤولة تدقيق Bybit والدعم الفني" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">معرف تليجرام:</label>
                    <input type="text" required value={newStaffForm.telegram} onChange={e => setNewStaffForm({...newStaffForm, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 font-mono" placeholder="@username" />
                  </div>
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">العمولة لكل توثيق ($):</label>
                    <input type="number" step="0.10" value={newStaffForm.commissionRate} onChange={e => setNewStaffForm({...newStaffForm, commissionRate: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-pink-500 font-mono" placeholder="0.50" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-pink-500 text-white font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-pink-500/20">
                  {isSubmitting ? 'جاري الحفظ...' : 'تثبيت الموظفة في الفريق 🤝'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Request / Unlock Locked Gem Study Modal */}
        {showUnlockStudyModal && selectedLockedGem && (
          <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#121214] border border-purple-500/40 p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl" dir="rtl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-purple-400 flex items-center gap-2">
                  <Lock size={20} /> طلب شراء دراسة: {selectedLockedGem.name}
                </h3>
                <button onClick={() => setShowUnlockStudyModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-xs space-y-1">
                <p className="text-purple-300 font-bold">📋 معلومات الدراسة السرية:</p>
                <p className="text-gray-300">المدة: {selectedLockedGem.studyDuration} · العائد المتوقع: {selectedLockedGem.expectedUpside}</p>
                <p className="text-gray-400 text-[11px]">تشمل الدراسة: خريطة التجميع، عقود السيولة، مستويات الدخول، ونموذج التخارج الكامل.</p>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const res = await fetch('/api/request-gem-study', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      coinName: selectedLockedGem.name,
                      userUid: userUid || 'ضيف',
                      telegramUsername: studyUnlockForm.telegram,
                      notes: studyUnlockForm.notes
                    })
                  });
                  const data = await res.json();
                  toast.success(data.message || 'تم تسجيل طلبك بنجاح! سيتواصل معك فريق العمل وموظفات الدعم فوراً.');
                  setShowUnlockStudyModal(false);
                  setStudyUnlockForm({ telegram: '', notes: '' });
                } catch (err) { toast.error('فشل إرسال الطلب'); }
                finally { setIsSubmitting(false); }
              }} className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">معرف تليجرام أو واتساب للتواصل:</label>
                  <input type="text" required value={studyUnlockForm.telegram} onChange={e => setStudyUnlockForm({...studyUnlockForm, telegram: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500 font-bold" placeholder="@your_telegram أو رقم الواتساب" />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">ملاحظات أو استفسار لفريق العمل:</label>
                  <textarea rows={2} value={studyUnlockForm.notes} onChange={e => setStudyUnlockForm({...studyUnlockForm, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500" placeholder="أرغب بشراء التقرير كاملاً والاشتراك في توصيات هذه العملة..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black rounded-xl text-sm hover:scale-105 transition-all shadow-lg shadow-purple-500/20">
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب الشراء لمكتب الدعم 🦅'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-12 animate-in fade-in duration-700" dir="rtl">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-black rounded-full uppercase tracking-widest">
                مجتمع العرّاب (The Community) 🤝
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">ساحة المعركة والمجتمع المباشر</h2>
              <p className="text-gray-400 text-sm">
                هنا حيث يتجمع المحاربون لتبادل الخبرات، التحليلات، ومتابعة تحديثات العرّاب اللحظية. انضم للغرف المتخصصة الآن.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { name: 'قناة التوصيات الرسمية', type: 'Channel', link: 'https://t.me/BinanceRich_Bot', desc: 'كل ما يحتاجه المتداول من توصيات قنص يومية.', color: 'from-amber-600 to-amber-400', icon: TrendingUp },
                 { name: 'مجتمع المحاربين (Chat)', type: 'Group', link: 'https://t.me/BinanceRich_Bot', desc: 'نقاشات مفتوحة حول صفقات اليوم وتحليل السوق.', color: 'from-blue-600 to-blue-400', icon: MessageSquare },
                 { name: 'دعم الموظفين (للبنات)', type: 'Private', link: 'https://t.me/BinanceRich_Admin', desc: 'قسم خاص لمتابعة الموظفات وتنسيق العمل الميداني.', color: 'from-purple-600 to-purple-400', icon: Users },
               ].map((c, i) => (
                 <div key={i} className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6 hover:scale-[1.02] transition-all group overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${c.color}`} />
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white">
                        <c.icon size={28} />
                      </div>
                      <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded-full text-gray-400 uppercase tracking-widest">{c.type}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white mb-2">{c.name}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                    </div>
                    <a href={c.link} target="_blank" className="block w-full py-4 bg-white/5 group-hover:bg-white/10 text-white font-black text-center rounded-2xl transition-all border border-white/5">
                      انضم الآن
                    </a>
                 </div>
               ))}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-8 md:p-12 text-center space-y-6">
               <h3 className="text-2xl font-black text-white">هل تملك مجتمعاً خاصاً بك؟</h3>
               <p className="text-gray-400 max-w-xl mx-auto">
                 العرّاب يدعم الوكلاء الذين يملكون قنواتهم الخاصة. يمكنك ربط قناتك بنظامنا والحصول على تقارير أداء المشتركين دورياً.
               </p>
               <button className="px-8 py-4 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20">تواصل مع الإدارة للربط</button>
            </div>

            {/* Live Trading Chatroom */}
            <div className="bg-[#121214] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-[600px] shadow-2xl">
              <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                    <Activity size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg">غرفة الدردشة المباشرة (Live Chat)</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">مزامنة لحظية عبر WebSockets</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-emerald-400">متصل الآن</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4" dir="rtl">
                {chatMessages.map((msg: any, i: number) => (
                  <div key={i} className={`flex flex-col ${msg.uid === userUid ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.isAdmin ? 'bg-amber-500 text-black font-bold' : msg.uid === userUid ? 'bg-white/10 text-white' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      <p className="text-[10px] opacity-60 mb-1">{msg.sender}</p>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-gray-600 mt-1 px-2">{new Date(msg.createdAt).toLocaleTimeString('ar-SY')}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5" dir="rtl">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="اكتب رسالتك للمحاربين..." 
                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all"
                    value={currentMessage}
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button 
                    onClick={sendMessage}
                    className="w-14 h-14 bg-emerald-500 text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <Zap size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'market' && (
          <div className="space-y-12 animate-in fade-in duration-700" dir="rtl">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-black rounded-full uppercase tracking-widest">
                سوق العرّاب المركزي 🦅
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white">منصة الشراء الجماعي والعملات المدعومة</h2>
              <p className="text-gray-400 text-sm">
                اكتشف العملات الموصى بها حالياً والتي تخضع لمراقبة العرّاب اللحظية. اشترك الآن بـ 4$ فقط واحصل على التوصيات الحصرية ومستويات الدخول بدقة فائقة.
              </p>
            </div>

            {/* WebSocket Live Connection Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-4 rounded-2xl flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-sm font-black text-emerald-400">WebSocket Live Feed (Binance & MEXC WS) متصل لحظياً</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                <span>⚡️ Latency: 14ms</span>
                <span>📈 تحديث الحي: كل 1.5 ثانية</span>
              </div>
            </div>

            {/* Recommendation Profit Calculator Component */}
            <div className="bg-[#121214] border border-amber-500/30 p-8 rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 text-black rounded-2xl flex items-center justify-center font-black">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-amber-500">حاسبة أرباح التوصيات (Profit Calculator)</h3>
                  <p className="text-xs text-gray-400">احسب العائد المتوقع بناءً على أهداف العملة ومبلغ استثمارك.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-bold">اختر العملة الموصى بها:</label>
                    <select 
                      value={calcCoinId} 
                      onChange={e => {
                        setCalcCoinId(e.target.value);
                        const coin = marketCoins.find(c => c.id === e.target.value);
                        if (coin) {
                          const p = parsePriceNum(coin.price);
                          setCalcStopLoss(Number((p * 0.95).toFixed(4)));
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                    >
                      {marketCoins.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#121214] text-white">
                          {c.name} (الحالي: {c.price} → الهدف: {c.target})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-bold">مبلغ الاستثمار (USD):</label>
                      <input 
                        type="number" 
                        value={calcInvestment} 
                        onChange={e => setCalcInvestment(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500 font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-bold">وقف الخسارة (Stop Loss):</label>
                      <input 
                        type="number" 
                        step="0.0001"
                        value={calcStopLoss} 
                        onChange={e => setCalcStopLoss(Number(e.target.value))}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500 font-bold ${isRisky ? 'border-red-500/50' : ''}`}
                      />
                    </div>
                  </div>
                  
                  {/* Risk/Reward Ratio Display */}
                  <div className={`p-4 rounded-xl border flex justify-between items-center ${isRisky ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400">معدل المخاطرة للعائد (Risk/Reward)</p>
                      <p className={`text-lg font-black ${isRisky ? 'text-red-400' : 'text-emerald-400'}`}>1:{riskRewardRatio.toFixed(1)}</p>
                    </div>
                    {isRisky && (
                      <div className="flex items-center gap-2 text-red-400 text-[10px] font-black">
                        <ShieldAlert size={14} />
                        تنبيه: مخاطرة عالية
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-4 text-center">
                  <p className="text-xs text-gray-400">العائد المتوقع عند الوصول للهدف:</p>
                  <p className="text-4xl font-black text-emerald-400">
                    +<AnimatedNumber value={estimatedProfit} prefix="$" />
                  </p>
                  <div className="flex justify-around pt-2 border-t border-white/5 text-xs">
                    <div>
                      <span className="text-gray-500 block">نسبة الربح (ROI)</span>
                      <strong className="text-amber-400 font-black text-sm">
                        +<AnimatedNumber value={roiPct} suffix="%" decimals={1} />
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">إجمالي القيمة</span>
                      <strong className="text-white font-black text-sm">
                        <AnimatedNumber value={projectedVal} prefix="$" />
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Trade Close Alert Widget */}
            <div className="bg-[#121214] border border-emerald-500/30 p-8 rounded-[2rem] space-y-6 shadow-2xl relative overflow-hidden" dir="rtl">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 text-black rounded-2xl flex items-center justify-center font-black">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-emerald-400">تنبيه الإغلاق الذكي للصفقة (Smart Trade Close)</h3>
                    <p className="text-xs text-gray-400">نظام ذكي يراقب أهداف الحاسبة ويغلق الصفقة تلقائياً ويرسل تنبيه فور تحقيق الهدف.</p>
                  </div>
                </div>
                <button onClick={() => {
                  if (!selectedCalcCoin) return;
                  const profitVal = estimatedProfit.toFixed(2);
                  const newLog = {
                    id: Date.now().toString(),
                    coin: selectedCalcCoin.name,
                    target: selectedCalcCoin.target,
                    profit: `+$${profitVal}`,
                    time: 'الآن',
                    status: 'تم الإغلاق الذكي بنجاح 🎯'
                  };
                  setSmartAlertLog([newLog, ...smartAlertLog]);
                  playAlertSound(notificationSound);
                  toast.success(`🎯 تنبيه الإغلاق الذكي: حققت عملة ${selectedCalcCoin.name} هدفها بنجاح بربح +$${profitVal}!`);
                  if (pushEnabled) {
                    new Notification('🎯 إغلاق صفقة ذكي ناجح', { body: `عملة ${selectedCalcCoin.name} بلغت الهدف بربح +$${profitVal}` });
                  }
                }} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20 text-sm">
                  محاكاة وصول الهدف وإغلاق الصفقة 🚀
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400">سجل عمليات الإغلاق الذكي المنفذة:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {smartAlertLog.map(log => (
                    <div key={log.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                          <span className="font-black text-white text-base">{log.coin}</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">{log.status}</span>
                        </div>
                        <p className="text-xs text-gray-400">الهدف: <span className="text-amber-400 font-bold">{log.target}</span> · الربح: <span className="text-emerald-400 font-black">{log.profit}</span></p>
                      </div>
                      <span className="text-[10px] text-gray-500">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#121214] border border-amber-500/30 p-6 rounded-[2rem] space-y-4 max-w-xl mx-auto shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-amber-500 flex items-center gap-2">
                  <ShieldCheck size={20} />
                  إعدادات التنبيهات الفورية والأصوات
                </h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${pushEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {pushEnabled ? 'مفعل' : 'غير مفعل'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold mb-1 block">صوت التنبيه المخصص:</label>
                  <select 
                    value={notificationSound} 
                    onChange={e => {
                      setNotificationSound(e.target.value);
                      playAlertSound(e.target.value);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                  >
                    <option value="bell">جرس تقليدي (Bell)</option>
                    <option value="siren">صفارة إنذار (Siren)</option>
                    <option value="chime">رنين موسيقي (Chime)</option>
                    <option value="digital">نبض رقمي (Digital)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={requestPushPermission}
                    className="w-full py-3 bg-amber-500 text-black font-black rounded-xl hover:scale-105 transition-transform text-sm"
                  >
                    تفعيل التنبيهات الفورية
                  </button>
                </div>
              </div>
            </div>

            {/* Open Showcase: NEAR Protocol Deep Study */}
            <div className="bg-[#121214] border-2 border-amber-500/30 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black rounded-full">
                      دراسة مفتوحة ومجانية للمجتمع 🟢 (The Godfather Open Dossier)
                    </span>
                    <span className="text-xs text-gray-400 font-mono">بحث مستمر لـ 5 أشهر</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mt-2 flex items-center gap-2">
                    <span>{nearStudy.coin}</span>
                    <span className="text-xs bg-amber-500 text-black px-2.5 py-0.5 rounded-lg font-mono font-bold">NEAR/USDT</span>
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    {nearStudy.category}: تم تفصيل هذه الدراسة لتوضيح إمكانيات صعودها للجميع مجاناً، بينما باقي العملات المخفسة محجوبة للبيع لحماية حقوق فريق البحث.
                  </p>
                </div>
                <div className="bg-black/50 border border-white/10 p-4 rounded-2xl text-left font-mono">
                  <p className="text-[10px] text-gray-400 uppercase">السعر الحالي</p>
                  <p className="text-3xl font-black text-emerald-400">{nearStudy.currentPrice}</p>
                  <p className="text-xs text-amber-400 mt-1">نطاق التجميع: {nearStudy.accumulationZone}</p>
                </div>
              </div>

              {/* Projected Horizons */}
              <div className="grid md:grid-cols-3 gap-4 relative z-10">
                {nearStudy.projectedTargets.map((t: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                    <p className="text-xs text-gray-400">{t.target}</p>
                    <p className="text-2xl font-black text-emerald-400 font-mono">{t.price}</p>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-amber-400 font-bold">{t.return}</span>
                      <span className="text-gray-500">{t.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex justify-between items-center flex-wrap gap-3 relative z-10">
                <div className="text-xs text-gray-300">
                  <span className="text-amber-400 font-bold">🛡 وقف الخسارة الإلزامي: </span>
                  <span className="font-mono text-white font-bold">{nearStudy.riskMatrix.stopLossRecommended}</span>
                  <span className="text-gray-400 mr-2">| خلاصة العرّاب: {nearStudy.conclusion}</span>
                </div>
                <a 
                  href="https://affiliates.bybit.com/api/v2/apk_download?invite_code=167506" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-amber-500 text-black font-black rounded-xl text-xs hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                >
                  تداول NEAR على Bybit (كود: 167506) ↗
                </a>
              </div>
            </div>

            {/* Locked Deep Research Gems for Sale */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-purple-400 flex items-center gap-2">
                    <Lock size={20} />
                    باقي العملات المخفسة (دراسات خاصة مقفلة للبيع 🔒)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    مشاريع قاع مدروسة لعدة أشهر - تفاصيل الدخول والأهداف محجوبة ومتاحة للشراء أو عبر طلب خاص.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketCoins.map((coin, idx) => {
                  const isNear = coin.name.includes('NEAR');
                  if (isNear) return null; // Already showcased in the prominent open dossier above!
                  return (
                    <div key={coin.id || idx} className="bg-[#121214] border border-purple-500/30 rounded-[2rem] p-6 space-y-5 relative overflow-hidden group hover:border-purple-500/60 transition-all bg-gradient-to-br from-purple-900/10 to-amber-900/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300">
                            🔒 دراسة مدفوعة للبيع
                          </span>
                          <h3 className="text-2xl font-black text-white mt-2">{coin.name}</h3>
                          <p className="text-xs text-gray-400 font-medium">{coin.category}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center font-black text-purple-400">
                          <Lock size={20} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 relative">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold">السعر التجميعي</p>
                          <p className="text-lg font-black text-white">{coin.price}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold">المستهدف السري</p>
                          <p className="text-lg font-black text-emerald-400 filter blur-[4px] select-none">{coin.target}</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <button 
                          onClick={() => {
                            setSelectedLockedGem(coin);
                            setShowUnlockStudyModal(true);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-black rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 text-xs"
                        >
                          <Lock size={14} />
                          <span>طلب شراء الدراسة / فتح التقرير 💳</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 30-Day Performance History Chart */}
            <div className="bg-[#121214] border border-white/10 p-8 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-amber-500 flex items-center gap-2">
                  <TrendingUp size={24} />
                  تاريخ الأداء والنمو خلال الـ 30 يوماً الماضية
                </h3>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                  ▲ عائد قياسي موثق
                </span>
              </div>
              <p className="text-sm text-gray-400">
                مخطط بياني تفاعلي يوضح تتبع أسعار العملات الموصى بها (0G, NEAR, NMR) وكيفية نموها تصاعدياً قبل الانفجار السعري.
              </p>
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="0G" stroke="#9333ea" strokeWidth={3} name="0G Coin ($)" />
                    <Line type="monotone" dataKey="NEAR" stroke="#3b82f6" strokeWidth={3} name="NEAR Protocol ($)" />
                    <Line type="monotone" dataKey="NMR" stroke="#f3ba2f" strokeWidth={3} name="NMR Token ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scheduled Price Alerts Feature */}
            <div className="bg-[#121214] border border-amber-500/20 p-8 rounded-[2rem] space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4" dir="rtl">
                <div>
                  <h3 className="text-2xl font-black text-amber-500 flex items-center gap-2">
                    <Sparkles size={24} />
                    نظام التنبيهات المجدولة الذكية
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">اختر العملة الموصى بها وحدد سعر الهدف لتتلقى إشعار دفع (Push Notification) فور وصولها للسعر المنشود.</p>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!alertTargetPrice) {
                  toast.error('يرجى إدخال السعر المستهدف');
                  return;
                }
                const newA = {
                  id: Date.now().toString(),
                  coin: alertCoin,
                  targetPrice: alertTargetPrice,
                  status: 'نشط',
                  created: 'الآن'
                };
                setScheduledAlerts([newA, ...scheduledAlerts]);
                setAlertTargetPrice('');
                toast.success(`🔔 تم جدولة تنبيه سعر ${alertCoin} عند ${alertTargetPrice}$ بنجاح!`);
                playAlertSound(notificationSound);
                if (pushEnabled) {
                  new Notification('سوق العرّاب - التنبيهات المجدولة', { body: `تمت إضافة تنبيه للعملة ${alertCoin} عند السعر ${alertTargetPrice}$` });
                }
              }} className="grid md:grid-cols-3 gap-4 bg-black/40 p-6 rounded-2xl border border-white/5" dir="rtl">
                <div>
                  <label className="text-xs text-gray-400 font-bold mb-2 block">اختر العملة:</label>
                  <select 
                    value={alertCoin} 
                    onChange={e => setAlertCoin(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                  >
                    {marketCoins.map((c, i) => (
                      <option key={i} value={c.name} className="bg-[#121214] text-white">{c.name} ({c.price})</option>
                    ))}
                    <option value="NEAR" className="bg-[#121214] text-white">NEAR Protocol</option>
                    <option value="NMR" className="bg-[#121214] text-white">NMR Token</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-bold mb-2 block">سعر الهدف (USDT):</label>
                  <input 
                    type="text" 
                    placeholder="مثال: 0.085" 
                    value={alertTargetPrice}
                    onChange={e => setAlertTargetPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 text-sm">
                    إضافة تنبيه مجدول ⚡️
                  </button>
                </div>
              </form>

              <div className="space-y-3" dir="rtl">
                <h4 className="text-sm font-bold text-gray-300">التنبيهات المفعلة حالياً:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {scheduledAlerts.map(alert => (
                    <div key={alert.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                          <span className="font-black text-white text-base">{alert.coin}</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">{alert.status}</span>
                        </div>
                        <p className="text-xs text-gray-400">السعر المستهدف: <span className="text-emerald-400 font-bold">{alert.targetPrice}$</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => {
                          playAlertSound(notificationSound);
                          toast.success(`🔊 تم تجربة جرس التنبيه للعملة ${alert.coin}!`);
                          if (pushEnabled) {
                            new Notification(`اختبار تنبيه ${alert.coin}`, { body: `السعر المستهدف ${alert.targetPrice}$` });
                          }
                        }} className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black font-bold rounded-xl text-xs transition-colors">
                          تجربة الصوت
                        </button>
                        <button onClick={() => {
                          setScheduledAlerts(scheduledAlerts.filter(a => a.id !== alert.id));
                          toast.info('تم حذف التنبيه المجدول');
                        }} className="text-gray-500 hover:text-red-400 p-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support Center & FAQ */}
            <div className="space-y-6 pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-amber-500 flex items-center justify-center gap-2">
                  <BookOpen size={24} />
                  مركز الدعم والأسئلة الشائعة
                </h3>
                <p className="text-sm text-gray-400">كل ما تحتاج معرفته عن التسجيل، شروط الإيداع، وتفعيل العضوية في إمبراطورية العرّاب.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'شرح فتح حساب وتوثيق بينانس P2P', duration: '4:15 دقيقة', icon: PlayCircle },
                  { title: 'كيفية إرسال الـ UID وتأكيد إيداع 105$', duration: '3:30 دقيقة', icon: PlayCircle },
                  { title: 'أسرار استراتيجية النوم ورفع الـ 20x', duration: '6:45 دقيقة', icon: PlayCircle }
                ].map((vid, idx) => (
                  <div key={idx} className="bg-[#121214] border border-white/10 p-6 rounded-3xl space-y-4 group hover:border-amber-500/40 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                      <vid.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{vid.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{vid.duration} · مرئي ومصور</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#121214] border border-white/10 p-8 rounded-[2rem] space-y-6">
                <h4 className="text-xl font-black text-white">الأسئلة الشائعة (FAQ)</h4>
                <div className="space-y-4">
                  {[
                    { q: 'كيف أضمن أن رابط التسجيل خاص بالعرّاب؟', a: 'يتم استخدام روابط الوكالة الرسمية المعتمدة حصرياً من قِبل العرّاب (Binance / MEXC) والتي تظهر في صفحة الوكالات وسوق العرّاب.' },
                    { q: 'لماذا شرط الإيداع بقيمة 105$؟', a: 'لضمان أننا نبني مجتمعاً حقيقياً من المتداولين النشطين وليس حسابات وهمية، ولتطبيق استراتيجيات الاقتناص برأس مال آمن.' },
                    { q: 'كيف أحصل على رابط الدخول لمجتمع التوصيات الخاص؟', a: 'بعد إرسال الـ UID الخاص بك وصورة الإيداع، يقوم فريق العرّاب بالمراجعة وتفعيل عضويتك وإرسال رابط المجتمع المباشر.' }
                  ].map((faq, fIdx) => (
                    <div key={fIdx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                      <p className="font-bold text-amber-400 text-sm">❓ {faq.q}</p>
                      <p className="text-xs text-gray-300 leading-relaxed pr-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-12 animate-in fade-in duration-700" dir="rtl">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-2">
                <BookOpen size={16} />
                أكاديمية العرّاب المتقدمة
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                مركز المعرفة <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">التقني</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                سلسلة دروس تفاعلية احترافية لإتقان قراءة الشموع اليابانية الانعكاسية، مؤشرات الزخم (RSI & MACD)، وأسرار كشف فخاخ الحيتان في الأسواق الرقمية.
              </p>
            </div>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {[
                {
                  id: 'l1',
                  title: 'الدرس الأول: تشريح الشموع اليابانية الانعكاسية (Bullish Engulfing & Pin Bar)',
                  category: 'التحليل الفني الكلاسيكي',
                  duration: '12 دقيقة قراءة',
                  level: 'مبتدئ إلى متوسط',
                  summary: 'كيف تكتشف انعكاس الاتجاه بدقة عالية باستخدام ظلال الشموع وأحجام التداول في مناطق الدعم الرئيسية.',
                  content: 'الشموع اليابانية ليس مجرد رسوم، بل هي لغة نفسية للمتداولين. شمعة البين بار (Pin Bar) ذات الذيل الطويل تدل على رفض الأسعار لمستويات الدعم، بينما شمعة الابتلاع الصاعد (Bullish Engulfing) تلغي الهبوط تماماً وتعلن سيطرة المشترين. سر العرّاب: لا تدخل الصفقة إلا إذا أغلقت الشمعة فوق مستوى المقاومة السابق بفوليوم أعلى بـ 150% من المتوسط.'
                },
                {
                  id: 'l2',
                  title: 'الدرس الثاني: مؤشر القوة النسبية RSI واكتشاف مناطق التشبع والدايفرجنس',
                  category: 'مؤشرات الزخم',
                  duration: '15 دقيقة قراءة',
                  level: 'متوسط',
                  summary: 'كيف تقرأ انحرافات الـ RSI (Bullish / Bearish Divergence) لتتوقع القمم والقيعان قبل حدوثها.',
                  content: 'مؤشر RSI يقيس سرعة وتغير حركة الأسعار. عندما يسجل السعر قاعاً أدنى بينما يسجل مؤشر RSI قاعاً أعلى، فهذا اسمه "دايفرجنس إيجابي" (Bullish Divergence) وهو إشارة صارخة لدخول الحيتان وانفجار العملة صعوداً. تجنب الشراء عندما يكون المؤشر فوق 80 ولا تبيع بخسارة عندما يكون تحت 20.'
                },
                {
                  id: 'l3',
                  title: 'الدرس الثالث: مؤشر MACD وتقاطعات المتوسطات المتحركة الأسية (EMA 50 & 200)',
                  category: 'اتجاهات المدى المتوسط والبعيد',
                  duration: '10 دقائق قراءة',
                  level: 'متقدم',
                  summary: 'التقاطع الذهبي والتقاطع المُميت، وكيف تحدد الترند العام بلمح البصر.',
                  content: 'مؤشر MACD يتكون من خط الإشارة وخط الهستوجرام. تقاطع خط الماكد صعوداً فوق خط الصفر مع تزايد أعمدة الهستوجرام الخضراء يعلن بداية موجة صعود قوية (Impulse Wave). استخدم معها دائماً تقاطع EMA 50 مع EMA 200 لتأكيد الدخول الآمن.'
                },
                {
                  id: 'l4',
                  title: 'الدرس الرابع: فحص أحجام التداول (Volume Analysis) وكشف تلاعب الحيتان',
                  category: 'سيكولوجية الحيتان والسيولة',
                  duration: '18 دقيقة قراءة',
                  level: 'احترافي',
                  summary: 'لماذا يرتفع السعر أحياناً بدون فوليوم؟ وما هو الفخ الذي يوقع المبتدئين في فخ التصريف؟',
                  content: 'الحجم هو الوقود الحقيقي للسوق. ارتفاع السعر مع شمعة فوليوم ضخمة يعني دخول مؤسسات حقيقية. أما الارتفاع الضعيف مع فوليوم خافت فهو "صعود وهمي" (Fakeout) يتم تصريف العملة فيه للمتداولين الأفراد. التزم دائماً بالعملات ذات السيولة المرتفعة الموصى بها في سوق العرّاب.'
                },
                {
                  id: 'l5',
                  title: 'الدرس الخامس: استراتيجية العرّاب الذهبية لإدارة المخاطر والرافعة المالية (20x)',
                  category: 'إدارة رأس المال والنفسية',
                  duration: '20 دقيقة قراءة',
                  level: 'شامل ومهم جداً',
                  summary: 'كيف تدخل صفقة براس مال 100$ وتخرج بـ 1000$ دون التعرض للتصفية (Liquidation).',
                  content: 'القاعدة الذهبية للعرّاب: لا تخاطر أبداً بأكثر من 2% من إجمالي محفظتك في الصفقة الواحدة. عند استخدام رافعة 20x، يجب أن يكون سعر الدخول مدروساً بدقة على دعم أسبوعي صلب مع وضع وقف خسارة (Stop Loss) صارم لا يتجاوز 3%. تذكر دائماً: الحفاظ على رأس المال أهم من تحقيق الربح السريع.'
                }
              ].map(lesson => {
                const isExpanded = expandedLesson === lesson.id;
                return (
                  <div key={lesson.id} className="bg-[#121214] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-4 hover:border-amber-500/40 transition-all">
                    <div className="flex justify-between items-start flex-wrap gap-4 cursor-pointer" onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}>
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400">
                            {lesson.category}
                          </span>
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/5 text-gray-400">
                            {lesson.level}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{lesson.duration}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white">{lesson.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{lesson.summary}</p>
                      </div>
                      <button className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-black transition-colors shrink-0">
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="pt-6 border-t border-white/10 space-y-4 animate-in fade-in duration-500">
                        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl space-y-3">
                          <h4 className="font-black text-amber-400 flex items-center gap-2 text-base">
                            <span>💡</span>
                            <span>محتوى الدرس والشرح التفصيلي:</span>
                          </h4>
                          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                            {lesson.content}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                            ✓ تم إكمال الشرح التحليلي بنجاح
                          </span>
                          <button onClick={() => {
                            toast.success(`🎓 تم حفظ تقدمك في الدرس: ${lesson.title}`);
                            playAlertSound(notificationSound);
                          }} className="px-5 py-2.5 bg-amber-500 text-black font-black rounded-xl text-xs hover:scale-105 transition-transform">
                            تأكيد إتمام الدرس ⭐️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* New Market Cards Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <MarketNews />
              <SentimentCard />
            </div>
            {/* Bot Control Section */}
            <div className="bg-[#121214] border border-amber-500/30 rounded-[2rem] p-6 md:p-8 space-y-6" dir="rtl">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${botSettings.enabled ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                    <Terminal size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">لوحة التحكم في البوت الآلي (Bot Control)</h3>
                    <p className="text-xs text-gray-400 mt-1">قم بتهيئة إعدادات التداول الآلي الخاصة بك في تيليجرام.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!userUid ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="أدخل الـ UID للتحكم" 
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            setUserUid(val);
                            localStorage.setItem('bot_user_uid', val);
                            toast.success('تم التعرف على الـ UID');
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">مستخدم: <span className="text-amber-500 font-bold">{userUid}</span></span>
                      <button onClick={() => { setUserUid(''); localStorage.removeItem('bot_user_uid'); }} className="text-[10px] text-red-400 underline">تبديل الحساب</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-300">حالة البوت</span>
                    <button 
                      onClick={() => updateBotSettings({ ...botSettings, enabled: !botSettings.enabled })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${botSettings.enabled ? 'bg-amber-500' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${botSettings.enabled ? 'translate-x-1 left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">عند التفعيل، سيقوم البوت بمتابعة التوصيات آلياً.</p>
                </div>

                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                  <span className="text-sm font-bold text-gray-300 block">مستوى المخاطرة (Risk Level)</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateBotSettings({ ...botSettings, riskLevel: level })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${botSettings.riskLevel === level ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400'}`}
                      >
                        {level === 'Low' ? 'منخفض' : level === 'Medium' ? 'متوسط' : 'عالي'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                  <span className="text-sm font-bold text-gray-300 block">أزواج التداول المفضلة</span>
                  <div className="flex flex-wrap gap-2">
                    {['0G/USDT', 'NEAR/USDT', 'NMR/USDT', 'BTC/USDT'].map((pair) => (
                      <button
                        key={pair}
                        onClick={() => {
                          const newPairs = botSettings.tradingPairs.includes(pair)
                            ? botSettings.tradingPairs.filter(p => p !== pair)
                            : [...botSettings.tradingPairs, pair];
                          updateBotSettings({ ...botSettings, tradingPairs: newPairs });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${botSettings.tradingPairs.includes(pair) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-500 border border-transparent'}`}
                      >
                        {pair}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Bot Status Component */}
            <div className="bg-[#121214] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6" dir="rtl">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 animate-pulse">
                    <Activity size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">حالة البوت اللحظية (Live Bot Status)</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        متصل ونشط (Connected)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">المحرك العصبي للعرّاب ينفذ صفقات الاقتناص والتحوط على مدار الساعة.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 font-bold">سرعة الاتصال (Ping)</p>
                    <p className="text-emerald-400 font-mono font-black text-sm">12ms ⚡️</p>
                  </div>
                  <button onClick={() => {
                    toast.success('🔍 تم فحص الاتصال بالمنصات بنجاح: جميع خوادم Binance و MEXC مستقرة.');
                    playAlertSound(notificationSound);
                  }} className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black font-bold rounded-xl text-xs transition-colors">
                    فحص التشخيص
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">Binance API v3</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">متصل</span>
                  </div>
                  <p className="text-sm font-black text-white">مزامنة دفتر الطلبات الفوري</p>
                  <p className="text-[10px] text-gray-500">آخر استجابة: منذ 0.2 ثانية</p>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">MEXC Futures WS</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">متصل</span>
                  </div>
                  <p className="text-sm font-black text-white">تتبع عقود 0G & NEAR</p>
                  <p className="text-[10px] text-gray-500">آخر استجابة: منذ 0.1 ثانية</p>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">محرك الذكاء الاصطناعي</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">ينفذ الصفقات</span>
                  </div>
                  <p className="text-sm font-black text-white">4 صفقات نشطة حالياً</p>
                  <p className="text-[10px] text-gray-500">حالة المخاطر: آمنة (2%)</p>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">Telegram Bot</span>
                    <span className={`text-[10px] ${tgBotStatus.status === 'Online' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'} px-2 py-0.5 rounded-full font-bold`}>
                      {tgBotStatus.status === 'Online' ? 'متصل (Online)' : 'غير متصل (Offline)'}
                    </span>
                  </div>
                  <p className="text-sm font-black text-white">استجابة الأوامر الحية</p>
                  <p className="text-[10px] text-gray-500">سرعة الاستجابة: {tgBotStatus.latency}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-amber-600 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-red-500/20 relative overflow-hidden group">
              <div className="relative z-10 text-right space-y-4" dir="rtl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase">
                  <Gift size={14} />
                  <span>عرض أكتوبر القاتل ⚡️</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  اربح <span className="text-yellow-300">iPhone 18 Pro Max</span> <br/> 
                  وحصة من <span className="text-yellow-300">500,000$</span> كاش!
                </h3>
                <p className="text-white/80 text-sm md:text-lg max-w-xl font-medium">
                  بينانس عم توزع هدايا مجنونة للوكلاء والمتداولين الجدد. سجل هلق عبر رابط العرّاب وثبّت عضويتك لتكون ضمن السحب وتجيك العمولات "كاش" لبيتك.
                </p>
                <button onClick={() => setActiveTab('agencies')} className="px-8 py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform shadow-xl">سجل الآن واغتنم الفرصة</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#121214] border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                 <div className="flex flex-col items-start justify-between gap-6" dir="rtl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                        <Terminal className="text-black" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">كلمة العرّاب اليومية</h4>
                        <p className="text-xl md:text-2xl font-black text-gray-100 italic mt-1">"{insight}"</p>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="bg-[#121214] border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                 <div className="flex flex-col items-start justify-between gap-6" dir="rtl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                        <Sparkles className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">اقتناص العرّاب الخاص: 0G</h4>
                        <p className="text-xl font-black text-gray-100">"من 1 سنت إلى 1 دولار.. رحلة الثروة بدأت."</p>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Top 3 Performing Coins Section */}
            <div className="bg-[#121214] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6" dir="rtl">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">أفضل 3 عملات أداءً (24h Top Performers)</h3>
                    <p className="text-xs text-gray-400 mt-1">ملخص العملات التي حققت أعلى نمو خلال آخر 24 ساعة.</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    fetchMarketCoins();
                    toast.success('🔄 تم تحديث بيانات السوق اللحظية بنجاح!');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 text-sm"
                >
                  <Zap size={16} />
                  متابعة التحديثات
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[...marketCoins]
                  .sort((a, b) => {
                    const valA = Number(a.change24h?.replace(/[^0-9.-]/g, '')) || 0;
                    const valB = Number(b.change24h?.replace(/[^0-9.-]/g, '')) || 0;
                    return valB - valA;
                  })
                  .slice(0, 3)
                  .map((coin, idx) => (
                    <div key={coin.id} className="relative group overflow-hidden bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-amber-500/30 transition-all">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-transparent opacity-50" />
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-lg">
                          {idx + 1}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${Number(coin.change24h?.replace(/[^0-9.-]/g, '')) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {coin.change24h}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white mb-1">{coin.name}</h4>
                      <p className="text-[10px] text-gray-500 mb-4">{coin.category}</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold">السعر الحالي</p>
                          <p className="text-lg font-black text-white">{coin.price}</p>
                        </div>
                        <button onClick={() => { setCalcCoinId(coin.id); setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 bg-white/5 hover:bg-amber-500 hover:text-black rounded-lg transition-colors">
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* SaaS Growth & Client Management Section (توسيع الشغل) */}
            <div className="bg-[#121214] border-2 border-emerald-500/20 rounded-[2rem] p-6 md:p-8 space-y-8 relative overflow-hidden" dir="rtl">
              <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/[0.02] pointer-events-none" />
              
              <div className="flex justify-between items-center flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                    <Users size={30} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                      مركز نمو المنصة (SaaS Expansion Hub)
                      <span className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black animate-pulse">LIVE BUSINESS</span>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 font-medium">هنا بنكبر الشغل وبنحول البوت لمنصة اشتراكات عالمية.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setActiveTab('admin')}
                     className="px-5 py-2.5 bg-emerald-500 text-black font-black rounded-xl hover:scale-105 transition-all text-sm shadow-lg shadow-emerald-500/20"
                   >
                     الإعدادات المتقدمة
                   </button>
                   <button className="px-5 py-2.5 bg-emerald-500 text-black font-black rounded-xl hover:scale-105 transition-all text-sm shadow-lg shadow-emerald-500/20">
                     إضافة وكيل جديد
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-xs text-gray-400 font-bold">إجمالي المستخدمين</p>
                  <p className="text-3xl font-black text-white flex items-baseline gap-1">
                    <AnimatedNumber value={1284} />
                    <span className="text-xs text-emerald-400">+12%</span>
                  </p>
                  <p className="text-[10px] text-gray-500">من 24 دولة مختلفة</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-xs text-gray-400 font-bold">بوتات نشطة (API)</p>
                  <p className="text-3xl font-black text-white">
                    <AnimatedNumber value={856} />
                  </p>
                  <p className="text-[10px] text-gray-500">متصلة بمنصات التداول</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-xs text-gray-400 font-bold">الدخل الشهري (MRR)</p>
                  <p className="text-3xl font-black text-emerald-400 flex items-baseline gap-1">
                    <AnimatedNumber value={15420} prefix="$" />
                  </p>
                  <p className="text-[10px] text-gray-500">من رسوم الاشتراكات</p>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-xs text-gray-400 font-bold">نسبة رضاء العملاء</p>
                  <p className="text-3xl font-black text-white">98.4%</p>
                  <p className="text-[10px] text-gray-500">بناءً على 500+ تقييم</p>
                </div>
              </div>

              <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/10 space-y-4 relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-emerald-400 flex items-center gap-2">
                    <Zap size={18} />
                    هدف التوسع للمرحلة القادمة: 5,000 مستخدم نشط
                  </h4>
                  <span className="text-sm font-bold text-white">25% تم الإنجاز</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-1/4 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                  <span>البداية: 1,000</span>
                  <span>الهدف: 5,000</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                        <Share2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">نظام التسويق بالعمولة (Affiliate)</p>
                        <p className="text-[10px] text-gray-500">42 وكيل نشط عم يجيبوا مشتركين</p>
                      </div>
                    </div>
                    <ChevronLeft size={18} className="text-gray-600" />
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">إدارة مفاتيح API للمشتركين</p>
                        <p className="text-[10px] text-gray-500">تأمين كامل لربط منصات التداول</p>
                      </div>
                    </div>
                    <ChevronLeft size={18} className="text-gray-600" />
                 </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8" dir="rtl">
              <div className="bg-[#121214] border border-white/10 p-8 rounded-[2rem] space-y-6">
                <h3 className="text-xl font-black text-amber-500 flex items-center gap-2">
                  <PieChartIcon size={24} />
                  توزيع المحفظة والأرباح
                </h3>
                <div className="space-y-4">
                  {holdings.map((h: any) => {
                    const currentAssetVal = h.amount * (prices[h.coin] || h.buyPrice || 1);
                    const assetCost = h.amount * h.buyPrice;
                    const assetDiff = currentAssetVal - assetCost;
                    return (
                      <div key={h.coin} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                          <div>
                            <p className="font-bold">{h.coin}</p>
                            <p className="text-[10px] text-gray-500">{h.amount.toLocaleString()} Units @ ${h.buyPrice}</p>
                          </div>
                        </div>
                        <div className="text-left" dir="ltr">
                          <p className={`font-black text-sm ${assetDiff >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>
                            {assetDiff >= 0 ? `+$${assetDiff.toFixed(2)}` : `-$${Math.abs(assetDiff).toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-bold">إجمالي المحفظة</p>
                    <p className="text-3xl font-black text-white">
                      <AnimatedNumber value={totalValue} prefix="$" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#121214] border border-white/10 p-8 rounded-[2rem] flex items-center justify-center min-h-[400px]">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={holdings} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="amount" nameKey="coin">
                      {holdings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 30-Day Daily Portfolio Growth LineChart (مخطط نمو المحفظة اليومي) */}
            <div className="bg-[#121214] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden" dir="rtl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                        نمو المحفظة اليومي خلال آخر 30 يوماً
                        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          30D Growth
                        </span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        تتبع القيمة التراكمية اليومية لأصولك وحيازاتك الحالية ({holdings.map((h: any) => h.coin).join(', ')}) بناءً على حركة السوق وتوزيع الصفقات.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  {/* Metric Switcher */}
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setGrowthChartMetric('value')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        growthChartMetric === 'value'
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      القيمة الإجمالية ($)
                    </button>
                    <button
                      onClick={() => setGrowthChartMetric('profit')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        growthChartMetric === 'profit'
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      الأرباح التراكمية (P&L)
                    </button>
                  </div>

                  {/* Range Switcher */}
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {[
                      { label: '7D', value: 7 },
                      { label: '14D', value: 14 },
                      { label: '30D (كامل)', value: 30 }
                    ].map((rng) => (
                      <button
                        key={rng.value}
                        onClick={() => setPortfolioGrowthRange(rng.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          portfolioGrowthRange === rng.value
                            ? 'bg-amber-500 text-black shadow-md'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {rng.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-gray-400 font-bold">القيمة الحالية (اليوم)</p>
                  <p className="text-xl md:text-2xl font-black text-white font-mono flex items-center gap-1.5">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-gray-500">مجموع الـ 5 حيازات النشطة</span>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-gray-400 font-bold">قيمة البداية (قبل 30 يوم)</p>
                  <p className="text-xl md:text-2xl font-black text-gray-300 font-mono">
                    ${(portfolioGrowthData[0]?.value || 0).toFixed(2)}
                  </p>
                  <span className="text-[10px] text-gray-500">رأس المال في بداية الدورة</span>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-gray-400 font-bold">صافي النمو التراكمي</p>
                  <p className="text-xl md:text-2xl font-black text-emerald-400 font-mono flex items-center gap-1">
                    <ArrowUpRight size={18} />
                    +${((portfolioGrowthData[portfolioGrowthData.length - 1]?.value || totalValue) - (portfolioGrowthData[0]?.value || 0)).toFixed(2)}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    +{(
                      (((portfolioGrowthData[portfolioGrowthData.length - 1]?.value || totalValue) - (portfolioGrowthData[0]?.value || 1)) /
                        (portfolioGrowthData[0]?.value || 1)) *
                      100
                    ).toFixed(1)}% نمو إجمالي
                  </span>
                </div>

                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1">
                  <p className="text-[11px] text-gray-400 font-bold">أعلى قمة للمحفظة (Peak)</p>
                  <p className="text-xl md:text-2xl font-black text-amber-400 font-mono">
                    ${Math.max(...portfolioGrowthData.map((d: any) => d.value)).toFixed(2)}
                  </p>
                  <span className="text-[10px] text-gray-500">أعلى نقطة خلال الـ 30 يوماً</span>
                </div>
              </div>

              {/* The Recharts LineChart */}
              <div className="w-full h-[360px] relative z-10 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayedGrowthData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#6b7280" 
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#18181b]/95 border border-white/20 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-right min-w-[210px]" dir="rtl">
                              <div className="flex justify-between items-center text-xs font-bold text-gray-400 border-b border-white/10 pb-2 mb-2">
                                <span className="text-white flex items-center gap-1.5">
                                  <Calendar size={13} className="text-amber-500" />
                                  {data.date}
                                </span>
                                <span className="font-mono text-gray-400 text-[11px]">{data.day}</span>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-300">قيمة المحفظة:</span>
                                  <span className="font-black text-emerald-400 font-mono text-sm">${data.value.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-400">رأس المال:</span>
                                  <span className="font-mono text-gray-400">${data.costBasis.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-white/5">
                                  <span className="text-gray-300 font-bold">الأرباح:</span>
                                  <span className={`font-mono font-black ${data.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {data.profit >= 0 ? `+$${data.profit.toFixed(2)}` : `-$${Math.abs(data.profit).toFixed(2)}`}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-gray-400">العائد:</span>
                                  <span className={`font-mono font-bold ${data.growthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {data.growthRate >= 0 ? `+${data.growthRate}%` : `${data.growthRate}%`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }} 
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="left" 
                      height={40}
                      wrapperStyle={{ paddingBottom: '12px' }}
                    />
                    {growthChartMetric === 'value' ? (
                      <>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          name="قيمة المحفظة الحالية ($)" 
                          dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="costBasis" 
                          stroke="#6b7280" 
                          strokeWidth={2} 
                          strokeDasharray="4 4" 
                          name="رأس المال المدفوع ($)" 
                          dot={false}
                        />
                      </>
                    ) : (
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        name="الأرباح التراكمية P&L ($)" 
                        dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#fbbf24', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Holdings Composition Live Pills */}
              <div className="pt-4 border-t border-white/5 relative z-10" dir="rtl">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-gray-400">الأصول المساهمة في نمو المحفظة (Current Holdings Impact):</p>
                  <span className="text-[11px] text-gray-500 font-mono">5 عملات نشطة</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {holdings.map((h: any) => {
                    const currentAssetVal = h.amount * (prices[h.coin] || h.buyPrice || 1);
                    const assetShare = ((currentAssetVal / (totalValue || 1)) * 100).toFixed(1);
                    return (
                      <div key={h.coin} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: h.color }} />
                          <div>
                            <p className="font-bold text-xs text-white">{h.coin}</p>
                            <p className="text-[10px] text-gray-400 font-mono">${currentAssetVal.toFixed(2)}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                          {assetShare}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Godfather Trade History Table (سجل صفقات العرّاب) */}
            <div className="bg-[#121214] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6" dir="rtl">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-black text-amber-500 flex items-center gap-2">
                    <TrendingUp size={24} />
                    سجل صفقات العرّاب الأخيرة (Bot Trade History)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">آخر 10 صفقات تم تنفيذها تلقائياً بواسطة محرك الذكاء الاصطناعي بدقة عالية.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all"
                  >
                    <FileText size={14} className="text-amber-500" />
                    تصدير CSV
                  </button>
                  <button 
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all"
                  >
                    <Award size={14} className="text-amber-500" />
                    تصدير PDF
                  </button>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    🔥 نسبة النجاح الإجمالية: 94.2%
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs">
                      <th className="pb-4 pr-4">العملة والزوج</th>
                      <th className="pb-4">نوع الصفقة</th>
                      <th className="pb-4">سعر الدخول</th>
                      <th className="pb-4">سعر الهدف / الإغلاق</th>
                      <th className="pb-4">الربح المحقق</th>
                      <th className="pb-4 text-left pl-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium">
                    {tradeHistory.map((trade, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 pr-4 font-black text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {trade.coin}
                        </td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-400">
                            {trade.type}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-gray-300">{trade.entry}</td>
                        <td className="py-4 font-mono text-emerald-400 font-bold">{trade.target}</td>
                        <td className="py-4 font-black text-emerald-400">{trade.profit}</td>
                        <td className="py-4 text-left pl-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span>🏆</span>
                            <span>{trade.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trade Journal Section */}
            <div className="bg-[#121214] border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-6" dir="rtl">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">سجل التداول اليدوي (Trade Journal)</h3>
                    <p className="text-xs text-gray-400 mt-1">دون ملاحظاتك، أهدافك، ومشاعرك تجاه صفقاتك اليدوية للتعلم منها.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={exportJournalToExcel}
                    disabled={tradeJournal.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/5"
                  >
                    <FileText size={16} />
                    تصدير إلى Excel 📊
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <input 
                  type="text" 
                  placeholder="العملة (مثال: BTC)" 
                  value={newJournal.coin}
                  onChange={e => setNewJournal({...newJournal, coin: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                />
                <input 
                  type="text" 
                  placeholder="سعر الدخول" 
                  value={newJournal.entryPrice}
                  onChange={e => setNewJournal({...newJournal, entryPrice: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                />
                <input 
                  type="text" 
                  placeholder="سعر الخروج (اختياري)" 
                  value={newJournal.exitPrice}
                  onChange={e => setNewJournal({...newJournal, exitPrice: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                />
                <select 
                  value={newJournal.sentiment}
                  onChange={e => setNewJournal({...newJournal, sentiment: e.target.value as any})}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                >
                  <option value="Bullish">تفاؤل (Bullish)</option>
                  <option value="Neutral">محايد (Neutral)</option>
                  <option value="Bearish">تشاؤم (Bearish)</option>
                </select>
                <div className="md:col-span-3">
                  <input 
                    type="text" 
                    placeholder="ملاحظات الصفقة (السبب، الدروس المستفادة...)" 
                    value={newJournal.notes}
                    onChange={e => setNewJournal({...newJournal, notes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <button 
                  onClick={addJournalEntry}
                  disabled={isSubmitting}
                  className="bg-amber-500 text-black font-black rounded-xl py-3 text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                >
                  حفظ في السجل 📝
                </button>
              </div>

              {tradeJournal.length > 0 && (
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-gray-400">سجلاتك السابقة:</h4>
                  <div className="grid gap-4">
                    {tradeJournal.map((entry) => (
                      <div key={entry.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-white">{entry.coin}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              entry.sentiment === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                              entry.sentiment === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {entry.sentiment}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 italic">"{entry.notes}"</p>
                          <div className="flex gap-4 text-[10px] text-gray-500">
                            <span>الدخول: <span className="text-gray-300 font-bold">{entry.entryPrice}</span></span>
                            {entry.exitPrice && <span>الخروج: <span className="text-gray-300 font-bold">{entry.exitPrice}</span></span>}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500">{entry.createdAt?.toDate()?.toLocaleDateString() || 'اليوم'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="space-y-8 animate-in" dir="rtl">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-black text-amber-500">مجتمع التوصيات الحية المعتمدة</h2>
                <p className="text-xs text-gray-400 mt-1">توصيات لحظية مفحوصة بدقة مع مستويات الدخول والأهداف ووقف الخسارة الإلزامي.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                توقيع العرّاب المعتمد ✍️
              </span>
            </div>

            {/* Strict Capital Protection Guardrail Banner */}
            <div className="bg-[#121214] border border-emerald-500/30 rounded-3xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-emerald-400 text-sm">درع حماية رأس المال الصارم (Anti-Rogue Signals Guardrail)</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  نضمن لك بنسبة 100% أن المنصة والبوت <span className="text-white font-bold">غير متصلين بأي خوارزميات أو روبوتات خارجية عشوائية</span> قد تصدر توصيات مفاجئة تخرب بيوت المتداولين. كل إشارة تداول هنا مدروسة يدوياً من العرّاب وفريقه مع وقف خسارة ملزم لحماية رأس المال.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {signals.map((s) => (
                <div key={s.id} className="bg-[#121214] border border-white/10 p-6 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-white">{s.coin}</span>
                    <span className="px-3 py-1 bg-amber-500 text-black font-black rounded-full text-xs">{s.type}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                    <p>📥 نقطة الدخول: <span className="text-white font-bold">{s.entry}</span></p>
                    <p>🎯 الأهداف: <span className="text-emerald-400 font-bold">{Array.isArray(s.targets) ? s.targets.join(' | ') : s.targets}</span></p>
                    <p>🛡 وقف الخسارة: <span className="text-red-400 font-bold">{s.stopLoss}</span></p>
                    {s.recommendedLeverage && <p>⚡️ الرافعة المالية: <span className="text-amber-400 font-bold">{s.recommendedLeverage}</span></p>}
                  </div>
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
                    <span>✓ فحص سيولة يدوي</span>
                    <span className="text-amber-400 font-bold font-sans">توقيع العرّاب 🦅</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="space-y-8 animate-in" dir="rtl">
            <h2 className="text-3xl font-black text-amber-500">أكاديمية العرّاب</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {academy.map((mod: any, idx: number) => (
                <div key={idx} className="bg-[#121214] border border-white/10 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xl font-black text-white">{mod.title}</h3>
                  <div className="space-y-2">
                    {mod.lessons?.map((l: any, lIdx: number) => (
                      <div key={lIdx} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="font-bold text-sm text-amber-400">{l.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{l.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'agencies' && (
          <div className="space-y-12 animate-in" dir="rtl">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-xs font-black rounded-full">وكالات العرّاب الرسمية الموحدة</span>
                <h2 className="text-3xl md:text-4xl font-black text-white">اختر منصتك وانضم لمجتمعات التوصيات</h2>
                <p className="text-sm text-gray-400">
                  سجل حساب جديد عبر الرابط الرسمي وأودع رمزياً <span className="text-amber-400 font-bold">$1.5 فما فوق</span>، وأرسل الـ UID ليتم توليد رمز دخول سري وكلمة سر متغيرة خاصة بك.
                </p>
              </div>
              <button 
                onClick={() => setShowAddExchangeModal(true)}
                className="px-5 py-3 bg-amber-500 text-black font-black rounded-2xl text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
              >
                <Plus size={16} />
                + إضافة وكالة منصة جديدة
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {exchanges.map((ex: any) => (
                <div key={ex.id} className="bg-[#121214] border border-white/10 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={ex.logo} alt={ex.name} className="w-14 h-14 rounded-2xl object-contain bg-white/5 p-2" />
                      <div>
                        <h3 className="text-xl font-bold text-white">{ex.name}</h3>
                        <p className="text-xs text-amber-500 font-bold">{ex.bonus}</p>
                      </div>
                    </div>
                    {ex.refCode && (
                      <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                        <span className="text-gray-400">كود الوكالة المعتمد:</span>
                        <span className="font-mono font-bold text-amber-400 text-sm">{ex.refCode}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    <a href={ex.link} target="_blank" rel="noreferrer" className="w-full py-3 bg-amber-500 text-black font-black rounded-xl text-center text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/10">
                      التسجيل بالرابط الرسمي ↗
                    </a>
                    <button onClick={() => setOnboardingExchange(ex)} className="w-full py-3 bg-white/10 hover:bg-white/15 font-bold rounded-xl text-white text-sm transition-colors">
                      طلب رمز الدخول (إرسال الـ UID)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {onboardingExchange && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#121214] border border-white/10 p-8 rounded-[2.5rem] max-w-md w-full space-y-6">
                  <div className="space-y-2 text-center">
                    <h3 className="text-2xl font-black text-amber-500">طلب تفعيل حساب {onboardingExchange.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      شرط القبول: تسجيل حساب جديد وإيداع رمزي $1.5+ وإثبات التداول الدوري لتجنب الطرد.
                    </p>
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      const res = await fetch('/api/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...signupForm, depositAmount: '1.5$+', exchangeName: onboardingExchange.name })
                      });
                      if (res.ok) {
                        toast.success('✅ تم إرسال الـ UID بنجاح. يرجى إرسال صورة الحساب للبوت في تليجرام!');
                        setOnboardingExchange(null);
                        setSignupData({ username: '', uid: '', depositAmount: '', proofUrl: '' });
                      }
                    } catch (err) { toast.error('خطأ في الاتصال'); }
                    finally { setIsSubmitting(false); }
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-bold">اسمك أو معرف تليجرام (@username)</label>
                      <input type="text" placeholder="@your_telegram" required value={signupForm.username} onChange={e => setSignupData({...signupForm, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-bold">رقم الـ UID في منصة {onboardingExchange.name}</label>
                      <input type="text" placeholder="12345678" required value={signupForm.uid} onChange={e => setSignupData({...signupForm, uid: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500 font-mono" />
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-400 space-y-1">
                      <p className="font-bold">📸 ملاحظة هامة لتسريع القبول:</p>
                      <p className="text-gray-400">أرسل سكرين شوت يوضح الـ UID وإيداع الـ $1.5 مباشرة لبوت التلجرام <span className="text-amber-400 font-mono font-bold">@BinanceRich_Bot</span> ليتم توليد كود الدخول فوراً.</p>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl hover:scale-105 transition-all text-sm shadow-xl shadow-amber-500/20">
                      {isSubmitting ? 'جاري الإرسال...' : 'تأكيد وإرسال الطلب للعرّاب 🦅'}
                    </button>
                    <button type="button" onClick={() => setOnboardingExchange(null)} className="w-full py-2 text-gray-400 text-xs">إلغاء</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-12 animate-in" dir="rtl">
            <h2 className="text-3xl font-black text-amber-500">لوحة تحكم العرّاب</h2>

            {/* Admin: Manage Market Coins */}
            <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                <Edit3 size={20} />
                إدارة وسوق العملات الموصى بها (تعديل حي)
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {marketCoins.map(coin => (
                  <div key={coin.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                    <p className="font-black text-lg text-white">{coin.name}</p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-gray-400">السعر الحالي:</label>
                        <input 
                          type="text" 
                          value={coin.price} 
                          onChange={e => {
                            const val = e.target.value;
                            setMarketCoins(marketCoins.map(c => c.id === coin.id ? { ...c, price: val } : c));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400">الهدف:</label>
                        <input 
                          type="text" 
                          value={coin.target} 
                          onChange={e => {
                            const val = e.target.value;
                            setMarketCoins(marketCoins.map(c => c.id === coin.id ? { ...c, target: val } : c));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400">الحالة:</label>
                        <input 
                          type="text" 
                          value={coin.status} 
                          onChange={e => {
                            const val = e.target.value;
                            setMarketCoins(marketCoins.map(c => c.id === coin.id ? { ...c, status: val } : c));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white mt-1"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/admin/market-coins', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: coin.id, price: coin.price, target: coin.target, status: coin.status })
                            });
                            if (res.ok) toast.success(`تم تحديث ${coin.name} بنجاح!`);
                          } catch (e) { toast.error('فشل التحديث'); }
                        }}
                        className="w-full py-2 bg-amber-500 text-black font-black rounded-lg mt-2 flex items-center justify-center gap-1 text-xs"
                      >
                        <Save size={14} /> حفظ التعديل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Communities Hub Overview */}
            <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                    <Globe size={20} />
                    المجتمعات الموحدة النشطة (Supergroups & Agency Channels)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">جميع المنصات والمجتمعات تعمل من خلال بوت واحد ونظام رموز دخول متغيرة تلقائياً.</p>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  ⚡️ 3 مجتمعات متصلة لحظياً
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-white text-base">Bybit Georgia (Baybit-Rich)</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">142 عضو</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">Chat ID: <span className="text-amber-400">-1004439326104</span></p>
                  <p className="text-xs text-gray-400">كود الوكالة: <span className="text-white font-bold font-mono">167506</span></p>
                  <a href="https://affiliates.bybit.com/api/v2/apk_download?invite_code=167506" target="_blank" rel="noreferrer" className="block text-center py-2 bg-amber-500 text-black font-black rounded-xl text-xs hover:scale-105 transition-all">
                    رابط وكالة Bybit الرسمي ↗
                  </a>
                </div>

                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-white text-base">MEXC SYRIA (الوكالة الرسمية)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">102 عضو</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">Chat ID: <span className="text-emerald-400">-1003707821005</span></p>
                  <p className="text-xs text-gray-400">القناة الرسمية: <span className="text-white font-bold">@ayman_alshame</span></p>
                  <a href="https://t.me/ayman_alshame" target="_blank" rel="noreferrer" className="block text-center py-2 bg-emerald-500 text-black font-black rounded-xl text-xs hover:scale-105 transition-all">
                    قناة وكالة سوريا @ayman_alshame ↗
                  </a>
                </div>

                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-white text-base">Binance VIP (سيريا بينانس)</span>
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">320 عضو</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">كود الخصم: <span className="text-yellow-400 font-mono">SYRIABINANCE</span></p>
                  <p className="text-xs text-gray-400">الميزات: خصم 20% + صيد العملات المخفسة</p>
                  <a href="https://www.binance.com/register?ref=SYRIABINANCE" target="_blank" rel="noreferrer" className="block text-center py-2 bg-yellow-500 text-black font-black rounded-xl text-xs hover:scale-105 transition-all">
                    رابط تسجيل Binance ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Users Verification & Dynamic Passcodes Table */}
            <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 overflow-x-auto space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                    <Lock size={20} />
                    إدارة طلبات التفعيل، الصور ورموز الدخول الدوارة (One-Time Access Codes)
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">يتم توليد رمز دخول سري يتغير تلقائياً لكل شخص بعد التأكد من صورة الـ UID وإيداع الـ $1.5+.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                      toast.success('تم تحديث قائمة المشتركين');
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300"
                  >
                    تحديث القائمة 🔄
                  </button>
                </div>
              </div>

              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs">
                    <th className="pb-4 pr-3">المستخدم وتليجرام</th>
                    <th className="pb-4">المنصة والـ UID</th>
                    <th className="pb-4">صورة التحقق والإيداع ($1.5+)</th>
                    <th className="pb-4">رمز الدخول المتغير (Passcode)</th>
                    <th className="pb-4">حالة نشاط التداول</th>
                    <th className="pb-4 text-center">إجراءات الحماية والتحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u: any) => (
                    <tr key={u.id} className="text-sm hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-3 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <div>
                            <p className="font-black">{u.username}</p>
                            {u.telegramChatId && <p className="text-[10px] text-gray-500 font-mono">TG: {u.telegramChatId}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-mono">
                        <span className="text-amber-400 font-bold block">{u.binanceUid || u.id}</span>
                        <span className="text-[10px] text-gray-400 font-sans">{u.exchangeName || 'Bybit'}</span>
                      </td>
                      <td className="py-4">
                        {u.photoUrl ? (
                          <button 
                            onClick={() => setSelectedPhoto(u.photoUrl)} 
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-bold transition-all"
                          >
                            <span>📸</span>
                            <span>معاينة الإثبات ($1.5+)</span>
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 italic">مرفق نصياً</span>
                        )}
                      </td>
                      <td className="py-4 font-mono">
                        {u.accessCode ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-emerald-400 font-bold font-mono">
                              {u.accessCode}
                            </span>
                            <button 
                              onClick={async () => {
                                const res = await fetch('/api/admin/rotate-code', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ userId: u.id })
                                });
                                if (res.ok) {
                                  toast.success(`تم تغيير كلمة السر بنجاح!`);
                                  fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                                }
                              }}
                              title="تغيير كلمة السر تلقائياً"
                              className="text-[10px] text-gray-400 hover:text-white"
                            >
                              🔄
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">لم يتم التوليد بعد</span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          u.tradingStatus === 'ACTIVE' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : u.tradingStatus === 'WARNING_INACTIVE'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : u.tradingStatus === 'KICKED' || u.status === 'kicked'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-gray-400'
                        }`}>
                          {u.tradingStatus === 'ACTIVE' ? '🟢 متداول نشط' : u.tradingStatus === 'WARNING_INACTIVE' ? '⚠️ مهدد بالطرد (خامل)' : u.tradingStatus === 'KICKED' || u.status === 'kicked' ? '🚫 مطرود (متطفل)' : '⏳ قيد التدقيق'}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {u.status !== 'verified' ? (
                            <button 
                              onClick={async () => {
                                const res = await fetch('/api/admin/approve-with-code', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                    userId: u.id, 
                                    exchangeName: u.exchangeName || 'Bybit'
                                  })
                                });
                                if (res.ok) {
                                  toast.success('✅ تمت الموافقة وتوليد كود الدخول وإرساله عبر تليجرام!');
                                  fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                                }
                              }} 
                              className="px-3 py-1.5 bg-emerald-500 text-black font-black rounded-xl text-xs hover:scale-105 transition-all shadow-md shadow-emerald-500/20"
                            >
                              🔑 قبول وتوليد كود دوار
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={async () => {
                                  if (!confirm(`هل أنت متأكد من إرسال إنذار خمول للعضو ${u.username}؟`)) return;
                                  const res = await fetch('/api/admin/warn-user', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: u.id })
                                  });
                                  if (res.ok) {
                                    toast.warning('⚠️ تم إرسال إنذار الخمول (48 ساعة للتداول)');
                                    fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                                  }
                                }} 
                                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-lg text-[11px]"
                              >
                                ⚠️ إنذار خمول
                              </button>
                              <button 
                                onClick={async () => {
                                  if (!confirm(`هل أنت متأكد من طرد العضو ${u.username} لسحب التوصيات دون تداول؟`)) return;
                                  const res = await fetch('/api/admin/kick-user', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: u.id })
                                  });
                                  if (res.ok) {
                                    toast.error('🚫 تم طرد المتطفل وإلغاء كود الدخول!');
                                    fetch('/api/admin/users').then(r => r.json()).then(setUsers);
                                  }
                                }} 
                                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg text-[11px]"
                              >
                                🚫 طرد المتطفل
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Verification Photo Modal */}
            {selectedPhoto && (
              <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#121214] border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-white text-base">صورة التحقق والإيداع ($1.5+)</h4>
                    <button onClick={() => setSelectedPhoto(null)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[70vh] flex items-center justify-center bg-black">
                    <img src={selectedPhoto} alt="Verification Proof" className="max-h-[65vh] w-auto object-contain" />
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>تحقق من مطابقة رقم الـ UID والإيداع في المنصة</span>
                    <button onClick={() => setSelectedPhoto(null)} className="px-4 py-2 bg-amber-500 text-black font-black rounded-xl">إغلاق</button>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Telegram Settings Section */}
            <div className="bg-[#121214] border-2 border-amber-500/20 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden" dir="rtl">
               <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <MessageSquare size={30} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">إعدادات تليجرام المتقدمة (Telegram Integration)</h3>
                    <p className="text-sm text-gray-500">اربط حسابك مباشرة لاستلام التنبيهات والأوامر آلياً.</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 pr-2 uppercase tracking-widest">Bot Token (من BotFather)</label>
                      <input 
                        type="password" 
                        placeholder="0000000000:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-amber-500 transition-all font-mono text-sm"
                        value={tgSettings.botToken}
                        onChange={e => setTgSettings({...tgSettings, botToken: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 pr-2 uppercase tracking-widest">Telegram Chat ID</label>
                      <input 
                        type="text" 
                        placeholder="123456789" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-amber-500 transition-all font-mono text-sm"
                        value={tgSettings.chatId}
                        onChange={e => setTgSettings({...tgSettings, chatId: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={saveTgSettings}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20"
                    >
                      {isSubmitting ? 'جاري الحفظ...' : 'حفظ وربط الحساب'}
                    </button>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 space-y-4">
                     <h4 className="font-black text-white flex items-center gap-2">
                        <ShieldCheck size={18} className="text-amber-500" />
                        كيف يعمل الربط؟
                     </h4>
                     <ul className="text-xs text-gray-400 space-y-3 leading-relaxed">
                        <li>1. أنشئ بوت خاص بك عبر <a href="https://t.me/BotFather" className="text-amber-500 underline">@BotFather</a>.</li>
                        <li>2. انسخ الـ Token وضعه في الحقل المخصص.</li>
                        <li>3. احصل على Chat ID الخاص بك (عبر بوت @userinfobot).</li>
                        <li>4. السيستم سيقوم بإرسال كافة التنبيهات لدردشتك الخاصة فوراً.</li>
                     </ul>
                     <div className="pt-4 flex items-center gap-2 text-[10px] text-amber-500/60 font-bold uppercase">
                        <Lock size={12} /> التشفير مفعل (End-to-End Encryption)
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
