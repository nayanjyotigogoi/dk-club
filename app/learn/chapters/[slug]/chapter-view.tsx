'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { useState, useCallback, createContext, useContext } from 'react'
import { CHAPTERS } from '@/lib/learning/chapters-data'

// ─── API types ────────────────────────────────────────────────────────────────

export interface ApiItem {
  id: number
  korean: string
  romanization: string
  english: string
  assamese?: string | null
  speak_text?: string | null
  meta?: Record<string, unknown> | null
}

export interface ApiConversation {
  id: number
  speaker: 'A' | 'B'
  korean: string
  english: string
  assamese?: string | null
  speak_text?: string | null
}

export interface ChapterData {
  chapter: {
    slug: string
    number: number
    title_en: string
    title_ko: string
    description: string
    accent_color: string
    tint_color: string
    border_color: string
    icon?: string
  }
  items_by_section: Record<string, ApiItem[]>
  conversations: ApiConversation[]
}

// ─── Theme context ────────────────────────────────────────────────────────────

const ThemeCtx = createContext({ accent: '#8B1E24', tint: '#FEF3F0', border: '#E8DCCF' })
function useTheme() { return useContext(ThemeCtx) }

// ─── Audio hook ───────────────────────────────────────────────────────────────

function useAudio() {
  const [playingText, setPlayingText] = useState<string | null>(null)

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    if (playingText === text) { setPlayingText(null); return }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.8
    utterance.onstart = () => setPlayingText(text)
    utterance.onend = () => setPlayingText(null)
    utterance.onerror = () => setPlayingText(null)
    window.speechSynthesis.speak(utterance)
  }, [playingText])

  return { playingText, speak }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionHeading({ en, ko }: { en: string; ko?: string }) {
  const { accent } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
      <div style={{ width: '4px', minHeight: '28px', background: accent, borderRadius: '3px', flexShrink: 0, marginTop: '3px' }} />
      <div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '20px', fontWeight: 800, color: '#1A1008',
          letterSpacing: '-0.01em', margin: 0, lineHeight: 1.2,
        }}>
          {en}
        </h2>
        {ko && (
          <span style={{ fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif", fontSize: '13px', color: accent, fontWeight: 600, letterSpacing: '0.04em' }}>
            {ko}
          </span>
        )}
      </div>
    </div>
  )
}

function SectionNote({ children }: { children: React.ReactNode }) {
  const { accent, tint, border } = useTheme()
  return (
    <p style={{
      fontSize: '13px', color: '#4B3B2A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)",
      background: tint, border: `1px solid ${border}`, borderRadius: '10px',
      padding: '10px 14px 10px 16px', lineHeight: '1.65', margin: '0 0 20px',
      borderLeft: `3px solid ${accent}55`,
    }}>
      {children}
    </p>
  )
}

// ─── Audio Button ─────────────────────────────────────────────────────────────

function AudioBtn({ text, playing, onSpeak }: { text: string; playing: boolean; onSpeak: (t: string) => void }) {
  const { accent } = useTheme()
  return (
    <button
      onClick={() => onSpeak(text)}
      title={playing ? 'Stop' : 'Play pronunciation'}
      style={{
        width: '30px', height: '30px', borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: playing ? accent : `${accent}22`,
        color: playing ? '#fff' : accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.15s ease',
      }}
      aria-label={playing ? 'Stop' : 'Play pronunciation'}
    >
      {playing ? <VolumeX size={13} /> : <Volume2 size={13} />}
    </button>
  )
}

// ─── Char Card ────────────────────────────────────────────────────────────────

