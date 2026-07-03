'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  ShoppingBag,
  Globe,
  ArrowRight,
  Sparkles,
  UserPlus,
  Music,
  Utensils,
  Film,
} from 'lucide-react'

// ─── reusable fade-up wrapper ─────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

// ─── Magazine card (left half, full height) ────────────────────────────────────
function MagazineCard() {
  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{ background: '#8B1E24', boxShadow: '0 4px 20px rgba(139,30,36,0.15)' }}
    >
      {/* Top label */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-white/70" />
          <span className="font-sans text-xs font-semibold text-white/70 uppercase tracking-widest">
            Magazine
          </span>
        </div>
        <span
          className="font-sans text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        >
          Latest Issue
        </span>
      </div>

      {/* Issue illustration area */}
      <div
        className="mx-6 rounded-xl flex-1 flex flex-col items-center justify-center px-6 py-8"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div className="font-korean text-6xl font-bold mb-4" style={{ color: 'rgba(255,255,255,0.15)' }}>
          한류
        </div>
        <div className="w-16 h-0.5 mb-5" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <p className="font-heading text-lg font-bold text-white text-center leading-snug mb-2">
          Our First Issue
        </p>
        <p className="font-sans text-xs text-white/50 text-center leading-relaxed">
          Coming soon — stay tuned
        </p>
        <span
          className="font-sans text-[10px] font-semibold px-3 py-1 rounded-full mt-4"
          style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          Not yet published
        </span>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-5">
        <p className="font-sans text-xs text-white/50 mb-3 leading-relaxed">
          Our magazine will feature student-written stories, cultural essays and language notes. Check back soon.
        </p>
        <Link
          href="/magazine"
          className="flex items-center justify-center gap-2 w-full rounded-full font-sans font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            height: '40px',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          View Magazine
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

// ─── Register card ─────────────────────────────────────────────────────────────
function RegisterCard() {
  return (
    <div
      className="flex flex-col h-full rounded-2xl p-5"
      style={{
        background: '#FAF3ED',
        boxShadow: '0 2px 12px rgba(139,30,36,0.07)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#8B1E24' }}
        >
          <UserPlus className="w-4 h-4 text-white" />
        </div>
        <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
          Join Us
        </span>
      </div>
      <p className="font-heading font-bold text-[#2B2B2B] leading-tight mb-2" style={{ fontSize: '15px' }}>
        Register Yourself to Join the Club
      </p>
      <p className="font-sans text-xs text-[#666666] leading-relaxed flex-1 mb-4">
        Become a member of Dibrugarh Korean Club and unlock events, resources, and a community of culture lovers.
      </p>
      <Link
        href="/join"
        className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs text-white rounded-full px-4 py-2 self-start transition-all hover:shadow-md active:scale-95"
        style={{ background: '#8B1E24' }}
      >
        Register Now
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

// ─── Who Are We card ───────────────────────────────────────────────────────────
function WhoAreWeCard() {
  return (
    <div
      className="flex flex-col h-full rounded-2xl p-5"
      style={{
        background: '#fff',
        border: '1px solid #E8DCCF',
        boxShadow: '0 2px 12px rgba(139,30,36,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
        >
          <Users className="w-4 h-4" style={{ color: '#8B1E24' }} />
        </div>
        <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
          About Us
        </span>
      </div>
      <p className="font-heading font-bold text-[#2B2B2B] leading-tight mb-2" style={{ fontSize: '15px' }}>
        Who Are We?
      </p>
      <p className="font-sans text-xs text-[#666666] leading-relaxed flex-1 mb-4">
        A student-led community at Dibrugarh University celebrating Korean language, culture, K-pop, K-drama, and everything in between.
      </p>
      <div className="flex gap-2 flex-wrap mb-4">
        {['Language', 'Culture', 'K-pop', 'K-drama'].map((tag) => (
          <span
            key={tag}
            className="font-sans text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#FAF3ED', color: '#8B1E24', border: '1px solid #E8DCCF' }}
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href="/about"
        className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs rounded-full px-4 py-2 self-start transition-all hover:bg-primary/5 active:scale-95"
        style={{ color: '#8B1E24', border: '1px solid #E8DCCF' }}
      >
        Learn More
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

// ─── Goodies card ──────────────────────────────────────────────────────────────
function GoodiesCard() {
  return (
    <div
      className="flex flex-col h-full rounded-2xl p-5"
      style={{
        background: '#fff',
        border: '1px solid #E8DCCF',
        boxShadow: '0 2px 12px rgba(139,30,36,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
        >
          <ShoppingBag className="w-4 h-4" style={{ color: '#8B1E24' }} />
        </div>
        <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
          Goodies
        </span>
      </div>
      <p className="font-heading font-bold text-[#2B2B2B] leading-tight mb-2" style={{ fontSize: '15px' }}>
        Get Our Exclusive Goodies
      </p>
      <p className="font-sans text-xs text-[#666666] leading-relaxed flex-1 mb-3">
        From tote bags to stickers and pins — grab your DKC merch and show your Korean pride around campus.
      </p>
      <div
        className="rounded-xl px-3 py-2 mb-4"
        style={{ background: '#FAF3ED' }}
      >
        <p className="font-sans text-[10px] text-[#8B1E24] font-semibold mb-0.5">How to get yours</p>
        <p className="font-sans text-[10px] text-[#666666]">Register as a member → attend an event → collect your pack</p>
      </div>
      <Link
        href="/goodies"
        className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs text-white rounded-full px-4 py-2 self-start transition-all hover:shadow-md active:scale-95"
        style={{ background: '#8B1E24' }}
      >
        Explore Goodies
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

// ─── Korean Culture card ───────────────────────────────────────────────────────
function KoreanCultureCard() {
  const topics = [
    { icon: Music,    label: 'K-pop & Music',  desc: 'The soundtrack of a generation' },
    { icon: Film,     label: 'K-drama & Film', desc: 'Stories that move the world'    },
    { icon: Utensils, label: 'Korean Cuisine', desc: 'Flavours rooted in tradition'   },
  ]

  return (
    <div
      className="flex flex-col h-full rounded-2xl p-5"
      style={{
        background: '#FAF3ED',
        boxShadow: '0 2px 12px rgba(139,30,36,0.07)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#8B1E24' }}
        >
          <Globe className="w-4 h-4 text-white" />
        </div>
        <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
          Culture
        </span>
      </div>
      <p className="font-heading font-bold text-[#2B2B2B] leading-tight mb-3" style={{ fontSize: '15px' }}>
        Explore Korean Culture
      </p>
      <div className="flex flex-col gap-2 flex-1">
        {topics.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ background: '#fff', border: '1px solid #E8DCCF' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FAF3ED' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: '#8B1E24' }} />
            </div>
            <div>
              <p className="font-sans text-xs font-semibold text-[#2B2B2B] leading-none mb-0.5">{label}</p>
              <p className="font-sans text-[10px] text-[#888]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/culture"
        className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs rounded-full px-4 py-2 self-start mt-4 transition-all hover:bg-primary/5 active:scale-95"
        style={{ color: '#8B1E24', border: '1px solid #E8DCCF', background: '#fff' }}
      >
        Discover Culture
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────
export function DiscoverSection() {
  return (
    <section className="bg-background py-12">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: '#8B1E24' }} />
            <span className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
              Discover
            </span>
          </div>
          <h2 className="font-heading font-bold text-[#2B2B2B]" style={{ fontSize: '24px' }}>
            Everything Dibrugarh Korean Club
          </h2>
        </motion.div>

        {/* Two-half grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ minHeight: '480px' }}>

          {/* ── Left half: Magazine card full height ── */}
          <FadeUp delay={0}>
            <MagazineCard />
          </FadeUp>

          {/* ── Right half: 2 columns × 2 rows of small cards ── */}
          <div className="grid grid-cols-2 gap-4">
            <FadeUp delay={0.05}><RegisterCard /></FadeUp>
            <FadeUp delay={0.1}><GoodiesCard /></FadeUp>
            <FadeUp delay={0.15}><WhoAreWeCard /></FadeUp>
            <FadeUp delay={0.2}><KoreanCultureCard /></FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
