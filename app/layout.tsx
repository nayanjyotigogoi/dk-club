import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Cinzel, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] })
const cinzel = Cinzel({ variable: '--font-heading', subsets: ['latin'], weight: ['600'] })
const notoSerifKr = Noto_Sans_KR({ variable: '--font-korean', subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://dibrugarhkoreanclub.com'),
  title: {
    default: 'Dibrugarh Korean Club — Korean Language & Culture in Assam',
    template: '%s | Dibrugarh Korean Club',
  },
  description: 'Dibrugarh Korean Club (DKC) is a student-led community at Dibrugarh University celebrating Korean language, K-pop, K-drama, Korean culture, and Hallyu in Assam, India.',
  keywords: [
    'Dibrugarh Korean Club', 'Korean club Assam', 'Korean language Dibrugarh',
    'learn Korean Dibrugarh University', 'K-pop club Assam', 'K-drama club India',
    'Korean culture Assam', 'Hallyu Dibrugarh', 'Korean community India',
    'DKC', 'Korean language course Assam', 'Korean club Northeast India',
    'Korean cultural events Dibrugarh', 'learn Korean language India',
    'K-pop Assam', 'Korean food Assam', 'Korean language club students',
  ],
  authors: [{ name: 'Dibrugarh Korean Club', url: 'https://dibrugarhkoreanclub.com' }],
  creator: 'Dibrugarh Korean Club',
  publisher: 'Dibrugarh Korean Club',
  category: 'Education, Culture, Community',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dibrugarhkoreanclub.com',
    siteName: 'Dibrugarh Korean Club',
    title: 'Dibrugarh Korean Club — Korean Language & Culture in Assam',
    description: 'A student-led community at Dibrugarh University celebrating Korean language, K-pop, K-drama, and Korean culture in Assam, India.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Dibrugarh Korean Club' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dibrugarh Korean Club — Korean Language & Culture in Assam',
    description: 'Student-led Korean language and culture club at Dibrugarh University, Assam, India.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  alternates: { canonical: 'https://dibrugarhkoreanclub.com' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${notoSerifKr.variable} bg-background`}>
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
