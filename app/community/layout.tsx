import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Meet the members of Dibrugarh Korean Club — students and culture enthusiasts learning Korean language, sharing K-pop, K-drama and celebrating Korean heritage in Assam.',
  keywords: [
    'Korean community Dibrugarh', 'DKC members', 'Korean club students Assam',
    'Korean language learners Dibrugarh', 'K-pop fans Assam', 'Korean culture enthusiasts India',
    'Dibrugarh University Korean students', 'Korean club community Northeast India',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/community' },
  openGraph: {
    title: 'Community — Dibrugarh Korean Club',
    description: 'Meet our members — Korean language learners and culture enthusiasts at Dibrugarh University, Assam.',
    url: 'https://dibrugarhkoreanclub.com/community',
  },
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
