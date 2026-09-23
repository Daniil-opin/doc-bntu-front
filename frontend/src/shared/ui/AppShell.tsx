import { FileText, LayoutDashboard, LogOut, ScrollText, Users, Building2, ClipboardList, ArrowDownUp, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import { useAuth } from '../../app/providers'

const links = [{ to: '/', label: 'Организации', icon: Building2 }, { to: '/applications', label: 'Заявки', icon: ClipboardList }, { to: '/data', label: 'Импорт и экспорт', icon: ArrowDownUp }, { to: '/audit', label: 'Журнал событий', icon: ScrollText }, { to: '/users', label: 'Пользователи', icon: Users }, { to: '/settings', label: 'Настройки', icon: Settings }]
export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}><aside className="sidebar"><button className="logo" type="button" onClick={() => setCollapsed(current => !current)} aria-label={collapsed ? 'Показать меню' : 'Скрыть меню'}><span className="logo-mark"><FileText size={18} /></span><span>КАДРОВЫЙ<br /><b>ЗАКАЗ</b></span></button><div className="workspace-label">РАБОЧЕЕ ПРОСТРАНСТВО</div><nav>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setCollapsed(true)}><Icon size={18} /><span>{label}</span></NavLink>)}</nav><div className="sidebar-bottom"><div className="connection"><span /> API подключен</div><button className="user-menu" onClick={signOut} title="Выйти из аккаунта" aria-label="Выйти из аккаунта"><span className="avatar">{user?.fullName.slice(0, 1)}</span><span><b>{user?.fullName}</b><small>{user?.role === 'ADMIN' ? 'Администратор' : 'Руководитель'}</small></span><LogOut size={16} /></button></div></aside><main className="main-content" onMouseDown={() => { if (!collapsed) setCollapsed(true) }}><header className="topbar"><div className="breadcrumb"><LayoutDashboard size={16} /> БНТУ <span>/</span> Управление</div><div className="topbar-date">22 сентября 2026</div></header><section className="content">{children}</section></main></div>
}
