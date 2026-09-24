import { initialJobs } from './seedData';
import bcrypt from 'bcryptjs';

// Global memory store across serverless requests in local dev
interface StoreState {
  users: any[];
  profiles: any[];
  resumes: any[];
  jobs: any[];
  savedJobs: any[];
  applications: any[];
  notifications: any[];
}

declare global {
  // eslint-disable-next-line no-var
  var __smarthire_memory_store: StoreState | undefined;
}

if (!global.__smarthire_memory_store) {
  // Pre-seed jobs in memory with MongoDB-style 24-character hexadecimal IDs
  const seededJobs = initialJobs.map((j, idx) => ({
    ...j,
    _id: `6600000000000000000000${(idx + 1).toString(16).padStart(2, '0')}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  global.__smarthire_memory_store = {
    users: [],
    profiles: [],
    resumes: [],
    jobs: seededJobs,
    savedJobs: [],
    applications: [],
    notifications: [],
  };
}

export const memoryStore = global.__smarthire_memory_store;

export function generateObjectId(): string {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = Math.floor(Math.random() * 0xffffffffffff)
    .toString(16)
    .padStart(12, '0');
  const counter = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, '0');
  return `${timestamp}${random}${counter}`.slice(0, 24);
}
