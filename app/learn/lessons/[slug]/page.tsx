import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchLesson } from '@/lib/learning/api'
import { SectionHeader } from '@/components/learning/section-header'
import { LevelBadge } from '@/components/learning/level-badge'
import { VocabularyCard } from '@/components/learning/vocabulary-card'
import { GrammarCard } from '@/components/learning/grammar-card'
import { ConversationCard } from '@/components/learning/conversation-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SECTION_IDENTITY } from '@/lib/learning/constants'
import type { ApiLesson } from '@/lib/learning/types'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lesson = await fetchLesson(slug).catch(() => null)
  if (!lesson) return { title: 'Lesson not found' }

  const vocabCount  = lesson.vocabulary.length
  const grammarCount = lesson.grammar.length
  const convCount   = lesson.conversations.length
  const quizCount   = lesson.quiz_questions?.length ?? 0

  const parts: string[] = []
  if (vocabCount)  parts.push(`${vocabCount} vocabulary words`)
  if (grammarCount) parts.push(`${grammarCount} grammar points`)
  if (convCount)   parts.push(`${convCount} conversations`)
  if (quizCount)   parts.push(`${quizCount} quiz questions`)

  const description = lesson.title_as
    ? `${lesson.title_en} (${lesson.title_as}) — Korean lesson with ${parts.join(', ')}. Explanations in Assamese and English.`
    : `${lesson.title_en} — Korean lesson with ${parts.join(', ')}. Explanations in Assamese and English.`

  return {
    title: lesson.title_en,
    description,
    keywords: [
      `Korean ${lesson.title_en.toLowerCase()} lesson`,
      `${lesson.title_en} Korean Assamese`,
      `learn Korean ${lesson.title_en.toLowerCase()}`,
      'Korean lesson Dibrugarh',
      'Korean learning Assam',
    ],
    alternates: { canonical: `https://dibrugarhkoreanclub.com/learn/lessons/${slug}` },
    openGraph: {
      title: `${lesson.title_en} — Korean Lesson | Dibrugarh Korean Club`,
      description,
      url: `https://dibrugarhkoreanclub.com/learn/lessons/${slug}`,
      type: 'article',
    },
  }
}

export default async function LessonDetailPage({ params }: Props) {
  const { slug } = await params
  const lesson: ApiLesson | null = await fetchLesson(slug).catch(() => null)

  if (!lesson) notFound()

  const accent = SECTION_IDENTITY.lessons.accent
  const tint   = SECTION_IDENTITY.lessons.tint

  return (
    <>
      <SectionHeader section="lessons" title={lesson.title_en} subtitle={lesson.title_as} />

      <div style={{ padding: '24px 32px' }}>
        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: '28px' }}>
          <LevelBadge level={lesson.level} />
          {lesson.module && (
            <span className="font-sans" style={{ fontSize: '13px', color: '#9CA3AF' }}>
              {lesson.module.title_en}
            </span>
          )}
          {lesson.published_at && (
            <span className="font-sans" style={{ fontSize: '12px', color: '#C5B9A8' }}>
              {new Date(lesson.published_at).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Vocabulary section */}
        {lesson.vocabulary.length > 0 && (
          <ContentSection title="어휘 · শব্দভাণ্ডাৰ · Vocabulary" accent={accent} tint={tint}>
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}
            >
              {lesson.vocabulary.map((entry) => (
                <VocabularyCard key={entry.id} entry={entry} />
              ))}
            </div>
          </ContentSection>
        )}

        {/* Grammar section */}
        {lesson.grammar.length > 0 && (
          <ContentSection title="문법 · ব্যাকৰণ · Grammar" accent={accent} tint={tint}>
            <div className="flex flex-col gap-4">
              {lesson.grammar.map((point) => (
                <GrammarCard key={point.id} point={point} />
              ))}
            </div>
          </ContentSection>
        )}

        {/* Conversations section */}
        {lesson.conversations.length > 0 && (
          <ContentSection title="대화 · কথোপকথন · Conversations" accent={accent} tint={tint}>
            <div className="flex flex-col gap-4">
              {lesson.conversations.map((conv) => (
                <ConversationCard key={conv.id} conversation={conv} />
              ))}
            </div>
          </ContentSection>
        )}

        {/* Cultural notes */}
        {lesson.cultural_notes && lesson.cultural_notes.length > 0 && (
          <ContentSection title="문화 · সাংস্কৃতিক টোকা · Cultural Notes" accent={accent} tint={tint}>
            <div className="flex flex-col gap-4">
              {lesson.cultural_notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl"
                  style={{ background: '#FAF3ED', border: '1px solid #E8DCCF', padding: '20px' }}
                >
                  <p className="font-heading font-semibold" style={{ fontSize: '16px', color: '#2B2B2B', marginBottom: '10px' }}>
                    {note.title_as}
                    <span className="font-sans font-normal" style={{ fontSize: '14px', color: '#6B6B6B', marginLeft: '8px' }}>
                      {note.title_en}
                    </span>
                  </p>
                  <p className="font-sans" style={{ fontSize: '14px', color: '#2B2B2B', lineHeight: 1.65 }}>
                    {note.body_as}
                  </p>
                  {note.body_en && (
                    <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6, marginTop: '8px' }}>
                      {note.body_en}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ContentSection>
        )}

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between gap-4" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E8DCCF' }}>
          {lesson.prev_lesson ? (
            <Link
              href={`/learn/lessons/${lesson.prev_lesson.slug}`}
              className="flex items-center gap-2 group rounded-xl"
              style={{
                background: tint,
                border: `1px solid ${SECTION_IDENTITY.lessons.border}`,
                padding: '12px 16px',
                textDecoration: 'none',
                maxWidth: '45%',
              }}
            >
              <ChevronLeft size={16} color={accent} />
              <div>
                <p className="font-sans" style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>Previous</p>
                <p className="font-sans font-medium group-hover:underline" style={{ fontSize: '13px', color: accent }}>
                  {lesson.prev_lesson.title_en}
                </p>
              </div>
            </Link>
          ) : <div />}

          {lesson.next_lesson ? (
            <Link
              href={`/learn/lessons/${lesson.next_lesson.slug}`}
              className="flex items-center gap-2 group rounded-xl"
              style={{
                background: tint,
                border: `1px solid ${SECTION_IDENTITY.lessons.border}`,
                padding: '12px 16px',
                textDecoration: 'none',
                maxWidth: '45%',
                textAlign: 'right',
              }}
            >
              <div>
                <p className="font-sans" style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>Next</p>
                <p className="font-sans font-medium group-hover:underline" style={{ fontSize: '13px', color: accent }}>
                  {lesson.next_lesson.title_en}
                </p>
              </div>
              <ChevronRight size={16} color={accent} />
            </Link>
          ) : <div />}
        </div>
      </div>
    </>
  )
}

function ContentSection({
  title, accent, tint, children,
}: {
  title: string
  accent: string
  tint: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <div
        className="flex items-center gap-3"
        style={{ marginBottom: '16px', paddingBottom: '10px', borderBottom: `2px solid ${tint}` }}
      >
        <h2
          className="font-heading font-semibold"
          style={{ fontSize: '16px', color: accent, letterSpacing: '0.01em' }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
