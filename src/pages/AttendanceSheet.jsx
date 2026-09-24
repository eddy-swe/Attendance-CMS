import React, { useEffect, useState } from 'react'
import { fetchClasses } from '../services/classService'
import { fetchStudents } from '../services/studentService'
import { saveAttendanceRecords } from '../services/attendanceService'
import AttendanceTable from '../components/AttendanceTable'

export default function AttendanceSheet() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState([])

  useEffect(() => {
    fetchClasses().then((c) => {
      setClasses(c)
      setSelectedClass(c[0]?.id)
    })
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass).then(setStudents)
    }
  }, [selectedClass])

  const handleSave = async (updatedRows) => {
    // transform rows into attendance records
    const records = updatedRows.map((r) => ({
      id: `r_${Date.now()}_${r.id}`,
      studentId: r.id,
      studentName: r.name,
      classId: selectedClass,
      date,
      status: r.status,
      notes: r.notes || '',
      createdAt: new Date().toISOString(),
    }))
    await saveAttendanceRecords(records)
    alert('Saved attendance (local mock)')
  }

  return (
    <div>
      <div className="bg-white p-4 rounded mb-4">
        <div className="flex gap-4 items-center">
          <label className="text-sm">Class</label>
          <select value={selectedClass || ''} onChange={(e) => setSelectedClass(e.target.value)} className="border rounded px-2 py-1">
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="text-sm">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded px-2 py-1" />

          <div className="ml-auto">
            <button className="px-3 py-2 bg-green-600 text-white rounded mr-2">Mark All Present</button>
            <button className="px-3 py-2 bg-gray-200 rounded">Reset All</button>
          </div>
        </div>
      </div>

      <AttendanceTable students={students} onSave={handleSave} />
    </div>
  )
}
