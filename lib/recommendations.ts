import { RecommendedJobData, MatchLevel } from '@/types';

interface StudentProfileInput {
  skills?: string[];
  degree?: string;
  branch?: string;
  location?: string;
  college?: string;
}

export function calculateJobMatch(job: any, profile: StudentProfileInput | null | undefined): {
  matchPercentage: number;
  matchLevel: MatchLevel;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
  breakdown: {
    skillMatch: number;
    roleMatch: number;
    educationMatch: number;
    locationMatch: number;
  };
} {
  const userSkills = (profile?.skills || []).map((s) => s.trim().toLowerCase());
  const jobSkills = (job.skills || []).map((s: string) => s.trim().toLowerCase());

  // 1. Skill Match Calculation
  const matchingSkillsList: string[] = [];
  const missingSkillsList: string[] = [];

  job.skills?.forEach((skill: string) => {
    const lower = skill.toLowerCase();
    const matched = userSkills.some(
      (us) => us === lower || us.includes(lower) || lower.includes(us)
    );
    if (matched) {
      matchingSkillsList.push(skill);
    } else {
      missingSkillsList.push(skill);
    }
  });

  let skillMatchScore = 60;
  if (jobSkills.length > 0) {
    if (userSkills.length === 0) {
      // Default baseline for freshers before profile skills added
      skillMatchScore = 65;
    } else {
      const matchRatio = matchingSkillsList.length / jobSkills.length;
      skillMatchScore = Math.round(Math.min(100, Math.max(45, matchRatio * 100)));
    }
  }

  // 2. Role Match Calculation
  const titleLower = (job.title || '').toLowerCase();
  let roleMatchScore = 75;
  const branchLower = (profile?.branch || '').toLowerCase();
  const degreeLower = (profile?.degree || '').toLowerCase();

  const isTechStudent =
    branchLower.includes('computer') ||
    branchLower.includes('cs') ||
    branchLower.includes('it') ||
    branchLower.includes('information') ||
    degreeLower.includes('bca') ||
    degreeLower.includes('mca') ||
    degreeLower.includes('b.tech') ||
    degreeLower.includes('b.e');

  if (isTechStudent) {
    roleMatchScore = 90;
  }

  // 3. Education Match Calculation
  let educationMatchScore = 90;
  if (profile?.degree) {
    educationMatchScore = 95;
  }

  // 4. Location Match Calculation
  let locationMatchScore = 80;
  const jobLocLower = (job.location || '').toLowerCase();
  const userLocLower = (profile?.location || '').toLowerCase();

  if (
    job.workMode === 'Remote' ||
    jobLocLower.includes('remote') ||
    (userLocLower && jobLocLower.includes(userLocLower))
  ) {
    locationMatchScore = 95;
  } else {
    locationMatchScore = 75;
  }

  // Overall Weighted Calculation
  const weighted =
    skillMatchScore * 0.45 +
    roleMatchScore * 0.25 +
    educationMatchScore * 0.15 +
    locationMatchScore * 0.15;

  const matchPercentage = Math.min(96, Math.max(52, Math.round(weighted)));

  let matchLevel: MatchLevel = 'Medium Match';
  if (matchPercentage >= 80) {
    matchLevel = 'High Match';
  } else if (matchPercentage >= 65) {
    matchLevel = 'Good Match';
  }

  // Explainable reason
  let reason = '';
  if (matchingSkillsList.length >= 2) {
    reason = `Recommended because you have ${matchingSkillsList.slice(0, 3).join(', ')} skills.`;
  } else if (matchingSkillsList.length === 1) {
    reason = `Recommended because you have ${matchingSkillsList[0]} and relevant coursework.`;
  } else if (job.workMode === 'Remote') {
    reason = `Recommended for your fresher profile with remote flexibility.`;
  } else {
    reason = `Recommended based on your target role in ${job.title} and educational background.`;
  }

  return {
    matchPercentage,
    matchLevel,
    matchingSkills: matchingSkillsList,
    missingSkills: missingSkillsList,
    reason,
    breakdown: {
      skillMatch: skillMatchScore,
      roleMatch: roleMatchScore,
      educationMatch: educationMatchScore,
      locationMatch: locationMatchScore,
    },
  };
}

export function enrichJobsWithRecommendations(
  jobs: any[],
  profile: StudentProfileInput | null | undefined,
  savedJobIds: Set<string> = new Set(),
  appliedJobIds: Set<string> = new Set()
): RecommendedJobData[] {
  return jobs
    .map((job) => {
      const match = calculateJobMatch(job, profile);
      const idStr = (job._id || '').toString();

      return {
        _id: idStr,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        description: job.description,
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        qualifications: job.qualifications || [],
        skills: job.skills || [],
        location: job.location,
        workMode: job.workMode,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salary: job.salary,
        benefits: job.benefits || [],
        postedDate: job.postedDate ? new Date(job.postedDate).toISOString() : new Date().toISOString(),
        deadline: job.deadline ? new Date(job.deadline).toISOString() : undefined,
        isSaved: savedJobIds.has(idStr),
        hasApplied: appliedJobIds.has(idStr),
        ...match,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
