'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Upload,
  User,
  GraduationCap,
  Sparkles,
  Send,
  Loader2,
} from 'lucide-react';
import { JobData, ResumeData, StudentProfileData } from '@/types';
import { formatDate } from '@/lib/utils';

interface ApplyModalProps {
  job: JobData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ApplyModal({
  job,
  isOpen,
  onClose,
  onSuccess,
}: ApplyModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentInfo, setStudentInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setErrorMessage('');
    setIsSuccess(false);

    // Fetch profile and resumes concurrently
    Promise.all([
      fetch('/api/profile').then((res) => (res.ok ? res.json() : null)),
      fetch('/api/resume').then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([profileRes, resumeRes]) => {
        if (profileRes?.success) {
          setStudentInfo(profileRes.user);
          setProfile(profileRes.profile);
        }
        if (resumeRes?.success && resumeRes.resumes?.length > 0) {
          setResumes(resumeRes.resumes);
          setSelectedResumeId(resumeRes.resumes[0]._id);
        }
      })
      .catch((err) => {
        console.error('Error fetching application requirements:', err);
        setErrorMessage('Failed to load your profile information. Please log in.');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (resumes.length === 0) {
      setErrorMessage('Please upload your resume before applying.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job._id,
          resumeId: selectedResumeId,
          coverLetter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'Error submitting application.');
      } else {
        setIsSuccess(true);
        setSubmittedApp(data.application);
        onSuccess?.();
      }
    } catch {
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              Apply for position
            </span>
            <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h2>
            <p className="text-xs text-slate-500 font-medium">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <p className="text-sm font-medium text-slate-500">Preparing application data...</p>
            </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Application Submitted Successfully!
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Your application for <span className="font-semibold text-slate-700">{job.title}</span> at{' '}
                  <span className="font-semibold text-slate-700">{job.company}</span> has been received.
                </p>
              </div>

              {/* Submitted Details Box */}
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Job:</span>
                  <span className="font-semibold text-slate-800">{job.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Company:</span>
                  <span className="font-semibold text-slate-800">{job.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applied Date:</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(submittedApp?.appliedAt || new Date())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Initial Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Applied
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/applications"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-sm transition-all"
                >
                  Track Applications
                </Link>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{errorMessage}</p>
                    {errorMessage.includes('upload your resume') && (
                      <Link
                        href="/resume"
                        className="underline font-semibold mt-1 inline-block hover:text-rose-900"
                      >
                        Click here to go to Resume Management →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Student Information Preview */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>Candidate Information</span>
                  </div>
                  <Link
                    href="/profile"
                    className="text-brand-600 hover:text-brand-700 text-[11px] font-semibold"
                  >
                    Edit Profile
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Full Name</span>
                    <span className="font-semibold text-slate-800">{studentInfo?.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {studentInfo?.email || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone</span>
                    <span className="font-semibold text-slate-800">{profile?.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location</span>
                    <span className="font-semibold text-slate-800">
                      {profile?.location || 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Education */}
                {(profile?.college || profile?.degree) && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {profile.degree} {profile.branch ? `in ${profile.branch}` : ''}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        {profile.college}{' '}
                        {profile.graduationYear ? `(Class of ${profile.graduationYear})` : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Skills */}
                {profile?.skills && profile.skills.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <div className="flex items-center gap-1 text-slate-500 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                      <span className="font-semibold text-[11px]">Skills from Profile:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resume Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Resume to Attach
                </label>
                {resumes.length === 0 ? (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 text-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                    <p className="text-xs font-semibold text-amber-900">
                      Please upload your resume before applying.
                    </p>
                    <Link
                      href="/resume"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Resume Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumes.map((r) => (
                      <label
                        key={r._id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedResumeId === r._id
                            ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="radio"
                            name="selectedResume"
                            value={r._id}
                            checked={selectedResumeId === r._id}
                            onChange={() => setSelectedResumeId(r._id)}
                            className="text-brand-600 focus:ring-brand-500"
                          />
                          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {r.fileName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                          {formatDate(r.uploadedAt)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Cover Letter */}
              <div>
                <label
                  htmlFor="coverLetter"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Cover Letter <span className="text-slate-400 font-normal normal-case">(Optional)</span>
                </label>
                <textarea
                  id="coverLetter"
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, your key projects, and why you are excited about this opportunity..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || resumes.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
