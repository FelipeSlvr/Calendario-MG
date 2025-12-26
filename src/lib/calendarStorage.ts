import type { CalendarDB, CalendarEvent } from '../types/calendar'

const STORAGE_KEY = 'cavalos-de-aco-mg:calendar-db'

function nowIso() {
  return new Date().toISOString()
}

export function createEmptyDB(): CalendarDB {
  return {
    version: 1,
    updatedAt: nowIso(),
    events: [],
  }
}

export function loadDB(): CalendarDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyDB()
    const parsed = JSON.parse(raw) as CalendarDB
    if (!parsed || typeof parsed !== 'object') return createEmptyDB()
    if (!Array.isArray(parsed.events)) return createEmptyDB()
    return {
      version: typeof parsed.version === 'number' ? parsed.version : 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : nowIso(),
      events: parsed.events,
    }
  } catch {
    return createEmptyDB()
  }
}

export function saveDB(db: CalendarDB) {
  const next: CalendarDB = { ...db, updatedAt: nowIso() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2))
  return next
}

export function upsertEvent(db: CalendarDB, ev: CalendarEvent): CalendarDB {
  const idx = db.events.findIndex((e) => e.id === ev.id)
  const events = [...db.events]
  if (idx >= 0) events[idx] = ev
  else events.push(ev)
  return { ...db, events }
}

export function deleteEvent(db: CalendarDB, id: string): CalendarDB {
  return { ...db, events: db.events.filter((e) => e.id !== id) }
}

export function eventsByDate(db: CalendarDB, date: string): CalendarEvent[] {
  return db.events
    .filter((e) => e.date === date)
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
}
