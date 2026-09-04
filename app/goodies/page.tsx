'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, AlertCircle, CheckCircle2, Package, Check } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { type ApiGoodie, API_BASE } from '@/lib/api'

type GoodiesCategory = 'all' | 'accessories' | 'stationery' | 'apparel' | 'collectibles'

const FILTERS: { key: GoodiesCategory; label: string }[] = [
  { key: 'all',          label: 'All Items'    },
  { key: 'accessories',  label: 'Accessories'  },
  { key: 'stationery',   label: 'Stationery'   },
  { key: 'apparel',      label: 'Apparel'       },
  { key: 'collectibles', label: 'Collectibles'  },
]

const AVAIL_STYLES = {
  available: { bg: '#ECFDF5', text: '#065F46', icon: CheckCircle2, label: 'Available'     },
  limited:   { bg: '#FFF7ED', text: '#9A3412', icon: AlertCircle,  label: 'Limited Stock' },
  'sold-out':{ bg: '#F5F5F5', text: '#666',    icon: AlertCircle,  label: 'Sold Out'      },
}

// Static book item for pre-selection from book spotlight
const BOOK_ITEM: ApiGoodie = {
  id: 'book-meditation',
  name: 'আত্মানুসন্ধানত ধ্যানৰ যাত্ৰা',
  korean_name: '나를 찾아가는 명상여행',
  description: 'A Meditation Journey for Seeking Myself — Korean Buddhist monk\'s pilgrimage translated to Assamese by Debojani Das.',
  price: '₹699',
  category: 'collectibles',
  availability: 'available',
  color: '#F5EDE2',
  icon: '📖',
  tags: ['Book', 'New Release'],
  sort_order: 0,
}

