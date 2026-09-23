import { apiRequest } from '../../../shared/api/client'

export const authApi = {
  requestPasswordReset: (username: string) =>
    apiRequest<void>('/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),
}
