import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { isValidEmail, validatePassword } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      college,
      degree,
      branch,
      graduationYear,
    } = body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Validate password
    const pwdValidation = validatePassword(password);
    if (!pwdValidation.valid) {
      return NextResponse.json(
        { success: false, message: pwdValidation.message },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await dbService.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'student',
    });

    // Create / update initial Student Profile with educational info
    await dbService.updateProfile(newUser._id.toString(), {
      phone: phone ? phone.trim() : '',
      college: college ? college.trim() : '',
      degree: degree ? degree.trim() : '',
      branch: branch ? branch.trim() : '',
      graduationYear: graduationYear || '',
      skills: [],
      projects: [],
      experience: [],
      certifications: [],
    });

    // Create token payload
    const tokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        user: tokenPayload,
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
