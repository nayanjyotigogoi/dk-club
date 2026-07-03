import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Korean Learning Resources',
  description: 'Free Korean language learning resources curated by Dibrugarh Korean Club — vocabulary guides, grammar notes, K-drama recommendations, TOPIK tips and more.',
  keywords: [
    'Korean learning resources India', 'free Korean resources Assam', 'Korean vocabulary guide',
    'Korean grammar notes', 'TOPIK study material India', 'K-drama learning Korean',
    'Korean language resources Northeast India', 'learn Korean free Assam',
    'Korean study materials Dibrugarh', 'Hangul guide India',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/resources' },
  openGraph: {
    title: 'Korean Learning Resources — Dibrugarh Korean Club',
    description: 'Free Korean language resources, vocabulary guides, grammar notes and TOPIK tips for learners in Assam.',
    url: 'https://dibrugarhkoreanclub.com/resources',
  },
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
