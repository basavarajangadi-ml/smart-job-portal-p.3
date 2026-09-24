import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest, comparePassword, removeAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const user = await dbService.findUserByEmail(authUser.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    if (password) {
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Incorrect password. Cannot delete account.' },
          { status: 400 }
        );
      }
    }

    await dbService.deleteUserAccount(authUser.userId);

    const response = NextResponse.json(
      { success: true, message: 'Account deleted successfully.' },
      { status: 200 }
    );

    removeAuthCookie(response);
    return response;
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting account.' },
      { status: 500 }
    );
  }
}
