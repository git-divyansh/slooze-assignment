'use client'

import { useEffect, useMemo, useState } from 'react'
import AppShell from '@/components/AppShell.js'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { apiGet, apiPost } from '@/lib/api'
import { formatMoney } from '@/lib/format'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ tone: 'info', message: '' })
  const [adding, setAdding] = useState({}) // menuItemId -> boolean

  useEffect(() => {
    let mounted = true
    setLoading(true)
    apiGet('/api/restaurants')
      .then((d) => mounted && setRestaurants(d.restaurants || []))
      .catch((e) => setToast({ tone: 'error', message: e.message }))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  async function addToCart(menuItemId) {
    setAdding((m) => ({ ...m, [menuItemId]: true }))
    try {
      await apiPost('/api/cart/add', { menuItemId, qty: 1 })
      setToast({ tone: 'success', message: 'Added to cart.' })
    } catch (e) {
      setToast({ tone: 'error', message: e.message })
    } finally {
      setAdding((m) => ({ ...m, [menuItemId]: false }))
    }
  }

  return (
    <AppShell>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Restaurants</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Browse menus and add items to your cart.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-zinc-900/40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">{r.name}</h2>
                  <p className="mt-1 text-xs text-zinc-400">{r.country}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {(r.menuItems || []).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-zinc-100">{m.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {formatMoney(m.priceCents)}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="shrink-0"
                      onClick={() => addToCart(m.id)}
                      disabled={Boolean(adding[m.id])}
                      aria-label={`Add ${m.name} to cart`}
                    >
                      {adding[m.id] ? 'Adding…' : 'Add'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Toast
        tone={toast.tone}
        message={toast.message}
        onClose={() => setToast({ tone: 'info', message: '' })}
      />
    </AppShell>
  )
}
