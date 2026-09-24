import React, { useEffect, useState } from 'react'
import StatsCard from '../components/StatsCard'
import { getSummary, getRecentActivity } from '../services/attendanceService'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [activity, setActivity] = useState([])

  useEffect(() => {
    getSummary().then(setSummary)
    getRecentActivity().then(setActivity)
  }, [])

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <StatsCard title="Total Students" value={summary?.totalStudents ?? '—'} />
        <StatsCard title="Classes Today" value={summary?.classesToday ?? '—'} />
        <StatsCard title="Avg Attendance" value={`${summary?.avgAttendance ?? '—'}%`} />
        <StatsCard title="Missing Records" value={summary?.missing ?? '—'} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded">Take Today's Attendance</button>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <ul>
            {activity.map((a) => (
              <li key={a.id} className="text-sm py-1 border-b">{a.text}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
