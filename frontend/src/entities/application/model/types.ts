import type { Status } from '../../../shared/types'

export interface ApplicationRegistryItem {
  id: number
  number: string
  organization: {
    id: number
    name: string
  }
  receivedAt: string
  signedAt?: string
  faculties: string[]
  status: Status
  scan?: {
    name: string
    url: string
  }
}

export type ApplicationFilters = {
  query: string
  faculty: string
  status: Status | 'all'
}
