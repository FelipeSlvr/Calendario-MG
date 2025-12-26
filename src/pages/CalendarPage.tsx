import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap'
import { DayAgenda } from '../components/DayAgenda'
import { EventModal } from '../components/EventModal'
import { MonthGrid } from '../components/MonthGrid'
import { TopBar } from '../components/TopBar'
import { addMonths, monthLabelPtBr, toYmd, weekdayShortPtBr } from '../lib/dateUtils'
import { isDateInMonth, monthKey } from '../lib/dateUtils'
import type { CalendarEvent } from '../types/calendar'
import { ApiError } from '../lib/api'
import { criarCalendario, deletarCalendario, editarCalendario, listarCalendario } from '../lib/calendarioApi'
import { eventToApiBody, rowToEvent } from '../lib/calendarioMapping'
import { uid } from '../lib/id'

export function CalendarPage() {
  const today = useMemo(() => new Date(), [])
  const todayYmd = useMemo(() => toYmd(today), [today])

  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [month, setMonth] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<string>(todayYmd)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache simples por mês (YYYY-MM) pra evitar ficar chamando tudo o tempo todo
  const monthCacheRef = useRef(new Map<string, CalendarEvent[]>())

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | undefined>(undefined)

  const weekdayLabels = useMemo(() => weekdayShortPtBr(), [])

  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate).slice().sort((a, b) => a.time.localeCompare(b.time)),
    [events, selectedDate],
  )
  const dateLabel = useMemo(() => {
    const d = new Date(selectedDate + 'T00:00:00')
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }, [selectedDate])

  async function refreshForMonth(targetMonth: Date) {
    setLoading(true)
    setError(null)
    try {
      // A API atual filtra por dia. Para mostrar bolinhas/contagem no mês,
      // buscamos a lista inteira (sem filtro) e filtramos no frontend.
      // Se futuramente você adicionar filtro por mês no backend, dá pra otimizar aqui.
      const rows = await listarCalendario()
      const monthEvents = rows.map(rowToEvent).filter((e) => isDateInMonth(e.date, targetMonth))
      monthCacheRef.current.set(monthKey(targetMonth), monthEvents)
      setEvents(monthEvents)
    } catch (e) {
      const msg = e instanceof ApiError ? `Falha ao carregar (${e.status}).` : 'Falha ao carregar.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const key = monthKey(month)
    const cached = monthCacheRef.current.get(key)
    if (cached) {
      setEvents(cached)
      return
    }
    void refreshForMonth(month)
  }, [month])

  function openNewEvent() {
    setEditing(undefined)
    setModalOpen(true)
  }

  function openEditEvent(ev: CalendarEvent) {
    setEditing(ev)
    setModalOpen(true)
  }

  async function handleDelete(ev: CalendarEvent) {
    if (!ev.backendId) return
    setLoading(true)
    setError(null)
    try {
      await deletarCalendario(ev.backendId)
      monthCacheRef.current.delete(monthKey(month))
      await refreshForMonth(month)
    } catch (e) {
      const msg = e instanceof ApiError ? `Falha ao excluir (${e.status}).` : 'Falha ao excluir.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(draft: { title: string; address: string; time: string; notes: string }) {
    const ev: CalendarEvent = {
      id: editing?.id ?? uid('event'),
      backendId: editing?.backendId,
      date: selectedDate,
      time: draft.time,
      title: draft.title.trim(),
      address: draft.address.trim(),
      notes: draft.notes.trim() ? draft.notes.trim() : undefined,
    }

    setLoading(true)
    setError(null)
    try {
      if (ev.backendId) {
        await editarCalendario(ev.backendId, eventToApiBody(ev))
      } else {
        await criarCalendario(eventToApiBody(ev))
      }
      setModalOpen(false)
      setEditing(undefined)
      monthCacheRef.current.delete(monthKey(month))
      await refreshForMonth(month)
    } catch (e) {
      const msg = e instanceof ApiError ? `Falha ao salvar (${e.status}).` : 'Falha ao salvar.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function goPrev() {
    setMonth((m) => addMonths(m, -1))
  }

  function goNext() {
    setMonth((m) => addMonths(m, 1))
  }

  function goToday() {
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(todayYmd)
  }

  function handleSelectDate(ymd: string) {
    setSelectedDate(ymd)
    const d = new Date(ymd + 'T00:00:00')
    if (d.getFullYear() !== month.getFullYear() || d.getMonth() !== month.getMonth()) {
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    }
  }

  return (
    <div className="pageWithBottomBar">
      <Container fluid className="py-3 pb-bottomBar">
        {error ? (
          <Alert variant="danger" className="mx-2">
            {error} Verifique se a API está online e se CORS está liberado.
          </Alert>
        ) : null}
        <Row className="g-3">
          <Col lg={7}>
            <div className="calendarCard">
              <div className="weekdayRow" aria-hidden>
                {weekdayLabels.map((w) => (
                  <div key={w} className="weekdayCell">
                    {w.replace('.', '')}
                  </div>
                ))}
              </div>
              <MonthGrid
                month={month}
                selectedDate={selectedDate}
                todayYmd={todayYmd}
                events={events}
                onSelectDate={handleSelectDate}
              />
              <div className="calendarFooterHint">Toque no dia para ver e adicionar eventos.</div>
            </div>
          </Col>

          <Col lg={5}>
            <DayAgenda
              dateLabel={dateLabel}
              events={dayEvents}
              onAdd={openNewEvent}
              onEdit={openEditEvent}
              onDelete={handleDelete}
            />

            <div className="jsonHint">
              Persistência: os dados ficam salvos na base de dados via API.
            </div>
          </Col>
        </Row>

        {loading ? (
          <div className="d-flex align-items-center gap-2 mt-3 mx-2">
            <Spinner animation="border" size="sm" />
            <div className="smallText">Sincronizando…</div>
          </div>
        ) : null}
      </Container>

      <TopBar
        title={monthLabelPtBr(month)}
        subtitle="Calendário de rolês e encontros"
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        placement="bottom"
      />

      <EventModal
        show={modalOpen}
        dateYmd={selectedDate}
        editing={editing}
        onCancel={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
