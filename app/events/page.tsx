'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, CheckCircle2, Radio } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiEvent, type EventStatus, API_BASE } from '@/lib/api'

type Filter = 'all' | EventStatus

const STATUS_STYLES: Record<EventStatus, { bg: string; text: string; label: string }> = {
  upcoming:  { bg: '#FAF3ED', text: '#8B1E24',  label: 'Upcoming'  },
  live:      { bg: '#ECFDF5', text: '#065F46',  label: 'Live Now'  },
  completed: { bg: '#F5F5F5', text: '#666666',  label: 'Completed' },
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',       label: 'All Events'  },
  { key: 'upcoming',  label: 'Upcoming'    },
  { key: 'completed', label: 'Past Events' },
]

export default function EventsPage() {
  const [active, setActive] = useState<Filter>('all')
  const [events, setEvents] = useState<ApiEvent[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then(r => r.json())
      .then((data: ApiEvent[]) => setEvents(data))
      .catch(() => {})
  }, [])

  const filtered = active === 'all' ? events : events.filter(e => e.status === active)
  const featured = events.find(e => e.status === 'upcoming') ?? events[0]

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="행사 및 이벤트"
          title="Events"
          subtitle="Cultural celebrations, language workshops, film nights and more — every semester."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
        />

        {/* ── Featured upcoming event ── */}
        <section className="max-w-7xl mx-auto px-6 py-14">
          {!featured ? null : <Link href={`/events/${featured.slug}`}>
            <motion.div
              className="relative overflow-hidden rounded-2xl p-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 cursor-pointer"
              style={{ background: featured.color, minHeight: 220 }}
              whileHover={{ scale: 1.005, boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
              transition={{ duration: 0.25 }}
            >
              {/* Background Korean character */}
              <span
                className="absolute right-10 top-1/2 -translate-y-1/2 font-korean font-bold select-none pointer-events-none opacity-10"
                style={{ fontSize: 200, color: '#fff', lineHeight: 1 }}
              >
                {featured.korean_title?.charAt(0)}
              </span>

              <div className="relative z-10">
                <span className="inline-block font-sans text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
                  Featured &middot; Next Event
                </span>
                <h2 className="font-heading font-bold text-white mb-1" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
                  {featured.title}
                </h2>
                <p className="font-korean text-white/60 text-sm mb-4">{featured.korean_title}</p>
                <div className="flex flex-wrap gap-5">
                  <span className="flex items-center gap-1.5 font-sans text-sm text-white/80">
                    <Calendar className="w-4 h-4" /> {featured.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-sm text-white/80">
                    <MapPin className="w-4 h-4" /> {featured.location}
                  </span>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <span
                  className="inline-flex items-center gap-2 font-sans font-semibold text-sm px-6 py-3 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          </Link>}
        </section>

        {/* ── Filter tabs + grid ── */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          {/* Tabs */}
          <div className="flex gap-2 mb-10 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className="font-sans text-sm px-5 py-2 rounded-full transition-all"
                style={
                  active === f.key
                    ? { background: '#8B1E24', color: '#fff', border: '1px solid #8B1E24' }
                    : { background: '#fff', color: '#555', border: '1px solid #E8DCCF' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => {
              const s = STATUS_STYLES[event.status]
              return (
                <motion.div
                  key={event.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Link href={`/events/${event.slug}`}>
                    <div
                      className="rounded-2xl overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:-translate-y-1"
                      style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                    >
                      {/* Color header */}
                      <div
                        className="relative h-32 flex items-end p-5"
                        style={{ background: event.color }}
                      >
                        <span
                          className="absolute right-4 top-1/2 -translate-y-1/2 font-korean font-bold text-white/10 select-none pointer-events-none"
                          style={{ fontSize: 80, lineHeight: 1 }}
                        >
                          {event.korean_title?.charAt(0)}
                        </span>
                        <span
                          className="relative z-10 font-sans text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background: s.bg, color: s.text }}
                        >
                          {event.status === 'live' && <Radio className="w-3 h-3 inline mr-1" />}
                          {event.status === 'completed' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {s.label}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-6 flex flex-col flex-1">
                        <span
                          className="font-sans text-xs font-medium uppercase tracking-wide mb-2"
                          style={{ color: '#8B1E24' }}
                        >
                          {event.category}
                        </span>
                        <h3 className="font-heading font-semibold text-[#2B2B2B] text-lg mb-1 leading-snug">
                          {event.title}
                        </h3>
                        <p className="font-korean text-[#aaa] text-xs mb-3">{event.korean_title}</p>
                        <p className="font-sans text-[#666] text-sm leading-relaxed mb-5 flex-1">
                          {event.description}
                        </p>
                        <div className="flex flex-col gap-1.5 mt-auto">
                          <span className="flex items-center gap-2 font-sans text-xs text-[#888]">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8B1E24' }} />
                            {event.date} &middot; {event.time}
                          </span>
                          <span className="flex items-center gap-2 font-sans text-xs text-[#888]">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8B1E24' }} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
