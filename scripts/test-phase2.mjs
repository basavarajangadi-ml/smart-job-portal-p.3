const BASE_URL = 'http://localhost:3000';

async function runPhase2Tests() {
  console.log('🚀 Starting Phase 2 Smart Recommendations & Application Tracking Tests...\n');

  // 1. Register a test student
  const email = `phase2_${Date.now()}@smarthire.test`;
  const password = 'Password@123';
  console.log(`1. Registering student: ${email}...`);

  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Basavaraj Angadi',
      email,
      password,
      confirmPassword: password,
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
    }),
  });

  const regData = await regRes.json();
  if (!regRes.ok || !regData.success) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }
  console.log('   ✓ Student registered successfully.');

  // Extract cookies
  const cookies = (regRes.headers.getSetCookie ? regRes.headers.getSetCookie() : [regRes.headers.get('set-cookie') || '']);
  const cookieHeader = cookies.map((c) => c.split(';')[0]).join('; ');

  // 2. Test /api/dashboard for Phase 2 data
  console.log('\n2. Testing /api/dashboard for Phase 2 enhancements...');
  const dashRes = await fetch(`${BASE_URL}/api/dashboard`, {
    headers: { Cookie: cookieHeader },
  });
  const dashData = await dashRes.json();
  if (!dashRes.ok || !dashData.success) {
    throw new Error(`Dashboard fetch failed: ${JSON.stringify(dashData)}`);
  }

  console.log(`   ✓ Greeting user: ${dashData.user?.name} (${dashData.user?.degree} • ${dashData.user?.branch})`);
  console.log(`   ✓ Stats: Total Applications: ${dashData.stats?.totalApplications}, Shortlisted: ${dashData.stats?.shortlistedCount}, Interviews: ${dashData.stats?.interviewCount}, Rejected: ${dashData.stats?.rejectedCount}`);
  console.log(`   ✓ Trends: ${dashData.stats?.trends?.totalChange}, ${dashData.stats?.trends?.shortlistedChange}, ${dashData.stats?.trends?.interviewsChange}`);
  console.log(`   ✓ Recommended jobs count: ${dashData.recommendedJobs?.length}`);
  if (dashData.recommendedJobs?.length > 0) {
    const j = dashData.recommendedJobs[0];
    console.log(`     - Sample recommendation: "${j.title}" at ${j.company} [${j.matchPercentage}% - ${j.matchLevel}]`);
    console.log(`     - Reason: "${j.reason}"`);
  }
  console.log(`   ✓ Recruiter feedbacks count: ${dashData.recruiterFeedbacks?.length}`);
  if (dashData.recruiterFeedbacks?.length > 0) {
    console.log(`     - Sample feedback: "${dashData.recruiterFeedbacks[0].feedback}" from ${dashData.recruiterFeedbacks[0].company}`);
  }
  console.log(`   ✓ Career milestones: ${dashData.careerProgress?.completedCount}/${dashData.careerProgress?.totalMilestones} (${dashData.careerProgress?.motivationalMessage})`);
  console.log(`   ✓ Skill match score: ${dashData.skillMatch?.overallScore}% (${dashData.skillMatch?.topMatchingSkills?.join(', ')})`);
  console.log(`   ✓ Resume strength: ${dashData.resumeStrength?.score}% [${dashData.resumeStrength?.grade}]`);

  // 3. Test /api/recommendations
  console.log('\n3. Testing /api/recommendations...');
  const recRes = await fetch(`${BASE_URL}/api/recommendations`, {
    headers: { Cookie: cookieHeader },
  });
  const recData = await recRes.json();
  if (!recRes.ok || !recData.success) {
    throw new Error(`Recommendations fetch failed: ${JSON.stringify(recData)}`);
  }
  console.log(`   ✓ Retrieved ${recData.recommendedJobs?.length} personalized recommendations`);

  // 4. Test /api/notifications
  console.log('\n4. Testing /api/notifications...');
  const notifRes = await fetch(`${BASE_URL}/api/notifications`, {
    headers: { Cookie: cookieHeader },
  });
  const notifData = await notifRes.json();
  if (!notifRes.ok || !notifData.success) {
    throw new Error(`Notifications fetch failed: ${JSON.stringify(notifData)}`);
  }
  console.log(`   ✓ Retrieved ${notifData.notifications?.length} notifications (Unread: ${notifData.unreadCount})`);

  // Mark first notification as read
  if (notifData.notifications?.length > 0) {
    const firstNotifId = notifData.notifications[0]._id;
    const markRes = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ id: firstNotifId }),
    });
    const markData = await markRes.json();
    if (markRes.ok && markData.success) {
      console.log(`   ✓ Successfully marked notification ${firstNotifId} as read.`);
    }
  }

  // 5. Test /api/analytics
  console.log('\n5. Testing /api/analytics...');
  const anaRes = await fetch(`${BASE_URL}/api/analytics`, {
    headers: { Cookie: cookieHeader },
  });
  const anaData = await anaRes.json();
  if (!anaRes.ok || !anaData.success) {
    throw new Error(`Analytics fetch failed: ${JSON.stringify(anaData)}`);
  }
  console.log(`   ✓ Monthly points: ${anaData.analytics?.monthlyApplications?.length}`);
  console.log(`   ✓ Categories: ${anaData.analytics?.categoriesDistribution?.map((c) => c.name).join(', ')}`);
  console.log(`   ✓ Top skills demand: ${anaData.analytics?.topSkillsDemand?.map((s) => `${s.skill}: ${s.percentage}%`).join(', ')}`);

  // 6. Test /api/interview-prep
  console.log('\n6. Testing /api/interview-prep...');
  const prepRes = await fetch(`${BASE_URL}/api/interview-prep?role=frontend`, {
    headers: { Cookie: cookieHeader },
  });
  const prepData = await prepRes.json();
  if (!prepRes.ok || !prepData.success) {
    throw new Error(`Interview prep fetch failed: ${JSON.stringify(prepData)}`);
  }
  console.log(`   ✓ Available roles: ${prepData.availableRoles?.map((r) => r.role).join(', ')}`);
  console.log(`   ✓ Topics count: ${prepData.roleData?.topics?.length}`);
  console.log(`   ✓ Common questions: ${prepData.roleData?.commonQuestions?.length}`);
  console.log(`   ✓ Mock interview questions: ${prepData.roleData?.mockInterview?.length}`);
  console.log(`   ✓ HR guides: ${prepData.hrResources?.length}`);

  // 7. Test /api/resume-analysis
  console.log('\n7. Testing /api/resume-analysis...');
  const resumeRes = await fetch(`${BASE_URL}/api/resume-analysis`, {
    headers: { Cookie: cookieHeader },
  });
  const resumeData = await resumeRes.json();
  if (!resumeRes.ok || !resumeData.success) {
    throw new Error(`Resume analysis fetch failed: ${JSON.stringify(resumeData)}`);
  }
  console.log(`   ✓ Score: ${resumeData.report?.score}% [${resumeData.report?.grade}]`);
  console.log(`   ✓ Found keywords: ${resumeData.report?.foundKeywords?.slice(0, 5).join(', ')}`);
  console.log(`   ✓ Suggestions count: ${resumeData.report?.suggestions?.length}`);

  console.log('\n======================================================');
  console.log('🎉 ALL PHASE 2 SMART RECOMMENDATIONS & TRACKING TESTS PASSED!');
  console.log('======================================================\n');
}

runPhase2Tests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
