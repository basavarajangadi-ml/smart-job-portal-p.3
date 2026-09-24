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

    const dashboardData = await dbService.getDashboardData(authUser.userId);

    return NextResponse.json(
      {
        success: true,
        ...dashboardData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching dashboard data.' },
      { status: 500 }
    );
  }
}
