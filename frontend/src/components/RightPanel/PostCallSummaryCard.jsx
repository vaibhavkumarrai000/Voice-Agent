import React, { useState } from 'react';
import { 
  FileText, 
  Check, 
  Copy, 
  UploadCloud, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';

export default function PostCallSummaryCard({ summary, onSyncCrm }) {
  const [copied, setCopied] = useState(false);
  const [synced, setSynced] = useState(false);

  if (!summary) return null;

  const painPoints = summary.painPoints || summary.keyPainPoints || [];
  const nextSteps = summary.nextSteps || summary.agreedNextSteps || [];
  const objections = summary.objectionsRaised || [];
  const dealLikelihood = summary.dealLikelihood || 'High';

  const handleCopy = () => {
    const text = `HelpingHand AI Sales Call Summary
Lead: ${summary.leadName || 'Alex Chen'} (${summary.company || 'TechScale Inc.'})
Deal Likelihood: ${dealLikelihood}
Recap: ${summary.executiveSummary || summary.executiveRecap}

Pain Points:
${painPoints.map((p) => `- ${p}`).join('\n')}

Objections Raised:
${objections.map((o) => `- ${o}`).join('\n')}

Agreed Next Steps:
${nextSteps.map((s) => `- ${s}`).join('\n')}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncCRM = () => {
    setSynced(true);
    if (onSyncCrm) onSyncCrm();
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Post-Call Executive Summary
            </h3>
            <p className="text-[10px] text-slate-400">
              Generated via /api/end-call & Gemini AI
            </p>
          </div>
        </div>

        {/* Sync Status Button */}
        <button
          onClick={handleSyncCRM}
          className={`flex items-center space-x-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition ${
            synced
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/30 text-indigo-300'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>{synced ? 'Synced to CRM!' : 'Sync to CRM'}</span>
        </button>
      </div>

      {/* Opportunity Overview & Deal Likelihood Badge */}
      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70 mb-2.5">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-semibold text-white">
            {summary.leadName || 'Alex Chen'} • {summary.company || 'TechScale Inc.'}
          </span>
          <span className="text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>{dealLikelihood} Likelihood</span>
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {summary.executiveSummary || summary.executiveRecap}
        </p>
      </div>

      {/* Key Pain Points */}
      {painPoints.length > 0 && (
        <div className="mb-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Identified Pain Points</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {painPoints.slice(0, 3).map((point, i) => (
              <li key={i} className="flex items-start space-x-1.5 text-[11px]">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Agreed Next Steps */}
      {nextSteps.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <ArrowRight className="w-3 h-3 text-emerald-400" />
            <span>Agreed Next Steps</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {nextSteps.slice(0, 3).map((step, i) => (
              <li key={i} className="flex items-start space-x-1.5 text-[11px]">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copy Summary Footer */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center space-x-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-medium transition"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Copied Full Report!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Call Report</span>
          </>
        )}
      </button>
    </div>
  );
}