function CharCard({ item, playingText, speak }: {
  item: ApiItem;
  playingText: string | null; speak: (t: string) => void;
}) {
  const { accent, tint, border } = useTheme()
  const audioText = item.speak_text ?? item.korean
  const isPlaying = playingText === audioText
  return (
    <div style={{
      background: isPlaying ? '#fff' : tint,
      border: `1.5px solid ${isPlaying ? accent : border}`,
      borderRadius: '12px', padding: '18px 12px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
      transition: 'all 0.2s ease', position: 'relative',
      boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
    }}>
      <span style={{
        fontFamily: 'var(--font-korean, serif)',
        fontSize: '42px', lineHeight: 1.1,
        color: isPlaying ? accent : '#1A1008',
        transition: 'color 0.2s',
        fontWeight: 600,
      }}>
        {item.korean}
      </span>
      <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '13px', fontWeight: 700, color: accent, letterSpacing: '0.04em' }}>
        {item.romanization}
      </span>
      <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '11px', color: '#7A6A5A', textAlign: 'center', lineHeight: '1.4' }}>
        {item.english}
      </span>
      {item.assamese && (
        <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', color: '#5A4A3A', background: `${accent}15`, borderRadius: '4px', padding: '2px 6px' }}>
          {item.assamese}
        </span>
      )}
      <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
        <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
      </div>
    </div>
  )
}

// ─── Conversation Block ───────────────────────────────────────────────────────

type Lang = 'ko' | 'en' | 'as'

