import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { DesktopSidebar, MobileNav } from '@/components/learning/learning-nav'

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

      <div style={{ paddingTop: '84px', minHeight: '100vh', background: '#FAF6F0', display: 'flex' }}>

        {/* Desktop sidebar — flex child, 220px wide, hidden on mobile */}
        <DesktopSidebar />

        {/* Right column — flex child, takes remaining width */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Mobile sticky nav — stacks above main on small screens, hidden on md+ */}
          <MobileNav />

          {/* Page content */}
          <main
            className="flex-1"
            style={{
              background: '#FAF6F0',
              padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 36px)',
            }}
          >
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </>
  )
}
