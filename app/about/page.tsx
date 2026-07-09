'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, BookOpen, Globe, Users, Star, Music } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { API_BASE } from '@/lib/api'

type TeamMember = {
  id: number
  name: string
  initials: string
  role: string
  korean_role: string | null
  department: string | null
  color: string | null
}

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const timeline = [
  { year: '2023', season: 'Spring', title: 'The Spark', body: 'A group of five K-drama enthusiasts at Dibrugarh University realised there was no formal space on campus to celebrate Korean culture. Over chai and ramyeon, the idea for a club was born.' },
  { year: '2023', season: 'Autumn', title: 'First Meeting', body: 'Our first open meeting drew 38 students. We had no banner, no budget, and a borrowed projector. We screened a short documentary on Hangul and everyone stayed for two hours talking.' },
  { year: '2024', season: 'January', title: 'Official Recognition', body: 'Dibrugarh University officially recognised DKC as a student organisation. We launched our first magazine issue and hosted our inaugural Seollal celebration.' },
  { year: '2024', season: 'October', title: 'Growing Community', body: 'Membership crossed 150. We ran our first Language Bootcamp, partnered with the university library for a Korean books section, and began monthly cultural screenings.' },
  { year: '2025', season: 'Year Round', title: 'A Full Calendar', body: '200+ active members, 6 major events, 2 magazine editions, and the launch of our goodies store. DKC became one of the most active cultural clubs on campus.' },
  { year: '2026', season: 'Ongoing', title: 'Expanding Vision', body: 'Planning our first inter-university Korean language competition, a physical magazine print run, and a partnership with the Korean Cultural Centre of India.' },
]

const pillars = [
  { icon: BookOpen, title: 'Language Learning', korean: '언어 학습', body: 'We make Korean accessible — from beginner Hangul sessions to intermediate conversation clubs and intensive bootcamps.' },
  { icon: Globe, title: 'Cultural Exchange', korean: '문화 교류', body: 'Through festivals, film nights and food events, we bring Korean culture to life beyond the screen.' },
  { icon: Heart, title: 'Community', korean: '공동체', body: 'A safe, welcoming space for everyone — whether you\'ve watched one drama or speak intermediate Korean.' },
  { icon: Music, title: 'Arts & Media', korean: '예술과 미디어', body: 'K-pop, cinema, literature and calligraphy — we explore Korean creative expression in all its forms.' },
  { icon: Star, title: 'Academic Growth', korean: '학문적 성장', body: 'Korean language skills, cultural knowledge and event management experience that complement your academic journey.' },
  { icon: Users, title: 'Mentorship', korean: '멘토링', body: 'Connecting curious beginners with experienced members for language practice, guidance and friendship.' },
]

