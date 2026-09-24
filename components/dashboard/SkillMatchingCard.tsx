'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface SkillMatchingCardProps {
  score?: number;
  targetRole?: string;
  topMatchingSkills?: string[];
  missingSkills?: string[];
  guidanceText?: string;
}

export default function SkillMatchingCard({
  score = 78,
  targetRole = 'Full Stack Developer',
  topMatchingSkills = ['Python', 'SQL', 'Machine Learning', 'React', 'Problem Solving'],
  missingSkills = ['Data Structures', 'System Design'],
  guidanceText = 'Improve your skills in Data Structures and System Design to unlock more high-paying opportunities.',
}: SkillMatchingCardProps) {
  // SVG circular calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Skill Based Job Matching</h3>
              <p className="text-[11px] text-slate-400">Target Role: {targetRole}</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Active Match
          </span>
        </div>

        {/* Circular Match Score Display */}
        <div className="py-6 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="text-slate-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="text-brand-600 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {score}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Match Score
              </span>
            </div>
          </div>
        </div>

        {/* Top Matching Skills */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Top Matching Skills
          </span>
          <div className="grid grid-cols-2 gap-2">
            {topMatchingSkills.slice(0, 5).map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs font-semibold text-emerald-800"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{skill} ✓</span>
              </div>
            ))}
          </div>

          {/* Missing or Weak Skills */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 mt-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Recommended Skill Boost</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {guidanceText}
            </p>
          </div>
        </div>
      </div>

      {/* Button: View Skills Roadmap */}
      <div className="pt-5 mt-4 border-t border-slate-100">
        <Link
          href="/skill-matching"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs"
        >
          <span>View Skills Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
