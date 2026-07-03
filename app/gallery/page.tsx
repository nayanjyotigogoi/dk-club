'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiGalleryPhoto, API_BASE } from '@/lib/api'

// Derive backend root from the API URL (strip /api/v1)
const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '')

function getImageUrl(photo: ApiGalleryPhoto): string | null {
  if (!photo.image_path) return null
  if (photo.image_path.startsWith('http')) return photo.image_path
  return `${BACKEND_URL}/gallery/images/${photo.image_path}`
}

type GalleryCategory = 'all' | 'events' | 'culture' | 'members' | 'campus'

const FILTERS: { key: GalleryCategory; label: string }[] = [
  { key: 'all',     label: 'All'         },
  { key: 'events',  label: 'Events'      },
  { key: 'culture', label: 'Culture'     },
  { key: 'members', label: 'Members'     },
  { key: 'campus',  label: 'On Campus'   },
]

// Map aspect to pixel heights for masonry variation
const HEIGHT_MAP = {
  portrait:  280,
  landscape: 180,
  square:    220,
}

export default function GalleryPage() {
  const [filter, setFilter] = useState<GalleryCategory>('all')
  const [photos, setPhotos] = useState<ApiGalleryPhoto[]>([])
  const [lightbox, setLightbox] = useState<ApiGalleryPhoto | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/gallery`)
      .then(r => r.json())
      .then((data: ApiGalleryPhoto[]) => setPhotos(data))
      .catch(() => {})
  }, [])

  const visible = filter === 'all'
    ? photos
    : photos.filter(p => p.category === filter)

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="추억의 순간들"
          title="Gallery"
          subtitle="Moments from our events, workshops, celebrations and everyday campus life — captured and shared."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        />

        <section className="max-w-7xl mx-auto px-6 py-14 pb-20">

          {/* Filter tabs */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="font-sans text-sm px-5 py-2 rounded-full transition-all"
                style={
                  filter === f.key
                    ? { background: '#8B1E24', color: '#fff', border: '1px solid #8B1E24' }
                    : { background: '#fff', color: '#555', border: '1px solid #E8DCCF' }
                }
              >
                {f.label}
              </button>
            ))}
            <span
              className="ml-auto font-sans text-xs text-[#aaa] self-center"
              style={{ alignSelf: 'center' }}
            >
              {visible.length} photo{visible.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Pinterest-style CSS columns masonry */}
          <div style={{ columns: 'auto 220px', columnGap: '16px' }}>
            <AnimatePresence>
              {visible.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => setLightbox(photo)}
                >
                  <div
                    className="relative rounded-xl overflow-hidden"
                    style={{ height: HEIGHT_MAP[photo.aspect] }}
                  >
                    {/* Real photo or colour placeholder */}
                    {getImageUrl(photo) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(photo)!}
                        alt={photo.caption}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: photo.color }}
                      >
                        <span
                          className="font-korean font-bold select-none"
                          style={{ fontSize: 72, color: '#8B1E24', opacity: 0.12, lineHeight: 1 }}
                        >
                          {photo.icon}
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex flex-col items-start justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                    >
                      <p className="font-sans text-white text-xs font-medium leading-snug mb-1">
                        {photo.caption}
                      </p>
                      {photo.event_name && (
                        <p className="font-sans text-white/60 text-[10px]">{photo.event_name}</p>
                      )}
                    </div>

                    {/* Zoom icon */}
                    <div
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-white" />
                    </div>

                    {/* Year badge */}
                    <div
                      className="absolute top-3 left-3 font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.85)', color: '#8B1E24' }}
                    >
                      {photo.year}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            >
              <motion.div
                className="relative max-w-lg w-full rounded-2xl overflow-hidden"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Real photo or colour placeholder */}
                <div className="w-full relative" style={{ height: 340 }}>
                  {getImageUrl(lightbox) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(lightbox)!}
                      alt={lightbox.caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: lightbox.color }}
                    >
                      <span
                        className="font-korean font-bold select-none"
                        style={{ fontSize: 140, color: '#8B1E24', opacity: 0.1, lineHeight: 1 }}
                      >
                        {lightbox.icon}
                      </span>
                    </div>
                  )}
                </div>

                {/* Caption bar */}
                <div className="p-5" style={{ background: '#fff' }}>
                  <p className="font-sans font-semibold text-[#2B2B2B] text-base mb-1">{lightbox.caption}</p>
                  <div className="flex items-center gap-3">
                    {lightbox.event_name && (
                      <span className="font-sans text-xs text-[#8B1E24]">{lightbox.event_name}</span>
                    )}
                    <span className="font-sans text-xs text-[#bbb]">{lightbox.year}</span>
                    <span
                      className="font-sans text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ background: '#FAF3ED', color: '#8B1E24' }}
                    >
                      {lightbox.category}
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
                  onClick={() => setLightbox(null)}
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <Footer />
    </>
  )
}
