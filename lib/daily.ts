/**
 * Deterministic daily rotation — same item for all users on the same day.
 * Uses day-of-year so the pick changes at midnight local time.
 */
export function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

export function getDailyItem<T>(items: T[], date = new Date()): T | null {
  if (!items.length) return null
  return items[getDayOfYear(date) % items.length]
}

export function getDailyItems<T>(items: T[], count: number, date = new Date()): T[] {
  if (!items.length) return []
  const start = getDayOfYear(date) % items.length
  return Array.from({ length: count }, (_, i) => items[(start + i) % items.length])
}

export function getPreviousItem<T>(items: T[], date = new Date()): T | null {
  if (!items.length) return null
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 1)
  return items[getDayOfYear(prev) % items.length]
}

export function formatDailyDate(date = new Date()): string {
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ── Streak tracking (localStorage) ────────────────────────────────────────────

const STREAK_KEY = 'dkc_visit_dates'

function todayStr(date = new Date()): string {
  return date.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

export function recordVisitAndGetStreak(): number {
  try {
    const today = todayStr()
    const raw = localStorage.getItem(STREAK_KEY)
    const dates: string[] = raw ? JSON.parse(raw) : []

    if (!dates.includes(today)) {
      dates.push(today)
      // keep only last 30 days
      const pruned = dates.slice(-30)
      localStorage.setItem(STREAK_KEY, JSON.stringify(pruned))
    }

    // count consecutive days ending today
    let streak = 0
    const check = new Date()
    while (true) {
      if (dates.includes(todayStr(check))) {
        streak++
        check.setDate(check.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  } catch {
    return 0
  }
}
