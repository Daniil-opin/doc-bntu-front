import type { Status } from '../types'

const labels: Record<Status, string> = {
  ACTIVE: 'Активна',
  DRAFT: 'Черновик',
  REVIEW: 'На проверке',
  SIGNED: 'Подписан',
  ARCHIVED: 'Архив',
}
export function StatusBadge({ status }: { status: Status }) {
  return <span className={`status status-${status.toLowerCase()}`}>{labels[status]}</span>
}
