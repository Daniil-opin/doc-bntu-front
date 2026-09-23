import { ChevronDown, Search, X } from 'lucide-react'
import { FormEvent, useState } from 'react'

import { useModalAccessibility } from '../../shared/hooks/useModalAccessibility'
import { Select } from '../../shared/ui/Select'
import styles from './OrganizationModals.module.css'

export type AgreementForm = { number: string; date: string }
export type ContractForm = {
  faculties: string[]
  number: string
  startDate: string
  endDate: string
}

interface FacultyMultiSelectProps {
  faculties: string[]
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

export function FacultyMultiSelect({
  faculties,
  value,
  onChange,
  className = '',
}: FacultyMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const visibleFaculties = faculties.filter((faculty) =>
    faculty.toLowerCase().includes(query.toLowerCase()),
  )
  const toggle = (faculty: string) =>
    onChange(
      value.includes(faculty) ? value.filter((item) => item !== faculty) : [...value, faculty],
    )
  return (
    <div
      className={`${styles.facultySelect} ${open ? styles.facultyOpen : ''} ${className}`.trim()}
    >
      <button
        className={styles.facultyTrigger}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          {value.length
            ? `${value[0]}${value.length > 1 ? ` + ещё ${value.length - 1}` : ''}`
            : 'Выберите факультеты'}
        </span>
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className={styles.facultyMenu}>
          <div className={styles.facultySearch}>
            <Search size={13} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск факультета"
            />
          </div>
          {visibleFaculties.map((faculty) => (
            <button
              className={
                value.includes(faculty)
                  ? `${styles.facultyOption} ${styles.facultySelected}`
                  : styles.facultyOption
              }
              type="button"
              key={faculty}
              onClick={() => toggle(faculty)}
            >
              <span>{faculty}</span>
              {value.includes(faculty) && <b>✓</b>}
            </button>
          ))}
          {!visibleFaculties.length && (
            <span className={styles.facultyEmpty}>Ничего не найдено</span>
          )}
        </div>
      )}
    </div>
  )
}

export function AgreementModal({
  agreement,
  onChange,
  onClose,
  onSave,
}: {
  agreement: AgreementForm
  onChange: (value: AgreementForm) => void
  onClose: () => void
  onSave: (event: FormEvent) => void
}) {
  const dialogRef = useModalAccessibility<HTMLFormElement>(onClose)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form
        ref={dialogRef}
        className={styles.agreementModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-modal-title"
        tabIndex={-1}
        onSubmit={onSave}
      >
        <div className="modal-header">
          <h2 id="agreement-modal-title">Регистрация дополнительного соглашения</h2>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.agreementFields}>
          <label>
            Номер дополнительного соглашения
            <input
              value={agreement.number}
              onChange={(event) => onChange({ ...agreement, number: event.target.value })}
              placeholder="Номер дополнительного соглашения"
              required
            />
          </label>
          <label>
            Дата соглашения
            <input
              type="date"
              value={agreement.date}
              onChange={(event) => onChange({ ...agreement, date: event.target.value })}
              required
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>
            Отмена
          </button>
          <button className={`primary ${styles.agreementSubmit}`} type="submit">
            Активировать дополнительное соглашение
          </button>
        </div>
      </form>
    </div>
  )
}

export function ContractEditModal({
  contract,
  faculties,
  onChange,
  onClose,
  onSave,
}: {
  contract: ContractForm
  faculties: string[]
  onChange: (value: ContractForm) => void
  onClose: () => void
  onSave: (event: FormEvent) => void
}) {
  const dialogRef = useModalAccessibility<HTMLFormElement>(onClose)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form
        ref={dialogRef}
        className={styles.contractEditModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-edit-modal-title"
        tabIndex={-1}
        onSubmit={onSave}
      >
        <div className="modal-header">
          <h2 id="contract-edit-modal-title">Редактировать договор</h2>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.contractEditFields}>
          <label>
            Факультеты
            <FacultyMultiSelect
              faculties={faculties}
              value={contract.faculties}
              onChange={(value) => onChange({ ...contract, faculties: value })}
              className={styles.contractFacultyPicker}
            />
          </label>
          <label>
            Номер договора
            <input
              value={contract.number}
              onChange={(event) => onChange({ ...contract, number: event.target.value })}
              required
            />
          </label>
          <label>
            Дата начала
            <input
              type="date"
              value={contract.startDate}
              onChange={(event) => onChange({ ...contract, startDate: event.target.value })}
              required
            />
          </label>
          <label>
            Дата окончания
            <input
              type="date"
              value={contract.endDate}
              onChange={(event) => onChange({ ...contract, endDate: event.target.value })}
              required
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>
            Отмена
          </button>
          <button className="primary" type="submit">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  )
}

export function StatusModal({
  currentStatus,
  nextStatus,
  comment,
  onStatusChange,
  onCommentChange,
  onClose,
  onSave,
}: {
  currentStatus: string
  nextStatus: string
  comment: string
  onStatusChange: (value: string) => void
  onCommentChange: (value: string) => void
  onClose: () => void
  onSave: (event: FormEvent) => void
}) {
  const options = [
    { value: 'Активен', label: 'Активен' },
    { value: 'Закрыт', label: 'Закрыт' },
  ]
  const dialogRef = useModalAccessibility<HTMLFormElement>(onClose)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form
        ref={dialogRef}
        className={styles.statusModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        tabIndex={-1}
        onSubmit={onSave}
      >
        <div className={styles.statusHeader}>
          <h2 id="status-modal-title">
            Сменить статус договора д.с. №1 от 06.05.2025 №221-АТФ/280 от 01.10.2020
          </h2>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.statusFields}>
          <label>
            Новый статус
            <Select value={nextStatus} options={options} onChange={onStatusChange} />
          </label>
          <label>
            Комментарий
            <textarea
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
              placeholder="Причина изменения статуса"
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>
            Отмена
          </button>
          <button className="primary" type="submit">
            Сохранить
          </button>
        </div>
        <span className={styles.currentStatus}>Текущий статус: {currentStatus}</span>
      </form>
    </div>
  )
}
