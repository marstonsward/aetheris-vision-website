'use client'

import { SessionProvider } from 'next-auth/react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div style={{ colorScheme: 'light', backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh' }}>
        {children}
      </div>
    </SessionProvider>
  )
}
