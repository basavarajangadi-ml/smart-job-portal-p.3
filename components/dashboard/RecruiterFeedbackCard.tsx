'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Building2, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { getStatusBadgeClass, formatDate } from '@/lib/utils';
import { RecruiterFeedbackItem } from '@/types';

interface RecruiterFeedbackCardProps {
  feedbacks: RecruiterFeedbackItem[];
}

export default function RecruiterFeedbackCard({ feedbacks = [] }: RecruiterFeedbackCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Recruiter Feedback</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct observations and next-step recommendations from hiring partners
          </p>
        </div>
        <Link
          href="/applications"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
        >
          <span>View All Feedback</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {feedbacks.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No recruiter feedback posted yet. Apply to roles to receive candidate assessments.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.companyLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.companyLogo}
                        alt={item.company}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {item.company}
                      </p>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.jobTitle}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-100 shadow-2xs">
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{item.feedback}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100/80">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.recruiterName}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{formatDate(item.date)}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
