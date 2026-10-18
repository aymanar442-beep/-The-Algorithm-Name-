import React from 'react';
import { Toaster } from 'sonner';
import { ShaheenPayPalRevolution } from './components/ShaheenPayPalRevolution';
import { SubscriptionManager } from './components/SubscriptionManager';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 font-sans selection:bg-amber-500/30">
      <Toaster position="top-right" richColors theme="dark" />
      <main className="min-h-screen">
        <ShaheenPayPalRevolution />
        <SubscriptionManager />
      </main>
    </div>
  );
}
