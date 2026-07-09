import Link from 'next/link'
import type { ApiLessonCard } from '@/lib/learning/types'
import { LevelBadge } from './level-badge'
import { BookOpen, MessageSquare, Layers, HelpCircle } from 'lucide-react'

interface LessonCardProps {
  lesson: ApiLessonCard
  moduleAccent?: string
}

export function LessonCard({ lesson, moduleAccent = '#3B3552' }: LessonCardProps) {
  const stats = [
    { icon: BookOpen,      label: `${lesson.vocabulary_count} vocab` },
    { icon: Layers,        label: `${lesson.grammar_count} grammar` },
    { icon: MessageSquare, label: `${lesson.conversation_count} conv` },
    { icon: HelpCircle,    label: `${lesson.quiz_count} quiz` },
  ]

  return (
    <Link
      href={`/learn/lessons/${lesson.slug}`}
      className="block group rounded-2xl transition-all"
      style={{
        background: '#FAF3ED',
        border: '1px solid #E8DCCF',
        padding: '20px',
        textDecoration: 'none',
      }}
    >
      {/* Order + level */}
      <div className="flex items-center justify-between gap-2" style={{ marginBottom: '10px' }}>
        <span
          className="font-heading font-bold"
          style={{ fontSize: '11px', color: moduleAccent, letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          Lesson {lesson.order_index}
        </span>
        <LevelBadge level={lesson.level} />
      </div>

      {/* Title */}
      <p
        className="font-heading font-semibold group-hover:underline"
        style={{ fontSize: '17px', color: '#2B2B2B', lineHeight: 1.3, marginBottom: '4px' }}
      >
        {lesson.title_en}
      </p>
      <p className="font-sans" style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '14px' }}>
        {lesson.title_as}
      </p>

      {/* Content count stats */}
      <div className="flex flex-wrap gap-3">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1">
            <Icon size={12} color="#9CA3AF" />
            <span className="font-sans" style={{ fontSize: '11px', color: '#9CA3AF' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </Link>
  )
}
