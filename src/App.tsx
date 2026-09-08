import React, { useState } from 'react';
import { injectHiddenPayload } from './lib/ZeroWidth';
import { Copy, Check, Zap, Eye, EyeOff, Terminal, Target } from 'lucide-react';

function App() {
  const [targetText, setTargetText] = useState('');
  const [hiddenKeywords, setHiddenKeywords] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fusionResult, setFusionResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFusion = () => {
    if (!targetText) return;
    setIsProcessing(true);
    
    // Simulate the "40ms gap" and processing
    setTimeout(() => {
      // Create the payload from keywords, adding standard "trending" triggers
      const payload = `[S-CIP_ANCHOR] ${hiddenKeywords} [VIRAL_NODE_ACTIVE]`;
      const result = injectHiddenPayload(targetText, payload);
      
      setFusionResult(result);
      setIsProcessing(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    if (!fusionResult) return;
    navigator.clipboard.writeText(fusionResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Header */}
        <header className="mb-12 border-b border-zinc-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="text-emerald-500" size={24} />
              S-CIP FUSION REACTOR
            </h1>
            <p className="text-zinc-500 mt-1 text-sm tracking-widest uppercase">Content Injection Protocol (v1.0.0)</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider">
            STATUS: ONLINE
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: THE OVEN */}
          <div className="space-y-6">
            
            {/* Step 1: Visible Text */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
              <label className="flex items-center justify-between mb-3 text-sm font-bold text-blue-400">
                <span>1. TARGET VISIBLE CONTENT</span>
                <Eye size={16} />
              </label>
              <textarea
                value={targetText}
                onChange={(e) => setTargetText(e.target.value)}
                placeholder="Paste the normal post you want everyone to see..."
                className="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-zinc-300 h-32 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            {/* Step 2: Hidden Payload */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50"></div>
              <label className="flex items-center justify-between mb-3 text-sm font-bold text-purple-400">
                <span>2. THE PHANTOM PAYLOAD (S-CIP)</span>
                <EyeOff size={16} />
              </label>
              <textarea
                value={hiddenKeywords}
                onChange={(e) => setHiddenKeywords(e.target.value)}
                placeholder="Enter algorithms triggers (e.g. viral, fyp, trending, break out, algorithm boost)"
                className="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-zinc-400 h-24 focus:outline-none focus:border-purple-500/50 resize-none"
              />
              <p className="text-xs text-zinc-600 mt-2">
                This text will be encoded into zero-width characters and fused directly into the visible content structure.
              </p>
            </div>

            {/* Action */}
            <button
              onClick={handleFusion}
              disabled={isProcessing || !targetText}
              className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2
                ${isProcessing 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : !targetText 
                    ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]'
                }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  COOKING PAYLOAD...
                </>
              ) : (
                <>
                  <Target size={18} />
                  FUSE & INJECT
                </>
              )}
            </button>

          </div>

          {/* RIGHT: THE TERMINAL & RESULT */}
          <div className="space-y-6 flex flex-col h-full">
            
            {/* Terminal output */}
            <div className="bg-black border border-zinc-800 rounded-xl p-5 shadow-2xl flex-1 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-emerald-500/20 to-zinc-800"></div>
              
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
                  <Terminal size={14} />
                  <span>S-CIP TERMINAL // NODE-01</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 flex-1 overflow-y-auto font-mono leading-relaxed">
                <p className="text-zinc-600"># SYSTEM INITIALIZED</p>
                <p className="text-zinc-600"># WAITING FOR FUSION TARGET...</p>
                
                {isProcessing && (
                  <div className="space-y-1 mt-4">
                    <p className="text-blue-400">&gt; Parsing visible DOM string...</p>
                    <p className="text-purple-400">&gt; Encoding phantom payload to Zero-Width binary...</p>
                    <p className="text-amber-400">&gt; Aligning 40ms Gap offset...</p>
                    <p className="text-emerald-400">&gt; Injecting S-CIP payload into Origin-Index [0]...</p>
                    <p className="text-white animate-pulse">&gt; FUSION REACTOR CRITICAL...</p>
                  </div>
                )}

                {fusionResult && !isProcessing && (
                  <div className="space-y-1 mt-4">
                    <p className="text-emerald-500 font-bold">&gt; [SUCCESS] INJECTION COMPLETE.</p>
                    <p className="text-zinc-400">&gt; Payload Size: {fusionResult.length} bytes.</p>
                    <p className="text-zinc-500">&gt; The Trojan is ready for deployment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Result Box */}
            <div className={`transition-all duration-500 ${fusionResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-emerald-400">DEPLOYMENT READY</span>
                  </div>
                  
                  {/* We don't show the actual text here because it looks identical to targetText, 
                      we just provide the copy button to prove the magic is in the clipboard */}
                  <p className="text-xs text-zinc-400 mb-4">
                    The text has been fused with the invisible payload. Copy it and paste it directly into the target platform.
                  </p>

                  <button
                    onClick={copyToClipboard}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? (
                      <><Check size={16} className="text-emerald-400" /> COPIED TO CLIPBOARD</>
                    ) : (
                      <><Copy size={16} /> COPY FUSION PAYLOAD</>
                    )}
                  </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
