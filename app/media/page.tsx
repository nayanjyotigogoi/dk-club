'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, Music, Film, ExternalLink, Tv } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { API_BASE, type ApiMediaPick } from '@/lib/api'

// ── Type config ───────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, {
  label: string
  icon: React.ElementType
  color: string
  tint: string
  border: string
}> = {
  Drama: { label: 'K-Drama',  icon: Tv,       color: '#8B1E24', tint: '#FEF3F0', border: '#F5CECA' },
  Movie: { label: 'K-Movie',  icon: Film,     color: '#2D5F7A', tint: '#EBF3F8', border: '#B5D4E8' },
  Music: { label: 'K-Music',  icon: Music,    color: '#6B3A7A', tint: '#F5EEF8', border: '#D9B5E8' },
  Book:  { label: 'Book',     icon: BookOpen, color: '#3B6B3A', tint: '#EEF5EE', border: '#C8DFC8' },
  Other: { label: 'Other',    icon: Play,     color: '#6B5C3E', tint: '#F4F0E8', border: '#D8CEBC' },
}

function getConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.Other
}

const PLATFORM_LABELS: Record<string, string> = {
  Netflix:       'Watch on Netflix',
  'Prime Video': 'Watch on Prime Video',
  Spotify:       'Listen on Spotify',
  'Amazon Books':'Get on Amazon',
  Viki:          'Watch on Viki',
  YouTube:       'Watch on YouTube',
}

function getPlatformLabel(platform: string | null, type: string) {
  if (!platform) return 'View'
  return PLATFORM_LABELS[platform] ?? (type === 'Book' ? `Get on ${platform}` : `Watch on ${platform}`)
}

type FilterType = 'All' | 'Drama' | 'Movie' | 'Music' | 'Book' | 'Other'

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'All',   label: 'All'      },
  { key: 'Drama', label: 'K-Drama'  },
  { key: 'Movie', label: 'K-Movie'  },
  { key: 'Music', label: 'K-Music'  },
  { key: 'Book',  label: 'Books'    },
]

// ── Media card ────────────────────────────────────────────────────────────────
function MediaCard({ pick, index }: { pick: ApiMediaPick; index: number }) {
  const cfg = getConfig(pick.type)
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="flex flex-col rounded-2xl overflow-hidden h-full"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${cfg.border}`,
        boxShadow: '0px 4px 16px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top colour strip */}
      <div className="h-1.5 w-full" style={{ background: cfg.color }} />

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${cfg.border}` }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.tint }}
          >
            <Icon size={14} color={cfg.color} />
          </div>
          <span
            className="font-sans text-[10px] font-bold uppercase tracking-widest"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        {pick.tag && (
          <span
            className="font-sans text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: cfg.tint, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            {pick.tag}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 py-4">
        {pick.korean_title && (
          <p
            className="font-heading font-bold mb-0.5"
            style={{ fontSize: '16px', color: cfg.color, fontFamily: "'Malgun Gothic', 'Noto Serif KR', serif" }}
          >
            {pick.korean_title}
          </p>
        )}
        <p className="font-heading font-semibold mb-3" style={{ fontSize: '15px', color: '#1A1008' }}>
          {pick.title}
        </p>
        <p className="font-sans leading-relaxed flex-1" style={{ fontSize: '13px', color: '#6B5C4A', lineHeight: 1.7 }}>
          {pick.description}
        </p>
      </div>

      {/* Footer — CTA */}
      <div className="px-5 pb-5 pt-1">
        {pick.streaming_url ? (
          <a
            href={pick.streaming_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-sans font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: cfg.color, color: '#fff', fontSize: '13px' }}
          >
            <ExternalLink size={13} />
            {getPlatformLabel(pick.streaming_platform, pick.type)}
          </a>
        ) : (
          <div
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-sans font-semibold"
            style={{ background: cfg.tint, color: cfg.color, fontSize: '13px' }}
          >
            {pick.streaming_platform ?? 'Coming soon'}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MediaPage() {
  const [picks, setPicks] = useState<ApiMediaPick[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('All')

  useEffect(() => {
    fetch(`${API_BASE}/media-picks`)
      .then(r => r.json())
      .then((data: ApiMediaPick[]) => { if (data?.length) setPicks(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? picks : picks.filter(p => p.type === filter)

  return (
    <>
      <Navbar />
      <PageHero
        eyebrow="Korean Media"
        title="한국 미디어 추천"
        subtitle="Dramas, films, music, and books curated by Dibrugarh Korean Club — everything you need to fall in love with Korean culture."
      />

      <main className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 rounded-full font-sans text-sm font-semibold transition-all"
                style={
                  filter === f.key
                    ? { background: '#8B1E24', color: '#fff' }
                    : { background: '#F0EAE2', color: '#6B5C4A' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ height: '320px', background: '#F0EAE2' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-lg" style={{ color: '#9CA3AF' }}>No picks found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pick, i) => (
                <MediaCard key={pick.id} pick={pick} index={i} />
              ))}
            </div>
          )}

          {/* Collaboration CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl px-8 py-10 text-center"
            style={{ background: '#FEF3F0', border: '1.5px solid #F5CECA' }}
          >
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8B1E24' }}>
              Collaborate With Us
            </p>
            <h3 className="font-heading font-bold mb-3" style={{ fontSize: 'clamp(20px, 3vw, 26px)', color: '#1A1008' }}>
              Are you a platform or brand?
            </h3>
            <p className="font-sans mb-6 max-w-xl mx-auto" style={{ fontSize: '14px', color: '#6B5C4A', lineHeight: 1.75 }}>
              We partner with streaming services, book publishers, and music platforms to bring the best of Korean culture to Dibrugarh. Get in touch to feature your content here.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold transition-all hover:opacity-90"
              style={{ background: '#8B1E24', color: '#fff', fontSize: '14px' }}
            >
              Get in touch <ExternalLink size={14} />
            </a>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  )
}
