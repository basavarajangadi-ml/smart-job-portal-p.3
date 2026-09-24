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

    const report = await dbService.getResumeStrengthAnalysis(authUser.userId);

    return NextResponse.json(
      {
        success: true,
        report,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resume Analysis API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error running resume analysis' },
      { status: 500 }
    );
  }
}
