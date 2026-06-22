import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeroProps {
  koreanTitle: string
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  accent?: string
}

export function PageHero({ koreanTitle, title, subtitle, breadcrumbs, accent }: PageHeroProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: '#FAF6F0', borderBottom: '1px solid #E8DCCF' }}
    >
      {/* Decorative wave motif — bottom right */}
      <svg
        className="absolute bottom-0 right-0 opacity-10 pointer-events-none"
        width="340"
        height="120"
        viewBox="0 0 340 120"
        fill="none"
      >
        <path d="M0 80 Q40 40 80 80 Q120 120 160 80 Q200 40 240 80 Q280 120 320 80 Q330 75 340 80" stroke="#8B1E24" strokeWidth="2" fill="none"/>
        <path d="M0 100 Q40 60 80 100 Q120 140 160 100 Q200 60 240 100 Q280 140 320 100 Q330 95 340 100" stroke="#8B1E24" strokeWidth="1.5" fill="none"/>
      </svg>

      {/* Decorative circle top-left */}
      <div
        className="absolute -top-16 -left-16 rounded-full pointer-events-none"
        style={{ width: 200, height: 200, background: 'radial-gradient(circle, #F0DDD0 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-6" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#999]" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="font-sans text-xs text-[#8B1E24] hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-sans text-xs text-[#888]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Korean label */}
        <p className="font-korean text-[#8B1E24]/60 text-sm mb-2">{koreanTitle}</p>

        {/* Title */}
        <h1 className="font-heading font-bold text-[#2B2B2B] leading-tight mb-3" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
          {title}
          {accent && <span style={{ color: '#8B1E24' }}> {accent}</span>}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-sans text-[#666] max-w-xl leading-relaxed" style={{ fontSize: '16px' }}>
            {subtitle}
          </p>
        )}

        {/* Divider */}
        <div className="mt-8 flex items-center gap-3">
          <div style={{ width: 40, height: 3, background: '#8B1E24', borderRadius: 2 }} />
          <div style={{ width: 8, height: 3, background: '#E8DCCF', borderRadius: 2 }} />
          <div style={{ width: 8, height: 3, background: '#E8DCCF', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )
}
