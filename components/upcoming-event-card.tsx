'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'

export function UpcomingEventCard() {
  const calculateCountdown = () => {
    const eventDate = new Date('2024-06-15')
    const now = new Date()
    const diff = eventDate.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return { days: Math.max(0, days), hours: Math.max(0, hours), minutes: Math.max(0, minutes), seconds: Math.max(0, seconds) }
  }

  const countdown = calculateCountdown()

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="font-heading text-4xl font-semibold text-primary">
            Upcoming Event
          </h2>
          <Link href="/events" className="text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1">
            View All →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ y: -4 }}
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <Image
                src="/cherry-blossoms.png"
                alt="Event decoration"
                width={300}
                height={300}
                className="w-full max-w-xs h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg mb-4"
                whileHover={{ scale: 1.05 }}
              >
                May 25, 2024 (Saturday)
              </motion.div>

              <h3 className="font-heading text-3xl font-bold text-foreground mb-2">
                Hangul Day Celebration
              </h3>

              <p className="text-muted-foreground text-sm mb-6">
                The beauty of Korean letters
              </p>

              <div className="bg-background rounded-lg p-6 mb-6 flex items-center justify-around">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Mins', value: countdown.minutes },
                  { label: 'Secs', value: countdown.seconds },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-heading text-2xl font-bold text-primary">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">25 May, 2024 (Saturday)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">DU Campus, Dibrugarh University</span>
                </div>
              </div>

              <motion.button
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Register Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
