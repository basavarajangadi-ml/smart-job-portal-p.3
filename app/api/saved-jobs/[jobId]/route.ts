import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { jobId } = params;
    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required.' },
        { status: 400 }
      );
    }

    const removed = await dbService.removeSavedJob(authUser.userId, jobId);
    if (!removed) {
      return NextResponse.json(
        { success: false, message: 'Saved job not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Job removed from saved list.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete saved job error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error removing saved job.' },
      { status: 500 }
    );
  }
}
