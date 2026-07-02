'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ExternalLink, BookOpen, ChevronRight, Loader2, FileText, Link2, Download, PenLine } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiResource, API_BASE } from '@/lib/api'

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; accent: string; description: string }> = {
  'study-materials': { label: 'Study Materials',    icon: '📚', color: '#0F2240', accent: '#E8F0FA', description: 'Curated study guides, notes and learning paths for Korean learners at every level.' },
  'vocabulary':      { label: 'Vocabulary Lists',   icon: '🗂️', color: '#1A4731', accent: '#E8F5ED', description: 'Topical word lists, TOPIK vocabulary packs and daily word sets.' },
  'grammar':         { label: 'Grammar Guide',      icon: '📝', color: '#3B1A00', accent: '#FEF3E2', description: 'Clear explanations of Korean grammar patterns from basic particles to advanced structures.' },
  'korean-culture':  { label: 'Korean Culture',     icon: '🎭', color: '#8B1E24', accent: '#FAF3ED', description: 'Articles, essays and guides exploring Korean history, traditions, film, food and modern culture.' },
  'practice':        { label: 'Practice Exercises', icon: '✏️', color: '#2D1B69', accent: '#EDE9FE', description: 'Interactive drills, reading passages, listening exercises and writing prompts.' },
  'books':           { label: 'Recommended Books',  icon: '📖', color: '#1A3A2A', accent: '#ECFDF5', description: "DKC's curated reading list — textbooks, novels, webtoons and reference works." },
  'links':           { label: 'Useful Links',       icon: '🔗', color: '#1A1A2E', accent: '#E8E8FA', description: 'The best external websites, apps, YouTube channels and tools for learning Korean.' },
}

const DIFFICULTY_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  beginner:     { label: 'Beginner',     bg: '#DCFCE7', color: '#16a34a' },
  intermediate: { label: 'Intermediate', bg: '#FEF3C7', color: '#d97706' },
  advanced:     { label: 'Advanced',     bg: '#FEE2E2', color: '#dc2626' },
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  article:  <FileText className="w-4 h-4" />,
  link:     <Link2 className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  exercise: <PenLine className="w-4 h-4" />,
}

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { key++; continue }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={key++} className="font-heading font-bold text-[#2B2B2B] text-xl mt-8 mb-3">{trimmed.slice(3)}</h2>)
    } else if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={key++} className="font-heading font-bold text-[#2B2B2B] text-2xl mb-4">{trimmed.slice(2)}</h1>)
    } else if (trimmed.startsWith('> ')) {
      elements.push(<blockquote key={key++} className="font-sans italic text-[#555] text-sm leading-relaxed pl-4 my-5" style={{ borderLeft: '3px solid #8B1E24' }}>{trimmed.slice(2)}</blockquote>)
    } else {
      elements.push(<p key={key++} className="font-sans text-[#444] text-base leading-relaxed mb-4">{trimmed}</p>)
    }
  }
  return elements
}

