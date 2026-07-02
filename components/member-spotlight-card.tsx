'use client'

import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

export function MemberSpotlightCard() {
  const spotlightMembers = [
    {
      name: 'Park Ji-won',
      status: 'Active Member',
      learning: 'Started Learning in 2026',
      quote: '"Learning Korean is not just about a language, it\'s about connecting hearts and cultures."',
      dream: 'Visit Korea',
      favoriteWord: '사랑 (Sa-rang) - Love',
    },
    {
      name: 'Kim Min-jun',
      status: 'Core Member',
      learning: 'Started Learning in 2023',
      quote: '"Every class brings me closer to understanding this beautiful culture."',
      dream: 'Become Translator',
      favoriteWord: '친구 (Chingu) - Friend',
    },
    {
      name: 'Lee Soo-jin',
      status: 'Moderator',
      learning: 'Started Learning in 2022',
      quote: '"Korean culture opens windows to new perspectives and friendships."',
      dream: 'Live in Seoul',
      favoriteWord: '희망 (Huimang) - Hope',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-heading text-4xl font-semibold text-primary mb-3">
            Member Spotlight
          </h2>
          <p className="text-muted-foreground text-lg">
            Meet the passionate people behind our club
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {spotlightMembers.map((member, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: '0 8px 24px rgba(217, 124, 111, 0.15)' }}
              transition={{ duration: 0.3 }}
              className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 shadow-sm overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <motion.div
                  className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {member.status}
                </motion.div>
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                {member.name}
              </h3>

              <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                📅 {member.learning}
              </div>

              <p className="text-sm text-foreground italic mb-4 leading-relaxed">
                {member.quote}
              </p>

              <div className="space-y-2 text-sm pt-4 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">🎯</span>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Dream</div>
                    <div className="text-foreground">{member.dream}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">❤️</span>
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground">Favorite Word</div>
                    <div className="text-foreground text-sm">{member.favoriteWord}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
