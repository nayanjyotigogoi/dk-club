'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_BASE } from '@/lib/api'

const COURSES = [
  {
    id: 'basic_korean' as const,
    titleFull: 'Basic Korean Learning',
    korean: '기초 한국어',
    koreanChar: '기',
    level: 'Beginner',
    tag: 'Perfect for starters',
    description:
      'Start from zero and build a solid foundation in Korean. Learn Hangul, everyday vocabulary, essential grammar and simple conversations — structured for absolute beginners.',
    highlights: [
      'Hangul script from scratch',
      'Core 500 vocabulary',
      'Basic sentence structure',
      'Everyday conversations',
      'Listening & speaking practice',
    ],
  },
  {
    id: 'topik_ii' as const,
    titleFull: 'TOPIK II Preparation',
    korean: '토픽 II 준비',
    koreanChar: '토',
    level: 'Intermediate – Advanced',
    tag: 'Levels 3 – 6',
    description:
      'Structured preparation for the TOPIK II exam. Covers advanced grammar, reading comprehension, writing strategies and full mock tests aligned with the official format.',
    highlights: [
      'Advanced grammar patterns',
      'Reading comprehension strategy',
      'Academic & formal vocabulary',
      'Writing essay techniques',
      'Full mock exam practice',
    ],
  },
]

type CourseId = 'basic_korean' | 'topik_ii'

interface FormState {
  full_name: string; email: string; phone: string
  current_status: string; department: string; year_of_study: string
  korean_level: string; why_interested: string; website: string
}

const EMPTY: FormState = {
  full_name: '', email: '', phone: '', current_status: '',
  department: '', year_of_study: '', korean_level: '', why_interested: '', website: '',
}

