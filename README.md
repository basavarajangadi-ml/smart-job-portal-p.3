# SmartHire — Smart Job Portal for Students & Freshers (Phase 1)

> **"Find Your First Opportunity. Build Your Career."**  
> A modern, full-stack CareerTech web application built specifically for college students, fresh graduates, and entry-level job seekers.

![SmartHire Platform](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Live Demo & Deployment Guide (Vercel Ready)

SmartHire is designed specifically as a single Next.js project with App Router and Route Handlers ready for 1-click deployment on **Vercel** with **MongoDB Atlas**.

```
GitHub ──▶ Vercel ──▶ MongoDB Atlas
```

### Steps to Deploy on Vercel:
1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, configure the required variables (see below).
5. Click **"Deploy"**.
6. Once deployed, the application will automatically initialize the database with 12 high-quality demo fresher and internship jobs on first load!

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, Route Handlers)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Next.js Route Handlers (Node.js runtime)
- **Database**: MongoDB Atlas via Mongoose ORM
- **Authentication**: JWT stored in secure `HttpOnly` Cookies with `bcryptjs` password hashing
- **File Storage**: External cloud storage integration (Cloudinary) with automatic fallback
- **Production Platform**: Vercel Serverless

---

## 🧭 Phase 1 User Journey

SmartHire provides a complete end-to-end user journey:

```
REGISTER
   ↓
LOGIN
   ↓
CREATE PROFILE (Personal Info, Education, Skills Badges, Projects, Experience, Certifications, Socials)
   ↓
UPLOAD RESUME (Cloud PDF storage, preview, download, replace, delete)
   ↓
BROWSE JOBS (Curated fresher & internship openings)
   ↓
SEARCH & MULTI-FILTER (Title, Company, Skills, Location, Work Mode, Job Type, Experience)
   ↓
VIEW JOB DETAILS (Full breakdown: perks, responsibilities, qualifications)
   ↓
SAVE JOB (Instant bookmarking and saved jobs management)
   ↓
APPLY (One-click application with profile validation & optional cover letter)
   ↓
TRACK APPLICATION (Visual timeline: Applied ➔ Under Review ➔ Shortlisted ➔ Interview ➔ Selected)
   ↓
APPLICATION HISTORY & DASHBOARD METRICS
```

---

## 🔐 Environment Variables

Create a file named `.env.local` in the project root:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/smarthire` |
| `AUTH_SECRET` | Secret key for JWT signing & verification | `super_secret_smarthire_jwt_key_change_in_production_2026` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name for PDF resumes | `your_cloud_name` *(Optional in local dev)* |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` *(Optional in local dev)* |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` *(Optional in local dev)* |
| `NEXT_PUBLIC_APP_URL` | Application base URL | `https://smarthire.vercel.app` or `http://localhost:3000` |

> 💡 **Graceful Fallback:** If Cloudinary credentials are not provided during local development, SmartHire uses a client-safe base64 data URI storage mechanism, ensuring file viewing, downloading, and applications work without crashing!

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v11+`
- Local MongoDB running or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string

### 2. Clone and Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

### 4. (Optional) Seed the Database
You can populate the database with 12 realistic student jobs and internships:
```bash
npm run seed
```
*(Note: If you skip this, the database will automatically seed itself the first time anyone visits the jobs page or dashboard!)*

### 5. Start the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```
├── app/
│   ├── api/                     # Backend API Route Handlers
│   │   ├── auth/                # register, login, logout, me, change-password, delete-account
│   │   ├── profile/             # GET, PUT student profile
│   │   ├── resume/              # GET, POST, DELETE [id]
│   │   ├── jobs/                # GET search & filter, GET [id]
│   │   ├── saved-jobs/          # GET, POST, DELETE [jobId]
│   │   ├── applications/        # GET, POST, GET [id]
│   │   ├── dashboard/           # GET aggregated dynamic statistics
│   │   └── seed/                # POST/GET demo data reset
│   ├── applications/            # Application tracking & details with visual timeline
│   ├── dashboard/               # Student dashboard with dynamic stat cards & recommendations
│   ├── jobs/                    # Job discovery & detailed job view (/jobs/[id])
│   ├── login/                   # User login with validation
│   ├── register/                # User registration with educational fields
│   ├── profile/                 # Student profile editor
│   ├── resume/                  # Resume management & PDF cloud upload
│   ├── saved-jobs/              # Bookmarked opportunities
│   ├── settings/                # Account settings & danger zone
│   ├── globals.css              # Custom styling & Tailwind directives
│   ├── layout.tsx               # Root layout & SEO meta tags
│   └── page.tsx                 # Landing / Home page
├── components/
│   ├── dashboard/               # Dashboard layout, stat cards, profile completion
│   ├── footer/                  # Brand footer & social links
│   ├── jobs/                    # JobCard, ApplyModal, filters
│   ├── navbar/                  # Public & Dashboard navbars
│   └── sidebar/                 # Student portal sidebar with mobile drawer
├── lib/
│   ├── auth.ts                  # bcrypt hashing, JWT signing, secure cookie management
│   ├── cloudinary.ts            # External cloud file storage & fallback handler
│   ├── mongodb.ts               # Global Mongoose connection caching for serverless
│   ├── seedData.ts              # 12 curated demo jobs & internships
│   ├── utils.ts                 # Formatting helpers, cn() & status styles
│   └── validations.ts           # Email/password validation & profile scoring logic
├── models/
│   ├── User.ts                  # User schema
│   ├── StudentProfile.ts        # Extended student profile schema
│   ├── Resume.ts                # Resume metadata schema
│   ├── Job.ts                   # Job opportunity schema
│   ├── SavedJob.ts              # Saved job compound relation schema
│   └── Application.ts           # Job application schema with status pipeline
├── types/                       # Shared TypeScript interfaces
├── middleware.ts                # Route protection middleware for private pages
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS design system tokens
└── tsconfig.json                # TypeScript configuration
```

---

## 🔒 Security Features

1. **Password Hashing**: Industry-standard `bcryptjs` with salt rounds.
2. **JWT in HttpOnly Cookies**: Sensitive tokens are never accessible via client-side JavaScript.
3. **Password Protection in Queries**: `select: false` on User password field.
4. **Duplicate Prevention**: Compound MongoDB unique indexes on `(userId, jobId)` for both applications and saved jobs.
5. **Private Route Protection**: Next.js `middleware.ts` redirects unauthenticated users automatically.
6. **Input Validation**: Rigorous checks on email format, password strength, and PDF MIME types.

---

## 🏆 Verification Checklist

- [x] Student Registration with academic fields
- [x] Secure Student Login with show/hide password
- [x] Route protection via Next.js middleware
- [x] Student Profile editing with interactive skill badges & project entries
- [x] Dynamic Profile Completion scoring
- [x] Resume upload with external cloud storage & metadata in MongoDB
- [x] Job Discovery with text search and multi-filtering (Job Type, Work Mode, Experience, Skill, Date)
- [x] Detailed Job View with perks, responsibilities, and qualifications
- [x] Save / Bookmark jobs with instant toggle
- [x] Application Flow with verification (checks profile & resume exist)
- [x] Duplicate application prevention
- [x] Application Tracking with status tabs
- [x] Application Details with interactive 5-stage Visual Timeline
- [x] Dynamic Dashboard statistics (computed from MongoDB)
- [x] Account settings with password change and delete confirmation modal
- [x] 100% Vercel compatible architecture
#   s m a r t - j o b - p o r t a l - 1  
 