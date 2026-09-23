import { apiRequest } from '../../../shared/api/client'

export const dataTransferApi = {
  importExcel: async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    await apiRequest<void>('/import', { method: 'POST', body })
  },
  exportExcel: () => apiRequest<Blob>('/export'),
}
