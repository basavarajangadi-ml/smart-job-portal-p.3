'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { CareerMilestoneItem } from '@/types';

interface CareerProgressCardProps {
  milestones?: CareerMilestoneItem[];
  completedCount?: number;
  totalMilestones?: number;
  motivationalMessage?: string;
}

export default function CareerProgressCard({
  milestones = [
    {
      id: 1,
      title: 'Learn Skills',
      subtitle: 'Master core frameworks, programming & tools',
      status: 'completed',
      stageNumber: 1,
    },
    {
      id: 2,
      title: 'Build Projects',
      subtitle: 'Build and deploy verified GitHub repositories',
      status: 'completed',
      stageNumber: 2,
    },
    {
      id: 3,
      title: 'Apply for Jobs',
      subtitle: 'Actively submitting tailored student applications',
      status: 'current',
      stageNumber: 3,
    },
    {
      id: 4,
      title: 'Get Hired',
      subtitle: 'Interviews, assessments and final selection',
      status: 'upcoming',
      stageNumber: 4,
    },
  ],
  completedCount = 2,
  totalMilestones = 4,
  motivationalMessage = "You're doing great! You've completed 2 out of 4 career milestones.",
}: CareerProgressCardProps) {
  const progressPct = Math.round((completedCount / totalMilestones) * 100);

  return (
    <div id="career-progress" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Career Progress Journey</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step pathway from college student to full-time career placement
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-semibold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>{completedCount} of {totalMilestones} Milestones Achieved</span>
        </div>
      </div>

      {/* Motivational message banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-purple-500/10 border border-brand-100 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-900">{motivationalMessage}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            You are at Stage 3: Apply for Jobs. Keep applying to tailored openings!
          </p>
        </div>
        <div className="w-24 sm:w-32 shrink-0">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="relative pt-2 pb-1">
        {/* Connecting line */}
        <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-100 -z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {milestones.map((m, idx) => {
            const isCompleted = m.status === 'completed';
            const isCurrent = m.status === 'current';
            const isUpcoming = m.status === 'upcoming';

            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-brand-50/70 border-brand-200 shadow-xs'
                    : isCompleted
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50/50 border-slate-200/60 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isCompleted
                          ? 'text-emerald-700'
                          : isCurrent
                          ? 'text-brand-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✓ Completed' : isCurrent ? '● Current Stage' : 'Upcoming'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {m.title}
                    </h4>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {m.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
