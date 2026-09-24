'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Send,
  Building,
  Calendar,
  ArrowRight,
  Loader2,
  Clock,
  Briefcase,
} from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';
import { ApplicationStatus } from '@/types';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filterTabs = [
    'All',
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
    'Rejected',
  ];

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === 'All'
          ? '/api/applications'
          : `/api/applications?status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track and monitor the status of every role you have applied to.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all self-start sm:self-auto"
          >
            <Briefcase className="w-4 h-4" />
            <span>Apply to New Roles</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Send className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                No applications found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {statusFilter === 'All'
                  ? 'You haven&apos;t applied to any jobs yet. Start exploring opportunities tailored for students!'
                  : `No applications currently have the status "${statusFilter}".`}
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 shadow-sm transition-all"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-6">Opportunity</th>
                      <th className="py-3.5 px-6">Company</th>
                      <th className="py-3.5 px-6">Applied Date</th>
                      <th className="py-3.5 px-6">Pipeline Status</th>
                      <th className="py-3.5 px-6">Interview / Recruiter</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <Link
                            href={`/applications/${app._id}`}
                            className="hover:text-brand-600 transition-colors"
                          >
                            {app.jobId?.title || 'Role'}
                          </Link>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-600">
                          {app.jobId?.company || 'Company'}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {formatDate(app.appliedAt)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {app.interviewDate ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{formatDate(app.interviewDate)}</span>
                            </span>
                          ) : app.recruiterFeedback?.text ? (
                            <span className="text-[11px] text-indigo-700 italic max-w-xs truncate block">
                              Feedback: &ldquo;{app.recruiterFeedback.text.slice(0, 45)}...&rdquo;
                            </span>
                          ) : app.recruiterInfo?.name ? (
                            <span className="text-xs text-slate-600">
                              {app.recruiterInfo.name} ({app.recruiterInfo.company || 'HR'})
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">In Pipeline</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/applications/${app._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 font-semibold text-xs transition-colors"
                          >
                            <span>Timeline & Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="md:hidden space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {app.jobId?.company || 'Company'}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {app.jobId?.title || 'Position'}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {app.interviewDate && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Interview scheduled: {formatDate(app.interviewDate)}</span>
                    </div>
                  )}

                  {app.recruiterFeedback?.text && (
                    <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 italic">
                      &ldquo;{app.recruiterFeedback.text}&rdquo;
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(app.appliedAt)}</span>
                    </span>

                    <Link
                      href={`/applications/${app._id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <span>Timeline & Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
