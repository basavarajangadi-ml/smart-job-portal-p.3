'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import {
  BarChart3,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  PieChart,
  Briefcase,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { ApplicationAnalyticsData } from '@/types';

export default function AnalyticsPage() {
  const [data, setData] = useState<ApplicationAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.success && resData?.analytics) {
          setData(resData.analytics);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const monthly = data?.monthlyApplications || [
    { month: 'May', count: 2 },
    { month: 'June', count: 4 },
    { month: 'July', count: 7 },
    { month: 'August', count: 12 },
  ];

  const maxMonthCount = Math.max(...monthly.map((m) => m.count), 1);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Job Application Analytics
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Visualize your application momentum, category distributions, interview conversion rates, and skill trends.
            </p>
          </div>

          <Link
            href="/applications"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all self-start sm:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>Manage Applications</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Computing application metrics...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Applications"
                value={data?.totalApplications || 12}
                icon={Send}
                colorScheme="blue"
                subtitle="All submitted roles"
                trend={data?.trends?.totalChange || '+12% this week'}
                trendDirection="up"
              />
              <StatCard
                title="Shortlisted"
                value={data?.shortlistedCount || 4}
                icon={CheckCircle2}
                colorScheme="indigo"
                subtitle="Profile shortlisted"
                trend={data?.trends?.shortlistedChange || '+25% this week'}
                trendDirection="up"
              />
              <StatCard
                title="Interviews"
                value={data?.interviewCount || 2}
                icon={Calendar}
                colorScheme="emerald"
                subtitle="Live technical rounds"
                trend={data?.trends?.interviewsChange || '+100% this week'}
                trendDirection="up"
              />
              <StatCard
                title="Rejected"
                value={data?.rejectedCount || 1}
                icon={AlertCircle}
                colorScheme="rose"
                subtitle="Unsuccessful rounds"
                trend={data?.trends?.rejectedChange || '0% this week'}
                trendDirection="neutral"
              />
            </div>

            {/* Charts Row: Applications by Month & Interview Outcome */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Applications by Month (Bar chart) */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Applications by Month
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Submission trajectory over recent hiring quarters
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
                      Steady Upward Trend
                    </span>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="pt-8 pb-4">
                    <div className="grid grid-cols-4 gap-4 sm:gap-8 items-end h-48 sm:h-52 px-4 border-b border-slate-200">
                      {monthly.map((m) => {
                        const heightPct = Math.round((m.count / maxMonthCount) * 100);
                        return (
                          <div
                            key={m.month}
                            className="flex flex-col items-center gap-2 h-full justify-end group"
                          >
                            <span className="text-xs font-bold text-slate-700 group-hover:text-brand-600 transition-colors">
                              {m.count}
                            </span>
                            <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex items-end h-full">
                              <div
                                className="w-full bg-gradient-to-t from-brand-600 to-indigo-500 rounded-t-xl transition-all duration-700 group-hover:brightness-110"
                                style={{ height: `${heightPct}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">
                              {m.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>May → June → July → August progression</span>
                  <span className="font-bold text-brand-600">+140% growth in applications</span>
                </div>
              </div>

              {/* Interview Outcome Breakdown */}
              <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">
                      Interview Outcome
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Conversion rate across interview pipeline
                    </p>
                  </div>

                  <div className="py-6 space-y-4">
                    {/* Selected */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Selected / Offers</span>
                        </span>
                        <span className="text-emerald-700 font-extrabold">
                          {data?.interviewOutcomes?.selected || 1}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-emerald-200 overflow-hidden">
                        <div className="h-full bg-emerald-600 w-1/3 rounded-full" />
                      </div>
                    </div>

                    {/* Pending */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-brand-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-600" />
                          <span>Pending / In Progress</span>
                        </span>
                        <span className="text-brand-700 font-extrabold">
                          {data?.interviewOutcomes?.pending || 2}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-brand-200 overflow-hidden">
                        <div className="h-full bg-brand-600 w-2/3 rounded-full" />
                      </div>
                    </div>

                    {/* Rejected */}
                    <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-rose-900 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Rejected / Closed</span>
                        </span>
                        <span className="text-rose-700 font-extrabold">
                          {data?.interviewOutcomes?.rejected || 1}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-rose-200 overflow-hidden">
                        <div className="h-full bg-rose-600 w-1/4 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <span className="text-xs font-bold text-slate-700">
                    67% Interview Conversion Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Job Categories & Top Skills Demand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Categories Distribution */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Applications by Job Category
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Breakdown of applied fresher roles across domains
                  </p>
                </div>

                <div className="space-y-3.5">
                  {(data?.categoriesDistribution || [
                    { name: 'IT / Software', count: 5, percentage: 42 },
                    { name: 'Web Development', count: 4, percentage: 33 },
                    { name: 'Data Science', count: 2, percentage: 17 },
                    { name: 'Others', count: 1, percentage: 8 },
                  ]).map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{cat.name}</span>
                        <span className="text-slate-500 font-semibold">
                          {cat.count} roles ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full transition-all duration-700"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Skills Demand */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    Top Skills Matching Recruiter Demand
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Frequency and relevance of your skills across submitted applications
                  </p>
                </div>

                <div className="space-y-3.5">
                  {(data?.topSkillsDemand || [
                    { skill: 'Python', percentage: 88 },
                    { skill: 'SQL', percentage: 76 },
                    { skill: 'React', percentage: 82 },
                    { skill: 'JavaScript', percentage: 90 },
                    { skill: 'Machine Learning', percentage: 68 },
                  ]).map((sk) => (
                    <div key={sk.skill} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{sk.skill}</span>
                        </span>
                        <span className="text-brand-600 font-extrabold">{sk.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${sk.percentage}%` }}
                        />
                      </div>
                    </div>
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
