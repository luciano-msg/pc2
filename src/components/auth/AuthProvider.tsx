import { createContext, useState } from 'react'
import axios from 'axios'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { AuthContextType, User } from '../../types'

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage('token', '')
  const [user, setUser] = useState<User | null>(null)

  const login = async (username: string, password: string) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { username, password }
    )
    setToken(res.data.token)
  }

  const register = async (username: string, email: string, password: string, fullName: string) => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      { username, email, password, fullName }
    )
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{
      token, user, login, register, logout, isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}
