import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';
import { enrichJobsWithRecommendations } from '@/lib/recommendations';

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

    const [profile, allJobs, savedJobs, applications] = await Promise.all([
      dbService.getProfile(authUser.userId),
      dbService.getJobs({}),
      dbService.getSavedJobs(authUser.userId),
      dbService.getApplications(authUser.userId),
    ]);

    const savedJobIds = new Set(
      savedJobs.map((s: any) => (s.job?._id || s.jobId?._id || s.jobId).toString())
    );
    const appliedJobIds = new Set(
      applications.map((a: any) => (a.jobId?._id || a.jobId).toString())
    );

    const recommendedJobs = enrichJobsWithRecommendations(
      allJobs,
      profile,
      savedJobIds,
      appliedJobIds
    );

    return NextResponse.json(
      {
        success: true,
        recommendedJobs,
        totalRecommendations: recommendedJobs.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching recommendations' },
      { status: 500 }
    );
  }
}
