'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Star, Image as ImageIcon, Heart } from 'lucide-react'
import { API_BASE, type ApiSettings } from '@/lib/api'

const DEFAULTS: ApiSettings = {
  members_count:      '20+',
  events_count:       '6+',
  celebrations_count: '5+',
  memories_count:     '1000+',
  tagline:            '한국어',
}

export function StatsBarInner() {
  const [statsData, setStatsData] = useState<ApiSettings>(DEFAULTS)

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then(r => r.json())
      .then((data: ApiSettings) => { if (data?.members_count) setStatsData(data) })
      .catch(() => {})
  }, [])

  const stats = [
    { number: statsData.members_count,      label: 'Active Members',        icon: Users     },
    { number: statsData.events_count,       label: 'Events Organized',      icon: Calendar  },
    { number: statsData.celebrations_count, label: 'Cultural Celebrations', icon: Star      },
    { number: statsData.memories_count,     label: 'Memories Created',      icon: ImageIcon },
    { number: statsData.tagline,            label: 'DKC',                   icon: Heart     },
  ]

  return (
    <section className="bg-background py-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl px-4 sm:px-6 py-5 md:py-0 md:h-[88px]"
          style={{ boxShadow: '0px 2px 10px rgba(0,0,0,0.06)' }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center md:h-full gap-y-5 gap-x-4 md:gap-0">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex items-center md:flex-1 md:min-w-0">
                  <div className="flex items-center gap-3 flex-1 min-w-0 md:justify-center">
                    <div className="flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{ width: '40px', height: '40px', background: '#8B1E24' }}>
                      <Icon className="text-white" style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="font-heading font-semibold"
                        style={{ fontSize: 'clamp(16px, 2vw, 22px)', color: '#2B2B2B', lineHeight: 1.2 }}>
                        {stat.number}
                      </span>
                      <span className="font-sans"
                        style={{ fontSize: 'clamp(11px, 1.1vw, 13px)', color: '#666666', lineHeight: 1.3 }}>
                        {stat.label}
                      </span>
                    </div>
                  </div>

                  {idx < stats.length - 1 && (
                    <div className="hidden md:block flex-shrink-0"
                      style={{ width: '1px', height: '32px', background: '#E8DCCF' }} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
