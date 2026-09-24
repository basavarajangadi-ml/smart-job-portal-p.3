'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  BarChart,
  Target,
  RefreshCw,
} from 'lucide-react';
import { ResumeStrengthAnalysis } from '@/types';

export default function ResumeAnalysisPage() {
  const [data, setData] = useState<ResumeStrengthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = () => {
    setLoading(true);
    fetch('/api/resume-analysis')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.success && resData?.report) {
          setData(resData.report);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const score = data?.score || 72;
  const grade = data?.grade || 'Good';
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor =
    score >= 80 ? 'text-emerald-500' : score >= 65 ? 'text-brand-600' : 'text-amber-500';

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Resume Strength Analysis
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated ATS score, keyword coverage, and section-by-section recruiter readiness analysis.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchAnalysis}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-analyze</span>
            </button>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Improve Resume</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">
              Scanning resume files, technical projects & keywords...
            </p>
          </div>
        ) : (
          <>
            {/* Top Score & Summary Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circular Gauge Card */}
              <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Overall Resume Strength
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
                      className={`${scoreColor} transition-all duration-1000 ease-out`}
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
                    <span className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                      {grade}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ATS Screening: Competitive
                </span>
              </div>

              {/* Actionable Suggestions & Summary */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Recruiter Assessment Summary
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-3">
                    {data?.summary}
                  </p>

                  {/* Priority Recommendations */}
                  <div className="mt-4 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Priority Recommendations
                    </h4>
                    {data?.suggestions?.map((sug, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Live analysis calibrated with your profile & uploaded documents
                  </span>
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>Edit Profile & Resume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Section Breakdown Bars */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Section-by-Section Score Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed evaluation of what recruiters and ATS algorithms look for
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data?.breakdown &&
                  Object.entries(data.breakdown).map(([key, item]) => {
                    const label = {
                      skillsAndKeywords: 'Skills & Keywords',
                      projects: 'Projects & Portfolios',
                      education: 'Education & Academics',
                      experience: 'Experience & Internships',
                      formatting: 'Formatting & ATS Cleanliness',
                      jobRelevance: 'Target Job Relevance',
                    }[key] || key;

                    const pct = Math.round((item.score / item.max) * 100);

                    return (
                      <div
                        key={key}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800">{label}</span>
                          <span className="text-brand-600">
                            {item.score} / {item.max} pts ({item.status})
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Keyword Matcher Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Found Keywords */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    High-Impact Keywords Detected ({data?.foundKeywords?.length || 0})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data?.foundKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                    >
                      {kw} ✓
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Recommended Missing Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data?.missingKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
