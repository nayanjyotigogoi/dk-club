'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Flame, ChevronLeft, Sparkles, BookOpen } from 'lucide-react'
import { API_BASE, type ApiPhrase, type ApiFunFact } from '@/lib/api'
import { getDailyItem, getPreviousItem, formatDailyDate, recordVisitAndGetStreak } from '@/lib/daily'

// ── Web Speech API helper ────────────────────────────────────────────────────
function speak(text: string) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ko-KR'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

// ── Phrase card ───────────────────────────────────────────────────────────────
function PhraseCard({ phrase, prev, streak }: {
  phrase: ApiPhrase | null
  prev: ApiPhrase | null
  streak: number
}) {
  const [playing, setPlaying] = useState(false)

  const handleSpeak = () => {
    if (!phrase) return
    setPlaying(true)
    speak(phrase.korean)
    setTimeout(() => setPlaying(false), 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1.5px solid #F5CECA' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid #FEF3F0' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FEF3F0' }}>
            <Volume2 size={13} color="#8B1E24" />
          </div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
            Phrase of the Day
          </span>
        </div>
        {streak >= 2 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
            <Flame size={10} color="#EA580C" />
            <span className="font-sans text-[10px] font-bold" style={{ color: '#EA580C' }}>{streak} day streak</span>
          </div>
        )}
      </div>

      {/* Main phrase */}
      <div className="flex-1 flex flex-col justify-center px-5 py-5">
        {phrase ? (
          <>
            <div className="flex items-start gap-3 mb-3">
              <button
                onClick={handleSpeak}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                style={{
                  background: playing ? '#8B1E24' : '#FEF3F0',
                  border: `1.5px solid ${playing ? '#8B1E24' : '#F5CECA'}`,
                }}
                aria-label="Play pronunciation"
              >
                <Volume2 size={14} color={playing ? '#fff' : '#8B1E24'} />
              </button>
              <div>
                <p className="font-heading font-bold leading-tight mb-0.5" style={{ fontSize: 'clamp(22px, 3vw, 30px)', color: '#1A1008', fontFamily: "'Malgun Gothic', 'Noto Serif KR', serif" }}>
                  {phrase.korean}
                </p>
                <p className="font-sans italic" style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  {phrase.romanized}
                </p>
              </div>
            </div>
            <p className="font-sans font-medium" style={{ fontSize: '15px', color: '#4B3B2A' }}>
              {phrase.english}
            </p>
          </>
        ) : (
          <p className="font-sans text-sm" style={{ color: '#9CA3AF' }}>Loading today's phrase…</p>
        )}
      </div>

      {/* Yesterday teaser */}
      {prev && (
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid #FEF3F0', background: '#FDFAF8' }}>
          <ChevronLeft size={12} color="#C4A89A" />
          <span className="font-sans" style={{ fontSize: '11px', color: '#C4A89A' }}>
            Yesterday: <span style={{ color: '#8B6A5A', fontWeight: 600 }}>{prev.korean}</span> — {prev.english}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ── DKC Spotlight card ────────────────────────────────────────────────────────
function SpotlightCard({ spotlight }: { spotlight: ApiFunFact | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1.5px solid #C8DFC8' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid #EEF5EE' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EEF5EE' }}>
            <BookOpen size={13} color="#3B6B3A" />
          </div>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest" style={{ color: '#3B6B3A' }}>
            DKC Daily
          </span>
        </div>
        {spotlight?.korean_word && (
          <span
            className="font-heading font-bold px-2 py-0.5 rounded-full"
            style={{ fontSize: '13px', background: '#EEF5EE', color: '#3B6B3A', fontFamily: "'Malgun Gothic', serif" }}
          >
            {spotlight.korean_word}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-5 py-5">
        {spotlight ? (
          <p className="font-sans leading-relaxed" style={{ fontSize: '14px', color: '#334155', lineHeight: 1.75 }}>
            {spotlight.fact}
          </p>
        ) : (
          <p className="font-sans text-sm" style={{ color: '#9CA3AF' }}>Loading today's tip…</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid #EEF5EE', background: '#F7FBF7' }}>
        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6A9A69' }}>
          Dibrugarh Korean Club · {spotlight?.romanized ?? 'Daily Tip'}
        </span>
      </div>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export function DailyDiscoverySection() {
  const [phrase, setPhrase] = useState<ApiPhrase | null>(null)
  const [prevPhrase, setPrevPhrase] = useState<ApiPhrase | null>(null)
  const [spotlight, setSpotlight] = useState<ApiFunFact | null>(null)
  const [streak, setStreak] = useState(0)
  const [dateLabel, setDateLabel] = useState('')

  useEffect(() => {
    setDateLabel(formatDailyDate())
    setStreak(recordVisitAndGetStreak())

    // Phrase of the Day: check for a featured (pinned) phrase first, else daily rotation
    fetch(`${API_BASE}/phrases/featured`)
      .then(r => r.json())
      .then((featured: ApiPhrase | null) => {
        if (featured?.id) {
          setPhrase(featured)
        } else {
          fetch(`${API_BASE}/phrases`)
            .then(r => r.json())
            .then((data: ApiPhrase[]) => {
              if (data?.length) {
                setPhrase(getDailyItem(data))
                setPrevPhrase(getPreviousItem(data))
              }
            })
            .catch(() => {})
        }
      })
      .catch(() => {
        fetch(`${API_BASE}/phrases`)
          .then(r => r.json())
          .then((data: ApiPhrase[]) => {
            if (data?.length) {
              setPhrase(getDailyItem(data))
              setPrevPhrase(getPreviousItem(data))
            }
          })
          .catch(() => {})
      })

    // DKC Spotlight: fetch club_tip type from fun-facts, rotate daily
    fetch(`${API_BASE}/fun-facts?type=club_tip`)
      .then(r => r.json())
      .then((data: ApiFunFact[]) => { if (data?.length) setSpotlight(getDailyItem(data)) })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-background" style={{ borderTop: '1px solid #E8DCCF', borderBottom: '1px solid #E8DCCF', padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} color="#8B1E24" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
                Daily Korean
              </span>
            </div>
            <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(20px, 3vw, 26px)', color: '#1A1008', lineHeight: 1.1 }}>
              오늘의 한국어
            </h2>
          </div>
          {dateLabel && (
            <span className="font-sans" style={{ fontSize: '12px', color: '#9CA3AF' }}>
              {dateLabel}
            </span>
          )}
        </motion.div>

        {/* 2-card grid */}
        <style>{`
          .daily-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          @media (max-width: 700px) { .daily-grid { grid-template-columns: 1fr; } }
        `}</style>
        <div className="daily-grid">
          <PhraseCard phrase={phrase} prev={prevPhrase} streak={streak} />
          <SpotlightCard spotlight={spotlight} />
        </div>
      </div>
    </section>
  )
}
