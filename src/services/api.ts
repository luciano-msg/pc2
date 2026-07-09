import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { Course } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getCourses = async (page = 0, size = 10) => {
  const res = await api.get('/courses', { params: { page, size } })
  return {
    items: res.data.content,
    totalPages: res.data.totalPages
  }
}

export const getCourseById = async (id: number): Promise<Course> => {
  const res = await api.get(`/courses/${id}`)
  return res.data
}

export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const res = await api.post('/courses', course)
  return res.data
}

export const updateCourse = async (id: number, course: Omit<Course, 'id'>): Promise<Course> => {
  const res = await api.put(`/courses/${id}`, course)
  return res.data
}

export const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/courses/${id}`)
}
