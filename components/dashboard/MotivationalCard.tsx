'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Send, TrendingUp } from 'lucide-react';

export default function MotivationalCard() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-7 shadow-sm relative overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/95 text-[11px] font-semibold backdrop-blur-sm mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Daily Student Motivation</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          Your Dream Job Is Closer Than You Think
        </h3>

        <p className="text-xs text-brand-100 mt-2 leading-relaxed max-w-xl">
          Continuous small steps create massive leaps. Polish your portfolio projects, verify your skill match scores, and interview with confidence.
        </p>
      </div>

      <div className="relative z-10 pt-5 mt-4 border-t border-white/15 flex flex-wrap items-center gap-2.5">
        <Link
          href="/interview-prep"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-brand-700 text-xs font-bold hover:bg-brand-50 transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Learn</span>
        </Link>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all backdrop-blur-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Apply</span>
        </Link>
        <Link
          href="/skill-matching"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all backdrop-blur-xs"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Grow</span>
        </Link>
      </div>
    </div>
  );
}
