import { createContext } from 'react'

export interface UserProfile {
  id: string
  name: string
  username: string
  role: 'teacher' | 'student'
}

export interface AuthContextValue {
  user: UserProfile | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<UserProfile>
  logout: () => void
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
