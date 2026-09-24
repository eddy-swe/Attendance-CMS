import React, { useEffect, useState } from 'react'

const STATUSES = ['present', 'absent', 'late', 'excused']

export default function AttendanceTable({ students = [], onSave }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    // initialize rows from students
    setRows(students.map((s) => ({ ...s, status: 'present', notes: '' })))
  }, [students])

  const setStatus = (id, status) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  const setNotes = (id, notes) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, notes } : row)))
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-slate-500">
            <th className="p-2">Student</th>
            <th className="p-2">Status</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-2 flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
                <div>
                  <div className="font-medium">{row.name}</div>
                  <div className="text-sm text-slate-500">{row.id}</div>
                </div>
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(row.id, s)}
                      className={`px-2 py-1 rounded-full text-sm border ${row.status === s ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </td>
              <td className="p-2">
                <input value={row.notes} onChange={(e) => setNotes(row.id, e.target.value)} className="border rounded px-2 py-1 w-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={() => setRows((r) => r.map((row) => ({ ...row, status: 'present' })))} className="px-3 py-2 bg-indigo-600 text-white rounded">
          Mark All Present
        </button>
        <button onClick={() => setRows((r) => r.map((row) => ({ ...row, status: 'present', notes: '' })))} className="px-3 py-2 bg-gray-200 rounded">
          Reset
        </button>
        <button onClick={() => onSave(rows)} className="px-3 py-2 bg-green-600 text-white rounded">
          Save & Submit Attendance
        </button>
      </div>
    </div>
  )
}
