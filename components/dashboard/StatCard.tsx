import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorScheme: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorScheme,
  subtitle,
  trend,
  trendDirection = 'up',
}: StatCardProps) {
  const schemeStyles = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-brand-600',
      border: 'border-blue-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
  }[colorScheme];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${schemeStyles.bg} ${schemeStyles.text} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
          {trend && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                trendDirection === 'up'
                  ? 'bg-emerald-50 text-emerald-700'
                  : trendDirection === 'down'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {trendDirection === 'up' ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : trendDirection === 'down' ? (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              ) : (
                <Minus className="w-3 h-3 text-slate-400" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

