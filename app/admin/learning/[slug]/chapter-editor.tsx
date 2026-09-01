'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, Volume2, VolumeX, Save, Check,
  GripVertical, ChevronDown, ChevronUp, Loader2,
} from 'lucide-react'
import { useAuth } from '@/components/admin/admin-shell'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChapterItem {
  id: number
  section: string
  korean: string
  speak_text: string | null
  romanization: string | null
  english: string | null
  assamese: string | null
  sort_order: number
  is_active: boolean
}

interface ConversationLine {
  id: number
  speaker: 'A' | 'B'
  korean: string
  english: string
  assamese: string | null
  speak_text: string | null
  sort_order: number
}

interface Chapter {
  id: number
  slug: string
  number: number
  title_en: string
  title_ko: string
  accent_color: string
  tint_color: string
  border_color: string
}

interface Props {
  initialData: {
    chapter: Chapter
    items_by_section: Record<string, ChapterItem[]>
    conversations: ConversationLine[]
  }
  apiBase: string
}

// ─── Audio preview ────────────────────────────────────────────────────────────

function AudioPreviewBtn({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false)
  const speak = () => {
    if (!text.trim() || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    if (playing) { setPlaying(false); return }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ko-KR'; u.rate = 0.8
    u.onstart = () => setPlaying(true)
    u.onend = () => setPlaying(false)
    u.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(u)
  }
  return (
    <button
      type="button" onClick={speak} title="Preview pronunciation"
      style={{
        width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: playing ? '#8B1E24' : '#F0EAE0', color: playing ? '#fff' : '#8B1E24',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'all 0.15s',
      }}
    >
      {playing ? <VolumeX size={13} /> : <Volume2 size={13} />}
    </button>
  )
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, mono, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; mono?: boolean; hint?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', fontWeight: 700, color: '#9A8A78', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans, sans-serif)' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? ''}
        style={{
          padding: '7px 10px', borderRadius: '7px',
          border: '1.5px solid #E8DCCF',
          fontFamily: mono ? 'var(--font-korean, serif)' : 'var(--font-sans, sans-serif)',
          fontSize: mono ? '16px' : '13px', color: '#1A1008',
          background: '#FFFFFF', outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = '#8B1E24'}
        onBlur={e => e.target.style.borderColor = '#E8DCCF'}
      />
      {hint && <span style={{ fontSize: '11px', color: '#B8A898', fontFamily: 'var(--font-sans, sans-serif)' }}>{hint}</span>}
    </div>
  )
}

// ─── Save button states ───────────────────────────────────────────────────────

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function SaveBtn({ state, onClick, label = 'Save' }: { state: SaveState; onClick: () => void; label?: string }) {
  const colors: Record<SaveState, string> = { idle: '#8B1E24', saving: '#9CA3AF', saved: '#3B6B3A', error: '#C04040' }
  const icons: Record<SaveState, React.ReactNode> = {
    idle: <Save size={13} />,
    saving: <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />,
    saved: <Check size={13} />,
    error: <span style={{ fontSize: '11px' }}>!</span>,
  }
  return (
    <button
      type="button" onClick={onClick} disabled={state === 'saving'}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '6px 12px', borderRadius: '7px', border: 'none', cursor: state === 'saving' ? 'default' : 'pointer',
        background: colors[state], color: '#fff', fontSize: '12px', fontWeight: 600,
        fontFamily: 'var(--font-sans, sans-serif)', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      {icons[state]}
      {label}
    </button>
  )
}

// ─── Authed fetch helper ──────────────────────────────────────────────────────

function useApiFetch(apiBase: string) {
  const { token } = useAuth()
  return (path: string, opts: RequestInit = {}) =>
    fetch(`${apiBase}${path}`, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers ?? {}),
      },
    })
}

// ─── Item row editor ──────────────────────────────────────────────────────────