// Fallback team used if API is unreachable
const FALLBACK_TEAM: TeamMember[] = [
  { id: 1, name: 'Sneha Borah',  initials: 'SB', role: 'President',              korean_role: '회장',    color: '#8B1E24', department: 'B.A. English, 3rd Year' },
  { id: 2, name: 'Rohan Das',    initials: 'RD', role: 'Vice President',          korean_role: '부회장',  color: '#5C3A6B', department: 'B.Com, 3rd Year' },
  { id: 3, name: 'Priya Sharma', initials: 'PS', role: 'Cultural Secretary',      korean_role: '문화 총무',color: '#1E5C8B', department: 'B.Sc Physics, 2nd Year' },
  { id: 4, name: 'Ankita Gogoi', initials: 'AG', role: 'Design Lead',             korean_role: '디자인 팀장', color: '#1E8B5C', department: 'B.A. Mass Comm, 3rd Year' },
  { id: 5, name: 'Dev Hazarika', initials: 'DH', role: 'Events Head',             korean_role: '행사 팀장',color: '#8B6B1E', department: 'B.Tech CSE, 2nd Year' },
  { id: 6, name: 'Mitu Kalita',  initials: 'MK', role: 'Membership Coordinator',  korean_role: '회원 담당',color: '#8B3A1E', department: 'B.A. Hindi, 2nd Year' },
]

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>(FALLBACK_TEAM)

  const designLead = team.find(m => m.role.toLowerCase().includes('design'))

  useEffect(() => {
    fetch(`${API_BASE}/members?type=team`)
      .then(r => r.json())
      .then((data: TeamMember[]) => { if (data?.length) setTeam(data) })
      .catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="우리에 대하여"
          title="About Dibrugarh"
          accent="Korean Club"
          subtitle="A community built on curiosity, culture and the shared joy of learning Korean — right here on the banks of the Brahmaputra."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
        />

        {/* ── Origin Story ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <motion.div
              className="flex-1"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p variants={fade} className="font-korean text-[#8B1E24]/60 text-sm mb-2">우리의 이야기</motion.p>
              <motion.h2 variants={fade} className="font-heading font-bold text-[#2B2B2B] text-3xl mb-6">Our Story</motion.h2>
              <motion.p variants={fade} className="font-sans text-[#555] leading-relaxed mb-4 text-base">
                Dibrugarh Korean Club (DKC) was born from a simple realisation: thousands of students across Northeast India were discovering Korean culture through drama, music and film but there was nowhere to celebrate it together.
              </motion.p>
              <motion.p variants={fade} className="font-sans text-[#555] leading-relaxed mb-4 text-base">
                Founded in 2025 at Dibrugarh University by a handful of Korean culture enthusiasts, DKC has grown into one of the most vibrant cultural organisations in the region with over 550 members, a quarterly magazine, annual festivals, language workshops, and a growing library of Korean resources.
              </motion.p>
              <motion.p variants={fade} className="font-sans text-[#555] leading-relaxed text-base">
                We believe that language is a doorway to understanding. When you learn Korean even a little, you start to see Korea differently. The drama lines hit harder. The food tastes better. The music makes more sense. That transformation is what DKC is built on.
              </motion.p>
            </motion.div>

            {/* Stats card */}
            <motion.div
              className="flex-shrink-0 w-full lg:w-80"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl p-8" style={{ background: '#8B1E24' }}>
                <p className="font-heading font-bold text-white text-5xl mb-1">20+</p>
                <p className="font-sans text-white/60 text-sm mb-8">Active Members</p>
                <div className="space-y-5">
                  {[
                    ['5+',   'Events Organised'],
                    ['12+',   'Cultural Celebrations'],
                    ['2+',    'Magazine Editions'],
                    ['1000+', 'Memories Created'],
                  ].map(([n, l]) => (
                    <div key={l} className="flex items-baseline gap-3 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                      <span className="font-heading font-bold text-white text-2xl">{n}</span>
                      <span className="font-sans text-white/50 text-sm">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">우리가 하는 일</p>
            <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-7"
                style={{ background: '#FFFFFF', border: '1px solid #E8DCCF' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(139,30,36,0.08)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: '#FAF3ED' }}>
                  <p.icon className="w-5 h-5" style={{ color: '#8B1E24' }} />
                </div>
                <h3 className="font-heading font-semibold text-[#2B2B2B] text-base mb-0.5">{p.title}</h3>
                <p className="font-korean text-[#8B1E24]/50 text-xs mb-3">{p.korean}</p>
                <p className="font-sans text-[#666] text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Team ── */}
        <section style={{ background: '#FAF3ED', borderTop: '1px solid #E8DCCF' }}>
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-14">
              <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">우리 팀</p>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl">Meet the Team</h2>
              <p className="font-sans text-[#666] text-sm mt-3 max-w-md mx-auto leading-relaxed">
                The students who keep DKC running — organising events, editing the magazine, and welcoming every new face.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  className="rounded-2xl p-6 flex items-center gap-5"
                  style={{ background: '#FFFFFF', border: '1px solid #E8DCCF' }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-lg"
                    style={{ background: member.color ?? '#8B1E24' }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-[#2B2B2B] text-sm">{member.name}</p>
                    <p className="font-sans text-[#8B1E24] text-xs font-medium mt-0.5">{member.role}</p>
                    {member.korean_role && <p className="font-korean text-[#bbb] text-xs mt-0.5">{member.korean_role}</p>}
                    {member.department && <p className="font-sans text-[#bbb] text-xs mt-1">{member.department}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Community / Join CTA ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">커뮤니티</p>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-3xl mb-4">Who Joins DKC?</h2>
              <p className="font-sans text-[#555] leading-relaxed mb-4 text-base">
                Students from every department, every year, every background. You do not need to know a single word of Korean to join. All you need is curiosity.
              </p>
              <p className="font-sans text-[#555] leading-relaxed mb-6 text-base">
                Our community includes complete beginners who just discovered their first K-drama, intermediate learners using Korean in daily life, and passionate culture enthusiasts who attend every event we run. What brings everyone together is openness — to new sounds, new stories, and new friendships.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['K-Drama fans', 'Language learners', 'K-pop enthusiasts', 'Culture curious', 'Foodies', 'Total beginners'].map(tag => (
                  <span
                    key={tag}
                    className="font-sans text-xs px-3 py-1.5 rounded-full"
                    style={{ background: '#FAF3ED', color: '#8B1E24', border: '1px solid #E8DCCF' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 font-sans font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                style={{ background: '#8B1E24', height: '46px', padding: '0 28px', borderRadius: '24px', fontSize: '15px' }}
              >
                Register to Join
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Member quote */}
            <motion.div
              className="flex-shrink-0 w-full lg:w-96 rounded-2xl p-8"
              style={{ background: '#FAF3ED', border: '1px solid #E8DCCF' }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-heading text-[#8B1E24] text-5xl leading-none mb-4">&ldquo;</p>
              <p className="font-sans text-[#2B2B2B] text-base leading-relaxed mb-6 italic">
                I came for the food at Chuseok. I stayed for the friendships, the language, and the feeling that this little corner of campus was truly mine.
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-white text-sm flex-shrink-0"
                  style={{ background: designLead?.color ?? '#1E8B5C' }}
                >
                  {designLead?.initials ?? 'DKC'}
                </div>
                <div>
                  <p className="font-sans font-medium text-[#2B2B2B] text-sm">{designLead?.name ?? 'DKC Member'}</p>
                  <p className="font-sans text-[#999] text-xs">{designLead?.role ?? 'Design Lead'}, DKC</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
