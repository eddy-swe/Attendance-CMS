import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

export default function Shell({ children }) {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
