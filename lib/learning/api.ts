// ─── Learning Platform — API Fetch Helpers ────────────────────────────────────
// All Learning API calls go through these typed helpers.
// They use the same apiFetch base as the rest of the site (lib/api.ts).

import { apiFetch } from '@/lib/api'
import { LEARNING_API_PATHS, DEFAULT_PAGE_SIZE } from './constants'
import type {
  ApiLearningModule,
  ApiLessonCard,
  ApiLesson,
  ApiVocabularyEntry,
  ApiGrammarPoint,
  ApiConversation,
  ApiSearchResults,
  PaginatedResponse,
  LearningLevel,
} from './types'

// ─── Modules ──────────────────────────────────────────────────────────────────

export const fetchLearningModules = () =>
  apiFetch<{ data: ApiLearningModule[] }>(LEARNING_API_PATHS.modules).then((r) => r.data)

export const fetchModuleLessons = (moduleId: number) =>
  apiFetch<{ data: ApiLessonCard[] }>(`${LEARNING_API_PATHS.modules}/${moduleId}/lessons`).then((r) => r.data)

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const fetchLessons = (params?: { level?: LearningLevel; module_id?: number }) => {
  const query = new URLSearchParams()
  if (params?.level)     query.set('level', params.level)
  if (params?.module_id) query.set('module_id', String(params.module_id))
  const qs = query.toString()
  return apiFetch<{ data: ApiLessonCard[] }>(`${LEARNING_API_PATHS.lessons}${qs ? `?${qs}` : ''}`).then((r) => r.data)
}

export const fetchLesson = (slug: string) =>
  apiFetch<{ data: ApiLesson }>(`${LEARNING_API_PATHS.lessons}/${slug}`).then((r) => r.data)

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export const fetchVocabulary = (params?: {
  level?: LearningLevel
  part_of_speech?: string
  search?: string
  page?: number
  per_page?: number
}) => {
  const query = new URLSearchParams()
  if (params?.level)          query.set('level', params.level)
  if (params?.part_of_speech) query.set('part_of_speech', params.part_of_speech)
  if (params?.search)         query.set('search', params.search)
  if (params?.page)           query.set('page', String(params.page))
  query.set('per_page', String(params?.per_page ?? DEFAULT_PAGE_SIZE))
  return apiFetch<PaginatedResponse<ApiVocabularyEntry>>(
    `${LEARNING_API_PATHS.vocabulary}?${query.toString()}`
  )
}

export const fetchVocabularyEntry = (id: number) =>
  apiFetch<{ data: ApiVocabularyEntry }>(`${LEARNING_API_PATHS.vocabulary}/${id}`).then((r) => r.data)

// ─── Grammar ──────────────────────────────────────────────────────────────────

export const fetchGrammar = (params?: {
  level?: LearningLevel
  category?: string
  search?: string
  page?: number
}) => {
  const query = new URLSearchParams()
  if (params?.level)    query.set('level', params.level)
  if (params?.category) query.set('category', params.category)
  if (params?.search)   query.set('search', params.search)
  if (params?.page)     query.set('page', String(params.page))
  return apiFetch<PaginatedResponse<ApiGrammarPoint>>(
    `${LEARNING_API_PATHS.grammar}?${query.toString()}`
  )
}

export const fetchGrammarPoint = (id: number) =>
  apiFetch<{ data: ApiGrammarPoint }>(`${LEARNING_API_PATHS.grammar}/${id}`).then((r) => r.data)

// ─── Conversations ────────────────────────────────────────────────────────────

export const fetchConversations = (params?: {
  level?: LearningLevel
  search?: string
  page?: number
}) => {
  const query = new URLSearchParams()
  if (params?.level)  query.set('level', params.level)
  if (params?.search) query.set('search', params.search)
  if (params?.page)   query.set('page', String(params.page))
  return apiFetch<PaginatedResponse<ApiConversation>>(
    `${LEARNING_API_PATHS.conversations}?${query.toString()}`
  )
}

export const fetchConversation = (id: number) =>
  apiFetch<{ data: ApiConversation }>(`${LEARNING_API_PATHS.conversations}/${id}`).then((r) => r.data)

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface LessonQuizResponse {
  lesson_slug: string
  lesson_title: string
  total: number
  data: import('./types').ApiQuizQuestion[]
}

export const fetchLessonQuiz = (slug: string) =>
  apiFetch<LessonQuizResponse>(`${LEARNING_API_PATHS.lessons}/${slug}/quiz`)

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchLearning = (query: string) =>
  apiFetch<ApiSearchResults>(
    `${LEARNING_API_PATHS.search}?q=${encodeURIComponent(query)}`
  )
