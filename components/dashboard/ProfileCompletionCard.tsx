import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileCompletionCardProps {
  percentage: number;
  missingSections?: string[];
}

export default function ProfileCompletionCard({
  percentage,
  missingSections = [],
}: ProfileCompletionCardProps) {
  const isComplete = percentage >= 100;

  return (
    <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-200">
              Profile Strength
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
              {percentage}%
            </span>
          </div>

          <h3 className="text-xl font-bold mt-2 text-white">Profile Completion</h3>
          <p className="text-xs text-brand-100/80 mt-1 leading-relaxed">
            {isComplete
              ? 'Your profile is 100% complete and ready for employers!'
              : 'Complete your profile to increase visibility and apply to top opportunities faster.'}
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-accent-300 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {missingSections.length > 0 && !isComplete && (
            <div className="mt-3 flex items-start gap-1.5 text-[11px] text-brand-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Next up: {missingSections.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>

        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-brand-900 hover:bg-brand-50 shadow-sm transition-all"
          >
            {isComplete ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>View Profile</span>
              </>
            ) : (
              <>
                <span>Complete Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
