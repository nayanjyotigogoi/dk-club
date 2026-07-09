import type { Metadata } from 'next'
import { SectionHeader } from '@/components/learning/section-header'
import { GrammarCard } from '@/components/learning/grammar-card'
import { fetchGrammar } from '@/lib/learning/api'
import type { ApiGrammarPoint, LearningLevel } from '@/lib/learning/types'
import { LEVEL_LABELS } from '@/lib/learning/constants'

export const metadata: Metadata = {
  title: 'Korean Grammar Reference',
  description: 'Complete Korean grammar guide with Assamese and English explanations — particles, verb endings, tenses, conjunctions and more. Beginner to intermediate patterns explained simply.',
  keywords: [
    'Korean grammar Assamese', 'Korean particles explained', 'Korean verb endings',
    'Korean tense grammar', 'learn Korean grammar India', 'Korean grammar guide free',
    'Korean 조사 particles', 'Korean sentence structure',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/grammar' },
  openGraph: {
    title: 'Korean Grammar Reference — Dibrugarh Korean Club',
    description: 'Korean grammar patterns explained in Assamese and English. Particles, verb endings, tenses and sentence structure for all levels.',
    url: 'https://dibrugarhkoreanclub.com/learn/grammar',
  },
}

export const revalidate = 60

interface PageProps {
  searchParams: Promise<{ level?: string; category?: string; page?: string }>
}

const CATEGORIES = ['particle', 'verb-ending', 'sentence-structure', 'tense', 'conjunction']

export default async function GrammarPage({ searchParams }: PageProps) {
  const params   = await searchParams
  const level    = (params.level ?? '') as LearningLevel | ''
  const category = params.category ?? ''
  const page     = Number(params.page ?? 1)

  const result = await fetchGrammar({
    level:    level    || undefined,
    category: category || undefined,
    page,
  }).catch(() => ({ data: [] as ApiGrammarPoint[], meta: { current_page: 1, last_page: 1, per_page: 24, total: 0 } }))

  const { data: points, meta } = result

  return (
    <>
      <SectionHeader
        section="grammar"
        subtitle={`${meta.total} grammar points · ব্যাকৰণ নিয়ম`}
      />

      <div style={{ padding: '20px 32px' }}>
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <ChipLink href="/learn/grammar" active={!level && !category} label="All" />
          {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lv) => (
            <ChipLink
              key={lv}
              href={buildHref(lv, category)}
              active={level === lv}
              label={LEVEL_LABELS[lv]}
              color="#3A5C3A"
            />
          ))}
          {CATEGORIES.map((cat) => (
            <ChipLink
              key={cat}
              href={buildHref(level, cat)}
              active={category === cat}
              label={cat.replace(/-/g, ' ')}
              color="#4A5568"
            />
          ))}
        </div>

        {/* Results */}
        {points.length === 0 ? (
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{ padding: '60px 32px', background: '#FAF3ED', border: '1px solid #E8DCCF', marginTop: '20px' }}
          >
            <p className="font-sans" style={{ fontSize: '15px', color: '#9CA3AF' }}>
              No grammar points found for these filters.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4" style={{ marginTop: '20px' }}>
            {points.map((point) => (
              <GrammarCard key={point.id} point={point} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E8DCCF' }}>
            {meta.current_page > 1 && (
              <a href={`/learn/grammar?${buildParams(level, category, meta.current_page - 1)}`} className="font-sans font-medium" style={{ fontSize: '14px', color: '#4A5568', textDecoration: 'none', padding: '6px 16px', background: '#EEF2EE', borderRadius: '8px', border: '1px solid #BDD4BD' }}>
                ← Prev
              </a>
            )}
            <span className="font-sans" style={{ fontSize: '13px', color: '#9CA3AF' }}>
              Page {meta.current_page} of {meta.last_page}
            </span>
            {meta.current_page < meta.last_page && (
              <a href={`/learn/grammar?${buildParams(level, category, meta.current_page + 1)}`} className="font-sans font-medium" style={{ fontSize: '14px', color: '#4A5568', textDecoration: 'none', padding: '6px 16px', background: '#EEF2EE', borderRadius: '8px', border: '1px solid #BDD4BD' }}>
                Next →
              </a>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function buildHref(level: string, category: string) {
  const p = new URLSearchParams()
  if (level)    p.set('level', level)
  if (category) p.set('category', category)
  return `/learn/grammar${p.toString() ? `?${p}` : ''}`
}

function buildParams(level: string, category: string, page: number) {
  const p = new URLSearchParams()
  if (level)    p.set('level', level)
  if (category) p.set('category', category)
  p.set('page', String(page))
  return p.toString()
}

function ChipLink({
  href, active, label, color = '#2B2B2B',
}: {
  href: string; active: boolean; label: string; color?: string
}) {
  return (
    <a
      href={href}
      className="font-sans font-medium inline-block capitalize transition-all"
      style={{
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '999px',
        background: active ? color : '#EEF2EE',
        color: active ? '#FFFFFF' : '#6B6B6B',
        border: active ? `1px solid ${color}` : '1px solid #BDD4BD',
        textDecoration: 'none',
        lineHeight: '20px',
      }}
    >
      {label}
    </a>
  )
}
