'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import RecommendedJobCard from '@/components/jobs/RecommendedJobCard';
import MotivationalCard from '@/components/dashboard/MotivationalCard';
import SkillMatchingCard from '@/components/dashboard/SkillMatchingCard';
import ResumeStrengthCard from '@/components/dashboard/ResumeStrengthCard';
import CareerProgressCard from '@/components/dashboard/CareerProgressCard';
import RecruiterFeedbackCard from '@/components/dashboard/RecruiterFeedbackCard';
import InterviewPrepCard from '@/components/dashboard/InterviewPrepCard';
import {
  Briefcase,
  Bookmark,
  Send,
  Sparkles,
  ArrowRight,
  Loader2,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  UserCheck,
  Award,
  AlertCircle,
} from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applicationFilter, setApplicationFilter] = useState('All');

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.success) {
          setData(resData);
        }
      })
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const filteredApplications = (data?.recentApplications || []).filter((app: any) => {
    if (applicationFilter === 'All') return true;
    return app.status === applicationFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {getGreeting()}, {data?.user?.name || 'Basavaraj'}! 👋
              </h1>
              {data?.user?.degree && (
                <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {data.user.degree} • {data.user.branch}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep going! Your skills and efforts are building a brighter future.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/interview-prep"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Practice Questions</span>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Find Opportunities</span>
            </Link>
          </div>
        </div>

        {/* Motivational Card Banner */}
        <MotivationalCard />

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">
              Loading your personalized career dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* 1. APPLICATION OVERVIEW STAT CARDS */}
            <div>
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Application Overview
                </h2>
                <Link
                  href="/analytics"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                >
                  <span>View Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Applications"
                  value={data?.stats?.totalApplications ?? 12}
                  icon={Send}
                  colorScheme="blue"
                  subtitle="Total jobs applied"
                  trend={data?.stats?.trends?.totalChange || '+12% this week'}
                  trendDirection="up"
                />
                <StatCard
                  title="Shortlisted"
                  value={data?.stats?.shortlistedCount ?? 4}
                  icon={CheckCircle2}
                  colorScheme="indigo"
                  subtitle="Under recruiter review"
                  trend={data?.stats?.trends?.shortlistedChange || '+25% this week'}
                  trendDirection="up"
                />
                <StatCard
                  title="Interviews"
                  value={data?.stats?.interviewCount ?? 2}
                  icon={Calendar}
                  colorScheme="emerald"
                  subtitle="Rounds scheduled"
                  trend={data?.stats?.trends?.interviewsChange || '+100% this week'}
                  trendDirection="up"
                />
                <StatCard
                  title="Rejected"
                  value={data?.stats?.rejectedCount ?? 1}
                  icon={AlertCircle}
                  colorScheme="rose"
                  subtitle="Closed applications"
                  trend={data?.stats?.trends?.rejectedChange || '0% this week'}
                  trendDirection="neutral"
                />
              </div>
            </div>

            {/* Smart Matching & Resume Strength Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3. Skill-Based Job Matching */}
              <SkillMatchingCard
                score={data?.skillMatch?.overallScore || 78}
                targetRole={data?.skillMatch?.targetRole || 'Full Stack Developer'}
                topMatchingSkills={data?.skillMatch?.topMatchingSkills}
                missingSkills={data?.skillMatch?.missingSkills}
                guidanceText={data?.skillMatch?.guidanceText}
              />

              {/* 7. Resume Strength Analysis */}
              <ResumeStrengthCard
                score={data?.resumeStrength?.score || 72}
                grade={data?.resumeStrength?.grade || 'Good'}
                summary={data?.resumeStrength?.summary}
              />
            </div>

            {/* 10. CAREER PROGRESS DASHBOARD */}
            <CareerProgressCard
              milestones={data?.careerProgress?.milestones}
              completedCount={data?.careerProgress?.completedCount || 2}
              totalMilestones={data?.careerProgress?.totalMilestones || 4}
              motivationalMessage={data?.careerProgress?.motivationalMessage}
            />

            {/* 2. PERSONALIZED JOB RECOMMENDATIONS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Personalized Job Recommendations
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Jobs recommended based on your skills, preferences, profile, and recent activity.
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Explore All Matching Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.recommendedJobs?.map((job: any) => (
                  <RecommendedJobCard key={job._id} job={job} />
                ))}
              </div>
            </div>

            {/* 4. APPLICATION STATUS TRACKING & RECENT PIPELINE */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Application Status Tracking
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track the live visual progress of your submitted fresher applications
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {['All', 'Applied', 'Shortlisted', 'Interview', 'Rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setApplicationFilter(status)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          applicationFilter === status
                            ? 'bg-brand-600 text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/applications"
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 shrink-0"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">No applications match this filter</p>
                  <p className="text-[11px] text-slate-400">
                    Browse new openings and apply with your ATS-ready resume.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="pb-3">Opportunity</th>
                        <th className="pb-3">Company</th>
                        <th className="pb-3">Applied Date</th>
                        <th className="pb-3">Pipeline Status</th>
                        <th className="pb-3">Next Step / Recruiter</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredApplications.map((app: any) => (
                        <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 font-bold text-slate-900">
                            {app.jobId?.title || 'Position'}
                          </td>
                          <td className="py-3.5 text-slate-600 font-medium">
                            {app.jobId?.company || 'Company'}
                          </td>
                          <td className="py-3.5 text-slate-500">
                            {formatDate(app.appliedAt)}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-slate-500">
                            {app.interviewDate ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                                <Calendar className="w-3 h-3 text-emerald-600" />
                                <span>Interview: {formatDate(app.interviewDate)}</span>
                              </span>
                            ) : app.recruiterInfo?.name ? (
                              <span className="text-[11px] text-slate-600">
                                {app.recruiterInfo.name} ({app.recruiterInfo.company || 'HR'})
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Application In Review</span>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            <Link
                              href={`/applications/${app._id}`}
                              className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 5. RECRUITER FEEDBACK SECTION */}
            <RecruiterFeedbackCard feedbacks={data?.recruiterFeedbacks || []} />

            {/* 6. INTERVIEW PREPARATION HUB */}
            <InterviewPrepCard />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
