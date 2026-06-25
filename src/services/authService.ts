// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthPayload {
  id: string
  name: string
  username: string
  role: 'teacher' | 'student'
  assignedCourseIds?: string[]  // students only
  createdByTeacherId?: string   // students only
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
export const TEACHERS_KEY = 'mentoro_teachers'
export const STUDENTS_KEY = 'mentoro_students'

export interface TeacherRecord {
  id: string
  name: string
  username: string
  passwordHash: string
  role: 'teacher'
}

export interface StudentRecord {
  id: string
  name: string
  username: string
  passwordHash: string
  role: 'student'
  assignedCourseIds: string[]
  createdByTeacherId: string
  status: 'Active' | 'Inactive'
}

// ─── Simple hash (demo – not cryptographic, just obfuscation for localStorage) ─
const hashPassword = (password: string): string => {
  let h = 0
  for (let i = 0; i < password.length; i++) {
    h = (Math.imul(31, h) + password.charCodeAt(i)) | 0
  }
  return `$mhash$${h}$${password.length}`
}

const verifyPassword = (password: string, hash: string): boolean => {
  if (!hash.startsWith('$mhash$')) return false
  return hashPassword(password) === hash
}

// ─── Persistence helpers ──────────────────────────────────────────────────────
const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const getTeachers = (): TeacherRecord[] => safeParse<TeacherRecord[]>(TEACHERS_KEY, [])
export const getStudents = (): StudentRecord[] => safeParse<StudentRecord[]>(STUDENTS_KEY, [])

const saveTeachers = (teachers: TeacherRecord[]) =>
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers))

const saveStudents = (students: StudentRecord[]) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  window.dispatchEvent(new CustomEvent('mentoro_students_changed'))
}

// ─── Seed default teacher if none exists ──────────────────────────────────────
const ensureSeedTeacher = () => {
  const teachers = getTeachers()
  if (teachers.length === 0) {
    saveTeachers([
      {
        id: 't_seed',
        name: 'Avery Hart',
        username: 'teacher',
        passwordHash: hashPassword('teacher123'),
        role: 'teacher',
      },
    ])
  }
}

// ─── Auth service ─────────────────────────────────────────────────────────────
export const authService = {
  login: async (username: string, password: string): Promise<AuthPayload> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    ensureSeedTeacher()

    if (!username.trim() || !password.trim()) {
      throw new Error('Username and password are required.')
    }

    const uname = username.trim().toLowerCase()

    // Check teachers first
    const teachers = getTeachers()
    const teacher = teachers.find((t) => t.username.toLowerCase() === uname)
    if (teacher) {
      if (!verifyPassword(password, teacher.passwordHash)) {
        throw new Error('Incorrect password.')
      }
      return { id: teacher.id, name: teacher.name, username: teacher.username, role: 'teacher' }
    }

    // Check students
    const students = getStudents()
    const student = students.find((s) => s.username.toLowerCase() === uname)
    if (student) {
      if (student.status === 'Inactive') {
        throw new Error('Your account has been deactivated. Contact your teacher.')
      }
      if (!verifyPassword(password, student.passwordHash)) {
        throw new Error('Incorrect password.')
      }
      return {
        id: student.id,
        name: student.name,
        username: student.username,
        role: 'student',
        assignedCourseIds: student.assignedCourseIds,
        createdByTeacherId: student.createdByTeacherId,
      }
    }

    throw new Error('No account found with that username.')
  },

  registerTeacher: async (name: string, username: string, password: string): Promise<AuthPayload> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    ensureSeedTeacher()

    if (!name.trim() || !username.trim() || !password.trim()) {
      throw new Error('All fields are required.')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }

    const uname = username.trim().toLowerCase()
    const teachers = getTeachers()
    const students = getStudents()

    if (teachers.some((t) => t.username.toLowerCase() === uname) ||
        students.some((s) => s.username.toLowerCase() === uname)) {
      throw new Error('That username is already taken.')
    }

    const newTeacher: TeacherRecord = {
      id: `t_${Date.now()}`,
      name: name.trim(),
      username: uname,
      passwordHash: hashPassword(password),
      role: 'teacher',
    }

    saveTeachers([...teachers, newTeacher])
    return { id: newTeacher.id, name: newTeacher.name, username: newTeacher.username, role: 'teacher' }
  },

  // Teacher creates a student account
  createStudent: async (
    teacherId: string,
    name: string,
    username: string,
    password: string
  ): Promise<StudentRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 200))

    if (!name.trim() || !username.trim() || !password.trim()) {
      throw new Error('All fields are required.')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }

    const uname = username.trim().toLowerCase()
    const teachers = getTeachers()
    const students = getStudents()

    if (teachers.some((t) => t.username.toLowerCase() === uname) ||
        students.some((s) => s.username.toLowerCase() === uname)) {
      throw new Error('That username is already taken.')
    }

    const newStudent: StudentRecord = {
      id: `s_${Date.now()}`,
      name: name.trim(),
      username: uname,
      passwordHash: hashPassword(password),
      role: 'student',
      assignedCourseIds: [],
      createdByTeacherId: teacherId,
      status: 'Active',
    }

    saveStudents([...students, newStudent])
    return newStudent
  },

  updateStudent: async (
    studentId: string,
    updates: { name?: string; username?: string; password?: string; status?: 'Active' | 'Inactive' }
  ): Promise<StudentRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const students = getStudents()
    const idx = students.findIndex((s) => s.id === studentId)
    if (idx === -1) throw new Error('Student not found.')

    if (updates.username) {
      const uname = updates.username.trim().toLowerCase()
      const teachers = getTeachers()
      const conflict = students.some((s, i) => i !== idx && s.username.toLowerCase() === uname) ||
        teachers.some((t) => t.username.toLowerCase() === uname)
      if (conflict) throw new Error('That username is already taken.')
    }

    const updated: StudentRecord = {
      ...students[idx],
      ...(updates.name ? { name: updates.name.trim() } : {}),
      ...(updates.username ? { username: updates.username.trim().toLowerCase() } : {}),
      ...(updates.password ? { passwordHash: hashPassword(updates.password) } : {}),
      ...(updates.status ? { status: updates.status } : {}),
    }

    const newStudents = [...students]
    newStudents[idx] = updated
    saveStudents(newStudents)
    return updated
  },

  deleteStudent: async (studentId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const students = getStudents()
    saveStudents(students.filter((s) => s.id !== studentId))
  },

  assignCourses: async (studentId: string, courseIds: string[]): Promise<StudentRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const students = getStudents()
    const idx = students.findIndex((s) => s.id === studentId)
    if (idx === -1) throw new Error('Student not found.')

    const updated = { ...students[idx], assignedCourseIds: courseIds }
    const newStudents = [...students]
    newStudents[idx] = updated
    saveStudents(newStudents)
    return updated
  },

  // Refresh student assignments (called after login to get latest assigned courses)
  getStudentAssignedCourses: (studentId: string): string[] => {
    const students = getStudents()
    return students.find((s) => s.id === studentId)?.assignedCourseIds ?? []
  },
}
