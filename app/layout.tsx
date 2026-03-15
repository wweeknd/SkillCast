import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillCast — Find Your Dream Team',
  description: 'SkillCast is the team matchmaking platform for builders. Find projects that need your skills, or recruit talent for your idea. Connect with developers, designers, artists, writers, and founders.',
  keywords: 'team collaboration, find developers, startup team, project matching, builder platform, skills marketplace',
  openGraph: {
    title: 'SkillCast — Find Your Dream Team',
    description: 'Match your skills to real projects. Build things that matter.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
