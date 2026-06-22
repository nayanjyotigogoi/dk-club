import { redirect } from 'next/navigation'

// Community content has been merged into the About Us page
export default function CommunityPage() {
  redirect('/about')
}
