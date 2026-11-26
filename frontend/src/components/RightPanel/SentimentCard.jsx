import React from 'react';
import { Smile, Frown, Meh, Sparkles, HeartHandshake } from 'lucide-react';

export default function SentimentCard({ sentiment = 'Positive', confidence = 0.91 }) {
  // Format sentiment style
  const getSentimentDetails = (sentimentName) => {
    switch (sentimentName.toLowerCase()) {
      case 'positive':
      case 'positive & reassured':
      case 'high purchase intent':
        return {
          icon: Smile,
          badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          indicatorColor: 'bg-emerald-400',
          label: 'Positive & Receptive',
          description: 'Prospect displays strong urgency regarding CRM migration and high enthusiasm for autonomous voice qualification.',
        };
      case 'hesitant':
      case 'neutral':
        return {
          icon: Meh,
          badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          indicatorColor: 'bg-amber-400',
          label: 'Hesitant / Evaluating',
          description: 'Prospect has budget or timeline reservations. Requires contractual bridge reassurance.',
        };
      default:
        return {
          icon: Frown,
          badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          indicatorColor: 'bg-rose-400',
          label: 'Challenging / At Risk',
          description: 'Objections around security, adoption, or switching costs have not yet been addressed.',
        };
    }
  };

  const details = getSentimentDetails(sentiment);
  const IconComponent = details.icon;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Live Sentiment & Tone
            </h3>
            <p className="text-[10px] text-slate-400">
              Real-time conversational emotion analysis
            </p>
          </div>
        </div>

        {/* Sentiment Badge */}
        <div className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${details.badgeColor}`}>
          <IconComponent className="w-3.5 h-3.5" />
          <span>{details.label}</span>
        </div>
      </div>

      {/* Description & Confidence Bar */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {details.description}
      </p>

      {/* Confidence meter */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>AI Confidence Score</span>
          <span className="text-slate-200">{Math.round(confidence * 100)}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${details.indicatorColor}`}
            style={{ width: `${Math.round(confidence * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
