// Displays a single grammar point.
// Content order: Korean title → Romanization (via pattern) → Assamese → English

import type { ApiGrammarPoint } from '@/lib/learning/types'
import { LevelBadge } from './level-badge'

interface GrammarCardProps {
  point: ApiGrammarPoint
}

export function GrammarCard({ point }: GrammarCardProps) {
  return (
    <article
      className="rounded-2xl flex flex-col gap-4"
      style={{
        background: '#FAF3ED',
        border: '1px solid #E8DCCF',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* 1. Korean title */}
          <p
            className="font-heading font-semibold"
            style={{ fontSize: '18px', color: '#2B2B2B', lineHeight: 1.3 }}
          >
            {point.title_ko}
          </p>
          {/* 3. Assamese title */}
          <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', marginTop: '2px' }}>
            {point.title_as}
          </p>
          {/* 4. English title */}
          <p className="font-sans font-medium" style={{ fontSize: '14px', color: '#4A5568', marginTop: '1px' }}>
            {point.title_en}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <LevelBadge level={point.level} />
          <span
            className="font-sans"
            style={{
              fontSize: '10px',
              color: '#4A5568',
              background: '#EEF2EE',
              padding: '1px 6px',
              borderRadius: '4px',
              border: '1px solid #BDD4BD',
            }}
          >
            {point.category}
          </span>
        </div>
      </div>

      {/* Pattern formula */}
      <div
        className="rounded-xl font-mono"
        style={{ background: '#4A5568', padding: '10px 14px' }}
      >
        <p style={{ fontSize: '13px', color: '#E2E8F0', letterSpacing: '0.02em' }}>
          {point.pattern_formula}
        </p>
      </div>

      {/* Explanation — Assamese first, English second */}
      <div className="flex flex-col gap-2" style={{ borderTop: '1px solid #E8DCCF', paddingTop: '14px' }}>
        <p className="font-sans" style={{ fontSize: '14px', color: '#2B2B2B', lineHeight: 1.6 }}>
          {point.explanation_as}
        </p>
        <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6 }}>
          {point.explanation_en}
        </p>
      </div>

      {/* Examples */}
      {point.examples && point.examples.length > 0 && (
        <div className="flex flex-col gap-2">
          <p
            className="font-heading font-semibold tracking-widest uppercase"
            style={{ fontSize: '10px', color: 'rgba(74,85,104,0.6)', letterSpacing: '0.1em' }}
          >
            Examples
          </p>
          {point.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-xl"
              style={{ background: '#EEF2EE', padding: '10px 12px' }}
            >
              {/* 1. Korean */}
              <p className="font-sans font-semibold" style={{ fontSize: '14px', color: '#2B2B2B' }}>
                {ex.korean}
              </p>
              {/* 2. Romanization */}
              <p className="font-sans italic" style={{ fontSize: '12px', color: '#6B8B6B', marginTop: '1px' }}>
                {ex.romanization}
              </p>
              {/* 3. Assamese */}
              <p className="font-sans" style={{ fontSize: '13px', color: '#2B2B2B', marginTop: '3px' }}>
                {ex.assamese}
              </p>
              {/* 4. English */}
              <p className="font-sans" style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '1px' }}>
                {ex.english}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
