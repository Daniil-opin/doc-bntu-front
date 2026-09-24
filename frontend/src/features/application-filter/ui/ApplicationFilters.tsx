import { Search } from 'lucide-react'
import type { FormEvent } from 'react'

import type { ApplicationFilters } from '../../../entities/application'
import type { Status } from '../../../shared/types'
import { Select } from '../../../shared/ui/Select'
import styles from './ApplicationFilters.module.css'

type ApplicationFiltersProps = {
  value: ApplicationFilters
  faculties: string[]
  onChange: (filters: ApplicationFilters) => void
  onSubmit: (event: FormEvent) => void
  onReset: () => void
  showReset: boolean
}

const statusOptions: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'Все статусы' },
  { value: 'ACTIVE', label: 'Активна' },
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'REVIEW', label: 'На проверке' },
  { value: 'SIGNED', label: 'Подписан' },
  { value: 'ARCHIVED', label: 'Архив' },
]

export function ApplicationFilters({
  value,
  faculties,
  onChange,
  onSubmit,
  onReset,
  showReset,
}: ApplicationFiltersProps) {
  const update = <T extends keyof ApplicationFilters>(field: T, nextValue: ApplicationFilters[T]) =>
    onChange({ ...value, [field]: nextValue })

  return (
    <form className={styles.filters} aria-label="Фильтры заявок" onSubmit={onSubmit}>
      <label className={styles.search}>
        <span>Поиск</span>
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={value.query}
          onChange={(event) => update('query', event.target.value)}
          placeholder="Номер заявки или организация"
        />
      </label>
      <div className={styles.selectField}>
        <span>Факультет</span>
        <Select
          value={value.faculty}
          onChange={(faculty) => update('faculty', faculty)}
          options={[
            { value: 'all', label: 'Все факультеты' },
            ...faculties.map((faculty) => ({ value: faculty, label: faculty })),
          ]}
          name="Факультет"
          ariaLabel="Факультет"
        />
      </div>
      <div className={styles.selectField}>
        <span>Статус</span>
        <Select
          value={value.status}
          onChange={(status) => update('status', status)}
          options={statusOptions}
          name="Статус"
          ariaLabel="Статус"
        />
      </div>
      <div className={styles.actions}>
        <button className="primary" type="submit">
          Фильтровать
        </button>
        {showReset && (
          <button className="secondary" type="button" onClick={onReset}>
            Сбросить
          </button>
        )}
      </div>
    </form>
  )
}
