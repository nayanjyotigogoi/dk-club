import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Dibrugarh Korean Club. Contact us for memberships, event inquiries, collaborations, or any questions about Korean language and culture in Assam.',
  keywords: [
    'contact Dibrugarh Korean Club', 'DKC contact', 'Korean club Assam contact',
    'Korean club email Dibrugarh', 'Korean culture club inquiry Assam',
    'join Korean club contact', 'Korean events inquiry Assam',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/contact' },
  openGraph: {
    title: 'Contact — Dibrugarh Korean Club',
    description: 'Reach out to us for memberships, events, collaborations or any Korean culture questions in Assam.',
    url: 'https://dibrugarhkoreanclub.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
