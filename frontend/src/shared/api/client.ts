const API_URL = import.meta.env.VITE_API_URL ?? ''

export async function requestPasswordReset(username: string): Promise<void> {
  await apiRequest<void>('/auth/password-reset', {
    method: 'POST',
    body: JSON.stringify({ username }),
  })
}

export async function importExcel(file: File): Promise<void> {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch(`${API_URL}/import`, { method: 'POST', credentials: 'include', body })
  if (!response.ok) throw new Error(`API ${response.status}`)
}

export async function exportExcel(): Promise<Blob> {
  const response = await fetch(`${API_URL}/export`, { credentials: 'include' })
  if (!response.ok) throw new Error(`API ${response.status}`)
  return response.blob()
}

export async function saveBntuRequisites(values: Record<string, string>): Promise<void> {
  const body = new URLSearchParams(values)
  const response = await fetch(`${API_URL}/settings`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!response.ok) throw new Error(`API ${response.status}`)
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...init?.headers }, ...init })
  if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`)
  return response.json() as Promise<T>
}
