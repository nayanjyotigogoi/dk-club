import type { Metadata } from 'next'

// Practice quiz sessions are interactive — noindex, but allow crawl for link equity
export const metadata: Metadata = {
  title: 'Korean Quiz Practice',
  description: 'Practice Korean vocabulary and grammar with interactive quiz sessions for each lesson.',
  robots: { index: false, follow: true },
}

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
