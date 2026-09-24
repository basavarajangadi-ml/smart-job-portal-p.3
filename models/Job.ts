import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
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
  postedDate: Date;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      index: true,
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      required: true,
      index: true,
    },
    jobType: {
      type: String,
      enum: ['Full Time', 'Internship', 'Part Time'],
      required: true,
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Entry Level'],
      required: true,
      index: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary or stipend is required'],
    },
    benefits: {
      type: [String],
      default: [],
    },
    postedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search across title, company, skills, and location
JobSchema.index({
  title: 'text',
  company: 'text',
  skills: 'text',
  location: 'text',
  description: 'text',
});

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);

export default Job;
