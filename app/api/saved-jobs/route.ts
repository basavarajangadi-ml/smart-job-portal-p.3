import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const [savedJobs, applications] = await Promise.all([
      dbService.getSavedJobs(authUser.userId),
      dbService.getApplications(authUser.userId),
    ]);

    const appliedJobIds = new Set(
      applications.map((a: any) => (a.jobId?._id || a.jobId).toString())
    );

    const validSavedJobs = savedJobs
      .filter((item: any) => (item.job || item.jobId) !== null)
      .map((item: any) => {
        const j = item.job || item.jobId;
        return {
          _id: item._id,
          savedAt: item.savedAt,
          job: {
            _id: j._id,
            title: j.title,
            company: j.company,
            companyLogo: j.companyLogo,
            location: j.location,
            workMode: j.workMode,
            jobType: j.jobType,
            experienceLevel: j.experienceLevel,
            salary: j.salary,
            postedDate: j.postedDate,
            skills: j.skills,
            hasApplied: appliedJobIds.has(j._id.toString()),
          },
        };
      });

    return NextResponse.json(
      {
        success: true,
        count: validSavedJobs.length,
        savedJobs: validSavedJobs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get saved jobs error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching saved jobs.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required.' },
        { status: 400 }
      );
    }

    const job = await dbService.getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found.' },
        { status: 404 }
      );
    }

    const savedJob = await dbService.saveJob(authUser.userId, jobId);

    return NextResponse.json(
      {
        success: true,
        message: 'Job saved successfully.',
        savedJob,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Save job error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error saving job.' },
      { status: 500 }
    );
  }
}
