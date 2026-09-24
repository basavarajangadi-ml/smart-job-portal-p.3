import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: 'Logged out successfully.',
    },
    { status: 200 }
  );

  removeAuthCookie(response);
  return response;
}
