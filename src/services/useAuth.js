import { useState } from 'react'

export const useAuth = () => {
  const [user] = useState({ id: 'admin1', name: 'Instructor Admin', role: 'admin' })
  return { user }
}