function ItemRow({
  item, accent, apiBase, onDelete, onUpdate,
}: {
  item: ChapterItem; accent: string; apiBase: string;
  onDelete: (id: number) => void; onUpdate: (id: number, patch: Partial<ChapterItem>) => void;
}) {
  const apiFetch = useApiFetch(apiBase)
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState({ ...item })
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const isDirty = JSON.stringify(draft) !== JSON.stringify(item)

  const save = async () => {
    setSaveState('saving')
    try {
      const res = await apiFetch(`/admin/learning/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          korean: draft.korean,
          speak_text: draft.speak_text || null,
          romanization: draft.romanization || null,
          english: draft.english || null,
          assamese: draft.assamese || null,
        }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      onUpdate(item.id, updated)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  const del = async () => {
    if (!confirm('Delete this item?')) return
    await apiFetch(`/admin/learning/items/${item.id}`, { method: 'DELETE' })
    onDelete(item.id)
  }

  const speakPreviewText = draft.speak_text?.trim() || draft.korean

  return (
    <div style={{
      border: `1.5px solid ${expanded ? accent + '60' : '#E8DCCF'}`,
      borderRadius: '10px', background: '#FFFFFF',
      transition: 'border-color 0.15s',
      overflow: 'hidden',
    }}>
      {/* Row header (always visible) */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', cursor: 'pointer',
          background: expanded ? draft.korean ? '#FDFAF6' : '#FFFFFF' : '#FFFFFF',
        }}
        onClick={() => setExpanded(v => !v)}
      >
        <GripVertical size={14} style={{ color: '#DDD4C4', flexShrink: 0 }} />

        <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '22px', color: '#1A1008', minWidth: '36px' }}>
          {draft.korean || '—'}
        </span>

        <div style={{ flex: 1, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {draft.romanization && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: accent, fontFamily: 'var(--font-sans, sans-serif)' }}>{draft.romanization}</span>
          )}
          {draft.english && (
            <span style={{ fontSize: '12px', color: '#6B6B6B', fontFamily: 'var(--font-sans, sans-serif)' }}>{draft.english}</span>
          )}
        </div>

        <AudioPreviewBtn text={speakPreviewText} />
        {expanded ? <ChevronUp size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />}
      </div>

      {/* Expanded edit form */}
      {expanded && (
        <div style={{ padding: '12px 14px 14px', borderTop: '1px solid #F0E9DF', display: 'flex', flexDirection: 'column', gap: '10px', background: '#FDFAF6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
            <Field label="Korean" value={draft.korean} onChange={v => setDraft(d => ({ ...d, korean: v }))} mono placeholder="한국어" />
            <Field label="Speak Text (TTS override)" value={draft.speak_text ?? ''} onChange={v => setDraft(d => ({ ...d, speak_text: v || null }))} hint="Leave blank to use Korean field" placeholder="Optional" />
            <Field label="Romanization" value={draft.romanization ?? ''} onChange={v => setDraft(d => ({ ...d, romanization: v || null }))} placeholder="e.g. a, ya, kk" />
            <Field label="English / Sound" value={draft.english ?? ''} onChange={v => setDraft(d => ({ ...d, english: v || null }))} placeholder={'e.g. "ah" or \'water\''} />
            <Field label="Assamese" value={draft.assamese ?? ''} onChange={v => setDraft(d => ({ ...d, assamese: v || null }))} placeholder="Optional" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <button
              type="button" onClick={del}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #F5CECA', background: 'transparent', color: '#C04040', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans, sans-serif)' }}
            >
              <Trash2 size={12} /> Delete
            </button>

            {isDirty && (
              <SaveBtn state={saveState} onClick={save} />
            )}
            {saveState === 'saved' && !isDirty && (
              <span style={{ fontSize: '12px', color: '#3B6B3A', fontFamily: 'var(--font-sans, sans-serif)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Conversation line editor ─────────────────────────────────────────────────

function ConversationRow({
  line, apiBase, onDelete, onUpdate,
}: {
  line: ConversationLine; apiBase: string;
  onDelete: (id: number) => void; onUpdate: (id: number, patch: Partial<ConversationLine>) => void;
}) {
  const apiFetch = useApiFetch(apiBase)
  const [draft, setDraft] = useState({ ...line })
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const isDirty = JSON.stringify(draft) !== JSON.stringify(line)

  const save = async () => {
    setSaveState('saving')
    try {
      const res = await apiFetch(`/admin/learning/conversations/${line.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          speaker: draft.speaker,
          korean: draft.korean,
          english: draft.english,
          assamese: draft.assamese || null,
          speak_text: draft.speak_text || null,
        }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      onUpdate(line.id, updated)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  const del = async () => {
    if (!confirm('Delete this conversation line?')) return
    await apiFetch(`/admin/learning/conversations/${line.id}`, { method: 'DELETE' })
    onDelete(line.id)
  }

  const isA = draft.speaker === 'A'

  return (
    <div style={{
      border: '1.5px solid #E8DCCF', borderRadius: '10px', background: '#FFFFFF',
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      {/* Speaker + Korean row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        {/* Speaker toggle */}
        <button
          type="button"
          onClick={() => setDraft(d => ({ ...d, speaker: d.speaker === 'A' ? 'B' : 'A' }))}
          style={{
            width: 32, height: 32, borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: isA ? '#8B1E24' : '#2D5F7A', color: '#fff',
            fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-heading, serif)',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Toggle speaker A/B"
        >
          {draft.speaker}
        </button>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#9A8A78', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans, sans-serif)' }}>Korean</label>
            <textarea
              value={draft.korean}
              onChange={e => setDraft(d => ({ ...d, korean: e.target.value }))}
              rows={2}
              style={{ padding: '7px 10px', borderRadius: '7px', border: '1.5px solid #E8DCCF', fontFamily: 'var(--font-korean, serif)', fontSize: '14px', color: '#1A1008', resize: 'vertical', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#8B1E24'}
              onBlur={e => e.target.style.borderColor = '#E8DCCF'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#9A8A78', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans, sans-serif)' }}>English</label>
            <textarea
              value={draft.english}
              onChange={e => setDraft(d => ({ ...d, english: e.target.value }))}
              rows={2}
              style={{ padding: '7px 10px', borderRadius: '7px', border: '1.5px solid #E8DCCF', fontFamily: 'var(--font-sans, sans-serif)', fontSize: '13px', color: '#1A1008', resize: 'vertical', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#8B1E24'}
              onBlur={e => e.target.style.borderColor = '#E8DCCF'}
            />
          </div>
        </div>
      </div>

      {/* Assamese + Speak text */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '42px' }}>
        <Field label="Assamese" value={draft.assamese ?? ''} onChange={v => setDraft(d => ({ ...d, assamese: v || null }))} placeholder="Optional" />
        <Field label="Speak Text (TTS override)" value={draft.speak_text ?? ''} onChange={v => setDraft(d => ({ ...d, speak_text: v || null }))} placeholder="Optional — defaults to Korean" hint="Useful to simplify what gets spoken" />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '42px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AudioPreviewBtn text={draft.speak_text?.trim() || draft.korean} />
          <button type="button" onClick={del} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #F5CECA', background: 'transparent', color: '#C04040', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans, sans-serif)' }}>
            <Trash2 size={12} /> Delete
          </button>
        </div>
        {isDirty && <SaveBtn state={saveState} onClick={save} />}
        {saveState === 'saved' && !isDirty && (
          <span style={{ fontSize: '12px', color: '#3B6B3A', fontFamily: 'var(--font-sans, sans-serif)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={12} /> Saved
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Add item form ────────────────────────────────────────────────────────────

function AddItemForm({ chapterId, section, accent, apiBase, onAdd }: {
  chapterId: number; section: string; accent: string; apiBase: string;
  onAdd: (item: ChapterItem) => void;
}) {
  const apiFetch = useApiFetch(apiBase)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ korean: '', speak_text: '', romanization: '', english: '', assamese: '' })
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!draft.korean.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch(`/admin/learning/chapters/${chapterId}/items`, {
        method: 'POST',
        body: JSON.stringify({
          section,
          korean: draft.korean.trim(),
          speak_text: draft.speak_text.trim() || null,
          romanization: draft.romanization.trim() || null,
          english: draft.english.trim() || null,
          assamese: draft.assamese.trim() || null,
        }),
      })
      if (!res.ok) throw new Error()
      const item = await res.json()
      onAdd(item)
      setDraft({ korean: '', speak_text: '', romanization: '', english: '', assamese: '' })
      setOpen(false)
    } catch {
      alert('Failed to add item.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button" onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '8px',
          border: `1.5px dashed ${accent}60`, background: 'transparent',
          color: accent, cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          fontFamily: 'var(--font-sans, sans-serif)', width: '100%', justifyContent: 'center',
        }}
      >
        <Plus size={14} /> Add item
      </button>
    )
  }

  return (
    <div style={{ border: `1.5px solid ${accent}50`, borderRadius: '10px', padding: '14px', background: '#FDFAF6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
        <Field label="Korean *" value={draft.korean} onChange={v => setDraft(d => ({ ...d, korean: v }))} mono placeholder="한국어" />
        <Field label="Speak Text" value={draft.speak_text} onChange={v => setDraft(d => ({ ...d, speak_text: v }))} placeholder="TTS override (optional)" hint="Defaults to Korean if blank" />
        <Field label="Romanization" value={draft.romanization} onChange={v => setDraft(d => ({ ...d, romanization: v }))} placeholder="e.g. a" />
        <Field label="English / Sound" value={draft.english} onChange={v => setDraft(d => ({ ...d, english: v }))} placeholder={'e.g. "ah"'} />
        <Field label="Assamese" value={draft.assamese} onChange={v => setDraft(d => ({ ...d, assamese: v }))} placeholder="Optional" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" onClick={() => setOpen(false)} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #E8DCCF', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans, sans-serif)', color: '#6B6B6B' }}>
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={saving || !draft.korean.trim()} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '7px', border: 'none', background: accent, color: '#fff', cursor: saving ? 'default' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-sans, sans-serif)' }}>
          {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={12} />} Add
        </button>
      </div>
    </div>
  )
}

// ─── Add conversation line form ───────────────────────────────────────────────

function AddConversationForm({ chapterId, apiBase, onAdd }: {
  chapterId: number; apiBase: string; onAdd: (line: ConversationLine) => void;
}) {
  const apiFetch = useApiFetch(apiBase)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ speaker: 'A' as 'A' | 'B', korean: '', english: '', assamese: '', speak_text: '' })
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!draft.korean.trim() || !draft.english.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch(`/admin/learning/chapters/${chapterId}/conversations`, {
        method: 'POST',
        body: JSON.stringify({ ...draft, speak_text: draft.speak_text || null, assamese: draft.assamese || null }),
      })
      if (!res.ok) throw new Error()
      const line = await res.json()
      onAdd(line)
      setDraft({ speaker: 'A', korean: '', english: '', assamese: '', speak_text: '' })
      setOpen(false)
    } catch {
      alert('Failed to add conversation line.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1.5px dashed #8B1E2460', background: 'transparent', color: '#8B1E24', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-sans, sans-serif)', width: '100%', justifyContent: 'center' }}>
        <Plus size={14} /> Add conversation line
      </button>
    )
  }

  return (
    <div style={{ border: '1.5px solid #8B1E2450', borderRadius: '10px', padding: '14px', background: '#FDFAF6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button type="button" onClick={() => setDraft(d => ({ ...d, speaker: d.speaker === 'A' ? 'B' : 'A' }))} style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', cursor: 'pointer', background: draft.speaker === 'A' ? '#8B1E24' : '#2D5F7A', color: '#fff', fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-heading, serif)' }}>
          {draft.speaker}
        </button>
        <span style={{ fontSize: '12px', color: '#9A8A78', fontFamily: 'var(--font-sans, sans-serif)' }}>Click to toggle speaker A/B</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Field label="Korean *" value={draft.korean} onChange={v => setDraft(d => ({ ...d, korean: v }))} mono />
        <Field label="English *" value={draft.english} onChange={v => setDraft(d => ({ ...d, english: v }))} />
        <Field label="Assamese" value={draft.assamese} onChange={v => setDraft(d => ({ ...d, assamese: v }))} placeholder="Optional" />
        <Field label="Speak Text (TTS override)" value={draft.speak_text} onChange={v => setDraft(d => ({ ...d, speak_text: v }))} placeholder="Optional" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" onClick={() => setOpen(false)} style={{ padding: '6px 12px', borderRadius: '7px', border: '1px solid #E8DCCF', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans, sans-serif)', color: '#6B6B6B' }}>Cancel</button>
        <button type="button" onClick={submit} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '7px', border: 'none', background: '#8B1E24', color: '#fff', cursor: saving ? 'default' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-sans, sans-serif)' }}>
          {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={12} />} Add
        </button>
      </div>
    </div>
  )
}

// ─── Section block ────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  basic_vowels: 'Basic Vowels — 기본 모음',
  compound_vowels: 'Compound Vowels — 이중 모음',
  basic_consonants: 'Basic Consonants — 기본 자음',
  tense_consonants: 'Tense Consonants — 쌍자음',
  syllable_blocks: 'Syllable Blocks',
  simple_words: 'Simple Words — 기본 단어',
  sino_numbers: 'Sino-Korean Numbers — 한자 숫자',
  sino_use_cases: 'Use Cases',
  intro_phrases: 'Key Phrases — 핵심 표현',
  countries: 'Countries — 나라',
  occupations: 'Occupations — 직업',
  native_numbers: 'Native Numbers — 순우리말 숫자',
  native_use_cases: 'Use Cases',
}

function SectionBlock({ section, items, chapter, apiBase }: {
  section: string; items: ChapterItem[];
  chapter: Chapter; apiBase: string;
}) {
  const [sectionItems, setSectionItems] = useState(items)
  const accent = chapter.accent_color

  const handleDelete = (id: number) => setSectionItems(prev => prev.filter(i => i.id !== id))
  const handleUpdate = (id: number, patch: Partial<ChapterItem>) =>
    setSectionItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  const handleAdd = (item: ChapterItem) => setSectionItems(prev => [...prev, item])

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: 3, height: 18, background: accent, borderRadius: '2px' }} />
        <h3 style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 700, fontSize: '16px', color: '#1A1008', margin: 0 }}>
          {SECTION_LABELS[section] ?? section}
        </h3>
        <span style={{ fontSize: '11px', color: '#B8A898', fontFamily: 'var(--font-sans, sans-serif)' }}>
          {sectionItems.length} items
        </span>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
        {sectionItems.map(item => (
          <ItemRow key={item.id} item={item} accent={accent} apiBase={apiBase}
            onDelete={handleDelete} onUpdate={handleUpdate} />
        ))}
      </div>

      <AddItemForm chapterId={chapter.id} section={section} accent={accent} apiBase={apiBase} onAdd={handleAdd} />
    </div>
  )
}

// ─── Main ChapterEditor ───────────────────────────────────────────────────────

export function ChapterEditor({ initialData, apiBase }: Props) {
  const { chapter, items_by_section, conversations: initialConversations } = initialData
  const [conversations, setConversations] = useState(initialConversations)

  const hasConversations = conversations.length > 0 || !['vowels', 'consonants'].includes(chapter.slug)

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '36px 20px 80px' }}>
      {/* Back + header */}
      <div style={{ marginBottom: '28px' }}>
        <Link href="/admin/learning" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8B1E24', textDecoration: 'none', fontSize: '13px', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 600, marginBottom: '16px' }}>
          <ArrowLeft size={14} /> All Chapters
        </Link>

        <div style={{ background: chapter.tint_color, border: `1.5px solid ${chapter.border_color}`, borderRadius: '14px', padding: '20px 24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: chapter.accent_color, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-sans, sans-serif)', marginBottom: '6px' }}>
            Chapter {chapter.number}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 30px)', color: '#1A1008', margin: 0, lineHeight: 1.1 }}>
              {chapter.title_en}
            </h1>
            <span style={{ fontFamily: 'var(--font-korean, serif)', fontSize: '20px', color: chapter.accent_color, fontWeight: 700 }}>
              {chapter.title_ko}
            </span>
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <div style={{ background: '#FEF9F4', border: '1px solid #E8DCCF', borderRadius: '10px', padding: '12px 16px', marginBottom: '28px', fontSize: '13px', color: '#7A6A5A', fontFamily: 'var(--font-sans, sans-serif)', lineHeight: '1.6' }}>
        <strong style={{ color: '#1A1008' }}>How to edit:</strong> Click any row to expand it → edit any field → click <strong>Save</strong>. The audio 🔊 button lets you preview what the TTS will say. <strong>Speak Text</strong> is optional — leave blank to speak the Korean text directly.
      </div>

      {/* Items by section */}
      {Object.entries(items_by_section).map(([section, items]) => (
        <SectionBlock
          key={section}
          section={section}
          items={items as ChapterItem[]}
          chapter={chapter}
          apiBase={apiBase}
        />
      ))}

      {/* Conversations */}
      {hasConversations && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: 3, height: 18, background: '#8B1E24', borderRadius: '2px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', fontWeight: 700, fontSize: '18px', color: '#1A1008', margin: 0 }}>
              Practice Conversation — 대화 연습
            </h2>
            <span style={{ fontSize: '11px', color: '#B8A898', fontFamily: 'var(--font-sans, sans-serif)' }}>
              {conversations.length} lines
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {conversations.map(line => (
              <ConversationRow
                key={line.id}
                line={line}
                apiBase={apiBase}
                onDelete={id => setConversations(prev => prev.filter(l => l.id !== id))}
                onUpdate={(id, patch) => setConversations(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))}
              />
            ))}
          </div>

          <AddConversationForm
            chapterId={chapter.id}
            apiBase={apiBase}
            onAdd={line => setConversations(prev => [...prev, line])}
          />
        </div>
      )}

      {/* CSS for spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
