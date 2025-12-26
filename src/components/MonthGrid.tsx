import { memo } from 'react'
import { Badge } from 'react-bootstrap'
import { daysInMonthGrid, toYmd } from '../lib/dateUtils'
import type { CalendarEvent } from '../types/calendar'

type Props = {
  month: Date
  selectedDate: string
  todayYmd: string
  events: CalendarEvent[]
  onSelectDate: (dateYmd: string) => void
}

function MonthGridImpl({ month, selectedDate, todayYmd, events, onSelectDate }: Props) {
  const days = daysInMonthGrid(month)
  const monthIndex = month.getMonth()

  const countByDate = new Map<string, number>()
  for (const ev of events) {
    countByDate.set(ev.date, (countByDate.get(ev.date) ?? 0) + 1)
  }

  return (
    <div className="monthGrid" role="grid" aria-label="Calendário">
      {days.map((d) => {
        const ymd = toYmd(d)
        const inMonth = d.getMonth() === monthIndex
        const isSelected = ymd === selectedDate
        const isToday = ymd === todayYmd
        const evCount = countByDate.get(ymd) ?? 0

        const className = [
          'dayCell',
          inMonth ? 'inMonth' : 'outMonth',
          isSelected ? 'selected' : '',
          isToday ? 'today' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <button
            key={ymd}
            type="button"
            className={className}
            onClick={() => onSelectDate(ymd)}
            aria-selected={isSelected}
            title={ymd}
          >
            <div className="dayCellTop">
              <span className="dayNumber">{d.getDate()}</span>
              {evCount > 0 ? (
                <Badge bg={isSelected ? 'light' : 'danger'} text={isSelected ? 'dark' : undefined} pill>
                  {evCount}
                </Badge>
              ) : (
                <span className="badgeSpacer" />
              )}
            </div>
            <div className="dots" aria-hidden>
              {Array.from({ length: Math.min(evCount, 3) }).map((_, i) => (
                <span key={i} className="dot" />
              ))}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export const MonthGrid = memo(MonthGridImpl)
