// Renders the coloured section banner that appears at the top of every learning
// section page. Colour, icon, and label come from SECTION_IDENTITY so they
// are always consistent with the nav.

import { SECTION_IDENTITY, type SectionKey } from '@/lib/learning/constants'
import {
  BookOpen, BookMarked, Layers, MessageSquare, Zap, RefreshCw,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const ICONS: Record<SectionKey, React.ComponentType<LucideProps>> = {
  lessons:       BookOpen,
  dictionary:    BookMarked,
  grammar:       Layers,
  conversations: MessageSquare,
  practice:      Zap,
  revision:      RefreshCw,
}

interface SectionHeaderProps {
  section: SectionKey
  /** Override the default label if you want a sub-section title */
  title?: string
  subtitle?: string
}

export function SectionHeader({ section, title, subtitle }: SectionHeaderProps) {
  const identity = SECTION_IDENTITY[section]
  const Icon = ICONS[section]

  return (
    <div
      style={{
        background: identity.tint,
        borderBottom: `1px solid ${identity.border}`,
        padding: '24px 32px 20px',
      }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: subtitle ? '6px' : 0 }}>
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: identity.accent,
          }}
        >
          <Icon size={18} color="#FFFFFF" />
        </div>
        <h1
          className="font-heading font-semibold"
          style={{ fontSize: '22px', color: identity.accent, lineHeight: 1.2 }}
        >
          {title ?? identity.label}
        </h1>
      </div>

      {subtitle && (
        <p
          className="font-sans"
          style={{ fontSize: '14px', color: '#6B6B6B', marginTop: '4px', paddingLeft: '48px' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
