import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
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
        { success: false, message: 'Resume ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await dbService.deleteResume(id, authUser.userId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Resume not found or not authorized.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Resume deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete resume error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting resume.' },
      { status: 500 }
    );
  }
}
