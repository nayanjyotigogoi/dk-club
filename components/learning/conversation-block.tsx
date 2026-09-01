'use client'

import { useState } from 'react'
import { AudioButton } from './audio-button'
import type { ConversationLine } from '@/lib/learning/chapters-data'

type Lang = 'ko' | 'en' | 'as'

interface Props {
  lines: ConversationLine[]
  accent?: string
}

const LANG_LABELS: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
  as: 'অসমীয়া',
}

export function ConversationBlock({ lines, accent = '#8B1E24' }: Props) {
  const [lang, setLang] = useState<Lang>('ko')

  const getText = (line: ConversationLine) => {
    if (lang === 'en') return line.english
    if (lang === 'as') return line.assamese ?? line.english
    return line.korean
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8DCCF' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: '#FAF3ED', borderBottom: '1px solid #E8DCCF' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">💬</span>
          <span className="font-heading font-semibold" style={{ fontSize: '14px', color: '#1A1008' }}>
            Conversation
          </span>
        </div>

        {/* Language toggle */}
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ border: '1px solid #E8DCCF', background: '#fff' }}
        >
          {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className="font-sans transition-colors"
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: lang === key ? 600 : 400,
                background: lang === key ? accent : 'transparent',
                color: lang === key ? '#fff' : '#666',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lines */}
      <div className="flex flex-col gap-0" style={{ background: '#fffcf9' }}>
        {lines.map((line, i) => {
          const isA = line.speaker === 'A'
          return (
            <div
              key={i}
              className="flex gap-3 px-4 py-3"
              style={{
                background: isA ? 'transparent' : '#FEF8F3',
                borderTop: i > 0 ? '1px solid #F0E8DF' : 'none',
                flexDirection: isA ? 'row' : 'row-reverse',
              }}
            >
              {/* Avatar */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full font-heading font-bold"
                style={{
                  width: 32,
                  height: 32,
                  background: isA ? accent : '#2D5F7A',
                  color: '#fff',
                  fontSize: '13px',
                }}
              >
                {line.speaker}
              </div>

              {/* Bubble */}
              <div
                className="flex-1 flex flex-col gap-1"
                style={{ alignItems: isA ? 'flex-start' : 'flex-end' }}
              >
                <div
                  className="rounded-2xl px-4 py-2.5 font-sans"
                  style={{
                    background: isA ? '#fff' : `${accent}12`,
                    border: `1px solid ${isA ? '#E8DCCF' : `${accent}30`}`,
                    fontSize: lang === 'ko' ? '16px' : '14px',
                    lineHeight: 1.6,
                    color: '#2B2B2B',
                    fontFamily: lang === 'ko' ? 'var(--font-korean, sans-serif)' : 'inherit',
                    maxWidth: '85%',
                  }}
                >
                  {getText(line)}
                </div>

                {/* Audio only in Korean mode */}
                {lang === 'ko' && (
                  <div style={{ marginTop: '2px', marginLeft: isA ? '0' : 'auto' }}>
                    <AudioButton text={line.korean} size="sm" accent={isA ? accent : '#2D5F7A'} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
