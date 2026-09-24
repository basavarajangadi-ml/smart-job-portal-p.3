import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Footer from '@/components/footer/Footer';
import {
  ArrowRight,
  UserCheck,
  FileText,
  Search,
  SlidersHorizontal,
  Send,
  LineChart,
  CheckCircle2,
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: UserCheck,
      title: 'Professional Profile',
      description: 'Create and manage your verified student profile with education, skills, and projects.',
      color: 'from-blue-500 to-brand-600',
    },
    {
      icon: FileText,
      title: 'Resume Management',
      description: 'Upload and manage your latest resume safely in the cloud, ready for 1-click applications.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Briefcase,
      title: 'Find Opportunities',
      description: 'Discover curated full-time roles and high-stipend internships specifically tailored for freshers.',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: SlidersHorizontal,
      title: 'Smart Search',
      description: 'Filter by job type, remote/hybrid work mode, required skills, and experience with zero fluff.',
      color: 'from-brand-600 to-indigo-600',
    },
    {
      icon: Send,
      title: 'Easy Applications',
      description: 'Apply directly to verified companies using your digital profile and cloud resume in seconds.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: LineChart,
      title: 'Application Tracking',
      description: 'Track all your active job applications in a transparent, real-time stage-by-stage pipeline.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Register with your college details, degree, branch, and showcase your core tech skills.',
    },
    {
      step: '02',
      title: 'Upload Your Resume',
      description: 'Attach your modern PDF resume to your profile for automatic employer submission.',
    },
    {
      step: '03',
      title: 'Find & Apply',
      description: 'Explore verified student opportunities and submit applications with optional cover letters.',
    },
    {
      step: '04',
      title: 'Track Applications',
      description: 'Monitor application reviews, shortlists, and interviews right from your central dashboard.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-400/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Hero Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>The #1 CareerTech Platform for Students & Freshers</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Find Your First Opportunity.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">
                    Build Your Career.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Discover jobs and internships designed for students and freshers. Create your
                  professional profile, upload your resume, apply for opportunities, and track
                  your applications in one place.
                </p>

                {/* Hero CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <Link
                    href="/jobs"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02]"
                  >
                    <span>Explore Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-xs transition-colors"
                  >
                    <span>Create Free Profile</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% Verified Freshers Roles</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span>Free for College Students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct Employer Pipeline</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Modern Dashboard Preview Illustration */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-3xl bg-white border border-slate-200/80 shadow-2xl p-6 space-y-4">
                  {/* Mock Window Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Student Dashboard
                    </span>
                    <div className="w-4" />
                  </div>

                  {/* Mock Stat preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-brand-50/70 border border-brand-100">
                      <p className="text-[10px] uppercase font-bold text-brand-600">Applications</p>
                      <p className="text-xl font-extrabold text-slate-900 mt-0.5">8 Active</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                      <p className="text-[10px] uppercase font-bold text-indigo-600">Profile</p>
                      <p className="text-xl font-extrabold text-slate-900 mt-0.5">90% Done</p>
                    </div>
                  </div>

                  {/* Mock Job Card in Preview */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                          TC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Frontend Developer Intern</p>
                          <p className="text-[10px] text-slate-500 font-medium">TechCorp Solutions</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                        Remote
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> Remote
                      </span>
                      <span className="font-bold text-slate-900">₹25,000 / mo</span>
                    </div>

                    <div className="flex gap-1 pt-1">
                      <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-600">
                        React
                      </span>
                      <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-600">
                        Tailwind
                      </span>
                      <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-600">
                        TypeScript
                      </span>
                    </div>
                  </div>

                  {/* Pipeline Preview */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-700 mb-2">
                      Live Application Tracking
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                      <span className="text-brand-600 font-bold">1. Applied</span>
                      <span>→</span>
                      <span className="text-brand-600 font-bold">2. Under Review</span>
                      <span>→</span>
                      <span className="text-emerald-600 font-bold">3. Interview</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Comprehensive Toolkit
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything You Need to Start Your Career
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Tailor-made for college students and fresh graduates. Simplify your job search from
                profile building all the way to accepting your first offer letter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-14">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={index}
                    className="p-6 sm:p-7 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-300 hover:bg-white hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-200 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-5 group-hover:text-brand-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Simple 4-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                How SmartHire Works
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                A straightforward path designed to help you land your dream tech role without the
                usual confusion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-14">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all"
                >
                  <span className="text-3xl font-black text-brand-600/30 block mb-3 font-mono">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-tr from-brand-900 via-brand-800 to-indigo-950 rounded-3xl sm:rounded-4xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
                  Begin Your Journey
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Ready to Start Your Career Journey?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Join thousands of students and freshers who discover internships and entry-level
                  jobs at premier technology startups.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-brand-900 font-bold text-sm hover:bg-brand-50 shadow-lg transition-all hover:scale-105"
                  >
                    Create Your Profile
                  </Link>
                  <Link
                    href="/jobs"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                  >
                    Browse Openings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
