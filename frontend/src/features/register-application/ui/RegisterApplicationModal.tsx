import { ChevronDown, X } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { useModalAccessibility } from '../../../shared/hooks/useModalAccessibility'
import { FACULTIES } from '../../../shared/lib/faculties'
import styles from './RegisterApplicationModal.module.css'

export type ApplicationForm = {
  receivedDate: string
  number: string
  signedDate: string
  faculties: string[]
}

type RegisterApplicationModalProps = {
  application: ApplicationForm
  organizationName: string
  onChange: (value: ApplicationForm) => void
  onClose: () => void
  onSave: (event: FormEvent) => void
}

export function RegisterApplicationModal({
  application,
  organizationName,
  onChange,
  onClose,
  onSave,
}: RegisterApplicationModalProps) {
  const [isFacultyOpen, setFacultyOpen] = useState(false)
  const [facultyQuery, setFacultyQuery] = useState('')
  const dialogRef = useModalAccessibility<HTMLFormElement>(onClose)
  const filteredFaculties = FACULTIES.filter((faculty) =>
    faculty.toLowerCase().includes(facultyQuery.toLowerCase()),
  )
  const toggleFaculty = (faculty: string) =>
    onChange({
      ...application,
      faculties: application.faculties.includes(faculty)
        ? application.faculties.filter((item) => item !== faculty)
        : [...application.faculties, faculty],
    })
  const update = (field: keyof Omit<ApplicationForm, 'faculties'>, value: string) =>
    onChange({ ...application, [field]: value })

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
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-application-title"
        tabIndex={-1}
        onSubmit={onSave}
      >
        <div className="modal-header">
          <div>
            <h2 className={styles.title} id="register-application-title">
              Зарегистрировать заявку
            </h2>
            <p>{organizationName} · заявка уже получена от организации</p>
          </div>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.fields}>
          <label className={styles.field}>
            Дата получения
            <input
              type="date"
              value={application.receivedDate}
              onChange={(event) => update('receivedDate', event.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            Номер заявки
            <input
              value={application.number}
              onChange={(event) => update('number', event.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            Дата подписания
            <input
              type="date"
              value={application.signedDate}
              onChange={(event) => update('signedDate', event.target.value)}
            />
          </label>
          <label className={styles.field}>
            Факультеты по специальностям
            <div className={styles.facultyPicker}>
              <button
                className={styles.facultyTrigger}
                type="button"
                onClick={() => setFacultyOpen((current) => !current)}
              >
                Выберите факультеты <ChevronDown size={13} />
              </button>
              {isFacultyOpen && (
                <div className={styles.dropdown}>
                  <input
                    className={styles.search}
                    autoFocus
                    placeholder="Поиск факультета"
                    value={facultyQuery}
                    onChange={(event) => setFacultyQuery(event.target.value)}
                  />
                  <div className={styles.optionList}>
                    {filteredFaculties.map((faculty) => (
                      <label className={styles.option} key={faculty}>
                        <input
                          type="checkbox"
                          checked={application.faculties.includes(faculty)}
                          onChange={() => toggleFaculty(faculty)}
                        />{' '}
                        <span>{faculty}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>
            Отмена
          </button>
          <button className="primary" type="submit">
            Зарегистрировать заявку
          </button>
        </div>
      </form>
    </div>
  )
}
