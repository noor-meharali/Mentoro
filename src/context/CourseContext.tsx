import React, { useCallback, useMemo, useState } from 'react'
import { courseService } from '../services/courseService'
import { authService } from '../services/authService'
import { CourseContext, type CourseSummary } from './course-context'
import { useAuth } from '../hooks/useAuth'

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use AuthContext so studentCourses recomputes when user changes
  const { user } = useAuth()

  const teacherCourses = courses

  // Students only see courses explicitly assigned to them
  const studentCourses = useMemo(() => {
    if (!user || user.role !== 'student') return []
    const assignedIds = authService.getStudentAssignedCourses(user.id)
    return courses.filter((c) => c.published && assignedIds.includes(c.id))
  }, [courses, user])

  const loadTeacherCourses = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await courseService.fetchAll()
      setCourses(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load courses.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStudentCourses = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await courseService.fetchAll()
      setCourses(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load courses.')
    } finally {
      setLoading(false)
    }
  }, [])

  const selectCourse = useCallback((id: string) => {
    setCourses((prev) => {
      const found = prev.find((c) => c.id === id) ?? null
      setSelectedCourse(found)
      return prev
    })
  }, [])

  const createCourse = useCallback(async (title: string, category: string) => {
    setLoading(true)
    try {
      const newCourse = await courseService.create(title, category)
      setCourses((prev) => [...prev, newCourse])
      return newCourse
    } finally { setLoading(false) }
  }, [])

  const togglePublish = useCallback((id: string) => {
    const updated = courseService.togglePublish(id)
    setCourses(updated)
  }, [])

  const deleteCourse = useCallback((id: string) => {
    const updated = courseService.delete(id)
    setCourses(updated)
    setSelectedCourse((prev) => (prev?.id === id ? null : prev))
  }, [])

  // ── Videos ──────────────────────────────────────────────────────────────────
  const addVideo = useCallback(async (courseId: string, title: string, file: File) => {
    setLoading(true)
    try {
      const updated = await courseService.addVideo(courseId, title, file)
      setCourses(updated)
    } finally { setLoading(false) }
  }, [])

  const removeVideo = useCallback((courseId: string, videoId: string) => {
    const updated = courseService.removeVideo(courseId, videoId)
    setCourses(updated)
  }, [])

  // ── Images ───────────────────────────────────────────────────────────────────
  const addImage = useCallback(async (courseId: string, title: string, file: File) => {
    setLoading(true)
    try {
      const updated = await courseService.addImage(courseId, title, file)
      setCourses(updated)
    } finally { setLoading(false) }
  }, [])

  const removeImage = useCallback((courseId: string, imageId: string) => {
    const updated = courseService.removeImage(courseId, imageId)
    setCourses(updated)
  }, [])

  // ── Documents ────────────────────────────────────────────────────────────────
  const addDocument = useCallback(async (courseId: string, title: string, file: File) => {
    setLoading(true)
    try {
      const updated = await courseService.addDocument(courseId, title, file)
      setCourses(updated)
    } finally { setLoading(false) }
  }, [])

  const removeDocument = useCallback((courseId: string, docId: string) => {
    const updated = courseService.removeDocument(courseId, docId)
    setCourses(updated)
  }, [])

  const value = useMemo(() => ({
    teacherCourses,
    studentCourses,
    selectedCourse,
    loading,
    error,
    loadTeacherCourses,
    loadStudentCourses,
    selectCourse,
    createCourse,
    togglePublish,
    deleteCourse,
    addVideo,
    removeVideo,
    addImage,
    removeImage,
    addDocument,
    removeDocument,
  }), [
    teacherCourses,
    studentCourses,
    selectedCourse,
    loading,
    error,
    loadTeacherCourses,
    loadStudentCourses,
    selectCourse,
    createCourse,
    togglePublish,
    deleteCourse,
    addVideo,
    removeVideo,
    addImage,
    removeImage,
    addDocument,
    removeDocument,
  ])

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}
