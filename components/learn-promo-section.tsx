'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, MessageCircle, Globe2, ArrowRight, Sparkles } from 'lucide-react'

const features = [
  { icon: BookOpen,       title: 'Structured Lessons',    korean: '체계적인 수업', body: 'From Hangul basics to everyday conversations — 30 lessons across 3 levels.' },
  { icon: MessageCircle,  title: 'Real Conversations',    korean: '실제 대화',    body: 'Practice with authentic dialogues used in Korean daily life.' },
  { icon: Globe2,         title: 'Assamese & English',    korean: '아삼어 + 영어', body: 'Every word and grammar point explained in both Assamese and English.' },
  { icon: GraduationCap,  title: 'Quizzes & Practice',   korean: '퀴즈 연습',    body: 'Test yourself with topic-based quizzes after every lesson.' },
]

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  )
}

export function LearnPromoSection() {
  return (
    <section style={{ background: '#FAF3ED', borderTop: '1px solid #E8DCCF', borderBottom: '1px solid #E8DCCF' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <FadeUp>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" style={{ color: '#8B1E24' }} />
                <span className="font-korean text-[#8B1E24]/70 text-sm">완전 무료</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl lg:text-4xl leading-tight">
                Learn Korean — <span style={{ color: '#8B1E24' }}>Free, Forever</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="font-sans text-[#666] text-base mt-3 max-w-xl leading-relaxed">
                DKC&apos;s learning platform is built for Assamese speakers. No app to install, no subscription — just open a lesson and start.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 font-sans font-semibold transition-all hover:shadow-lg active:scale-95 flex-shrink-0"
              style={{
                background: '#8B1E24',
                color: '#FFFFFF',
                height: '46px',
                padding: '0 28px',
                borderRadius: '24px',
                fontSize: '15px',
              }}
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map((f, i) => (
            <FadeUp key={i} delay={0.1 + i * 0.07}>
              <div
                className="rounded-2xl p-6 h-full"
                style={{ background: '#FFFFFF', border: '1px solid #E8DCCF' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#FAF6F0' }}
                >
                  <f.icon className="w-5 h-5" style={{ color: '#8B1E24' }} />
                </div>
                <p className="font-heading font-semibold text-[#2B2B2B] text-sm mb-0.5">{f.title}</p>
                <p className="font-korean text-[#8B1E24]/50 text-xs mb-2">{f.korean}</p>
                <p className="font-sans text-[#777] text-sm leading-relaxed">{f.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Progress bar visual */}
        <FadeUp delay={0.35}>
          <div
            className="rounded-2xl p-7 flex flex-col sm:flex-row gap-6 items-center justify-between"
            style={{ background: '#8B1E24' }}
          >
            <div>
              <p className="font-heading font-bold text-white text-2xl mb-1">3 Levels · 30 Lessons</p>
              <p className="font-sans text-white/60 text-sm">Beginner → Intermediate → Advanced</p>
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-wrap justify-center">
              {[
                { label: 'Beginner',     korean: '초급', count: '10 lessons' },
                { label: 'Intermediate', korean: '중급', count: '10 lessons' },
                { label: 'Advanced',     korean: '고급', count: '10 lessons' },
              ].map(l => (
                <div
                  key={l.label}
                  className="text-center rounded-xl px-5 py-3"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
                >
                  <p className="font-heading font-bold text-white text-sm">{l.label}</p>
                  <p className="font-korean text-white/50 text-xs">{l.korean}</p>
                  <p className="font-sans text-white/40 text-[11px] mt-0.5">{l.count}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
