import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CheckSquare, BookOpen, BarChart2 } from "lucide-react";

const items = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/attendance", icon: CheckSquare, label: "Take Attendance" },
  { to: "/classes", icon: BookOpen, label: "Classes & Students" },
  { to: "/reports", icon: BarChart2, label: "Attendance Reports" },
];

export default function Sidebar() {
  const loc = useLocation();
  return (
    <aside className="hidden w-72 bg-slate-900 text-slate-100 lg:block">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-lg font-semibold tracking-wide">Attendance CMS</h1>
        <p className="mt-1 text-sm text-slate-400">Instructor Admin</p>
      </div>
      <nav className="p-4">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              loc.pathname === it.to
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <it.icon className="w-5 h-5" />
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
