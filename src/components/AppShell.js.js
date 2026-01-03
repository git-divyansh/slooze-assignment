'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TopNav from './TopNav'
import MobileNav from './MobileNav'
import Toast from './Toast'
import { apiGet, apiPost } from '@/lib/api'

export default function AppShell({ children }) {
  const router = useRouter()
  const [me, setMe] = useState(null)
  const [toast, setToast] = useState({ tone: 'info', message: '' })

  useEffect(() => {
    let mounted = true
    apiGet('/api/auth/me')
      .then((d) => mounted && setMe(d.user))
      .catch(() => {
        // Not logged in -> login page
        router.replace('/login')
      })
    return () => {
      mounted = false
    }
  }, [router])

  async function logout() {
    await apiPost('/api/auth/logout', {})
    router.replace('/login')
  }

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <TopNav me={me} onLogout={logout} />

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        {children}
      </main>

      <MobileNav />

      <Toast
        tone={toast.tone}
        message={toast.message}
        onClose={() => setToast({ tone: 'info', message: '' })}
      />
    </div>
  )
}
