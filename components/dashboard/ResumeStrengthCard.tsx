'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ResumeStrengthCardProps {
  score?: number;
  grade?: string;
  summary?: string;
}

export default function ResumeStrengthCard({
  score = 72,
  grade = 'Good',
  summary = 'Solid foundation! A few focused improvements in skills and project metrics will elevate your profile to top recruiters.',
}: ResumeStrengthCardProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Resume Strength Analysis</h3>
              <p className="text-[11px] text-slate-400">ATS Readiness & Keyphrase Score</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {grade}
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="py-5 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-slate-100"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-slate-900 leading-none">
                {score}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                {grade}
              </span>
            </div>
          </div>
        </div>

        {/* Summary note */}
        <p className="text-xs text-slate-600 leading-relaxed text-center sm:text-left">
          {summary}
        </p>

        {/* Key Quick Tips */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Add measurable project achievements and metrics</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Improve keyword matching for your target fresher role</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
        <Link
          href="/resume-analysis"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <span>View Detailed Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/resume"
          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
        >
          Improve Resume
        </Link>
      </div>
    </div>
  );
}
