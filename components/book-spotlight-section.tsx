'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react'

export function BookSpotlightSection() {
  const [showBack, setShowBack] = useState(false)

  return (
    <section className="py-16 sm:py-24" style={{ background: '#F5EDE2' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-12"
        >
          <Sparkles size={14} style={{ color: '#8B1E24' }} />
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
            새 책 출판 · New Book Release
          </span>
          <div className="h-px flex-1" style={{ background: '#DDD0BC' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Book cover display */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Book with 3D tilt */}
            <div className="relative" style={{ perspective: '1000px' }}>
              <div
                style={{
                  transform: 'rotateY(-8deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                  filter: 'drop-shadow(20px 30px 40px rgba(26,10,5,0.35))',
                }}
              >
                <AnimatePresence mode="wait">
                  {!showBack ? (
                    <motion.img
                      key="front"
                      src="/images/book-cover-front.jpg"
                      alt="আত্মানুসন্ধানত ধ্যানৰ যাত্ৰা — front cover"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-lg object-cover"
                      style={{ width: '260px', height: '370px' }}
                      draggable={false}
                    />
                  ) : (
                    <motion.img
                      key="back"
                      src="/images/book-cover-back.jpg"
                      alt="আত্মানুসন্ধানত ধ্যানৰ যাত্ৰা — back cover"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-lg object-cover"
                      style={{ width: '260px', height: '370px' }}
                      draggable={false}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Reflection */}
              <div
                className="absolute left-0 right-0 rounded-b-lg pointer-events-none"
                style={{
                  top: '100%',
                  height: '60px',
                  background: 'linear-gradient(to bottom, rgba(139,30,36,0.06), transparent)',
                  transform: 'scaleY(-1) rotateY(-8deg)',
                  filter: 'blur(4px)',
                  opacity: 0.4,
                }}
              />
            </div>

            {/* Flip + Price row */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBack(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
                style={{
                  background: '#EDE0D0',
                  color: '#6B5C4A',
                  border: '1px solid #D8C8B0',
                }}
              >
                <RotateCcw size={12} />
                {showBack ? 'Front cover' : 'Back cover'}
              </button>

              <div
                className="px-5 py-2 rounded-full font-heading font-bold"
                style={{ background: '#8B1E24', color: '#FAF3ED', fontSize: '17px' }}
              >
                ₹699
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            {/* Language tag */}
            <span
              className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full font-sans text-[11px] font-bold uppercase tracking-wider"
              style={{ background: '#FDEAEA', color: '#8B1E24', border: '1px solid #F0C8C8' }}
            >
              🇰🇷 Korean · 🇮🇳 Assamese
            </span>

            {/* Korean script title */}
            <p
              className="font-sans"
              style={{ fontSize: '14px', color: '#8B6A50', letterSpacing: '0.04em' }}
            >
              나를 찾아가는 명상여행
            </p>

            {/* Main Assamese title */}
            <h2
              className="font-heading font-bold"
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                color: '#1A1008',
                lineHeight: 1.2,
              }}
            >
              আত্মানুসন্ধানত<br />ধ্যানৰ যাত্ৰা
            </h2>

            {/* English subtitle */}
            <p
              className="font-sans italic font-medium"
              style={{ fontSize: '16px', color: '#6B5C4A' }}
            >
              "A Meditation Journey for Seeking Myself"
            </p>

            {/* Hairline */}
            <div className="h-px w-16" style={{ background: '#8B1E24', opacity: 0.4 }} />

            {/* Description */}
            <p
              className="font-sans"
              style={{ fontSize: '14.5px', color: '#5A4A3A', lineHeight: 1.9 }}
            >
              A Korean Buddhist monk's journey of inner discovery — now available in Assamese,
              translated by <span className="font-semibold" style={{ color: '#1A1008' }}>Debojani Das</span>.
              A rare cultural bridge between Korea and Assam, this book speaks to anyone seeking
              stillness, clarity, and a deeper understanding of the self.
            </p>

            {/* Detail rows */}
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: '#EDE0D0', border: '1px solid #DDD0BC' }}
            >
              {[
                ['Author',      'Monk Jung Yeo · 정여 스님'],
                ['Translator',  'Debojani Das'],
                ['Publisher',   'Mahaveer Publications'],
                ['ISBN',        '978-93-48070-25-8'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start gap-3 font-sans text-[13px]">
                  <span className="font-semibold flex-shrink-0 w-24" style={{ color: '#8B6A50' }}>{label}</span>
                  <span style={{ color: '#1A1008' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1">
              <Link
                href="/goodies?preselect=book-meditation"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-sans font-bold transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: '#8B1E24',
                  color: '#FAF3ED',
                  fontSize: '14px',
                  boxShadow: '0 6px 20px rgba(139,30,36,0.28)',
                  transition: 'all 0.2s',
                }}
              >
                Order Your Copy <ArrowRight size={16} />
              </Link>
              <p className="font-sans text-xs" style={{ color: '#9CA3AF' }}>
                Fill the order form · Delivery across India
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
