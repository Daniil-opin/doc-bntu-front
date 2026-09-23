import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { ApplicationPage } from '../pages/ApplicationPage'
import { ApplicationsPage } from '../pages/ApplicationsPage'
import { AuditPage } from '../pages/AuditPage'
import { DataTransferPage } from '../pages/DataTransferPage'
import { LoginPage } from '../pages/LoginPage'
import { OrganizationPage } from '../pages/OrganizationPage'
import { OrganizationsPage } from '../pages/OrganizationsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { UsersPage } from '../pages/UsersPage'
import { AppShell } from '../shared/ui/AppShell'
import { useAuth } from './providers'

function Protected() {
  const { user } = useAuth()
  return user ? (
    <AppShell>
      <Outlet />
    </AppShell>
  ) : (
    <Navigate to="/login" replace />
  )
}
export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
