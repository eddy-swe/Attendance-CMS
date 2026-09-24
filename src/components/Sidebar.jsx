import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, CheckSquare, BookOpen, BarChart2 } from 'lucide-react'

const items = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/attendance', icon: CheckSquare, label: 'Take Attendance' },
  { to: '/classes', icon: BookOpen, label: 'Classes & Students' },
  { to: '/reports', icon: BarChart2, label: 'Attendance Reports' },
]

export default function Sidebar() {
  const loc = useLocation()
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Attendance CMS</h1>
        <p className="text-sm text-slate-500">Instructor Admin</p>
      </div>
      <nav className="p-4">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className={`flex items-center gap-3 p-2 rounded-md mb-1 hover:bg-slate-100 $ {loc.pathname === it.to ? 'bg-slate-100 font-medium' : ''}`}
          >
            <it.icon className="w-5 h-5" />
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
