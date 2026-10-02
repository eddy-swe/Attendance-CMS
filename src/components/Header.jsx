import React from "react";

export default function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Instructor Dashboard
          </h2>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:text-sm">
            {today}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
          <div className="h-8 w-8 rounded-full bg-indigo-100" aria-hidden="true" />
          <div className="pr-2 text-sm font-medium text-slate-700">Admin</div>
        </div>
      </div>
    </header>
  );
}
