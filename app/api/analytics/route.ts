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

    const analyticsData = await dbService.getAnalyticsData(authUser.userId);

    return NextResponse.json(
      {
        success: true,
        analytics: analyticsData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching analytics' },
      { status: 500 }
    );
  }
}
