'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, ArrowRight, X, ZoomIn } from 'lucide-react'
import { API_BASE, type ApiPressMention } from '@/lib/api'

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://dibrugarhkoreanclub.shop')
const pressImageUrl = (path: string | null) => path ? `${BACKEND_URL}/press/images/${path}` : null

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
        className="absolute top-4 right-4 p-2 rounded-full font-sans text-white hover:opacity-70 transition-opacity"
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

const LANGUAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Korean:   { label: '한국어', color: '#2D5F7A', bg: '#EBF3F8' },
  Assamese: { label: 'অসমীয়া', color: '#3B6B3A', bg: '#EEF5EE' },
  English:  { label: 'English', color: '#6B5C3E', bg: '#F4F0E8' },
  Hindi:    { label: 'हिंदी',   color: '#6B3A7A', bg: '#F5EEF8' },
}

function PressMentionCard({ item, onImageClick }: { item: ApiPressMention; onImageClick: (src: string, alt: string) => void }) {
  const lang = LANGUAGE_CONFIG[item.language] ?? LANGUAGE_CONFIG.English
  const Wrapper = item.source_url ? 'a' : 'div'
  const wrapperProps = item.source_url
    ? { href: item.source_url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className="flex-shrink-0 flex flex-col rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        width: '300px',
        background: '#fff',
        border: '1.5px solid #E8DCCF',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(139,30,36,0.12)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Article image */}
      {pressImageUrl(item.image_path) ? (
        <div className="w-full overflow-hidden relative" style={{ height: '180px' }}>
          <img
            src={pressImageUrl(item.image_path)}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(26,10,5,0.6) 0%, transparent 60%)' }}
          />
          {/* View image button — only when no URL */}
          {!item.source_url && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); onImageClick(pressImageUrl(item.image_path)!, item.title) }}
              className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <ZoomIn size={14} />
            </button>
          )}
          {/* Source name on image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-white/90 uppercase tracking-wider">
              {item.source_name}
            </span>
            {item.source_url
              ? <span className="flex items-center gap-1 font-sans text-[10px] text-white/70"><ExternalLink size={9} /> Read</span>
              : <span
                  className="flex items-center gap-1 font-sans text-[10px] text-white/70 cursor-pointer"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); onImageClick(pressImageUrl(item.image_path)!, item.title) }}
                ><ZoomIn size={9} /> View</span>
            }
          </div>
        </div>
      ) : (
        <div
          className="w-full flex flex-col items-center justify-center gap-1"
          style={{ height: '90px', background: '#FAF6F0' }}
        >
          <span className="font-sans text-sm font-bold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
            {item.source_name}
          </span>
          {item.source_url && (
            <span className="flex items-center gap-1 font-sans text-[10px]" style={{ color: '#C9A882' }}>
              <ExternalLink size={9} /> Read Article
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 py-3 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full"
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

        <p className="font-sans font-semibold leading-snug line-clamp-3" style={{ fontSize: '13px', color: '#1A1008' }}>
          {item.title}
        </p>
      </div>
    </Wrapper>
  )
}

export function FeaturedInSection() {
  const [items, setItems] = useState<ApiPressMention[]>([])
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const posRef  = useRef(0)

  useEffect(() => {
    fetch(`${API_BASE}/press-mentions`)
      .then(r => r.json())
      .then((data: ApiPressMention[]) => { if (data?.length) setItems(data) })
      .catch(() => {})
  }, [])

  const pausedRef = useRef(false)
  const shouldScroll = items.length >= 4

  // Infinite scroll animation — only when enough items
  useEffect(() => {
    const track = trackRef.current
    if (!track || !shouldScroll) return

    const speed = 0.6
    const totalWidth = track.scrollWidth / 2

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += speed
        if (posRef.current >= totalWidth) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [items, shouldScroll])

  if (items.length === 0) return null

  const displayItems = shouldScroll ? [...items, ...items] : items

  return (
    <>
    <section className="py-12 overflow-hidden" style={{ background: '#FAF6F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex items-end justify-between">
        <div>
          <p className="font-sans text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#8B1E24' }}>
            소개된 곳
          </p>
          <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(22px, 3vw, 30px)', color: '#1A1008' }}>
            Featured In
          </h2>
          <p className="font-sans mt-1" style={{ fontSize: '13px', color: '#6B5C4A' }}>
            DKC coverage across Korean and Indian media
          </p>
        </div>
        <Link
          href="/featured-in"
          className="hidden sm:flex items-center gap-1.5 font-sans text-sm font-semibold transition-opacity hover:opacity-70 flex-shrink-0"
          style={{ color: '#8B1E24' }}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #FAF6F0, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #FAF6F0, transparent)' }} />

        <div
          className={shouldScroll ? 'overflow-hidden px-4' : 'px-4'}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          <div
            ref={trackRef}
            className={shouldScroll
              ? 'flex gap-4 will-change-transform'
              : 'flex gap-4 flex-wrap justify-center'
            }
            style={shouldScroll ? { width: 'max-content' } : {}}
          >
            {displayItems.map((item, i) => (
              <PressMentionCard key={`${item.id}-${i}`} item={item} onImageClick={(src, alt) => setLightbox({ src, alt })} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile view all */}
      <div className="sm:hidden text-center mt-6">
        <Link
          href="/featured-in"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold"
          style={{ color: '#8B1E24' }}
        >
          View all coverage <ArrowRight size={14} />
        </Link>
      </div>
    </section>

    {lightbox && (
      <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
    )}
    </>
  )
}
