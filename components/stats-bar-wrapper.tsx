'use client'

import dynamic from 'next/dynamic'

export const StatsBar = dynamic(
  () => import('./stats-bar').then(m => ({ default: m.StatsBarInner })),
  {
    ssr: false,
    loading: () => (
      <section className="bg-background py-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div
            className="bg-white rounded-2xl md:h-[88px] py-5 md:py-0"
            style={{ boxShadow: '0px 2px 10px rgba(0,0,0,0.06)' }}
          />
        </div>
      </section>
    ),
  }
)
