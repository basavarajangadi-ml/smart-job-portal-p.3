'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Sparkles,
  Loader2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { SkillMatchOverview } from '@/types';

export default function SkillMatchingPage() {
  const [data, setData] = useState<SkillMatchOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');

  const roleOptions = [
    'Full Stack Developer',
    'Frontend Developer',
    'Python Developer',
    'Data Analyst',
    'Machine Learning Engineer',
  ];

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.success && resData?.skillMatch) {
          setData(resData.skillMatch);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const score = data?.overallScore || 78;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Skill-Based Job Matching
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analyze your current technical match against fresher industry requirements and unlock your skills roadmap.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all self-start sm:self-auto"
          >
            <Briefcase className="w-4 h-4" />
            <span>Explore Matched Jobs</span>
          </Link>
        </div>

        {/* Role Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Target Role:
          </span>
          {roleOptions.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRole === role
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Calculating skill match metrics...</p>
          </div>
        ) : (
          <>
            {/* Top Score & Verified Skills Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circular Match Card */}
              <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Overall Job Match Score
                </span>

                <div className="my-6 relative flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="text-brand-600 transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 leading-none">
                      {score}%
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mt-1">
                      Match Score
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-brand-50/70 border border-brand-100 text-xs text-brand-900 font-medium w-full">
                  High profile relevance for {selectedRole} entry positions
                </div>
              </div>

              {/* Matching & Missing Skills Summary */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Top Matching Skills (Verified)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(data?.topMatchingSkills || ['Python', 'SQL', 'Machine Learning', 'React', 'Problem Solving']).map(
                      (skill) => (
                        <div
                          key={skill}
                          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-bold text-emerald-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{skill} ✓</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Missing or Weak Skills</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-2">
                    <p className="font-semibold">
                      {data?.guidanceText ||
                        'Improve your skills in Data Structures and System Design to unlock more high-paying opportunities.'}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(data?.missingSkills || ['Data Structures', 'System Design', 'Docker']).map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 text-[11px] font-bold"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Roadmap Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Curated Skills Learning Roadmap
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step-by-step competencies required for junior and fresher engineering hiring
                  </p>
                </div>
                <Link
                  href="/interview-prep"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <span>Practice Technical Topics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(data?.skillRoadmap || []).map((cat, idx) => (
                  <div
                    key={cat.category}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {idx + 1}. {cat.category}
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {cat.skills.map((sk) => (
                        <div
                          key={sk.name}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            {sk.status === 'acquired' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-500 shrink-0" />
                            )}
                            <span className="font-semibold text-slate-800">{sk.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sk.status === 'acquired'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {sk.importance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
