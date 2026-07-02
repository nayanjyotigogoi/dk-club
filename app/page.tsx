import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { StatsBar } from '@/components/stats-bar-wrapper'
import { KoreanPhraseWall } from '@/components/korean-phrase-wall'
import { EventsSection } from '@/components/events-section'
import { CommunitySection } from '@/components/community-section'
import { DiscoverSection } from '@/components/discover-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <KoreanPhraseWall />
      <DiscoverSection />
      <EventsSection />
      <CommunitySection />
      <Footer />
    </>
  )
}
