import React from 'react'

export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow flex-1">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
