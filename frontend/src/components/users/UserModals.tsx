import { Clipboard, Eye, EyeOff, RefreshCw, Trash2, X } from 'lucide-react'
import { FormEvent, useState } from 'react'

import { useModalAccessibility } from '../../shared/hooks/useModalAccessibility'
import { type Role, USER_ROLE_LABELS, UserRole } from '../../shared/types'
import { Select } from '../../shared/ui/Select'
import styles from './UserModals.module.css'

export type UserRow = { id: number; fullName: string; username: string; email: string; role: Role }
export type UserFormValues = Omit<UserRow, 'id'>

function generatePassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  return Array.from(
    { length: 12 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join('')
}

export function DeleteModal({
  user,
  onCancel,
  onConfirm,
}: {
  user: UserRow
  onCancel: () => void
  onConfirm: () => void
}) {
  const dialogRef = useModalAccessibility<HTMLDivElement>(onCancel)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        ref={dialogRef}
        className={`modal ${styles.deleteModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
        tabIndex={-1}
      >
        <div className={styles.deleteModalIcon}>
          <Trash2 size={22} />
        </div>
        <div className="modal-header">
          <div>
            <div className={`eyebrow ${styles.deleteEyebrow}`}>УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ</div>
            <h2 id="delete-user-title">Удалить пользователя?</h2>
            <p>Пользователь «{user.fullName}» больше не сможет войти в систему.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onCancel}>
            Отмена
          </button>
          <button className={styles.dangerButton} type="button" onClick={onConfirm}>
            <Trash2 size={16} /> Удалить пользователя
          </button>
        </div>
      </div>
    </div>
  )
}

export function UserModal({
  mode,
  user,
  onClose,
  onSave,
}: {
  mode: 'create' | 'edit'
  user: UserRow | null
  onClose: () => void
  onSave: (values: UserFormValues) => void
}) {
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<string>(
    user?.role === UserRole.ADMIN
      ? USER_ROLE_LABELS[UserRole.ADMIN]
      : USER_ROLE_LABELS[UserRole.HEAD],
  )
  const [password, setPassword] = useState(generatePassword)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const dialogRef = useModalAccessibility<HTMLFormElement>(onClose)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({
      fullName,
      username,
      email,
      role: role === USER_ROLE_LABELS[UserRole.ADMIN] ? UserRole.ADMIN : UserRole.HEAD,
    })
  }
  const copyPassword = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
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
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        tabIndex={-1}
        onSubmit={submit}
      >
        <div className="modal-header">
          <div>
            <div className="eyebrow">АДМИНИСТРИРОВАНИЕ</div>
            <h2 id="user-modal-title">
              {mode === 'edit' ? 'Изменить пользователя' : 'Новый пользователь'}
            </h2>
            <p>
              {mode === 'edit'
                ? 'Обновите данные учётной записи'
                : 'Создайте учётную запись сотрудника'}
            </p>
          </div>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-fields">
          <label>
            ФИО сотрудника
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Например, Иван Петров"
              required
              autoFocus
            />
          </label>
          <label>
            Логин
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="i.petrov"
              required
            />
          </label>
          <label>
            Электронная почта
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="i.petrov@bntu.by"
              required
            />
          </label>
          <label>
            Роль
            <Select
              value={role}
              onChange={setRole}
              options={[
                { value: 'Руководитель', label: 'Руководитель' },
                { value: 'Администратор', label: 'Администратор' },
              ]}
            />
          </label>
          <div className="password-field">
            <label>
              {mode === 'edit' ? 'Новый временный пароль' : 'Временный пароль'}
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  aria-label="Показать или скрыть пароль"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button type="button" aria-label="Скопировать пароль" onClick={copyPassword}>
                  <Clipboard size={16} />
                </button>
              </div>
            </label>
            <button
              className="generate-button"
              type="button"
              onClick={() => {
                setPassword(generatePassword())
                setCopied(false)
              }}
            >
              <RefreshCw size={14} /> Сгенерировать новый
            </button>
            {copied && <small className="copied-message">Пароль скопирован</small>}
          </div>
        </div>
        <div className="password-hint">
          {mode === 'edit'
            ? 'Новый пароль будет выдан сотруднику отдельно.'
            : 'Пароль будет выдан сотруднику отдельно. При первом входе его можно будет изменить.'}
        </div>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>
            Отмена
          </button>
          <button className="primary" type="submit">
            {mode === 'edit' ? 'Сохранить изменения' : 'Создать пользователя'}
          </button>
        </div>
      </form>
    </div>
  )
}
