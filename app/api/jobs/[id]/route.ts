import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Invalid job ID format.' },
        { status: 400 }
      );
    }

    const job = await dbService.getJobById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found.' },
        { status: 404 }
      );
    }

    let isSaved = false;
    let hasApplied = false;

    const authUser = getAuthUserFromRequest(request);
    if (authUser) {
      const [saved, applied] = await Promise.all([
        dbService.isJobSaved(authUser.userId, id),
        dbService.hasApplied(authUser.userId, id),
      ]);
      isSaved = saved;
      hasApplied = applied;
    }

    return NextResponse.json(
      {
        success: true,
        job: {
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
          isSaved,
          hasApplied,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Job details fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching job details.' },
      { status: 500 }
    );
  }
}
