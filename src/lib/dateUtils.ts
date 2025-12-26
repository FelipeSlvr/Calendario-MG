export type Ymd = `${number}-${number}-${number}`

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function toYmd(d: Date): Ymd {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` as Ymd
}

export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

export function monthKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
}

export function isDateInMonth(ymd: string, month: Date) {
  // ymd: YYYY-MM-DD
  return ymd.startsWith(`${month.getFullYear()}-${pad2(month.getMonth() + 1)}-`)
}

export function monthLabelPtBr(d: Date) {
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function weekdayShortPtBr() {
  // Monday-first like iOS calendar in pt-BR: seg, ter, qua...
  const base = new Date(2025, 0, 6) // Monday
  return Array.from({ length: 7 }).map((_, i) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleDateString('pt-BR', {
      weekday: 'short',
    }),
  )
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function daysInMonthGrid(month: Date) {
  // Monday-first grid
  const first = startOfMonth(month)
  const jsDay = first.getDay() // 0=Sun
  const mondayFirstIndex = (jsDay + 6) % 7 // 0=Mon
  const start = new Date(first)
  start.setDate(first.getDate() - mondayFirstIndex)

  return Array.from({ length: 42 }).map((_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}
