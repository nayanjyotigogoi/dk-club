'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ChevronLeft, HelpCircle } from 'lucide-react'
import { fetchLessonQuiz } from '@/lib/learning/api'
import type { ApiQuizQuestion } from '@/lib/learning/types'

const ACCENT = '#8B3A1A'
const TINT   = '#F8F0E8'
const BORDER = '#DFC89A'

// ─── Types ────────────────────────────────────────────────────────────────────

type AnswerState = 'unanswered' | 'correct' | 'wrong'

interface SessionQuestion extends ApiQuizQuestion {
  userAnswer: number | null
  state: AnswerState
}

// ─── Option button ────────────────────────────────────────────────────────────

function OptionButton({
  index, text, state, selected, disabled, onClick,
}: {
  index: number
  text: string
  state: AnswerState
  selected: boolean
  disabled: boolean
  onClick: () => void
}) {
  let bg = '#FFFFFF'
  let border = BORDER
  let color = '#2B2B2B'

  if (selected && state === 'correct') { bg = '#EAF7EA'; border = '#4CAF50'; color = '#2E7D32' }
  if (selected && state === 'wrong')   { bg = '#FDECEA'; border = '#E53935'; color = '#C62828' }

  const letters = ['A', 'B', 'C', 'D']

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full text-left rounded-xl transition-all"
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        padding: '14px 18px',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color,
      }}
    >
      <span
        className="font-heading font-bold flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 28, height: 28, fontSize: '13px',
          background: selected ? (state === 'correct' ? '#4CAF50' : state === 'wrong' ? '#E53935' : ACCENT) : '#F0EAE2',
          color: selected ? '#FFF' : '#6B5040',
        }}
      >
        {letters[index]}
      </span>
      <span className="font-sans text-sm leading-snug">{text}</span>
    </button>
  )
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({ questions, lessonSlug, lessonTitle, onRestart }: {
  questions: SessionQuestion[]
  lessonSlug: string
  lessonTitle: string
  onRestart: () => void
}) {
  const correct = questions.filter(q => q.state === 'correct').length
  const total   = questions.length
  const pct     = Math.round((correct / total) * 100)
  const passed  = pct >= 60

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center"
      style={{ padding: '48px 32px', maxWidth: 480, margin: '0 auto' }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: passed ? '#EAF7EA' : TINT, border: `2px solid ${passed ? '#4CAF50' : BORDER}` }}
      >
        {passed
          ? <CheckCircle2 size={40} color="#4CAF50" />
          : <HelpCircle size={40} color={ACCENT} />
        }
      </div>

      <p className="font-heading font-bold text-[#2B2B2B] text-4xl mb-1">{pct}%</p>
      <p className="font-sans text-[#777] text-sm mb-6">
        {correct} / {total} correct
        {passed ? ' — Well done!' : ' — Keep practising!'}
      </p>

      {/* Per-question summary */}
      <div className="w-full space-y-2 mb-8 text-left">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="flex items-start gap-3 rounded-xl px-4 py-3"
            style={{ background: q.state === 'correct' ? '#EAF7EA' : '#FDECEA', border: `1px solid ${q.state === 'correct' ? '#A5D6A7' : '#FFCDD2'}` }}
          >
            {q.state === 'correct'
              ? <CheckCircle2 size={16} color="#4CAF50" className="mt-0.5 flex-shrink-0" />
              : <XCircle size={16} color="#E53935" className="mt-0.5 flex-shrink-0" />
            }
            <div className="min-w-0">
              <p className="font-sans text-xs text-[#2B2B2B] leading-snug">{q.question_text}</p>
              {q.state === 'wrong' && q.options?.[q.correct_index] && (
                <p className="font-sans text-[10px] text-[#777] mt-1">
                  Correct: {(q.options[q.correct_index] as any).text ?? q.options[q.correct_index]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 font-sans font-semibold rounded-full transition-all hover:opacity-80"
          style={{ background: TINT, color: ACCENT, border: `1px solid ${BORDER}`, padding: '10px 22px', fontSize: '14px' }}
        >
          <RotateCcw size={14} /> Try Again
        </button>
        <Link
          href={`/learn/lessons/${lessonSlug}`}
          className="inline-flex items-center gap-2 font-sans font-semibold rounded-full transition-all hover:opacity-90"
          style={{ background: ACCENT, color: '#FFF', padding: '10px 22px', fontSize: '14px' }}
        >
          Back to Lesson <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Main quiz session ────────────────────────────────────────────────────────

export default function QuizSessionPage() {
  const { slug } = useParams<{ slug: string }>()
  const router   = useRouter()

  const [questions, setQuestions]   = useState<SessionQuestion[]>([])
  const [current, setCurrent]       = useState(0)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [lessonTitle, setLessonTitle] = useState('')
  const [done, setDone]             = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError(false)
    fetchLessonQuiz(slug)
      .then(res => {
        setLessonTitle(res.lesson_title)
        setQuestions(res.data.map(q => ({ ...q, userAnswer: null, state: 'unanswered' })))
        setCurrent(0)
        setDone(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => { load() }, [load])

  function selectAnswer(optionIndex: number) {
    if (questions[current].state !== 'unanswered') return
    const isCorrect = optionIndex === questions[current].correct_index

    setQuestions(prev => prev.map((q, i) =>
      i === current
        ? { ...q, userAnswer: optionIndex, state: isCorrect ? 'correct' : 'wrong' }
        : q
    ))
  }

  function next() {
    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  function restart() {
    setQuestions(prev => prev.map(q => ({ ...q, userAnswer: null, state: 'unanswered' })))
    setCurrent(0)
    setDone(false)
  }

  // ── Loading ──
  if (loading) return (
    <div style={{ padding: '48px 32px' }}>
      <div className="animate-pulse space-y-4 max-w-lg">
        <div className="h-4 w-32 rounded" style={{ background: BORDER }} />
        <div className="h-6 w-2/3 rounded" style={{ background: BORDER }} />
        <div className="h-32 rounded-xl" style={{ background: BORDER }} />
        {[1,2,3,4].map(i => <div key={i} className="h-12 rounded-xl" style={{ background: BORDER }} />)}
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center text-center" style={{ padding: '64px 32px' }}>
      <HelpCircle size={40} color={ACCENT} style={{ marginBottom: 16, opacity: 0.5 }} />
      <p className="font-heading font-semibold text-[#2B2B2B]">Could not load quiz</p>
      <p className="font-sans text-sm text-[#777] mt-1 mb-4">Check your connection and try again.</p>
      <button onClick={load} className="font-sans text-sm font-medium" style={{ color: ACCENT }}>Retry</button>
    </div>
  )

  if (questions.length === 0) return (
    <div className="flex flex-col items-center text-center" style={{ padding: '64px 32px' }}>
      <p className="font-heading font-semibold text-[#2B2B2B] mb-2">No quiz questions yet</p>
      <p className="font-sans text-sm text-[#777]">This lesson doesn't have any questions assigned.</p>
      <Link href="/learn/practice" className="font-sans text-sm mt-4" style={{ color: ACCENT }}>← Back to Practice</Link>
    </div>
  )

  if (done) return (
    <ResultScreen
      questions={questions}
      lessonSlug={slug}
      lessonTitle={lessonTitle}
      onRestart={restart}
    />
  )

  const q = questions[current]
  const answered = q.state !== 'unanswered'
  const progress = ((current) / questions.length) * 100

  return (
    <div style={{ padding: '24px 32px', maxWidth: 560 }}>

      {/* Back link */}
      <Link
        href="/learn/practice"
        className="inline-flex items-center gap-1.5 font-sans text-sm mb-6 hover:underline"
        style={{ color: ACCENT }}
      >
        <ChevronLeft size={14} /> Practice
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full" style={{ background: BORDER }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: ACCENT }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="font-sans text-xs flex-shrink-0" style={{ color: '#999' }}>
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
        >
          <div
            className="rounded-2xl mb-5"
            style={{ background: TINT, border: `1px solid ${BORDER}`, padding: '22px 24px' }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: ACCENT }}>
              Question {current + 1}
            </p>
            <p className="font-heading font-semibold text-[#2B2B2B] leading-snug" style={{ fontSize: '18px' }}>
              {q.question_text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {(q.options ?? []).map((opt, i) => (
              <OptionButton
                key={i}
                index={i}
                text={typeof opt === 'string' ? opt : (opt as any).text}
                state={q.userAnswer === i ? q.state : 'unanswered'}
                selected={q.userAnswer === i}
                disabled={answered}
                onClick={() => selectAnswer(i)}
              />
            ))}
          </div>

          {/* Explanation (shown after answering) */}
          {answered && (q.explanation_en || q.explanation_as) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl mb-5"
              style={{
                background: q.state === 'correct' ? '#EAF7EA' : '#FDECEA',
                border: `1px solid ${q.state === 'correct' ? '#A5D6A7' : '#FFCDD2'}`,
                padding: '14px 18px',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {q.state === 'correct'
                  ? <CheckCircle2 size={15} color="#4CAF50" />
                  : <XCircle size={15} color="#E53935" />
                }
                <span className="font-sans font-semibold text-xs" style={{ color: q.state === 'correct' ? '#2E7D32' : '#C62828' }}>
                  {q.state === 'correct' ? 'Correct!' : 'Not quite'}
                </span>
              </div>
              {q.explanation_en && <p className="font-sans text-sm text-[#444] leading-relaxed">{q.explanation_en}</p>}
              {q.explanation_as && <p className="font-sans text-sm text-[#555] leading-relaxed mt-1">{q.explanation_as}</p>}
            </motion.div>
          )}

          {/* Next button */}
          {answered && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={next}
              className="w-full font-sans font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: ACCENT, color: '#FFF', padding: '13px', fontSize: '15px' }}
            >
              {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
              <ArrowRight size={16} />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
