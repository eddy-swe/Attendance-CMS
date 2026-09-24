import { get } from './localStorageService'
import mock from '../data/students.json'

export const fetchStudents = (classId) => {
  return new Promise((resolve) => {
    // Simulate async fetch; filter by classId when provided
    setTimeout(() => {
      const list = mock.students.filter((s) => !classId || s.classId === classId)
      resolve(list)
    }, 200)
  })
}
