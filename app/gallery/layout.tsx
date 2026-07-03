import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo gallery of Dibrugarh Korean Club events, cultural celebrations, workshops and campus life — Hangul Day, Chuseok, K-pop performances and more.',
  keywords: [
    'Dibrugarh Korean Club gallery', 'Korean club photos Assam', 'Hangul Day photos',
    'Chuseok photos India', 'Korean cultural event photos', 'K-pop performance photos',
    'Korean club Dibrugarh University photos', 'DKC gallery',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/gallery' },
  openGraph: {
    title: 'Gallery — Dibrugarh Korean Club',
    description: 'Photos from Korean cultural events, Hangul Day, Chuseok celebrations, K-pop performances and workshops in Assam.',
    url: 'https://dibrugarhkoreanclub.com/gallery',
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
