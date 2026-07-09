import type { Metadata } from 'next'

// Search results are ephemeral and user-specific — keep out of index
export const metadata: Metadata = {
  title: 'Search Korean Content',
  description: 'Search vocabulary, grammar, conversations, and lessons on the Dibrugarh Korean Club learning platform.',
  robots: { index: false, follow: false },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
