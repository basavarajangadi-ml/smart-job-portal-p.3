export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
}

export interface ProfileCompletionInput {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number | string;
  cgpa?: string;
  skills?: string[];
  projects?: Array<unknown>;
  experience?: Array<unknown>;
  certifications?: Array<unknown>;
  github?: string;
  linkedin?: string;
  resumeUploaded?: boolean;
}

export function calculateProfileCompletion(profile: ProfileCompletionInput | null | undefined): {
  percentage: number;
  missingSections: string[];
} {
  if (!profile) {
    return {
      percentage: 20, // Name and email are from user account
      missingSections: ['Phone & Location', 'Education Details', 'Skills', 'Projects', 'Resume'],
    };
  }

  let score = 20; // Default for account creation (name + email)
  const missing: string[] = [];

  // Contact & Location (15%)
  if (profile.phone && profile.phone.trim().length > 0 && profile.location && profile.location.trim().length > 0) {
    score += 15;
  } else {
    missing.push('Contact & Location');
  }

  // Education (20%)
  if (profile.college && profile.degree && profile.branch) {
    score += 20;
  } else {
    missing.push('College, Degree & Branch');
  }

  // Skills (15%)
  if (profile.skills && profile.skills.length > 0) {
    score += 15;
  } else {
    missing.push('Add at least one Skill');
  }

  // Projects (15%)
  if (profile.projects && profile.projects.length > 0) {
    score += 15;
  } else {
    missing.push('Add a Project');
  }

  // Experience or Certifications (10%)
  if ((profile.experience && profile.experience.length > 0) || (profile.certifications && profile.certifications.length > 0)) {
    score += 10;
  } else {
    missing.push('Experience or Certifications');
  }

  // Social Links (5%)
  if (profile.github || profile.linkedin) {
    score += 5;
  } else {
    missing.push('Social Links (GitHub/LinkedIn)');
  }

  return {
    percentage: Math.min(100, score),
    missingSections: missing,
  };
}
