'use client'

import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_BASE } from '@/lib/api'
import { Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const PAGE_SIZE = 12

interface ClubMember {
  full_name: string
  current_status: string
  institution: string
  department: string
  year_of_study: string
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  du_student:    'Dibrugarh University',
  other_student: 'Student',
  working:       'Professional',
  other:         'Other',
}

function statusLabel(s: string) {
  return STATUS_LABEL[s] ?? s
}

function joinYear(dateStr: string) {
  return new Date(dateStr).getFullYear()
}

function joinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  '#8B1E24', '#C4783A', '#3A6B8B', '#2D7D5C', '#6B3A8B', '#8B6B2D', '#3A4F8B', '#7D2D5C',
]

function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export default function MembersPage() {
  const [members, setMembers]   = useState<ClubMember[]>([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')
  const [page, setPage]         = useState(1)

  useEffect(() => {
    fetch(`${API_BASE}/club-members`)
      .then(r => r.json())
      .then(data => { setMembers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const result = q
      ? members.filter(m =>
          m.full_name.toLowerCase().includes(q) ||
          (m.institution ?? '').toLowerCase().includes(q) ||
          (m.department ?? '').toLowerCase().includes(q)
        )
      : members
    return result
  }, [members, query])

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1) }, [query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F3]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-[#1A0A05] pt-28 pb-16 px-6 text-center">
        <p className="font-korean text-4xl text-white/10 font-bold mb-3">회원</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Our Members</h1>
        <p className="font-sans text-[#C4A882] max-w-xl mx-auto text-base leading-relaxed">
          The people who make Dibrugarh Korean Club what it is — learners, enthusiasts, and bridge-builders.
        </p>
        <p className="font-sans text-[#C4A882]/60 mt-2 text-sm">
          {members.length > 0 && `${members.length} members`}
        </p>
      </section>

      {/* ── Search ── */}
      <div className="sticky top-16 z-10 bg-[#FDF8F3] border-b border-[#E8DCCF] px-6 py-3">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A882]" size={18} />
          <input
            type="text"
            placeholder="Search by name, institution, or department…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full font-sans text-sm text-[#2B2B2B] bg-white border border-[#E8DCCF] rounded-full pl-11 pr-5 py-2.5 outline-none focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/10 placeholder:text-[#bbb]"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#E8DCCF] animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8DCCF]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#E8DCCF] rounded w-3/4" />
                    <div className="h-3 bg-[#E8DCCF] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-[#E8DCCF] rounded w-full mb-2" />
                <div className="h-3 bg-[#E8DCCF] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-korean text-5xl text-[#E8DCCF] mb-4">없음</p>
            <p className="font-sans text-[#999]">No members found matching &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          >
            {paginated.map((m, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white rounded-2xl p-5 border border-[#E8DCCF] hover:border-[#C4A882] hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: avatarColor(m.full_name) }}
                  >
                    {initials(m.full_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-[#1A0A05] text-base leading-tight truncate">{m.full_name}</p>
                    <p className="font-sans text-xs text-[#8B1E24] font-medium mt-0.5">{statusLabel(m.current_status)}</p>
                  </div>
                </div>

                {m.institution && (
                  <p className="font-sans text-xs text-[#555] leading-snug mb-1 line-clamp-2">
                    {m.institution}
                  </p>
                )}
                {m.department && (
                  <p className="font-sans text-xs text-[#888] leading-snug line-clamp-1">
                    {m.department}{m.year_of_study ? ` · ${m.year_of_study}` : ''}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-[#F0E8DE] flex items-center justify-between">
                  <span className="font-sans text-[10px] text-[#aaa] uppercase tracking-wide">Member since</span>
                  <span className="font-sans text-xs text-[#666] font-medium">{joinDate(m.created_at)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-full font-sans text-sm font-medium border border-[#E8DCCF] text-[#555] hover:border-[#8B1E24] hover:text-[#8B1E24] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1
                const isActive = p === page
                const isNear = Math.abs(p - page) <= 1 || p === 1 || p === totalPages
                if (!isNear) {
                  if (p === 2 || p === totalPages - 1) return <span key={p} className="px-1 text-[#bbb] text-sm">…</span>
                  return null
                }
                return (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`w-9 h-9 rounded-full font-sans text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#8B1E24] text-white'
                        : 'border border-[#E8DCCF] text-[#555] hover:border-[#8B1E24] hover:text-[#8B1E24]'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-full font-sans text-sm font-medium border border-[#E8DCCF] text-[#555] hover:border-[#8B1E24] hover:text-[#8B1E24] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-center font-sans text-xs text-[#aaa] mt-4">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} members
          </p>
        )}
      </main>

      {/* ── Join CTA ── */}
      {!loading && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl w-full px-6 pb-14"
        >
          <div
            className="rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
            style={{ background: '#1A0A05', border: '1.5px solid #3A2010' }}
          >
            <div>
              <p className="font-korean text-[#8B1E24] text-sm font-bold mb-1">함께해요</p>
              <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}>
                Don't see your name here?
              </h3>
              <p className="font-sans text-[#C4A882] text-sm leading-relaxed max-w-md">
                Join Dibrugarh Korean Club and become part of a growing community of Korean language and culture enthusiasts.
              </p>
            </div>
            <Link
              href="/join"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-sans font-semibold text-sm transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{ background: '#8B1E24', color: '#fff' }}
            >
              Join Us Today <ArrowRight size={15} />
            </Link>
          </div>
        </motion.section>
      )}

      <Footer />
    </div>
  )
}
