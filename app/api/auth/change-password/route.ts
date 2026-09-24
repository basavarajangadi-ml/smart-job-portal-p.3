import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest, comparePassword, hashPassword } from '@/lib/auth';
import { validatePassword } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide all password fields.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New passwords do not match.' },
        { status: 400 }
      );
    }

    const pwdCheck = validatePassword(newPassword);
    if (!pwdCheck.valid) {
      return NextResponse.json(
        { success: false, message: pwdCheck.message },
        { status: 400 }
      );
    }

    const user = await dbService.findUserByEmail(authUser.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect current password.' },
        { status: 400 }
      );
    }

    const newHashed = await hashPassword(newPassword);
    await dbService.updateUserPassword(authUser.userId, newHashed);

    return NextResponse.json(
      { success: true, message: 'Password changed successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating password.' },
      { status: 500 }
    );
  }
}
