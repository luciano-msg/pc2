import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCourseById, updateCourse } from '../services/api'

function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [credits, setCredits] = useState(0)
  const [grade, setGrade] = useState(0)
  const [status, setStatus] = useState('EN_CURSO')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCourseById(Number(id)).then(course => {
      setName(course.name)
      setCode(course.code)
      setCredits(course.credits)
      setGrade(course.grade)
      setStatus(course.status)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateCourse(Number(id), { name, code, credits, grade, status })
      navigate('/courses')
    } catch {
      setError('Error al actualizar el curso.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-8 text-gray-500">Cargando curso...</p>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Curso</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Nombre del curso</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1" required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Código</label>
          <input value={code} onChange={e => setCode(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1" required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Créditos</label>
          <input type="number" value={credits} onChange={e => setCredits(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 mt-1" min={0} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Nota (0-20)</label>
          <input type="number" value={grade} onChange={e => setGrade(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 mt-1" min={0} max={20} required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1">
            <option value="EN_CURSO">En curso</option>
            <option value="APROBADO">Aprobado</option>
            <option value="DESAPROBADO">Desaprobado</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3 mt-2">
          <button type="button" onClick={() => navigate('/courses')}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCourse
