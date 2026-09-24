import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const jobType = searchParams.get('jobType') || 'All';
    const workMode = searchParams.get('workMode') || 'All';
    const experienceLevel = searchParams.get('experienceLevel') || 'All';
    const location = searchParams.get('location') || 'All';
    const skill = searchParams.get('skill') || 'All';
    const postedWithin = searchParams.get('postedWithin') || 'All';

    const jobs = await dbService.getJobs({
      search,
      jobType,
      workMode,
      experienceLevel,
      location,
      skill,
      postedWithin,
    });

    const authUser = getAuthUserFromRequest(request);
    let savedJobIds = new Set<string>();
    let appliedJobIds = new Set<string>();

    if (authUser) {
      const [savedList, appliedList] = await Promise.all([
        dbService.getSavedJobs(authUser.userId),
        dbService.getApplications(authUser.userId),
      ]);

      savedList.forEach((s: any) => savedJobIds.add((s.job?._id || s.jobId?._id || s.jobId).toString()));
      appliedList.forEach((a: any) => appliedJobIds.add((a.jobId?._id || a.jobId).toString()));
    }

    const formattedJobs = jobs.map((job: any) => ({
      _id: job._id.toString(),
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      qualifications: job.qualifications,
      skills: job.skills,
      location: job.location,
      workMode: job.workMode,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      salary: job.salary,
      benefits: job.benefits,
      postedDate: job.postedDate,
      deadline: job.deadline,
      isSaved: savedJobIds.has(job._id.toString()),
      hasApplied: appliedJobIds.has(job._id.toString()),
    }));

    return NextResponse.json(
      {
        success: true,
        count: formattedJobs.length,
        jobs: formattedJobs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching jobs.' },
      { status: 500 }
    );
  }
}
