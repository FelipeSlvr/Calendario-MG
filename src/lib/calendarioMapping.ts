import type { CalendarEvent } from '../types/calendar'
import type { CalendarioRow } from './calendarioApi'

// O backend foi definido para usar cal_obs como TEXTO LIVRE de observação.
// Para não perder "Nome" e "Endereço" sem mudar o schema do banco,
// usamos uma convenção simples dentro do cal_obs:
//
// Nome: <titulo>
// Endereço: <endereco>
// Obs: <texto livre>
//
// Se um registro antigo tiver JSON em cal_obs, fazemos fallback e extraímos.

type LegacyJson = {
  title?: string
  address?: string
  notes?: string
}

function buildObsText(ev: CalendarEvent) {
  const lines: string[] = []
  if (ev.title.trim()) lines.push(`Nome: ${ev.title.trim()}`)
  if (ev.address.trim()) lines.push(`Endereço: ${ev.address.trim()}`)
  if (ev.notes?.trim()) lines.push(`Obs: ${ev.notes.trim()}`)
  return lines.join('\n')
}

function parseObsText(text: string | null) {
  const raw = (text ?? '').trim()
  if (!raw) return { title: '', address: '', notes: undefined as string | undefined }

  // Legacy JSON support
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const j = JSON.parse(raw) as LegacyJson
      return {
        title: j.title ?? '',
        address: j.address ?? '',
        notes: j.notes,
      }
    } catch {
      // fallthrough
    }
  }

  const lines = raw.split(/\r?\n/)
  let title = ''
  let address = ''
  const notesLines: string[] = []

  for (const line of lines) {
    const l = line.trim()
    if (!l) continue
    if (/^nome\s*:/i.test(l)) title = l.replace(/^nome\s*:/i, '').trim()
    else if (/^end(er|e)\w*\s*:/i.test(l) || /^endere[cç]o\s*:/i.test(l)) {
      address = l.replace(/^end(er|e)\w*\s*:/i, '').replace(/^endere[cç]o\s*:/i, '').trim()
    } else if (/^obs\s*:/i.test(l) || /^observa(c|ç)[aã]o\s*:/i.test(l)) {
      notesLines.push(l.replace(/^obs\s*:/i, '').replace(/^observa(c|ç)[aã]o\s*:/i, '').trim())
    } else {
      notesLines.push(l)
    }
  }

  const notes = notesLines.length ? notesLines.join('\n') : undefined
  return { title, address, notes }
}

export function eventToApiBody(ev: CalendarEvent) {
  return {
    cal_data: ev.date,
    cal_hora: ev.time.length === 5 ? `${ev.time}:00` : ev.time,
    cal_obs: buildObsText(ev),
  }
}

export function rowToEvent(row: CalendarioRow): CalendarEvent {
  const parsed = parseObsText(row.cal_obs)

  const time = row.cal_hora?.slice(0, 5) ?? '19:00'

  return {
    id: `db_${row.id_cal}`,
    backendId: row.id_cal,
    date: row.cal_data.includes('T') ? row.cal_data.split('T')[0] : row.cal_data,
    time,
    title: parsed.title || 'Evento',
    address: parsed.address ?? '',
    notes: parsed.notes,
  }
}
