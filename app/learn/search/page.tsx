'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, BookMarked, Layers, MessageSquare, BookOpen, X, Loader2,
} from 'lucide-react'
import { searchLearning } from '@/lib/learning/api'
import type { ApiSearchResults, SearchResultItem } from '@/lib/learning/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#2B2B2B'

const TYPE_META: Record<SearchResultItem['type'], {
  label: string
  icon: React.ElementType
  accent: string
  tint: string
  border: string
}> = {
  vocabulary:    { label: 'Vocabulary',    icon: BookMarked,     accent: '#6B5C3E', tint: '#F4F0E8', border: '#DDD4BE' },
  grammar:       { label: 'Grammar',       icon: Layers,         accent: '#4A5568', tint: '#EEF2EE', border: '#BDD4BD' },
  conversation:  { label: 'Conversations', icon: MessageSquare,  accent: '#2D5F7A', tint: '#EBF3F8', border: '#B5D4E8' },
  lesson:        { label: 'Lessons',       icon: BookOpen,       accent: '#3B3552', tint: '#F0EEF8', border: '#C5BFDF' },
}

const RESULT_ORDER: SearchResultItem['type'][] = ['vocabulary', 'grammar', 'conversation', 'lesson']

// Maps the singular SearchResultItem type to the plural key in ApiSearchResults
const RESULTS_KEY: Record<SearchResultItem['type'], keyof ApiSearchResults> = {
  vocabulary:   'vocabulary',
  grammar:      'grammar',
  conversation: 'conversations',
  lesson:       'lessons',
}

// ─── Result row ───────────────────────────────────────────────────────────────

function ResultRow({ item }: { item: SearchResultItem }) {
  const meta = TYPE_META[item.type]
  const Icon = meta.icon

  return (
    <Link
      href={item.url}
      className="flex items-center gap-4 rounded-xl transition-all hover:shadow-sm group"
      style={{
        background: '#FFFFFF',
        border: `1px solid #E8E1D6`,
        padding: '14px 18px',
        textDecoration: 'none',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: meta.tint, border: `1px solid ${meta.border}` }}
      >
        <Icon size={16} color={meta.accent} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-heading font-semibold truncate group-hover:underline"
          style={{ fontSize: '15px', color: '#2B2B2B' }}
        >
          {item.title}
        </p>
        {item.subtitle && (
          <p className="font-sans text-xs truncate mt-0.5" style={{ color: '#888' }}>
            {item.subtitle}
          </p>
        )}
      </div>
      <span
        className="font-sans text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ background: meta.tint, color: meta.accent, border: `1px solid ${meta.border}` }}
      >
        {meta.label}
      </span>
    </Link>
  )
}

// ─── Result group ─────────────────────────────────────────────────────────────

function ResultGroup({ type, items }: { type: SearchResultItem['type']; items: SearchResultItem[] }) {
  if (items.length === 0) return null
  const meta = TYPE_META[type]
  const Icon = meta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} color={meta.accent} />
        <span className="font-sans font-semibold text-xs uppercase tracking-wide" style={{ color: meta.accent }}>
          {meta.label}
        </span>
        <span className="font-sans text-xs" style={{ color: '#BBB' }}>({items.length})</span>
      </div>
      <div className="space-y-2 mb-8">
        {items.map(item => <ResultRow key={`${item.type}-${item.id}`} item={item} />)}
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<ApiSearchResults | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(false)
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  const runSearch = useCallback((q: string) => {
    if (q.trim().length < 1) {
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    searchLearning(q.trim())
      .then(r => { setResults(r); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(val), 320)
  }

  function clearSearch() {
    setQuery('')
    setResults(null)
    setError(false)
    inputRef.current?.focus()
  }

  const hasResults = results && results.total > 0

  return (
    <div style={{ padding: '24px 32px', maxWidth: 640 }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="font-heading font-semibold text-[#2B2B2B]" style={{ fontSize: '22px', marginBottom: '4px' }}>
          Search
        </h1>
        <p className="font-sans text-sm" style={{ color: '#888' }}>
          Search across vocabulary, grammar, conversations, and lessons.
        </p>
      </div>

      {/* Search input */}
      <div
        className="flex items-center gap-3 rounded-2xl mb-8"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #DDD4C0',
          padding: '0 18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {loading
          ? <Loader2 size={18} className="animate-spin flex-shrink-0" style={{ color: '#AAA' }} />
          : <Search size={18} className="flex-shrink-0" style={{ color: '#AAA' }} />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search Korean, Assamese, English, romanization…"
          className="flex-1 font-sans bg-transparent outline-none"
          style={{ fontSize: '15px', color: '#2B2B2B', padding: '15px 0' }}
        />
        {query && (
          <button onClick={clearSearch} className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: '#AAA' }} />
          </button>
        )}
      </div>

      {/* Results area */}
      <AnimatePresence mode="wait">

        {/* Error */}
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-sans text-sm text-center" style={{ color: '#E53935', padding: '32px 0' }}
          >
            Search failed — check your connection and try again.
          </motion.p>
        )}

        {/* No results */}
        {!loading && !error && results && !hasResults && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center" style={{ padding: '48px 0' }}
          >
            <Search size={36} style={{ color: '#DDD', margin: '0 auto 12px' }} />
            <p className="font-heading font-semibold text-[#2B2B2B] text-base">No results for &ldquo;{results.query}&rdquo;</p>
            <p className="font-sans text-sm mt-1" style={{ color: '#999' }}>
              Try searching in Korean (한글), romanization, Assamese, or English.
            </p>
          </motion.div>
        )}

        {/* Results */}
        {!error && hasResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <p className="font-sans text-xs mb-6" style={{ color: '#AAA' }}>
              {results.total} result{results.total !== 1 ? 's' : ''} for &ldquo;{results.query}&rdquo;
            </p>
            {RESULT_ORDER.map(type => (
              <ResultGroup
                key={type}
                type={type}
                items={(results[RESULTS_KEY[type]] as SearchResultItem[]) ?? []}
              />
            ))}
          </motion.div>
        )}

        {/* Idle state — no query yet */}
        {!query && !results && !error && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center" style={{ padding: '48px 0' }}
          >
            <div className="flex justify-center gap-3 mb-5 flex-wrap">
              {(['vocabulary', 'grammar', 'conversation', 'lesson'] as const).map(t => {
                const m = TYPE_META[t]
                const Icon = m.icon
                return (
                  <div
                    key={t}
                    className="flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ background: m.tint, border: `1px solid ${m.border}` }}
                  >
                    <Icon size={13} color={m.accent} />
                    <span className="font-sans text-xs font-medium" style={{ color: m.accent }}>{m.label}</span>
                  </div>
                )
              })}
            </div>
            <p className="font-sans text-sm" style={{ color: '#BBB' }}>
              Type anything to search across all learning content
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
