'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const pillars = [
  { korean: '언어', title: 'Language', icon: '가', body: 'Hangul, grammar, romanisation, vocabulary — the building blocks of Korean communication.' },
  { korean: '음식', title: 'Food',     icon: '밥', body: 'From kimchi and bibimbap to tteokbokki and makgeolli — Korean cuisine is a culture in itself.' },
  { korean: '예술', title: 'Art',      icon: '화', body: 'Celadon pottery, minhwa folk painting, calligraphy, and the modern wave of contemporary Korean artists.' },
  { korean: '음악', title: 'Music',    icon: '악', body: 'Pansori traditional opera, samulnori drumming, trot, indie, and the global force of K-pop.' },
  { korean: '영화', title: 'Cinema',   icon: '영', body: 'A film tradition of depth and innovation — from Im Kwon-taek to Bong Joon-ho and beyond.' },
  { korean: '축제', title: 'Festivals', icon: '절', body: 'Seollal, Chuseok, Hangul Day, Buddha\'s Birthday — a calendar rich with meaning and celebration.' },
]

const deepDives = [
  {
    korean: '한복',
    title: 'Hanbok — The Art of Wearing Culture',
    body: `Hanbok (한복) is the traditional clothing of Korea, characterised by its bright colours, clean lines, and simple design. While its roots stretch back over 1,600 years to the Three Kingdoms period, hanbok has never truly left — it continues to be worn at weddings, festivals, and holidays, and has seen a contemporary revival among young Koreans who incorporate hanbok elements into everyday fashion.\n\nTraditional hanbok differs by gender: for women, it consists of a jeogori (short jacket) and chima (full skirt); for men, it is a jeogori paired with baji (loose trousers). The jeogori features a distinctive knot called the goreum.\n\nThe colours of hanbok are not merely aesthetic — they carry symbolic meaning rooted in Taoist five-element theory. White represents purity, red symbolises fortune and protection against evil, blue represents trust and hope, and black reflects stability and formality.`,
    tag: 'Fashion & Identity',
    color: '#8B1E24',
  },
  {
    korean: '한식',
    title: 'Hansik — A Philosophy of Eating',
    body: `Korean cuisine (한식, hansik) is one of the most nutritionally considered food traditions in the world. The central concept of balance — of flavours, temperatures, colours and textures — is not just culinary preference but a reflection of broader Korean philosophy.\n\nNo Korean meal is complete without banchan — a collection of small shared side dishes accompanying rice. The most iconic of these is kimchi (김치), fermented vegetables (usually cabbage) seasoned with gochugaru, garlic, ginger and jeotgal. There are said to be over 200 varieties of kimchi.\n\nKorean food culture is deeply communal. Meals are shared from communal dishes, and the act of eating together — whether family, friends or colleagues — carries profound social significance. The Korean phrase "밥 먹었어요?" (Have you eaten?) is as much a greeting as a question.`,
    tag: 'Food & Community',
    color: '#1E5C8B',
  },
  {
    korean: '한류',
    title: 'Hallyu — The Korean Wave',
    body: `Hallyu (한류), literally "Korean Wave," refers to the global spread of South Korean culture since the late 1990s. What began with the international popularity of Korean dramas and music has grown into one of the most significant cultural export phenomena of the 21st century.\n\nThe wave has several distinct dimensions: K-drama (K-드라마), Korean cinema, K-pop (K-팝), Korean beauty (K-beauty), Korean fashion, and Korean food. Each has cultivated dedicated global communities, study groups, fan conventions and cultural exchange programmes.\n\nAcademics point to several reasons for Hallyu\'s success: relatability of storytelling, high production quality, authenticity, and the strategic use of digital platforms. But at its core, Hallyu works because the culture it carries is genuinely compelling — human, specific, and beautifully made.`,
    tag: 'Global Culture',
    color: '#1E8B5C',
  },
]

const calendarItems = [
  { month: 'Jan', name: 'Seollal', korean: '설날', desc: 'Korean Lunar New Year. Families gather, ancestral rites are performed, and tteokguk is eaten.' },
  { month: 'Mar', name: 'Samil-jeol', korean: '삼일절', desc: 'March 1st Movement Day. Commemorates the 1919 independence movement against Japanese rule.' },
  { month: 'May', name: 'Buddha\'s Birthday', korean: '부처님오신날', desc: 'Lantern festivals light up temples and streets across the country in celebration.' },
  { month: 'Jun', name: 'Dano', korean: '단오', desc: 'Summer festival with ssireum wrestling, swinging, and traditional foods like surichwitteok.' },
  { month: 'Sep', name: 'Chuseok', korean: '추석', desc: 'Korean Harvest Festival. The most important holiday, combining ancestor rites with family reunion.' },
  { month: 'Oct', name: 'Hangul Day', korean: '한글날', desc: 'Celebrates the proclamation of Hangul in 1446 by King Sejong the Great.' },
]

