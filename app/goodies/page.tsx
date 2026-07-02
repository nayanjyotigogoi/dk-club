'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, AlertCircle, CheckCircle2, ArrowRight, Package } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiGoodie, API_BASE } from '@/lib/api'

type GoodiesCategory = 'all' | 'accessories' | 'stationery' | 'apparel' | 'collectibles'
type Filter = GoodiesCategory

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',          label: 'All Items'    },
  { key: 'accessories',  label: 'Accessories'  },
  { key: 'stationery',   label: 'Stationery'   },
  { key: 'apparel',      label: 'Apparel'       },
  { key: 'collectibles', label: 'Collectibles'  },
]

const AVAIL_STYLES = {
  available: { bg: '#ECFDF5', text: '#065F46', icon: CheckCircle2,  label: 'Available'     },
  limited:   { bg: '#FFF7ED', text: '#9A3412', icon: AlertCircle,   label: 'Limited Stock' },
  'sold-out':{ bg: '#F5F5F5', text: '#666',    icon: AlertCircle,   label: 'Sold Out'      },
}

export default function GoodiesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [goodies, setGoodies] = useState<ApiGoodie[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/goodies`)
      .then(r => r.json())
      .then((data: ApiGoodie[]) => setGoodies(data))
      .catch(() => {})
  }, [])

  const visible = filter === 'all' ? goodies : goodies.filter(g => g.category === filter)

  return (
    <>
      <Navbar />
      <main className="pt-[72px]" style={{ background: '#FAF6F0' }}>

        <PageHero
          koreanTitle="굿즈 스토어"
          title="DKC"
          accent="Goodies"
          subtitle="Club merchandise, learning tools and cultural keepsakes — crafted for members and Korean culture lovers."
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Goodies' }]}
        />

        {/* How to get your goodies banner */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-2">
          <div
            className="rounded-2xl p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8"
            style={{ background: '#8B1E24' }}
          >
            <div className="flex-1">
              <p className="font-sans text-white/60 text-xs uppercase tracking-widest mb-2">How to order</p>
              <h2 className="font-heading font-bold text-white text-2xl mb-3">How to Get Your Goodies</h2>
              <p className="font-sans text-white/70 text-sm leading-relaxed max-w-xl">
                All DKC goodies are available exclusively to club members and are distributed at events or through our Membership Desk. Fill in the interest form below and we will confirm availability and arrange pickup during the next club meeting.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-3">
              {[
                { step: '1', label: 'Browse and choose your items' },
                { step: '2', label: 'Fill the interest form below' },
                { step: '3', label: 'Collect at next club meeting' },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-heading font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                  >
                    {s.step}
                  </div>
                  <p className="font-sans text-white/80 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter + Product grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex gap-2 mb-10 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="font-sans text-sm px-5 py-2 rounded-full transition-all"
                style={
                  filter === f.key
                    ? { background: '#8B1E24', color: '#fff', border: '1px solid #8B1E24' }
                    : { background: '#fff', color: '#555', border: '1px solid #E8DCCF' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((item, i) => {
              const avail = AVAIL_STYLES[item.availability]
              const AvailIcon = avail.icon
              const isSoldOut = item.availability === 'sold-out'
              return (
                <motion.div
                  key={item.id}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: '#fff', border: '1px solid #E8DCCF', opacity: isSoldOut ? 0.7 : 1 }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: isSoldOut ? 0.7 : 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={!isSoldOut ? { y: -4, boxShadow: '0 10px 32px rgba(139,30,36,0.1)' } : {}}
                >
                  {/* Product visual */}
                  <div
                    className="h-40 flex items-center justify-center relative"
                    style={{ background: item.color }}
                  >
                    <span
                      className="font-korean font-bold select-none"
                      style={{ fontSize: 52, color: '#8B1E24', opacity: 0.18, lineHeight: 1 }}
                    >
                      {item.icon}
                    </span>
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {item.tags.slice(0, 1).map(tag => (
                        <span
                          key={tag}
                          className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: '#8B1E24', color: '#fff' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#8B1E24]/60 mb-1">{item.category}</p>
                    <h3 className="font-heading font-semibold text-[#2B2B2B] text-sm leading-snug mb-0.5">{item.name}</h3>
                    <p className="font-korean text-[#bbb] text-xs mb-3">{item.korean_name}</p>
                    <p className="font-sans text-[#666] text-xs leading-relaxed flex-1 mb-4">{item.description}</p>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-heading font-bold text-[#2B2B2B] text-lg">{item.price}</p>
                      <span
                        className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold px-2 py-1 rounded-full"
                        style={{ background: avail.bg, color: avail.text }}
                      >
                        <AvailIcon className="w-3 h-3" />
                        {avail.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Register interest form */}
        <section style={{ background: '#FAF3ED', borderTop: '1px solid #E8DCCF' }}>
          <div className="max-w-2xl mx-auto px-6 py-20">
            <div className="text-center mb-10">
              <Package className="w-8 h-8 mx-auto mb-4" style={{ color: '#8B1E24' }} />
              <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">굿즈 신청</p>
              <h2 className="font-heading font-bold text-[#2B2B2B] text-2xl mb-2">Register Your Interest</h2>
              <p className="font-sans text-[#666] text-sm leading-relaxed">
                Tell us which items you want and we will reach out to confirm and arrange collection.
              </p>
            </div>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none transition-all"
                    style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">Roll Number</label>
                  <input
                    type="text"
                    placeholder="DU roll number"
                    className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none transition-all"
                    style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none transition-all"
                  style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">Items Interested In</label>
                <div className="grid grid-cols-2 gap-2">
                  {goodies.filter(g => g.availability !== 'sold-out').map(g => (
                    <label
                      key={g.id}
                      className="flex items-center gap-2 p-3 rounded-xl cursor-pointer font-sans text-xs text-[#555]"
                      style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                    >
                      <input type="checkbox" className="accent-[#8B1E24] flex-shrink-0" />
                      <span>{g.name} — {g.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-[#2B2B2B] mb-1.5">Any notes?</label>
                <textarea
                  rows={3}
                  placeholder="Size preferences, quantities, questions..."
                  className="w-full px-4 py-3 rounded-xl font-sans text-sm text-[#2B2B2B] outline-none resize-none transition-all"
                  style={{ background: '#fff', border: '1px solid #E8DCCF' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 font-sans font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                style={{ background: '#8B1E24', height: '48px', borderRadius: '24px', fontSize: '15px' }}
              >
                <ShoppingBag className="w-4 h-4" />
                Submit Interest
              </button>
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
