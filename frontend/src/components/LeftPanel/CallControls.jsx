import React from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Globe, 
  Radio, 
  Volume2, 
  Clock, 
  Waves,
  Loader2,
  Square,
  Sparkles
} from 'lucide-react';

export default function CallControls({
  isCallActive,
  callDuration,
  isMicMuted,
  language,
  onStartCall,
  onEndCall,
  onToggleMic,
  onLanguageChange,
  agentStatus = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking' | 'ended'
  onBargeIn,
}) {
  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Status Pill details
  const renderStatusPill = () => {
    if (!isCallActive) {
      if (agentStatus === 'ended') {
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Call Ended</span>
          </span>
        );
      }
      return (
        <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>Ready to Call</span>
        </span>
      );
    }

    switch (agentStatus) {
      case 'listening':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Listening...</span>
          </span>
        );
      case 'thinking':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono text-[11px]">
            <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
            <span>Thinking...</span>
          </span>
        );
      case 'speaking':
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono text-[11px]">
            <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Speaking...</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Call</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40">
      {/* Top Status Bar: Status Pill & Call Duration Timer */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          {renderStatusPill()}

          {/* Barge In Button when Agent is Speaking */}
          {agentStatus === 'speaking' && isCallActive && (
            <button
              onClick={onBargeIn}
              className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-mono transition"
              title="Click to interrupt AI agent speech (Barge-In)"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Barge In (Interrupt)</span>
            </button>
          )}
        </div>

        {/* Call Duration Timer */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 font-mono text-xs text-slate-200">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatTime(callDuration)}</span>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* Left: Start / End Call Buttons */}
        <div className="flex items-center space-x-2">
          {!isCallActive ? (
            <button
              onClick={onStartCall}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition group"
            >
              <PhoneCall className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Start Voice Call</span>
            </button>
          ) : (
            <button
              onClick={onEndCall}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-rose-500/20 active:scale-98 transition group"
            >
              <PhoneOff className="w-4 h-4 text-rose-100 group-hover:scale-110 transition-transform" />
              <span className="text-sm">End Voice Call</span>
            </button>
          )}

          {/* Mic Status Toggle */}
          <button
            onClick={onToggleMic}
            disabled={!isCallActive}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone (Barge-In)'}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
              !isCallActive
                ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-400'
                : isMicMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
            }`}
          >
            {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Right: Language Selector & Voice Wave Indicator */}
        <div className="flex items-center justify-between sm:justify-end space-x-2.5">
          {/* Audio Visualizer Wave Simulation */}
          <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 mr-1 flex items-center space-x-1">
              <Radio className={`w-3 h-3 ${isCallActive && !isMicMuted ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <span>{isMicMuted ? 'MUTED' : agentStatus.toUpperCase()}</span>
            </span>
            <div className="flex items-center space-x-0.5 h-4">
              <span className={`w-1 rounded-full ${isCallActive && !isMicMuted && (agentStatus === 'speaking' || agentStatus === 'listening') ? 'h-3 bg-emerald-400 animate-soundwave-1' : 'h-1 bg-slate-700'}`} />
              <span className={`w-1 rounded-full ${isCallActive && !isMicMuted && (agentStatus === 'speaking' || agentStatus === 'listening') ? 'h-4 bg-indigo-400 animate-soundwave-2' : 'h-1 bg-slate-700'}`} />
              <span className={`w-1 rounded-full ${isCallActive && !isMicMuted && (agentStatus === 'speaking' || agentStatus === 'listening') ? 'h-2 bg-cyan-400 animate-soundwave-3' : 'h-1 bg-slate-700'}`} />
              <span className={`w-1 rounded-full ${isCallActive && !isMicMuted && (agentStatus === 'speaking' || agentStatus === 'listening') ? 'h-3.5 bg-emerald-400 animate-soundwave-4' : 'h-1 bg-slate-700'}`} />
            </div>
          </div>

          {/* Language Selector: English / Hindi */}
          <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                language === 'hi'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
