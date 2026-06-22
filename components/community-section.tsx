'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'

// ─── Moments Together ─────────────────────────────────────────────────────────

const moments = [
  {
    id: 1,
    src: '/cherry-blossoms.png',
    caption: 'Hangul Day 2024',
    span: 'row-span-2',
  },
  {
    id: 2,
    src: '/hanok-pavilion.png',
    caption: 'Cultural Fest',
    span: '',
  },
  {
    id: 3,
    src: '/cherry-blossoms.png',
    caption: 'Language Camp',
    span: '',
  },
  {
    id: 4,
    src: '/hanok-pavilion.png',
    caption: 'K-Food Night',
    span: '',
  },
  {
    id: 5,
    src: '/cherry-blossoms.png',
    caption: 'Movie Screening',
    span: '',
  },
]

function MomentsTogether() {
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

      {/* Photo grid */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-1.5 px-5 pb-5" style={{ minHeight: '220px' }}>
        {/* Large left tile */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-xl overflow-hidden row-span-2 cursor-pointer group"
        >
          <Image
            src={moments[0].src}
            alt={moments[0].caption}
            fill
            className="object-cover"
          />
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
            <Image
              src={m.src}
              alt={m.caption}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-1.5 font-sans text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {m.caption}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Fun Fact ─────────────────────────────────────────────────────────────────

const funFacts = [
  'Korean (Hangul) was invented by King Sejong the Great in 1443 — making it one of the only writing systems with a known inventor.',
  'Hangul has only 24 letters, but can represent over 11,000 unique syllable blocks.',
  'South Korea has the world\'s fastest average internet speed, helping K-pop and K-dramas reach every corner of the globe.',
  'The word "Korea" comes from the Goryeo dynasty (918–1392), famous for celadon pottery.',
]

function FunFactCard() {
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)]

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
        한
      </div>

      <p
        className="font-sans text-[#444444] leading-relaxed flex-1"
        style={{ fontSize: '13px' }}
      >
        {fact}
      </p>
    </motion.div>
  )
}

// ─── Did You Know ─────────────────────────────────────────────────────────────

const didYouKnow = [
  {
    korean: '존댓말',
    romanized: 'Jondaemal',
    fact: 'Korean has an elaborate honorific system — how you speak changes entirely based on the age and status of who you\'re talking to.',
  },
  {
    korean: '눈치',
    romanized: 'Nunchi',
    fact: '"Nunchi" is an untranslatable Korean concept — the subtle art of reading the room and understanding unspoken feelings.',
  },
  {
    korean: '빨리빨리',
    romanized: 'Ppalli-ppalli',
    fact: '"Ppalli-ppalli" (hurry-hurry) is a cultural philosophy of speed and efficiency that shaped Korea\'s economic miracle.',
  },
]

function DidYouKnowCard() {
  const item = didYouKnow[1]

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
          {item.korean}
        </span>
        <span
          className="font-sans text-[#888888]"
          style={{ fontSize: '12px' }}
        >
          {item.romanized}
        </span>
      </div>

      <p
        className="font-sans text-[#444444] leading-relaxed flex-1"
        style={{ fontSize: '13px' }}
      >
        {item.fact}
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
