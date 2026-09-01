import type { Metadata } from 'next'
import Link from 'next/link'
import { CHAPTERS } from '@/lib/learning/chapters-data'

export const metadata: Metadata = {
  title: 'Korean Chapters',
  description: 'Learn Korean step by step — 6 interactive chapters covering Hangul vowels, consonants, vocabulary, numbers, and self-introduction.',
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn/chapters' },
}

const FEATURES = ['🔊 Audio on every word', '💬 Real conversations', 'অসমীয়া translations']

const CHAPTER_META: Record<string, { watermark: string; label: string }> = {
  'vowels':                { watermark: '아', label: 'Script' },
  'consonants':            { watermark: 'ㄱ', label: 'Script' },
  'making-simple-words':   { watermark: '말', label: 'Words' },
  'sino-korean-numbers':   { watermark: '수', label: 'Numbers' },
  'introducing-yourself':  { watermark: '나', label: 'Speaking' },
  'native-korean-numbers': { watermark: '열', label: 'Numbers' },
}

export default function ChaptersPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        .chapters-page { font-family: 'DM Sans', sans-serif; }

        .chapter-card {
          display: flex;
          flex-direction: column;
          position: relative;
          border-radius: 16px;
          padding: 24px 20px 20px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          cursor: pointer;
        }
        .chapter-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.10);
        }
        .chapter-card:hover .card-arrow {
          transform: translateX(4px);
          opacity: 1;
        }
        .card-arrow {
          transition: transform 0.22s ease, opacity 0.22s ease;
          opacity: 0.5;
        }
        .chapter-card:hover .card-cta {
          opacity: 1;
        }
        .card-cta {
          opacity: 0.7;
          transition: opacity 0.22s ease;
        }
        .watermark {
          position: absolute;
          bottom: -16px;
          right: -8px;
          font-family: 'Noto Serif KR', 'Malgun Gothic', serif;
          font-size: clamp(100px, 18vw, 140px);
          font-weight: 700;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          transition: opacity 0.22s ease;
        }
        .chapter-card:hover .watermark {
          opacity: 0.18;
        }

        @media (max-width: 720px) {
          .chapter-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .chapter-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .chapter-card, .card-arrow, .card-cta, .watermark { transition: none; }
        }
      `}</style>

      <div className="chapters-page" style={{ padding: 'clamp(28px,5vw,52px) clamp(16px,4vw,40px) 80px' }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#FEF3F0', border: '1px solid #F5CECA',
            borderRadius: '20px', padding: '4px 12px 4px 8px',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '16px' }}>🇰🇷</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, color: '#8B1E24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Korean Learning Path
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(30px, 6vw, 52px)',
            fontWeight: 800,
            color: '#1A1008',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '6px',
            textWrap: 'balance',
          }}>
            Six chapters to<br />
            <em style={{ color: '#8B1E24', fontStyle: 'italic' }}>speak Korean</em>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px', color: '#7A6A5A',
            lineHeight: 1.75, maxWidth: '480px',
            marginTop: '14px', marginBottom: '20px',
          }}>
            Start with the alphabet, build words, count numbers, and introduce yourself — each chapter with audio, Assamese translations, and a real conversation to practise.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {FEATURES.map(f => (
              <span key={f} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px', fontWeight: 500, color: '#4B3B2A',
                background: '#F4EDE4', border: '1px solid #E0D0C0',
                borderRadius: '20px', padding: '4px 12px',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ── Chapter grid ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
        }}
        className="chapter-grid">
          {CHAPTERS.map((ch) => {
            const meta = CHAPTER_META[ch.slug] ?? { watermark: ch.icon, label: '' }
            return (
              <Link
                key={ch.slug}
                href={`/learn/chapters/${ch.slug}`}
                className="chapter-card"
                style={{
                  background: ch.tint,
                  border: `1.5px solid ${ch.border}`,
                }}
              >
                {/* Watermark character */}
                <span
                  className="watermark"
                  style={{ color: ch.accent, opacity: 0.12 }}
                  aria-hidden="true"
                >
                  {meta.watermark}
                </span>

                {/* Top row: chapter label + number */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '10px', fontWeight: 700,
                      color: ch.accent, letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: `${ch.accent}18`,
                      borderRadius: '4px', padding: '2px 7px',
                    }}>
                      {meta.label}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '13px', fontWeight: 700,
                    color: `${ch.accent}80`,
                    letterSpacing: '0.04em',
                  }}>
                    {String(ch.number).padStart(2, '0')}
                  </span>
                </div>

                {/* Titles */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '10px' }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(20px, 3vw, 24px)',
                    fontWeight: 800,
                    color: '#1A1008',
                    lineHeight: 1.15,
                    margin: '0 0 6px',
                    letterSpacing: '-0.01em',
                  }}>
                    {ch.title}
                  </h2>
                  <span style={{
                    fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    color: ch.accent,
                    letterSpacing: '0.05em',
                  }}>
                    {ch.titleKo}
                  </span>
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', color: '#5A4A3A',
                  lineHeight: 1.65,
                  position: 'relative', zIndex: 1,
                  margin: '0 0 24px',
                  maxWidth: '320px',
                }}>
                  {ch.description}
                </p>

                {/* CTA row */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  position: 'relative', zIndex: 1,
                  borderTop: `1px solid ${ch.border}`,
                  paddingTop: '16px',
                }}>
                  <span className="card-cta" style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px', fontWeight: 700,
                    color: ch.accent,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}>
                    Start Chapter →
                  </span>
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: ch.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg className="card-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── Bottom note ───────────────────────────────────────────────────── */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px', color: '#9CA3AF',
          textAlign: 'center', marginTop: '48px',
          lineHeight: 1.6,
        }}>
          All chapters include Korean audio, Romanization, English and Assamese translations.<br />
          No account needed — just start.
        </p>
      </div>
    </>
  )
}
