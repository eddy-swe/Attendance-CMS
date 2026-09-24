import React from 'react'

export default function Header() {
  const today = new Date().toLocaleDateString()
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Instructor Dashboard</h2>
        <div className="text-sm text-slate-500">{today}</div>
      </div>
      <div className="flex items-center gap-4">
        <select className="border rounded px-2 py-1 text-sm">
          <option>All Classes</option>
        </select>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
          <div className="text-sm">Admin</div>
        </div>
      </div>
    </header>
  )
}
