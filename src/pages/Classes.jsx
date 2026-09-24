import React, { useEffect, useState } from 'react'
import { fetchClasses } from '../services/classService'

export default function Classes() {
  const [classes, setClasses] = useState([])
  useEffect(() => { fetchClasses().then(setClasses) }, [])
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Classes</h3>
      <div className="bg-white p-4 rounded shadow">
        <ul>
          {classes.map(c => (
            <li key={c.id} className="py-2 border-b flex justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-slate-500">{c.schedule}</div>
              </div>
              <div className="text-sm text-slate-500">{c.id}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
