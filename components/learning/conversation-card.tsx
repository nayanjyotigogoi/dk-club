// Renders a conversation with its dialogue lines.
// Content order per line: Korean → Romanization → Assamese → English

import type { ApiConversation } from '@/lib/learning/types'
import { LevelBadge } from './level-badge'

interface ConversationCardProps {
  conversation: ApiConversation
}

// Simple colour palette for alternating speaker bubbles
const SPEAKER_COLORS = [
  { bg: '#EBF3F8', text: '#2D5F7A', labelBg: '#2D5F7A' },
  { bg: '#F0EEF8', text: '#4A3A6B', labelBg: '#4A3A6B' },
  { bg: '#EEF2EE', text: '#3A5C3A', labelBg: '#3A5C3A' },
]

export function ConversationCard({ conversation }: ConversationCardProps) {
  // Build a stable index for each speaker so colours remain consistent
  const speakerIndex = new Map<string, number>()
  conversation.speakers?.forEach((s, i) => speakerIndex.set(s.label, i))

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
        <div>
          {/* 1. Korean title */}
          <p className="font-heading font-semibold" style={{ fontSize: '18px', color: '#2B2B2B' }}>
            {conversation.title_ko}
          </p>
          {/* 3. Assamese title */}
          <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', marginTop: '1px' }}>
            {conversation.title_as}
          </p>
          {/* 4. English title */}
          <p className="font-sans font-medium" style={{ fontSize: '14px', color: '#2D5F7A', marginTop: '1px' }}>
            {conversation.title_en}
          </p>
        </div>
        <LevelBadge level={conversation.level} />
      </div>

      {/* Scene description */}
      {conversation.scene_as && (
        <div
          className="rounded-xl"
          style={{ background: '#EBF3F8', padding: '10px 14px', borderLeft: '3px solid #2D5F7A' }}
        >
          <p className="font-sans" style={{ fontSize: '13px', color: '#2B2B2B', lineHeight: 1.5 }}>
            {conversation.scene_as}
          </p>
          <p className="font-sans" style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '2px' }}>
            {conversation.scene_en}
          </p>
        </div>
      )}

      {/* Dialogue lines */}
      {conversation.lines && conversation.lines.length > 0 && (
        <div className="flex flex-col gap-3" style={{ borderTop: '1px solid #E8DCCF', paddingTop: '14px' }}>
          {conversation.lines.map((line) => {
            const idx = speakerIndex.get(line.speaker_label) ?? 0
            const palette = SPEAKER_COLORS[idx % SPEAKER_COLORS.length]

            return (
              <div key={line.id ?? line.order_index} className="flex flex-col gap-1">
                {/* Speaker label */}
                <span
                  className="font-sans font-semibold self-start"
                  style={{
                    fontSize: '10px',
                    color: '#FFFFFF',
                    background: palette.labelBg,
                    padding: '1px 8px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {line.speaker_label}
                </span>

                <div
                  className="rounded-xl"
                  style={{ background: palette.bg, padding: '10px 14px' }}
                >
                  {/* 1. Korean */}
                  <p className="font-sans font-semibold" style={{ fontSize: '15px', color: palette.text }}>
                    {line.text_ko}
                  </p>
                  {/* 2. Romanization */}
                  <p className="font-sans italic" style={{ fontSize: '12px', color: '#8B7355', marginTop: '2px' }}>
                    {line.romanization}
                  </p>
                  {/* 3. Assamese */}
                  <p className="font-sans" style={{ fontSize: '13px', color: '#2B2B2B', marginTop: '4px' }}>
                    {line.translation_as}
                  </p>
                  {/* 4. English */}
                  <p className="font-sans" style={{ fontSize: '12px', color: '#6B6B6B', marginTop: '1px' }}>
                    {line.translation_en}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}
