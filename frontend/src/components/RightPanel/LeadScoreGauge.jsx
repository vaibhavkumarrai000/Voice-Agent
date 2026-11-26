import React from 'react';
import { Target, TrendingUp, Award, CheckCircle } from 'lucide-react';

export default function LeadScoreGauge({ score = 84 }) {
  // Determine color and status badge based on 0-100 score
  const getRating = (val) => {
    if (val >= 80) return { label: 'High Intent (SQL)', color: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (val >= 50) return { label: 'Moderate Fit (MQL)', color: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Low Fit / Unqualified', color: 'text-rose-400', stroke: '#f43f5e', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const rating = getRating(score);

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40 flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Lead Qualification Score
            </h3>
            <p className="text-[10px] text-slate-400">
              Autonomous BANT & Intent Evaluation
            </p>
          </div>
        </div>

        {/* Rating Pill */}
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${rating.bg} ${rating.color}`}>
          {rating.label}
        </span>
      </div>

      {/* Center Gauge & Metric Display */}
      <div className="flex items-center justify-center space-x-6 py-2">
        {/* Circular SVG Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress Stroke */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={rating.stroke}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-white tracking-tight font-mono">
              {score}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
              / 100
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex flex-col space-y-1.5 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium">+14 pts after contract bridge offer</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] text-slate-400">Conversion Likelihood: <strong className="text-slate-200">82%</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">Target Rep Count: <strong className="text-slate-200">25 seats</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
