import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISavedJob extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  savedAt: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
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
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saved jobs per user
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const SavedJob: Model<ISavedJob> =
  mongoose.models.SavedJob || mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);

export default SavedJob;
