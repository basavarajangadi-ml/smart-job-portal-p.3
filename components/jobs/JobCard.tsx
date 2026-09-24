'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Check,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { JobData } from '@/types';

interface JobCardProps {
  job: JobData;
  onSaveToggle?: (jobId: string, isSaved: boolean) => void;
}

export default function JobCard({ job, onSaveToggle }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaving(true);
    const nextSavedState = !isSaved;

    // Optimistic UI update
    setIsSaved(nextSavedState);

    try {
      if (nextSavedState) {
        const res = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job._id }),
        });
        if (!res.ok) {
          setIsSaved(!nextSavedState);
        } else {
          onSaveToggle?.(job._id, true);
        }
      } else {
        const res = await fetch(`/api/saved-jobs/${job._id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          setIsSaved(!nextSavedState);
        } else {
          onSaveToggle?.(job._id, false);
        }
      }
    } catch {
      setIsSaved(!nextSavedState);
    } finally {
      setIsSaving(false);
    }
  };

  const getWorkModeBadge = (mode: string) => {
    switch (mode) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hybrid':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200 flex flex-col justify-between">
      {/* Top Header: Logo, Company & Save */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-xs">
                <Building2 className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                {job.company}
              </p>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-brand-50 text-brand-600 border-brand-200'
                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-50'
            }`}
            aria-label={isSaved ? 'Remove saved job' : 'Save job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-600' : ''}`} />
          </button>
        </div>

        {/* Tags & Meta Details */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium">
          <span className={`px-2.5 py-1 rounded-lg border ${getWorkModeBadge(job.workMode)}`}>
            {job.workMode}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            {job.jobType}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            {job.experienceLevel}
          </span>
          {job.hasApplied && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <Check className="w-3 h-3" />
              Applied
            </span>
          )}
        </div>

        {/* Location & Salary */}
        <div className="grid grid-cols-2 gap-2 mt-4 py-3 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 justify-end truncate">
            <Briefcase className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.skills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 4 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Posted time & CTA */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(job.postedDate)}</span>
        </div>

        <Link
          href={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100/80 transition-colors"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
