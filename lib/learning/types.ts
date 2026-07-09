// ─── Learning Platform — Shared Types ────────────────────────────────────────
// Single source of truth for all Learning module TypeScript interfaces.
// Every API response shape is defined here. Never duplicate these types.

// ─── Enumerations ─────────────────────────────────────────────────────────────

export type LearningLevel = 'beginner' | 'intermediate' | 'advanced'

export type ContentStatus = 'draft' | 'published' | 'archived'

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'particle'
  | 'conjunction'
  | 'interjection'
  | 'pronoun'
  | 'number'
  | 'expression'
  | 'letter'
  | 'counter'

export type AudioType = 'word' | 'sentence' | 'dialogue_line'

export type AudioSpeedVariant = 'normal' | 'slow' | 'syllable'

export type QuizQuestionType = 'multiple_choice' | 'fill_in_blank' | 'matching' | 'listening'

export type SpeakerGender = 'male' | 'female'

// ─── Audio ────────────────────────────────────────────────────────────────────

export interface ApiLearningAudio {
  id: number
  filename: string
  url: string
  duration_ms: number
  type: AudioType
  speed_variant: AudioSpeedVariant
  speaker_gender: SpeakerGender
  verified: boolean
}

// ─── Vocabulary ───────────────────────────────────────────────────────────────

export interface ApiVocabularyEntry {
  id: number
  korean: string
  romanization: string
  assamese: string
  english: string
  part_of_speech: PartOfSpeech
  level: LearningLevel
  example_ko: string | null
  example_as: string | null
  example_en: string | null
  audio: ApiLearningAudio | null
  example_audio: ApiLearningAudio | null
}

// ─── Grammar ──────────────────────────────────────────────────────────────────

export interface GrammarExample {
  korean: string
  romanization: string
  assamese: string
  english: string
  audio_id: number | null
}

export interface ApiGrammarPoint {
  id: number
  title_ko: string
  title_en: string
  title_as: string
  pattern_formula: string
  explanation_en: string
  explanation_as: string
  level: LearningLevel
  category: string
  examples: GrammarExample[]
  related_vocabulary: ApiVocabularyEntry[]
}

// ─── Conversations ────────────────────────────────────────────────────────────

export interface ConversationSpeaker {
  label: string
  gender: SpeakerGender
}

export interface ApiConversationLine {
  id: number
  order_index: number
  speaker_label: string
  text_ko: string
  romanization: string
  translation_as: string
  translation_en: string
  audio: ApiLearningAudio | null
}

export interface ApiConversation {
  id: number
  title_ko: string
  title_en: string
  title_as: string
  scene_en: string
  scene_as: string
  level: LearningLevel
  speakers: ConversationSpeaker[]
  lines: ApiConversationLine[]
}

// ─── Cultural Notes ───────────────────────────────────────────────────────────

export interface ApiCulturalNote {
  id: number
  title_en: string
  title_as: string
  body_en: string
  body_as: string
  category: string
  related_vocabulary: ApiVocabularyEntry[]
  image_url: string | null
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizOption {
  text: string
  romanization?: string
}

export interface ApiQuizQuestion {
  id: number
  type: QuizQuestionType
  question_text: string
  options: QuizOption[]
  correct_index: number
  explanation_en: string | null
  explanation_as: string | null
  audio: ApiLearningAudio | null
}

// ─── Modules & Lessons ────────────────────────────────────────────────────────

export interface ApiLearningModule {
  id: number
  title_en: string
  title_as: string
  level: LearningLevel
  order_index: number
  lesson_count: number
  status: ContentStatus
}

export interface ApiLessonCard {
  id: number
  module_id: number
  title_en: string
  title_as: string
  slug: string
  level: LearningLevel
  order_index: number
  status: ContentStatus
  vocabulary_count: number
  grammar_count: number
  conversation_count: number
  quiz_count: number
  published_at: string | null
}

export interface ApiLesson {
  id: number
  module_id: number
  module: ApiLearningModule
  title_en: string
  title_as: string
  slug: string
  level: LearningLevel
  order_index: number
  status: ContentStatus
  published_at: string | null
  vocabulary: ApiVocabularyEntry[]
  grammar: ApiGrammarPoint[]
  conversations: ApiConversation[]
  cultural_notes: ApiCulturalNote[]
  quiz_questions: ApiQuizQuestion[]
  prev_lesson: { slug: string; title_en: string } | null
  next_lesson: { slug: string; title_en: string } | null
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResultItem {
  type: 'vocabulary' | 'grammar' | 'conversation' | 'lesson'
  id: number
  title: string
  subtitle: string
  url: string
}

export interface ApiSearchResults {
  query: string
  total: number
  vocabulary: SearchResultItem[]
  grammar: SearchResultItem[]
  conversations: SearchResultItem[]
  lessons: SearchResultItem[]
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