function InterestForm({ courseId, courseName, onClose }: {
  courseId: CourseId; courseName: string; onClose: () => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverErr, setServerErr] = useState('')

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.full_name.trim()) e.full_name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.current_status) e.current_status = 'Please select your status'
    if (!form.korean_level) e.korean_level = 'Please select your Korean level'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setSubmitting(true); setServerErr('')
    try {
      const res = await fetch(`${API_BASE}/course-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, course: courseId }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) { setServerErr(data.message); return }
        if (data.errors) {
          const fe: Record<string, string> = {}
          Object.entries(data.errors).forEach(([k, v]) => { fe[k] = (v as string[])[0] })
          setErrors(fe); return
        }
        setServerErr('Something went wrong. Please try again.')
        return
      }
      setSuccess(true)
    } catch {
      setServerErr('Network error. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  const isStudent = ['du_student', 'other_student'].includes(form.current_status)
  const bdr = (key: string) => ({ background: '#FAFAF8', border: `1.5px solid ${errors[key] ? '#C0392B' : '#E8DCCF'}` })
  const cls = 'w-full rounded-xl px-4 py-2.5 font-sans text-sm text-[#2B2B2B] outline-none'

  if (success) {
    return (
      <div className="flex flex-col items-center text-center py-10 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: '#FAF3ED', border: '1.5px solid #E8DCCF' }}>
          <CheckCircle className="w-7 h-7" style={{ color: '#8B1E24' }} />
        </motion.div>
        <p className="font-korean mb-1" style={{ fontSize: 12, color: '#8B1E24', opacity: 0.55 }}>등록 완료!</p>
        <h3 className="font-heading font-bold text-[#2B2B2B] text-xl mb-3">You&apos;re on the list!</h3>
        <p className="font-sans text-[#777] text-sm leading-relaxed mb-7 max-w-xs">
          We&apos;ve noted your interest in <strong>{courseName}</strong>. We&apos;ll reach out as soon as enrolments open.
        </p>
        <button onClick={onClose} className="font-sans font-semibold text-sm px-6 py-2.5 rounded-full transition-opacity hover:opacity-75"
          style={{ background: '#FAF3ED', color: '#8B1E24', border: '1px solid #E8DCCF' }}>
          Back to Courses
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-1">
      <input type="text" name="website" value={form.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Full Name <span style={{ color: '#8B1E24' }}>*</span></label>
          <input type="text" value={form.full_name} onChange={set('full_name')} className={cls} style={bdr('full_name')} />
          {errors.full_name && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.full_name}</p>}
        </div>
        <div>
          <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Email Address <span style={{ color: '#8B1E24' }}>*</span></label>
          <input type="email" value={form.email} onChange={set('email')} className={cls} style={bdr('email')} />
          {errors.email && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Phone <span className="font-normal text-[#BBB]">(optional)</span></label>
        <input type="tel" value={form.phone} onChange={set('phone')} className={cls} style={bdr('phone')} />
      </div>

      <div>
        <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Current Status <span style={{ color: '#8B1E24' }}>*</span></label>
        <select value={form.current_status} onChange={set('current_status')} className={cls} style={bdr('current_status')}>
          <option value="">Select your status…</option>
          <option value="du_student">Student at Dibrugarh University</option>
          <option value="other_student">Student at Another Institution</option>
          <option value="working">Working Professional</option>
          <option value="other">Other</option>
        </select>
        {errors.current_status && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.current_status}</p>}
      </div>

      {isStudent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Department / Stream</label>
            <input type="text" value={form.department} onChange={set('department')} className={cls} style={bdr('department')} />
          </div>
          <div>
            <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Year of Study</label>
            <input type="text" value={form.year_of_study} onChange={set('year_of_study')} className={cls} style={bdr('year_of_study')} />
          </div>
        </div>
      )}

      <div>
        <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">Korean Level <span style={{ color: '#8B1E24' }}>*</span></label>
        <select value={form.korean_level} onChange={set('korean_level')} className={cls} style={bdr('korean_level')}>
          <option value="">Select your level…</option>
          <option value="none">No Korean at all</option>
          <option value="beginner">Beginner (know some basics)</option>
          <option value="intermediate">Intermediate (can read / write)</option>
        </select>
        {errors.korean_level && <p className="text-xs mt-1" style={{ color: '#C0392B' }}>{errors.korean_level}</p>}
      </div>

      <div>
        <label className="block font-sans text-xs font-semibold text-[#555] mb-1.5">
          Why are you interested? <span className="font-normal text-[#BBB]">(optional)</span>
        </label>
        <textarea value={form.why_interested} onChange={set('why_interested')} rows={3}
          placeholder="Tell us a little about your goals…"
          className={`${cls} resize-none`}
          style={{ background: '#FAFAF8', border: '1.5px solid #E8DCCF' }} />
      </div>

      {serverErr && (
        <div className="rounded-xl p-3.5" style={{ background: '#FFF5F5', border: '1px solid #F5C0C0' }}>
          <p className="font-sans text-sm" style={{ color: '#C0392B' }}>{serverErr}</p>
        </div>
      )}

      <motion.button type="submit" disabled={submitting} whileTap={{ scale: 0.98 }}
        className="w-full font-heading font-bold text-white rounded-full disabled:opacity-50"
        style={{ height: 50, background: '#8B1E24', fontSize: 15, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
        {submitting ? 'Submitting…' : 'Register My Interest'}
      </motion.button>

      <p className="font-sans text-xs text-center" style={{ color: '#C8C0B8' }}>
        Free &amp; non-binding — we&apos;ll only contact you when the course opens
      </p>
    </form>
  )
}

function ModalHeader({ course, onClose }: { course: typeof COURSES[number]; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <p className="font-korean mb-0.5" style={{ fontSize: 11, color: '#8B1E24', opacity: 0.5 }}>{course.korean}</p>
        <h3 className="font-heading font-bold text-[#1A1A1A]" style={{ fontSize: 20 }}>{course.titleFull}</h3>
        <p className="font-sans mt-1" style={{ fontSize: 12, color: '#AAA' }}>
          Register your interest — we&apos;ll contact you when enrolments open
        </p>
      </div>
      <button onClick={onClose}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-4 mt-0.5 transition-colors hover:bg-[#FAF3ED]">
        <X className="w-4 h-4" style={{ color: '#999' }} />
      </button>
    </div>
  )
}

export default function CoursesPage() {
  const [active, setActive] = useState<CourseId | null>(null)
  const activeCourse = COURSES.find(c => c.id === active)

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0', minHeight: '100vh' }}>

        <PageHero
          koreanTitle="강좌"
          title="Korean Language"
          accent="Courses"
          subtitle="We're planning structured courses for every level. Register your interest — we'll reach out when enrolments open."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]}
        />

        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {COURSES.map((course, i) => (
              <motion.article
                key={course.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{ background: '#FFFFFF', border: '1px solid #E8DCCF', boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}
              >
                {/* Header */}
                <div className="relative px-8 pt-8 pb-7 overflow-hidden" style={{ borderBottom: '1px solid #F0E8DE' }}>
                  {/* Faded watermark character */}
                  <span className="absolute right-6 bottom-2 font-korean font-bold select-none pointer-events-none"
                    style={{ fontSize: 110, color: '#8B1E24', opacity: 0.04, lineHeight: 1 }}>
                    {course.koreanChar}
                  </span>

                  {/* Crimson accent bar matching PageHero */}
                  <div className="flex items-center gap-2 mb-5">
                    <div style={{ width: 32, height: 3, background: '#8B1E24', borderRadius: 2 }} />
                    <div style={{ width: 8, height: 3, background: '#E8DCCF', borderRadius: 2 }} />
                    <div style={{ width: 8, height: 3, background: '#E8DCCF', borderRadius: 2 }} />
                  </div>

                  <p className="font-korean mb-2" style={{ fontSize: 12, color: '#8B1E24', opacity: 0.5 }}>
                    {course.korean}
                  </p>
                  <h2 className="font-heading font-bold text-[#1A1A1A] leading-tight mb-4"
                    style={{ fontSize: 'clamp(20px, 2vw, 24px)' }}>
                    {course.titleFull}
                  </h2>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: '#FAF3ED', color: '#8B1E24', border: '1px solid #E8DCCF' }}>
                      {course.level}
                    </span>
                    <span className="font-sans text-xs px-3 py-1 rounded-full"
                      style={{ background: '#F5F4F2', color: '#888' }}>
                      {course.tag}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-8 py-7 flex flex-col flex-1 gap-6">
                  <p className="font-sans text-[#666] leading-relaxed" style={{ fontSize: 14 }}>
                    {course.description}
                  </p>

                  <ul className="space-y-3 flex-1">
                    {course.highlights.map(h => (
                      <li key={h} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-[5px] w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#8B1E24', display: 'block' }} />
                        </span>
                        <span className="font-sans text-sm text-[#444]">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between gap-3 pt-4" style={{ borderTop: '1px solid #F0E8DE' }}>
                    <span className="font-sans text-xs" style={{ color: '#BDB3AA' }}>Enrolment opening soon</span>
                    <button
                      onClick={() => setActive(course.id)}
                      className="inline-flex items-center gap-2 font-heading font-bold text-white px-5 py-2.5 rounded-full flex-shrink-0 transition-opacity hover:opacity-85"
                      style={{ background: '#8B1E24', fontSize: 13 }}>
                      Register Interest <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="font-sans text-center mt-12" style={{ fontSize: 13, color: '#C0B8B0' }}>
            Registering interest is free and non-binding. We&apos;ll only contact you when the course is ready to open.
          </motion.p>
        </section>

      </main>
      <Footer />

      <AnimatePresence>
        {active && activeCourse && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(20,8,8,0.45)', backdropFilter: 'blur(4px)' }}
            />

            {/* Mobile: bottom sheet — hidden on md+ */}
            <motion.div
              key="mobile-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto md:hidden"
              style={{ maxHeight: '92vh', background: '#FFF', borderRadius: '20px 20px 0 0', boxShadow: '0 -8px 48px rgba(0,0,0,0.18)' }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full" style={{ background: '#E8DCCF' }} />
              </div>
              <div className="px-6 pb-8 pt-3">
                <ModalHeader course={activeCourse} onClose={() => setActive(null)} />
                <InterestForm courseId={active} courseName={activeCourse.titleFull} onClose={() => setActive(null)} />
              </div>
            </motion.div>

            {/* Desktop: centered dialog — flexbox wrapper handles centering, not transform */}
            <div className="fixed inset-0 z-50 hidden md:flex items-center justify-center p-6 pointer-events-none">
              <motion.div
                key="desktop-dialog"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="w-full overflow-y-auto pointer-events-auto"
                style={{ maxWidth: 560, maxHeight: '90vh', background: '#FFF', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.22)' }}
              >
                <div className="px-8 py-8">
                  <ModalHeader course={activeCourse} onClose={() => setActive(null)} />
                  <InterestForm courseId={active} courseName={activeCourse.titleFull} onClose={() => setActive(null)} />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
