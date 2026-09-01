'use client'

import dynamic from 'next/dynamic'

const LearnBannerSection = dynamic(
  () => import('@/components/learn-banner-section').then(m => ({ default: m.LearnBannerSection })),
  { ssr: false }
)

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
      <LearnBannerSection />
      <DiscoverSection />
      <EventsSection />
    </>
  )
}
