const API_URL = import.meta.env.VITE_API_URL ?? ''
const API_HEALTH_PATH = import.meta.env.VITE_API_HEALTH_PATH ?? '/health'

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!response.ok) throw new ApiError(response.status, await response.text())
  if (response.status === 204) return undefined as T
  if (!response.headers.get('content-type')?.includes('application/json')) {
    return response.blob() as Promise<T>
  }
  return response.json() as Promise<T>
}

export async function checkApiHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}${API_HEALTH_PATH}`, {
      credentials: 'include',
      signal,
    })
    return response.ok
  } catch {
    return false
  }
}
