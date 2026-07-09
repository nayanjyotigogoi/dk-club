import type { Metadata } from 'next'
import { SectionHeader } from '@/components/learning/section-header'
import { ConversationCard } from '@/components/learning/conversation-card'
import { fetchConversations } from '@/lib/learning/api'
import type { ApiConversation, LearningLevel } from '@/lib/learning/types'
import { LEVEL_LABELS } from '@/lib/learning/constants'

export const metadata: Metadata = {
  title: 'Korean Conversations & Dialogues',
  description: 'Real-life Korean dialogues with Assamese and English translations. Practice restaurant ordering, shopping, directions, and daily conversations with line-by-line breakdowns.',
  keywords: [
    'Korean conversations Assamese', 'Korean dialogues for beginners', 'Korean daily conversations',
    'learn Korean speaking practice', 'Korean role-play dialogues', 'Korean dialogue Assam',
    'Korean conversation practice free', 'Korean situational dialogues',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/conversations' },
  openGraph: {
    title: 'Korean Conversations & Dialogues — Dibrugarh Korean Club',
    description: 'Practical Korean dialogues for real-life situations — with Assamese and English translations and line-by-line breakdowns.',
    url: 'https://dibrugarhkoreanclub.com/learn/conversations',
  },
}

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ level?: string; page?: string }>
}

export default async function ConversationsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const level  = (params.level ?? '') as LearningLevel | ''
  const page   = Number(params.page ?? 1)

  const result = await fetchConversations({
    level: level || undefined,
    page,
  }).catch(() => ({ data: [] as ApiConversation[], meta: { current_page: 1, last_page: 1, per_page: 24, total: 0 } }))

  const { data: conversations, meta } = result

  return (
    <>
      <SectionHeader
        section="conversations"
        subtitle={`${meta.total} dialogues · কথোপকথন সমূহ`}
      />

      <div style={{ padding: '20px 32px' }}>
        {/* Level filters */}
        <div className="flex flex-wrap gap-2">
          <ChipLink href="/learn/conversations" active={!level} label="All levels" />
          {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lv) => (
            <ChipLink
              key={lv}
              href={`/learn/conversations?level=${lv}`}
              active={level === lv}
              label={LEVEL_LABELS[lv]}
            />
          ))}
        </div>

        {/* Results */}
        {conversations.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{ padding: '60px 32px', background: '#FAF3ED', border: '1px solid #E8DCCF', marginTop: '20px' }}
          >
            <p className="font-sans" style={{ fontSize: '15px', color: '#9CA3AF' }}>
              No conversations found. Check back soon!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4" style={{ marginTop: '20px' }}>
            {conversations.map((conv) => (
              <ConversationCard key={conv.id} conversation={conv} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8DCCF' }}>
            {meta.current_page > 1 && (
              <a
                href={`/learn/conversations?${new URLSearchParams({ ...(level ? { level } : {}), page: String(meta.current_page - 1) })}`}
                className="font-sans font-medium"
                style={{ fontSize: '14px', color: '#2D5F7A', textDecoration: 'none', padding: '6px 16px', background: '#EBF3F8', borderRadius: '8px', border: '1px solid #B5D4E8' }}
              >
                ← Prev
              </a>
            )}
            <span className="font-sans" style={{ fontSize: '13px', color: '#9CA3AF' }}>
              Page {meta.current_page} of {meta.last_page}
            </span>
            {meta.current_page < meta.last_page && (
              <a
                href={`/learn/conversations?${new URLSearchParams({ ...(level ? { level } : {}), page: String(meta.current_page + 1) })}`}
                className="font-sans font-medium"
                style={{ fontSize: '14px', color: '#2D5F7A', textDecoration: 'none', padding: '6px 16px', background: '#EBF3F8', borderRadius: '8px', border: '1px solid #B5D4E8' }}
              >
                Next →
              </a>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function ChipLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <a
      href={href}
      className="font-sans font-medium inline-block transition-all"
      style={{
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '999px',
        background: active ? '#2D5F7A' : '#EBF3F8',
        color: active ? '#FFFFFF' : '#6B6B6B',
        border: active ? '1px solid #2D5F7A' : '1px solid #B5D4E8',
        textDecoration: 'none',
        lineHeight: '20px',
      }}
    >
      {label}
    </a>
  )
}
