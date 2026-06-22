'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Menu, X, Sun, Users,
  Home, Info, Calendar, Globe, BookOpen, UserCircle, Image as ImageIcon, ShoppingBag, Mail,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '/',          label: 'Home',      icon: Home       },
  { href: '/about',     label: 'About Us',  icon: Info       },
  { href: '/events',    label: 'Events',    icon: Calendar   },
  { href: '/culture',   label: 'Culture',   icon: Globe      },
  { href: '/magazine',  label: 'Magazine',  icon: BookOpen   },
  { href: '/community', label: 'Community', icon: UserCircle },
  { href: '/gallery',   label: 'Gallery',   icon: ImageIcon  },
  { href: '/goodies',   label: 'Goodies',   icon: ShoppingBag},
  { href: '/contact',   label: 'Contact',   icon: Mail       },
]

export function Navbar() {
  const [isOpen,  setIsOpen]  = useState(false)
  const [visible, setVisible] = useState(true)
  const [atTop,   setAtTop]   = useState(true)
  const lastScrollY = useRef(0)
  const pathname    = usePathname()

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setAtTop(current < 10)
      setVisible(current < lastScrollY.current || current < 80)
      lastScrollY.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href
  const scrolled = !atTop

  return (
    <motion.div
      animate={{ y: visible ? 0 : '-120%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ padding: '12px 16px 0' }}
    >
      <motion.nav
        animate={{
          background: scrolled ? '#8B1E24' : '#FFFFFF',
          boxShadow: scrolled
            ? '0px 4px 20px rgba(139,30,36,0.18)'
            : '0px 2px 10px rgba(0,0,0,0.05)',
        }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: '16px' }}
      >
        {/* Main bar */}
        <div
          className="flex items-center justify-between h-[72px]"
          style={{ padding: '0 40px' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Dibrugarh Korean Club"
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="font-heading font-semibold tracking-wide leading-tight transition-colors duration-300"
                style={{ fontSize: '13px', color: scrolled ? '#FFFFFF' : '#8B1E24' }}
              >
                DIBRUGARH
              </span>
              <span
                className="font-heading font-semibold tracking-wide leading-tight transition-colors duration-300"
                style={{ fontSize: '13px', color: scrolled ? '#FFFFFF' : '#8B1E24' }}
              >
                KOREAN CLUB
              </span>
              <span
                className="font-korean mt-0.5 transition-colors duration-300"
                style={{ fontSize: '10px', color: scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(139,30,36,0.7)' }}
              >
                함께 배우고 함께 성장해요
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden xl:flex items-center flex-1 justify-center" style={{ gap: '24px' }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-sans font-medium whitespace-nowrap transition-colors group"
                style={{
                  fontSize: '15px',
                  color: scrolled
                    ? isActive(link.href) ? '#FFFFFF' : 'rgba(255,255,255,0.85)'
                    : isActive(link.href) ? '#8B1E24' : '#333333',
                }}
              >
                {link.label}
                {isActive(link.href) ? (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5"
                    style={{ width: '24px', background: scrolled ? '#FFFFFF' : '#8B1E24' }}
                    transition={{ duration: 0.25 }}
                  />
                ) : (
                  <div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-6 transition-all duration-300"
                    style={{ background: scrolled ? '#FFFFFF' : '#8B1E24' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme toggle */}
            <button
              className="hidden sm:flex items-center justify-center rounded-full transition-colors"
              style={{
                width: '40px',
                height: '40px',
                background: scrolled ? 'rgba(255,255,255,0.15)' : '#F8F6F2',
                border: `1px solid ${scrolled ? 'rgba(255,255,255,0.25)' : '#E8E1D6'}`,
              }}
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4" style={{ color: scrolled ? '#FFFFFF' : '#6B6B6B' }} />
            </button>

            {/* Join CTA */}
            <Link
              href="/community"
              className="hidden lg:flex items-center gap-2 font-sans font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{
                background: scrolled ? '#FFFFFF' : '#8B1E24',
                color: scrolled ? '#8B1E24' : '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '30px',
                fontSize: '15px',
                whiteSpace: 'nowrap',
              }}
            >
              Join the Club
              <Users className="w-4 h-4" />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 transition-colors"
              style={{ color: scrolled ? '#FFFFFF' : '#333333' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden overflow-hidden"
              style={{
                borderTop: `1px solid ${scrolled ? 'rgba(255,255,255,0.15)' : '#E8E1D6'}`,
                borderRadius: '0 0 16px 16px',
              }}
            >
              <div className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                      style={{
                        background: active
                          ? scrolled ? 'rgba(255,255,255,0.15)' : 'rgba(139,30,36,0.08)'
                          : 'transparent',
                        color: scrolled
                          ? active ? '#FFFFFF' : 'rgba(255,255,255,0.8)'
                          : active ? '#8B1E24' : '#333333',
                      }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-sans font-medium text-sm">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.div>
  )
}