function GoodiesContent() {
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLDivElement>(null)

  const [filter, setFilter]     = useState<GoodiesCategory>('all')
  const [goodies, setGoodies]   = useState<ApiGoodie[]>([])
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  // Form state
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [roll, setRoll]       = useState('')
  const [phone, setPhone]     = useState('')
  const [notes, setNotes]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/goodies`)
      .then(r => r.json())
      .then((data: ApiGoodie[]) => setGoodies(data))
      .catch(() => {})
  }, [])

  // Pre-select book if coming from book spotlight
  useEffect(() => {
    const preselect = searchParams.get('preselect')
    if (preselect === 'book-meditation') {
      setSelected(new Set(['book-meditation']))
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 600)
    }
  }, [searchParams])

  const allItems = [BOOK_ITEM, ...goodies]
  const visible  = filter === 'all' ? allItems : allItems.filter(g => g.category === filter)

  function toggleItem(id: string | number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (selected.size === 0) { setError('Please select at least one item.'); return }
    if (!name.trim())        { setError('Please enter your name.');           return }
    if (!email.trim())       { setError('Please enter your email.');          return }

    const items = allItems
      .filter(g => selected.has(g.id))
      .map(g => ({ id: g.id, name: g.name, price: g.price }))

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/goodie-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, roll_number: roll, phone, items, notes }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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

        {/* How to order */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-2">
          <div className="rounded-2xl p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8" style={{ background: '#8B1E24' }}>
            <div className="flex-1">
              <p className="font-sans text-white/60 text-xs uppercase tracking-widest mb-2">How to order</p>
              <h2 className="font-heading font-bold text-white text-2xl mb-3">How to Get Your Goodies</h2>
              <p className="font-sans text-white/70 text-sm leading-relaxed max-w-xl">
                Browse items, select what you want, then fill the order form below. Your request goes directly to us and we will confirm availability and arrange delivery or pickup.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-3">
              {[
                { step: '1', label: 'Browse and select your items' },
                { step: '2', label: 'Fill and submit the order form' },
                { step: '3', label: 'We confirm and arrange delivery' },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-heading font-bold text-xs flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
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
                style={filter === f.key
                  ? { background: '#8B1E24', color: '#fff', border: '1px solid #8B1E24' }
                  : { background: '#fff', color: '#555', border: '1px solid #E8DCCF' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          {selected.size > 0 && (
            <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-xl font-sans text-sm font-semibold" style={{ background: '#FEF3F3', border: '1px solid #F0C8C8', color: '#8B1E24' }}>
              <Check size={15} />
              {selected.size} item{selected.size > 1 ? 's' : ''} selected — scroll down to complete your order
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((item, i) => {
              const avail     = AVAIL_STYLES[item.availability]
              const AvailIcon = avail.icon
              const isSoldOut = item.availability === 'sold-out'
              const isSelected = selected.has(item.id)

              return (
                <motion.div
                  key={item.id}
                  onClick={() => { if (!isSoldOut) { toggleItem(item.id); if (!isSelected) setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300) } }}
                  className="rounded-2xl overflow-hidden flex flex-col cursor-pointer"
                  style={{
                    background: '#fff',
                    border: isSelected ? '2px solid #8B1E24' : '1.5px solid #E8DCCF',
                    opacity: isSoldOut ? 0.6 : 1,
                    boxShadow: isSelected ? '0 0 0 3px rgba(139,30,36,0.12)' : 'none',
                    transition: 'all 0.2s',
                  }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: isSoldOut ? 0.6 : 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={!isSoldOut ? { y: -4, boxShadow: isSelected ? '0 8px 24px rgba(139,30,36,0.18)' : '0 8px 24px rgba(139,30,36,0.08)' } : {}}
                >
                  {/* Product visual */}
                  <div className="h-40 flex items-center justify-center relative" style={{ background: item.color }}>
                    <span className="font-korean font-bold select-none" style={{ fontSize: 52, color: '#8B1E24', opacity: 0.18, lineHeight: 1 }}>
                      {item.icon}
                    </span>
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {(item.tags ?? []).slice(0, 1).map(tag => (
                        <span key={tag} className="font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#8B1E24', color: '#fff' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Selected tick */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#8B1E24' }}>
                        <Check size={13} color="#fff" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#8B1E24', opacity: 0.6 }}>{item.category}</p>
                    <h3 className="font-heading font-semibold text-sm leading-snug mb-0.5" style={{ color: '#2B2B2B' }}>{item.name}</h3>
                    <p className="font-korean text-xs mb-3" style={{ color: '#bbb' }}>{item.korean_name}</p>
                    <p className="font-sans text-xs leading-relaxed flex-1 mb-4" style={{ color: '#666' }}>{item.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-heading font-bold text-lg" style={{ color: '#2B2B2B' }}>{item.price}</p>
                      <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: avail.bg, color: avail.text }}>
                        <AvailIcon className="w-3 h-3" />
                        {avail.label}
                      </span>
                    </div>
                    {!isSoldOut && (
                      <div
                        className="mt-3 w-full py-2 rounded-lg font-sans text-xs font-semibold text-center transition-all"
                        style={isSelected
                          ? { background: '#8B1E24', color: '#fff' }
                          : { background: '#F5EDE2', color: '#8B1E24' }
                        }
                      >
                        {isSelected ? '✓ Selected' : 'Select Item'}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Order form */}
        <section ref={formRef} style={{ background: '#FAF3ED', borderTop: '1px solid #E8DCCF' }}>
          <div className="max-w-2xl mx-auto px-6 py-20">

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: '#ECFDF5' }}>
                  <CheckCircle2 size={32} style={{ color: '#065F46' }} />
                </div>
                <h2 className="font-heading font-bold text-2xl mb-3" style={{ color: '#2B2B2B' }}>Order Received!</h2>
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#666' }}>
                  Thank you, <strong>{name}</strong>! We've received your order and will get back to you at <strong>{email}</strong> to confirm and arrange delivery.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <Package className="w-8 h-8 mx-auto mb-4" style={{ color: '#8B1E24' }} />
                  <p className="font-korean text-sm mb-2" style={{ color: 'rgba(139,30,36,0.6)' }}>굿즈 신청</p>
                  <h2 className="font-heading font-bold text-2xl mb-2" style={{ color: '#2B2B2B' }}>Place Your Order</h2>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: '#666' }}>
                    Select items above, then fill in your details. We'll confirm and arrange delivery.
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>

                  {/* Selected items summary */}
                  <div>
                    <label className="block font-sans text-xs font-semibold mb-1.5" style={{ color: '#2B2B2B' }}>
                      Selected Items {selected.size === 0 && <span style={{ color: '#9CA3AF' }}>(select from above)</span>}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {allItems.filter(g => g.availability !== 'sold-out').map(g => (
                        <label
                          key={g.id}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: selected.has(g.id) ? '#FEF3F3' : '#fff',
                            border: selected.has(g.id) ? '1.5px solid #8B1E24' : '1px solid #E8DCCF',
                          }}
                        >
                          <input
                            type="checkbox"
                            className="accent-[#8B1E24] flex-shrink-0 w-4 h-4"
                            checked={selected.has(g.id)}
                            onChange={() => toggleItem(g.id)}
                          />
                          <span className="font-sans text-xs flex-1" style={{ color: '#2B2B2B' }}>{g.name}</span>
                          <span className="font-heading font-bold text-sm" style={{ color: '#8B1E24' }}>{g.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs font-semibold mb-1.5" style={{ color: '#2B2B2B' }}>Full Name *</label>
                      <input
                        type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Your name" required
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all"
                        style={{ background: '#fff', border: '1px solid #E8DCCF', color: '#2B2B2B' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold mb-1.5" style={{ color: '#2B2B2B' }}>Roll Number</label>
                      <input
                        type="text" value={roll} onChange={e => setRoll(e.target.value)}
                        placeholder="DU roll number (if member)"
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all"
                        style={{ background: '#fff', border: '1px solid #E8DCCF', color: '#2B2B2B' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs font-semibold mb-1.5" style={{ color: '#2B2B2B' }}>Email *</label>
                      <input
                        type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com" required
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all"
                        style={{ background: '#fff', border: '1px solid #E8DCCF', color: '#2B2B2B' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-semibold mb-1.5" style={{ color: '#2B2B2B' }}>Phone</label>
                      <input
                        type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-all"
                        style={{ background: '#fff', border: '1px solid #E8DCCF', color: '#2B2B2B' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-semibold mb-1.5" style={{ color: '#2B2B2B' }}>Notes / Special Requests</label>
                    <textarea
                      rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Quantities, size preferences, delivery address, questions..."
                      className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none resize-none transition-all"
                      style={{ background: '#fff', border: '1px solid #E8DCCF', color: '#2B2B2B' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#8B1E24')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E8DCCF')}
                    />
                  </div>

                  {error && (
                    <p className="font-sans text-sm px-4 py-3 rounded-xl" style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 font-sans font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                    style={{ background: '#8B1E24', height: '52px', borderRadius: '26px', fontSize: '15px' }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {submitting ? 'Submitting…' : 'Place Order'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

export default function GoodiesPage() {
  return (
    <Suspense>
      <GoodiesContent />
    </Suspense>
  )
}
