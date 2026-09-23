import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'

import {
  DeleteModal,
  type UserFormValues,
  UserModal,
  type UserRow,
} from '../components/users/UserModals'
import { USER_ROLE_LABELS, UserRole } from '../shared/types'
import { DataTable } from '../shared/ui/DataTable'
import { PageHeader } from '../shared/ui/PageHeader'
import styles from './UsersPage.module.css'

const initialUsers: UserRow[] = [
  {
    id: 1,
    fullName: 'Алексей Иванов',
    username: 'a.ivanov',
    email: 'a.ivanov@bntu.by',
    role: UserRole.ADMIN,
  },
  {
    id: 2,
    fullName: 'Мария Соколова',
    username: 'm.sokolova',
    email: 'm.sokolova@bntu.by',
    role: UserRole.HEAD,
  },
]

export function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [editingUser, setEditingUser] = useState<UserRow | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null)
  const [isCreateOpen, setCreateOpen] = useState(false)

  const closeModal = () => {
    setCreateOpen(false)
    setEditingUser(null)
  }
  const saveUser = (values: UserFormValues) => {
    if (editingUser)
      setUsers((current) =>
        current.map((user) => (user.id === editingUser.id ? { ...editingUser, ...values } : user)),
      )
    else setUsers((current) => [...current, { id: Date.now(), ...values }])
    closeModal()
  }
  const deleteUser = (user: UserRow) => {
    const isLastAdministrator =
      user.role === UserRole.ADMIN &&
      users.filter((item) => item.role === UserRole.ADMIN).length === 1
    if (!isLastAdministrator) setDeletingUser(user)
  }
  const confirmDelete = () => {
    if (deletingUser) setUsers((current) => current.filter((item) => item.id !== deletingUser.id))
    setDeletingUser(null)
  }

  return (
    <>
      <PageHeader
        eyebrow="АДМИНИСТРИРОВАНИЕ"
        title="Пользователи"
        description="Управление доступом сотрудников к системе"
        action={
          <button className="primary" onClick={() => setCreateOpen(true)}>
            <Plus size={17} /> Добавить пользователя
          </button>
        }
      />
      <DataTable
        columns={['Сотрудник', 'Логин', 'Электронная почта', 'Роль', 'Статус', '']}
        rows={users.map((user) => {
          const isLastAdministrator =
            user.role === UserRole.ADMIN &&
            users.filter((item) => item.role === UserRole.ADMIN).length === 1
          return [
            <strong key="name">{user.fullName}</strong>,
            user.username,
            user.email,
            <span className="role" key="role">
              {user.role === UserRole.ADMIN && <ShieldCheck size={15} />}{' '}
              {USER_ROLE_LABELS[user.role]}
            </span>,
            <span className="active-dot" key="status">
              Активен
            </span>,
            <span className={styles.actions} key="actions">
              <button className="row-action" onClick={() => setEditingUser(user)}>
                Изменить
              </button>
              <button
                className={styles.deleteAction}
                disabled={isLastAdministrator}
                title={
                  isLastAdministrator
                    ? 'Нельзя удалить единственного администратора'
                    : 'Удалить пользователя'
                }
                aria-label={isLastAdministrator ? 'Удаление заблокировано' : 'Удалить пользователя'}
                onClick={() => deleteUser(user)}
              >
                <Trash2 size={16} />
              </button>
            </span>,
          ]
        })}
      />
      {(isCreateOpen || editingUser) && (
        <UserModal
          mode={editingUser ? 'edit' : 'create'}
          user={editingUser}
          onClose={closeModal}
          onSave={saveUser}
        />
      )}
      {deletingUser && (
        <DeleteModal
          user={deletingUser}
          onCancel={() => setDeletingUser(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  )
}
