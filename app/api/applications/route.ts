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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    const applications = await dbService.getApplications(authUser.userId, status);

    return NextResponse.json(
      {
        success: true,
        count: applications.length,
        applications,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching applications.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in to apply.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId, coverLetter, resumeId: requestedResumeId } = body;

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required.' },
        { status: 400 }
      );
    }

    // 1. Verify Job exists
    const job = await dbService.getJobById(jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found.' },
        { status: 404 }
      );
    }

    // 2. Check if already applied
    const alreadyApplied = await dbService.hasApplied(authUser.userId, jobId);
    if (alreadyApplied) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already applied for this position.',
          alreadyApplied: true,
        },
        { status: 409 }
      );
    }

    // 3. Check resume exists
    let resumeId = requestedResumeId;
    if (!resumeId) {
      const resumes = await dbService.getResumes(authUser.userId);
      if (resumes.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Please upload your resume before applying.',
            resumeMissing: true,
          },
          { status: 400 }
        );
      }
      resumeId = resumes[0]._id.toString();
    }

    // Create Application
    const application = await dbService.createApplication({
      userId: authUser.userId,
      jobId,
      resumeId,
      coverLetter: coverLetter ? coverLetter.trim() : '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application Submitted Successfully!',
        application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Apply job error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error submitting application.' },
      { status: 500 }
    );
  }
}
