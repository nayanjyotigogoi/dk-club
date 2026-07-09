'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'
import { API_BASE, type ApiFunFact, type ApiGalleryPhoto } from '@/lib/api'

// ─── Moments Together ─────────────────────────────────────────────────────────

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://dibrugarhkoreanclub.com')
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/$/, '')

// Shown only when gallery API is unreachable or returns no photos
const FALLBACK_MOMENTS = [
  { id: 1, src: '/cherry-blossoms.png', caption: 'Hangul Day 2024' },
  { id: 2, src: '/hanok-pavilion.png',  caption: 'Cultural Fest'   },
  { id: 3, src: '/cherry-blossoms.png', caption: 'Language Camp'   },
  { id: 4, src: '/hanok-pavilion.png',  caption: 'K-Food Night'    },
  { id: 5, src: '/cherry-blossoms.png', caption: 'Movie Screening' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Moment = { id: number; src: string | null; caption: string; color?: string; icon?: string }

function MomentsTogether() {
  // null = still loading (show skeleton); array = ready to render
  const [moments, setMoments] = useState<Moment[] | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/gallery`)
      .then(r => r.json())
      .then((data: ApiGalleryPhoto[]) => {
        if (!Array.isArray(data) || !data.length) {
          setMoments(FALLBACK_MOMENTS)
          return
        }

        const toMoment = (p: ApiGalleryPhoto): Moment => ({
          id:      p.id,
          caption: p.caption,
          color:   p.color ?? undefined,
          icon:    p.icon  ?? undefined,
          src: p.image_path?.startsWith('http')
            ? p.image_path
            : p.image_path
              ? `${BACKEND_URL}/gallery/images/${p.image_path}`
              : null,
        })

        // Always show photos-with-images first so the grid isn't empty-looking.
        // Shuffle within each group for variety, then fill up to 5.
        const withPhoto    = shuffle(data.filter(p => p.image_path))
        const withoutPhoto = shuffle(data.filter(p => !p.image_path))
        const ordered      = [...withPhoto, ...withoutPhoto]

        setMoments(ordered.slice(0, 5).map(toMoment))
      })
      .catch(() => setMoments(FALLBACK_MOMENTS))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: '#FAF3ED',
        boxShadow: '0px 8px 24px rgba(139,30,36,0.08)',
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3
            className="font-heading font-semibold text-[#2B2B2B] leading-tight"
            style={{ fontSize: '18px' }}
          >
            Moments Together
          </h3>
          <p className="font-sans text-[#888888] mt-0.5" style={{ fontSize: '12px' }}>
            Memories from our community
          </p>
        </div>
        <span
          className="font-sans text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: '#8B1E24', color: '#FFFFFF' }}
        >
          Gallery
        </span>
      </div>

      {/* Photo grid — skeleton while loading, live photos once fetched */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-1.5 px-5 pb-5" style={{ minHeight: '220px' }}>
        {(moments === null || moments.length === 0) ? (
          // Loading / empty skeleton — same grid shape, no hardcoded images
          <>
            <div className="rounded-xl row-span-2 animate-pulse" style={{ background: '#E8DCCF' }} />
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-xl animate-pulse" style={{ background: '#E8DCCF' }} />
            ))}
          </>
        ) : (
          <>
            {/* Large left tile */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-xl overflow-hidden row-span-2 cursor-pointer group"
            >
              {moments[0].src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={moments[0].src} alt={moments[0].caption} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: moments[0].color ?? '#E8DCCF' }}>
                  <span className="font-korean font-bold select-none" style={{ fontSize: 48, color: '#8B1E24', opacity: 0.15 }}>{moments[0].icon}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-2 left-2 font-sans text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {moments[0].caption}
              </span>
            </motion.div>

            {/* Four smaller tiles */}
            {moments.slice(1).map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                {m.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.src} alt={m.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: m.color ?? '#E8DCCF' }}>
                    <span className="font-korean font-bold select-none" style={{ fontSize: 32, color: '#8B1E24', opacity: 0.15 }}>{m.icon}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-1 left-1.5 font-sans text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.caption}
                </span>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Fun Fact ─────────────────────────────────────────────────────────────────

const FALLBACK_FUN_FACTS: ApiFunFact[] = [
  { id: 1, type: 'fact', korean_word: '한', romanized: 'Han', fact: 'Korean (Hangul) was invented by King Sejong the Great in 1443 — making it one of the only writing systems with a known inventor.', is_active: true, sort_order: 1 },
  { id: 2, type: 'fact', korean_word: '한글', romanized: 'Hangul', fact: 'Hangul has only 24 letters, but can represent over 11,000 unique syllable blocks.', is_active: true, sort_order: 2 },
]

function FunFactCard() {
  const [facts, setFacts] = useState<ApiFunFact[]>(FALLBACK_FUN_FACTS)

  useEffect(() => {
    fetch(`${API_BASE}/fun-facts`)
      .then(r => r.json())
      .then((data: ApiFunFact[]) => { if (data?.length) setFacts(data) })
      .catch(() => {})
  }, [])

  const item = facts[Math.floor(Math.random() * facts.length)] ?? facts[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col rounded-2xl p-5"
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 6px 18px rgba(139,30,36,0.07)',
        minHeight: '0',
      }}
    >
      {/* Label row */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#FAF3ED' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#8B1E24' }} />
        </div>
        <span
          className="font-heading font-semibold uppercase tracking-wide"
          style={{ fontSize: '11px', color: '#8B1E24' }}
        >
          Fun Fact
        </span>
      </div>

      {/* Korean decorative character */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 font-korean font-bold"
        style={{ background: '#FAF3ED', color: '#8B1E24', fontSize: '18px' }}
      >
        {item?.korean_word?.charAt(0) ?? '한'}
      </div>

      <p
        className="font-sans text-[#444444] leading-relaxed flex-1"
        style={{ fontSize: '13px' }}
      >
        {item?.fact}
      </p>
    </motion.div>
  )
}

// ─── Did You Know ─────────────────────────────────────────────────────────────

const FALLBACK_DID_YOU_KNOW: ApiFunFact[] = [
  {
    id: 10,
    type: 'word',
    korean_word: '눈치',
    romanized: 'Nunchi',
    fact: '"Nunchi" is an untranslatable Korean concept — the subtle art of reading the room and understanding unspoken feelings.',
    is_active: true,
    sort_order: 1,
  },
]

function DidYouKnowCard() {
  const [items, setItems] = useState<ApiFunFact[]>(FALLBACK_DID_YOU_KNOW)

  useEffect(() => {
    fetch(`${API_BASE}/fun-facts`)
      .then(r => r.json())
      .then((data: ApiFunFact[]) => {
        const wordFacts = data.filter(f => f.type === 'word')
        if (wordFacts.length) setItems(wordFacts)
        else if (data.length) setItems(data)
      })
      .catch(() => {})
  }, [])

  const item = items[1] ?? items[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col rounded-2xl p-5"
      style={{
        background: '#FAF3ED',
        boxShadow: '0px 6px 18px rgba(139,30,36,0.07)',
        minHeight: '0',
      }}
    >
      {/* Label row */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#FFFFFF' }}
        >
          <Lightbulb className="w-3.5 h-3.5" style={{ color: '#8B1E24' }} />
        </div>
        <span
          className="font-heading font-semibold uppercase tracking-wide"
          style={{ fontSize: '11px', color: '#8B1E24' }}
        >
          Did You Know?
        </span>
      </div>

      {/* Korean word highlight */}
      <div className="flex items-baseline gap-2 mb-3">
        <span
          className="font-korean font-bold"
          style={{ fontSize: '22px', color: '#8B1E24' }}
        >
          {item?.korean_word}
        </span>
        <span
          className="font-sans text-[#888888]"
          style={{ fontSize: '12px' }}
        >
          {item?.romanized}
        </span>
      </div>

      <p
        className="font-sans text-[#444444] leading-relaxed flex-1"
        style={{ fontSize: '13px' }}
      >
        {item?.fact}
      </p>
    </motion.div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function CommunitySection() {
  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* Left — Moments Together */}
          <MomentsTogether />

          {/* Right — Fun Fact + Did You Know stacked equally */}
          <div className="grid grid-rows-2 gap-6">
            <FunFactCard />
            <DidYouKnowCard />
          </div>

        </div>
      </div>
    </section>
  )
}
