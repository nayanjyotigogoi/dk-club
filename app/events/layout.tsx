import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Explore upcoming and past Korean cultural events by Dibrugarh Korean Club — Hangul Day, Chuseok, K-pop nights, Korean film screenings, language bootcamps and more in Assam.',
  keywords: [
    'Korean events Dibrugarh', 'Hangul Day Assam', 'Chuseok celebration India',
    'K-pop night Dibrugarh', 'Korean cultural events Assam', 'Korean film night',
    'Korean language bootcamp', 'Seollal celebration Northeast India',
    'Korean club events', 'DKC events', 'Korean festival Assam',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/events' },
  openGraph: {
    title: 'Korean Cultural Events — Dibrugarh Korean Club',
    description: 'Hangul Day, Chuseok, K-pop nights, Korean film screenings and language bootcamps in Assam, India.',
    url: 'https://dibrugarhkoreanclub.com/events',
  },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
