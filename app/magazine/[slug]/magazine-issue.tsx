'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, ChevronRight, BookMarked } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiMagazine, type ApiArticle, API_BASE } from '@/lib/api'

// ── Inline markdown: **bold**, *italic*, `code` ────────────────────────────
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // Matches **bold**, *italic*, `code`
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[0].startsWith('**'))      parts.push(<strong key={m.index}>{m[2]}</strong>)
    else if (m[0].startsWith('*'))  parts.push(<em key={m.index}>{m[3]}</em>)
    else                            parts.push(<code key={m.index} className="font-mono text-sm bg-[#FAF3ED] text-[#8B1E24] px-1 rounded">{m[4]}</code>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

// ── Detect language from article content ────────────────────────────────────
function isKorean(text: string) {
  return /[가-힯ᄀ-ᇿ㄰-㆏]/.test(text)
}
function isAssamese(text: string) {
  return /[ঀ-৿]/.test(text)
}
function detectLang(content: string): string {
  const sample = content.slice(0, 300)
  if (isKorean(sample))   return '한국어'
  if (isAssamese(sample)) return 'অসমীয়া'
  return 'English'
}

// ── Full markdown renderer ──────────────────────────────────────────────────
function renderMarkdown(text: string, skipKoreanBlocks = false) {
  const lines   = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  // Collect consecutive list items
  let listBuf:   { ordered: boolean; content: string }[] = []
  let listOrder = false

  const flushList = () => {
    if (!listBuf.length) return
    const Tag = listOrder ? 'ol' : 'ul'
    elements.push(
      <Tag
        key={key++}
        className={`font-sans text-[#444] text-base leading-relaxed mb-5 pl-6 space-y-1 ${listOrder ? 'list-decimal' : 'list-disc'}`}
      >
        {listBuf.map((item, i) => (
          <li key={i}>{parseInline(item.content)}</li>
        ))}
      </Tag>
    )
    listBuf = []
  }

  // Collect consecutive Korean lines for a translation block
  let krBuf: string[] = []

  const flushKorean = () => {
    if (!krBuf.length) return
    elements.push(
      <div
        key={key++}
        className="my-6 rounded-xl overflow-hidden"
        style={{ border: '1px solid #E8DCCF' }}
      >
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#FAF3ED' }}>
          <span className="font-korean text-xs font-bold text-[#8B1E24]">한국어</span>
          <span className="font-sans text-[10px] text-[#bbb] uppercase tracking-widest">Korean</span>
        </div>
        <div className="px-5 py-4 space-y-2" style={{ background: '#fffcf9' }}>
          {krBuf.map((line, i) => (
            <p key={i} className="font-korean text-[#333] text-base leading-loose">
              {line}
            </p>
          ))}
        </div>
      </div>
    )
    krBuf = []
  }

  for (let i = 0; i < lines.length; i++) {
    const raw     = lines[i]
    const trimmed = raw.trim()

    // Empty line
    if (!trimmed) {
      flushList()
      flushKorean()
      key++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      flushList(); flushKorean()
      elements.push(
        <hr key={key++} className="my-8 border-none h-px" style={{ background: '#E8DCCF' }} />
      )
      continue
    }

    // H1 — suppress if it's just the article title repeated at top of body
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      flushList(); flushKorean()
      elements.push(
        <h1 key={key++} className="font-heading font-bold text-[#1A1008] mt-2 mb-4 leading-tight"
          style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}>
          {parseInline(trimmed.slice(2))}
        </h1>
      )
      continue
    }

    // H2 — suppress first H2 that duplicates the article title shown in the card header
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      flushList(); flushKorean()
      // Skip if this is the very first element (duplicate of article title in header)
      if (elements.length === 0) { key++; continue }
      elements.push(
        <div key={key++} className="mt-10 mb-4">
          <div className="h-px w-full mb-3" style={{ background: '#E8DCCF' }} />
          <h2 className="font-heading font-bold text-[#1A1008] text-xl leading-snug">
            {parseInline(trimmed.slice(3))}
          </h2>
        </div>
      )
      continue
    }

    // H3 — section subheading in DKC red
    if (trimmed.startsWith('### ')) {
      flushList(); flushKorean()
      elements.push(
        <h3 key={key++}
          className="font-heading font-bold text-[#8B1E24] mt-10 mb-3 pb-1 leading-snug"
          style={{ fontSize: '1.05rem', borderBottom: '1px solid #F0E0DB' }}>
          {parseInline(trimmed.slice(4))}
        </h3>
      )
      continue
    }

    // Italic subtitle / article deck — whole line wrapped in *...*
    if (
      trimmed.startsWith('*') && trimmed.endsWith('*') &&
      !trimmed.startsWith('**') && trimmed.length > 2 &&
      !trimmed.slice(1).startsWith(' ')   // exclude "* list item" style
    ) {
      flushList(); flushKorean()
      elements.push(
        <p key={key++} className="font-sans italic text-[#777] text-[15px] leading-relaxed mb-6 mt-1">
          {parseInline(trimmed.slice(1, -1))}
        </p>
      )
      continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(); flushKorean()
      const inner = trimmed.slice(2)
      elements.push(
        <blockquote
          key={key++}
          className="font-sans italic text-[#555] text-base leading-relaxed pl-5 my-6 py-1"
          style={{ borderLeft: '3px solid #8B1E24' }}
        >
          {parseInline(inner)}
        </blockquote>
      )
      continue
    }

    // Unordered list item  (- item  or  * item — must have space after marker)
    if (/^[-] /.test(trimmed) || /^\* [^ ]/.test(trimmed)) {
      flushKorean()
      if (listBuf.length && listOrder) flushList()
      listOrder = false
      listBuf.push({ ordered: false, content: trimmed.slice(2) })
      continue
    }

    // Ordered list item
    if (/^\d+\. /.test(trimmed)) {
      flushKorean()
      if (listBuf.length && !listOrder) flushList()
      listOrder = true
      listBuf.push({ ordered: true, content: trimmed.replace(/^\d+\. /, '') })
      continue
    }

    // Korean paragraph — buffer into a translation block (only in non-Korean articles)
    if (!skipKoreanBlocks && isKorean(trimmed)) {
      flushList()
      krBuf.push(trimmed)
      continue
    }

    // Normal paragraph
    flushList(); flushKorean()
    elements.push(
      <p key={key++} className="font-sans text-[#444] text-base leading-relaxed mb-4">
        {parseInline(trimmed)}
      </p>
    )
  }

  flushList()
  flushKorean()
  return elements
}

