import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });
dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    description: { type: String, required: true },
    responsibilities: [String],
    requirements: [String],
    qualifications: [String],
    skills: [String],
    location: { type: String, required: true },
    workMode: { type: String, required: true },
    jobType: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    salary: { type: String, required: true },
    benefits: [String],
    postedDate: { type: Date, default: Date.now },
    deadline: Date,
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully.');

  const count = await Job.countDocuments();
  console.log(`Current jobs in database: ${count}`);

  const { initialJobs } = await import('../lib/seedData.js').catch(async () => {
    return await import('./seedDataRaw.mjs');
  });

  if (initialJobs && initialJobs.length > 0) {
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');
    const inserted = await Job.insertMany(initialJobs);
    console.log(`Successfully seeded ${inserted.length} realistic jobs and internships!`);
  }

  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
