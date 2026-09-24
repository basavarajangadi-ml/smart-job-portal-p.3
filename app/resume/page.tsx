'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';
import { ResumeData } from '@/types';

export default function ResumePage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      if (data?.success) {
        setResumes(data.resumes || []);
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (file: File) => {
    setMessage(null);

    // Validate type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage({ type: 'error', text: 'Only PDF format is supported. Please upload a .pdf file.' });
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size exceeds 5MB limit. Please upload a smaller file.' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to upload resume.' });
      } else {
        setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        fetchResumes();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error uploading resume.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const res = await fetch(`/api/resume/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data?.success) {
        setMessage({ type: 'success', text: 'Resume deleted successfully.' });
        fetchResumes();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete resume.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error deleting resume.' });
    }
  };

  const currentResume = resumes.length > 0 ? resumes[0] : null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload and manage your industry-ready resume for 1-click job and internship applications.
          </p>
        </div>

        {/* Notifications */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Loading your resume...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Resume Card */}
            {currentResume && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-sm">
                        {currentResume.fileName}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span>{formatFileSize(currentResume.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(currentResume.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ready Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Your resume is ready to use for applications.</span>
                  </div>
                </div>

                {/* Actions: View, Download, Replace, Delete */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href={currentResume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100/80 text-brand-700 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Resume</span>
                  </a>

                  <a
                    href={currentResume.fileUrl}
                    download={currentResume.fileName}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
                    <span>Replace Resume</span>
                  </button>

                  <button
                    onClick={() => handleDelete(currentResume._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
                dragActive
                  ? 'border-brand-500 bg-brand-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="max-w-sm mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-xs">
                  {uploading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {uploading
                      ? 'Uploading and processing resume...'
                      : currentResume
                      ? 'Upload a new version to replace'
                      : 'Upload your resume'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag and drop your file here, or click to browse.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span>Supported format: PDF</span>
                  <span>•</span>
                  <span>Maximum size: 5MB</span>
                </div>
              </div>
            </div>

            {/* Resume Tips Box */}
            <div className="bg-slate-100/70 rounded-3xl p-6 border border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Tips for Students & Freshers:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 pl-1">
                <li>Keep your resume concise (1 page is recommended for freshers).</li>
                <li>Highlight tech stack, academic projects, and relevant coursework clearly.</li>
                <li>Ensure contact details (phone, email, GitHub/LinkedIn links) are functional.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
