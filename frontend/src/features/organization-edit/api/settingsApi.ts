import { apiRequest } from '../../../shared/api/client'

export const settingsApi = {
  saveBntuRequisites: (values: Record<string, string>) =>
    apiRequest<void>('/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(values),
    }),
}
