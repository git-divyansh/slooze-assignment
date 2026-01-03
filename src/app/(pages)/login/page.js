'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { apiPost } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ tone: 'info', message: '' })

  async function onSubmit(e) {
    console.log('submit fired', { email, password }) 
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiPost('/api/auth/login', { email, password })
      console.log('login response', res)
      router.replace('/restaurants')
    } catch (err) {
      setToast({ tone: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

 return (
  <div className="min-h-screen bg-zinc-950">
    <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-stretch gap-8 px-4 py-10 md:grid-cols-2 md:gap-10">
      {/* Welcome / Animated section */}
      <section className="order-1 flex items-center md:order-2">
        <div className="w-full">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
            <p className="text-xs font-medium tracking-wide text-zinc-400">
              Welcome to
            </p>

            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
              <span className="block text-zinc-50">Fury Food</span>

              {/* Animated typography */}
              <span className="mt-2 block">
                <span className="animated-gradient-text">
                  Order fast. Stay within access.
                </span>
              </span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              A role-based food ordering workflow for Admins, Managers, and Members,
              with country-scoped data access.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">RBAC</p>
                <p className="mt-1 text-sm text-zinc-200">Least privilege by role</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Country scope</p>
                <p className="mt-1 text-sm text-zinc-200">India / America isolation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login form section */}
      <section className="order-2 flex items-center md:order-1">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Use seeded accounts (e.g., nick@fury.com / Password@123).
            </p>
          </div>

          <Card className="p-5 sm:p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Continue'}
              </Button>
            </form>
          </Card>

          <p className="mt-4 text-xs text-zinc-500">
            Access is enforced on the server (RBAC + country scope).
          </p>
        </div>
      </section>
    </div>

    <Toast
      tone={toast.tone}
      message={toast.message}
      onClose={() => setToast({ tone: 'info', message: '' })}
    />
  </div>
)

}
