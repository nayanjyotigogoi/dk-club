'use client'

import { Volume2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  text: string
  size?: 'sm' | 'md' | 'lg'
  accent?: string
}

export function AudioButton({ text, size = 'md', accent = '#8B1E24' }: Props) {
  const [playing, setPlaying] = useState(false)

  const speak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.8
    utterance.onstart = () => setPlaying(true)
    utterance.onend   = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const dims = size === 'sm' ? 28 : size === 'lg' ? 44 : 36
  const iconSize = size === 'sm' ? 13 : size === 'lg' ? 20 : 16

  return (
    <button
      onClick={speak}
      aria-label={`Pronounce ${text}`}
      title="Click to hear pronunciation"
      className="flex items-center justify-center rounded-full transition-all flex-shrink-0"
      style={{
        width: dims,
        height: dims,
        background: playing ? accent : `${accent}18`,
        border: `1.5px solid ${playing ? accent : `${accent}40`}`,
        cursor: 'pointer',
        transform: playing ? 'scale(0.92)' : 'scale(1)',
      }}
    >
      <Volume2
        size={iconSize}
        style={{ color: playing ? '#fff' : accent }}
      />
    </button>
  )
}
