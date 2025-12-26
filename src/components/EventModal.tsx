import { useMemo, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import type { CalendarEvent } from '../types/calendar'

type Draft = {
  title: string
  address: string
  time: string
  notes: string
}

type Props = {
  show: boolean
  dateYmd: string
  editing?: CalendarEvent
  onCancel: () => void
  onSave: (draft: Draft) => void
}

export function EventModal({ show, dateYmd, editing, onCancel, onSave }: Props) {
  const initial: Draft = useMemo(
    () => ({
      title: editing?.title ?? '',
      address: editing?.address ?? '',
      time: editing?.time ?? '19:00',
      notes: editing?.notes ?? '',
    }),
    [editing],
  )

  const [draft, setDraft] = useState<Draft>(initial)

  const title = editing ? 'Editar evento' : 'Novo evento'

  const canSave = draft.title.trim().length > 0 && draft.address.trim().length > 0 && /^\d\d:\d\d$/.test(draft.time)

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body key={editing?.id ?? 'new'}>
        <div className="smallText">Data: {dateYmd}</div>

        <Form className="mt-3">
          <Form.Group className="mb-3" controlId="evTitle">
            <Form.Label>Nome do evento</Form.Label>
            <Form.Control
              placeholder="Ex: Role da Serra"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="evAddress">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              placeholder="Ex: Posto X, Av. Y, 123"
              value={draft.address}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="evTime">
            <Form.Label>Horário</Form.Label>
            <Form.Control
              type="time"
              value={draft.time}
              onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="mb-0" controlId="evNotes">
            <Form.Label>Observações (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ponto de encontro, trajeto, dicas..."
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={() => onSave(draft)} disabled={!canSave}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
