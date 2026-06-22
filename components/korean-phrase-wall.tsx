'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const phrases = [
  { korean: '안녕하세요', english: 'Hello' },
  { korean: '감사합니다', english: 'Thank you' },
  { korean: '잘 부탁드립니다', english: 'Please take care of me' },
  { korean: '화이팅!', english: 'Fighting!' },
  { korean: '사랑해요', english: 'I love you' },
  { korean: '수고했어요', english: 'Good job!' },
  { korean: '반갑습니다', english: 'Nice to meet you' },
  { korean: '맛있어요', english: "It's delicious" },
  { korean: '괜찮아요', english: "It's okay" },
]

function FlowerIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5B4A5" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="5" rx="2.5" ry="4" />
      <ellipse cx="12" cy="19" rx="2.5" ry="4" />
      <ellipse cx="5" cy="12" rx="4" ry="2.5" />
      <ellipse cx="19" cy="12" rx="4" ry="2.5" />
      <ellipse cx="7.05" cy="7.05" rx="2.5" ry="4" transform="rotate(-45 7.05 7.05)" />
      <ellipse cx="16.95" cy="16.95" rx="2.5" ry="4" transform="rotate(-45 16.95 16.95)" />
      <ellipse cx="16.95" cy="7.05" rx="2.5" ry="4" transform="rotate(45 16.95 7.05)" />
      <ellipse cx="7.05" cy="16.95" rx="2.5" ry="4" transform="rotate(45 7.05 16.95)" />
    </svg>
  )
}

export function KoreanPhraseWall() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-6 sm:py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="flex items-stretch rounded-2xl overflow-hidden"
          style={{ height: 'clamp(64px, 10vw, 80px)', boxShadow: '0px 4px 20px rgba(139,30,36,0.06)' }}
        >
          {/* Left label panel — shrinks on small screens */}
          <div
            className="flex-shrink-0 flex items-center justify-center px-3 sm:px-6"
            style={{
              width: 'clamp(90px, 18vw, 200px)',
              background: '#F7EEE6',
              borderRadius: '16px 0 0 16px',
            }}
          >
            {/* Mobile: stacked short label; sm+: two-line full label */}
            <div className="text-center sm:text-left">
              <p className="font-heading font-bold text-[#2B2B2B] leading-tight" style={{ fontSize: 'clamp(10px, 1.5vw, 14px)' }}>
                Korean
              </p>
              <p className="font-heading font-bold text-[#2B2B2B] leading-tight" style={{ fontSize: 'clamp(10px, 1.5vw, 14px)' }}>
                Phrase Wall
              </p>
            </div>
          </div>

          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="flex-shrink-0 flex items-center justify-center hover:bg-[#FFF5F0] transition-colors"
            style={{
              width: '28px',
              background: '#FFFFEF',
              borderLeft: '1px solid #E8DCCF',
              borderRight: '1px solid #E8DCCF',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#8B1E24' }} />
          </button>

          {/* Scrollable phrases */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-center overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              background: '#FFFFFF',
            }}
          >
            <style>{`.phrase-scroll::-webkit-scrollbar{display:none}`}</style>
            <div className="flex items-center h-full px-1 sm:px-2">
              {phrases.map((phrase, idx) => (
                <div key={phrase.korean} className="flex items-stretch h-full">
                  <div
                    className="flex-shrink-0 flex flex-col items-center justify-center"
                    style={{ padding: '0 clamp(12px, 2.5vw, 24px)', scrollSnapAlign: 'start' }}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="font-korean font-medium text-[#2B2B2B] whitespace-nowrap"
                        style={{ fontSize: 'clamp(13px, 2vw, 17px)', letterSpacing: '0.01em' }}
                      >
                        {phrase.korean}
                      </span>
                      <FlowerIcon />
                    </div>
                    <span
                      className="font-sans text-[#888888] whitespace-nowrap"
                      style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', marginTop: '2px' }}
                    >
                      {phrase.english}
                    </span>
                  </div>
                  {idx < phrases.length - 1 && (
                    <div className="flex-shrink-0 self-center" style={{ width: '1px', height: '24px', background: '#E8DCCF' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            className="flex-shrink-0 flex items-center justify-center hover:bg-[#FFF5F0] transition-colors"
            style={{
              width: '28px',
              background: '#FFFFEF',
              borderLeft: '1px solid #E8DCCF',
              borderRight: '1px solid #E8DCCF',
              borderRadius: '0 16px 16px 0',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#8B1E24' }} />
          </button>
        </div>
      </div>
    </section>
  )
}
