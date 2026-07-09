export interface User {
  id: number
  email: string
  username: string
  fullName: string
}

export interface AuthContextType {
  token: string
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export interface Course {
  id: number
  name: string
  code: string
  credits: number
  grade: number
  status: string
}
