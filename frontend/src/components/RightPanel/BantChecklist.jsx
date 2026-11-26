import React from 'react';
import { CheckSquare, Square, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function BantChecklist({ bant, onToggleBant }) {
  const criteria = [
    { key: 'budget', title: 'Budget', description: bant.budget.detail, status: bant.budget.status, confidence: bant.budget.confidence },
    { key: 'authority', title: 'Authority', description: bant.authority.detail, status: bant.authority.status, confidence: bant.authority.confidence },
    { key: 'need', title: 'Need', description: bant.need.detail, status: bant.need.status, confidence: bant.need.confidence },
    { key: 'timeline', title: 'Timeline', description: bant.timeline.detail, status: bant.timeline.status, confidence: bant.timeline.confidence },
  ];

  const completedCount = criteria.filter((c) => c.status).length;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              BANT Qualification Checklist
            </h3>
            <p className="text-[10px] text-slate-400">
              Budget • Authority • Need • Timeline
            </p>
          </div>
        </div>

        {/* Progress pill */}
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/20">
          {completedCount} / 4 Verified
        </span>
      </div>

      {/* BANT Criteria Items */}
      <div className="space-y-2">
        {criteria.map((item) => (
          <div
            key={item.key}
            onClick={() => onToggleBant(item.key)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
              item.status
                ? 'bg-slate-950/60 border-emerald-500/30 hover:border-emerald-500/50'
                : 'bg-slate-950/30 border-slate-800 hover:border-slate-700 opacity-60'
            }`}
          >
            {/* Checkbox button */}
            <button className="mt-0.5 text-emerald-400 hover:text-emerald-300 transition">
              {item.status ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold tracking-wide ${item.status ? 'text-slate-200' : 'text-slate-400'}`}>
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {item.confidence} conf.
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
