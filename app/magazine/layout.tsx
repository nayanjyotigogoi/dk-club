import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Magazine',
  description: 'Read the Dibrugarh Korean Club magazine — student-written stories, Korean cultural essays, language tips, K-pop reviews and Hallyu news from Assam, India.',
  keywords: [
    'Korean club magazine Assam', 'DKC magazine', 'Korean culture magazine India',
    'K-pop magazine Assam', 'Korean language magazine', 'Hallyu magazine Northeast India',
    'Korean student magazine Dibrugarh', 'Korean cultural writing Assam',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/magazine' },
  openGraph: {
    title: 'Magazine — Dibrugarh Korean Club',
    description: 'Student-written Korean culture, language, K-pop and Hallyu stories from Dibrugarh, Assam.',
    url: 'https://dibrugarhkoreanclub.com/magazine',
  },
}

export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
