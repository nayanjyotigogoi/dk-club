// Server component — awaits params, passes slug to client UI
import { MagazineIssue } from './magazine-issue'

export default async function MagazineIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <MagazineIssue slug={slug} />
}
