import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AttendanceSheet from './pages/AttendanceSheet'
import Classes from './pages/Classes'
import Reports from './pages/Reports'
import Shell from './components/Shell'

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<AttendanceSheet />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
