import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Korean Culture',
  description: 'Explore Korean culture with Dibrugarh Korean Club — K-pop, K-drama, Korean cuisine, Hangul, traditional festivals, and the Hallyu wave in Assam, India.',
  keywords: [
    'Korean culture Assam', 'K-pop Assam', 'K-drama India', 'Hallyu Northeast India',
    'Korean food Assam', 'Korean traditions India', 'Korean music Assam',
    'Korean drama club', 'Korean cuisine Dibrugarh', 'Hangul script learn',
    'Korean pop culture India', 'Korean wave Assam', 'BTS fan club Assam',
    'Korean entertainment India',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/culture' },
  openGraph: {
    title: 'Korean Culture — K-pop, K-drama & More | Dibrugarh Korean Club',
    description: 'Discover K-pop, K-drama, Korean cuisine, Hangul and the Hallyu wave with Dibrugarh Korean Club in Assam.',
    url: 'https://dibrugarhkoreanclub.com/culture',
  },
}

export default function CultureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
