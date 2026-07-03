'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, BookOpen, GraduationCap, Heart,
  Sparkles, CheckCircle2, ArrowRight, ChevronDown,
  Building2, Briefcase, Globe2,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { API_BASE } from '@/lib/api'

type CurrentStatus = 'du_student' | 'other_student' | 'working' | 'other' | ''

type FormData = {
  full_name: string
  email: string
  phone: string
  current_status: CurrentStatus
  // student fields
  institution: string
  department: string
  course: string
  year_of_study: string
  // professional fields
  occupation: string
  organization: string
  // common
  why_join: string
  favourite_korean_thing: string
  how_heard: string
  how_heard_other: string
}

const STATUS_OPTIONS = [
  {
    value: 'du_student',
    label: 'Student',
    sublabel: 'Dibrugarh University',
    icon: GraduationCap,
  },
  {
    value: 'other_student',
    label: 'Student',
    sublabel: 'Another institution',
    icon: Building2,
  },
  {
    value: 'working',
    label: 'Working',
    sublabel: 'Professional',
    icon: Briefcase,
  },
  {
    value: 'other',
    label: 'Other',
    sublabel: 'Not currently enrolled',
    icon: Globe2,
  },
]

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'PhD', 'Alumni / Ex-student']

const HOW_HEARD = [
  { value: 'social_media',  label: 'Social Media' },
  { value: 'friend',        label: 'Friend / Word of Mouth' },
  { value: 'notice_board',  label: 'Notice Board / Poster' },
  { value: 'event',         label: 'Attended a DKC Event' },
  { value: 'other',         label: 'Other' },
]

