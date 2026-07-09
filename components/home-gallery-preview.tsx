'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Camera } from 'lucide-react'
import { type ApiGalleryPhoto, API_BASE } from '@/lib/api'

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'https://dibrugarhkoreanclub.com/api/v1')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '')

function getImageUrl(photo: ApiGalleryPhoto): string | null {
  if (!photo.image_path) return null
  if (photo.image_path.startsWith('http')) return photo.image_path
  return `${BACKEND_URL}/gallery/images/${photo.image_path}`
}

// Fisher-Yates shuffle — returns a new array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const HEIGHT_MAP = { portrait: 280, landscape: 180, square: 220 }

export function HomeGalleryPreview() {
  const [photos, setPhotos] = useState<ApiGalleryPhoto[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/gallery`)
      .then(r => r.json())
      .then((data: ApiGalleryPhoto[]) => {
        if (Array.isArray(data)) setPhotos(data)
      })
      .catch(() => {})
  }, [])

  // Pick 5 random photos — useMemo so they stay stable during this render
  // but are re-randomised on every page load (new JS module evaluation)
  const preview = useMemo(() => shuffle(photos).slice(0, 5), [photos])

  if (preview.length === 0) return null

  return (
    <section style={{ background: '#FFFFFF', borderTop: '1px solid #E8DCCF' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="font-korean text-[#8B1E24]/60 text-sm mb-1">추억의 순간들</p>
            <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">Our Gallery</h2>
            <p className="font-sans text-[#777] text-sm mt-1">Moments from events, workshops &amp; celebrations.</p>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-sm font-semibold transition-all hover:gap-3"
            style={{ color: '#8B1E24' }}
          >
            View all photos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* 5-photo masonry strip */}
        <div style={{ columns: 'auto 200px', columnGap: '12px' }}>
          {preview.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid mb-3"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link href="/gallery" className="block group relative rounded-xl overflow-hidden">
                <div style={{ height: HEIGHT_MAP[photo.aspect] }}>
                  {getImageUrl(photo) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(photo)!}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: photo.color }}
                    >
                      <span
                        className="font-korean font-bold select-none"
                        style={{ fontSize: 64, color: '#8B1E24', opacity: 0.12, lineHeight: 1 }}
                      >
                        {photo.icon}
                      </span>
                    </div>
                  )}
                  {/* Hover caption */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
                  >
                    <p className="font-sans text-white text-[11px] font-medium leading-snug">{photo.caption}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold"
            style={{ color: '#8B1E24' }}
          >
            <Camera className="w-4 h-4" />
            View all photos
          </Link>
        </div>

      </div>
    </section>
  )
}
