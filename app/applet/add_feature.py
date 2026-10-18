import sys

with open('/app/applet/src/components/ShaheenPayPalRevolution.tsx', 'r') as f:
    content = f.read()

target = 'const [reportCopied, setReportCopied] = useState<boolean>(false);'
addition = '''const [reportCopied, setReportCopied] = useState<boolean>(false);

  // Threat Sim & PayPal API Mapping State
  const [simAttackType, setSimAttackType] = useState<'card_testing' | 'ato_takeover' | 'synthetic_duress' | 'geo_spoof'>('card_testing');
  const [simAttackState, setSimAttackState] = useState<'idle' | 'simulating' | 'intercepted' | 'pqc_isolated'>('idle');
  const [quantumVulnIndex, setQuantumVulnIndex] = useState<number>(0.00000);
  const [simulatedApiLogs, setSimulatedApiLogs] = useState<Array<{ id: string; time: string; apiName: string; status: string; latency: string; payload: string }>>([
    { id: 'LOG-901', time: '12:04:11', apiName: 'PayPal Orders API / Checkout v2', status: 'SECURED_PQC', latency: '0.04ms', payload: 'POST /v2/checkout/orders (Kyber-1024 Wrapper)' },
    { id: 'LOG-902', time: '12:04:12', apiName: 'PayPal Webhooks API', status: 'LISTENING', latency: '0.02ms', payload: 'EVENT: PAYMENT.CAPTURE.COMPLETED (S-AMI Guard)' },
    { id: 'LOG-903', time: '12:04:15', apiName: 'PayPal Payouts API', status: 'ZERO_HOLD_ESCROW', latency: '0.06ms', payload: 'POST /v1/payments/payouts (Instant Settlement)' }
  ]);
  const [merchantArbitrationList, setMerchantArbitrationList] = useState<Array<{ id: string; merchant: string; txId: string; amount: number; suspicionReason: string; status: string }>>([
    { id: 'ARB-401', merchant: 'Damascus Electronics Hub', txId: 'TX-SH-9182', amount: 1250.00, suspicionReason: 'High-velocity cross-border currency conversion (False Positive Risk)', status: 'PENDING_MERCHANT_OVERRIDE' }
  ]);
  const [fallbackSimulatorStatus, setFallbackSimulatorStatus] = useState<'normal_pqc_ai' | 'fallback_triggered'>('normal_pqc_ai');

  const handleRunLiveThreatSim = (attack: 'card_testing' | 'ato_takeover' | 'synthetic_duress' | 'geo_spoof') => {
    setSimAttackType(attack);
    setSimAttackState('simulating');
    setQuantumVulnIndex(88.42);
    setTimeout(() => {
      setSimAttackState('intercepted');
      setQuantumVulnIndex(12.10);
    }, 1200);
    setTimeout(() => {
      setSimAttackState('pqc_isolated');
      setQuantumVulnIndex(0.00001);
      const newLog = {
        id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
        time: new Date().toLocaleTimeString(),
        apiName: 'PayPal Disputing & Resolutions API / Stealth Guard',
        status: 'NEUTRALIZED_ZERO_HOLD',
        latency: '0.04ms',
        payload: 'Threat Vector [' + attack.toUpperCase() + '] isolated via Kyber-1024 Lattice & Causal AI tree.'
      };
      setSimulatedApiLogs(prev => [newLog, ...prev]);
    }, 2500);
  };

  const handleMerchantOverrideDecision = (itemId: string, decision: 'override_approve' | 'confirm_fraud_block') => {
    setMerchantArbitrationList(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: decision === 'override_approve' ? 'OVERRIDDEN_APPROVED_RELEASED' : 'CONFIRMED_FRAUD_BLOCKED'
        };
      }
      return item;
    }));
  };'''

if target in content:
    content = content.replace(target, addition, 1)
    with open('/app/applet/src/components/ShaheenPayPalRevolution.tsx', 'w') as f:
        f.write(content)
    print('Successfully added threat sim state & functions.')
else:
    print('Target not found!')
