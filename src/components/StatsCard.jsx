import React from "react";

export default function StatsCard({ title, value, hint }) {
  return (
    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
