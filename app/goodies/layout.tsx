import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Goodies & Merchandise',
  description: 'Get exclusive Dibrugarh Korean Club merchandise — tote bags, stickers, pins and more. Show your Korean pride on campus at Dibrugarh University, Assam.',
  keywords: [
    'Korean club merchandise Assam', 'DKC goodies', 'Korean club tote bag',
    'Korean merch India', 'Korean culture merchandise Assam',
    'Dibrugarh Korean Club stickers', 'Korean club pins Assam',
    'Korean student merchandise Dibrugarh',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/goodies' },
  openGraph: {
    title: 'Goodies & Merchandise — Dibrugarh Korean Club',
    description: 'Exclusive DKC merchandise — tote bags, stickers, and pins for Korean culture enthusiasts in Assam.',
    url: 'https://dibrugarhkoreanclub.com/goodies',
  },
}

export default function GoodiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
