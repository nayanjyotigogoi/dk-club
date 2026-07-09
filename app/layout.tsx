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

// ─── JSON-LD structured data ──────────────────────────────────────────────────

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'EducationalOrganization'],
      '@id': 'https://dibrugarhkoreanclub.com/#organization',
      name: 'Dibrugarh Korean Club',
      alternateName: 'DKC',
      url: 'https://dibrugarhkoreanclub.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dibrugarhkoreanclub.com/icon.svg',
        width: 512,
        height: 512,
      },
      image: 'https://dibrugarhkoreanclub.com/og-image.png',
      description:
        'Student-led Korean language and culture club at Dibrugarh University, Assam, India. Offers structured Korean lessons, cultural events, K-pop and K-drama community activities.',
      foundingDate: '2023',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dibrugarh',
        addressRegion: 'Assam',
        addressCountry: 'IN',
      },
      areaServed: {
        '@type': 'Place',
        name: 'Assam, Northeast India',
      },
      knowsAbout: [
        'Korean Language',
        'Korean Culture',
        'K-pop',
        'K-drama',
        'Hallyu',
        'Hangul',
        'Korean Cuisine',
      ],
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://dibrugarhkoreanclub.com/#website',
      url: 'https://dibrugarhkoreanclub.com',
      name: 'Dibrugarh Korean Club',
      publisher: { '@id': 'https://dibrugarhkoreanclub.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://dibrugarhkoreanclub.com/learn/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Course',
      '@id': 'https://dibrugarhkoreanclub.com/learn#course',
      name: 'Korean Language Course — Assamese & English Medium',
      description:
        'Free structured Korean language course with Assamese and English explanations. Covers Hangul, vocabulary, grammar, conversations, and quizzes across beginner to intermediate levels.',
      url: 'https://dibrugarhkoreanclub.com/learn',
      provider: { '@id': 'https://dibrugarhkoreanclub.com/#organization' },
      educationalLevel: 'Beginner to Intermediate',
      inLanguage: ['en', 'as', 'ko'],
      isAccessibleForFree: true,
      courseMode: 'online',
      teaches: [
        'Korean alphabet (Hangul)',
        'Korean vocabulary',
        'Korean grammar',
        'Korean conversations',
        'Korean culture',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${cinzel.variable} ${notoSerifKr.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
