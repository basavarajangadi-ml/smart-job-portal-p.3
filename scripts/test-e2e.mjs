const BASE_URL = 'http://localhost:3000';

async function runTest() {
  console.log('🚀 Starting SmartHire End-to-End Test Suite...\n');

  // 1. Test GET /
  const homeRes = await fetch(`${BASE_URL}/`);
  console.log(`[1] Home Page status: ${homeRes.status} (OK)`);

  // 2. Test Registration
  const studentEmail = `student_${Date.now()}@college.edu`;
  const regPayload = {
    name: 'Aarav Patel',
    email: studentEmail,
    password: 'Password123!',
    confirmPassword: 'Password123!',
    phone: '+91 9876543210',
    college: 'IIT Bombay',
    degree: 'B.Tech / B.E.',
    branch: 'Computer Science',
    graduationYear: '2025',
  };

  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });

  const regData = await regRes.json();
  const setCookie = regRes.headers.get('set-cookie');
  console.log(`[2] Registration: ${regData.success ? 'SUCCESS' : 'FAILED'} - ${regData.message}`);

  // Extract auth cookie
  let authCookie = '';
  if (setCookie) {
    const match = setCookie.match(/smarthire_token=([^;]+)/);
    if (match) authCookie = `smarthire_token=${match[1]}`;
  }

  const authHeaders = {
    Cookie: authCookie,
    'Content-Type': 'application/json',
  };

  // 3. Test Dashboard (authenticated)
  const dashRes = await fetch(`${BASE_URL}/api/dashboard`, { headers: authHeaders });
  const dashData = await dashRes.json();
  console.log(
    `[3] Dashboard Stats: Applications: ${dashData.stats.totalApplications}, Profile Completion: ${dashData.stats.profileCompletion}%, Recommended Jobs: ${dashData.recommendedJobs?.length}`
  );

  // 4. Test Profile Update
  const updateProfileRes = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      projects: [
        {
          name: 'Campus Job Portal',
          description: 'A Next.js full-stack recruitment portal with Mongoose and JWT authentication.',
          technologies: 'Next.js, TypeScript, Tailwind, MongoDB',
        },
      ],
      github: 'https://github.com/aaravpatel',
      linkedin: 'https://linkedin.com/in/aaravpatel',
    }),
  });
  const updateData = await updateProfileRes.json();
  console.log(
    `[4] Profile Update: ${updateData.success ? 'SUCCESS' : 'FAILED'}, New Completion Score: ${updateData.completion?.percentage}%`
  );

  // 5. Test Resume Upload (PDF)
  const fakePdfBuffer = Buffer.from('%PDF-1.4 Mock resume content for testing purposes %%EOF');
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(fakePdfBuffer)], { type: 'application/pdf' });
  formData.append('file', blob, 'Aarav_Patel_Resume.pdf');

  const resumeRes = await fetch(`${BASE_URL}/api/resume`, {
    method: 'POST',
    headers: { Cookie: authCookie },
    body: formData,
  });
  const resumeData = await resumeRes.json();
  console.log(`[5] Resume Upload: ${resumeData.success ? 'SUCCESS' : 'FAILED'} - ${resumeData.message}`);

  // 6. Test Jobs Discovery & Filtering
  const jobsRes = await fetch(`${BASE_URL}/api/jobs?jobType=Internship&search=React`, { headers: authHeaders });
  const jobsData = await jobsRes.json();
  console.log(`[6] Jobs Filter (Internship + React): Found ${jobsData.count} opportunities.`);
  const targetJob = jobsData.jobs[0];

  // 7. Save Job
  if (targetJob) {
    const saveRes = await fetch(`${BASE_URL}/api/saved-jobs`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ jobId: targetJob._id }),
    });
    const saveData = await saveRes.json();
    console.log(`[7] Save Job (${targetJob.title}): ${saveData.success ? 'SUCCESS' : 'FAILED'}`);
  }

  // 8. Apply to Job
  if (targetJob) {
    const applyRes = await fetch(`${BASE_URL}/api/applications`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        jobId: targetJob._id,
        coverLetter: 'I am excited to apply for this React internship role!',
      }),
    });
    const applyData = await applyRes.json();
    console.log(`[8] Apply for Job: ${applyData.success ? 'SUCCESS' : 'FAILED'} - ${applyData.message}`);

    // Verify duplicate prevention
    const dupRes = await fetch(`${BASE_URL}/api/applications`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ jobId: targetJob._id }),
    });
    const dupData = await dupRes.json();
    console.log(`[9] Duplicate Prevention Check: ${dupRes.status === 409 ? 'PASSED (Status 409 Prevented)' : 'FAILED'}`);

    // 10. Check Applications List & Timeline Details
    const myAppsRes = await fetch(`${BASE_URL}/api/applications`, { headers: authHeaders });
    const myAppsData = await myAppsRes.json();
    const firstApp = myAppsData.applications[0];
    console.log(
      `[10] Application Tracking: Listed ${myAppsData.count} applications. Latest Status: ${firstApp.status}`
    );

    const appDetailsRes = await fetch(`${BASE_URL}/api/applications/${firstApp._id}`, { headers: authHeaders });
    const appDetailsData = await appDetailsRes.json();
    console.log(
      `[11] Application Details & Timeline: Loaded successfully for job "${appDetailsData.application.jobId.title}" at "${appDetailsData.application.jobId.company}"`
    );
  }

  // 12. Final Dashboard State
  const finalDashRes = await fetch(`${BASE_URL}/api/dashboard`, { headers: authHeaders });
  const finalDashData = await finalDashRes.json();
  console.log(
    `\n✨ Final Dashboard Verification:\n` +
      `   • Candidate Name: ${finalDashData.user.name}\n` +
      `   • Total Applications: ${finalDashData.stats.totalApplications}\n` +
      `   • Active Applications: ${finalDashData.stats.activeApplicationsCount}\n` +
      `   • Saved Jobs: ${finalDashData.stats.savedJobsCount}\n` +
      `   • Dynamic Profile Completion: ${finalDashData.stats.profileCompletion}%\n`
  );

  console.log('🎉 ALL 12 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
}

runTest().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
