'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Play, Star, BookOpen, X, CheckCircle2 } from 'lucide-react'
import { API_BASE, type ApiEvent, type ApiMediaPick, type ApiMember } from '@/lib/api'

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    const calculate = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      }
    }
    setTime(calculate())
    const id = setInterval(() => setTime(calculate()), 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

// ─── Upcoming Event Card ───────────────────────────────────────────────────────

function UpcomingEventCard() {
  const FALLBACK_DATE = new Date('2026-10-09T10:00:00')
  const FALLBACK_TITLE = 'Hangul Day Celebration'
  const FALLBACK_SUBTITLE = 'The beauty of Korean letters'
  const FALLBACK_DATE_LABEL = '09 Oct, 2026 (Friday)'
  const FALLBACK_LOCATION = 'DU Campus, Dibrugarh University'

  const [eventDate, setEventDate] = useState<Date>(FALLBACK_DATE)
  const [title, setTitle] = useState(FALLBACK_TITLE)
  const [subtitle, setSubtitle] = useState(FALLBACK_SUBTITLE)
  const [dateLabel, setDateLabel] = useState(FALLBACK_DATE_LABEL)
  const [location, setLocation] = useState(FALLBACK_LOCATION)
  const [eventSlug, setEventSlug] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [regState, setRegState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [regErrors, setRegErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', department: '', message: '' })

  useEffect(() => {
    fetch(`${API_BASE}/events?status=upcoming`)
      .then(r => r.json())
      .then((data: ApiEvent[]) => {
        const first = data[0]
        if (!first) return
        setEventDate(new Date(first.date_iso))
        setTitle(first.title)
        setSubtitle(first.korean_title ?? FALLBACK_SUBTITLE)
        setDateLabel(first.date)
        setLocation(first.location)
        setEventSlug(first.slug)
      })
      .catch(() => {})
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegState('loading')
    setRegErrors({})
    try {
      const res = await fetch(`${API_BASE}/event-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, event_slug: eventSlug ?? 'unknown', event_title: title, website: '' }),
      })
      const data = await res.json()
      if (!res.ok) { setRegErrors(data.errors ?? {}); setRegState('error'); return }
      setRegState('success')
    } catch {
      setRegState('error')
    }
  }

  const { days, hours, mins, secs } = useCountdown(eventDate)

  const countdownItems = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Mins', value: mins },
    { label: 'Secs', value: secs },
  ]

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4, boxShadow: '0px 10px 32px rgba(139,30,36,0.13)' }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: '#FAF3ED',
        boxShadow: '0px 10px 24px rgba(139,30,36,0.08)',
      }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h3 className="font-heading font-semibold text-[#2B2B2B]" style={{ fontSize: '20px' }}>
          Upcoming Event
        </h3>
        <Link
          href="/events"
          className="flex items-center gap-1 font-sans text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: '#8B1E24' }}
        >
          View All <span aria-hidden>&#8594;</span>
        </Link>
      </div>

      {/* Event image card — background image blended in */}
      <div className="mx-4 mb-0 rounded-xl overflow-hidden relative" style={{ minHeight: '180px' }}>
        {/* soft background image */}
        <div className="absolute inset-0">
          <Image
            src="/cherry-blossoms.png"
            alt=""
            fill
            className="object-cover object-center opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(250,243,237,0.95) 40%, rgba(250,243,237,0.6) 100%)',
            }}
          />
        </div>

        {/* Content over image */}
        <div className="relative z-10 px-5 pt-5 pb-5">
          <h4
            className="font-heading font-semibold text-[#2B2B2B] mb-1 leading-snug"
            style={{ fontSize: '18px' }}
          >
            {title}
          </h4>
          <p className="font-sans text-[#666666] mb-4" style={{ fontSize: '13px' }}>
            {subtitle}
          </p>

          {/* Countdown timer */}
          <div className="flex items-end gap-3 mb-1">
            {countdownItems.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span
                  suppressHydrationWarning
                  className="font-sans font-bold text-[#8B1E24] leading-none"
                  style={{ fontSize: '22px' }}
                >
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="font-sans text-[#666666] mt-0.5" style={{ fontSize: '11px' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event details */}
      <div className="px-6 pt-4 pb-3 space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#8B1E24' }} />
          <span className="font-sans text-[#444444]" style={{ fontSize: '13px' }}>
            {dateLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#8B1E24' }} />
          <span className="font-sans text-[#444444]" style={{ fontSize: '13px' }}>
            {location}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 pt-3 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowModal(true); setRegState('idle'); setRegErrors({}); setForm({ full_name: '', email: '', phone: '', department: '', message: '' }) }}
          className="w-full font-sans font-semibold text-white rounded-[22px] py-3 transition-colors text-center"
          style={{ background: '#8B1E24', fontSize: '15px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          Register Now
        </motion.button>
      </div>
    </motion.div>

    {/* Registration Modal */}
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: '#fff' }}
            initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-7 pt-7 pb-5" style={{ borderBottom: '1px solid #F0EBE4' }}>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full"
                style={{ background: '#FAF3ED' }}
              >
                <X className="w-4 h-4" style={{ color: '#8B1E24' }} />
              </button>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#8B1E24' }}>Event Registration</p>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-lg leading-snug">{title}</h2>
            </div>

            {regState === 'success' ? (
              <div className="px-7 py-10 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FAF3ED' }}>
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#8B1E24' }} />
                </div>
                <h3 className="font-heading font-bold text-[#2B2B2B] text-lg mb-2">You&apos;re Registered!</h3>
                <p className="font-sans text-[#666] text-sm leading-relaxed mb-6">
                  Check your email for a confirmation. We&apos;ll see you at the event! 🎉
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="font-sans font-semibold text-white text-sm px-6 py-2.5 rounded-full"
                  style={{ background: '#8B1E24' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="px-7 py-6 space-y-4">
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                {([
                  { key: 'full_name', label: 'Full Name *', type: 'text', required: true },
                  { key: 'email', label: 'Email Address *', type: 'email', required: true },
                  { key: 'phone', label: 'Phone (optional)', type: 'tel', required: false },
                  { key: 'department', label: 'Department / Course (optional)', type: 'text', required: false },
                ] as { key: keyof typeof form; label: string; type: string; required: boolean }[]).map(({ key, label, type, required }) => (
                  <div key={key}>
                    <label className="block font-sans text-xs font-semibold text-[#555] mb-1">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full font-sans text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
                      style={{ border: regErrors[key] ? '1.5px solid #c0392b' : '1.5px solid #E8DCCF', background: '#FAFAFA' }}
                    />
                    {regErrors[key] && <p className="font-sans text-xs text-red-600 mt-1">{regErrors[key][0]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block font-sans text-xs font-semibold text-[#555] mb-1">Message (optional)</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full font-sans text-sm px-4 py-2.5 rounded-xl outline-none resize-none"
                    style={{ border: '1.5px solid #E8DCCF', background: '#FAFAFA' }}
                  />
                </div>
                {regState === 'error' && Object.keys(regErrors).length === 0 && (
                  <p className="font-sans text-xs text-red-600">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={regState === 'loading'}
                  className="w-full font-sans font-semibold text-white text-sm py-3 rounded-xl transition-all"
                  style={{ background: '#8B1E24', opacity: regState === 'loading' ? 0.7 : 1 }}
                >
                  {regState === 'loading' ? 'Registering…' : 'Confirm Registration'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}

// ─── Korean Media Picks ────────────────────────────────────────────────────────

const FALLBACK_MEDIA_PICKS = [
  {
    id: 1,
    type: 'Drama',
    title: 'Crash Landing on You',
    korean_title: '사랑의 불시착',
    description: 'A South Korean heiress accidentally paraglides into North Korea and falls in love.',
    tag: 'Netflix',
    streaming_platform: 'Netflix',
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    type: 'Movie',
    title: 'Parasite',
    korean_title: '기생충',
    description: 'Award-winning masterpiece exploring class divide through a darkly comic lens.',
    tag: 'Oscar Winner',
    streaming_platform: '',
    is_active: true,
    sort_order: 2,
  },
  {
    id: 3,
    type: 'Book',
    title: 'Please Look After Mom',
    korean_title: '엄마를 부탁해',
    description: "A profound novel about family bonds and a mother's unconditional love.",
    tag: 'Bestseller',
    streaming_platform: '',
    is_active: true,
    sort_order: 3,
  },
] satisfies ApiMediaPick[]

const TYPE_ICON: Record<string, typeof Play> = {
  Drama: Play,
  Movie: Star,
  Book: BookOpen,
}

function KoreanMediaPicks() {
  const [mediaPicks, setMediaPicks] = useState<ApiMediaPick[]>(FALLBACK_MEDIA_PICKS)

  useEffect(() => {
    fetch(`${API_BASE}/media-picks`)
      .then(r => r.json())
      .then((data: ApiMediaPick[]) => { if (data?.length) setMediaPicks(data) })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 10px 24px rgba(139,30,36,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h3 className="font-heading font-semibold text-[#2B2B2B]" style={{ fontSize: '20px' }}>
          Korean Media Picks
        </h3>
        <Link
          href="/culture"
          className="flex items-center gap-1 font-sans text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: '#8B1E24' }}
        >
          View All <span aria-hidden>&#8594;</span>
        </Link>
      </div>

      {/* Items */}
      <div className="flex flex-col flex-1 divide-y px-2" style={{ borderColor: '#E8DCCF' }}>
        {mediaPicks.map((pick, idx) => {
          const Icon = TYPE_ICON[pick.type] ?? Play
          return (
            <motion.div
              key={idx}
              whileHover={{ backgroundColor: '#FAF3ED' }}
              className="flex items-start gap-4 px-4 py-4 rounded-xl cursor-pointer transition-colors"
            >
              {/* Icon tile */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#FAF3ED' }}
              >
                <Icon className="w-5 h-5" style={{ color: '#8B1E24' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="font-heading font-semibold text-[#2B2B2B] truncate" style={{ fontSize: '14px' }}>
                    {pick.title}
                  </p>
                  <span
                    className="flex-shrink-0 font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: '#FAF3ED', color: '#8B1E24' }}
                  >
                    {pick.tag}
                  </span>
                </div>
                <p className="font-korean text-[#8B1E24] mb-1" style={{ fontSize: '12px' }}>
                  {pick.korean_title}
                </p>
                <p className="font-sans text-[#666666] leading-snug" style={{ fontSize: '12px' }}>
                  {pick.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-5">
        <Link href="/culture">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-sans font-semibold rounded-[22px] py-3 border-2 transition-colors text-center"
            style={{
              borderColor: '#8B1E24',
              color: '#8B1E24',
              background: 'transparent',
              fontSize: '14px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Explore All Media
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}

// ─── New Member Spotlight ──────────────────────────────────────────────────────

const FALLBACK_MEMBERS: ApiMember[] = [
  {
    id: 1,
    name: 'Park Ji-won',
    initials: 'PJ',
    role: 'Member',
    department: '',
    joined_month: 'Jan',
    joined_year: 2025,
    quote: "Learning Korean is not just about a language — it's about connecting hearts and cultures.",
    dream: 'Visit Korea',
    favourite_word: '사랑 (Sa-rang) — Love',
    photo_path: '',
    is_spotlight: true,
    is_active: true,
  },
  {
    id: 2,
    name: 'Kim Min-jun',
    initials: 'KM',
    role: 'Member',
    department: '',
    joined_month: 'Mar',
    joined_year: 2025,
    quote: 'Every class brings me closer to understanding this beautiful culture.',
    dream: 'Become Translator',
    favourite_word: '친구 (Chingu) — Friend',
    photo_path: '',
    is_spotlight: true,
    is_active: true,
  },
]

function NewMemberSpotlight() {
  const [members, setMembers] = useState<ApiMember[]>(FALLBACK_MEMBERS)

  useEffect(() => {
    fetch(`${API_BASE}/members`)
      .then(r => r.json())
      .then((data: ApiMember[]) => { if (data?.length) setMembers(data) })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 10px 24px rgba(139,30,36,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h3 className="font-heading font-semibold text-[#2B2B2B]" style={{ fontSize: '20px' }}>
          New Member Spotlight
        </h3>
        <Link
          href="/community"
          className="flex items-center gap-1 font-sans text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: '#8B1E24' }}
        >
          View All <span aria-hidden>&#8594;</span>
        </Link>
      </div>

      {/* Member cards */}
      <div className="flex flex-col flex-1 gap-3 px-4 pb-4">
        {members.map((m, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(139,30,36,0.10)' }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl p-4 border"
            style={{ background: '#FAF3ED', borderColor: '#E8DCCF' }}
          >
            {/* Avatar + name row */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-heading font-bold text-white flex-shrink-0"
                style={{ background: '#8B1E24', fontSize: '14px' }}
              >
                {m.initials}
              </div>
              <div>
                <p className="font-heading font-semibold text-[#2B2B2B] leading-tight" style={{ fontSize: '14px' }}>
                  {m.name}
                </p>
                <p className="font-sans text-[#666666]" style={{ fontSize: '11px' }}>
                  Member since {m.joined_month} {m.joined_year}
                </p>
              </div>
              <span
                className="ml-auto font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#8B1E24', color: '#FFFFFF' }}
              >
                New
              </span>
            </div>

            {/* Quote */}
            <p
              className="font-sans italic text-[#444444] leading-snug mb-3"
              style={{ fontSize: '12px' }}
            >
              &ldquo;{m.quote}&rdquo;
            </p>

            {/* Stats row */}
            <div
              className="grid grid-cols-2 gap-2 pt-3 border-t"
              style={{ borderColor: '#E8DCCF' }}
            >
              <div>
                <p className="font-sans text-[#8B1E24] font-semibold" style={{ fontSize: '10px' }}>
                  Dream
                </p>
                <p className="font-sans text-[#2B2B2B]" style={{ fontSize: '12px' }}>
                  {m.dream}
                </p>
              </div>
              <div>
                <p className="font-sans text-[#8B1E24] font-semibold" style={{ fontSize: '10px' }}>
                  Favourite Word
                </p>
                <p className="font-sans text-[#2B2B2B]" style={{ fontSize: '12px' }}>
                  {m.favourite_word}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-6 mt-auto">
        <Link href="/join">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full font-sans font-semibold text-white rounded-[22px] py-3 transition-colors text-center"
            style={{ background: '#8B1E24', fontSize: '14px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Join Our Community
          </motion.div>
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export function EventsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <UpcomingEventCard />
          <KoreanMediaPicks />
          <NewMemberSpotlight />
        </div>
      </div>
    </section>
  )
}
