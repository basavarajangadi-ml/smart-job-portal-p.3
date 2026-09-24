import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const [user, profile] = await Promise.all([
      dbService.findUserById(authUser.userId),
      dbService.getProfile(authUser.userId),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          degree: profile?.degree || 'B.Tech',
          branch: profile?.branch || 'Computer Science & Engineering',
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error.' },
      { status: 500 }
    );
  }
}
