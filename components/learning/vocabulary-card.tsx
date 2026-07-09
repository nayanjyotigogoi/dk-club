// Displays a single vocabulary entry.
// Content order is always: Korean → Romanization → Assamese → English
// (CONTENT_DISPLAY_ORDER — never change this order)

import type { ApiVocabularyEntry } from '@/lib/learning/types'
import { LevelBadge } from './level-badge'

interface VocabularyCardProps {
  entry: ApiVocabularyEntry
}

export function VocabularyCard({ entry }: VocabularyCardProps) {
  return (
    <article
      className="rounded-2xl flex flex-col gap-3"
      style={{
        background: '#FAF3ED',
        border: '1px solid #E8DCCF',
        padding: '20px',
      }}
    >
      {/* Korean + badge row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          {/* 1. Korean */}
          <p
            className="font-heading font-semibold"
            style={{ fontSize: '26px', color: '#2B2B2B', lineHeight: 1.15 }}
          >
            {entry.korean}
          </p>
          {/* 2. Romanization */}
          <p
            className="font-sans italic"
            style={{ fontSize: '13px', color: '#8B7355', marginTop: '2px' }}
          >
            {entry.romanization}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <LevelBadge level={entry.level} />
          <span
            className="font-sans"
            style={{
              fontSize: '10px',
              color: '#A89070',
              background: '#F0E8DC',
              padding: '1px 6px',
              borderRadius: '4px',
            }}
          >
            {entry.part_of_speech}
          </span>
        </div>
      </div>

      {/* 3. Assamese + 4. English */}
      <div className="flex flex-col gap-1" style={{ borderTop: '1px solid #E8DCCF', paddingTop: '12px' }}>
        <p className="font-sans" style={{ fontSize: '15px', color: '#2B2B2B', fontWeight: 500 }}>
          {entry.assamese}
        </p>
        <p className="font-sans" style={{ fontSize: '14px', color: '#6B6B6B' }}>
          {entry.english}
        </p>
      </div>

      {/* Example sentence (optional) */}
      {entry.example_ko && (
        <div
          className="rounded-xl"
          style={{ background: '#F5EDE3', padding: '10px 12px', marginTop: '2px' }}
        >
          <p className="font-sans" style={{ fontSize: '13px', color: '#2B2B2B', fontWeight: 500 }}>
            {entry.example_ko}
          </p>
          {entry.example_as && (
            <p className="font-sans" style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '2px' }}>
              {entry.example_as}
            </p>
          )}
          {entry.example_en && (
            <p className="font-sans" style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>
              {entry.example_en}
            </p>
          )}
        </div>
      )}
    </article>
  )
}
