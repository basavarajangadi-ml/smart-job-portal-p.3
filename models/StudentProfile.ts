import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject {
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface IExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ICertification {
  name: string;
  organization: string;
  year: string;
}

export interface IStudentProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  phone?: string;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number | string;
  cgpa?: string;
  skills: string[];
  projects: IProject[];
  experience: IExperience[];
  certifications: ICertification[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const CertificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true },
    organization: { type: String, default: '' },
    year: { type: String, default: '' },
  },
  { _id: false }
);

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    graduationYear: { type: Schema.Types.Mixed, default: '' },
    cgpa: { type: String, default: '' },
    skills: { type: [String], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    certifications: { type: [CertificationSchema], default: [] },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

export default StudentProfile;
