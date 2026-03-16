'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ClientRoot() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      router.replace('/client/dashboard')
    } else {
      router.replace('/client/login')
    }
  }, [session, status, router])

  return null
}
