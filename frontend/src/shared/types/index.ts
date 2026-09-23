export const UserRole = { ADMIN: 'ADMIN', HEAD: 'HEAD' } as const
export type Role = (typeof UserRole)[keyof typeof UserRole]
export const USER_ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Администратор',
  HEAD: 'Руководитель',
}

export const Status = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  SIGNED: 'SIGNED',
  ARCHIVED: 'ARCHIVED',
} as const
export type Status = (typeof Status)[keyof typeof Status]

export interface User {
  id: number
  fullName: string
  username: string
  email?: string
  role: Role
  active: boolean
}
export interface Organization {
  id: number
  name: string
  unp: string
  contact: string
  contracts: number
  status: Status
}
export interface Contract {
  id: number
  number: string
  organization: string
  faculty: string
  startDate: string
  endDate: string
  status: Status
}
export interface Application {
  id: number
  number: string
  organization: string
  specialty: string
  quantity: number
  status: Status
}
export interface AuditEvent {
  id: number
  action: string
  entity: string
  actor: string
  createdAt: string
}
