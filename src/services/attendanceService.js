import mock from '../data/attendance.json'
import { set as lsSet, get as lsGet } from './localStorageService'
import { fetchStudents } from './studentService'
import { fetchClasses } from './classService'
import { upsertRecords, dashboardStats } from '../utils/attendanceStats'
import { todayISO } from '../utils/dates'

const STORAGE_KEY = 'attendance_records'

const loadRecords = async () => {
  const stored = await lsGet(STORAGE_KEY)
  return Array.isArray(stored) ? stored : mock.records
}

export const fetchAttendanceByClassDate = async (classId, date) => {
  const records = await loadRecords()
  return records.filter((r) => r.classId === classId && r.date === date)
}

// classId may be empty to include every class. Dates are inclusive "YYYY-MM-DD" strings.
export const fetchAttendanceRange = async (classId, start, end) => {
  const records = await loadRecords()
  return records
    .filter((r) => (!classId || r.classId === classId) && r.date >= start && r.date <= end)
    .sort((a, b) => b.date.localeCompare(a.date) || a.studentName.localeCompare(b.studentName))
}

// Saving the same class/date again updates the existing records instead of duplicating them.
export const saveAttendanceRecords = async (records) => {
  const existing = await loadRecords()
  await lsSet(STORAGE_KEY, upsertRecords(existing, records))
  return { success: true }
}

export const getSummary = async () => {
  const [records, students, classes] = await Promise.all([
    loadRecords(),
    fetchStudents(),
    fetchClasses(),
  ])
  return dashboardStats({ records, students, classes, today: todayISO() })
}

export const getRecentActivity = async () => {
  const records = await loadRecords()
  const sorted = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return sorted.slice(0, 10).map((r) => ({
    id: r.id,
    text: `${r.date} — ${r.studentName} — ${r.status}`,
  }))
}
