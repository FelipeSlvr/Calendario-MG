import { apiRequest } from './api'

export type CalendarioRow = {
  id_cal: number
  cal_data: string // YYYY-MM-DD
  cal_hora: string // HH:MM:SS
  cal_obs: string | null
}

export type CalendarioCreateBody = {
  cal_data: string
  cal_hora: string // HH:MM:SS
  cal_obs?: string
}

export type CalendarioUpdateBody = CalendarioCreateBody

export async function listarCalendario(params?: { data?: string }) {
  const q = params?.data ? `?data=${encodeURIComponent(params.data)}` : ''
  return apiRequest<CalendarioRow[]>(`/calendario${q}`)
}

export async function buscarCalendario(id: number) {
  return apiRequest<CalendarioRow>(`/calendario/${id}`)
}

export async function criarCalendario(body: CalendarioCreateBody) {
  return apiRequest<{ message: string; id_cal: number }>(`/calendario`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function editarCalendario(id: number, body: CalendarioUpdateBody) {
  return apiRequest<{ message: string }>(`/calendario/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deletarCalendario(id: number) {
  return apiRequest<{ message: string }>(`/calendario/${id}`, {
    method: 'DELETE',
  })
}