function ConversationBlock({ lines, playingText, speak }: {
  lines: ApiConversation[];
  playingText: string | null;
  speak: (t: string) => void;
}) {
  const { accent, tint, border } = useTheme()
  const [lang, setLang] = useState<Lang>('ko')

  const tabs: { id: Lang; label: string }[] = [
    { id: 'ko', label: '한국어' },
    { id: 'en', label: 'English' },
    { id: 'as', label: 'অসমীয়া' },
  ]

  return (
    <div style={{ background: tint, border: `1.5px solid ${border}`, borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, background: `${accent}10` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setLang(t.id)} style={{
            padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: '13px',
            fontFamily: "'DM Sans', var(--font-sans, sans-serif)",
            fontWeight: lang === t.id ? 700 : 500,
            color: lang === t.id ? accent : '#9CA3AF',
            background: lang === t.id ? '#FFFFFF' : 'transparent',
            borderBottom: lang === t.id ? `2px solid ${accent}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 14px' }}>
          <span style={{ fontSize: '11px', color: `${accent}80`, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Practice Conversation
          </span>
        </div>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {lines.map((line, i) => {
          const text = lang === 'ko' ? line.korean : lang === 'en' ? line.english : (line.assamese ?? line.english)
          const audioText = line.speak_text ?? line.korean
          const isA = line.speaker === 'A'
          const isPlaying = playingText === audioText
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexDirection: isA ? 'row' : 'row-reverse', minWidth: 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: isA ? accent : '#2D5F7A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '13px', fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
              }}>
                {line.speaker}
              </div>
              <div style={{
                background: isA ? '#FFFFFF' : '#EFF6FB',
                border: `1px solid ${isA ? border : '#B5D4E8'}`,
                borderRadius: isA ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                padding: '10px 14px', maxWidth: 'min(70%, 240px)',
                fontSize: '14px', lineHeight: '1.65',
                fontFamily: lang === 'ko' ? 'var(--font-korean, serif)' : "'DM Sans', var(--font-sans, sans-serif)",
                color: '#1A1008',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                wordBreak: 'break-word', overflowWrap: 'break-word',
              }}>
                {text}
              </div>
              {lang === 'ko' && (
                <div style={{ marginTop: '4px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tip Card ─────────────────────────────────────────────────────────────────

function TipCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { accent, tint, border } = useTheme()
  return (
    <div style={{ background: tint, border: `1.5px solid ${border}`, borderRadius: '14px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: accent, fontSize: '15px', marginBottom: '14px' }}>
        ✦ {title}
      </div>
      {children}
    </div>
  )
}

// ─── Chapter 1: Vowels ────────────────────────────────────────────────────────

type ChProps = {
  items: Record<string, ApiItem[]>
  conversations: ApiConversation[]
  playingText: string | null
  speak: (t: string) => void
}

function Chapter1({ items, conversations, playingText, speak }: ChProps) {
  const { accent, tint, border } = useTheme()
  const basic = items.basic_vowels ?? []
  const compound = items.compound_vowels ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
      <section>
        <SectionHeading en="Basic Vowels" ko="기본 모음" />
        <SectionNote>Korean has 10 basic vowels. Each is written with a vertical or horizontal stroke. Tap the speaker icon to hear its sound.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '10px' }}>
          {basic.map(v => <CharCard key={v.id} item={v} playingText={playingText} speak={speak} />)}
        </div>
      </section>

      <section>
        <SectionHeading en="Compound Vowels" ko="이중 모음" />
        <SectionNote>Compound vowels are formed by combining two basic vowels. Many sound similar — listening carefully is the best way to tell them apart.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: '10px' }}>
          {compound.map(v => <CharCard key={v.id} item={v} playingText={playingText} speak={speak} />)}
        </div>
      </section>

      <section>
        <TipCard title="Quick Tips">
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Vertical vowels (ㅏ ㅓ ㅣ…) sit on the right side of a consonant.',
              'Horizontal vowels (ㅗ ㅜ ㅡ…) sit below a consonant.',
              'ㅇ is silent at the start of a syllable — used as a placeholder when a syllable begins with a pure vowel sound.',
              'Start with the four cardinal vowels: 아 (a) · 오 (o) · 우 (u) · 이 (i).',
            ].map((tip, i) => (
              <li key={i} style={{ fontSize: '14px', color: '#4B3B2A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)", lineHeight: '1.6' }}>{tip}</li>
            ))}
          </ul>
        </TipCard>
      </section>

      <section>
        <SectionHeading en="Practice Conversation" ko="대화 연습" />
        <ConversationBlock lines={conversations} playingText={playingText} speak={speak} />
      </section>
    </div>
  )
}

// ─── Chapter 2: Consonants ────────────────────────────────────────────────────

function Chapter2({ items, conversations, playingText, speak }: ChProps) {
  const { accent, tint, border } = useTheme()
  const basic = items.basic_consonants ?? []
  const tense = items.tense_consonants ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
      <section>
        <SectionHeading en="Basic Consonants" ko="기본 자음" />
        <SectionNote>Korean has 14 basic consonants. Many have two sounds depending on their position in a syllable — beginning vs. end.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))', gap: '10px' }}>
          {basic.map(c => <CharCard key={c.id} item={c} playingText={playingText} speak={speak} />)}
        </div>
      </section>

      <section>
        <SectionHeading en="Tense (Double) Consonants" ko="쌍자음" />
        <SectionNote>Tense consonants are written by doubling the basic form. They are pronounced with a stronger, tighter sound — no air escapes.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '10px' }}>
          {tense.map(c => {
            const audioText = c.speak_text ?? c.korean
            const isPlaying = playingText === audioText
            return (
              <div key={c.id} style={{ position: 'relative' }}>
                <CharCard item={c} playingText={playingText} speak={speak} />
                <div style={{
                  position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                  background: accent, color: '#fff', fontSize: '9px', fontWeight: 700,
                  borderRadius: '4px', padding: '1px 6px', fontFamily: "'DM Sans', var(--font-sans, sans-serif)",
                  whiteSpace: 'nowrap', letterSpacing: '0.05em',
                }}>TENSE</div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <TipCard title="Three-Way Sound System">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Plain', desc: 'ㄱ g/k · ㄷ d/t · ㅂ b/p · ㅅ s · ㅈ j', note: 'light, unaspirated' },
              { label: 'Aspirated', desc: 'ㅋ k · ㅌ t · ㅍ p · ㅊ ch · ㅎ h', note: 'breathy, airy — puff of air' },
              { label: 'Tense', desc: 'ㄲ kk · ㄸ tt · ㅃ pp · ㅆ ss · ㅉ jj', note: 'tight, no air escapes' },
            ].map(row => (
              <div key={row.label} style={{ background: '#fff', borderRadius: '10px', padding: '14px', border: `1px solid ${border}` }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: accent, marginBottom: '6px', fontFamily: "'Playfair Display', serif" }}>{row.label}</div>
                <div style={{ fontSize: '14px', color: '#1A1008', fontFamily: 'var(--font-korean, serif)', marginBottom: '4px' }}>{row.desc}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{row.note}</div>
              </div>
            ))}
          </div>
        </TipCard>
      </section>

      <section>
        <SectionHeading en="Practice Conversation" ko="대화 연습" />
        <ConversationBlock lines={conversations} playingText={playingText} speak={speak} />
      </section>
    </div>
  )
}

// ─── Chapter 3: Making Simple Words ──────────────────────────────────────────

function Chapter3({ items, conversations, playingText, speak }: ChProps) {
  const { accent, tint, border } = useTheme()
  const syllables = items.syllable_blocks ?? []
  const words = items.simple_words ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
      <section>
        <SectionHeading en="How Syllables Work" ko="음절 구조" />
        <SectionNote>Every Korean syllable is a block: consonant + vowel (+ optional final consonant). They are always written in a square frame.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
          {syllables.map(b => {
            const parts = b.english.split('+')
            const consonant = parts[0] ?? ''
            const rest = (parts[1] ?? '').split('=')
            const vowel = rest[0] ?? ''
            return (
              <div key={b.id} style={{ background: tint, border: `1.5px solid ${border}`, borderRadius: '12px', padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '20px', fontFamily: 'var(--font-korean, serif)', color: '#9CA3AF', marginBottom: '8px' }}>
                  <span>{consonant}</span>
                  <span style={{ fontSize: '14px' }}>+</span>
                  <span>{vowel}</span>
                  <span style={{ fontSize: '14px' }}>=</span>
                  <span style={{ color: accent, fontWeight: 700 }}>{b.korean}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A6A5A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{b.romanization}</div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="Common Words" ko="기본 단어" />
        <SectionNote>These everyday words use the consonants and vowels you have already learned. Tap to hear the pronunciation.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '10px' }}>
          {words.map(w => {
            const audioText = w.speak_text ?? w.korean
            const isPlaying = playingText === audioText
            return (
              <div key={w.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: '4px',
                transition: 'all 0.2s', position: 'relative',
                boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '28px', color: isPlaying ? accent : '#1A1008', transition: 'color 0.2s' }}>{w.korean}</span>
                <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', fontWeight: 700, color: accent }}>{w.romanization}</span>
                <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '13px', color: '#4B5563' }}>{w.english}</span>
                {w.assamese && <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', color: '#7A6A5A', background: `${accent}15`, borderRadius: '4px', padding: '2px 6px', alignSelf: 'flex-start' }}>{w.assamese}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="Practice Conversation" ko="대화 연습" />
        <ConversationBlock lines={conversations} playingText={playingText} speak={speak} />
      </section>
    </div>
  )
}

// ─── Chapter 4: Sino-Korean Numbers ──────────────────────────────────────────

function Chapter4({ items, conversations, playingText, speak }: ChProps) {
  const { accent, tint, border } = useTheme()
  const numbers = items.sino_numbers ?? []
  const useCases = items.sino_use_cases ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
      <section>
        <SectionHeading en="Sino-Korean Digits" ko="한자 숫자" />
        <SectionNote>Sino-Korean numbers originate from Chinese. They are used for dates, money, phone numbers, floors, and minutes.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '10px' }}>
          {numbers.map(n => {
            const audioText = n.speak_text ?? n.korean
            const isPlaying = playingText === audioText
            const value = (n.meta as { value?: number })?.value ?? n.english
            return (
              <div key={n.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '16px 10px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                position: 'relative', transition: 'all 0.2s',
                boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
              }}>
                <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: `${accent}80`, fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '32px', color: isPlaying ? accent : '#1A1008', lineHeight: 1.1 }}>{n.korean}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: accent, fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{n.romanization}</span>
                {n.assamese && <span style={{ fontSize: '11px', color: '#7A6A5A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{n.assamese}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="When to Use Sino-Korean" ko="사용 상황" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '10px' }}>
          {useCases.map(u => {
            const audioText = u.speak_text ?? u.korean
            const isPlaying = playingText === audioText
            const title = (u.meta as { title?: string })?.title ?? ''
            const [icon, ...labelParts] = title.split(' ')
            const label = labelParts.join(' ')
            return (
              <div key={u.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: '6px',
                position: 'relative', transition: 'all 0.2s',
                boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <div style={{ fontSize: '24px' }}>{icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: accent, fontFamily: "'DM Sans', var(--font-sans, sans-serif)", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '18px', color: isPlaying ? accent : '#1A1008', transition: 'color 0.2s', lineHeight: 1.4 }}>{u.korean}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontStyle: 'italic' }}>{u.romanization}</div>
                <div style={{ fontSize: '13px', color: '#4B5563', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{u.english}</div>
                {u.assamese && <div style={{ fontSize: '12px', color: '#7A6A5A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{u.assamese}</div>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="Practice Conversation" ko="대화 연습" />
        <ConversationBlock lines={conversations} playingText={playingText} speak={speak} />
      </section>
    </div>
  )
}

// ─── Chapter 5: Introducing Yourself ─────────────────────────────────────────

function Chapter5({ items, conversations, playingText, speak }: ChProps) {
  const { accent, tint, border } = useTheme()
  const phrases = items.intro_phrases ?? []
  const countries = items.countries ?? []
  const occupations = items.occupations ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
      <section>
        <SectionHeading en="Key Phrases" ko="핵심 표현" />
        <SectionNote>Fill in the ___ with your own name, country, or occupation.</SectionNote>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {phrases.map(p => {
            const audioText = p.speak_text ?? p.korean
            const isPlaying = playingText === audioText
            return (
              <div key={p.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'all 0.2s',
                boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
              }}>
                <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '17px', color: isPlaying ? accent : '#1A1008', transition: 'color 0.2s', wordBreak: 'break-word' }}>{p.korean}</span>
                  <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic', wordBreak: 'break-word' }}>{p.romanization}</span>
                  <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '13px', color: '#4B5563', wordBreak: 'break-word' }}>{p.english}</span>
                  {p.assamese && <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', color: '#7A6A5A', wordBreak: 'break-word' }}>{p.assamese}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="Countries" ko="나라" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '10px' }}>
          {countries.map(c => {
            const audioText = c.speak_text ?? c.korean
            const isPlaying = playingText === audioText
            const flag = (c.meta as { flag?: string })?.flag ?? ''
            return (
              <div key={c.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '14px 12px',
                display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative', transition: 'all 0.2s',
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <span style={{ fontSize: '24px' }}>{flag}</span>
                <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '20px', color: isPlaying ? accent : '#1A1008', transition: 'color 0.2s' }}>{c.korean}</span>
                <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '11px', color: accent, fontWeight: 700 }}>{c.romanization}</span>
                <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', color: '#4B5563' }}>{c.english}</span>
                {c.assamese && <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '11px', color: '#7A6A5A' }}>{c.assamese}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="Occupations" ko="직업" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '10px' }}>
          {occupations.map(o => {
            const audioText = o.speak_text ?? o.korean
            const isPlaying = playingText === audioText
            return (
              <div key={o.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '14px 12px',
                display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative', transition: 'all 0.2s',
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '22px', color: isPlaying ? accent : '#1A1008', transition: 'color 0.2s' }}>{o.korean}</span>
                <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '12px', color: accent, fontWeight: 700 }}>{o.romanization}</span>
                <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '13px', color: '#4B5563' }}>{o.english}</span>
                {o.assamese && <span style={{ fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontSize: '11px', color: '#7A6A5A' }}>{o.assamese}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="Practice Conversation" ko="대화 연습" />
        <ConversationBlock lines={conversations} playingText={playingText} speak={speak} />
      </section>
    </div>
  )
}

// ─── Chapter 6: Native Korean Numbers ────────────────────────────────────────

function Chapter6({ items, conversations, playingText, speak }: ChProps) {
  const { accent, tint, border } = useTheme()
  const numbers = items.native_numbers ?? []
  const useCases = items.native_use_cases ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
      <section>
        <SectionHeading en="Native Numbers" ko="순우리말 숫자" />
        <SectionNote>Native Korean numbers are used for age, hours, counting objects, and people. They differ entirely from Sino-Korean numbers.</SectionNote>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '10px' }}>
          {numbers.map(n => {
            const audioText = n.speak_text ?? n.korean
            const isPlaying = playingText === audioText
            const value = (n.meta as { value?: number })?.value ?? n.english
            return (
              <div key={n.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '16px 10px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                position: 'relative', transition: 'all 0.2s',
                boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
              }}>
                <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: `${accent}80`, fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{value}</span>
                <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '28px', color: isPlaying ? accent : '#1A1008', lineHeight: 1.1 }}>{n.korean}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: accent, fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{n.romanization}</span>
                {n.assamese && <span style={{ fontSize: '11px', color: '#7A6A5A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{n.assamese}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeading en="When to Use Native Numbers" ko="사용 상황" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '10px' }}>
          {useCases.map(u => {
            const audioText = u.speak_text ?? u.korean
            const isPlaying = playingText === audioText
            const title = (u.meta as { title?: string })?.title ?? ''
            const [icon, ...labelParts] = title.split(' ')
            const label = labelParts.join(' ')
            return (
              <div key={u.id} style={{
                background: isPlaying ? '#fff' : tint,
                border: `1.5px solid ${isPlaying ? accent : border}`,
                borderRadius: '12px', padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: '6px',
                position: 'relative', transition: 'all 0.2s',
                boxShadow: isPlaying ? `0 4px 16px ${accent}22` : 'none',
              }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <AudioBtn text={audioText} playing={isPlaying} onSpeak={speak} />
                </div>
                <div style={{ fontSize: '24px' }}>{icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: accent, fontFamily: "'DM Sans', var(--font-sans, sans-serif)", textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '18px', color: isPlaying ? accent : '#1A1008', transition: 'color 0.2s', lineHeight: 1.4 }}>{u.korean}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)", fontStyle: 'italic' }}>{u.romanization}</div>
                <div style={{ fontSize: '13px', color: '#4B5563', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{u.english}</div>
                {u.assamese && <div style={{ fontSize: '12px', color: '#7A6A5A', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{u.assamese}</div>}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <TipCard title="Sino vs Native — Quick Compare">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { label: 'Sino-Korean', col: '#6B5C3E', rows: [['일이삼사오', 'dates · money · floors'], ['삼십 분', '30 minutes'], ['오천 원', '5,000 won']] },
              { label: 'Native Korean', col: accent, rows: [['하나둘셋넷다섯', 'age · hours · things'], ['두 시', '2 o\'clock'], ['세 개', '3 items']] },
            ].map(col => (
              <div key={col.label}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: col.col, fontFamily: "'Playfair Display', serif", marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.label}</div>
                {col.rows.map(([k, e]) => (
                  <div key={k} style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '15px', color: '#1A1008' }}>{k}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>{e}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TipCard>
      </section>

      <section>
        <SectionHeading en="Practice Conversation" ko="대화 연습" />
        <ConversationBlock lines={conversations} playingText={playingText} speak={speak} />
      </section>
    </div>
  )
}

// ─── Chapter component map ────────────────────────────────────────────────────

const CHAPTER_COMPONENTS: Record<string, (p: ChProps) => React.ReactElement> = {
  'vowels':                (p) => <Chapter1 {...p} />,
  'consonants':            (p) => <Chapter2 {...p} />,
  'making-simple-words':   (p) => <Chapter3 {...p} />,
  'sino-korean-numbers':   (p) => <Chapter4 {...p} />,
  'introducing-yourself':  (p) => <Chapter5 {...p} />,
  'native-korean-numbers': (p) => <Chapter6 {...p} />,
}

// ─── Watermark map ────────────────────────────────────────────────────────────

const WATERMARKS: Record<string, string> = {
  'vowels': '아', 'consonants': 'ㄱ', 'making-simple-words': '말',
  'sino-korean-numbers': '수', 'introducing-yourself': '나', 'native-korean-numbers': '열',
}

// ─── Main ChapterView ─────────────────────────────────────────────────────────

export function ChapterView({ data }: { data: ChapterData }) {
  const router = useRouter()
  const { playingText, speak } = useAudio()

  const { chapter, items_by_section, conversations } = data
  const accent = chapter.accent_color
  const tint = chapter.tint_color
  const border = chapter.border_color

  const idx = CHAPTERS.findIndex(c => c.slug === chapter.slug)
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null

  const ContentComponent = CHAPTER_COMPONENTS[chapter.slug]
  const watermark = WATERMARKS[chapter.slug] ?? chapter.icon ?? ''

  return (
    <ThemeCtx.Provider value={{ accent, tint, border }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 0 80px' }}>

        {/* ── Chapter header ──────────────────────────────────────────────── */}
        <div style={{
          background: tint,
          border: `1.5px solid ${border}`,
          borderRadius: '20px',
          padding: 'clamp(24px, 4vw, 36px) clamp(20px, 4vw, 32px)',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Watermark */}
          <span aria-hidden="true" style={{
            position: 'absolute', bottom: '-20px', right: '-10px',
            fontFamily: "'Malgun Gothic', 'Noto Serif KR', serif",
            fontSize: 'clamp(100px, 18vw, 160px)',
            fontWeight: 700, lineHeight: 1,
            color: accent, opacity: 0.08,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            {watermark}
          </span>

          {/* Chapter eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{
              fontFamily: "'DM Sans', var(--font-sans, sans-serif)",
              fontSize: '10px', fontWeight: 700, color: accent,
              textTransform: 'uppercase', letterSpacing: '0.14em',
              background: `${accent}18`, borderRadius: '4px', padding: '3px 8px',
            }}>
              Chapter {String(chapter.number).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, height: '1px', background: border }} />
          </div>

          {/* Title block */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: 800, color: '#1A1008',
              letterSpacing: '-0.02em', margin: '0 0 6px', lineHeight: 1.1,
            }}>
              {chapter.title_en}
            </h1>
            <div style={{
              fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif",
              fontSize: 'clamp(16px, 3vw, 22px)',
              color: accent, fontWeight: 700, letterSpacing: '0.06em',
              marginBottom: '14px',
            }}>
              {chapter.title_ko}
            </div>
            <p style={{
              fontFamily: "'DM Sans', var(--font-sans, sans-serif)",
              fontSize: '15px', color: '#4B3B2A',
              lineHeight: '1.7', margin: 0, maxWidth: '520px',
            }}>
              {chapter.description}
            </p>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {ContentComponent ? (
          <ContentComponent
            items={items_by_section}
            conversations={conversations}
            playingText={playingText}
            speak={speak}
          />
        ) : (
          <p style={{ color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)" }}>Content coming soon.</p>
        )}

        {/* ── Prev / Next ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: prev && next ? '1fr 1fr' : prev ? '1fr' : '0fr 1fr',
          gap: '12px', marginTop: '56px',
          borderTop: `1px solid ${border}`, paddingTop: '28px',
        }}>
          {prev ? (
            <button
              onClick={() => router.push(`/learn/chapters/${prev.slug}`)}
              style={{
                display: 'flex', flexDirection: 'column', gap: '4px',
                background: `${prev.tint}`, border: `1.5px solid ${prev.border}`,
                borderRadius: '14px', padding: '16px 18px',
                cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.2s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <ChevronLeft size={13} /> Previous
              </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '15px', color: '#1A1008' }}>{prev.title}</span>
              <span style={{ fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif", fontSize: '13px', color: prev.accent, fontWeight: 600 }}>{prev.titleKo}</span>
            </button>
          ) : <div />}

          {next && (
            <button
              onClick={() => router.push(`/learn/chapters/${next.slug}`)}
              style={{
                display: 'flex', flexDirection: 'column', gap: '4px',
                background: next.tint, border: `1.5px solid ${next.border}`,
                borderRadius: '14px', padding: '16px 18px',
                cursor: 'pointer', textAlign: 'right', transition: 'box-shadow 0.2s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', fontFamily: "'DM Sans', var(--font-sans, sans-serif)", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Next <ChevronRight size={13} />
              </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '15px', color: '#1A1008' }}>{next.title}</span>
              <span style={{ fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif", fontSize: '13px', color: next.accent, fontWeight: 600 }}>{next.titleKo}</span>
            </button>
          )}
        </div>
      </div>
    </ThemeCtx.Provider>
  )
}
