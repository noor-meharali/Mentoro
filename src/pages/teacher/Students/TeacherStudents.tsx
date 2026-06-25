import React, { useCallback, useEffect, useState } from 'react'
import { authService, getStudents, type StudentRecord } from '../../../services/authService'
import { useAuth } from '../../../hooks/useAuth'
import { useCourses } from '../../../hooks/useCourses'

// ── Helpers ───────────────────────────────────────────────────────────────────

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-300">
      {initials || 'ST'}
    </div>
  )
}

const StatusBadge: React.FC<{ status: StudentRecord['status'] }> = ({ status }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'Active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-500/15 text-slate-400'}`}>
    {status}
  </span>
)

// ── Modals ─────────────────────────────────────────────────────────────────────

interface CourseOption { id: string; title: string }

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:rounded-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button onClick={onClose} className="text-slate-400 transition hover:text-white text-xl leading-none">✕</button>
      </div>
      {children}
    </div>
  </div>
)

interface CreateStudentModalProps {
  teacherId: string
  onClose: () => void
  onCreated: () => void
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ teacherId, onClose, onCreated }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authService.createStudent(teacherId, name, username, password)
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"

  return (
    <Modal title="Create Student Account" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-slate-300">Full Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required /></label>
        <label className="block text-sm text-slate-300">Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls} required /></label>
        <label className="block text-sm text-slate-300">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} className={inputCls} required /></label>
        {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/5">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Student'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface EditStudentModalProps {
  student: StudentRecord
  onClose: () => void
  onUpdated: () => void
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onUpdated }) => {
  const [name, setName] = useState(student.name)
  const [username, setUsername] = useState(student.username)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'Active' | 'Inactive'>(student.status)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authService.updateStudent(student.id, { name, username, ...(password ? { password } : {}), status })
      onUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = "mt-2 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400"

  return (
    <Modal title="Edit Student Account" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-slate-300">Full Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required /></label>
        <label className="block text-sm text-slate-300">Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputCls} required /></label>
        <label className="block text-sm text-slate-300">New Password <span className="text-slate-500">(leave blank to keep current)</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className={inputCls} /></label>
        <div>
          <p className="text-sm text-slate-300 mb-2">Account Status</p>
          <div className="flex gap-3">
            {(['Active', 'Inactive'] as const).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition border ${status === s ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/5">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface AssignCoursesModalProps {
  student: StudentRecord
  courses: CourseOption[]
  onClose: () => void
  onUpdated: () => void
}

const AssignCoursesModal: React.FC<AssignCoursesModalProps> = ({ student, courses, onClose, onUpdated }) => {
  const [selected, setSelected] = useState<string[]>(student.assignedCourseIds)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const toggle = (courseId: string) => {
    setSelected((prev) => prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authService.assignCourses(student.id, selected)
      onUpdated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign courses.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Assign Courses – ${student.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {courses.length === 0 ? (
          <p className="text-sm text-slate-400">No published courses available. Publish a course first.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {courses.map((course) => {
              const isSelected = selected.includes(course.id)
              return (
                <button key={course.id} type="button" onClick={() => toggle(course.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${isSelected ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>
                  <span className={`h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center ${isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'}`}>
                    {isSelected && <span className="text-[10px] font-bold text-slate-950">✓</span>}
                  </span>
                  {course.title}
                </button>
              )
            })}
          </div>
        )}
        {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/5">Cancel</button>
          <button type="submit" disabled={submitting || courses.length === 0} className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Student card ──────────────────────────────────────────────────────────────

interface StudentCardProps {
  student: StudentRecord
  courses: CourseOption[]
  onEdit: (s: StudentRecord) => void
  onAssign: (s: StudentRecord) => void
  onDelete: (s: StudentRecord) => void
}

const StudentCard: React.FC<StudentCardProps> = ({ student, courses, onEdit, onAssign, onDelete }) => {
  const assignedTitles = courses.filter((c) => student.assignedCourseIds.includes(c.id)).map((c) => c.title)

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-slate-950/15 transition hover:border-cyan-500/25 sm:rounded-3xl sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <Avatar name={student.name} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-semibold text-white">{student.name}</h3>
              <StatusBadge status={student.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">@{student.username}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-500 mb-1.5">Assigned courses ({assignedTitles.length})</p>
        {assignedTitles.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {assignedTitles.map((title) => (
              <span key={title} className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300">{title}</span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-600 italic">No courses assigned yet</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onAssign(student)} className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20">
          Assign Courses
        </button>
        <button onClick={() => onEdit(student)} className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20">
          Edit
        </button>
        <button onClick={() => onDelete(student)} className="rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20">
          Delete
        </button>
      </div>
    </article>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TeacherStudents: React.FC = () => {
  const { user } = useAuth()
  const { teacherCourses, loadTeacherCourses } = useCourses()
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<StudentRecord | null>(null)
  const [assignTarget, setAssignTarget] = useState<StudentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<StudentRecord | null>(null)
  const [deleting, setDeleting] = useState(false)

  const publishedCourses: CourseOption[] = teacherCourses
    .filter((c) => c.published)
    .map((c) => ({ id: c.id, title: c.title }))

  const refreshStudents = useCallback(() => setStudents(getStudents()), [])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    refreshStudents()
    loadTeacherCourses()
    window.addEventListener('mentoro_students_changed', refreshStudents)
    return () => window.removeEventListener('mentoro_students_changed', refreshStudents)
  }, [refreshStudents, loadTeacherCourses])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await authService.deleteStudent(deleteTarget.id)
      refreshStudents()
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const activeCount = students.filter((s) => s.status === 'Active').length
  const inactiveCount = students.filter((s) => s.status === 'Inactive').length

  return (
    <div className="min-w-0 space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl shadow-slate-950/20 sm:rounded-3xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70 sm:text-sm sm:tracking-[0.35em]">
              Student workspace
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Student Management</h2>
            <p className="mt-3 text-slate-400">
              Create student accounts, assign courses, and manage access. Students cannot register themselves.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + Create Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Students', value: students.length, hint: 'All accounts' },
          { label: 'Active', value: activeCount, hint: 'Can log in' },
          { label: 'Inactive', value: inactiveCount, hint: 'Access suspended' },
        ].map(({ label, value, hint }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl sm:rounded-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{hint}</p>
          </div>
        ))}
      </div>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/75 px-6 py-12 text-center sm:rounded-3xl">
          <p className="text-lg font-semibold text-white">No students yet</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Create student accounts after payment confirmation. Students cannot register themselves.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Create First Student
          </button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              courses={publishedCourses}
              onEdit={setEditTarget}
              onAssign={setAssignTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreate && user && (
        <CreateStudentModal teacherId={user.id} onClose={() => setShowCreate(false)} onCreated={refreshStudents} />
      )}
      {editTarget && (
        <EditStudentModal student={editTarget} onClose={() => setEditTarget(null)} onUpdated={refreshStudents} />
      )}
      {assignTarget && (
        <AssignCoursesModal student={assignTarget} courses={publishedCourses} onClose={() => setAssignTarget(null)} onUpdated={refreshStudents} />
      )}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:rounded-3xl">
            <h3 className="text-lg font-semibold text-white">Delete Student?</h3>
            <p className="mt-2 text-sm text-slate-400">
              This will permanently delete <span className="font-medium text-white">{deleteTarget.name}</span>'s account. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-full border border-white/10 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/5">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherStudents
