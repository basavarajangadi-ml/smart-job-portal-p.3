import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { interviewPreparationRoles, hrPreparationResources } from '@/lib/interviewPrepData';

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
    const roleKey = searchParams.get('role') || 'frontend';

    const currentRolePrep =
      interviewPreparationRoles[roleKey] || interviewPreparationRoles['frontend'];

    return NextResponse.json(
      {
        success: true,
        availableRoles: Object.keys(interviewPreparationRoles).map((k) => ({
          key: k,
          role: interviewPreparationRoles[k].role,
          category: interviewPreparationRoles[k].category,
        })),
        roleData: currentRolePrep,
        hrResources: hrPreparationResources,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Interview Prep API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching interview prep' },
      { status: 500 }
    );
  }
}