// ── Per-article design themes ──────────────────────────────────────────────
// Watermark opacity kept at 0.055–0.07 so text stays fully readable
const ARTICLE_THEMES = [
  {
    // 1 — Warm Gold  ·  꽃 (flower) + কপৌফুল (foxtail orchid)
    bg: '#FFFDF5', headerBg: '#FDF8E8', accent: '#B8943A', tagBg: '#FEF3C7', tagColor: '#92700A',
    deco: (
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.06 }}>
        {/* Korean: 꽃 (flower) — large corner watermark */}
        <text x="460" y="180" fontFamily="serif" fontSize="160" fill="#B8943A" transform="rotate(-12 460 180)">꽃</text>
        {/* Assamese: কপৌফুল scattered */}
        <text x="30" y="120" fontFamily="serif" fontSize="52" fill="#B8943A" transform="rotate(8 30 120)">কপৌ</text>
        <text x="200" y="420" fontFamily="serif" fontSize="44" fill="#B8943A" transform="rotate(-6 200 420)">ফুল</text>
        {/* Small Korean characters scattered */}
        <text x="80" y="280" fontFamily="serif" fontSize="36" fill="#B8943A" transform="rotate(15 80 280)">한</text>
        <text x="380" y="380" fontFamily="serif" fontSize="30" fill="#B8943A" transform="rotate(-8 380 380)">류</text>
        <text x="500" y="440" fontFamily="serif" fontSize="28" fill="#B8943A" transform="rotate(5 500 440)">문</text>
        {/* Assamese whimsical script */}
        <text x="320" y="60" fontFamily="serif" fontSize="38" fill="#B8943A" transform="rotate(-10 320 60)">অসম</text>
        <text x="60" y="440" fontFamily="serif" fontSize="32" fill="#B8943A" transform="rotate(12 60 440)">ভালপোৱা</text>
        {/* Delicate branch lines */}
        <path d="M500 0 C470 60 440 100 400 160 C360 220 320 280 280 360" stroke="#B8943A" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
        <path d="M400 160 C430 140 460 110 490 80" stroke="#B8943A" strokeWidth="0.6" strokeLinecap="round" opacity="0.4"/>
        <ellipse cx="492" cy="78" rx="6" ry="10" fill="#B8943A" transform="rotate(-30 492 78)" opacity="0.6"/>
        <ellipse cx="396" cy="158" rx="8" ry="13" fill="#B8943A" transform="rotate(10 396 158)" opacity="0.5"/>
        <ellipse cx="280" cy="358" rx="5" ry="9" fill="#B8943A" transform="rotate(20 280 358)" opacity="0.4"/>
      </svg>
    ),
  },
  {
    // 2 — Rose Blush  ·  봄 (spring) + বসন্ত (spring in Assamese)
    bg: '#FFF8F8', headerBg: '#FFF0F2', accent: '#C45A82', tagBg: '#FCE4EC', tagColor: '#9C2752',
    deco: (
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.06 }}>
        {/* Korean: 봄 (spring) */}
        <text x="380" y="200" fontFamily="serif" fontSize="170" fill="#C45A82" transform="rotate(8 380 200)">봄</text>
        {/* Assamese: বসন্ত (spring) */}
        <text x="20" y="100" fontFamily="serif" fontSize="56" fill="#C45A82" transform="rotate(-10 20 100)">বসন্ত</text>
        <text x="30" y="380" fontFamily="serif" fontSize="40" fill="#C45A82" transform="rotate(14 30 380)">ফুলনি</text>
        {/* Scattered Korean */}
        <text x="120" y="260" fontFamily="serif" fontSize="38" fill="#C45A82" transform="rotate(-8 120 260)">사랑</text>
        <text x="500" y="400" fontFamily="serif" fontSize="32" fill="#C45A82" transform="rotate(6 500 400)">꿈</text>
        <text x="460" y="60" fontFamily="serif" fontSize="30" fill="#C45A82" transform="rotate(-15 460 60)">봄</text>
        {/* Assamese */}
        <text x="300" y="460" fontFamily="serif" fontSize="36" fill="#C45A82" transform="rotate(-5 300 460)">সংযোগ</text>
        {/* Cherry blossom branch — very light */}
        <path d="M0 420 C80 390 160 370 250 340 C340 310 420 280 600 240" stroke="#C45A82" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
        <path d="M250 340 C260 305 275 280 285 250" stroke="#C45A82" strokeWidth="0.6" strokeLinecap="round" opacity="0.35"/>
        {[{cx:284,cy:248},{cx:598,cy:238},{cx:160,cy:372}].map(({cx,cy},i)=>(
          <g key={i} transform={`translate(${cx},${cy})`} opacity="0.55">
            {[0,72,144,216,288].map(a=>(
              <ellipse key={a} rx="4" ry="7" fill="#C45A82" transform={`rotate(${a}) translate(0,-5)`}/>
            ))}
          </g>
        ))}
      </svg>
    ),
  },
  {
    // 3 — Forest Sage  ·  숲 (forest) + অৰণ্য (forest in Assamese)
    bg: '#F5FAF5', headerBg: '#EBF5EB', accent: '#4A7A42', tagBg: '#D9EED6', tagColor: '#2E5C28',
    deco: (
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.06 }}>
        {/* Korean: 숲 (forest) */}
        <text x="30" y="240" fontFamily="serif" fontSize="160" fill="#4A7A42" transform="rotate(-8 30 240)">숲</text>
        {/* Assamese: অৰণ্য (forest) */}
        <text x="380" y="80" fontFamily="serif" fontSize="54" fill="#4A7A42" transform="rotate(10 380 80)">অৰণ্য</text>
        <text x="400" y="420" fontFamily="serif" fontSize="42" fill="#4A7A42" transform="rotate(-7 400 420)">প্ৰকৃতি</text>
        {/* Scattered Korean */}
        <text x="320" y="260" fontFamily="serif" fontSize="36" fill="#4A7A42" transform="rotate(12 320 260)">나무</text>
        <text x="500" y="160" fontFamily="serif" fontSize="30" fill="#4A7A42" transform="rotate(-5 500 160)">자연</text>
        <text x="200" y="460" fontFamily="serif" fontSize="28" fill="#4A7A42" transform="rotate(8 200 460)">잎</text>
        {/* Assamese */}
        <text x="60" y="440" fontFamily="serif" fontSize="34" fill="#4A7A42" transform="rotate(-12 60 440)">ৰং</text>
        {/* Bamboo silhouette — very faint vertical lines */}
        <line x1="560" y1="0" x2="560" y2="500" stroke="#4A7A42" strokeWidth="5" opacity="0.2" strokeLinecap="round"/>
        <line x1="578" y1="30" x2="578" y2="500" stroke="#4A7A42" strokeWidth="3.5" opacity="0.15" strokeLinecap="round"/>
        {[80,160,240,320,400].map(y=><line key={y} x1="552" x2="568" y1={y} y2={y} stroke="#4A7A42" strokeWidth="1.5" opacity="0.3"/>)}
        <ellipse cx="590" cy="100" rx="5" ry="16" fill="#4A7A42" transform="rotate(-30 590 100)" opacity="0.25"/>
        <ellipse cx="588" cy="220" rx="4" ry="14" fill="#4A7A42" transform="rotate(-25 588 220)" opacity="0.2"/>
      </svg>
    ),
  },
  {
    // 4 — Sky Blue  ·  물 (water) + নদী (river in Assamese)
    bg: '#F4F8FF', headerBg: '#E8F0FF', accent: '#3A5FA8', tagBg: '#DBEAFE', tagColor: '#1E3A7A',
    deco: (
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.06 }}>
        {/* Korean: 물 (water) */}
        <text x="350" y="300" fontFamily="serif" fontSize="170" fill="#3A5FA8" transform="rotate(-5 350 300)">물</text>
        {/* Assamese: নদী (river) + ব্ৰহ্মপুত্ৰ (Brahmaputra) */}
        <text x="20" y="90" fontFamily="serif" fontSize="52" fill="#3A5FA8" transform="rotate(8 20 90)">নদী</text>
        <text x="30" y="460" fontFamily="serif" fontSize="36" fill="#3A5FA8" transform="rotate(-8 30 460)">ব্ৰহ্মপুত্ৰ</text>
        {/* Scattered Korean */}
        <text x="460" y="80" fontFamily="serif" fontSize="36" fill="#3A5FA8" transform="rotate(12 460 80)">바다</text>
        <text x="140" y="380" fontFamily="serif" fontSize="32" fill="#3A5FA8" transform="rotate(-10 140 380)">강</text>
        <text x="500" y="440" fontFamily="serif" fontSize="28" fill="#3A5FA8" transform="rotate(6 500 440)">하늘</text>
        {/* Assamese */}
        <text x="350" y="460" fontFamily="serif" fontSize="34" fill="#3A5FA8" transform="rotate(-5 350 460)">আকাশ</text>
        {/* Wave lines — very faint */}
        <path d="M0 140 C60 120 120 160 180 140 C240 120 300 160 360 140 C420 120 480 160 600 140" stroke="#3A5FA8" strokeWidth="1" strokeLinecap="round" opacity="0.35"/>
        <path d="M0 160 C60 140 120 180 180 160 C240 140 300 180 360 160 C420 140 480 180 600 160" stroke="#3A5FA8" strokeWidth="0.7" strokeLinecap="round" opacity="0.25"/>
        <path d="M0 180 C60 160 120 200 180 180 C240 160 300 200 360 180 C420 160 480 200 600 180" stroke="#3A5FA8" strokeWidth="0.5" strokeLinecap="round" opacity="0.2"/>
      </svg>
    ),
  },
  {
    // 5 — Peach Terracotta  ·  맛 (taste) + সোৱাদ (flavour in Assamese)
    bg: '#FFF8F2', headerBg: '#FFF0E6', accent: '#C06A30', tagBg: '#FFE4CC', tagColor: '#8B3A10',
    deco: (
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.06 }}>
        {/* Korean: 맛 (taste) */}
        <text x="60" y="300" fontFamily="serif" fontSize="165" fill="#C06A30" transform="rotate(6 60 300)">맛</text>
        {/* Assamese: সোৱাদ (flavour) */}
        <text x="350" y="100" fontFamily="serif" fontSize="52" fill="#C06A30" transform="rotate(-8 350 100)">সোৱাদ</text>
        <text x="380" y="420" fontFamily="serif" fontSize="40" fill="#C06A30" transform="rotate(10 380 420)">ৰন্ধন</text>
        {/* Scattered Korean */}
        <text x="380" y="250" fontFamily="serif" fontSize="36" fill="#C06A30" transform="rotate(-12 380 250)">음식</text>
        <text x="510" y="340" fontFamily="serif" fontSize="30" fill="#C06A30" transform="rotate(7 510 340)">밥</text>
        <text x="180" y="460" fontFamily="serif" fontSize="32" fill="#C06A30" transform="rotate(-6 180 460)">국</text>
        {/* Assamese */}
        <text x="40" y="460" fontFamily="serif" fontSize="30" fill="#C06A30" transform="rotate(10 40 460)">খাদ্য</text>
        {/* Plum branch — faint */}
        <path d="M580 0 C555 70 530 120 500 190 C470 260 440 320 410 400" stroke="#C06A30" strokeWidth="0.9" strokeLinecap="round" opacity="0.4"/>
        <path d="M500 190 C525 168 555 140 575 110" stroke="#C06A30" strokeWidth="0.7" strokeLinecap="round" opacity="0.35"/>
        {[{cx:573,cy:108},{cx:499,cy:188},{cx:410,cy:398}].map(({cx,cy},i)=>(
          <g key={i} transform={`translate(${cx},${cy})`} opacity="0.5">
            {[0,72,144,216,288].map(a=>(
              <circle key={a} r="5" fill="#C06A30" transform={`rotate(${a}) translate(0,-7)`}/>
            ))}
            <circle r="2" fill="#FFD4A0"/>
          </g>
        ))}
      </svg>
    ),
  },
  {
    // 6 — Lavender  ·  별 (star) + তৰা (star in Assamese)
    bg: '#FAF6FF', headerBg: '#F3EAFF', accent: '#7B5EA8', tagBg: '#EDE0FF', tagColor: '#4A2A80',
    deco: (
      <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', opacity: 0.06 }}>
        {/* Korean: 별 (star) */}
        <text x="380" y="240" fontFamily="serif" fontSize="160" fill="#7B5EA8" transform="rotate(-10 380 240)">별</text>
        {/* Assamese: তৰা (star) */}
        <text x="30" y="110" fontFamily="serif" fontSize="56" fill="#7B5EA8" transform="rotate(8 30 110)">তৰা</text>
        <text x="40" y="420" fontFamily="serif" fontSize="42" fill="#7B5EA8" transform="rotate(-10 40 420)">সপোন</text>
        {/* Scattered Korean */}
        <text x="240" y="80" fontFamily="serif" fontSize="38" fill="#7B5EA8" transform="rotate(12 240 80)">꿈</text>
        <text x="160" y="320" fontFamily="serif" fontSize="34" fill="#7B5EA8" transform="rotate(-7 160 320)">빛</text>
        <text x="520" y="420" fontFamily="serif" fontSize="30" fill="#7B5EA8" transform="rotate(6 520 420)">하늘</text>
        {/* Assamese */}
        <text x="360" y="460" fontFamily="serif" fontSize="34" fill="#7B5EA8" transform="rotate(-6 360 460)">আশা</text>
        {/* Tiny 4-point stars scattered */}
        {[[80,200,8],[460,120,6],[140,440,7],[530,280,5],[290,380,6],[490,50,7]].map(([cx,cy,r],i)=>(
          <polygon key={i} fill="#7B5EA8" opacity="0.5"
            points={`${cx},${cy-r} ${cx+r*0.3},${cy-r*0.3} ${cx+r},${cy} ${cx+r*0.3},${cy+r*0.3} ${cx},${cy+r} ${cx-r*0.3},${cy+r*0.3} ${cx-r},${cy} ${cx-r*0.3},${cy-r*0.3}`}
          />
        ))}
      </svg>
    ),
  },
]

