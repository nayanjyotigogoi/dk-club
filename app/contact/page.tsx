'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Clock, AtSign, PlayCircle, Send } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const SUBJECTS = [
  'General Enquiry',
  'Membership / Joining',
  'Event Collaboration',
  'Magazine Contribution',
  'Sponsorship / Partnership',
  'Media & Press',
  'Other',
]

const contactCards = [
  {
    icon: Mail,
    label: 'Email',
    value: 'dkc@dibru.ac.in',
    sub: 'We reply within 48 hours',
    href: 'mailto:dkc@dibru.ac.in',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Dibrugarh University',
    sub: 'Rajabheta, Dibrugarh, Assam 786004',
    href: null,
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon – Fri, 2 PM – 6 PM',
    sub: 'Saturday 10 AM – 4 PM',
    href: null,
  },
]

const socials = [
  { icon: AtSign,      label: 'Instagram', handle: '@dibrugarhkoreanclub', href: 'https://instagram.com' },
  { icon: PlayCircle,  label: 'YouTube',   handle: 'Dibrugarh Korean Club', href: 'https://youtube.com' },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [subject, setSubject] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="연락하기"
          title="Get in"
          accent="Touch"
          subtitle="Questions, collaborations, membership enquiries or just a hello — we would love to hear from you."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        />

        <section className="max-w-7xl mx-auto px-6 py-16 pb-20">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* ── Left — Contact form ── */}
            <motion.div
              className="flex-1 w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="rounded-2xl p-8"
                style={{ background: '#fff', border: '1px solid #E8DCCF' }}
              >
                <h2 className="font-heading font-bold text-[#2B2B2B] text-xl mb-6">Send us a message</h2>

                {sent ? (
                  <motion.div
                    className="flex flex-col items-center text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{ background: '#FAF3ED' }}
                    >
                      <Send className="w-6 h-6" style={{ color: '#8B1E24' }} />
                    </div>
                    <h3 className="font-heading font-bold text-[#2B2B2B] text-lg mb-2">Message Sent!</h3>
                    <p className="font-sans text-[#666] text-sm leading-relaxed max-w-xs">
                      Thank you for reaching out. We will get back to you within 48 hours.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 font-sans text-sm text-[#8B1E24] hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">
                          Full Name <span style={{ color: '#8B1E24' }}>*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none transition-all"
                          style={{ background: '#FAF6F0', border: '1px solid #E8DCCF' }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">
                          Email <span style={{ color: '#8B1E24' }}>*</span>
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none transition-all"
                          style={{ background: '#FAF6F0', border: '1px solid #E8DCCF' }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">Subject</label>
                      <select
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none transition-all appearance-none"
                        style={{ background: '#FAF6F0', border: '1px solid #E8DCCF' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                      >
                        <option value="">Select a subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">
                        Message <span style={{ color: '#8B1E24' }}>*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none resize-none transition-all"
                        style={{ background: '#FAF6F0', border: '1px solid #E8DCCF' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 font-sans font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                      style={{ background: '#8B1E24', height: '48px', padding: '0 32px', borderRadius: '24px', fontSize: '15px' }}
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ── Right — Info ── */}
            <motion.div
              className="flex-shrink-0 w-full lg:w-80 flex flex-col gap-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Contact cards */}
              {contactCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <div
                    key={i}
                    className="rounded-2xl p-5 flex items-start gap-4"
                    style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#FAF3ED' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: '#8B1E24' }} />
                    </div>
                    <div>
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#aaa] mb-0.5">{card.label}</p>
                      {card.href ? (
                        <a
                          href={card.href}
                          className="font-sans font-semibold text-[#2B2B2B] text-sm hover:text-[#8B1E24] transition-colors"
                        >
                          {card.value}
                        </a>
                      ) : (
                        <p className="font-sans font-semibold text-[#2B2B2B] text-sm">{card.value}</p>
                      )}
                      <p className="font-sans text-xs text-[#aaa] mt-0.5">{card.sub}</p>
                    </div>
                  </div>
                )
              })}

              {/* Social links */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
              >
                <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#aaa] mb-4">Follow Us</p>
                <div className="flex flex-col gap-3">
                  {socials.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: '#8B1E24' }} />
                        </div>
                        <div>
                          <p className="font-sans text-xs font-semibold text-[#2B2B2B] group-hover:text-[#8B1E24] transition-colors">{s.label}</p>
                          <p className="font-sans text-[10px] text-[#aaa]">{s.handle}</p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Register CTA card */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#8B1E24' }}
              >
                <p className="font-korean text-white/60 text-xs mb-1">회원 가입</p>
                <h3 className="font-heading font-bold text-white text-base mb-2">Ready to Join?</h3>
                <p className="font-sans text-white/70 text-xs leading-relaxed mb-4">
                  Membership is free and open to all Dibrugarh University students.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-4 py-2 rounded-full transition-all"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Register Now
                </a>
              </div>
            </motion.div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
