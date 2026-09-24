import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartHire | Jobs & Internships for Students and Freshers',
  description:
    'Find jobs and internships for students and freshers. Build your profile, upload your resume, apply for opportunities, and track your applications.',
  keywords: [
    'internships',
    'student jobs',
    'fresher jobs',
    'college placements',
    'entry level jobs',
    'career portal',
    'tech internships',
  ],
  authors: [{ name: 'SmartHire' }],
  openGraph: {
    title: 'SmartHire | Jobs & Internships for Students and Freshers',
    description:
      'Find jobs and internships for students and freshers. Build your profile, upload your resume, apply for opportunities, and track your applications.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SmartHire',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
