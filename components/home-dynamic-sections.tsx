'use client'

import dynamic from 'next/dynamic'

const DiscoverSection = dynamic(
  () => import('@/components/discover-section').then(m => ({ default: m.DiscoverSection })),
  { ssr: false }
)

const EventsSection = dynamic(
  () => import('@/components/events-section').then(m => ({ default: m.EventsSection })),
  { ssr: false }
)

export function HomeDynamicSections() {
  return (
    <>
      <DiscoverSection />
      <EventsSection />
    </>
  )
}
