'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Volume2, ArrowRight } from 'lucide-react'

const CHAPTERS = [
  { ko: '아', label: 'Vowels',      color: '#8B1E24', tint: '#FEF3F0', border: '#F5CECA' },
  { ko: 'ㄱ', label: 'Consonants', color: '#2D5F7A', tint: '#EBF3F8', border: '#B5D4E8' },
  { ko: '말', label: 'Words',       color: '#3B6B3A', tint: '#EEF5EE', border: '#B5D9B5' },
  { ko: '수', label: 'Numbers',     color: '#6B5C3E', tint: '#F4F0E8', border: '#D9CCAE' },
  { ko: '나', label: 'Introduce',   color: '#6B3A7A', tint: '#F5EEF8', border: '#D9B5E8' },
  { ko: '열', label: 'Native',      color: '#8B6B1A', tint: '#FBF5E6', border: '#E8D5A0' },
]

export function LearnBannerSection() {
  return (
    <section className="bg-background" style={{ borderBottom: '1px solid #E8DCCF', padding: '56px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: '#FEF3F0', border: '1px solid #F5CECA',
              borderRadius: '20px', padding: '4px 12px 4px 8px',
              marginBottom: '18px',
            }}>
              <Volume2 size={12} color="#8B1E24" />
              <span className="font-sans" style={{ fontSize: '11px', fontWeight: 700, color: '#8B1E24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Learn with Audio
              </span>
            </div>

            <h2 className="font-heading" style={{
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 800, color: '#1A1008',
              lineHeight: 1.1, letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}>
              Start speaking<br />
              <span style={{ color: '#8B1E24' }}>Korean today</span>
            </h2>

            <p className="font-sans" style={{
              fontSize: '14px', color: '#7A6A5A',
              lineHeight: 1.75, marginBottom: '20px', maxWidth: '420px',
            }}>
              Six interactive chapters — from the Hangul alphabet to full conversations. Every word has audio, with English and Assamese translations throughout.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              {['🔊 Audio on every word', '💬 6 Chapters', 'অসমীয়া translations'].map(f => (
                <span key={f} className="font-sans" style={{
                  fontSize: '11px', fontWeight: 500, color: '#4B3B2A',
                  background: '#F4EDE4', border: '1px solid #E0D0C0',
                  borderRadius: '20px', padding: '4px 12px',
                }}>
                  {f}
                </span>
              ))}
            </div>

            <Link
              href="/learn/chapters"
              className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-white rounded-full transition-all hover:shadow-md active:scale-95"
              style={{ background: '#8B1E24', padding: '11px 22px' }}
            >
              Start Learning
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Right: chapter mini-cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}
          >
            {CHAPTERS.map((ch, i) => (
              <motion.div
                key={ch.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.04 * i }}
              >
                <Link
                  href="/learn/chapters"
                  className="flex flex-col items-center gap-2 rounded-2xl no-underline transition-all hover:shadow-sm active:scale-95"
                  style={{
                    padding: '18px 10px',
                    background: ch.tint,
                    border: `1.5px solid ${ch.border}`,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{
                    fontFamily: "'Malgun Gothic', 'Noto Serif KR', serif",
                    fontSize: '36px', lineHeight: 1,
                    color: ch.color, fontWeight: 700,
                  }}>
                    {ch.ko}
                  </span>
                  <span className="font-sans" style={{
                    fontSize: '10px', fontWeight: 700,
                    color: ch.color, opacity: 0.7,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                  }}>
                    {ch.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
