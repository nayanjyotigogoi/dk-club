import type { Metadata } from 'next'
import Link from 'next/link'
import { SECTION_IDENTITY } from '@/lib/learning/constants'
import {
  BookOpen, BookMarked, Layers, MessageSquare, Zap, RefreshCw,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { SectionKey } from '@/lib/learning/constants'

export const metadata: Metadata = {
  title: 'Learn Korean',
  description: 'Structured Korean lessons, vocabulary, grammar, conversations, and practice — with Assamese and English support.',
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/learn' },
}

const ICONS: Record<SectionKey, React.ComponentType<LucideProps>> = {
  lessons:       BookOpen,
  dictionary:    BookMarked,
  grammar:       Layers,
  conversations: MessageSquare,
  practice:      Zap,
  revision:      RefreshCw,
}

const SECTIONS = Object.entries(SECTION_IDENTITY) as [SectionKey, typeof SECTION_IDENTITY[SectionKey]][]

export default function LearnPage() {
  return (
    <div style={{ padding: '32px' }}>
      {/* Hero */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          className="font-heading font-semibold"
          style={{ fontSize: '28px', color: '#2B2B2B', marginBottom: '8px' }}
        >
          Korean Learning Platform
        </h1>
        <p className="font-sans" style={{ fontSize: '15px', color: '#6B6B6B', maxWidth: '520px', lineHeight: 1.6 }}>
          Learn Korean step by step — with Assamese and English support at every stage.
          Content is displayed in order: Korean · Romanization · অসমীয়া · English.
        </p>
      </div>

      {/* Section grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {SECTIONS.map(([key, section]) => {
          const Icon = ICONS[key]
          return (
            <Link
              key={key}
              href={section.href}
              className="group block rounded-2xl transition-shadow hover:shadow-md"
              style={{
                background: section.tint,
                border: `1px solid ${section.border}`,
                padding: '24px',
                textDecoration: 'none',
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  background: section.accent,
                  marginBottom: '14px',
                }}
              >
                <Icon size={22} color="#FFFFFF" />
              </div>
              <p
                className="font-heading font-semibold group-hover:underline"
                style={{ fontSize: '17px', color: section.accent, marginBottom: '6px' }}
              >
                {section.label}
              </p>
              <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.5 }}>
                {section.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
