export interface UserProfileSummary {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface StudentProfileData {
  _id?: string;
  userId?: string;
  phone?: string;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number | string;
  cgpa?: string;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    organization: string;
    year: string;
  }>;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  profilePhoto?: string;
}

export interface ResumeData {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface JobData {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  skills: string[];
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Full Time' | 'Internship' | 'Part Time';
  experienceLevel: 'Fresher' | 'Entry Level';
  salary: string;
  benefits: string[];
  postedDate: string;
  deadline?: string;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface ApplicationData {
  _id: string;
  userId: string;
  jobId: JobData | any;
  resumeId: ResumeData | any;
  coverLetter?: string;
  status: ApplicationStatus;
  interviewDate?: string;
  recruiterInfo?: {
    name: string;
    title?: string;
    email?: string;
    company?: string;
  };
  recruiterFeedback?: {
    text: string;
    date: string;
    rating?: number;
  };
  notes?: string;
  appliedAt: string;
  updatedAt: string;
}

export type MatchLevel = 'High Match' | 'Good Match' | 'Medium Match';

export interface RecommendedJobData extends JobData {
  matchPercentage: number;
  matchLevel: MatchLevel;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
  breakdown?: {
    skillMatch: number;
    roleMatch: number;
    educationMatch: number;
    locationMatch: number;
  };
}

export interface RecruiterFeedbackItem {
  id: string;
  applicationId: string;
  company: string;
  companyLogo?: string;
  jobTitle: string;
  feedback: string;
  recruiterName: string;
  recruiterTitle?: string;
  date: string;
  status: ApplicationStatus;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'job' | 'status' | 'interview' | 'feedback' | 'resume' | 'milestone';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface CareerMilestoneItem {
  id: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'upcoming';
  stageNumber: number;
}

export interface SkillMatchOverview {
  overallScore: number;
  targetRole: string;
  topMatchingSkills: string[];
  missingSkills: string[];
  skillRoadmap: Array<{
    category: string;
    skills: Array<{ name: string; status: 'acquired' | 'recommended'; importance: string }>;
  }>;
  guidanceText: string;
}

export interface ResumeStrengthAnalysis {
  score: number;
  grade: 'Excellent' | 'Good' | 'Needs Improvement';
  summary: string;
  breakdown: {
    skillsAndKeywords: { score: number; max: number; status: string };
    projects: { score: number; max: number; status: string };
    education: { score: number; max: number; status: string };
    experience: { score: number; max: number; status: string };
    formatting: { score: number; max: number; status: string };
    jobRelevance: { score: number; max: number; status: string };
  };
  foundKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface ApplicationAnalyticsData {
  totalApplications: number;
  shortlistedCount: number;
  interviewCount: number;
  rejectedCount: number;
  selectedCount: number;
  trends: {
    totalChange: string;
    shortlistedChange: string;
    interviewsChange: string;
    rejectedChange: string;
  };
  monthlyApplications: Array<{ month: string; count: number }>;
  categoriesDistribution: Array<{ name: string; count: number; percentage: number }>;
  interviewOutcomes: {
    selected: number;
    pending: number;
    rejected: number;
  };
  topSkillsDemand: Array<{ skill: string; percentage: number }>;
}

export interface DashboardStats {
  totalApplications: number;
  shortlistedCount: number;
  interviewCount: number;
  rejectedCount: number;
  savedJobsCount: number;
  profileCompletion: number;
  missingSections?: string[];
  activeApplicationsCount: number;
  trends?: {
    totalChange: string;
    shortlistedChange: string;
    interviewsChange: string;
    rejectedChange: string;
  };
  recentApplications: ApplicationData[];
  recommendedJobs: RecommendedJobData[];
}

