'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Mic,
  Code,
  HelpCircle,
  Play,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  Loader2,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import { RolePrepData } from '@/lib/interviewPrepData';

function InterviewPrepContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'technical';

  const [activeTab, setActiveTab] = useState<'technical' | 'common' | 'mock' | 'hr'>(
    (initialTab as any) || 'technical'
  );
  const [selectedRole, setSelectedRole] = useState('frontend');
  const [prepData, setPrepData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock interview state
  const [mockActive, setMockActive] = useState(false);
  const [mockIndex, setMockIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [userMockAnswer, setUserMockAnswer] = useState('');
  const [showKeypoints, setShowKeypoints] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/interview-prep?role=${selectedRole}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData?.success) {
          setPrepData(resData);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedRole]);

  // Mock interview timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mockActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mockActive, timerSeconds]);

  const handleStartMock = () => {
    setMockActive(true);
    setMockIndex(0);
    setTimerSeconds(120);
    setUserMockAnswer('');
    setShowKeypoints(false);
  };

  const handleNextMockQuestion = () => {
    const questions = prepData?.roleData?.mockInterview || [];
    if (mockIndex < questions.length - 1) {
      setMockIndex((prev) => prev + 1);
      setTimerSeconds(120);
      setUserMockAnswer('');
      setShowKeypoints(false);
    } else {
      setMockActive(false);
      alert('Mock interview round completed! Great practice.');
    }
  };

  const role = prepData?.roleData as RolePrepData;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Interview Preparation Hub
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Role-tailored technical questions, common HR scenarios, and interactive mock interview simulator.
            </p>
          </div>

          {/* Role selector dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Role:
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-800 shadow-2xs focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            >
              <option value="frontend">Frontend Developer</option>
              <option value="python">Python Developer</option>
              <option value="data_analyst">Data Analyst</option>
              <option value="machine_learning">Machine Learning</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('technical')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'technical'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Technical Topics ({role?.topics?.length || 5})</span>
          </button>

          <button
            onClick={() => setActiveTab('common')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'common'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common HR & Behavioral</span>
          </button>

          <button
            onClick={() => setActiveTab('mock')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'mock'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Mock Interview Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('hr')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'hr'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>HR Preparation Guides</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Loading interview repository...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: TECHNICAL TOPICS */}
            {activeTab === 'technical' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                      Role Curated Competencies for {role?.role}
                    </h3>
                    <p className="text-xs text-brand-700 mt-0.5">
                      Core skills tested: {role?.skills?.join(' • ')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('mock')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs self-start sm:self-auto hover:bg-brand-700"
                  >
                    <span>Practice in Mock Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {role?.topics?.map((topic, idx) => (
                    <div
                      key={topic.title}
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Topic {idx + 1}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              topic.difficulty === 'Easy'
                                ? 'bg-emerald-50 text-emerald-700'
                                : topic.difficulty === 'Medium'
                                ? 'bg-blue-50 text-brand-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {topic.difficulty}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-2">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">
                          {topic.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Code className="w-3.5 h-3.5 text-brand-600" />
                          <span>{topic.questionCount} Question Bank</span>
                        </span>
                        <button
                          onClick={() => setActiveTab('common')}
                          className="text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Review Questions</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: COMMON HR & BEHAVIORAL QUESTIONS */}
            {activeTab === 'common' && (
              <div className="space-y-4">
                {role?.commonQuestions?.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            q.category === 'Technical'
                              ? 'bg-blue-50 text-brand-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {q.category} Question
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    {/* Sample answer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Model Answer / Recommended Response:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {q.sampleAnswer}
                      </p>
                    </div>

                    {/* Tips */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Key Points to Mention:</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {q.tips?.map((tip, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-medium"
                          >
                            ✓ {tip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: MOCK INTERVIEW SIMULATOR */}
            {activeTab === 'mock' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                {!mockActive ? (
                  <div className="text-center py-10 max-w-lg mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                      <Mic className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Start {role?.role} Mock Interview
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Simulate a live interview experience with 2-minute timed question prompts, real-time response formulation, and keypoint coverage grading.
                      </p>
                    </div>
                    <button
                      onClick={handleStartMock}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Mock Session</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Simulator active header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                          Mock Question {mockIndex + 1} of {role?.mockInterview?.length || 2}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {role?.mockInterview?.[mockIndex]?.question}
                        </h3>
                      </div>

                      {/* Timer */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 font-mono text-sm font-bold text-slate-800">
                        <Clock className="w-4 h-4 text-brand-600" />
                        <span>
                          {Math.floor(timerSeconds / 60)}:
                          {(timerSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Practice Response Field */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Your Spoken / Written Notes:
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Draft or bullet your answer keypoints here to practice articulate delivery..."
                        value={userMockAnswer}
                        onChange={(e) => setUserMockAnswer(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:outline-none focus:border-brand-500 transition-all"
                      />
                    </div>

                    {/* Expected Keypoints reveal */}
                    <div>
                      <button
                        onClick={() => setShowKeypoints(!showKeypoints)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                      >
                        <span>{showKeypoints ? 'Hide Interviewer Evaluation Keypoints' : 'Show Interviewer Evaluation Keypoints'}</span>
                      </button>

                      {showKeypoints && (
                        <div className="mt-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                          <span className="text-xs font-bold text-emerald-900 block">
                            Key Concepts Interviewers Expect:
                          </span>
                          <ul className="space-y-1.5 text-xs text-emerald-800">
                            {role?.mockInterview?.[mockIndex]?.expectedKeypoints?.map((pt, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Next Question / Finish */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setMockActive(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        Exit Mock Session
                      </button>

                      <button
                        onClick={handleNextMockQuestion}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <span>
                          {mockIndex < (role?.mockInterview?.length || 2) - 1
                            ? 'Next Question'
                            : 'Complete Mock Round'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HR PREPARATION GUIDES */}
            {activeTab === 'hr' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(prepData?.hrResources || []).map((resource: any) => (
                  <div
                    key={resource.title}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Framework Guide</span>
                        <span>{resource.readTime}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {resource.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {resource.keyPoints?.map((pt: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium"
                          >
                            {pt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-right">
                      <span className="text-[11px] font-bold text-brand-600">
                        SmartHire Career Strategy ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500 font-medium">Loading interview prep...</p>
          </div>
        </DashboardLayout>
      }
    >
      <InterviewPrepContent />
    </Suspense>
  );
}
