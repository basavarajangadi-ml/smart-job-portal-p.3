'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Briefcase,
  MapPin,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { formatDate, formatRelativeTime, getStatusBadgeClass } from '@/lib/utils';
import { ApplicationStatus } from '@/types';

export default function ApplicationDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicationDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data?.success) {
        setApplication(data.application);
      }
    } catch (err) {
      console.error('Error fetching application details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  // Stage Timeline definitions
  const timelineStages: ApplicationStatus[] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview',
    'Selected',
  ];

  const getStageIndex = (status: string) => {
    return timelineStages.indexOf(status as ApplicationStatus);
  };

  const currentStageIndex = application ? getStageIndex(application.status) : 0;
  const isRejected = application?.status === 'Rejected';

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Applications</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Loading application status...</p>
          </div>
        ) : !application ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Application Not Found</h3>
            <p className="text-xs text-slate-500">
              The application does not exist or you do not have permission to view it.
            </p>
            <Link
              href="/applications"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Return to Applications
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Card: Job Info & Current Status */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  {application.jobId?.companyLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={application.jobId.companyLogo}
                      alt={application.jobId.company}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                      <Building2 className="w-7 h-7 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {application.jobId?.company || 'Company'}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      {application.jobId?.title || 'Position'}
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{application.jobId?.location || 'Remote'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{application.jobId?.jobType || 'Internship'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 self-start sm:self-auto">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(
                      application.status
                    )}`}
                  >
                    Current Status: {application.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Applied on {formatDate(application.appliedAt)}
                  </span>
                </div>
              </div>

              {/* Visual Application Timeline */}
              <div className="pt-6">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-6">
                  Application Progress Timeline
                </h3>

                {isRejected ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold">Application Status: Rejected</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">
                        Thank you for your interest. Although you were not selected for this role, we encourage you to apply for other opportunities on SmartHire.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Connecting Bar */}
                    <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0">
                      <div
                        className="h-full bg-brand-600 transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, currentStageIndex) / (timelineStages.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Timeline Stages */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                      {timelineStages.map((stage, idx) => {
                        const isPast = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isFuture = idx > currentStageIndex;

                        return (
                          <div
                            key={stage}
                            className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 p-3 sm:p-0 rounded-xl transition-all ${
                              isCurrent
                                ? 'bg-brand-50/70 sm:bg-transparent'
                                : 'bg-transparent'
                            }`}
                          >
                            {/* Circle Node */}
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                                isCurrent
                                  ? 'bg-brand-600 text-white ring-4 ring-brand-100 scale-110'
                                  : isPast
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                            </div>

                            {/* Label */}
                            <div>
                              <p
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-brand-700 font-extrabold'
                                    : isPast
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {stage}
                              </p>
                              {isCurrent && (
                                <span className="inline-block sm:hidden text-[10px] text-brand-600 font-medium">
                                  Current Active Stage
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recruiter Feedback & Interview Details (Phase 2) */}
            {(application.recruiterFeedback?.text || application.interviewDate || application.recruiterInfo?.name || application.notes) && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Recruiter Updates & Interview Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recruiter Feedback */}
                  {application.recruiterFeedback?.text && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                      <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                        Official Recruiter Feedback
                      </span>
                      <p className="text-xs text-indigo-950 italic leading-relaxed">
                        &ldquo;{application.recruiterFeedback.text}&rdquo;
                      </p>
                      <span className="text-[10px] text-indigo-700 block">
                        Updated {formatDate(application.recruiterFeedback.date || application.updatedAt)}
                      </span>
                    </div>
                  )}

                  {/* Interview Date & Schedule */}
                  {application.interviewDate && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Interview Scheduled</span>
                      </span>
                      <p className="text-sm font-extrabold text-emerald-950">
                        {formatDate(application.interviewDate)}
                      </p>
                      <p className="text-[11px] text-emerald-800">
                        Please check your email for video conference invitation link.
                      </p>
                    </div>
                  )}

                  {/* Recruiter Information */}
                  {application.recruiterInfo?.name && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Hiring Representative
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {application.recruiterInfo.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {application.recruiterInfo.title || 'Talent Acquisition'} • {application.recruiterInfo.company || application.jobId?.company}
                      </p>
                    </div>
                  )}

                  {/* Internal Application Notes */}
                  {application.notes && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Application Notes
                      </span>
                      <p className="text-xs text-slate-700">
                        {application.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Artifacts Card: Resume & Cover Letter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Attached Resume */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Resume Submitted
                  </h3>
                </div>

                {application.resumeId ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {application.resumeId.fileName || 'Candidate_Resume.pdf'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Uploaded on {formatDate(application.resumeId.uploadedAt)}
                    </p>

                    <div className="pt-2">
                      <a
                        href={application.resumeId.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold hover:bg-brand-100/80 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Attached Resume</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Standard profile resume attached.</p>
                )}
              </div>

              {/* Cover Letter */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Cover Letter
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[110px]">
                  {application.coverLetter ? (
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {application.coverLetter}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No cover letter was submitted for this application.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Original Job Link */}
            {application.jobId?._id && (
              <div className="pt-2 text-right">
                <Link
                  href={`/jobs/${application.jobId._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <span>View Original Job Posting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