export function MagazineIssue({ slug }: { slug: string }) {
  const [issue, setIssue] = useState<ApiMagazine | null>(null)
  const [notFoundState, setNotFoundState] = useState(false)
  const [activeArticle, setActiveArticle] = useState<ApiArticle | null>(null)
  const [mobileReading, setMobileReading] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/magazine/${slug}`)
      .then(r => {
        if (!r.ok) { setNotFoundState(true); return null }
        return r.json()
      })
      .then((data: ApiMagazine | null) => {
        if (data) {
          setIssue(data)
          setActiveArticle(data.articles?.[0] ?? null)
        }
      })
      .catch(() => setNotFoundState(true))
  }, [slug])

  if (notFoundState) notFound()
  if (!issue) return null

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        {/* Issue header */}
        <div className="relative overflow-hidden" style={{ background: issue.cover_color }}>
          <span
            className="absolute right-10 top-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none"
            style={{ fontSize: 260, lineHeight: 1, color: issue.cover_accent, opacity: 0.08 }}
          >
            한
          </span>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
            <Link
              href="/magazine"
              className="inline-flex items-center gap-1.5 font-sans text-sm hover:opacity-90 mb-6 transition-opacity"
              style={{ color: `${issue.cover_accent}90` }}
            >
              <ArrowLeft className="w-4 h-4" /> All Issues
            </Link>
            <nav className="flex items-center gap-1 mb-4">
              {[{ label: 'Home', href: '/' }, { label: 'Magazine', href: '/magazine' }, { label: issue.title }].map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: `${issue.cover_accent}40` }} />}
                  {b.href
                    ? <Link href={b.href} className="font-sans text-xs hover:opacity-90" style={{ color: `${issue.cover_accent}60` }}>{b.label}</Link>
                    : <span className="font-sans text-xs" style={{ color: `${issue.cover_accent}90` }}>{b.label}</span>
                  }
                </span>
              ))}
            </nav>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: `${issue.cover_accent}70` }}>
              {issue.issue_label}
            </p>
            <h1 className="font-heading font-bold mb-2" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: issue.cover_accent }}>
              {issue.title}
            </h1>
            <p className="font-sans text-sm" style={{ color: `${issue.cover_accent}70` }}>
              {issue.month} {issue.year} &middot; {issue.page_count} pages &middot; {issue.articles.length} articles
            </p>
            {issue.has_pdf && (
              <Link
                href={`/magazine/${slug}/read`}
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{ background: `${issue.cover_accent}18`, color: issue.cover_accent, border: `1.5px solid ${issue.cover_accent}35` }}
              >
                <BookMarked className="w-4 h-4" />
                View Original Handmade Edition
              </Link>
            )}
          </div>
        </div>

        {/* Reader */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-14">
          {(issue.articles?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
              <span
                className="font-korean font-bold select-none mb-6"
                style={{ fontSize: 72, color: '#8B1E24', opacity: 0.1, lineHeight: 1 }}
              >
                한
              </span>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: '#FAF3ED' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#8B1E24' }} />
              </div>
              <p className="font-korean mb-2" style={{ fontSize: 13, color: '#8B1E24', opacity: 0.6 }}>
                아직 출판되지 않았어요
              </p>
              <h2
                className="font-heading font-bold text-[#2B2B2B] mb-4"
                style={{ fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.2 }}
              >
                We haven&apos;t published this issue yet
              </h2>
              <p className="font-sans leading-relaxed max-w-md mb-8" style={{ color: '#888', fontSize: 15 }}>
                Stay tuned — after launch, you&apos;ll be able to read it right here.
                Our magazine is being crafted with care and will be available soon.
              </p>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-2 font-sans font-semibold text-white px-7 py-3.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#8B1E24', fontSize: 14 }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Magazine
              </Link>
            </div>
          ) : (
            (() => {
              // Group consecutive articles into pairs: [primary, translation?]
              // Only pair two articles when they are detectably different languages
              const pairs: [ApiArticle, ApiArticle | null][] = []
              for (let i = 0; i < issue.articles.length; ) {
                const cur  = issue.articles[i]
                const next = issue.articles[i + 1]
                if (next && next.author === cur.author && detectLang(next.content) !== detectLang(cur.content)) {
                  pairs.push([cur, next])
                  i += 2
                } else {
                  pairs.push([cur, null])
                  i += 1
                }
              }
              const activePairIdx = pairs.findIndex(([p, k]) =>
                p.id === activeArticle?.id || k?.id === activeArticle?.id
              )
              const activePair = activePairIdx >= 0 ? pairs[activePairIdx] : null
              const isKoreanActive = activePair ? activePair[1]?.id === activeArticle?.id : false

              return (
            <div>
              {/* ═══════════════════════════════════════════
                  MOBILE LAYOUT  (hidden on lg+)
              ═══════════════════════════════════════════ */}
              <div className="lg:hidden">
                {!mobileReading ? (
                  /* ── Article list view ── */
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#8B1E24] mb-4">
                      In This Issue · {pairs.length} articles
                    </p>
                    <div className="space-y-3">
                      {pairs.map(([primary], i) => {
                        const t = ARTICLE_THEMES[i % ARTICLE_THEMES.length]
                        return (
                          <button
                            key={primary.id}
                            onClick={() => { setActiveArticle(primary); setMobileReading(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
                            style={{ background: t.bg, border: `1px solid ${t.accent}22` }}
                          >
                            <div className="px-4 pt-4 pb-3" style={{ borderLeft: `3px solid ${t.accent}` }}>
                              <span
                                className="inline-block font-sans text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
                                style={{ background: t.tagBg, color: t.tagColor }}
                              >
                                {primary.tag}
                              </span>
                              <p className="font-heading font-bold text-[#1A1008] text-sm leading-snug mb-1">
                                {primary.title}
                              </p>
                              <p className="font-sans text-xs" style={{ color: `${t.accent}80` }}>
                                by {primary.author}
                              </p>
                              {primary.excerpt && (
                                <p className="font-sans text-xs leading-relaxed mt-2 line-clamp-2" style={{ color: `${t.accent}90` }}>
                                  {primary.excerpt}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between px-4 py-2" style={{ background: `${t.accent}10`, borderTop: `1px solid ${t.accent}15` }}>
                              <span className="font-sans text-[10px] font-semibold" style={{ color: t.accent }}>Read article</span>
                              <ChevronRight className="w-3.5 h-3.5" style={{ color: t.accent }} />
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  /* ── Article reading view ── */
                  activeArticle && activePair && (() => {
                    const theme = ARTICLE_THEMES[activePairIdx % ARTICLE_THEMES.length]
                    const [primary, korean] = activePair
                    const nextPair = pairs[activePairIdx + 1]
                    return (
                      <div>
                        {/* Back + progress bar */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => { setMobileReading(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold"
                            style={{ color: '#8B1E24' }}
                          >
                            <ArrowLeft className="w-4 h-4" /> All Articles
                          </button>
                          <span className="font-sans text-xs text-[#999]">
                            {activePairIdx + 1} / {pairs.length}
                          </span>
                        </div>

                        {/* Article card */}
                        <motion.div
                          key={activeArticle.id}
                          className="rounded-2xl overflow-hidden"
                          style={{ background: theme.bg, border: `1px solid ${theme.accent}22`, position: 'relative' }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>{theme.deco}</div>

                          {/* Header */}
                          <div className="px-5 pt-6 pb-5" style={{ position: 'relative', zIndex: 2, borderBottom: `1px solid ${theme.accent}20`, background: theme.headerBg }}>
                            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                              <span className="inline-block font-sans text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{ background: theme.tagBg, color: theme.tagColor }}>
                                {activeArticle.tag}
                              </span>
                              {korean && (
                                <div className="flex items-center rounded-full p-0.5 gap-0.5"
                                  style={{ background: `${theme.accent}18`, border: `1px solid ${theme.accent}25` }}>
                                  <button onClick={() => setActiveArticle(primary)}
                                    className="font-sans text-[11px] font-semibold px-3 py-1 rounded-full transition-all"
                                    style={!isKoreanActive ? { background: theme.accent, color: '#fff' } : { color: `${theme.accent}99`, background: 'transparent' }}>
                                    {detectLang(primary.content)}
                                  </button>
                                  <button onClick={() => setActiveArticle(korean)}
                                    className="font-sans text-[11px] font-semibold px-3 py-1 rounded-full transition-all"
                                    style={isKoreanActive ? { background: theme.accent, color: '#fff' } : { color: `${theme.accent}99`, background: 'transparent' }}>
                                    {detectLang(korean.content)}
                                  </button>
                                </div>
                              )}
                            </div>
                            <h2 className="font-heading font-bold text-[#1A1008] leading-tight mb-2" style={{ fontSize: 'clamp(18px, 5vw, 24px)' }}>
                              {activeArticle.title}
                            </h2>
                            {activeArticle.excerpt && (
                              <p className="font-sans italic text-xs leading-relaxed mb-3" style={{ color: `${theme.accent}AA` }}>
                                {activeArticle.excerpt}
                              </p>
                            )}
                            <p className="font-sans text-xs" style={{ color: `${theme.accent}80` }}>
                              by <span className="font-semibold" style={{ color: `${theme.accent}CC` }}>{activeArticle.author}</span>
                            </p>
                          </div>

                          {/* Body */}
                          <div className="px-5 py-6" style={{ position: 'relative', zIndex: 2 }}>
                            {renderMarkdown(activeArticle.content, detectLang(activeArticle.content) !== 'English')}
                          </div>
                        </motion.div>

                        {/* Next article */}
                        {nextPair && (() => {
                          const nt = ARTICLE_THEMES[(activePairIdx + 1) % ARTICLE_THEMES.length]
                          return (
                            <button
                              onClick={() => { setActiveArticle(nextPair[0]); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                              className="mt-4 w-full rounded-2xl p-4 flex items-center justify-between text-left transition-all active:scale-[0.98]"
                              style={{ background: nt.headerBg, border: `1px solid ${nt.accent}22` }}
                            >
                              <div>
                                <p className="font-sans text-[10px] mb-0.5" style={{ color: `${nt.accent}70` }}>Next article</p>
                                <p className="font-heading font-semibold text-[#2B2B2B] text-sm">{nextPair[0].title}</p>
                                <p className="font-sans text-xs mt-0.5" style={{ color: `${nt.accent}80` }}>by {nextPair[0].author}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 flex-shrink-0 ml-3" style={{ color: nt.accent }} />
                            </button>
                          )
                        })()}

                        {/* Back to list */}
                        <button
                          onClick={() => { setMobileReading(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                          className="mt-3 w-full rounded-2xl py-3.5 font-sans text-sm font-semibold text-center transition-all"
                          style={{ background: '#fff', border: '1px solid #E8DCCF', color: '#8B1E24' }}
                        >
                          ← Back to All Articles
                        </button>
                      </div>
                    )
                  })()
                )}
              </div>

              {/* ═══════════════════════════════════════════
                  DESKTOP LAYOUT  (hidden on mobile)
              ═══════════════════════════════════════════ */}
              <div className="hidden lg:flex gap-10">
                {/* Sidebar */}
                <div className="flex-shrink-0 w-64">
                  <div className="sticky top-24">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#8B1E24] mb-4">In This Issue</p>
                    <nav className="space-y-2">
                      {pairs.map(([primary], i) => {
                        const t = ARTICLE_THEMES[i % ARTICLE_THEMES.length]
                        const isActive = activePairIdx === i
                        return (
                          <button
                            key={primary.id}
                            onClick={() => setActiveArticle(primary)}
                            className="w-full text-left rounded-xl p-3 transition-all"
                            style={isActive
                              ? { background: t.accent, boxShadow: `0 4px 16px ${t.accent}40` }
                              : { background: '#fff', border: `1px solid ${t.accent}22` }}
                          >
                            <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1"
                              style={isActive ? { background: 'rgba(255,255,255,0.18)', color: '#fff' } : { background: t.tagBg, color: t.tagColor }}>
                              {primary.tag}
                            </span>
                            <p className="font-sans text-sm font-medium leading-snug" style={{ color: isActive ? '#fff' : '#2B2B2B' }}>
                              {primary.title}
                            </p>
                            <p className="font-sans text-xs mt-0.5" style={{ color: isActive ? 'rgba(255,255,255,0.65)' : '#999' }}>
                              by {primary.author}
                            </p>
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                </div>

                {/* Article body */}
                {activeArticle && activePair && (() => {
                  const theme = ARTICLE_THEMES[activePairIdx % ARTICLE_THEMES.length]
                  const [primary, korean] = activePair
                  const nextPair = pairs[activePairIdx + 1]
                  return (
                    <motion.article
                      key={activeArticle.id}
                      className="flex-1 min-w-0"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="rounded-2xl overflow-hidden"
                        style={{ background: theme.bg, border: `1px solid ${theme.accent}22`, position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>{theme.deco}</div>

                        <div className="px-12 pt-10 pb-8"
                          style={{ position: 'relative', zIndex: 2, borderBottom: `1px solid ${theme.accent}20`, background: theme.headerBg }}>
                          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <span className="inline-block font-sans text-[10px] font-bold uppercase tracking-[3px] px-3 py-1 rounded-full"
                              style={{ background: theme.tagBg, color: theme.tagColor }}>
                              {activeArticle.tag}
                            </span>
                            {korean && (
                              <div className="flex items-center rounded-full p-0.5 gap-0.5"
                                style={{ background: `${theme.accent}18`, border: `1px solid ${theme.accent}25` }}>
                                <button onClick={() => setActiveArticle(primary)}
                                  className="font-sans text-[11px] font-semibold px-3 py-1 rounded-full transition-all"
                                  style={!isKoreanActive ? { background: theme.accent, color: '#fff' } : { color: `${theme.accent}99`, background: 'transparent' }}>
                                  {detectLang(primary.content)}
                                </button>
                                <button onClick={() => setActiveArticle(korean)}
                                  className="font-sans text-[11px] font-semibold px-3 py-1 rounded-full transition-all"
                                  style={isKoreanActive ? { background: theme.accent, color: '#fff' } : { color: `${theme.accent}99`, background: 'transparent' }}>
                                  {detectLang(korean.content)}
                                </button>
                              </div>
                            )}
                          </div>
                          <h2 className="font-heading font-bold text-[#1A1008] leading-tight mb-3"
                            style={{ fontSize: 'clamp(20px, 3vw, 28px)' }}>
                            {activeArticle.title}
                          </h2>
                          {activeArticle.excerpt && (
                            <p className="font-sans italic text-sm leading-relaxed mb-4" style={{ color: `${theme.accent}AA` }}>
                              {activeArticle.excerpt}
                            </p>
                          )}
                          <p className="font-sans text-xs" style={{ color: `${theme.accent}80` }}>
                            by <span className="font-semibold" style={{ color: `${theme.accent}CC` }}>{activeArticle.author}</span>
                            &nbsp;&middot;&nbsp;{issue.title}, {issue.month} {issue.year}
                          </p>
                        </div>

                        <div className="px-12 py-10" style={{ position: 'relative', zIndex: 2 }}>
                          {renderMarkdown(activeArticle.content, detectLang(activeArticle.content) !== 'English')}
                        </div>
                      </div>

                      {nextPair && (() => {
                        const nextTheme = ARTICLE_THEMES[(activePairIdx + 1) % ARTICLE_THEMES.length]
                        return (
                          <button
                            onClick={() => setActiveArticle(nextPair[0])}
                            className="mt-6 w-full rounded-2xl p-5 flex items-center justify-between text-left transition-all hover:shadow-md"
                            style={{ background: nextTheme.headerBg, border: `1px solid ${nextTheme.accent}22` }}
                          >
                            <div>
                              <p className="font-sans text-xs mb-0.5" style={{ color: `${nextTheme.accent}80` }}>Next in this issue</p>
                              <p className="font-heading font-semibold text-[#2B2B2B] text-sm">{nextPair[0].title}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: nextTheme.accent }} />
                          </button>
                        )
                      })()}
                    </motion.article>
                  )
                })()}
              </div>
            </div>
              )
            })()
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
