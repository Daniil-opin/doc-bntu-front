export type Role = 'ADMIN' | 'HEAD'
export type Status = 'ACTIVE' | 'DRAFT' | 'REVIEW' | 'SIGNED' | 'ARCHIVED'

export interface User { id: number; fullName: string; username: string; email?: string; role: Role; active: boolean }
export interface Organization { id: number; name: string; unp: string; contact: string; contracts: number; status: Status }
export interface Contract { id: number; number: string; organization: string; faculty: string; startDate: string; endDate: string; status: Status }
export interface Application { id: number; number: string; organization: string; specialty: string; quantity: number; status: Status }
export interface AuditEvent { id: number; action: string; entity: string; actor: string; createdAt: string }