function InputWrapper({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-sm font-semibold text-[#2B2B2B]">
        {label} {required && <span className="text-[#8B1E24]">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full font-sans text-sm text-[#2B2B2B] bg-white border border-[#E8DCCF] rounded-xl px-4 py-3 outline-none transition-all focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/10 placeholder:text-[#bbb]"

export default function JoinPage() {
  const [form, setForm] = useState<FormData>({
    full_name: '', email: '', phone: '', current_status: '',
    institution: '', department: '', course: '', year_of_study: '',
    occupation: '', organization: '',
    why_join: '', favourite_korean_thing: '', how_heard: '', how_heard_other: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setErrors(er => ({ ...er, [field]: undefined }))
    }

  const setStatus = (val: CurrentStatus) => {
    setForm(f => ({ ...f, current_status: val }))
    setErrors(er => ({ ...er, current_status: undefined }))
  }

  const isStudent  = form.current_status === 'du_student' || form.current_status === 'other_student'
  const isWorking  = form.current_status === 'working'
  const isOther    = form.current_status === 'other'
  const isDUStudent = form.current_status === 'du_student'

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.full_name.trim())     e.full_name = 'Full name is required'
    if (!form.email.trim())         e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.current_status)       e.current_status = 'Please select your current status'
    if (form.current_status === 'other_student' && !form.institution.trim())
                                    e.institution = 'Please enter your institution name'
    if (isStudent && !form.department.trim()) e.department = 'Department is required'
    if (isStudent && !form.year_of_study)     e.year_of_study = 'Please select your year of study'
    if (isWorking && !form.occupation.trim()) e.occupation = 'Please enter your occupation'
    if (!form.why_join.trim())      e.why_join = 'Please tell us why you want to join'
    else if (form.why_join.trim().length < 30) e.why_join = 'Please write at least 30 characters'
    if (!form.how_heard)            e.how_heard = 'Please select how you heard about us'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setServerError('')
    try {
      const res = await fetch(`${API_BASE}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...form, website: '' }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) {
          const mapped: Partial<Record<keyof FormData, string>> = {}
          Object.entries(data.errors).forEach(([k, v]) => { mapped[k as keyof FormData] = (v as string[])[0] })
          setErrors(mapped)
        } else {
          setServerError(data.message ?? 'Something went wrong. Please try again.')
        }
      } else {
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      setServerError('Could not connect to the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="회원 가입"
          title="Join DKC"
          subtitle="Become part of Dibrugarh's Korean culture community — open to everyone, wherever you are."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Join Us' }]}
        />

        <section className="max-w-3xl mx-auto px-6 py-14">
          <AnimatePresence mode="wait">

            {/* ── Success state ── */}
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', boxShadow: '0 4px 24px rgba(139,30,36,0.08)' }}
              >
                <div className="px-10 py-12 text-center" style={{ background: '#8B1E24' }}>
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <span className="block font-korean text-white/30 text-4xl mb-2">환영합니다</span>
                  <h2 className="font-heading font-bold text-white text-2xl mb-2">Application Submitted!</h2>
                  <p className="font-sans text-white/70 text-sm">We'll review your application within 3–5 working days.</p>
                </div>
                <div className="px-10 py-8">
                  <p className="font-sans text-[#444] text-sm leading-relaxed mb-6">
                    Thank you for applying to the <strong>Dibrugarh Korean Club</strong>, {form.full_name.split(' ')[0]}! 🌸<br /><br />
                    We've sent a confirmation email to <strong>{form.email}</strong> with your application details.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {[
                      { step: '1', title: 'Under Review', desc: 'Team reviews your application' },
                      { step: '2', title: 'Notification', desc: 'Email with your status' },
                      { step: '3', title: 'Welcome!', desc: 'Join events & community' },
                    ].map(s => (
                      <div key={s.step} className="rounded-xl p-4 text-center" style={{ background: '#FAF3ED' }}>
                        <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-sm text-white" style={{ background: '#8B1E24' }}>{s.step}</div>
                        <p className="font-sans text-xs font-semibold text-[#2B2B2B] mb-1">{s.title}</p>
                        <p className="font-sans text-xs text-[#888]">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/events" className="flex-1 text-center font-sans text-sm font-semibold py-3 px-6 rounded-full" style={{ background: '#8B1E24', color: '#fff' }}>
                      Explore Events <ArrowRight className="inline w-4 h-4 ml-1" />
                    </Link>
                    <Link href="/" className="flex-1 text-center font-sans text-sm font-semibold py-3 px-6 rounded-full" style={{ background: '#FAF3ED', color: '#8B1E24' }}>
                      Back to Home
                    </Link>
                  </div>
                </div>
              </motion.div>

            ) : (

              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                {/* Header card */}
                <div className="rounded-2xl p-8 mb-6 flex gap-5 items-center" style={{ background: '#8B1E24' }}>
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-white text-xl leading-tight">Membership Application</h2>
                    <p className="font-sans text-white/70 text-sm mt-1">Open to everyone — students, professionals, and culture lovers alike!</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — hidden from real users, bots fill it; rejected server-side */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />
                  <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 4px 24px rgba(139,30,36,0.06)' }}>

                    {/* ── Personal Info ── */}
                    <div className="px-8 py-7 border-b border-[#F0E8DE]">
                      <div className="flex items-center gap-2 mb-6">
                        <User className="w-4 h-4 text-[#8B1E24]" />
                        <h3 className="font-sans text-sm font-bold text-[#8B1E24] uppercase tracking-widest">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <InputWrapper label="Full Name" required>
                          <input className={inputCls} placeholder="e.g. Priya Sharma" value={form.full_name} onChange={set('full_name')} />
                          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
                        </InputWrapper>
                        <InputWrapper label="Email Address" required>
                          <input type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={set('email')} />
                          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </InputWrapper>
                        <InputWrapper label="Phone Number">
                          <input type="tel" className={inputCls} placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
                        </InputWrapper>
                      </div>
                    </div>

                    {/* ── Current Status ── */}
                    <div className="px-8 py-7 border-b border-[#F0E8DE]">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-[#8B1E24]" />
                        <h3 className="font-sans text-sm font-bold text-[#8B1E24] uppercase tracking-widest">Your Current Status</h3>
                      </div>
                      <p className="font-sans text-xs text-[#999] mb-5">Anyone can join DKC — select what best describes you.</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {STATUS_OPTIONS.map(opt => {
                          const Icon = opt.icon
                          const active = form.current_status === opt.value
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setStatus(opt.value as CurrentStatus)}
                              className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl border transition-all text-center"
                              style={active
                                ? { background: '#FAF0EE', border: '2px solid #8B1E24', color: '#8B1E24' }
                                : { background: '#FAFAFA', border: '1px solid #E8DCCF', color: '#666' }
                              }
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-sans text-xs font-bold leading-tight">{opt.label}</span>
                              <span className="font-sans text-[10px] leading-tight opacity-70">{opt.sublabel}</span>
                            </button>
                          )
                        })}
                      </div>
                      {errors.current_status && <p className="text-xs text-red-500 mt-2">{errors.current_status}</p>}

                      {/* ── Conditional: DU student ── */}
                      <AnimatePresence>
                        {isDUStudent && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }} className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                              <InputWrapper label="Department" required>
                                <input className={inputCls} placeholder="e.g. Computer Science" value={form.department} onChange={set('department')} />
                                {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                              </InputWrapper>
                              <InputWrapper label="Course / Programme">
                                <input className={inputCls} placeholder="e.g. B.Tech, BA, MBA" value={form.course} onChange={set('course')} />
                              </InputWrapper>
                              <InputWrapper label="Year of Study" required>
                                <div className="relative">
                                  <select className={`${inputCls} appearance-none pr-10`} value={form.year_of_study} onChange={set('year_of_study')}>
                                    <option value="">Select year…</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
                                </div>
                                {errors.year_of_study && <p className="text-xs text-red-500">{errors.year_of_study}</p>}
                              </InputWrapper>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Conditional: Other student ── */}
                        {form.current_status === 'other_student' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }} className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                              <InputWrapper label="Institution / University" required>
                                <input className={inputCls} placeholder="e.g. Gauhati University" value={form.institution} onChange={set('institution')} />
                                {errors.institution && <p className="text-xs text-red-500">{errors.institution}</p>}
                              </InputWrapper>
                              <InputWrapper label="Department">
                                <input className={inputCls} placeholder="e.g. Korean Studies" value={form.department} onChange={set('department')} />
                                {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                              </InputWrapper>
                              <InputWrapper label="Course / Programme">
                                <input className={inputCls} placeholder="e.g. B.A. Korean" value={form.course} onChange={set('course')} />
                              </InputWrapper>
                              <InputWrapper label="Year of Study" required>
                                <div className="relative">
                                  <select className={`${inputCls} appearance-none pr-10`} value={form.year_of_study} onChange={set('year_of_study')}>
                                    <option value="">Select year…</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
                                </div>
                                {errors.year_of_study && <p className="text-xs text-red-500">{errors.year_of_study}</p>}
                              </InputWrapper>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Conditional: Working professional ── */}
                        {isWorking && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }} className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                              <InputWrapper label="Job Title / Occupation" required>
                                <input className={inputCls} placeholder="e.g. Software Engineer" value={form.occupation} onChange={set('occupation')} />
                                {errors.occupation && <p className="text-xs text-red-500">{errors.occupation}</p>}
                              </InputWrapper>
                              <InputWrapper label="Company / Organisation">
                                <input className={inputCls} placeholder="e.g. Infosys, Govt. of Assam" value={form.organization} onChange={set('organization')} />
                              </InputWrapper>
                            </div>
                          </motion.div>
                        )}

                        {/* ── Conditional: Other ── */}
                        {isOther && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }} className="overflow-hidden"
                          >
                            <div className="mt-5">
                              <InputWrapper label="How would you describe yourself? (optional)">
                                <input className={inputCls} placeholder="e.g. Freelancer, homemaker, gap year, language enthusiast…" value={form.occupation} onChange={set('occupation')} />
                              </InputWrapper>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── About You ── */}
                    <div className="px-8 py-7 border-b border-[#F0E8DE]">
                      <div className="flex items-center gap-2 mb-6">
                        <Heart className="w-4 h-4 text-[#8B1E24]" />
                        <h3 className="font-sans text-sm font-bold text-[#8B1E24] uppercase tracking-widest">About You</h3>
                      </div>
                      <div className="flex flex-col gap-5">
                        <InputWrapper label="Why do you want to join DKC?" required>
                          <textarea
                            className={`${inputCls} resize-none`}
                            rows={4}
                            placeholder="Tell us about your interest in Korean language and culture, what you hope to learn or contribute…"
                            value={form.why_join}
                            onChange={set('why_join')}
                          />
                          <div className="flex justify-between mt-1">
                            {errors.why_join ? <p className="text-xs text-red-500">{errors.why_join}</p> : <span />}
                            <p className="text-xs text-[#bbb]">{form.why_join.length}/2000</p>
                          </div>
                        </InputWrapper>
                        <InputWrapper label="Your favourite thing about Korean culture">
                          <input className={inputCls} placeholder="e.g. K-dramas, food, language, music, history…" value={form.favourite_korean_thing} onChange={set('favourite_korean_thing')} />
                        </InputWrapper>
                      </div>
                    </div>

                    {/* ── How did you hear ── */}
                    <div className="px-8 py-7">
                      <div className="flex items-center gap-2 mb-5">
                        <Sparkles className="w-4 h-4 text-[#8B1E24]" />
                        <h3 className="font-sans text-sm font-bold text-[#8B1E24] uppercase tracking-widest">How Did You Hear About Us?</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {HOW_HEARD.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setForm(f => ({ ...f, how_heard: opt.value })); setErrors(er => ({ ...er, how_heard: undefined })) }}
                            className="text-left px-4 py-3 rounded-xl border transition-all font-sans text-sm"
                            style={
                              form.how_heard === opt.value
                                ? { background: '#FAF0EE', border: '2px solid #8B1E24', color: '#8B1E24', fontWeight: 600 }
                                : { background: '#fff', border: '1px solid #E8DCCF', color: '#555' }
                            }
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {errors.how_heard && <p className="text-xs text-red-500 mb-3">{errors.how_heard}</p>}
                      {form.how_heard === 'other' && (
                        <InputWrapper label="Please specify">
                          <input className={inputCls} placeholder="Tell us how you found out…" value={form.how_heard_other} onChange={set('how_heard_other')} />
                        </InputWrapper>
                      )}
                    </div>
                  </div>

                  {serverError && (
                    <div className="mt-4 px-5 py-4 rounded-xl text-sm font-sans text-red-700" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                      {serverError}
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.01 } : {}}
                    whileTap={!loading ? { scale: 0.99 } : {}}
                    className="w-full mt-6 font-sans font-semibold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                    style={{ background: loading ? '#c97b7f' : '#8B1E24', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      <>Submit Application <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                  <p className="text-center font-sans text-xs text-[#aaa] mt-4">
                    By submitting, you agree to be contacted by DKC regarding your membership application.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <Footer />
    </>
  )
}
