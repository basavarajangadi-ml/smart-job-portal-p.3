import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';
import { uploadPdfToCloudinary } from '@/lib/cloudinary';

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

    const resumes = await dbService.getResumes(authUser.userId);

    return NextResponse.json(
      {
        success: true,
        resumes,
        currentResume: resumes.length > 0 ? resumes[0] : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get resume error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching resumes.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded. Please select a PDF file.' },
        { status: 400 }
      );
    }

    // Validate file format
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Only PDF files are supported.' },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File is too large. Maximum size allowed is 5MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using Cloudinary or secure fallback
    const uploadResult = await uploadPdfToCloudinary(buffer, file.name);

    // Create new resume record
    const newResume = await dbService.createResume({
      userId: authUser.userId,
      fileName: file.name,
      fileUrl: uploadResult.secure_url,
      fileSize: file.size,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Resume uploaded successfully.',
        resume: newResume,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload resume error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error uploading resume.' },
      { status: 500 }
    );
  }
}
