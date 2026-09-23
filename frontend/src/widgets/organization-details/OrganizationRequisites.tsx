import { Building2 } from 'lucide-react'

import styles from './OrganizationRequisites.module.css'

export type OrganizationRequisitesData = {
  shortName: string
  fullName: string
  address: string
  department: string
  phone: string
}

export function OrganizationRequisites({
  requisites,
  onEdit,
}: {
  requisites: OrganizationRequisitesData
  onEdit: () => void
}) {
  return (
    <section className={styles.card}>
      <h3 className={styles.title}>
        <Building2 size={15} /> Реквизиты
      </h3>
      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt className={styles.label}>Адрес</dt>
          <dd className={styles.value}>{requisites.address}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.label}>Ведомство</dt>
          <dd className={styles.value}>{requisites.department}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.label}>Телефоны</dt>
          <dd className={styles.value}>{requisites.phone || '—'}</dd>
        </div>
      </dl>
      <button className={styles.editButton} type="button" onClick={onEdit}>
        Редактировать реквизиты
      </button>
    </section>
  )
}
