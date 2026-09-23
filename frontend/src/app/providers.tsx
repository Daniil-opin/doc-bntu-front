import { createContext, type ReactNode, useContext, useState } from 'react'

import type { User } from '../shared/types'

const demoUser: User = {
  id: 1,
  fullName: 'Администратор системы',
  username: 'admin',
  email: 'admin@bntu.by',
  role: 'ADMIN',
  active: true,
}
const AuthContext = createContext<{
  user: User | null
  signIn: (username: string, password: string) => boolean
  updateProfile: (data: Pick<User, 'fullName' | 'username' | 'email'>) => void
  signOut: () => void
}>({ user: null, signIn: () => false, updateProfile: () => undefined, signOut: () => undefined })
export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem('bntu-auth') ? demoUser : null,
  )
  const signIn = (username: string, password: string) => {
    if (username && password) {
      localStorage.setItem('bntu-auth', '1')
      setUser({ ...demoUser, username })
      return true
    }
    return false
  }
  const updateProfile = (data: Pick<User, 'fullName' | 'username' | 'email'>) =>
    setUser((current) => (current ? { ...current, ...data } : current))
  const signOut = () => {
    localStorage.removeItem('bntu-auth')
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{ user, signIn, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
