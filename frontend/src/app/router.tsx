import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { AppShell } from '../shared/ui/AppShell'
import { useAuth } from './providers'

const ApplicationPage = lazy(() =>
  import('../pages/ApplicationPage').then((module) => ({ default: module.ApplicationPage })),
)
const ApplicationsPage = lazy(() =>
  import('../pages/ApplicationsPage').then((module) => ({ default: module.ApplicationsPage })),
)
const AuditPage = lazy(() =>
  import('../pages/AuditPage').then((module) => ({ default: module.AuditPage })),
)
const DataTransferPage = lazy(() =>
  import('../pages/DataTransferPage').then((module) => ({ default: module.DataTransferPage })),
)
const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)
const OrganizationPage = lazy(() =>
  import('../pages/OrganizationPage').then((module) => ({ default: module.OrganizationPage })),
)
const OrganizationsPage = lazy(() =>
  import('../pages/OrganizationsPage').then((module) => ({ default: module.OrganizationsPage })),
)
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)
const UsersPage = lazy(() =>
  import('../pages/UsersPage').then((module) => ({ default: module.UsersPage })),
)

function PageFallback() {
  return (
    <div className="page-loading" role="status">
      Загрузка страницы…
    </div>
  )
}

function Protected() {
  const { user } = useAuth()
  return user ? (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </AppShell>
  ) : (
    <Navigate to="/login" replace />
  )
}
export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<PageFallback />}>
            <LoginPage />
          </Suspense>
        }
      />
      <Route element={<Protected />}>
        <Route index element={<OrganizationsPage />} />
        <Route path="organizations/:id" element={<OrganizationPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="data" element={<DataTransferPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
