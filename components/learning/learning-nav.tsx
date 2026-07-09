'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen, BookMarked, Layers, MessageSquare, Zap, RefreshCw, Search,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SECTION_IDENTITY, type SectionKey } from '@/lib/learning/constants'

// ─── Icon map — keeps the constants file free of React imports ────────────────

const SECTION_ICONS: Record<SectionKey, React.ElementType> = {
  lessons:       BookOpen,
  dictionary:    BookMarked,
  grammar:       Layers,
  conversations: MessageSquare,
  practice:      Zap,
  revision:      RefreshCw,
}

const SECTIONS = Object.entries(SECTION_IDENTITY) as [SectionKey, typeof SECTION_IDENTITY[SectionKey]][]

// ─── Search nav item (standalone — not in SECTION_IDENTITY) ──────────────────

function SearchNavItem({ collapsed, pathname }: { collapsed: boolean; pathname: string }) {
  const isActive = pathname === '/learn/search'
  return (
    <Link
      href="/learn/search"
      title={collapsed ? 'Search' : undefined}
      className={cn(
        'relative flex items-center gap-3 rounded-xl transition-colors group',
        collapsed ? 'justify-center' : ''
      )}
      style={{
        padding: collapsed ? '10px' : '10px 12px',
        background: isActive ? '#FEF3F0' : 'transparent',
        color: isActive ? '#8B1E24' : '#6B6B6B',
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="learning-nav-indicator"
          className="absolute left-0 top-2 bottom-2 rounded-full"
          style={{ width: '3px', background: '#8B1E24' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
      <Search size={20} className="flex-shrink-0" style={{ color: isActive ? '#8B1E24' : '#9CA3AF' }} />
      {!collapsed && (
        <span className="font-sans font-medium" style={{ fontSize: '14px', color: isActive ? '#8B1E24' : '#4B5563' }}>
          Search
        </span>
      )}
      {!isActive && (
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: '#FEF3F0' }}
          aria-hidden
        />
      )}
    </Link>
  )
}

// ─── Sidebar (desktop) ────────────────────────────────────────────────────────

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Learning navigation"
      className="flex flex-col gap-1 h-full"
      style={{ padding: collapsed ? '12px 8px' : '12px 12px' }}
    >
      {/* Section heading */}
      {!collapsed && (
        <div style={{ padding: '4px 12px 8px', marginBottom: '4px' }}>
          <span
            className="font-heading font-semibold tracking-widest uppercase"
            style={{ fontSize: '10px', color: 'rgba(139,30,36,0.5)', letterSpacing: '.1em' }}
          >
            Learning
          </span>
        </div>
      )}

      <SearchNavItem collapsed={collapsed} pathname={pathname} />

      {SECTIONS.map(([key, section]) => {
        const Icon = SECTION_ICONS[key]
        const isActive = pathname === section.href || pathname.startsWith(section.href + '/')

        return (
          <Link
            key={key}
            href={section.href}
            title={collapsed ? section.label : undefined}
            className={cn(
              'relative flex items-center gap-3 rounded-xl transition-colors group',
              collapsed ? 'justify-center' : ''
            )}
            style={{
              padding: collapsed ? '10px' : '10px 12px',
              background: isActive ? section.tint : 'transparent',
              color: isActive ? section.accent : '#6B6B6B',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Active indicator bar */}
            {isActive && (
              <motion.div
                layoutId="learning-nav-indicator"
                className="absolute left-0 top-2 bottom-2 rounded-full"
                style={{ width: '3px', background: section.accent }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}

            <Icon
              className="flex-shrink-0 transition-colors"
              size={20}
              style={{ color: isActive ? section.accent : '#9CA3AF' }}
            />

            {!collapsed && (
              <span
                className="font-sans font-medium transition-colors"
                style={{ fontSize: '14px', color: isActive ? section.accent : '#4B5563' }}
              >
                {section.label}
              </span>
            )}

            {/* Hover tint for non-active items */}
            {!isActive && (
              <span
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: section.tint }}
                aria-hidden
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Bottom tab bar (mobile) ──────────────────────────────────────────────────

function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Learning navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: '#FFFFFF',
        borderTop: '0.5px solid #E8DCCF',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Search tab */}
      {(() => {
        const isActive = pathname === '/learn/search'
        return (
          <Link
            href="/learn/search"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{ padding: '8px 4px', minHeight: '52px' }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Search size={20} style={{ color: isActive ? '#8B1E24' : '#9CA3AF' }} />
            <span className="font-sans" style={{ fontSize: '9px', fontWeight: isActive ? 600 : 400, color: isActive ? '#8B1E24' : '#9CA3AF', lineHeight: 1 }}>
              Search
            </span>
          </Link>
        )
      })()}

      {SECTIONS.map(([key, section]) => {
        const Icon = SECTION_ICONS[key]
        const isActive = pathname === section.href || pathname.startsWith(section.href + '/')

        return (
          <Link
            key={key}
            href={section.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{
              padding: '8px 4px',
              color: isActive ? section.accent : '#9CA3AF',
              minHeight: '52px',
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} />
            <span
              className="font-sans"
              style={{
                fontSize: '9px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? section.accent : '#9CA3AF',
                lineHeight: 1,
              }}
            >
              {section.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

// ─── Shell wrapper — renders the appropriate nav for the viewport ─────────────

export function LearningNav() {
  return (
    <>
      {/* Desktop sidebar — hidden below md, icon-only below xl */}
      <div
        className="hidden md:flex flex-col flex-shrink-0"
        style={{
          width: '240px',
          minHeight: '100%',
          borderRight: '0.5px solid #E8DCCF',
          background: '#FDFAF7',
        }}
      >
        <SidebarNav collapsed={false} />
      </div>

      {/* Mobile tab bar — visible below md only */}
      <div className="md:hidden">
        <MobileTabBar />
      </div>
    </>
  )
}
