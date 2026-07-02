'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowRight, FileText, Calendar, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiMagazine, API_BASE } from '@/lib/api'

// Month number → short name
const MONTH_NAME: Record<number, string> = {
  1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',
  7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec',
}

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<ApiMagazine[]>([])
  const [activeYear, setActiveYear] = useState<number | 'all'>('all')

  useEffect(() => {
    fetch(`${API_BASE}/magazine`)
      .then(r => r.json())
      .then((data: ApiMagazine[]) => setMagazines(data))
      .catch(() => {})
  }, [])

  const featured = magazines.find(m => m.is_featured) ?? magazines[0]
  const years    = [...new Set(magazines.map(m => m.year))].sort((a, b) => b - a)
  const archive  = magazines.filter(m => m.slug !== featured?.slug)
  const visible  = activeYear === 'all' ? archive : archive.filter(m => m.year === activeYear)

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#F5EFE8' }}>

        {/* ── Editorial masthead ─────────────────────────────────────── */}
        <section style={{ background: '#1A1008', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-end gap-6 md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#8B1E24' }}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="font-sans text-xs font-bold uppercase tracking-[3px] text-white/40">DKC Publication</span>
              </div>
              <h1 className="font-heading font-bold text-white leading-none mb-3" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
                한국 매거진
              </h1>
              <p className="font-sans text-sm text-white/40 max-w-md leading-relaxed">
                Student-written stories, cultural essays, language notes and member spotlights — published every semester from Dibrugarh University.
              </p>
            </div>
            <div className="flex items-center gap-8 flex-shrink-0">
              {[
                { num: magazines.length, label: 'Issues' },
                { num: magazines.reduce((s, m) => s + (m.page_count ?? 0), 0) + '+', label: 'Pages Published' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-heading font-bold text-white text-3xl leading-none">{s.num}</p>
                  <p className="font-sans text-xs text-white/30 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured issue ─────────────────────────────────────────── */}
        {featured && (
          <section className="max-w-7xl mx-auto px-6 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1" style={{ background: '#D4C4B0' }} />
              <span className="font-sans text-xs font-bold uppercase tracking-[3px] text-[#8B1E24]">Latest Issue</span>
              <div className="h-px flex-1" style={{ background: '#D4C4B0' }} />
            </div>

            <Link href={`/magazine/${featured.slug}`} style={{ pointerEvents: (featured.articles?.length ?? 0) === 0 ? 'none' : 'auto' }}>
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 rounded-2xl overflow-hidden cursor-pointer"
                style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.12)' }}
                whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
                transition={{ duration: 0.3 }}
              >
                {/* ── Magazine cover (portrait) ── */}
                <div
                  className="relative overflow-hidden flex flex-col justify-between p-8"
                  style={{ background: featured.cover_color, minHeight: 420 }}
                >
                  {/* Top bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[3px] mb-1" style={{ color: `${featured.cover_accent}60` }}>
                        Dibrugarh Korean Club
                      </p>
                      <p className="font-sans text-xs font-semibold" style={{ color: `${featured.cover_accent}80` }}>
                        {featured.issue_label}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${featured.cover_accent}20` }}
                    >
                      <BookOpen className="w-4 h-4" style={{ color: featured.cover_accent }} />
                    </div>
                  </div>

                  {/* Big Korean watermark */}
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none leading-none"
                    style={{ fontSize: 220, color: featured.cover_accent, opacity: 0.08 }}
                  >
                    한
                  </span>

                  {/* Title */}
                  <div className="relative z-10">
                    <h2
                      className="font-heading font-bold leading-tight mb-2"
                      style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: featured.cover_accent }}
                    >
                      {featured.title}
                    </h2>
                    <p className="font-sans text-xs" style={{ color: `${featured.cover_accent}60` }}>
                      {MONTH_NAME[featured.month] ?? featured.month} {featured.year}
                      {featured.page_count ? ` · ${featured.page_count} pages` : ''}
                    </p>
                  </div>
                </div>

                {/* ── Issue details ── */}
                <div className="flex flex-col justify-between p-10" style={{ background: '#fff' }}>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[2px] text-[#8B1E24] mb-4">Featured Issue</p>
                    <h3 className="font-heading font-bold text-[#1A1008] text-2xl mb-2 leading-snug">{featured.title}</h3>
                    <p className="font-sans text-sm text-[#888] mb-1 italic">{featured.tagline}</p>
                    <p className="font-sans text-sm text-[#555] leading-relaxed mt-4 mb-8">{featured.description}</p>

                    {/* Articles preview */}
                    {(featured.articles ?? []).length > 0 && (
                      <div className="mb-8">
                        <p className="font-sans text-xs font-bold uppercase tracking-[2px] text-[#bbb] mb-4">In This Issue</p>
                        <div className="flex flex-col gap-3">
                          {(featured.articles ?? []).slice(0, 3).map((a, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span
                                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-sans text-[10px] font-bold text-white mt-0.5"
                                style={{ background: featured.cover_color }}
                              >
                                {i + 1}
                              </span>
                              <div>
                                {a.tag && (
                                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[#8B1E24] mr-2">{a.tag}</span>
                                )}
                                <span className="font-sans text-sm text-[#333]">{a.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {(featured.articles?.length ?? 0) === 0 ? (
                      <span
                        className="inline-flex items-center gap-2 font-sans font-bold text-sm px-7 py-3 rounded-full"
                        style={{ background: '#FAF3ED', color: '#8B1E24', border: '1px solid #E8DCCF' }}
                      >
                        Coming Soon — Stay Tuned
                      </span>
                    ) : (
                      <>
                        <span
                          className="inline-flex items-center gap-2 font-sans font-bold text-sm px-7 py-3 rounded-full transition-all hover:opacity-90"
                          style={{ background: '#8B1E24', color: '#fff' }}
                        >
                          Read Issue <ArrowRight className="w-4 h-4" />
                        </span>
                        <span className="flex items-center gap-1.5 font-sans text-xs text-[#bbb]">
                          <FileText className="w-3.5 h-3.5" />
                          {featured.page_count} pages
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          </section>
        )}

        {/* ── Archive ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pb-20">

          {/* Section header + year filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: '#8B1E24' }} />
              <span className="font-sans text-xs font-bold uppercase tracking-[3px] text-[#8B1E24]">Archive</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveYear('all')}
                className="font-sans text-xs font-semibold px-4 py-2 rounded-full transition-all"
                style={activeYear === 'all'
                  ? { background: '#1A1008', color: '#fff' }
                  : { background: '#fff', color: '#666', border: '1px solid #DDD4C8' }
                }
              >
                All
              </button>
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className="font-sans text-xs font-semibold px-4 py-2 rounded-full transition-all"
                  style={activeYear === y
                    ? { background: '#1A1008', color: '#fff' }
                    : { background: '#fff', color: '#666', border: '1px solid #DDD4C8' }
                  }
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Issue grid — portrait magazine cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={String(activeYear)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {visible.map((issue, i) => (
                <motion.div
                  key={issue.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <Link href={`/magazine/${issue.slug}`}>
                    <div className="group cursor-pointer">

                      {/* Portrait cover */}
                      <motion.div
                        className="relative rounded-xl overflow-hidden mb-3"
                        style={{
                          background: issue.cover_color,
                          aspectRatio: '3/4',
                          boxShadow: '4px 6px 20px rgba(0,0,0,0.10)',
                        }}
                        whileHover={{ y: -6, boxShadow: '8px 16px 40px rgba(0,0,0,0.18)', rotate: 0.5 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Spine stripe on left */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-2"
                          style={{ background: `${issue.cover_accent}30` }}
                        />

                        {/* Korean character watermark */}
                        <span
                          className="absolute inset-0 flex items-center justify-center font-korean font-bold select-none pointer-events-none leading-none"
                          style={{ fontSize: 120, color: issue.cover_accent, opacity: 0.1 }}
                        >
                          {issue.title.charAt(0)}
                        </span>

                        {/* Top label */}
                        <div className="absolute top-3 left-4 right-4">
                          <p
                            className="font-sans text-[9px] font-bold uppercase tracking-[2px]"
                            style={{ color: `${issue.cover_accent}60` }}
                          >
                            DKC
                          </p>
                        </div>

                        {/* Bottom content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p
                            className="font-sans text-[9px] font-semibold uppercase tracking-wider mb-1"
                            style={{ color: `${issue.cover_accent}70` }}
                          >
                            {issue.issue_label}
                          </p>
                          <h3
                            className="font-heading font-bold leading-tight"
                            style={{ fontSize: 'clamp(13px, 2vw, 16px)', color: issue.cover_accent }}
                          >
                            {issue.title}
                          </h3>
                        </div>

                        {/* Hover: read overlay */}
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background: 'rgba(0,0,0,0.35)' }}
                        >
                          <span className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
                            Read <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </motion.div>

                      {/* Card meta below cover */}
                      <div className="px-1">
                        <p className="font-heading font-semibold text-[#1A1008] text-sm leading-snug mb-0.5 group-hover:text-[#8B1E24] transition-colors">
                          {issue.title}
                        </p>
                        <p className="font-sans text-[11px] text-[#999] flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {MONTH_NAME[issue.month] ?? issue.month} {issue.year}
                          {issue.page_count ? ` · ${issue.page_count}pp` : ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {visible.length === 0 && magazines.length > 0 && (
                <div className="col-span-full py-16 text-center">
                  <BookOpen className="w-8 h-8 text-[#ccc] mx-auto mb-3" />
                  <p className="font-sans text-sm text-[#999]">No issues for {activeYear}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
      <Footer />
    </>
  )
}
