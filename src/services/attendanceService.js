import mock from '../data/attendance.json'
import { set as lsSet, get as lsGet } from './localStorageService'

const STORAGE_KEY = 'attendance_records'

export const fetchAttendanceByClassDate = (classId, date) => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const stored = (await lsGet(STORAGE_KEY)) || mock.records
      const filtered = stored.filter((r) => r.classId === classId && r.date === date)
      resolve(filtered)
    }, 200)
  })
}

export const saveAttendanceRecords = (records) => {
  return new Promise(async (resolve) => {
    const existing = (await lsGet(STORAGE_KEY)) || mock.records
    // naive merge: append new session
    const merged = [...existing, ...records]
    await lsSet(STORAGE_KEY, merged)
    setTimeout(() => resolve({ success: true }), 300)
  })
}

export const getSummary = () => {
  return new Promise(async (resolve) => {
    const records = (await lsGet(STORAGE_KEY)) || mock.records
    const totalStudents = new Set(records.map((r) => r.studentId)).size
    const classesToday = new Set(records.map((r) => r.classId)).size
    const present = records.filter((r) => r.status === 'present').length
    const avgAttendance = records.length ? Math.round((present / records.length) * 100) : 0
    const missing = records.filter((r) => r.status === 'missing').length
    resolve({ totalStudents, classesToday, avgAttendance, missing })
  })
}

export const getRecentActivity = () => {
  return new Promise(async (resolve) => {
    const records = (await lsGet(STORAGE_KEY)) || mock.records
    const sorted = [...records].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const items = sorted.slice(0, 10).map((r) => ({ id: r.id, text: `${r.date} — ${r.studentName} — ${r.status}` }))
    resolve(items)
  })
}
