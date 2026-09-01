'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookMarked, ChevronDown, X, GraduationCap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CHAPTERS } from '@/lib/learning/chapters-data'

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0"
      style={{
        width: '220px',
        background: '#FDFAF6',
        borderRight: '1px solid #E8DCCF',
        position: 'sticky',
        top: '84px',
        height: 'calc(100vh - 84px)',
        overflowY: 'auto',
      }}
    >
      {/* Brand strip */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #EDE7DC', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#8B1E24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GraduationCap size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 700, fontSize: '13px', color: '#1A1008', lineHeight: 1.2 }}>Korean</div>
          <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '10px', color: '#B8A898', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Learning Path</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {/* Chapters label */}
        <div style={{ padding: '8px 10px 6px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: '10px', fontWeight: 700, color: '#B8A898', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Chapters
        </div>

        {CHAPTERS.map(ch => {
          const active = pathname === `/learn/chapters/${ch.slug}`
          return (
            <Link
              key={ch.slug}
              href={`/learn/chapters/${ch.slug}`}
              aria-current={active ? 'page' : undefined}
              className="sidebar-link"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '10px', textDecoration: 'none',
                background: active ? ch.tint : 'transparent',
                border: `1.5px solid ${active ? ch.accent + '50' : 'transparent'}`,
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#F0E9DF'; e.currentTarget.style.borderColor = '#DDD4C4' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
            >
              <span style={{
                width: 26, height: 26, borderRadius: '7px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? ch.accent : '#EDE7DC',
                color: active ? '#fff' : '#6B5C3E',
                fontSize: '12px', fontWeight: 700,
                fontFamily: 'var(--font-heading, serif)',
                transition: 'background 0.15s',
              }}>
                {ch.number}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px', fontWeight: active ? 700 : 500, color: active ? ch.accent : '#2A1F14', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ch.title}
                </div>
                <div style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '11px', color: active ? ch.accent : '#A89880', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ch.titleKo}
                </div>
              </div>
              {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: ch.accent, flexShrink: 0 }} />}
            </Link>
          )
        })}

        {/* Divider + Reference */}
        <div style={{ height: '1px', background: '#EDE7DC', margin: '8px 6px' }} />
        <div style={{ padding: '4px 10px 6px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: '10px', fontWeight: 700, color: '#B8A898', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Reference
        </div>
        <Link
          href="/learn/dictionary"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '10px', textDecoration: 'none',
            background: pathname.startsWith('/learn/dictionary') ? '#F4F0E8' : 'transparent',
            border: `1.5px solid ${pathname.startsWith('/learn/dictionary') ? '#DDD4B860' : 'transparent'}`,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!pathname.startsWith('/learn/dictionary')) e.currentTarget.style.background = '#F0E9DF' }}
          onMouseLeave={e => { if (!pathname.startsWith('/learn/dictionary')) e.currentTarget.style.background = 'transparent' }}
        >
          <span style={{ width: 26, height: 26, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: pathname.startsWith('/learn/dictionary') ? '#6B5C3E' : '#EDE7DC', flexShrink: 0 }}>
            <BookMarked size={13} color={pathname.startsWith('/learn/dictionary') ? '#fff' : '#6B5C3E'} />
          </span>
          <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px', fontWeight: pathname.startsWith('/learn/dictionary') ? 700 : 500, color: pathname.startsWith('/learn/dictionary') ? '#6B5C3E' : '#2A1F14' }}>
            Dictionary
          </span>
        </Link>
      </nav>
    </aside>
  )
}

// ─── Mobile top nav + slide-down drawer ──────────────────────────────────────

