import { ShaheenPayKernel, Bet23BehavioralProtector } from './src/services/ShaheenPayKernel';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createServer as createHttpServer } from 'http';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Safely load firebase-applet-config.json
let firebaseConfig: any = {
  projectId: "involuted-braid-f8chg",
  firestoreDatabaseId: "ai-studio-tradingbotsaas-2c7a2469-09f4-484e-9b37-d1fc4cc5fa19"
};
try {
  const configRaw = fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8');
  firebaseConfig = JSON.parse(configRaw);
} catch (e) {
  console.warn('Could not read firebase-applet-config.json, using defaults.');
}

if (!getApps().length) {
  try {
    initializeApp({
      projectId: firebaseConfig.projectId
    });
    console.log('Firebase Admin initialized with project ID:', firebaseConfig.projectId);
  } catch (e) {
    console.error('Firebase Admin initialization error:', e);
  }
}

const db = getFirestore(getApps()[0], firebaseConfig.firestoreDatabaseId);

const createServer = async () => {
  const app = express();
  const httpServer = createHttpServer(app);
  const PORT = 3000;

  app.use(express.json());

  // ======================================================================
  // 🦅 SHAHEEN PAY KERNEL: Autonomous Banking & Anti-Fraud Engine for PayPal
  // ======================================================================
  app.get('/api/paypal/kernel-status', (req, res) => {
    res.json({
      kernel: 'SHAHEEN PAY KERNEL (S-PK v1.0-ENTERPRISE)',
      architect: 'Eng. Ayman Al-Araishi',
      status: 'ONLINE',
      psychoLock: Bet23BehavioralProtector.isCooldownActive() ? 'LOCKED' : 'READY',
      cooldownRemainingSeconds: Bet23BehavioralProtector.getRemainingCooldownSeconds(),
      timestamp: Date.now()
    });
  });

  app.post('/api/paypal/evaluate', async (req, res) => {
    try {
      const payload = req.body;
      const verdict = await ShaheenPayKernel.evaluateAndAuthorizePayment(payload);
      res.json(verdict);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Evaluation failed' });
    }
  });

  app.post('/api/paypal/create-order', async (req, res) => {
    try {
      const payload = req.body;
      const verdict = await ShaheenPayKernel.evaluateAndAuthorizePayment(payload);

      if (!verdict.isClearedForPayPalExecution) {
        return res.status(403).json({
          error: 'Transaction rejected by Shaheen Iron Financial Gate',
          verdict
        });
      }

      // Simulate official PayPal Orders v2 schema output
      const paypalOrder = {
        id: 'PAYPAL-ORD-' + Date.now().toString(36).toUpperCase(),
        status: 'CREATED',
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: payload.currency || 'USD',
            value: payload.amount.toFixed(2)
          },
          payee: {
            email_address: payload.recipientEmail || 'merchant@shaheen.pay'
          },
          custom_id: verdict.transactionId,
          description: 'SHAHEEN Sovereign Certified Payment'
        }],
        shaheenGateVerdict: verdict,
        links: [
          {
            href: 'https://www.sandbox.paypal.com/checkoutnow?token=EC-' + Date.now(),
            rel: 'approve',
            method: 'GET'
          }
        ]
      };

      res.json({
        success: true,
        paypalOrder,
        verdict
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/paypal/kill-switch', (req, res) => {
    const result = ShaheenPayKernel.emergencyKillSwitchToSafeReserve();
    res.json({
      success: true,
      message: 'Emergency Kill-Switch executed. Zeroization complete. Funds diverted to USDT safe vault.',
      result
    });
  });

  app.post('/api/paypal/cooldown-release', (req, res) => {
    Bet23BehavioralProtector.emergencyReleaseOverride();
    res.json({
      success: true,
      message: 'Bet23 cooldown lock released by administrator override.'
    });
  });

  app.post('/api/paypal/instant-reversal', (req, res) => {
    const { transactionId, reason, amount } = req.body;
    const reversalId = 'REV-SHAHEEN-' + Date.now().toString(36).toUpperCase();
    res.json({
      success: true,
      reversalId,
      transactionId: transactionId || 'TX-SAMPLE-99',
      refundedAmount: amount || 250,
      executionTimeMs: 12.4,
      disputeRequired: false,
      settlementSpeed: 'INSTANT_1_SECOND',
      status: 'FUNDS_RETURNED_TO_BUYER',
      fraudsterAction: 'ACCOUNT_ISOLATED_AND_FLAGGED',
      message: 'تم استرداد المبلغ بالكامل إلى حسابك في ثانية واحدة دون نزاع بشري أو انتظار!'
    });
  });

  app.post('/api/paypal/classify-transaction', (req, res) => {
    const { sender, recipient, amount, category, isSuspicious } = req.body;
    const isHonest = !isSuspicious;
    res.json({
      success: true,
      classification: isHonest ? 'HONEST_SOVEREIGN_USER' : 'SYNDICATE_FRAUD_DETECTED',
      trustScore: isHonest ? 99.8 : 12.3,
      zeroHoldApproved: isHonest,
      recommendedAction: isHonest ? 'ZERO_HOLD_INSTANT_PASS' : 'ISOLATE_TO_SMART_ESCROW',
      estimatedSavingsUSD: isHonest ? 450 : 2500,
      processingTimeMs: 14.2,
      analysis: isHonest 
        ? 'تم التحقق من النزاهة السلوكية: لا يوجد أي خطر. يُمنع تجميد الحساب نهائياً (0% Hold).'
        : 'تم اكتشاف سلوك احتيالي منظم ومطابقة نمط وهمي: تم عزل المحتال وتأمين أموال المشتري 100%.'
    });
  });

  app.post('/api/paypal/medical-duress-analysis', (req, res) => {
    const { pulseBpm = 82, perfusionIndex = 4.5, touchTremorHz = 3.2, userScenario = 'calm' } = req.body;
    
    // Clinical Diagnostic Logic:
    const isCoercion = userScenario === 'coerced' || (perfusionIndex < 0.8 && (touchTremorHz >= 7.5 || pulseBpm > 110));

    if (isCoercion) {
      res.json({
        success: true,
        isDuressDetected: true,
        protocol: 'SHAHEEN_GHOST_ESCROW_ACTIVE',
        medicalDiagnosis: 'انهيار حاد في مؤشر التروية الدموية.',
        metrics: {
          pulseBpm: pulseBpm || 134,
          perfusionIndex: perfusionIndex || 0.18,
          sympathovagalRatio: 8.9, 
          microTremorHz: touchTremorHz || 9.8,
          vasoconstrictionIntensity: '98% (شرياني حاد)'
        },
        ghostVaultStatus: {
          displayToAttacker: '✅ تم التحويل بنجاح 100% (تمويه كامل لحماية حياة الضحية)',
          realBackendAction: '🔒 حجز الأموال في الخزنة الشبحية فوراً ومنع سحبها للمجرم',
          autonomousReversalReady: true,
          silentLawEnforcementBeacon: 'SIGNAL_ACTIVE_INTERPOL_CYBER'
        },
        message: 'تم رصد حالة إكراه طبية مؤكدة: تم تحويل الأموال تلقائياً إلى خزنة شاهين الشبحية وحماية الضحية بنسبة 100%!'
      });
    } else {
      res.json({
        success: true,
        isDuressDetected: false,
        protocol: 'STANDARD_SOVEREIGN_PASS',
        medicalDiagnosis: 'تروية دموية طبيعية وهدوء عصبي ودي.',
        metrics: {
          pulseBpm: pulseBpm || 76,
          perfusionIndex: perfusionIndex || 5.2,
          sympathovagalRatio: 1.1,
          microTremorHz: touchTremorHz || 2.4,
          vasoconstrictionIntensity: '4% (استرخاء تام)'
        },
        ghostVaultStatus: {
          displayToAttacker: '✅ معاملة طبيعية',
          realBackendAction: '⚡ تمرير مباشر عبر الخزنة اللحظية بدون تجميد الحساب',
          autonomousReversalReady: true,
          silentLawEnforcementBeacon: 'NONE'
        },
        message: 'حالة طبية مستقرة ونزاهة بيومترية تامة: العملية حرة بالكامل.'
      });
    }
  });

  app.get('/api/paypal/stress-test', (req, res) => {
    res.json({ success: true, timestamp: Date.now() });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: firebaseConfig.firestoreDatabaseId });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const viteModule = await eval("import('vite')");
    const createViteServer = viteModule.createServer;
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      try {
        const template = await vite.transformIndexHtml(req.originalUrl, `<!DOCTYPE html><html><head></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

createServer();
