import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Korean Language Courses',
  description: 'Learn Korean language with Dibrugarh Korean Club. Korean language courses and workshops for beginners and intermediate learners at Dibrugarh University, Assam, India.',
  keywords: [
    'learn Korean language Assam', 'Korean language course Dibrugarh',
    'Korean classes Dibrugarh University', 'Korean for beginners Assam',
    'Korean language workshop India', 'TOPIK preparation Assam',
    'Korean language training Northeast India', 'Hangul learning Assam',
    'Korean speaking course India', 'Korean language certificate Assam',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/courses' },
  openGraph: {
    title: 'Korean Language Courses — Dibrugarh Korean Club',
    description: 'Korean language courses and workshops for beginners and intermediate learners in Assam, India.',
    url: 'https://dibrugarhkoreanclub.com/courses',
  },
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
