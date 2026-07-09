'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, RotateCcw, CheckCircle2, ChevronRight, Eye } from 'lucide-react'
import { fetchModuleLessons, fetchLesson } from '@/lib/learning/api'
import type { ApiVocabularyEntry } from '@/lib/learning/types'

const ACCENT = '#4A3A6B'
const TINT   = '#F0EEF8'
const BORDER = '#C5BFDF'

// ─── Individual flashcard ─────────────────────────────────────────────────────

function Flashcard({ entry, flipped, onFlip }: {
  entry: ApiVocabularyEntry
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: '1200px', width: '100%', maxWidth: 440, margin: '0 auto' }}
      onClick={onFlip}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', height: 260 }}
      >
        {/* Front — Korean */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3"
          style={{
            backfaceVisibility: 'hidden',
            background: TINT,
            border: `1.5px solid ${BORDER}`,
            padding: '32px 24px',
          }}
        >
          <p
            className="font-korean font-bold text-center leading-tight"
            style={{ fontSize: '48px', color: '#2B2B2B' }}
          >
            {entry.korean}
          </p>
          <p className="font-sans text-sm text-center" style={{ color: '#999' }}>
            {entry.romanization}
          </p>
          <div className="flex items-center gap-1.5 mt-3" style={{ color: ACCENT, opacity: 0.6 }}>
            <Eye size={13} />
            <span className="font-sans text-xs">Tap to reveal</span>
          </div>
        </div>

        {/* Back — Assamese + English */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#FFFFFF',
            border: `1.5px solid ${BORDER}`,
            padding: '24px',
          }}
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: ACCENT, opacity: 0.6 }}>
            {entry.part_of_speech}
          </p>
          <p
            className="font-sans font-semibold text-center"
            style={{ fontSize: '22px', color: '#2B2B2B' }}
          >
            {entry.assamese}
          </p>
          <p className="font-sans text-center" style={{ fontSize: '16px', color: '#777' }}>
            {entry.english}
          </p>
          {entry.example_ko && (
            <div
              className="mt-3 rounded-xl text-center"
              style={{ background: TINT, border: `1px solid ${BORDER}`, padding: '10px 16px', maxWidth: '100%' }}
            >
              <p className="font-korean text-sm text-[#2B2B2B]">{entry.example_ko}</p>
              {entry.example_en && <p className="font-sans text-xs text-[#999] mt-1">{entry.example_en}</p>}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Session complete ─────────────────────────────────────────────────────────

function SessionComplete({ total, known, onRestart, onReviewMissed, hasMissed }: {
  total: number
  known: number
  onRestart: () => void
  onReviewMissed: () => void
  hasMissed: boolean
}) {
  const pct = Math.round((known / total) * 100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center"
      style={{ padding: '48px 32px', maxWidth: 440, margin: '0 auto' }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: TINT, border: `2px solid ${BORDER}` }}
      >
        <CheckCircle2 size={40} color={ACCENT} />
      </div>
      <p className="font-heading font-bold text-[#2B2B2B] text-4xl mb-1">{pct}%</p>
      <p className="font-sans text-[#777] text-sm mb-2">{known} / {total} known</p>
      <p className="font-sans text-[#555] text-sm mb-8 max-w-xs leading-relaxed">
        {pct === 100
          ? 'Perfect round! Every card was marked as known.'
          : 'Session complete. Review the ones you missed to reinforce them.'}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 font-sans font-semibold rounded-full transition-all hover:opacity-80"
          style={{ background: TINT, color: ACCENT, border: `1px solid ${BORDER}`, padding: '10px 22px', fontSize: '14px' }}
        >
          <RotateCcw size={14} /> Restart All
        </button>
        {hasMissed && (
          <button
            onClick={onReviewMissed}
            className="inline-flex items-center gap-2 font-sans font-semibold rounded-full transition-all hover:opacity-90"
            style={{ background: ACCENT, color: '#FFF', padding: '10px 22px', fontSize: '14px' }}
          >
            Review Missed <ChevronRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main flashcard session ───────────────────────────────────────────────────

export default function FlashcardSessionPage() {
  const { moduleId } = useParams<{ moduleId: string }>()

  const [cards, setCards]       = useState<ApiVocabularyEntry[]>([])
  const [current, setCurrent]   = useState(0)
  const [flipped, setFlipped]   = useState(false)
  const [known, setKnown]       = useState<Set<number>>(new Set())
  const [missed, setMissed]     = useState<Set<number>>(new Set())
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [done, setDone]         = useState(false)

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const lessons = await fetchModuleLessons(Number(moduleId))
      // Fetch all lessons in parallel, collect vocabulary, deduplicate by id
      const lessonDetails = await Promise.all(lessons.map(l => fetchLesson(l.slug)))
      const seen = new Set<number>()
      const all: ApiVocabularyEntry[] = []
      for (const lesson of lessonDetails) {
        for (const v of lesson.vocabulary) {
          if (!seen.has(v.id)) { seen.add(v.id); all.push(v) }
        }
      }
      // Shuffle for variety
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[all[i], all[j]] = [all[j], all[i]]
      }
      setCards(all)
      setCurrent(0)
      setFlipped(false)
      setKnown(new Set())
      setMissed(new Set())
      setDone(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [moduleId])

  useEffect(() => { loadCards() }, [loadCards])

  function markKnown() {
    setKnown(prev => new Set([...prev, cards[current].id]))
    advance()
  }

  function markMissed() {
    setMissed(prev => new Set([...prev, cards[current].id]))
    advance()
  }

  function advance() {
    setFlipped(false)
    if (current + 1 >= cards.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  function restart() {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cards[i], cards[j]] = [cards[j], cards[i]]
    }
    setCards([...cards])
    setCurrent(0)
    setFlipped(false)
    setKnown(new Set())
    setMissed(new Set())
    setDone(false)
  }

  function reviewMissed() {
    const missedCards = cards.filter(c => missed.has(c.id))
    setCards(missedCards)
    setCurrent(0)
    setFlipped(false)
    setKnown(new Set())
    setMissed(new Set())
    setDone(false)
  }

  // ── Loading ──
  if (loading) return (
    <div style={{ padding: '48px 32px' }}>
      <div className="animate-pulse space-y-4" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div className="h-4 w-24 rounded" style={{ background: BORDER }} />
        <div className="h-64 rounded-2xl" style={{ background: BORDER }} />
        <div className="flex gap-3">
          <div className="flex-1 h-12 rounded-xl" style={{ background: BORDER }} />
          <div className="flex-1 h-12 rounded-xl" style={{ background: BORDER }} />
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center text-center" style={{ padding: '64px 32px' }}>
      <p className="font-heading font-semibold text-[#2B2B2B]">Could not load flashcards</p>
      <button onClick={loadCards} className="font-sans text-sm mt-3" style={{ color: ACCENT }}>Retry</button>
    </div>
  )

  if (cards.length === 0) return (
    <div className="flex flex-col items-center text-center" style={{ padding: '64px 32px' }}>
      <p className="font-heading font-semibold text-[#2B2B2B] mb-2">No vocabulary in this module yet</p>
      <Link href="/learn/revision" className="font-sans text-sm" style={{ color: ACCENT }}>← Back to Revision</Link>
    </div>
  )

  if (done) return (
    <SessionComplete
      total={cards.length}
      known={known.size}
      onRestart={restart}
      onReviewMissed={reviewMissed}
      hasMissed={missed.size > 0}
    />
  )

  const card = cards[current]
  const progress = (current / cards.length) * 100

  return (
    <div style={{ padding: '24px 32px', maxWidth: 520, margin: '0 auto' }}>

      {/* Back */}
      <Link
        href="/learn/revision"
        className="inline-flex items-center gap-1.5 font-sans text-sm mb-6 hover:underline"
        style={{ color: ACCENT }}
      >
        <ChevronLeft size={14} /> Revision
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: BORDER }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: ACCENT }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <span className="font-sans text-xs flex-shrink-0" style={{ color: '#999' }}>
          {current + 1} / {cards.length}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-6 justify-center">
        <span className="font-sans text-xs" style={{ color: '#4CAF50' }}>✓ {known.size} known</span>
        <span className="font-sans text-xs" style={{ color: '#E53935' }}>✗ {missed.size} missed</span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Flashcard entry={card} flipped={flipped} onFlip={() => setFlipped(f => !f)} />
        </motion.div>
      </AnimatePresence>

      {/* Action buttons — only show after flipping */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 mt-6"
          >
            <button
              onClick={markMissed}
              className="flex-1 font-sans font-semibold rounded-xl transition-all hover:opacity-80"
              style={{ background: '#FDECEA', color: '#C62828', border: '1.5px solid #FFCDD2', padding: '13px', fontSize: '14px' }}
            >
              ✗ Still learning
            </button>
            <button
              onClick={markKnown}
              className="flex-1 font-sans font-semibold rounded-xl transition-all hover:opacity-90"
              style={{ background: '#EAF7EA', color: '#2E7D32', border: '1.5px solid #A5D6A7', padding: '13px', fontSize: '14px' }}
            >
              ✓ I know this
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!flipped && (
        <p className="font-sans text-xs text-center mt-5" style={{ color: '#BBB' }}>
          Tap the card to see the meaning
        </p>
      )}

    </div>
  )
}
