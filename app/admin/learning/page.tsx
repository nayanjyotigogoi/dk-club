import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, BookOpen, Pencil } from 'lucide-react'

export const metadata: Metadata = { title: 'Learning — Admin' }

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

async function getChapters() {
  try {
    const res = await fetch(`${API}/learning/chapters`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function AdminLearningPage() {
  const chapters = await getChapters()

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <BookOpen size={22} style={{ color: '#8B1E24' }} />
        <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '24px', fontWeight: 800, color: '#1A1008', margin: 0 }}>
          Learning Chapters
        </h1>
      </div>
      <p style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '14px', color: '#7A6A5A', marginBottom: '32px' }}>
        Click a chapter to edit its content — items, conversations, audio text, and translations.
      </p>

      {chapters.length === 0 ? (
        <div style={{ background: '#FEF3F0', border: '1.5px solid #F5CECA', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#8B1E24', fontFamily: 'var(--font-sans, sans-serif)', fontSize: '14px' }}>
          No chapters found. Make sure the API is running and the database is seeded.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {chapters.map((ch: any) => (
            <Link
              key={ch.slug}
              href={`/admin/learning/${ch.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', borderRadius: '14px', textDecoration: 'none',
                background: '#FFFFFF', border: '1.5px solid #E8DCCF',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ch.accent_color; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DCCF'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              {/* Number */}
              <div style={{
                width: 44, height: 44, borderRadius: '10px', flexShrink: 0,
                background: ch.tint_color, border: `2px solid ${ch.accent_color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading, serif)', fontWeight: 800,
                fontSize: '18px', color: ch.accent_color,
              }}>
                {ch.number}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 700, fontSize: '16px', color: '#1A1008', marginBottom: '2px' }}>
                  {ch.title_en}
                </div>
                <div style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '13px', color: ch.accent_color }}>
                  {ch.title_ko}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-sans, sans-serif)', fontSize: '12px', color: '#9CA3AF' }}>Edit</span>
                <Pencil size={14} style={{ color: '#9CA3AF' }} />
                <ChevronRight size={16} style={{ color: '#C4B8A8' }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
