'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, ChevronRight, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiEvent, API_BASE } from '@/lib/api'

type RegForm = { full_name: string; email: string; phone: string; department: string; message: string }
type RegState = 'idle' | 'loading' | 'success' | 'error'

export function EventDetail({ slug }: { slug: string }) {
  const [event, setEvent] = useState<ApiEvent | null>(null)
  const [notFoundState, setNotFoundState] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  const [showModal, setShowModal] = useState(false)
  const [regState, setRegState] = useState<RegState>('idle')
  const [regErrors, setRegErrors] = useState<Record<string, string[]>>({})
  const [form, setForm] = useState<RegForm>({ full_name: '', email: '', phone: '', department: '', message: '' })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    setRegState('loading')
    setRegErrors({})
    try {
      const res = await fetch(`${API_BASE}/event-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, event_slug: slug, event_title: event.title, website: '' }),
      })
      const data = await res.json()
      if (!res.ok) { setRegErrors(data.errors ?? {}); setRegState('error'); return }
      setRegState('success')
    } catch {
      setRegState('error')
    }
  }

  useEffect(() => {
    fetch(`${API_BASE}/events/${slug}`)
      .then(r => {
        if (!r.ok) { setNotFoundState(true); return null }
        return r.json()
      })
      .then((data: ApiEvent | null) => { if (data) setEvent(data) })
      .catch(() => setNotFoundState(true))
  }, [slug])

  useEffect(() => {
    if (!event?.date_iso || event.status !== 'upcoming') return
    const calc = () => {
      const diff = new Date(event.date_iso).getTime() - Date.now()
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 }); return }
      setCountdown({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [event?.date_iso, event?.status])

  if (notFoundState) notFound()
  if (!event) return null

  const isUpcoming = event.status === 'upcoming'

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        {/* Hero banner */}
        <div
          className="relative overflow-hidden"
          style={{ background: event.color, minHeight: 280 }}
        >
          <span
            className="absolute right-20 top-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none opacity-10"
            style={{ fontSize: 280, color: '#fff', lineHeight: 1 }}
          >
            {event.korean_title?.charAt(0)}
          </span>
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 font-sans text-sm text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
            <nav className="flex items-center gap-1 mb-4">
              {[{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: event.title }].map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-white/40" />}
                  {b.href
                    ? <Link href={b.href} className="font-sans text-xs text-white/60 hover:text-white/90">{b.label}</Link>
                    : <span className="font-sans text-xs text-white/90">{b.label}</span>
                  }
                </span>
              ))}
            </nav>
            <span
              className="inline-block font-sans text-xs font-semibold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            >
              {event.category}
            </span>
            <h1 className="font-heading font-bold text-white mb-2" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              {event.title}
            </h1>
            <p className="font-korean text-white/50 text-sm">{event.korean_title}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left — main content */}
            <div className="flex-1 min-w-0">

              {/* Countdown (upcoming only) */}
              {isUpcoming && (
                <motion.div
                  className="rounded-2xl p-8 mb-8"
                  style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#8B1E24] mb-5">Countdown to Event</p>
                  <div className="flex gap-4 sm:gap-8">
                    {([['days', countdown.days], ['hours', countdown.hours], ['mins', countdown.mins], ['secs', countdown.secs]] as [string, number][]).map(([label, val]) => (
                      <div key={label} className="text-center">
                        <p className="font-heading font-bold text-[#2B2B2B]" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1 }}>
                          {String(val).padStart(2, '0')}
                        </p>
                        <p className="font-sans text-[#999] text-xs mt-1 capitalize">{label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-heading font-bold text-[#2B2B2B] text-xl mb-4">About This Event</h2>
                {event.long_description.split('\n').map((para, i) =>
                  para.trim() ? (
                    <p key={i} className="font-sans text-[#555] text-base leading-relaxed mb-4">{para.trim()}</p>
                  ) : null
                )}
              </div>

              {/* Highlights */}
              {Array.isArray(event.highlights) && event.highlights.length > 0 && (
                <div
                  className="rounded-2xl p-7"
                  style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                >
                  <h3 className="font-heading font-bold text-[#2B2B2B] text-base mb-5">Event Highlights</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#8B1E24' }} />
                        <span className="font-sans text-[#555] text-sm">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right — details sidebar */}
            <div className="flex-shrink-0 w-full lg:w-80 space-y-5">

              {/* Event details card */}
              <div
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1px solid #E8DCCF' }}
              >
                <h3 className="font-heading font-bold text-[#2B2B2B] text-sm mb-5 uppercase tracking-wide">Event Details</h3>
                <div className="space-y-4">
                  {[
                    { icon: Calendar, label: 'Date',  value: event.date },
                    { icon: Clock,    label: 'Time',  value: event.time },
                    { icon: MapPin,   label: 'Venue', value: event.location },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FAF3ED' }}>
                        <Icon className="w-4 h-4" style={{ color: '#8B1E24' }} />
                      </div>
                      <div>
                        <p className="font-sans text-xs text-[#aaa] mb-0.5">{label}</p>
                        <p className="font-sans text-sm text-[#2B2B2B] font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              {isUpcoming ? (
                <button
                  onClick={() => { setShowModal(true); setRegState('idle'); setRegErrors({}) }}
                  className="flex items-center justify-center gap-2 w-full font-sans font-semibold text-white rounded-2xl transition-all hover:shadow-lg"
                  style={{ background: '#8B1E24', height: 52, fontSize: '15px' }}
                >
                  Register Now
                </button>
              ) : (
                <div
                  className="flex items-center justify-center gap-2 w-full font-sans font-medium text-[#888] rounded-2xl"
                  style={{ background: '#F5F5F5', height: 52, fontSize: '14px', border: '1px solid #E8DCCF' }}
                >
                  <CheckCircle2 className="w-4 h-4" /> Event Completed
                </div>
              )}

              <Link
                href="/events"
                className="flex items-center justify-center gap-2 w-full font-sans text-sm text-[#8B1E24] rounded-2xl transition-all hover:bg-[#FAF3ED]"
                style={{ height: 48, border: '1px solid #E8DCCF' }}
              >
                <ArrowLeft className="w-4 h-4" /> All Events
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />

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
              {/* Header */}
              <div className="px-7 pt-7 pb-5" style={{ borderBottom: '1px solid #F0EBE4' }}>
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ background: '#FAF3ED' }}
                >
                  <X className="w-4 h-4" style={{ color: '#8B1E24' }} />
                </button>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#8B1E24' }}>Event Registration</p>
                <h2 className="font-heading font-bold text-[#2B2B2B] text-lg leading-snug">{event?.title}</h2>
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
                  {/* honeypot */}
                  <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                  {[
                    { key: 'full_name', label: 'Full Name *', type: 'text', required: true },
                    { key: 'email', label: 'Email Address *', type: 'email', required: true },
                    { key: 'phone', label: 'Phone (optional)', type: 'tel', required: false },
                    { key: 'department', label: 'Department / Course (optional)', type: 'text', required: false },
                  ].map(({ key, label, type, required }) => (
                    <div key={key}>
                      <label className="block font-sans text-xs font-semibold text-[#555] mb-1">{label}</label>
                      <input
                        type={type}
                        required={required}
                        value={form[key as keyof RegForm]}
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
