import mongoose, { Document, Model, Schema } from 'mongoose';

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
  interviewDate?: Date;
  recruiterInfo?: {
    name: string;
    title?: string;
    email?: string;
    company?: string;
  };
  recruiterFeedback?: {
    text: string;
    date: Date;
    rating?: number;
  };
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
      index: true,
    },
    interviewDate: {
      type: Date,
    },
    recruiterInfo: {
      name: { type: String },
      title: { type: String },
      email: { type: String },
      company: { type: String },
    },
    recruiterFeedback: {
      text: { type: String },
      date: { type: Date, default: Date.now },
      rating: { type: Number },
    },
    notes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate application for the same job by the same user
ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
