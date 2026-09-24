import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { ApplicationRegistryItem } from '../../entities/application'
import { formatDate } from '../../shared/lib/format'
import { StatusBadge } from '../../shared/ui/StatusBadge'
import styles from './ApplicationsTable.module.css'

function getFacultyLabel(faculties: string[]) {
  if (faculties.length <= 2) return faculties.join(', ')
  return `${faculties.slice(0, 2).join(', ')} · ещё ${faculties.length - 2}`
}

function ApplicationScanAction({ application }: { application: ApplicationRegistryItem }) {
  if (!application.scan) return <span className={styles.noScan}>Нет скана</span>

  return (
    <a
      className={styles.scanAction}
      href={application.scan.url}
      download={application.scan.name}
      aria-label={`Скачать скан заявки ${application.number}`}
      title={`Скачать ${application.scan.name}`}
    >
      <Download size={16} aria-hidden="true" />
      <span>Скачать</span>
    </a>
  )
}

export function ApplicationsTable({ applications }: { applications: ApplicationRegistryItem[] }) {
  return (
    <div className="table-wrap">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Номер заявки</th>
            <th>Организация</th>
            <th>Дата получения</th>
            <th>Дата подписания</th>
            <th>Факультеты</th>
            <th>Статус</th>
            <th>Скан</th>
          </tr>
        </thead>
        <tbody>
          {applications.length ? (
            applications.map((application) => (
              <tr key={application.id}>
                <td>
                  <Link className="table-link" to={`/applications/${application.id}`}>
                    {application.number}
                  </Link>
                </td>
                <td>
                  <Link className="table-link" to={`/organizations/${application.organization.id}`}>
                    {application.organization.name}
                  </Link>
                </td>
                <td>{formatDate(application.receivedAt)}</td>
                <td>{application.signedAt ? formatDate(application.signedAt) : '—'}</td>
                <td>
                  <span className={styles.faculties} title={application.faculties.join(', ')}>
                    {getFacultyLabel(application.faculties)}
                  </span>
                </td>
                <td>
                  <StatusBadge status={application.status} />
                </td>
                <td>
                  <ApplicationScanAction application={application} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty" colSpan={7}>
                Ничего не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
