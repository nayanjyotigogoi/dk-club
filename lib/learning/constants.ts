// ─── Learning Platform — Constants ────────────────────────────────────────────
// Section identities, design tokens, and configuration constants.
// These values are the single source of truth for all section styling.

import type { LearningLevel } from './types'

// ─── Section Identity System ──────────────────────────────────────────────────
// From the approved Design System v2, Part 2.

export const SECTION_IDENTITY = {
  lessons: {
    label: 'Lessons',
    href: '/learn/lessons',
    icon: 'BookOpen',
    accent: '#3B3552',
    tint: '#F0EEF8',
    border: '#C5BFDF',
    description: 'Structured lessons with vocabulary, grammar, and conversations',
  },
  dictionary: {
    label: 'Dictionary',
    href: '/learn/dictionary',
    icon: 'BookMarked',
    accent: '#6B5C3E',
    tint: '#F4F0E8',
    border: '#DDD4BE',
    description: 'Complete Korean–Assamese–English vocabulary reference',
  },
  grammar: {
    label: 'Grammar',
    href: '/learn/grammar',
    icon: 'Layers',
    accent: '#4A5568',
    tint: '#EEF2EE',
    border: '#BDD4BD',
    description: 'Grammar patterns, rules, and examples',
  },
  conversations: {
    label: 'Conversations',
    href: '/learn/conversations',
    icon: 'MessageSquare',
    accent: '#2D5F7A',
    tint: '#EBF3F8',
    border: '#B5D4E8',
    description: 'Dialogues for listening and role-play practice',
  },
  practice: {
    label: 'Practice',
    href: '/learn/practice',
    icon: 'Zap',
    accent: '#8B3A1A',
    tint: '#F8F0E8',
    border: '#DFC89A',
    description: 'Quiz sessions for each lesson',
  },
  revision: {
    label: 'Revision',
    href: '/learn/revision',
    icon: 'RefreshCw',
    accent: '#4A3A6B',
    tint: '#F0EEF8',
    border: '#C5BFDF',
    description: 'Flashcard revision for all module vocabulary',
  },
} as const

export type SectionKey = keyof typeof SECTION_IDENTITY

// ─── Level Labels ─────────────────────────────────────────────────────────────

export const LEVEL_LABELS: Record<LearningLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const LEVEL_COLORS: Record<LearningLevel, { bg: string; text: string; border: string }> = {
  beginner:     { bg: '#EEF2EE', text: '#3A5C3A', border: '#BDD4BD' },
  intermediate: { bg: '#EBF3F8', text: '#2D5F7A', border: '#B5D4E8' },
  advanced:     { bg: '#F0EEF8', text: '#4A3A6B', border: '#C5BFDF' },
}

// ─── Content Standards ────────────────────────────────────────────────────────

// Display order for multilingual content — never change this order.
// Korean → Romanization → Assamese → English
export const CONTENT_DISPLAY_ORDER = ['korean', 'romanization', 'assamese', 'english'] as const

// Audio speed variants and their labels
export const AUDIO_SPEED_LABELS = {
  normal:   'Normal speed',
  slow:     '75% speed',
  syllable: 'Syllable by syllable',
} as const

// ─── API Paths ────────────────────────────────────────────────────────────────

export const LEARNING_API_PATHS = {
  modules:       '/learning/modules',
  lessons:       '/learning/lessons',
  vocabulary:    '/learning/vocabulary',
  grammar:       '/learning/grammar',
  conversations: '/learning/conversations',
  search:        '/learning/search',
} as const

// ─── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 24
