'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiMagazine, type ApiArticle, API_BASE } from '@/lib/api'

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) { key++; continue }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="font-heading font-bold text-[#2B2B2B] text-xl mt-8 mb-3">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="font-heading font-bold text-[#2B2B2B] text-2xl mb-4">
          {trimmed.slice(2)}
        </h1>
      )
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote
          key={key++}
          className="font-sans italic text-[#555] text-sm leading-relaxed pl-4 my-5"
          style={{ borderLeft: '3px solid #8B1E24' }}
        >
          {trimmed.slice(2)}
        </blockquote>
      )
    } else {
      elements.push(
        <p key={key++} className="font-sans text-[#444] text-base leading-relaxed mb-4">
          {trimmed}
        </p>
      )
    }
  }
  return elements
}

export function MagazineIssue({ slug }: { slug: string }) {
  const [issue, setIssue] = useState<ApiMagazine | null>(null)
  const [notFoundState, setNotFoundState] = useState(false)
  const [activeArticle, setActiveArticle] = useState<ApiArticle | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/magazine/${slug}`)
      .then(r => {
        if (!r.ok) { setNotFoundState(true); return null }
        return r.json()
      })
      .then((data: ApiMagazine | null) => {
        if (data) {
          setIssue(data)
          setActiveArticle(data.articles?.[0] ?? null)
        }
      })
      .catch(() => setNotFoundState(true))
  }, [slug])

  if (notFoundState) notFound()
  if (!issue) return null

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        {/* Issue header */}
        <div className="relative overflow-hidden" style={{ background: issue.cover_color }}>
          <span
            className="absolute right-10 top-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none"
            style={{ fontSize: 260, lineHeight: 1, color: issue.cover_accent, opacity: 0.08 }}
          >
            한
          </span>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
            <Link
              href="/magazine"
              className="inline-flex items-center gap-1.5 font-sans text-sm hover:opacity-90 mb-6 transition-opacity"
              style={{ color: `${issue.cover_accent}90` }}
            >
              <ArrowLeft className="w-4 h-4" /> All Issues
            </Link>
            <nav className="flex items-center gap-1 mb-4">
              {[{ label: 'Home', href: '/' }, { label: 'Magazine', href: '/magazine' }, { label: issue.title }].map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: `${issue.cover_accent}40` }} />}
                  {b.href
                    ? <Link href={b.href} className="font-sans text-xs hover:opacity-90" style={{ color: `${issue.cover_accent}60` }}>{b.label}</Link>
                    : <span className="font-sans text-xs" style={{ color: `${issue.cover_accent}90` }}>{b.label}</span>
                  }
                </span>
              ))}
            </nav>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: `${issue.cover_accent}70` }}>
              {issue.issue_label}
            </p>
            <h1 className="font-heading font-bold mb-2" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: issue.cover_accent }}>
              {issue.title}
            </h1>
            <p className="font-sans text-sm" style={{ color: `${issue.cover_accent}70` }}>
              {issue.month} {issue.year} &middot; {issue.page_count} pages &middot; {issue.articles.length} articles
            </p>
          </div>
        </div>

        {/* Reader */}
        <div className="max-w-7xl mx-auto px-6 py-14">
          {(issue.articles?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
              <span
                className="font-korean font-bold select-none mb-6"
                style={{ fontSize: 72, color: '#8B1E24', opacity: 0.1, lineHeight: 1 }}
              >
                한
              </span>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: '#FAF3ED' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#8B1E24' }} />
              </div>
              <p className="font-korean mb-2" style={{ fontSize: 13, color: '#8B1E24', opacity: 0.6 }}>
                아직 출판되지 않았어요
              </p>
              <h2
                className="font-heading font-bold text-[#2B2B2B] mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.2 }}
              >
                We haven&apos;t published this issue yet
              </h2>
              <p className="font-sans leading-relaxed max-w-md mb-8" style={{ color: '#888', fontSize: 15 }}>
                Stay tuned — after launch, you&apos;ll be able to read it right here.
                Our magazine is being crafted with care and will be available soon.
              </p>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 font-sans font-semibold text-white px-7 py-3.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#8B1E24', fontSize: 14 }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Magazine
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Sidebar */}
              <div className="flex-shrink-0 w-full lg:w-64">
                <div className="sticky top-24">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#8B1E24] mb-4">In This Issue</p>
                  <nav className="space-y-2">
                    {issue.articles.map(a => (
                      <button
                        key={a.id}
                        onClick={() => setActiveArticle(a)}
                        className="w-full text-left rounded-xl p-3 transition-all"
                        style={activeArticle?.id === a.id ? { background: '#8B1E24' } : { background: '#fff', border: '1px solid #E8DCCF' }}
                      >
                        <span
                          className="inline-block font-sans text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1"
                          style={activeArticle?.id === a.id ? { background: 'rgba(255,255,255,0.15)', color: '#fff' } : { background: '#FAF3ED', color: '#8B1E24' }}
                        >
                          {a.tag}
                        </span>
                        <p className="font-sans text-sm font-medium leading-snug" style={{ color: activeArticle?.id === a.id ? '#fff' : '#2B2B2B' }}>
                          {a.title}
                        </p>
                        <p className="font-sans text-xs mt-0.5" style={{ color: activeArticle?.id === a.id ? 'rgba(255,255,255,0.6)' : '#999' }}>
                          by {a.author}
                        </p>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Article body */}
              {activeArticle && (
                <motion.article
                  key={activeArticle.id}
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="rounded-2xl p-8 lg:p-12" style={{ background: '#fff', border: '1px solid #E8DCCF' }}>
                    <span
                      className="inline-block font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                      style={{ background: '#FAF3ED', color: '#8B1E24' }}
                    >
                      {activeArticle.tag}
                    </span>
                    <p className="font-sans text-xs text-[#999] mb-6">
                      by <span className="font-medium text-[#555]">{activeArticle.author}</span>
                      &nbsp;&middot;&nbsp;{issue.title}, {issue.month} {issue.year}
                    </p>
                    <div>{renderMarkdown(activeArticle.content)}</div>
                  </div>

                  {(() => {
                    const idx = issue.articles.findIndex(a => a.id === activeArticle.id)
                    const next = issue.articles[idx + 1]
                    if (!next) return null
                    return (
                      <button
                        onClick={() => setActiveArticle(next)}
                        className="mt-6 w-full rounded-2xl p-5 flex items-center justify-between text-left transition-all hover:shadow-md"
                        style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
                      >
                        <div>
                          <p className="font-sans text-xs text-[#999] mb-0.5">Next in this issue</p>
                          <p className="font-heading font-semibold text-[#2B2B2B] text-sm">{next.title}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#8B1E24' }} />
                      </button>
                    )
                  })()}
                </motion.article>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
