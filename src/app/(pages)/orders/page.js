'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/AppShell.js'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { apiGet, apiPost } from '@/lib/api'
import { formatMoney } from '@/lib/format'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState({ tone: 'info', message: '' })

  async function refresh() {
    setLoading(true)
    try {
      const d = await apiGet('/api/orders')
      setOrders(d.orders || [])
    } catch (e) {
      setToast({ tone: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function cancel(orderId) {
    setBusyId(orderId)
    try {
      await apiPost('/api/orders/cancel', { orderId })
      setToast({ tone: 'success', message: 'Order canceled.' })
      await refresh()
    } catch (e) {
      setToast({ tone: 'error', message: e.message })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl font-semibold sm:text-2xl">Orders</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Track recent orders and cancel when permitted.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-900/40" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-zinc-300">No orders yet.</p>
          <p className="mt-2 text-xs text-zinc-500">Place an order from the Cart page.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">
                    {o.status === 'PLACED' ? 'Placed' : 'Canceled'} · {formatMoney(o.totalCents)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Order ID: <span className="text-zinc-400">{o.id}</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Country: <span className="text-zinc-400">{o.country}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  {o.status === 'PLACED' ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => cancel(o.id)}
                      disabled={busyId === o.id}
                      aria-label="Cancel order"
                    >
                      {busyId === o.id ? 'Canceling…' : 'Cancel'}
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {(o.items || []).map((it) => (
                  <p key={it.id} className="text-xs text-zinc-400">
                    {it.qty}× {it.menuItem?.name}
                  </p>
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
