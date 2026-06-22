'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { magazines } from '@/lib/data/magazine'

// Group issues by year
const byYear: Record<number, typeof magazines> = {}
magazines.forEach(m => {
  if (!byYear[m.year]) byYear[m.year] = []
  byYear[m.year].push(m)
})
const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

const featured = magazines.find(m => m.featured) ?? magazines[0]

// Masonry column heights — vary by issue number to create the staggered look
const HEIGHTS = [220, 180, 240, 200, 180]

export default function MagazinePage() {
  const [activeYear, setActiveYear] = useState<number | 'all'>('all')

  const visibleIssues = activeYear === 'all'
    ? magazines.filter(m => !m.featured)
    : magazines.filter(m => m.year === activeYear && !m.featured)

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="디브루가르 한국 클럽 매거진"
          title="DKC Magazine"
          subtitle="Student-written stories, cultural essays, member spotlights and language notes — published every semester."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Magazine' }]}
        />

        {/* ── Featured issue ── */}
        <section className="max-w-7xl mx-auto px-6 py-14">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#8B1E24] mb-6">Latest Issue</p>
          <Link href={`/magazine/${featured.slug}`}>
            <motion.div
              className="relative overflow-hidden rounded-2xl flex flex-col lg:flex-row"
              style={{ background: featured.coverColor, minHeight: 300 }}
              whileHover={{ scale: 1.005, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.25 }}
            >
              {/* Big Korean character watermark */}
              <span
                className="absolute inset-y-0 right-8 flex items-center font-korean font-bold select-none pointer-events-none"
                style={{ fontSize: 260, color: featured.coverAccent, opacity: 0.12, lineHeight: 1 }}
              >
                한
              </span>
              {/* Issue info */}
              <div className="relative z-10 flex-1 p-10 flex flex-col justify-between">
                <div>
                  <span
                    className="inline-block font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
                    style={{ background: 'rgba(255,255,255,0.15)', color: featured.coverAccent }}
                  >
                    {featured.issue}
                  </span>
                  <h2
                    className="font-heading font-bold mb-3 leading-tight"
                    style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: featured.coverAccent }}
                  >
                    {featured.title}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed max-w-md" style={{ color: `${featured.coverAccent}99` }}>
                    {featured.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-8">
                  <span className="font-sans text-sm" style={{ color: `${featured.coverAccent}80` }}>
                    {featured.month} {featured.year} &middot; {featured.pageCount} pages
                  </span>
                  <span
                    className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-6 py-2.5 rounded-full"
                    style={{ background: featured.coverAccent, color: featured.coverColor }}
                  >
                    Read Issue <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              {/* Articles preview */}
              <div
                className="relative z-10 flex-shrink-0 w-full lg:w-72 p-8 flex flex-col gap-4 justify-center"
                style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <p className="font-sans text-xs uppercase tracking-widest" style={{ color: `${featured.coverAccent}70` }}>In this issue</p>
                {featured.articles.slice(0, 3).map(a => (
                  <div key={a.id} className="border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <span
                      className="inline-block font-sans text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1"
                      style={{ background: 'rgba(255,255,255,0.1)', color: featured.coverAccent }}
                    >
                      {a.tag}
                    </span>
                    <p className="font-sans text-sm font-medium" style={{ color: featured.coverAccent }}>{a.title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Link>
        </section>

        {/* ── Year filter + masonry grid ── */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          {/* Year tabs */}
          <div className="flex items-center gap-2 mb-10 flex-wrap">
            <button
              onClick={() => setActiveYear('all')}
              className="font-sans text-sm px-5 py-2 rounded-full transition-all"
              style={activeYear === 'all' ? { background: '#8B1E24', color: '#fff', border: '1px solid #8B1E24' } : { background: '#fff', color: '#555', border: '1px solid #E8DCCF' }}
            >
              All Issues
            </button>
            {years.map(y => (
              <button
                key={y}
                onClick={() => setActiveYear(y)}
                className="font-sans text-sm px-5 py-2 rounded-full transition-all"
                style={activeYear === y ? { background: '#8B1E24', color: '#fff', border: '1px solid #8B1E24' } : { background: '#fff', color: '#555', border: '1px solid #E8DCCF' }}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Masonry grid — CSS columns */}
          <div style={{ columns: 'auto 280px', columnGap: '20px' }}>
            {visibleIssues.map((issue, i) => (
              <motion.div
                key={issue.slug}
                className="break-inside-avoid mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/magazine/${issue.slug}`}>
                  <div
                    className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                    style={{ border: '1px solid #E8DCCF' }}
                  >
                    {/* Cover block — varying heights for masonry feel */}
                    <div
                      className="relative flex items-end p-6"
                      style={{
                        background: issue.coverColor,
                        height: HEIGHTS[i % HEIGHTS.length],
                      }}
                    >
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none"
                        style={{ fontSize: 90, color: '#000', opacity: 0.06, lineHeight: 1 }}
                      >
                        {issue.title.charAt(0)}
                      </span>
                      <div className="relative z-10">
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: issue.coverAccent, opacity: 0.7 }}>
                          {issue.issue}
                        </p>
                        <h3 className="font-heading font-bold text-lg leading-snug" style={{ color: issue.coverAccent }}>
                          {issue.title}
                        </h3>
                      </div>
                    </div>
                    {/* Card body */}
                    <div className="p-5" style={{ background: '#fff' }}>
                      <p className="font-sans text-xs text-[#999] mb-2">{issue.month} {issue.year} &middot; {issue.pageCount} pages</p>
                      <p className="font-sans text-sm text-[#555] leading-relaxed mb-4">{issue.tagline}</p>
                      <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#8B1E24]">
                        <BookOpen className="w-3.5 h-3.5" /> Read Issue
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
