import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChapterEditor } from './chapter-editor'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return { title: `Edit Chapter: ${slug} — Admin` }
}

async function getChapterData(slug: string) {
  try {
    const res = await fetch(`${API}/learning/chapters/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AdminChapterPage({ params }: Props) {
  const { slug } = await params
  const data = await getChapterData(slug)
  if (!data) notFound()
  return <ChapterEditor initialData={data} apiBase={process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'} />
}
