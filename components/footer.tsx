'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useState } from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const quickLinks = [
    { id: 'quick-home', label: 'Home', href: '/' },
    { id: 'quick-about', label: 'About Us', href: '/about' },
    { id: 'quick-events', label: 'Events', href: '/events' },
    { id: 'quick-korean', label: 'Learn Korean', href: '/culture' },
    { id: 'quick-gallery', label: 'Gallery', href: '/gallery' },
    { id: 'quick-resources', label: 'Resources', href: '/resources' },
    { id: 'quick-contact', label: 'Contact Us', href: '/contact' },
  ]

  const memberArea = [
    { id: 'member-register', label: 'Join DKC', href: '/join' },
    { id: 'member-courses', label: 'Courses', href: '/courses' },
    { id: 'member-support', label: 'Help & Support', href: '/contact' },
  ]

  const resources = [
    { id: 'res-materials', label: 'Study Materials',    href: '/resources/study-materials' },
    { id: 'res-vocab',     label: 'Vocabulary Lists',   href: '/resources/vocabulary' },
    { id: 'res-grammar',   label: 'Grammar Guide',      href: '/resources/grammar' },
    { id: 'res-culture',   label: 'Korean Culture',     href: '/resources/korean-culture' },
    { id: 'res-practice',  label: 'Practice Exercises', href: '/resources/practice' },
    { id: 'res-books',     label: 'Recommended Books',  href: '/resources/books' },
    { id: 'res-links',     label: 'Useful Links',       href: '/resources/links' },
  ]

  const socialLinks = [
    {
      id: 'social-ig',
      label: 'Instagram',
      href: 'https://www.instagram.com/dibrugarhkorean.club',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      id: 'social-fb',
      label: 'Facebook',
      href: '#',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      id: 'social-yt',
      label: 'YouTube',
      href: '#',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
        </svg>
      ),
    },
    {
      id: 'social-email',
      label: 'Email',
      href: 'connect@dibrugarhkoreanclub.com',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Left: Logo Section */}
          <div className="flex flex-col items-center sm:items-start sm:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-20 h-20 rounded-full overflow-hidden mb-4 flex-shrink-0"
            >
              <Image
                src="/logo.png"
                alt="Dibrugarh Korean Club"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-full"
              />
            </motion.div>

            <div className="text-center sm:text-left">
              <h3 className="font-heading text-base font-bold text-primary leading-tight">
                DIBRUGARH<br />KOREAN CLUB
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center sm:text-left leading-relaxed">
              Bridging cultures, building friendships, and exploring the beauty of Korean language and heritage.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-start gap-3 mt-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    border: '2px solid #8B1E24',
                    color: '#8B1E24',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#8B1E24'
                    ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#8B1E24'
                  }}
                  title={social.label}
                  aria-label={social.label}
                >
                  {social.svg}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center sm:items-start"
          >
            <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 w-full">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2 justify-center sm:justify-start"
                  >
                    <span className="text-primary">•</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Member Area Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center sm:items-start"
          >
            <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-wider mb-4">
              Member Area
            </h4>
            <ul className="space-y-2 w-full">
              {memberArea.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2 justify-center sm:justify-start"
                  >
                    <span className="text-primary">•</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center sm:items-start"
          >
            <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2 w-full">
              {resources.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-2 justify-center sm:justify-start"
                  >
                    <span className="text-primary">•</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stay Updated Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col items-center sm:items-start col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Stay Updated
            </h4>
            <p className="text-xs text-foreground mb-4 text-center sm:text-left">
              Subscribe to our newsletter and never miss an update!
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 w-full">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-3 py-2 bg-primary text-primary-foreground rounded font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-primary font-semibold text-center"
                >
                  Thank you!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Bottom Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left"
        >
          <p>&copy; {currentYear} Dibrugarh Korean Club. All rights reserved.</p>
          <p>
            Made with <span className="text-primary">❤</span> for our amazing community.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
