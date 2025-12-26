export type CalendarEvent = {
  id: string
  /** ID numérico do backend, quando existir */
  backendId?: number
  /** YYYY-MM-DD */
  date: string
  /** "HH:MM" 24h */
  time: string
  title: string
  address: string
  notes?: string
}

export type CalendarDB = {
  version: number
  updatedAt: string
  events: CalendarEvent[]
}
