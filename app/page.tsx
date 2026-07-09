import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Dibrugarh Korean Club - Korean Language & Culture in Assam',
  description: 'Dibrugarh Korean Club (DKC) is a student-led community at Dibrugarh University celebrating Korean language, K-pop, K-drama, Korean culture, and the Hallyu wave in Assam, India. Join us for events, language classes, and cultural celebrations.',
  keywords: [
    'Dibrugarh Korean Club', 'Korean club Assam', 'Korean language Dibrugarh University',
    'K-pop Assam', 'K-drama India', 'Hallyu Northeast India', 'Korean culture Assam',
    'learn Korean Assam', 'Korean community India', 'DKC', 'Korean club India',
    'Korean events Assam', 'Hangul Day Assam', 'Chuseok India',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com' },
  openGraph: {
    title: 'Dibrugarh Korean Club — Korean Language & Culture in Assam',
    description: 'Student-led Korean language and culture club at Dibrugarh University. Events, language classes, K-pop, K-drama and more in Assam, India.',
    url: 'https://dibrugarhkoreanclub.com',
  },
}

import { HeroSection } from '@/components/hero-section'
import { StatsBar } from '@/components/stats-bar-wrapper'
import { KoreanPhraseWall } from '@/components/korean-phrase-wall'
import { HomeDynamicSections } from '@/components/home-dynamic-sections'
import { LearnPromoSection } from '@/components/learn-promo-section'
import { CommunitySection } from '@/components/community-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <KoreanPhraseWall />
      <HomeDynamicSections />
      <LearnPromoSection />
      <CommunitySection />
      <Footer />
    </>
  )
}
