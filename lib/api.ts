const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export { API_BASE }

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`)
  return res.json()
}

export { apiFetch }

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventStatus = 'upcoming' | 'live' | 'completed'

export interface ApiEvent {
  slug: string
  title: string
  korean_title: string
  date: string
  date_iso: string
  time: string
  location: string
  category: string
  status: EventStatus
  description: string
  long_description: string
  highlights: string[]
  image: string
  color: string
  is_featured: boolean
  sort_order: number
}

export interface ApiGalleryPhoto {
  id: number
  caption: string
  category: string
  event_name: string | null
  year: number
  aspect: 'portrait' | 'landscape' | 'square'
  image_path: string
  color: string
  icon: string
  sort_order: number
  is_visible: boolean
}

export interface ApiArticle {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  tag: string
}

export interface ApiMagazine {
  slug: string
  title: string
  issue_label: string
  year: number
  month: string
  cover_color: string
  cover_accent: string
  tagline: string
  description: string
  is_featured: boolean
  page_count: number
  articles: ApiArticle[]
}

export interface ApiGoodie {
  id: number
  name: string
  korean_name: string
  category: string
  price: string
  description: string
  availability: 'available' | 'limited' | 'sold-out'
  image_path: string
  color: string
  icon: string
  tags: string[]
  sort_order: number
}

export interface ApiMember {
  id: number
  name: string
  initials: string
  role: string
  department: string
  joined_month: string
  joined_year: number
  quote: string
  dream: string
  favourite_word: string
  photo_path: string
  is_spotlight: boolean
  is_active: boolean
}

export interface ApiPhrase {
  id: number
  korean: string
  english: string
  romanized: string
  sort_order: number
  is_active: boolean
}

export interface ApiFunFact {
  id: number
  type: string
  korean_word: string
  romanized: string
  fact: string
  is_active: boolean
  sort_order: number
}

export interface ApiMediaPick {
  id: number
  type: string
  title: string
  korean_title: string
  description: string
  tag: string
  streaming_platform: string
  is_active: boolean
  sort_order: number
}

export interface ApiSettings {
  members_count: string
  events_count: string
  celebrations_count: string
  memories_count: string
  tagline: string
}

// ─── Typed fetch helpers ───────────────────────────────────────────────────────

export const fetchEvents = (status?: 'upcoming' | 'completed') =>
  apiFetch<ApiEvent[]>(status ? `/events?status=${status}` : '/events')

export const fetchEvent = (slug: string) =>
  apiFetch<ApiEvent>(`/events/${slug}`)

export const fetchGallery = (category?: string) =>
  apiFetch<ApiGalleryPhoto[]>(category ? `/gallery?category=${category}` : '/gallery')

export const fetchMagazines = () =>
  apiFetch<ApiMagazine[]>('/magazine')

export const fetchMagazine = (slug: string) =>
  apiFetch<ApiMagazine>(`/magazine/${slug}`)

export const fetchGoodies = () =>
  apiFetch<ApiGoodie[]>('/goodies')

export const fetchMembers = () =>
  apiFetch<ApiMember[]>('/members')

export const fetchPhrases = () =>
  apiFetch<ApiPhrase[]>('/phrases')

export const fetchFunFacts = () =>
  apiFetch<ApiFunFact[]>('/fun-facts')

export const fetchMediaPicks = () =>
  apiFetch<ApiMediaPick[]>('/media-picks')

export const fetchSettings = () =>
  apiFetch<ApiSettings>('/settings')

export interface ApiResource {
  id: number
  title: string
  category: string
  description: string
  content: string | null
  url: string | null
  file_path: string | null
  type: 'article' | 'link' | 'download' | 'exercise'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null
  author: string | null
  is_active: boolean
  sort_order: number
}

export interface ApiResourceCategory {
  slug: string
  label: string
  icon: string
  description: string
  count: number
}

export const fetchResourceCategories = () =>
  apiFetch<ApiResourceCategory[]>('/resources/categories')

export const fetchResources = (category?: string) =>
  apiFetch<ApiResource[]>(category ? `/resources?category=${category}` : '/resources')
