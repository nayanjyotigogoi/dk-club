import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LearningNav } from '@/components/learning/learning-nav'

export const metadata: Metadata = {
  title: {
    default: 'Learn Korean — Dibrugarh Korean Club',
    template: '%s | Learn Korean — DKC',
  },
  description:
    'Learn Korean with Assamese and English — structured lessons, vocabulary, grammar, conversations, and practice quizzes from Dibrugarh Korean Club.',
  keywords: [
    'learn Korean Assam', 'Korean lessons Assamese', 'Korean vocabulary Assamese',
    'Korean grammar Assam', 'Korean conversation practice', 'DKC learning platform',
    'Korean language Dibrugarh University',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn' },
  openGraph: {
    title: 'Learn Korean — Dibrugarh Korean Club',
    description:
      'Structured Korean lessons with Assamese and English — vocabulary, grammar, conversations, and practice from DKC.',
    url: 'https://dibrugarhkoreanclub.com/learn',
  },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />

      {/* Top padding compensates for the fixed Navbar (~84px) */}
      <div className="flex min-h-screen" style={{ paddingTop: '84px' }}>
        <LearningNav />

        {/* Main content area */}
        <main
          className="flex-1 min-w-0"
          style={{
            background: '#FAF6F0',
            // On mobile, add bottom padding so content isn't hidden behind tab bar
            paddingBottom: 'max(env(safe-area-inset-bottom), 64px)',
          }}
        >
          {children}
        </main>
      </div>

      <Footer />
    </>
  )
}
