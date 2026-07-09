import type { Metadata } from 'next'
import { SectionHeader } from '@/components/learning/section-header'
import { LessonCard } from '@/components/learning/lesson-card'
import { LevelBadge } from '@/components/learning/level-badge'
import { fetchLearningModules, fetchModuleLessons } from '@/lib/learning/api'
import { SECTION_IDENTITY } from '@/lib/learning/constants'
import type { ApiLessonCard, ApiLearningModule } from '@/lib/learning/types'

export const metadata: Metadata = {
  title: 'Korean Lessons',
  description: 'Structured Korean lessons for Assamese and English speakers — covering Hangul, daily life, grammar, numbers, culture, and more. Each lesson includes vocabulary, grammar points, conversations, and a quiz.',
  keywords: [
    'Korean lessons Assam', 'learn Korean online free', 'Korean language course India',
    'Hangul lessons', 'Korean beginner lessons', 'Korean grammar lessons',
    'learn Korean Assamese medium', 'DKC Korean course',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/lessons' },
  openGraph: {
    title: 'Korean Lessons — Dibrugarh Korean Club',
    description: 'Free structured Korean lessons with Assamese and English support. Vocabulary, grammar, conversations and quizzes included.',
    url: 'https://dibrugarhkoreanclub.com/learn/lessons',
  },
}

export const revalidate = 60

export default async function LessonsPage() {
  const modules = await fetchLearningModules().catch(() => [] as ApiLearningModule[])

  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await fetchModuleLessons(mod.id).catch(() => [] as ApiLessonCard[])
      return { module: mod, lessons }
    })
  )

  const accent = SECTION_IDENTITY.lessons.accent

  return (
    <>
      <SectionHeader
        section="lessons"
        subtitle="Complete structured lessons from beginner to advanced"
      />

      <div style={{ padding: '24px 32px' }}>
        {modulesWithLessons.length === 0 ? (
          <EmptyState message="No lessons published yet. Check back soon!" />
        ) : (
          <div className="flex flex-col gap-10">
            {modulesWithLessons.map(({ module: mod, lessons }) => (
              <section key={mod.id}>
                <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
                      <h2
                        className="font-heading font-semibold"
                        style={{ fontSize: '18px', color: accent }}
                      >
                        {mod.title_en}
                      </h2>
                      <LevelBadge level={mod.level} />
                    </div>
                    <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B' }}>
                      {mod.title_as} · {mod.lesson_count} {mod.lesson_count === 1 ? 'lesson' : 'lessons'}
                    </p>
                  </div>
                </div>

                {lessons.length === 0 ? (
                  <p className="font-sans" style={{ fontSize: '14px', color: '#9CA3AF', padding: '12px 0' }}>
                    No published lessons in this module yet.
                  </p>
                ) : (
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '14px',
                    }}
                  >
                    {lessons.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} moduleAccent={accent} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{ padding: '60px 32px', background: '#FAF3ED', border: '1px solid #E8DCCF' }}
    >
      <p className="font-sans" style={{ fontSize: '15px', color: '#9CA3AF' }}>{message}</p>
    </div>
  )
}
