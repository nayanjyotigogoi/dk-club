import { LEVEL_LABELS, LEVEL_COLORS } from '@/lib/learning/constants'
import type { LearningLevel } from '@/lib/learning/types'

interface LevelBadgeProps {
  level: LearningLevel
}

export function LevelBadge({ level }: LevelBadgeProps) {
  const colors = LEVEL_COLORS[level]
  return (
    <span
      className="font-sans font-medium inline-block"
      style={{
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '999px',
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        lineHeight: '18px',
        letterSpacing: '0.02em',
      }}
    >
      {LEVEL_LABELS[level]}
    </span>
  )
}
