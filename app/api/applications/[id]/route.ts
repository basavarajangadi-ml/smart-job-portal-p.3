import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Invalid application ID.' },
        { status: 400 }
      );
    }

    const application = await dbService.getApplicationById(id, authUser.userId);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found or unauthorized.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Application details fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching application details.' },
      { status: 500 }
    );
  }
}
