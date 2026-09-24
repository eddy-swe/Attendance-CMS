import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Shell({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
