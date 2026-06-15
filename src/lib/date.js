// Date helpers — all keys are local-date "YYYY-MM-DD" strings so a completion
// belongs to the day the user actually tapped it (no UTC drift).

/** Local date string "YYYY-MM-DD" for a given Date (defaults to now). */
export function dateKey(d = new Date()) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Today's key. */
export function todayKey() {
  return dateKey(new Date())
}

/** Key for `offset` days relative to today (negative = past). */
export function offsetKey(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return dateKey(d)
}

/** Keys for the current week, Monday..Sunday. */
export function weekKeys() {
  const now = new Date()
  // getDay(): 0=Sun..6=Sat. Shift so Monday is the first day.
  const dayOfWeek = (now.getDay() + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek)
  const keys = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    keys.push(dateKey(d))
  }
  return keys
}

/** Friendly greeting based on the current hour. */
export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Human-friendly label for an ISO timestamp, e.g. "Today, 3:14 PM". */
export function formatWhen(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  const thisK = dateKey(d)
  if (thisK === todayKey()) return `Today, ${time}`
  if (thisK === offsetKey(-1)) return `Yesterday, ${time}`
  const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${date}, ${time}`
}
