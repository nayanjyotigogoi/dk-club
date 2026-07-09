import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionHeader } from '@/components/learning/section-header'
import { fetchLessons } from '@/lib/learning/api'
import { LevelBadge } from '@/components/learning/level-badge'
import { HelpCircle } from 'lucide-react'
import type { ApiLessonCard } from '@/lib/learning/types'

export const metadata: Metadata = {
  title: 'Practice',
  description: 'Quiz sessions to practise Korean vocabulary and grammar from your lessons.',
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/practice' },
}

export const revalidate = 60

export default async function PracticePage() {
  const lessons = await fetchLessons().catch(() => [] as ApiLessonCard[])
  const withQuiz = lessons.filter((l) => l.quiz_count > 0)

  const accent = '#8B3A1A'
  const tint   = '#F8F0E8'
  const border = '#DFC89A'

  return (
    <>
      <SectionHeader
        section="practice"
        subtitle="Quiz sessions for each lesson — test what you have learned"
      />

      <div style={{ padding: '24px 32px' }}>
        {withQuiz.length === 0 ? (
          <ComingSoon accent={accent} tint={tint} border={border} />
        ) : (
          <>
            <p className="font-sans" style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px' }}>
              Choose a lesson to start a quiz session.
            </p>
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}
            >
              {withQuiz.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/learn/practice/${lesson.slug}`}
                  className="group block rounded-2xl transition-all hover:shadow-md"
                  style={{
                    background: tint,
                    border: `1px solid ${border}`,
                    padding: '20px',
                    textDecoration: 'none',
                  }}
                >
                  <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                    <HelpCircle size={16} color={accent} />
                    <span className="font-sans font-semibold" style={{ fontSize: '12px', color: accent }}>
                      {lesson.quiz_count} questions
                    </span>
                    <LevelBadge level={lesson.level} />
                  </div>
                  <p
                    className="font-heading font-semibold group-hover:underline"
                    style={{ fontSize: '16px', color: '#2B2B2B', marginBottom: '3px' }}
                  >
                    {lesson.title_en}
                  </p>
                  <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B' }}>
                    {lesson.title_as}
                  </p>
                </Link>
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
      <HelpCircle size={40} color={accent} style={{ marginBottom: '16px', opacity: 0.6 }} />
      <p className="font-heading font-semibold" style={{ fontSize: '18px', color: accent, marginBottom: '8px' }}>
        Quiz Practice
      </p>
      <p className="font-sans" style={{ fontSize: '14px', color: '#6B6B6B', maxWidth: '360px', lineHeight: 1.6 }}>
        Interactive quiz sessions will appear here for each published lesson.
        Complete the{' '}
        <Link href="/learn/lessons" style={{ color: accent }}>Lessons</Link>
        {' '}first to unlock practice sessions.
      </p>
    </div>
  )
}
