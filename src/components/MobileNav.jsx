import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "./navItems";

// Bottom navigation bar for screens below the `lg` breakpoint,
// where the sidebar is hidden.
export default function MobileNav() {
  const loc = useLocation();
  return (
    <nav
      aria-label="Main"
      className="grid shrink-0 grid-cols-4 border-t border-slate-200 bg-white lg:hidden"
    >
      {navItems.map((it) => {
        const active = loc.pathname === it.to;
        return (
          <Link
            key={it.to}
            to={it.to}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium ${
              active ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            <it.icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-center leading-tight">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
