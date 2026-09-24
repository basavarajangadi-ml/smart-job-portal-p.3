import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';
import { calculateProfileCompletion } from '@/lib/validations';

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

    const [user, profile, resumes] = await Promise.all([
      dbService.findUserById(authUser.userId),
      dbService.getProfile(authUser.userId),
      dbService.getResumes(authUser.userId),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    const completion = calculateProfileCompletion({
      name: user.name,
      email: user.email,
      phone: profile?.phone,
      location: profile?.location,
      college: profile?.college,
      degree: profile?.degree,
      branch: profile?.branch,
      graduationYear: profile?.graduationYear,
      cgpa: profile?.cgpa,
      skills: profile?.skills || [],
      projects: profile?.projects || [],
      experience: profile?.experience || [],
      certifications: profile?.certifications || [],
      github: profile?.github,
      linkedin: profile?.linkedin,
      resumeUploaded: resumes.length > 0,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        profile,
        completion,
        hasResume: resumes.length > 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching profile.' },
      { status: 500 }
    );
  }
}

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
    const updatedProfile = await dbService.updateProfile(authUser.userId, body);
    const user = await dbService.findUserById(authUser.userId);
    const resumes = await dbService.getResumes(authUser.userId);

    const completion = calculateProfileCompletion({
      name: user?.name,
      email: user?.email,
      phone: updatedProfile?.phone,
      location: updatedProfile?.location,
      college: updatedProfile?.college,
      degree: updatedProfile?.degree,
      branch: updatedProfile?.branch,
      graduationYear: updatedProfile?.graduationYear,
      cgpa: updatedProfile?.cgpa,
      skills: updatedProfile?.skills || [],
      projects: updatedProfile?.projects || [],
      experience: updatedProfile?.experience || [],
      certifications: updatedProfile?.certifications || [],
      github: updatedProfile?.github,
      linkedin: updatedProfile?.linkedin,
      resumeUploaded: resumes.length > 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully.',
        user,
        profile: updatedProfile,
        completion,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating profile.' },
      { status: 500 }
    );
  }
}
