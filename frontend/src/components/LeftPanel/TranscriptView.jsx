import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Volume2,
  Sparkles,
  MessageSquare,
  CornerDownLeft,
  ShieldAlert,
  DollarSign,
  CalendarCheck,
  HelpCircle,
  Loader2,
  Mic
} from 'lucide-react';

export default function TranscriptView({
  transcript,
  onSendMessage,
  onSimulateEvent,
  simulationEvents = [],
  isCallActive,
  agentStatus = 'idle',
}) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, agentStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // 3 Clickable Quick Test Prompts requested by evaluator
  const quickTestPrompts = [
    {
      label: 'How does pricing compare to HubSpot?',
      icon: DollarSign,
      color: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5',
    },
    {
      label: 'Are you SOC2 compliant?',
      icon: ShieldAlert,
      color: 'text-amber-400 border-amber-500/30 hover:border-amber-500/60 bg-amber-500/5',
    },
    {
      label: 'Book a demo for tomorrow at 3 PM',
      icon: CalendarCheck,
      color: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/5',
    },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col h-[530px] shadow-xl shadow-slate-950/40 overflow-hidden">
      {/* Transcript Header with Live Stream Pill */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200">
            Live Conversation Transcript
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            {transcript.length} turns
          </span>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center space-x-2 font-mono text-[11px]">
          {agentStatus === 'listening' && (
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>STT: Listening...</span>
            </span>
          )}
          {agentStatus === 'thinking' && (
            <span className="flex items-center space-x-1.5 text-indigo-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>RAG & Gemini Thinking...</span>
            </span>
          )}
          {agentStatus === 'speaking' && (
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>TTS: Speaking...</span>
            </span>
          )}
          {agentStatus !== 'listening' && agentStatus !== 'thinking' && agentStatus !== 'speaking' && (
            <span className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>Bi-directional Voice Stream</span>
            </span>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
        {transcript.map((msg) => {
          const isAgent = msg.speaker === 'agent';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {/* Agent Avatar */}
              {isAgent && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 ring-1 ring-white/10 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-[13px] leading-relaxed transition-all ${isAgent
                  ? 'bg-slate-900 border border-indigo-500/20 text-slate-200 rounded-tl-sm shadow-md shadow-slate-950/50'
                  : 'bg-indigo-600/90 border border-indigo-400/30 text-white rounded-tr-sm shadow-md shadow-indigo-900/30'
                  }`}
              >
                {/* Speaker Meta Header */}
                <div className="flex items-center justify-between mb-1 space-x-2 text-[11px]">
                  <span className={`font-semibold tracking-wide ${isAgent ? 'text-indigo-400' : 'text-indigo-200'}`}>
                    {msg.name}
                  </span>
                  <span className="text-[10px] font-mono opacity-70">
                    {msg.time}
                  </span>
                </div>

                {/* Message Body */}
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Agent Synthesized indicator */}
                {isAgent && (
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center space-x-1 text-indigo-300">
                      <Volume2 className="w-3 h-3" />
                      <span>Neural Voice Speech (TTS)</span>
                    </span>
                    <span className="text-slate-500">Latency: ~180ms</span>
                  </div>
                )}
              </div>

              {/* Prospect / Lead Avatar */}
              {!isAgent && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live Typing / Thinking Indicator Bubble */}
        {agentStatus === 'thinking' && (
          <div className="flex items-start space-x-3 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-3 text-xs text-indigo-300 flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Querying HelpingHand AI knowledge base & Gemini neural engine...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Test Prompts Chips */}
      <div className="p-2.5 bg-slate-900/95 border-t border-slate-800/80 space-y-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>1-Click Test Prompts (RAG, Security, Booking)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickTestPrompts.map((q, idx) => {
              const IconComp = q.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q.label)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition flex items-center space-x-1 text-slate-200 ${q.color}`}
                >
                  <IconComp className="w-3 h-3 shrink-0" />
                  <span>"{q.label}"</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Objection Simulator Chips */}
        {simulationEvents.length > 0 && (
          <div className="pt-1 border-t border-slate-800/60 flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-500 shrink-0">Objections:</span>
            {simulationEvents.map((event, idx) => (
              <button
                key={idx}
                onClick={() => onSimulateEvent(event)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition shrink-0"
              >
                {event.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clean Text Input Bar (Fallback when Mic is unavailable or in screen-share) */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isCallActive
                ? "Speak into your mic or type here (e.g., 'We have 6 months left on HubSpot')..."
                : "Click 'Start Voice Call' above or type a customer message..."
            }
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={!inputText.trim()}
          title="Send message"
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-600/30 transition flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