export function ResourceCategory({ category }: { category: string }) {
  const meta = CATEGORY_META[category]

  const [resources, setResources] = useState<ApiResource[]>([])
  const [active, setActive] = useState<ApiResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    if (!meta) { setNotFoundState(true); return }
    fetch(`${API_BASE}/resources?category=${category}`)
      .then(r => r.json())
      .then((data: ApiResource[]) => { setResources(data); setActive(data[0] ?? null) })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false))
  }, [category, meta])

  if (notFoundState) notFound()
  if (!meta) return null

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0', minHeight: '100vh' }}>

        {/* Category header */}
        <div className="relative overflow-hidden" style={{ background: meta.color }}>
          <span
            className="absolute right-8 top-1/2 -translate-y-1/2 font-sans font-bold select-none pointer-events-none text-[200px] leading-none"
            style={{ color: meta.accent, opacity: 0.06 }}
          >
            {meta.icon}
          </span>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
            <Link href="/resources" className="inline-flex items-center gap-1.5 font-sans text-sm mb-5 transition-opacity hover:opacity-80" style={{ color: `${meta.accent}90` }}>
              <ArrowLeft className="w-4 h-4" /> All Resources
            </Link>
            <nav className="flex items-center gap-1 mb-4 flex-wrap">
              {[{ label: 'Home', href: '/' }, { label: 'Resources', href: '/resources' }, { label: meta.label }].map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: `${meta.accent}40` }} />}
                  {b.href
                    ? <Link href={b.href} className="font-sans text-xs hover:opacity-90" style={{ color: `${meta.accent}60` }}>{b.label}</Link>
                    : <span className="font-sans text-xs" style={{ color: `${meta.accent}90` }}>{b.label}</span>
                  }
                </span>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{meta.icon}</span>
              <div>
                <h1 className="font-heading font-bold mb-1" style={{ fontSize: 'clamp(24px,3vw,40px)', color: meta.accent }}>
                  {meta.label}
                </h1>
                <p className="font-sans text-sm" style={{ color: `${meta.accent}70` }}>{meta.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#8B1E24' }} />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FAF3ED' }}>
                <BookOpen className="w-7 h-7" style={{ color: '#8B1E24' }} />
              </div>
              <p className="font-heading font-bold text-[#2B2B2B] text-lg mb-2">Coming Soon</p>
              <p className="font-sans text-[#888] text-sm mb-6">Resources for this category will be published shortly.</p>
              <Link href="/resources" className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-white px-6 py-3 rounded-full" style={{ background: '#8B1E24' }}>
                <ArrowLeft className="w-4 h-4" /> Browse all categories
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="flex-shrink-0 w-full lg:w-72">
                <div className="sticky top-24">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#8B1E24' }}>
                    {resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}
                  </p>
                  <nav className="space-y-2">
                    {resources.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setActive(r)}
                        className="w-full text-left rounded-xl p-3.5 transition-all"
                        style={active?.id === r.id ? { background: meta.color } : { background: '#fff', border: '1px solid #E8DCCF' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: active?.id === r.id ? meta.accent : '#8B1E24', opacity: 0.8 }}>
                            {TYPE_ICON[r.type]}
                          </span>
                          {r.difficulty && DIFFICULTY_BADGE[r.difficulty] && (
                            <span
                              className="inline-block font-sans text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                              style={active?.id === r.id
                                ? { background: 'rgba(255,255,255,0.15)', color: meta.accent }
                                : { background: DIFFICULTY_BADGE[r.difficulty].bg, color: DIFFICULTY_BADGE[r.difficulty].color }
                              }
                            >
                              {DIFFICULTY_BADGE[r.difficulty].label}
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-sm font-medium leading-snug" style={{ color: active?.id === r.id ? meta.accent : '#2B2B2B' }}>
                          {r.title}
                        </p>
                        {r.author && (
                          <p className="font-sans text-xs mt-0.5" style={{ color: active?.id === r.id ? `${meta.accent}70` : '#999' }}>
                            by {r.author}
                          </p>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main content */}
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    className="flex-1 min-w-0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-2xl p-8 lg:p-12" style={{ background: '#fff', border: '1px solid #E8DCCF' }}>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
                          style={{ background: meta.accent, color: meta.color }}
                        >
                          {TYPE_ICON[active.type]}
                          {active.type === 'link' ? 'External Link' : active.type === 'exercise' ? 'Exercise' : active.type === 'download' ? 'Download' : 'Article'}
                        </span>
                        {active.difficulty && DIFFICULTY_BADGE[active.difficulty] && (
                          <span
                            className="font-sans text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: DIFFICULTY_BADGE[active.difficulty].bg, color: DIFFICULTY_BADGE[active.difficulty].color }}
                          >
                            {DIFFICULTY_BADGE[active.difficulty].label}
                          </span>
                        )}
                      </div>
                      <h1 className="font-heading font-bold text-[#2B2B2B] text-2xl lg:text-3xl mb-2">{active.title}</h1>
                      {active.author && (
                        <p className="font-sans text-xs text-[#999] mb-1">
                          by <span className="font-medium text-[#555]">{active.author}</span>&nbsp;&middot;&nbsp;{meta.label}
                        </p>
                      )}
                      {active.description && (
                        <p className="font-sans text-sm text-[#666] mt-3 mb-6 pb-6 leading-relaxed" style={{ borderBottom: '1px solid #E8DCCF' }}>
                          {active.description}
                        </p>
                      )}
                      {active.type === 'link' && active.url && (
                        <a href={active.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-white px-6 py-3 rounded-full transition-all hover:opacity-90 mt-2"
                          style={{ background: meta.color }}
                        >
                          Visit Site <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {active.content && <div className="mt-2">{renderMarkdown(active.content)}</div>}
                    </div>

                    {(() => {
                      const idx = resources.findIndex(r => r.id === active.id)
                      const next = resources[idx + 1]
                      if (!next) return null
                      return (
                        <button
                          onClick={() => setActive(next)}
                          className="mt-6 w-full rounded-2xl p-5 flex items-center justify-between text-left transition-all hover:shadow-md"
                          style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
                        >
                          <div>
                            <p className="font-sans text-xs text-[#999] mb-0.5">Next resource</p>
                            <p className="font-heading font-semibold text-[#2B2B2B] text-sm">{next.title}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#8B1E24' }} />
                        </button>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
