import React from 'react';
import { BookOpen, Database, Sparkles, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function RagKnowledgeSnippet({ snippet, onQuickQuery }) {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Retrieved RAG Knowledge Snippet
            </h3>
            <p className="text-[10px] text-slate-400">
              HelpingHand AI Knowledge Base Context
            </p>
          </div>
        </div>

        {/* Relevance Match Tag */}
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono">
          <Zap className="w-3 h-3" />
          <span>{snippet?.relevance || 98}% Match</span>
        </div>
      </div>

      {/* Query tag & source */}
      <div className="mb-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span className="text-indigo-400 font-semibold">QUERY: {snippet?.query}</span>
          <span className="text-slate-500">{snippet?.category}</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          "{snippet?.snippet}"
        </p>
        <div className="mt-1.5 pt-1 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Source: {snippet?.source}</span>
          <span className="text-emerald-400">Verified Ground Truth</span>
        </div>
      </div>

      {/* Quick RAG topic buttons */}
      <div className="flex items-center space-x-1.5 pt-1">
        <span className="text-[10px] text-slate-400 font-mono">Quick Topic:</span>
        <button
          onClick={() => onQuickQuery('hubspot')}
          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          HubSpot Migration
        </button>
        <button
          onClick={() => onQuickQuery('pricing')}
          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          Pricing Tiers
        </button>
        <button
          onClick={() => onQuickQuery('security')}
          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          SOC 2 & Security
        </button>
      </div>
    </div>
  );
}
