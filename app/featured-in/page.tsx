'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Newspaper, ZoomIn, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { API_BASE, type ApiPressMention } from '@/lib/api'

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 rounded-full text-white hover:opacity-70 transition-opacity"
        style={{ background: 'rgba(255,255,255,0.1)' }}
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-[90vh] rounded-xl object-contain"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

const LANGUAGE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Korean:   { label: '한국어',  color: '#2D5F7A', bg: '#EBF3F8', border: '#B5D4E8' },
  Assamese: { label: 'অসমীয়া', color: '#3B6B3A', bg: '#EEF5EE', border: '#BDD4BD' },
  English:  { label: 'English', color: '#6B5C3E', bg: '#F4F0E8', border: '#DDD4BE' },
  Hindi:    { label: 'हिंदी',   color: '#6B3A7A', bg: '#F5EEF8', border: '#D4B5E8' },
}

type FilterType = 'All' | 'Korean' | 'Assamese' | 'English' | 'Hindi'

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'All',      label: 'All'       },
  { key: 'Korean',   label: '한국어'     },
  { key: 'Assamese', label: 'Assamese'  },
  { key: 'English',  label: 'English'   },
  { key: 'Hindi',    label: 'Hindi'     },
]

function PressCard({ item, index, onImageClick }: { item: ApiPressMention; index: number; onImageClick: (src: string, alt: string) => void }) {
  const lang = LANGUAGE_CONFIG[item.language] ?? LANGUAGE_CONFIG.English

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="flex flex-col rounded-2xl overflow-hidden group"
      style={{
        background: '#fff',
        border: `1.5px solid ${lang.border}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top colour strip */}
      <div className="h-1" style={{ background: lang.color }} />

      {/* Image */}
      {item.image_url ? (
        <div className="w-full overflow-hidden relative" style={{ height: '200px' }}>
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
          {!item.source_url && (
            <button
              onClick={() => onImageClick(item.image_url!, item.title)}
              className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.35)' }}
            >
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-sm font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                <ZoomIn size={16} /> View Image
              </span>
            </button>
          )}
        </div>
      ) : (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: '100px', background: lang.bg }}
        >
          <Newspaper size={28} color={lang.color} opacity={0.4} />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 py-4 gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className="font-sans text-[10px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: lang.bg, color: lang.color }}
          >
            {lang.label}
          </span>
          {item.published_date && (
            <span className="font-sans text-[10px]" style={{ color: '#9CA3AF' }}>
              {item.published_date}
            </span>
          )}
        </div>

        <p className="font-sans font-semibold leading-snug flex-1" style={{ fontSize: '14px', color: '#1A1008' }}>
          {item.title}
        </p>

        <p className="font-sans text-xs font-semibold" style={{ color: lang.color }}>
          {item.source_name}
        </p>
      </div>

      {/* CTA */}
      {item.source_url ? (
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 font-sans text-sm font-semibold transition-all hover:opacity-80"
          style={{ borderTop: `1px solid ${lang.border}`, background: lang.bg, color: lang.color }}
        >
          <ExternalLink size={13} /> Read Article
        </a>
      ) : item.image_url ? (
        <button
          onClick={() => onImageClick(item.image_url!, item.title)}
          className="flex items-center justify-center gap-2 py-3 font-sans text-sm font-semibold transition-all hover:opacity-80"
          style={{ borderTop: `1px solid ${lang.border}`, background: lang.bg, color: lang.color }}
        >
          <ZoomIn size={13} /> View Full Image
        </button>
      ) : (
        <div
          className="flex items-center justify-center gap-2 py-3 font-sans text-sm"
          style={{ borderTop: `1px solid ${lang.border}`, color: '#C9A882' }}
        >
          Print Edition
        </div>
      )}
    </motion.div>
  )
}

export default function FeaturedInPage() {
  const [items, setItems]   = useState<ApiPressMention[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<FilterType>('All')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/press-mentions`)
      .then(r => r.json())
      .then((data: ApiPressMention[]) => { if (data?.length) setItems(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? items : items.filter(i => i.language === filter)
  const activeFilters = FILTERS.filter(f => f.key === 'All' || items.some(i => i.language === f.key))

  return (
    <>
      <Navbar />
      <PageHero
        koreanTitle="소개된 곳"
        title="Featured In"
        subtitle="Dibrugarh Korean Club as covered by media across Korea and India — celebrating the growing bridge between two cultures."
      />

      <main className="py-12" style={{ background: '#FAF6F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {activeFilters.map(f => (
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
              <p className="font-sans text-lg" style={{ color: '#9CA3AF' }}>No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <PressCard key={item.id} item={item} index={i} onImageClick={(src, alt) => setLightbox({ src, alt })} />
              ))}
            </div>
          )}

          {/* Media inquiry CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 rounded-2xl px-8 py-10 text-center"
            style={{ background: '#1A0A05', border: '1.5px solid #3A2010' }}
          >
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#8B1E24' }}>
              미디어 문의
            </p>
            <h3 className="font-heading font-bold mb-3" style={{ fontSize: 'clamp(20px, 3vw, 26px)', color: '#FAF3ED' }}>
              Media & Press Inquiries
            </h3>
            <p className="font-sans mb-6 max-w-xl mx-auto" style={{ fontSize: '14px', color: '#C9A882', lineHeight: 1.75 }}>
              Are you a journalist or media organization covering Korean culture in India? We welcome press collaborations and can provide official statements, photography, and spokesperson access.
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
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
