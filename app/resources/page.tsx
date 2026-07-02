'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, ExternalLink, ChevronRight, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiResourceCategory, API_BASE } from '@/lib/api'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     '#16a34a',
  intermediate: '#d97706',
  advanced:     '#dc2626',
}

const FALLBACK_CATEGORIES: ApiResourceCategory[] = [
  { slug: 'study-materials', label: 'Study Materials',    icon: '📚', description: 'Curated study guides, notes and learning paths for Korean learners at every level.', count: 0 },
  { slug: 'vocabulary',      label: 'Vocabulary Lists',   icon: '🗂️', description: 'Topical word lists, TOPIK vocabulary packs and daily word sets to build your lexicon.', count: 0 },
  { slug: 'grammar',         label: 'Grammar Guide',      icon: '📝', description: 'Clear explanations of Korean grammar patterns from basic particles to advanced structures.', count: 0 },
  { slug: 'korean-culture',  label: 'Korean Culture',     icon: '🎭', description: 'Articles, essays and guides exploring Korean history, traditions, film, food and modern culture.', count: 0 },
  { slug: 'practice',        label: 'Practice Exercises', icon: '✏️', description: 'Interactive drills, reading passages, listening exercises and writing prompts.', count: 0 },
  { slug: 'books',           label: 'Recommended Books',  icon: '📖', description: "DKC's curated reading list — textbooks, novels, webtoons and reference works.", count: 0 },
  { slug: 'links',           label: 'Useful Links',       icon: '🔗', description: 'The best external websites, apps, YouTube channels and tools for learning Korean.', count: 0 },
]

export default function ResourcesPage() {
  const [categories, setCategories] = useState<ApiResourceCategory[]>(FALLBACK_CATEGORIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/resources/categories`)
      .then(r => r.json())
      .then((data: ApiResourceCategory[]) => { if (data?.length) setCategories(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0', minHeight: '100vh' }}>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: '#1A0A00' }}>
          <span
            className="absolute right-8 top-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none"
            style={{ fontSize: 240, lineHeight: 1, color: '#ffffff', opacity: 0.04 }}
          >
            자료
          </span>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#8B1E2480' }}>
              DKC · Learning Hub
            </p>
            <h1 className="font-heading font-bold text-white mb-3" style={{ fontSize: 'clamp(28px,4vw,52px)' }}>
              Resources
            </h1>
            <p className="font-sans text-sm max-w-xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Everything you need to learn Korean — study guides, vocabulary packs, grammar breakdowns,
              cultural essays, practice exercises, book recommendations and curated external links.
            </p>
          </div>
        </div>

        {/* Category grid */}
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-center gap-3 mb-10">
            <span className="flex-1 h-px" style={{ background: '#E8DCCF' }} />
            <p className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
              Browse by Category
            </p>
            <span className="flex-1 h-px" style={{ background: '#E8DCCF' }} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#8B1E24' }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/resources/${cat.slug}`} className="group block h-full">
                    <div
                      className="h-full rounded-2xl p-6 flex flex-col transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                      style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                    >
                      {/* Icon + count */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: '#FAF3ED' }}
                        >
                          {cat.icon}
                        </div>
                        {cat.count > 0 && (
                          <span
                            className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: '#FAF3ED', color: '#8B1E24' }}
                          >
                            {cat.count} {cat.count === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>

                      <h2 className="font-heading font-bold text-[#2B2B2B] text-lg mb-2">
                        {cat.label}
                      </h2>
                      <p className="font-sans text-sm text-[#666] leading-relaxed flex-1">
                        {cat.description}
                      </p>

                      <div
                        className="mt-5 flex items-center gap-1 font-sans text-sm font-semibold transition-colors"
                        style={{ color: '#8B1E24' }}
                      >
                        Explore <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Korean learning tip banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-14 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6"
            style={{ background: '#8B1E24' }}
          >
            <div className="text-4xl flex-shrink-0">💡</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-heading font-bold text-white text-lg mb-1">New to Korean?</p>
              <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Start with our Beginner Roadmap in Study Materials — a 12-week structured plan to take you from zero to conversational Korean.
              </p>
            </div>
            <Link
              href="/resources/study-materials"
              className="flex-shrink-0 font-sans text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:opacity-90"
              style={{ background: '#fff', color: '#8B1E24' }}
            >
              Start Here →
            </Link>
          </motion.div>
        </div>

      </main>
      <Footer />
    </>
  )
}
