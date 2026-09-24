'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, HelpCircle, Code, Play, ArrowRight, BookOpen } from 'lucide-react';

export default function InterviewPrepCard() {
  const prepFeatures = [
    {
      title: 'Common Questions',
      desc: 'Practice HR and frequently asked entry-level questions.',
      icon: HelpCircle,
      href: '/interview-prep?tab=common',
      tag: 'HR & Behavioral',
    },
    {
      title: 'Technical Topics',
      desc: 'Role-tailored technical questions for Frontend, Python & Data.',
      icon: Code,
      href: '/interview-prep?tab=technical',
      tag: 'Role Tailored',
    },
    {
      title: 'Mock Interview',
      desc: 'Simulate timed interview rounds with instant feedback cues.',
      icon: Play,
      href: '/interview-prep?tab=mock',
      tag: 'Interactive',
    },
    {
      title: 'HR Preparation',
      desc: 'Master the STAR framework and strategic interview questions.',
      icon: BookOpen,
      href: '/interview-prep?tab=hr',
      tag: 'Guides',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Interview Preparation Hub</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-tailored practice modules to excel in your technical & HR rounds
          </p>
        </div>
        <Link
          href="/interview-prep"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
        >
          <span>Explore All Prep</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prepFeatures.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.title}
              href={f.href}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-brand-50/50 hover:border-brand-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-brand-600 border border-slate-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {f.desc}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100/80 flex items-center gap-1 text-[11px] font-semibold text-brand-600">
                <span>Start Practice</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
