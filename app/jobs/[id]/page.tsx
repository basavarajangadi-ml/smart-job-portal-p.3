'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Footer from '@/components/footer/Footer';
import ApplyModal from '@/components/jobs/ApplyModal';
import { JobData } from '@/types';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Calendar,
  Building2,
  CheckCircle,
  ArrowLeft,
  Share2,
  Loader2,
  Send,
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();
      if (data?.success && data?.job) {
        setJob(data.job);
        setIsSaved(data.job.isSaved || false);
        setHasApplied(data.job.hasApplied || false);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleSaveToggle = async () => {
    if (!job) return;
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job._id }),
        });
      } else {
        await fetch(`/api/saved-jobs/${job._id}`, {
          method: 'DELETE',
        });
      }
    } catch {
      setIsSaved(!nextSaved);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Opportunities</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-sm font-medium text-slate-500">Loading opportunity details...</p>
          </div>
        ) : !job ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-xs p-8">
            <h3 className="text-lg font-bold text-slate-900">Job Not Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              The opportunity you are looking for does not exist or may have expired.
            </p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700"
            >
              Browse other opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Job Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  {job.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                      <Building2 className="w-8 h-8 text-slate-400" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {job.company}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {job.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        {job.workMode}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {job.jobType}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                        {job.experienceLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Header Actions */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    title="Copy opportunity link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {copied && (
                    <span className="text-[11px] font-semibold text-emerald-600">Copied!</span>
                  )}

                  <button
                    onClick={handleSaveToggle}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                      isSaved
                        ? 'bg-brand-50 text-brand-600 border-brand-200'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-600' : ''}`} />
                    <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Job'}</span>
                  </button>
                </div>
              </div>

              {/* Meta Grid Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Location</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Compensation</span>
                  <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Posted</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatRelativeTime(job.postedDate)}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Deadline</span>
                  <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.deadline ? formatDate(job.deadline) : 'Rolling admission'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Job Description & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                    About This Role
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                      Key Responsibilities
                    </h2>
                    <ul className="space-y-2.5">
                      {job.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                          <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Qualifications & Requirements */}
                {(job.requirements?.length > 0 || job.qualifications?.length > 0) && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                      Qualifications & Requirements
                    </h2>
                    <ul className="space-y-2.5">
                      {[...(job.requirements || []), ...(job.qualifications || [])].map((item, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Apply Widget, Required Skills & Benefits */}
              <div className="space-y-6">
                {/* Apply Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 sticky top-24">
                  <h3 className="text-sm font-bold text-slate-900">Ready to Apply?</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Submit your student profile and verified resume directly to {job.company}&apos;s hiring team.
                  </p>

                  {hasApplied ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-emerald-900">
                        You have already applied for this position.
                      </p>
                      <Link
                        href="/applications"
                        className="inline-block text-xs font-semibold text-emerald-700 underline"
                      >
                        View your application status →
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Apply Now</span>
                    </button>
                  )}

                  {/* Required Skills Badges */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Perks & Benefits
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {job.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Apply Modal */}
      {job && (
        <ApplyModal
          job={job}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onSuccess={() => {
            setHasApplied(true);
            fetchJob();
          }}
        />
      )}

      <Footer />
    </div>
  );
}
