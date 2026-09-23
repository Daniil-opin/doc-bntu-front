import { FormEvent, useState } from 'react'
import { Clipboard, Eye, EyeOff, Plus, RefreshCw, ShieldCheck, Trash2, X } from 'lucide-react'
import { PageHeader } from '../shared/ui/PageHeader'
import { DataTable } from '../shared/ui/DataTable'
import { Select } from '../shared/ui/Select'

type UserRole = 'Администратор' | 'Руководитель'
type UserRow = { id: number; fullName: string; username: string; email: string; role: UserRole }
const initialUsers: UserRow[] = [{ id: 1, fullName: 'Алексей Иванов', username: 'a.ivanov', email: 'a.ivanov@bntu.by', role: 'Администратор' }, { id: 2, fullName: 'Мария Соколова', username: 'm.sokolova', email: 'm.sokolova@bntu.by', role: 'Руководитель' }]
function generatePassword() { const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'; return Array.from({ length: 12 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('') }

type FormValues = Omit<UserRow, 'id'>

export function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [editingUser, setEditingUser] = useState<UserRow | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null)
  const [isCreateOpen, setCreateOpen] = useState(false)

  const openCreate = () => setCreateOpen(true)
  const closeModal = () => { setCreateOpen(false); setEditingUser(null) }
  const saveUser = (values: FormValues) => {
    if (editingUser) setUsers(current => current.map(user => user.id === editingUser.id ? { ...editingUser, ...values } : user))
    else setUsers(current => [...current, { id: Date.now(), ...values }])
    closeModal()
  }
  const deleteUser = (user: UserRow) => {
    const isLastAdministrator = user.role === 'Администратор' && users.filter(item => item.role === 'Администратор').length === 1
    if (isLastAdministrator) return
    setDeletingUser(user)
  }
  const confirmDelete = () => { if (deletingUser) setUsers(current => current.filter(item => item.id !== deletingUser.id)); setDeletingUser(null) }

  return <><PageHeader eyebrow="АДМИНИСТРИРОВАНИЕ" title="Пользователи" description="Управление доступом сотрудников к системе" action={<button className="primary" onClick={openCreate}><Plus size={17} /> Добавить пользователя</button>} /><DataTable columns={['Сотрудник', 'Логин', 'Электронная почта', 'Роль', 'Статус', '']} rows={users.map(user => { const isLastAdministrator = user.role === 'Администратор' && users.filter(item => item.role === 'Администратор').length === 1; return [<strong>{user.fullName}</strong>, user.username, user.email, <span className="role">{user.role === 'Администратор' && <ShieldCheck size={15} />} {user.role}</span>, <span className="active-dot">Активен</span>, <span className="user-actions"><button className="row-action" onClick={() => setEditingUser(user)}>Изменить</button><button className="delete-action" disabled={isLastAdministrator} title={isLastAdministrator ? 'Нельзя удалить единственного администратора' : 'Удалить пользователя'} aria-label={isLastAdministrator ? 'Удаление заблокировано' : 'Удалить пользователя'} onClick={() => deleteUser(user)}><Trash2 size={16} /></button></span>] })} />{(isCreateOpen || editingUser) && <UserModal mode={editingUser ? 'edit' : 'create'} user={editingUser} onClose={closeModal} onSave={saveUser} />}{deletingUser && <DeleteModal user={deletingUser} onCancel={() => setDeletingUser(null)} onConfirm={confirmDelete} />}</>
}

function DeleteModal({ user, onCancel, onConfirm }: { user: UserRow; onCancel: () => void; onConfirm: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onCancel() }}><div className="modal delete-modal"><div className="delete-modal-icon"><Trash2 size={22} /></div><div className="modal-header"><div><div className="eyebrow delete-eyebrow">УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ</div><h2>Удалить пользователя?</h2><p>Пользователь «{user.fullName}» больше не сможет войти в систему.</p></div><button className="icon-button" type="button" aria-label="Закрыть" onClick={onCancel}><X size={18} /></button></div><div className="modal-actions"><button className="secondary" type="button" onClick={onCancel}>Отмена</button><button className="danger-button" type="button" onClick={onConfirm}><Trash2 size={16} /> Удалить пользователя</button></div></div></div>
}

function UserModal({ mode, user, onClose, onSave }: { mode: 'create' | 'edit'; user: UserRow | null; onClose: () => void; onSave: (values: FormValues) => void }) {
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<UserRole>(user?.role ?? 'Руководитель')
  const [password, setPassword] = useState(generatePassword)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); onSave({ fullName, username, email, role }) }
  const copyPassword = async () => { await navigator.clipboard.writeText(password); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><form className="modal" onSubmit={submit}><div className="modal-header"><div><div className="eyebrow">АДМИНИСТРИРОВАНИЕ</div><h2>{mode === 'edit' ? 'Изменить пользователя' : 'Новый пользователь'}</h2><p>{mode === 'edit' ? 'Обновите данные учётной записи' : 'Создайте учётную запись сотрудника'}</p></div><button className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}><X size={18} /></button></div><div className="modal-fields"><label>ФИО сотрудника<input value={fullName} onChange={event => setFullName(event.target.value)} placeholder="Например, Иван Петров" required autoFocus /></label><label>Логин<input value={username} onChange={event => setUsername(event.target.value)} placeholder="i.petrov" required /></label><label>Электронная почта<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="i.petrov@bntu.by" required /></label><label>Роль<Select value={role} onChange={setRole} options={[{ value: 'Руководитель', label: 'Руководитель' }, { value: 'Администратор', label: 'Администратор' }]} /></label><div className="password-field"><label>{mode === 'edit' ? 'Новый временный пароль' : 'Временный пароль'}<div className="password-input"><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} minLength={8} required /><button type="button" aria-label="Показать или скрыть пароль" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button><button type="button" aria-label="Скопировать пароль" onClick={copyPassword}><Clipboard size={16} /></button></div></label><button className="generate-button" type="button" onClick={() => { setPassword(generatePassword()); setCopied(false) }}><RefreshCw size={14} /> Сгенерировать новый</button>{copied && <small className="copied-message">Пароль скопирован</small>}</div></div><div className="password-hint">{mode === 'edit' ? 'Новый пароль будет выдан сотруднику отдельно.' : 'Пароль будет выдан сотруднику отдельно. При первом входе его можно будет изменить.'}</div><div className="modal-actions"><button className="secondary" type="button" onClick={onClose}>Отмена</button><button className="primary" type="submit">{mode === 'edit' ? 'Сохранить изменения' : 'Создать пользователя'}</button></div></form></div>
}
