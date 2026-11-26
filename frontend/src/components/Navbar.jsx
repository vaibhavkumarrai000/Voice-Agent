import React from 'react';
import { 
  Bot, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Server, 
  Wifi, 
  RefreshCw 
} from 'lucide-react';

export default function Navbar({ 
  callState, 
  serverConnected, 
  onResetDemo, 
  onCheckBackend 
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                HelpingHand AI
              </h1>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Autonomous Sales Voice Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Zero-Admin B2B Revenue Intelligence & Live Qualification Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Chips */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Gemini AI Engine Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">Gemini 2.5 Flash</span>
          </div>

          {/* Backend Connection Health */}
          <button 
            onClick={onCheckBackend}
            title="Click to re-verify Express Backend Connection"
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              serverConnected 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>{serverConnected ? 'API Live (Port 5000)' : 'Connecting API...'}</span>
          </button>

          {/* SOC 2 Badge */}
          <div className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>SOC 2 Type II</span>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset interview state to initial values"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span className="text-[11px]">Reset State</span>
          </button>
        </div>
      </div>
    </header>
  );
}
