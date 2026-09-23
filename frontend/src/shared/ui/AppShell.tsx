import {
  ArrowDownUp,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  Users,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../app/providers'
import { checkApiHealth } from '../api/client'

const links = [
  { to: '/', label: 'Организации', icon: Building2 },
  { to: '/applications', label: 'Заявки', icon: ClipboardList },
  { to: '/data', label: 'Импорт и экспорт', icon: ArrowDownUp },
  { to: '/audit', label: 'Журнал событий', icon: ScrollText },
  { to: '/users', label: 'Пользователи', icon: Users },
  { to: '/settings', label: 'Настройки', icon: Settings },
]
export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'unavailable'>('checking')
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    [],
  )

  useEffect(() => {
    let activeController: AbortController | null = null

    const updateApiStatus = async () => {
      activeController?.abort()
      const controller = new AbortController()
      activeController = controller
      const timeout = window.setTimeout(() => controller.abort(), 5000)
      const isAvailable = await checkApiHealth(controller.signal)
      window.clearTimeout(timeout)
      if (activeController === controller) {
        setApiStatus(isAvailable ? 'connected' : 'unavailable')
      }
    }

    void updateApiStatus()
    const interval = window.setInterval(updateApiStatus, 30_000)
    window.addEventListener('online', updateApiStatus)
    window.addEventListener('offline', updateApiStatus)

    return () => {
      activeController?.abort()
      activeController = null
      window.clearInterval(interval)
      window.removeEventListener('online', updateApiStatus)
      window.removeEventListener('offline', updateApiStatus)
    }
  }, [])

  const apiStatusLabel = {
    checking: 'Проверка API…',
    connected: 'API подключен',
    unavailable: 'API недоступен',
  }[apiStatus]

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <button
          className="logo"
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? 'Показать меню' : 'Скрыть меню'}
        >
          <span className="logo-mark">
            <FileText size={18} />
          </span>
          <span>
            КАДРОВЫЙ
            <br />
            <b>ЗАКАЗ</b>
          </span>
        </button>
        <div className="workspace-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setCollapsed(true)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className={`connection connection-${apiStatus}`} role="status" aria-live="polite">
            <span /> {apiStatusLabel}
          </div>
          <button
            className="user-menu"
            onClick={signOut}
            title="Выйти из аккаунта"
            aria-label="Выйти из аккаунта"
          >
            <span className="avatar">{user?.fullName.slice(0, 1)}</span>
            <span>
              <b>{user?.fullName}</b>
              <small>{user?.role === 'ADMIN' ? 'Администратор' : 'Руководитель'}</small>
            </span>
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <main
        className="main-content"
        onMouseDown={() => {
          if (!collapsed) setCollapsed(true)
        }}
      >
        <header className="topbar">
          <div className="breadcrumb">
            <LayoutDashboard size={16} /> БНТУ <span>/</span> Управление
          </div>
          <div className="topbar-date">{currentDate}</div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  )
}
