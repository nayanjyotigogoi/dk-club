import type { MetadataRoute } from 'next'

const BASE = 'https://dibrugarhkoreanclub.com'
const API  = process.env.NEXT_PUBLIC_API_URL ?? `${BASE}/api/v1`

// ─── Static routes ────────────────────────────────────────────────────────────

const STATIC: MetadataRoute.Sitemap = [
  { url: BASE,                            changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/about`,                 changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/events`,                changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/gallery`,               changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/join`,                  changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE}/culture`,               changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/community`,             changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/courses`,               changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/magazine`,              changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/goodies`,               changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/resources`,             changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/resources/videos`,      changeFrequency: 'weekly',  priority: 0.7 },
  { url: `${BASE}/resources/books`,       changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/resources/apps`,        changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/contact`,               changeFrequency: 'yearly',  priority: 0.5 },
  // ── Learning platform ──────────────────────────────────────────────────────
  { url: `${BASE}/learn`,                 changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/learn/lessons`,         changeFrequency: 'weekly',  priority: 0.9 },
  { url: `${BASE}/learn/grammar`,         changeFrequency: 'weekly',  priority: 0.85 },
  { url: `${BASE}/learn/dictionary`,      changeFrequency: 'weekly',  priority: 0.85 },
  { url: `${BASE}/learn/conversations`,   changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/learn/practice`,        changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/learn/revision`,        changeFrequency: 'monthly', priority: 0.7 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function tryFetch<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: 3600 } })
    if (!r.ok) return null
    return r.json()
  } catch {
    return null
  }
}

// ─── Dynamic lesson slugs ─────────────────────────────────────────────────────

async function lessonEntries(): Promise<MetadataRoute.Sitemap> {
  const res = await tryFetch<{ data: { slug: string; published_at?: string }[] }>(
    `${API}/learning/lessons?per_page=200`
  )
  if (!res?.data) return []

  return res.data.map((l) => ({
    url:             `${BASE}/learn/lessons/${l.slug}`,
    lastModified:    l.published_at ? new Date(l.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.85,
  }))
}

// Practice quiz pages are interactive — lower priority, noindex handled by layout
async function practiceEntries(): Promise<MetadataRoute.Sitemap> {
  const res = await tryFetch<{ data: { slug: string }[] }>(
    `${API}/learning/lessons?per_page=200`
  )
  if (!res?.data) return []

  return res.data.map((l) => ({
    url:             `${BASE}/learn/practice/${l.slug}`,
    changeFrequency: 'monthly' as const,
    priority:        0.5,
  }))
}

// ─── Dynamic event slugs ──────────────────────────────────────────────────────

async function eventEntries(): Promise<MetadataRoute.Sitemap> {
  const res = await tryFetch<{ data: { slug: string; updated_at?: string }[] }>(
    `${API}/events?per_page=200`
  )
  if (!res?.data) return []

  return res.data.map((e) => ({
    url:             `${BASE}/events/${e.slug}`,
    lastModified:    e.updated_at ? new Date(e.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.75,
  }))
}

// ─── Dynamic magazine slugs ───────────────────────────────────────────────────

async function magazineEntries(): Promise<MetadataRoute.Sitemap> {
  const res = await tryFetch<{ data: { slug: string; updated_at?: string }[] }>(
    `${API}/magazine?per_page=200`
  )
  if (!res?.data) return []

  return res.data.map((m) => ({
    url:             `${BASE}/magazine/${m.slug}`,
    lastModified:    m.updated_at ? new Date(m.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.65,
  }))
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticWithDate = STATIC.map((r) => ({ ...r, lastModified: now }))

  const [lessons, practice, events, magazine] = await Promise.all([
    lessonEntries(),
    practiceEntries(),
    eventEntries(),
    magazineEntries(),
  ])

  return [...staticWithDate, ...lessons, ...practice, ...events, ...magazine]
}
