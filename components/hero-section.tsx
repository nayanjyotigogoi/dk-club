'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Falling petal positions — fixed to avoid hydration mismatch
const PETALS = [
  { left: 52, delay: 0,   duration: 6 },
  { left: 61, delay: 1.2, duration: 7 },
  { left: 70, delay: 2.5, duration: 5.5 },
  { left: 45, delay: 3.8, duration: 8 },
  { left: 78, delay: 0.7, duration: 6.5 },
  { left: 58, delay: 4.2, duration: 7.5 },
]

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#FAF6F0', minHeight: '560px', paddingTop: '96px' }}
    >
      {/* ── Falling cherry petals (decorative, pointer-events-none) ── */}
      {PETALS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-0 pointer-events-none"
          style={{ left: `${p.left}%` }}
          animate={{ y: ['-5%', '110%'], opacity: [0, 0.8, 0], rotate: [0, 360] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {/* Small elliptical petal shape */}
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <ellipse cx="5" cy="7" rx="4" ry="6" fill="#F5B4A5" opacity="0.75" transform="rotate(-20 5 7)" />
          </svg>
        </motion.div>
      ))}

      {/* ── Main content container ── */}
      <div className="relative max-w-[1200px] mx-auto px-10 py-20 flex flex-col lg:flex-row items-center gap-0 min-h-[560px]">

        {/* ════ LEFT — Text content ════ */}
        <div className="flex-1 flex flex-col z-10 lg:pr-8">

          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-korean font-medium text-[#2B2B2B] mb-4"
            style={{ fontSize: '18px' }}
          >
            안녕하세요! ✿
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-bold text-[#2B2B2B] leading-tight mb-3"
            style={{ fontSize: 'clamp(40px, 5.5vw, 64px)' }}
          >
            Welcome to
            <br />
            <span className="block">Dibrugarh</span>
            <span className="block" style={{ color: '#8B1E24' }}>Korean Club</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="font-heading font-semibold mb-6"
            style={{ fontSize: '20px', color: '#8B1E24' }}
          >
            Language. Culture. Connection.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-sans text-[#555555] leading-relaxed mb-8 max-w-sm"
            style={{ fontSize: '16px' }}
          >
            A vibrant community of Korean language learners
            and culture enthusiasts from Dibrugarh University.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-row gap-4 flex-wrap"
          >
            <Link
              href="/community"
              className="inline-flex items-center gap-2 font-sans font-semibold text-white transition-all hover:shadow-lg active:scale-95"
              style={{
                background: '#8B1E24',
                height: '46px',
                padding: '0 24px',
                borderRadius: '24px',
                fontSize: '15px',
              }}
            >
              Join the Club
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-sans font-medium transition-all hover:bg-primary/5 active:scale-95"
              style={{
                color: '#8B1E24',
                height: '46px',
                padding: '0 24px',
                borderRadius: '24px',
                fontSize: '15px',
                border: '1px solid #D9B8A8',
              }}
            >
              Explore More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* ════ RIGHT — Illustration (hidden on mobile, visible lg+) ════ */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex flex-1 relative items-center justify-center"
          style={{ minHeight: '420px', background: '#FAF6F0' }}
        >
          {/* Soft circular glow — matches bg exactly so edges are invisible */}
          <div
            className="absolute"
            style={{
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #F0DDD0 0%, #FAF6F0 65%, transparent 100%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
            }}
          />

          {/* Illustration — static, no floating animation */}
          <div
            className="relative z-10"
            style={{ width: '100%', maxWidth: '500px', background: '#FAF6F0' }}
          >
            <Image
              src="/hero-illustration.png"
              alt="Korean traditional pavilion with cherry blossoms and lantern"
              width={500}
              height={440}
              className="w-full h-auto object-contain"
              style={{ mixBlendMode: 'multiply', display: 'block' }}
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
