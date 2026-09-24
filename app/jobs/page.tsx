'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PublicNavbar from '@/components/navbar/PublicNavbar';
import Footer from '@/components/footer/Footer';
import JobCard from '@/components/jobs/JobCard';
import { JobData } from '@/types';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Briefcase,
  Loader2,
  Building,
} from 'lucide-react';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(
    searchParams.get('experienceLevel') || 'All'
  );
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [skill, setSkill] = useState(searchParams.get('skill') || 'All');
  const [postedWithin, setPostedWithin] = useState(searchParams.get('postedWithin') || 'All');

  // Fetch jobs based on current filters
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (jobType !== 'All') params.set('jobType', jobType);
      if (workMode !== 'All') params.set('workMode', workMode);
      if (experienceLevel !== 'All') params.set('experienceLevel', experienceLevel);
      if (location !== 'All') params.set('location', location);
      if (skill !== 'All') params.set('skill', skill);
      if (postedWithin !== 'All') params.set('postedWithin', postedWithin);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data?.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [search, jobType, workMode, experienceLevel, location, skill, postedWithin]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleResetFilters = () => {
    setSearch('');
    setJobType('All');
    setWorkMode('All');
    setExperienceLevel('All');
    setLocation('All');
    setSkill('All');
    setPostedWithin('All');
    router.push('/jobs');
  };

  const activeFiltersCount = [
    jobType !== 'All',
    workMode !== 'All',
    experienceLevel !== 'All',
    location !== 'All',
    skill !== 'All',
    postedWithin !== 'All',
  ].filter(Boolean).length;

  const filterSidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-sm text-slate-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {(activeFiltersCount > 0 || search) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Job Type
        </label>
        <div className="space-y-1.5">
          {['All', 'Full Time', 'Internship', 'Part Time'].map((type) => (
            <label
              key={type}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                jobType === type
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <span>{type === 'All' ? 'All Job Types' : type}</span>
              <input
                type="radio"
                name="jobType"
                checked={jobType === type}
                onChange={() => setJobType(type)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Work Mode
        </label>
        <div className="space-y-1.5">
          {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
            <label
              key={mode}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                workMode === mode
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <span>{mode === 'All' ? 'All Work Modes' : mode}</span>
              <input
                type="radio"
                name="workMode"
                checked={workMode === mode}
                onChange={() => setWorkMode(mode)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {['All', 'Fresher', 'Entry Level'].map((exp) => (
            <label
              key={exp}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                experienceLevel === exp
                  ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-100/70 border border-transparent'
              }`}
            >
              <span>{exp === 'All' ? 'All Experience Levels' : exp}</span>
              <input
                type="radio"
                name="experienceLevel"
                checked={experienceLevel === exp}
                onChange={() => setExperienceLevel(exp)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Skills filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Key Skill
        </label>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700 font-medium"
        >
          <option value="All">All Tech Stacks</option>
          <option value="React">React</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Python">Python</option>
          <option value="Node.js">Node.js</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="SQL">SQL</option>
          <option value="Flutter">Flutter</option>
          <option value="Figma">Figma</option>
        </select>
      </div>

      {/* Posted Date Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Date Posted
        </label>
        <select
          value={postedWithin}
          onChange={(e) => setPostedWithin(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-700 font-medium"
        >
          <option value="All">Any Time</option>
          <option value="24h">Past 24 Hours</option>
          <option value="7d">Past Week</option>
          <option value="30d">Past Month</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Search Bar & Mobile Filter Trigger */}
      <div className="col-span-full flex flex-col sm:flex-row gap-3 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-xs transition-all placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        {filterSidebarContent}
      </aside>

      {/* Job List Area */}
      <section className="lg:col-span-9 space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {jobs.length} {jobs.length === 1 ? 'Opportunity' : 'Opportunities'}
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-sm font-medium text-slate-500">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">No opportunities found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No openings match your current search or filters. Try clearing your filters or
                searching for broader keywords like &quot;React&quot;, &quot;Internship&quot;, or &quot;Remote&quot;.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Mobile Filter Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto max-w-xs w-full bg-white z-10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <h3 className="font-bold text-base text-slate-900">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebarContent}
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-sm"
              >
                Apply Filters ({jobs.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Header */}
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Opportunities Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Jobs & Internships
          </h1>
          <p className="text-sm text-slate-500">
            Handpicked career opportunities designed specifically for students, fresh graduates, and entry-level talent.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <p className="text-sm font-medium text-slate-500">Loading opportunities hub...</p>
            </div>
          }
        >
          <JobsContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