const resources = [
  { name: 'Talk To Me In Korean', url: 'https://talktomeinkorean.com', desc: 'Structured Korean lessons from beginner to advanced, free and paid.' },
  { name: 'KBS World Radio', url: 'https://world.kbs.co.kr', desc: 'Korean news and cultural content from Korea\'s national broadcaster.' },
  { name: 'Korean Cultural Centre India', url: 'https://www.kccindelhi.org', desc: 'Official Korean Cultural Centre in New Delhi with events, library and scholarships.' },
  { name: 'Naver Dictionary', url: 'https://dict.naver.com', desc: 'The most comprehensive Korean dictionary, including example sentences.' },
  { name: 'Duolingo Korean', url: 'https://www.duolingo.com/course/ko/en/Learn-Korean', desc: 'Free, gamified Korean learning for absolute beginners.' },
  { name: 'Webtoon', url: 'https://www.webtoons.com', desc: 'Original Korean webtoons in Korean and English — a great reading practice tool.' },
]

export default function CulturePage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="한국 문화 탐구"
          title="Korean"
          accent="Culture"
          subtitle="Language, food, festivals, art, music and cinema — a doorway into one of the world's most distinctive living cultures."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Culture' }]}
        />

        {/* ── Pillars grid ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">문화의 기둥</p>
            <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">Six Pillars of Korean Culture</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-5 flex flex-col items-center text-center"
                style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(139,30,36,0.08)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 font-korean font-bold text-[#8B1E24] text-xl"
                  style={{ background: '#FAF3ED' }}
                >
                  {p.icon}
                </div>
                <p className="font-heading font-semibold text-[#2B2B2B] text-sm mb-0.5">{p.title}</p>
                <p className="font-korean text-[#aaa] text-xs mb-2">{p.korean}</p>
                <p className="font-sans text-[#888] text-xs leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Deep-dive articles ── */}
        <section style={{ background: '#FAF3ED', borderTop: '1px solid #E8DCCF', borderBottom: '1px solid #E8DCCF' }}>
          <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
            <div className="text-center">
              <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">깊이 알아보기</p>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">Deep Dives</h2>
            </div>
            {deepDives.map((article, i) => (
              <motion.div
                key={i}
                className="flex flex-col lg:flex-row gap-10 items-start"
                style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' } as React.CSSProperties}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Visual block */}
                <div
                  className="flex-shrink-0 w-full lg:w-72 h-52 rounded-2xl flex items-center justify-center"
                  style={{ background: article.color }}
                >
                  <span className="font-korean font-bold text-white/20 select-none" style={{ fontSize: 100 }}>
                    {article.korean}
                  </span>
                </div>
                {/* Text */}
                <div className="flex-1">
                  <span
                    className="inline-block font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                    style={{ background: '#FAF3ED', color: '#8B1E24', border: '1px solid #E8DCCF' }}
                  >
                    {article.tag}
                  </span>
                  <h3 className="font-heading font-bold text-[#2B2B2B] text-2xl mb-4">{article.title}</h3>
                  {article.body.split('\n').map((para, j) =>
                    para.trim() ? (
                      <p key={j} className="font-sans text-[#555] text-sm leading-relaxed mb-3">{para.trim()}</p>
                    ) : null
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Korean Calendar ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">문화 달력</p>
            <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">Korean Cultural Calendar</h2>
            <p className="font-sans text-[#666] text-sm mt-2 max-w-md mx-auto">Key celebrations and holidays throughout the Korean year.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {calendarItems.map((item, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-6 flex gap-5"
                style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-white text-xs text-center leading-tight"
                  style={{ background: '#8B1E24' }}
                >
                  {item.month}
                </div>
                <div>
                  <p className="font-heading font-semibold text-[#2B2B2B] text-sm mb-0.5">{item.name}</p>
                  <p className="font-korean text-[#8B1E24]/70 text-xs mb-2">{item.korean}</p>
                  <p className="font-sans text-[#666] text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Resources ── */}
        <section style={{ background: '#FAF3ED', borderTop: '1px solid #E8DCCF' }}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">학습 자료</p>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">Learning Resources</h2>
              <p className="font-sans text-[#666] text-sm mt-2 max-w-md mx-auto">Curated links to help you explore Korean language and culture further.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((r, i) => (
                <motion.a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl p-6 flex flex-col group"
                  style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(139,30,36,0.07)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-heading font-semibold text-[#2B2B2B] text-sm leading-snug">{r.name}</p>
                    <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2 text-[#ccc] group-hover:text-[#8B1E24] transition-colors" />
                  </div>
                  <p className="font-sans text-[#666] text-xs leading-relaxed flex-1">{r.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs text-[#8B1E24] font-medium">
                    Visit <ArrowRight className="w-3 h-3" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

// Needed to avoid TypeScript error on inline flexDirection
import React from 'react'
