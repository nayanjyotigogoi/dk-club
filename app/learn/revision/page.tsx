import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionHeader } from '@/components/learning/section-header'
import { fetchLearningModules } from '@/lib/learning/api'
import { LevelBadge } from '@/components/learning/level-badge'
import { RefreshCw } from 'lucide-react'
import type { ApiLearningModule } from '@/lib/learning/types'

export const metadata: Metadata = {
  title: 'Revision',
  description: 'Flashcard revision sessions for all vocabulary in each module.',
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/revision' },
}

export const revalidate = 60

export default async function RevisionPage() {
  const modules = await fetchLearningModules().catch(() => [] as ApiLearningModule[])

  const accent = '#4A3A6B'
  const tint   = '#F0EEF8'
  const border = '#C5BFDF'

  return (
    <>
      <SectionHeader
        section="revision"
        subtitle="Flashcard sessions — review all vocabulary by module"
      />

      <div style={{ padding: '24px 32px' }}>
        {modules.length === 0 ? (
          <ComingSoon accent={accent} tint={tint} border={border} />
        ) : (
          <>
            <p className="font-sans" style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px' }}>
              Choose a module to start a flashcard revision session.
            </p>
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}
            >
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-2xl"
                  style={{
                    background: tint,
                    border: `1px solid ${border}`,
                    padding: '20px',
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                    <RefreshCw size={16} color={accent} />
                    <span className="font-sans font-semibold" style={{ fontSize: '12px', color: accent }}>
                      {mod.lesson_count} {mod.lesson_count === 1 ? 'lesson' : 'lessons'}
                    </span>
                    <LevelBadge level={mod.level} />
                  </div>
                  <p className="font-heading font-semibold" style={{ fontSize: '16px', color: '#2B2B2B', marginBottom: '3px' }}>
                    {mod.title_en}
                  </p>
                  <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '14px' }}>
                    {mod.title_as}
                  </p>
                  <Link
                    href={`/learn/revision/${mod.id}`}
                    className="font-sans font-medium inline-block rounded-lg transition-all hover:opacity-80"
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      background: 'rgba(74,58,107,0.12)',
                      color: accent,
                      textDecoration: 'none',
                    }}
                  >
                    Start Flashcards →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

function ComingSoon({
  accent, tint, border,
}: {
  accent: string; tint: string; border: string
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl text-center"
      style={{ padding: '60px 32px', background: tint, border: `1px solid ${border}` }}
    >
      <RefreshCw size={40} color={accent} style={{ marginBottom: '16px', opacity: 0.6 }} />
      <p className="font-heading font-semibold" style={{ fontSize: '18px', color: accent, marginBottom: '8px' }}>
        Flashcard Revision
      </p>
      <p className="font-sans" style={{ fontSize: '14px', color: '#6B6B6B', maxWidth: '360px', lineHeight: 1.6 }}>
        Interactive flashcard sessions will be available here once modules are published.
        Start with{' '}
        <Link href="/learn/lessons" style={{ color: accent }}>Lessons</Link>
        {' '}to build your vocabulary base.
      </p>
    </div>
  )
}
