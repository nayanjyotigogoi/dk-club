import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Dibrugarh Korean Club — a student-led community at Dibrugarh University celebrating Korean language, culture, K-pop, and K-drama in Assam, India.',
  keywords: [
    'about Dibrugarh Korean Club', 'Korean club Dibrugarh University', 'DKC history',
    'Korean community Assam', 'Korean culture club Northeast India', 'student club Dibrugarh',
    'Hallyu club India', 'Korean language club Assam',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/about' },
  openGraph: {
    title: 'About Dibrugarh Korean Club',
    description: 'Student-led community at Dibrugarh University celebrating Korean language, K-pop, K-drama and culture in Assam.',
    url: 'https://dibrugarhkoreanclub.com/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
