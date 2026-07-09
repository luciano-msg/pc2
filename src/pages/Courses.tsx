import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Course } from '../types'
import { getCourses, deleteCourse } from '../services/api'

function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    const { items, totalPages } = await getCourses(page, 10)
    setCourses(items)
    setTotalPages(totalPages)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [page])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este curso?')) return
    await deleteCourse(id)
    setCourses(courses.filter(c => c.id !== id))
  }

  const getBadge = (status: string) => {
    if (status === 'APROBADO') return 'bg-green-100 text-green-700'
    if (status === 'EN_CURSO') return 'bg-blue-100 text-blue-700'
    if (status === 'DESAPROBADO') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getLabel = (status: string) => {
    if (status === 'APROBADO') return 'Aprobado'
    if (status === 'EN_CURSO') return 'En curso'
    if (status === 'DESAPROBADO') return 'Desaprobado'
    return status
  }

  if (loading) return <p className="p-8 text-gray-500">Cargando cursos...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Cursos</h1>
        <button
          onClick={() => navigate('/courses/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo curso
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-400">No tienes cursos aún.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {courses.map(course => (
            <div key={course.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{course.name}</p>
                <p className="text-sm text-gray-500">Código: {course.code}</p>
                <p className="text-sm text-gray-500">Créditos: {course.credits}</p>
                <p className="text-sm text-gray-500">Nota: {course.grade}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${getBadge(course.status)}`}>
                  {getLabel(course.status)}
                </span>
              
                <button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-3 mt-6">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-40">
          Anterior
        </button>
        <span className="px-4 py-2 text-gray-600">Página {page + 1} de {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-40">
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default Courses