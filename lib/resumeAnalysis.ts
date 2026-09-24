import { ResumeStrengthAnalysis } from '@/types';

interface AnalysisInput {
  user?: { name: string; email: string };
  profile?: any;
  resumes?: any[];
}

const COMMON_TECH_KEYWORDS = [
  'Git',
  'GitHub',
  'REST API',
  'Data Structures',
  'Algorithms',
  'React',
  'JavaScript',
  'TypeScript',
  'Python',
  'SQL',
  'Node.js',
  'Tailwind CSS',
  'Docker',
  'Agile',
  'Problem Solving',
  'Object-Oriented Programming (OOP)',
  'Unit Testing',
  'CI/CD',
];

export function analyzeResumeStrength({ user, profile, resumes = [] }: AnalysisInput): ResumeStrengthAnalysis {
  const hasResumeFile = resumes.length > 0;
  const skills: string[] = profile?.skills || [];
  const projects: any[] = profile?.projects || [];
  const experience: any[] = profile?.experience || [];
  const certifications: any[] = profile?.certifications || [];

  // 1. Skills & Keywords (Max 25 pts)
  let skillPoints = 0;
  if (skills.length >= 8) skillPoints = 25;
  else if (skills.length >= 5) skillPoints = 20;
  else if (skills.length >= 3) skillPoints = 15;
  else if (skills.length >= 1) skillPoints = 10;
  else skillPoints = 5;

  // 2. Projects (Max 25 pts)
  let projectPoints = 0;
  if (projects.length >= 3) projectPoints = 25;
  else if (projects.length === 2) projectPoints = 20;
  else if (projects.length === 1) projectPoints = 14;
  else projectPoints = 5;

  // Check if projects have tech stack & descriptions
  const wellDocumentedProjects = projects.filter(
    (p) => p.technologies && p.description && p.description.length > 30
  );
  if (wellDocumentedProjects.length >= 2 && projectPoints < 25) {
    projectPoints = Math.min(25, projectPoints + 4);
  }

  // 3. Education (Max 20 pts)
  let educationPoints = 0;
  if (profile?.degree && profile?.branch) educationPoints += 10;
  if (profile?.college) educationPoints += 5;
  if (profile?.cgpa || profile?.graduationYear) educationPoints += 5;
  if (educationPoints === 0) educationPoints = 8; // default baseline

  // 4. Experience & Certifications (Max 15 pts)
  let expPoints = 0;
  if (experience.length >= 2) expPoints = 15;
  else if (experience.length === 1) expPoints = 10;
  else if (certifications.length >= 2) expPoints = 8;
  else if (certifications.length === 1) expPoints = 5;
  else expPoints = 4;

  // 5. Formatting & Completeness (Max 15 pts)
  let formatPoints = 0;
  if (hasResumeFile) formatPoints += 8;
  if (profile?.github || profile?.linkedin) formatPoints += 4;
  if (profile?.phone && user?.email) formatPoints += 3;
  if (formatPoints < 5) formatPoints = 5;

  const totalScore = Math.min(95, Math.max(38, skillPoints + projectPoints + educationPoints + expPoints + formatPoints));

  let grade: 'Excellent' | 'Good' | 'Needs Improvement' = 'Needs Improvement';
  if (totalScore >= 80) grade = 'Excellent';
  else if (totalScore >= 65) grade = 'Good';

  // Keyword extraction & gap detection
  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  const textCorpus = [
    ...skills,
    ...projects.map((p) => `${p.name} ${p.technologies} ${p.description}`),
    ...experience.map((e) => `${e.company} ${e.role} ${e.description}`),
  ]
    .join(' ')
    .toLowerCase();

  COMMON_TECH_KEYWORDS.forEach((kw) => {
    if (textCorpus.includes(kw.toLowerCase())) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Actionable smart suggestions
  const suggestions: string[] = [];

  if (skills.length < 6) {
    suggestions.push('Add more project-specific technical skills (aim for at least 6-8 core competencies).');
  }
  if (!textCorpus.includes('git') && !textCorpus.includes('github')) {
    suggestions.push('Improve keyword matching for your target role by highlighting Git and GitHub collaboration.');
  }
  if (!textCorpus.includes('%') && !textCorpus.includes('increased') && !textCorpus.includes('reduced')) {
    suggestions.push('Add measurable project achievements (e.g., "improved load time by 30%", "built for 200+ users").');
  }
  if (projects.length < 2) {
    suggestions.push('Showcase at least 2 full-stack or domain-specific projects with live links or GitHub repos.');
  }
  if (!profile?.linkedin || !profile?.github) {
    suggestions.push('Link your active GitHub and LinkedIn profiles to increase recruiter verification confidence.');
  }
  if (!hasResumeFile) {
    suggestions.push('Upload an ATS-compliant PDF resume file in the Resume section.');
  }

  // Fallback suggestion
  if (suggestions.length === 0) {
    suggestions.push('Keep your technical skills updated with latest industry frameworks and tools.');
    suggestions.push('Highlight any hackathon participation, open-source contributions, or coding certifications.');
  }

  let summary = '';
  if (totalScore >= 80) {
    summary = 'Your profile is highly competitive and well-structured for entry-level and internship roles.';
  } else if (totalScore >= 65) {
    summary = 'Solid foundation! A few focused improvements in skills and project metrics will elevate your profile to top recruiters.';
  } else {
    summary = 'Enhance your project descriptions and add relevant core keywords to pass automated resume screening.';
  }

  return {
    score: totalScore,
    grade,
    summary,
    breakdown: {
      skillsAndKeywords: {
        score: skillPoints,
        max: 25,
        status: skillPoints >= 20 ? 'Strong' : 'Average',
      },
      projects: {
        score: projectPoints,
        max: 25,
        status: projectPoints >= 20 ? 'Strong' : 'Needs More Detail',
      },
      education: {
        score: educationPoints,
        max: 20,
        status: educationPoints >= 15 ? 'Complete' : 'Incomplete',
      },
      experience: {
        score: expPoints,
        max: 15,
        status: expPoints >= 10 ? 'Good' : 'Entry Level',
      },
      formatting: {
        score: formatPoints,
        max: 15,
        status: hasResumeFile ? 'ATS Friendly' : 'Missing PDF',
      },
      jobRelevance: {
        score: Math.min(20, Math.round(totalScore * 0.2)),
        max: 20,
        status: totalScore >= 70 ? 'High' : 'Moderate',
      },
    },
    foundKeywords: foundKeywords.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 6),
    suggestions: suggestions.slice(0, 4),
  };
}
