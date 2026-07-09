import type { Metadata } from 'next'
import { SectionHeader } from '@/components/learning/section-header'
import { VocabularyCard } from '@/components/learning/vocabulary-card'
import { fetchVocabulary } from '@/lib/learning/api'
import type { ApiVocabularyEntry, LearningLevel, PartOfSpeech } from '@/lib/learning/types'
import { LEVEL_LABELS } from '@/lib/learning/constants'

export const metadata: Metadata = {
  title: 'Korean–Assamese–English Dictionary',
  description: 'Free Korean vocabulary dictionary with Assamese and English translations, romanization, example sentences, and part-of-speech labels. The only Korean–Assamese word reference online.',
  keywords: [
    'Korean Assamese dictionary', 'Korean vocabulary Assamese', 'Korean words Assamese translation',
    'Korean English dictionary India', 'Korean vocabulary list free', 'Hangul words with meaning',
    'Korean Assamese glossary', 'Korean vocabulary beginners',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/dictionary' },
  openGraph: {
    title: 'Korean–Assamese–English Dictionary — Dibrugarh Korean Club',
    description: 'The only free Korean–Assamese vocabulary dictionary online, with romanization and English translations.',
    url: 'https://dibrugarhkoreanclub.com/learn/dictionary',
  },
}

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ level?: string; pos?: string; page?: string }>
}

const PARTS_OF_SPEECH: PartOfSpeech[] = [
  'noun', 'verb', 'adjective', 'adverb', 'particle',
  'conjunction', 'interjection', 'pronoun', 'number', 'expression',
]

const LEVELS: LearningLevel[] = ['beginner', 'intermediate', 'advanced']

export default async function DictionaryPage({ searchParams }: PageProps) {
  const params = await searchParams
  const level  = (params.level ?? '') as LearningLevel | ''
  const pos    = params.pos ?? ''
  const page   = Number(params.page ?? 1)

  const result = await fetchVocabulary({
    level:          level || undefined,
    part_of_speech: pos   || undefined,
    page,
    per_page:       24,
  }).catch(() => ({ data: [] as ApiVocabularyEntry[], meta: { current_page: 1, last_page: 1, per_page: 24, total: 0 } }))

  const { data: entries, meta } = result

  return (
    <>
      <SectionHeader
        section="dictionary"
        subtitle={`${meta.total} entries · Korean–অসমীয়া–English`}
      />

      <div style={{ padding: '20px 32px' }}>
        {/* Filter bar */}
        <FilterBar currentLevel={level} currentPos={pos} currentPage={page} />

        {/* Results */}
        {entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '14px',
                marginTop: '20px',
              }}
            >
              {entries.map((entry) => (
                <VocabularyCard key={entry.id} entry={entry} />
              ))}
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <Pagination meta={meta} level={level} pos={pos} />
            )}
          </>
        )}
      </div>
    </>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  currentLevel, currentPos, currentPage,
}: {
  currentLevel: string; currentPos: string; currentPage: number
}) {
  const LEVELS: LearningLevel[] = ['beginner', 'intermediate', 'advanced']
  const PARTS: PartOfSpeech[]   = ['noun', 'verb', 'adjective', 'adverb', 'expression']

  function href(level: string, pos: string) {
    const p = new URLSearchParams()
    if (level) p.set('level', level)
    if (pos)   p.set('pos', pos)
    return `/learn/dictionary${p.toString() ? `?${p}` : ''}`
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* All */}
      <ChipLink href="/learn/dictionary" active={!currentLevel && !currentPos} label="All" />

      {/* Levels */}
      {LEVELS.map((lv) => (
        <ChipLink
          key={lv}
          href={href(lv, currentPos)}
          active={currentLevel === lv}
          label={LEVEL_LABELS[lv]}
          color="#3A5C3A"
        />
      ))}

      {/* Parts of speech */}
      {PARTS.map((p) => (
        <ChipLink
          key={p}
          href={href(currentLevel, p)}
          active={currentPos === p}
          label={p.charAt(0).toUpperCase() + p.slice(1)}
          color="#6B5C3E"
        />
      ))}
    </div>
  )
}

function ChipLink({
  href, active, label, color = '#2B2B2B',
}: {
  href: string; active: boolean; label: string; color?: string
}) {
  return (
    <a
      href={href}
      className="font-sans font-medium inline-block transition-all"
      style={{
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '999px',
        background: active ? color : '#F4F0E8',
        color: active ? '#FFFFFF' : '#6B6B6B',
        border: active ? `1px solid ${color}` : '1px solid #E8DCCF',
        textDecoration: 'none',
        lineHeight: '20px',
      }}
    >
      {label}
    </a>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  meta, level, pos,
}: {
  meta: { current_page: number; last_page: number }
  level: string; pos: string
}) {
  function pageHref(p: number) {
    const q = new URLSearchParams()
    if (level) q.set('level', level)
    if (pos)   q.set('pos', pos)
    q.set('page', String(p))
    return `/learn/dictionary?${q}`
  }

  return (
    <div className="flex items-center justify-center gap-2" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8DCCF' }}>
      {meta.current_page > 1 && (
        <a href={pageHref(meta.current_page - 1)} className="font-sans font-medium" style={{ fontSize: '14px', color: '#6B5C3E', textDecoration: 'none', padding: '6px 16px', background: '#F4F0E8', borderRadius: '8px', border: '1px solid #E8DCCF' }}>
          ← Prev
        </a>
      )}
      <span className="font-sans" style={{ fontSize: '13px', color: '#9CA3AF' }}>
        Page {meta.current_page} of {meta.last_page}
      </span>
      {meta.current_page < meta.last_page && (
        <a href={pageHref(meta.current_page + 1)} className="font-sans font-medium" style={{ fontSize: '14px', color: '#6B5C3E', textDecoration: 'none', padding: '6px 16px', background: '#F4F0E8', borderRadius: '8px', border: '1px solid #E8DCCF' }}>
          Next →
        </a>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{ padding: '60px 32px', background: '#FAF3ED', border: '1px solid #E8DCCF', marginTop: '20px' }}
    >
      <p className="font-sans" style={{ fontSize: '15px', color: '#9CA3AF' }}>
        No vocabulary found for these filters.
      </p>
    </div>
  )
}
