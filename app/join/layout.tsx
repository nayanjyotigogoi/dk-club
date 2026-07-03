import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join the Club',
  description: 'Become a member of Dibrugarh Korean Club. Join our community of Korean language learners and culture enthusiasts at Dibrugarh University, Assam. Free membership for students.',
  keywords: [
    'join Korean club Dibrugarh', 'Korean club membership Assam', 'become member DKC',
    'Korean language learning Dibrugarh', 'Korean culture club registration',
    'student club Dibrugarh University', 'join Korean community Assam',
    'free Korean club membership India', 'learn Korean Assam',
  ],
  alternates: { canonical: 'https://dibrugarhkoreanclub.com/join' },
  openGraph: {
    title: 'Join Dibrugarh Korean Club — Free Membership',
    description: 'Become a member and join our Korean language and culture community at Dibrugarh University, Assam.',
    url: 'https://dibrugarhkoreanclub.com/join',
  },
}

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
