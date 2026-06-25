import type { CourseSummary } from '../context/course-context'
import { progressService } from './progressService'
import { getStudents, type StudentRecord } from './authService'

const COURSES_KEY = 'mentoro_courses'
const PROGRESS_KEY = 'mentoro_progress_records'
const PROFILE_KEY = 'mentoro_profile_'

const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export interface TeacherStudentRow {
  id: string
  studentId: string
  studentName: string
  username: string
  avatarBase64: string | null
  courseId: string
  courseTitle: string
  moduleAssigned: string
  enrollmentTimestamp: string
  status: 'Active' | 'Pending' | 'Completed' | 'Inactive'
  progressPercent: number
  videoWatchedPercent: number
  assignmentsSubmitted: number
  assignmentsTotal: number
  quizzesCompleted: number
  quizzesTotal: number
  lastActiveAt: string | null
  assignmentProgressLabel: string
}

export interface TeacherStudentSnapshot {
  rows: TeacherStudentRow[]
  activeCount: number
  pendingCount: number
  completedCount: number
  averageProgress: number
}

const getPublishedCourses = () =>
  safeParse<CourseSummary[]>(COURSES_KEY, []).filter((course) => course.published)

const getProfile = (studentId: string) =>
  safeParse<{ avatarBase64: string | null }>(PROFILE_KEY + studentId, { avatarBase64: null })

const getLastActive = (course: CourseSummary, studentId: string) => {
  const record = progressService.getRecord(studentId, course.id)
  const lastLesson = Object.values(record.lessons).sort(
    (a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
  )[0]
  return lastLesson?.lastAccessedAt ?? record.activities[0]?.createdAt ?? null
}

const isRecentlyActive = (value: string | null) => {
  if (!value) return false
  return Date.now() - new Date(value).getTime() < 1000 * 60 * 60 * 24 * 7
}

const getModuleAssigned = (course: CourseSummary, studentId: string) => {
  const summary = progressService.summarizeCourse(course, studentId)
  const activeLesson = summary.lastAccessedLessonId
    ? course.videos.find((video) => video.id === summary.lastAccessedLessonId)
    : course.videos[0]
  return activeLesson?.title ?? 'Course overview'
}

const getStatus = (student: StudentRecord, progressPercent: number, lastActiveAt: string | null): TeacherStudentRow['status'] => {
  if (student.status === 'Inactive') return 'Inactive'
  if (progressPercent >= 100) return 'Completed'
  if (isRecentlyActive(lastActiveAt)) return 'Active'
  if (lastActiveAt) return 'Inactive'
  return 'Pending'
}

const readRows = (): TeacherStudentRow[] => {
  const students = getStudents()
  const allCourses = getPublishedCourses()

  return students.flatMap((student): TeacherStudentRow[] => {
    const assignedCourses = allCourses.filter((c) => student.assignedCourseIds.includes(c.id))
    if (assignedCourses.length === 0) {
      // Show student with no course assignment
      return [{
        id: `${student.id}:none`,
        studentId: student.id,
        studentName: student.name,
        username: student.username,
        avatarBase64: getProfile(student.id).avatarBase64,
        courseId: '',
        courseTitle: 'No course assigned',
        moduleAssigned: '—',
        enrollmentTimestamp: new Date(Number(student.id.replace('s_', ''))).toISOString(),
        status: student.status === 'Inactive' ? 'Inactive' : 'Pending',
        progressPercent: 0,
        videoWatchedPercent: 0,
        assignmentsSubmitted: 0,
        assignmentsTotal: 0,
        quizzesCompleted: 0,
        quizzesTotal: 0,
        lastActiveAt: null,
        assignmentProgressLabel: '0/0 submitted',
      }]
    }

    return assignedCourses.map((course) => {
      const summary = progressService.summarizeCourse(course, student.id)
      const lastActiveAt = getLastActive(course, student.id)
      const status = getStatus(student, summary.percent, lastActiveAt)
      return {
        id: `${student.id}:${course.id}`,
        studentId: student.id,
        studentName: student.name,
        username: student.username,
        avatarBase64: getProfile(student.id).avatarBase64,
        courseId: course.id,
        courseTitle: course.title,
        moduleAssigned: getModuleAssigned(course, student.id),
        enrollmentTimestamp: new Date(Number(student.id.replace('s_', ''))).toISOString(),
        status,
        progressPercent: summary.percent,
        videoWatchedPercent: summary.videosPercent,
        assignmentsSubmitted: summary.submittedAssignments,
        assignmentsTotal: summary.totalAssignments,
        quizzesCompleted: summary.completedQuizzes,
        quizzesTotal: summary.totalQuizzes,
        lastActiveAt,
        assignmentProgressLabel: `${summary.submittedAssignments}/${summary.totalAssignments} submitted`,
      }
    })
  })
}

const CHANNEL_NAME = 'mentoro_teacher_students_changed'

export const teacherStudentService = {
  subscribe: (onChange: () => void) => {
    let channel: BroadcastChannel | null = null
    try {
      channel = new BroadcastChannel(CHANNEL_NAME)
      channel.onmessage = onChange
    } catch {
      channel = null
    }

    const localHandler = () => onChange()
    const storageHandler = (event: StorageEvent) => {
      if (event.key === 'mentoro_students' || event.key === COURSES_KEY || event.key === PROGRESS_KEY || event.key?.startsWith(PROFILE_KEY)) {
        onChange()
      }
    }

    window.addEventListener(CHANNEL_NAME, localHandler)
    window.addEventListener('storage', storageHandler)
    window.addEventListener('mentoro_students_changed', localHandler)
    window.addEventListener('mentoro_progress_changed', localHandler)

    return () => {
      channel?.close()
      window.removeEventListener(CHANNEL_NAME, localHandler)
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('mentoro_students_changed', localHandler)
      window.removeEventListener('mentoro_progress_changed', localHandler)
    }
  },

  fetchSnapshot: async (): Promise<TeacherStudentSnapshot> => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const rows = readRows()
    return {
      rows,
      activeCount: rows.filter((row) => row.status === 'Active').length,
      pendingCount: rows.filter((row) => row.status === 'Pending').length,
      completedCount: rows.filter((row) => row.status === 'Completed').length,
      averageProgress: rows.length
        ? Math.round(rows.reduce((sum, row) => sum + row.progressPercent, 0) / rows.length)
        : 0,
    }
  },
}
