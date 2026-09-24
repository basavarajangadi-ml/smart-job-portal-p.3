'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ApplyModal from '@/components/jobs/ApplyModal';
import {
  Bookmark,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Trash2,
  ArrowRight,
  Send,
  Loader2,
  Check,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { JobData } from '@/types';

export default function SavedJobsPage() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobData | null>(null);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/saved-jobs');
      const data = await res.json();
      if (data?.success) {
        setSavedItems(data.savedJobs || []);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      const res = await fetch(`/api/saved-jobs/${jobId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data?.success) {
        setSavedItems((prev) => prev.filter((item) => item.job._id !== jobId));
      }
    } catch (err) {
      console.error('Error removing saved job:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Jobs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep track of roles you want to review or apply to later.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all self-start sm:self-auto"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse More Jobs</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Loading your bookmarked jobs...</p>
          </div>
        ) : savedItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Bookmark className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                You haven&apos;t saved any jobs yet.
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Bookmark exciting internships and fresher roles while browsing to review and apply
                when you are ready.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 shadow-sm transition-all"
            >
              <span>Explore Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Saved Jobs List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => {
              const job: JobData = item.job;
              return (
                <div
                  key={job._id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {job.companyLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-100"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                            <Building2 className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            {job.company}
                          </p>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(job._id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove from saved jobs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {job.workMode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {job.jobType}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                        {job.experienceLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-medium shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatRelativeTime(job.postedDate)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions: View Job, Apply, Remove */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
                    >
                      View Details
                    </Link>

                    <div className="flex items-center gap-2">
                      {job.hasApplied ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                          <Check className="w-3 h-3" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedJobForApply(job)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            fetchSavedJobs();
          }}
        />
      )}
    </DashboardLayout>
  );
}