function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const activeChapter = CHAPTERS.find(ch => pathname === `/learn/chapters/${ch.slug}`)
  const isDictionary = pathname.startsWith('/learn/dictionary')

  const barLabel = activeChapter
    ? `Ch ${activeChapter.number} · ${activeChapter.title}`
    : isDictionary ? 'Dictionary'
    : 'Korean Learning'

  const barColor = activeChapter?.accent ?? '#8B1E24'

  return (
    <div className="md:hidden" style={{ position: 'relative', zIndex: 30 }}>
      {/* ── Sticky top bar ── */}
      <div style={{
        position: 'sticky', top: '84px', zIndex: 30,
        background: '#FDFAF6', borderBottom: '1px solid #E8DCCF',
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0 14px', height: '50px',
      }}>
        {/* Progress pills */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {CHAPTERS.map(ch => {
            const active = pathname === `/learn/chapters/${ch.slug}`
            return (
              <Link key={ch.slug} href={`/learn/chapters/${ch.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  height: 6, width: active ? 18 : 6, borderRadius: '3px',
                  background: active ? ch.accent : '#DDD4C4',
                  transition: 'width 0.25s, background 0.25s',
                }} />
              </Link>
            )
          })}
        </div>

        {/* Current page name */}
        <div style={{
          flex: 1, fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px',
          fontWeight: 600, color: barColor,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {barLabel}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close chapters menu' : 'Open chapters menu'}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 10px', borderRadius: '8px',
            border: '1px solid #E8DCCF',
            background: open ? '#F0E9DF' : '#FFFFFF',
            cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--font-sans, sans-serif)', fontSize: '12px',
            fontWeight: 600, color: '#2A1F14',
            transition: 'background 0.15s',
          }}
        >
          {open ? <X size={13} /> : <ChevronDown size={13} />}
          <span>{open ? 'Close' : 'Chapters'}</span>
        </button>
      </div>

      {/* ── Slide-down chapter drawer ── */}
      <div
        aria-hidden={!open}
        style={{
          position: 'absolute', top: '50px', left: 0, right: 0, zIndex: 29,
          background: '#FDFAF6',
          borderBottom: open ? '1px solid #E8DCCF' : 'none',
          boxShadow: open ? '0 8px 24px rgba(0,0,0,0.10)' : 'none',
          maxHeight: open ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s',
        }}
      >
        <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ padding: '2px 10px 8px', fontFamily: 'var(--font-sans, sans-serif)', fontSize: '10px', fontWeight: 700, color: '#B8A898', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Chapters
          </div>

          {CHAPTERS.map(ch => {
            const active = pathname === `/learn/chapters/${ch.slug}`
            return (
              <Link
                key={ch.slug}
                href={`/learn/chapters/${ch.slug}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
                  background: active ? ch.tint : 'transparent',
                  border: `1.5px solid ${active ? ch.accent + '50' : 'transparent'}`,
                }}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? ch.accent : '#EDE7DC',
                  color: active ? '#fff' : '#6B5C3E',
                  fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-heading, serif)',
                }}>
                  {ch.number}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '14px', fontWeight: active ? 700 : 500, color: active ? ch.accent : '#1A1008', lineHeight: 1.3 }}>
                    {ch.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '12px', color: active ? ch.accent : '#A89880', lineHeight: 1.2 }}>
                    {ch.titleKo}
                  </div>
                </div>
                {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: ch.accent, flexShrink: 0 }} />}
              </Link>
            )
          })}

          <div style={{ height: '1px', background: '#EDE7DC', margin: '6px 4px' }} />

          <Link
            href="/learn/dictionary"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '10px', textDecoration: 'none',
              background: isDictionary ? '#F4F0E8' : 'transparent',
            }}
          >
            <span style={{ width: 30, height: 30, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDictionary ? '#6B5C3E' : '#EDE7DC', flexShrink: 0 }}>
              <BookMarked size={14} color={isDictionary ? '#fff' : '#6B5C3E'} />
            </span>
            <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '14px', fontWeight: isDictionary ? 700 : 500, color: isDictionary ? '#6B5C3E' : '#1A1008' }}>
              Dictionary
            </span>
          </Link>
        </div>
      </div>

      {/* Tap-outside backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 20,
            background: 'rgba(26,16,8,0.15)',
          }}
        />
      )}
    </div>
  )
}

// ─── Named exports (used by the learn layout) ─────────────────────────────────

export { DesktopSidebar, MobileNav }

// Legacy default export kept for any existing imports
export function LearningNav() {
  return (
    <>
      <DesktopSidebar />
      <MobileNav />
    </>
  )
}
