import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectToDatabase from '@/lib/mongodb';
import Job from '@/models/Job';
import { initialJobs } from '@/lib/seedData';

export async function POST() {
  try {
    await connectToDatabase();
    await Job.deleteMany({});
    const jobs = await Job.insertMany(initialJobs);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully seeded ${jobs.length} demo jobs!`,
        count: jobs.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error seeding database.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
