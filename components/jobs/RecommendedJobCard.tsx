'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { RecommendedJobData } from '@/types';

interface RecommendedJobCardProps {
  job: RecommendedJobData;
}

export default function RecommendedJobCard({ job }: RecommendedJobCardProps) {
  const [saved, setSaved] = useState(job.isSaved || false);
  const [applied, setApplied] = useState(job.hasApplied || false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      if (saved) {
        await fetch(`/api/saved-jobs?jobId=${job._id}`, { method: 'DELETE' });
        setSaved(false);
      } else {
        await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: job._id }),
        });
        setSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save job:', err);
    } finally {
      setSaving(false);
    }
  };

  const badgeStyles = {
    'High Match': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Good Match': 'bg-blue-50 text-brand-700 border-blue-200',
    'Medium Match': 'bg-amber-50 text-amber-700 border-amber-200',
  }[job.matchLevel] || 'bg-slate-100 text-slate-700 border-slate-200';

  const scoreColor =
    job.matchPercentage >= 80
      ? 'text-emerald-600 border-emerald-500'
      : job.matchPercentage >= 65
      ? 'text-brand-600 border-brand-500'
      : 'text-amber-600 border-amber-500';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
      {/* Top Banner: Match Score and Badges */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {job.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-2xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {job.company}
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mt-0.5 line-clamp-1">
                <Link href={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
            </div>
          </div>

          {/* Circular/Badge Match Score Indicator */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full border-2 ${scoreColor} flex items-center justify-center font-extrabold text-xs bg-white shadow-2xs`}
              >
                {job.matchPercentage}%
              </div>
            </div>
            <span
              className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyles}`}
            >
              {job.matchLevel}
            </span>
          </div>
        </div>

        {/* Explainability Reason Badge */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span className="leading-tight">{job.reason}</span>
        </div>

        {/* Meta details */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mt-3.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location} ({job.workMode})</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <span>{job.salary}</span>
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.jobType}</span>
          </span>
        </div>

        {/* Skills Pills with match indicators */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.skills?.slice(0, 5).map((skill) => {
            const isMatched = (job.matchingSkills || []).some(
              (ms) => ms.toLowerCase() === skill.toLowerCase()
            );
            return (
              <span
                key={skill}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isMatched
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {skill} {isMatched && '✓'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-100">
        <button
          onClick={handleToggleSave}
          disabled={saving}
          className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
            saved
              ? 'bg-amber-50 border-amber-200 text-amber-600'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title={saved ? 'Remove from saved' : 'Save job'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-600' : ''}`} />
          <span className="hidden sm:inline">{saved ? 'Saved' : 'Save Job'}</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job._id}`}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Details
          </Link>
          <Link
            href={`/jobs/${job._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 transition-all"
          >
            <span>{applied ? 'Applied' : 'Apply Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
