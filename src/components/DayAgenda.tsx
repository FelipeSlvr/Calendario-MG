import { Button, Card, ListGroup } from 'react-bootstrap'
import type { CalendarEvent } from '../types/calendar'

type Props = {
  dateLabel: string
  events: CalendarEvent[]
  onAdd: () => void
  onEdit: (ev: CalendarEvent) => void
  onDelete: (ev: CalendarEvent) => void
}

export function DayAgenda({ dateLabel, events, onAdd, onEdit, onDelete }: Props) {
  return (
    <Card className="agendaCard">
      <Card.Body className="agendaHeader">
        <div>
          <div className="agendaTitle">Agenda</div>
          <div className="agendaSubtitle">{dateLabel}</div>
        </div>
        <Button variant="danger" onClick={onAdd}>
          + Novo evento
        </Button>
      </Card.Body>

      {events.length === 0 ? (
        <div className="agendaEmpty">Nenhum evento neste dia.</div>
      ) : (
        <ListGroup variant="flush">
          {events.map((ev) => (
            <ListGroup.Item key={ev.id} className="agendaItem">
              <div className="agendaItemMain" role="button" tabIndex={0} onClick={() => onEdit(ev)}>
                <div className="agendaTime">{ev.time}</div>
                <div className="agendaInfo">
                  <div className="agendaEventTitle">{ev.title}</div>
                  <div className="agendaAddress">{ev.address}</div>
                </div>
              </div>
              <div className="agendaActions">
                <Button size="sm" variant="outline-light" onClick={() => onEdit(ev)}>
                  Editar
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(ev)}>
                  Excluir
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  )
}
