'use client'

import { useEffect, useMemo, useState } from 'react'
import AppShell from '@/components/AppShell.js'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { apiGet, apiPost } from '@/lib/api'
import { formatMoney } from '@/lib/format'
import { NavLink } from '@/components/TopNav'
import PaymentMethodModal from '@/components/PaymentMethodModal'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [toast, setToast] = useState({ tone: 'info', message: '' })

  async function refresh() {
    setLoading(true)
    try {
      const d = await apiGet('/api/cart')
      setCart(d.cart)
    } catch (e) {
      setToast({ tone: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const lines = cart?.items || []
  const totalCents = cart?.totalCents || 0

  async function placeOrder() {
    setPlacing(true)
    try {
      await apiPost('/api/orders/place', {})
      setToast({ tone: 'success', message: 'Order placed.' })
      await refresh()
    } catch (e) {
      setToast({ tone: 'error', message: e.message })
    } finally {
      setPlacing(false)
    }
  }

  const [paymentMethod, setPaymentMethod] = useState(null)
  const [meMeta, setMeMeta] = useState({ country: null, role: null })
  const [pmOpen, setPmOpen] = useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const [cartRes, pmRes] = await Promise.all([
        apiGet('/api/cart'),
        apiGet('/api/payment-method'),
      ])
      setCart(cartRes.cart)
      setPaymentMethod(pmRes.paymentMethod)
      setMeMeta({ country: pmRes.country, role: pmRes.role })
    } catch (e) {
      setToast({ tone: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  async function savePaymentMethod(payload) {
    try {
      const res = await apiPost('/api/payment-method/update', payload)
      setPaymentMethod(res.paymentMethod)
      setToast({ tone: 'success', message: 'Payment method updated.' })
    } catch (e) {
      // Treat 403 as warning (role limitation) rather than "error"
      const msg = e.message || 'You are not allowed to do that.'
      setToast({ tone: 'info', message: msg }) // or create a 'warning' tone if you prefer
    }
  }



  return (
    <AppShell>

      <div className="mb-5">
        <h1 className="text-xl font-semibold sm:text-2xl">Cart</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Review items and place your order (Managers/Admin only).
        </p>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-900/40" />
      ) : !cart || lines.length === 0 ? (
        <Card className="p-6">
          <p className="text-sm text-zinc-300">Cart is empty.</p>
          <p className="mt-2 text-xs text-zinc-500">Add items from Restaurants.</p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-zinc-200">Items</h2>
            <div className="mt-3 space-y-2">
              {lines.map((l) => (
                <div
                  key={l.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-zinc-100">
                      {l.menuItem?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {l.menuItem?.restaurant?.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Qty: {l.qty} · {formatMoney(l.priceCents)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-200">
                      {formatMoney(l.qty * l.priceCents)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <PaymentMethodModal
            open={pmOpen}
            onClose={() => setPmOpen(false)}
            country={meMeta.country}
            current={paymentMethod}
            onSave={savePaymentMethod}
          />

             <Card className="p-4 mt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200">Payment method</h2>
                  {paymentMethod ? (
                    <p className="mt-1 text-sm text-zinc-100">
                      {paymentMethod.brand === 'UPI'
                        ? `UPI · ${paymentMethod.label}`
                        : `${paymentMethod.label} · ${paymentMethod.brand} •••• ${paymentMethod.last4}`}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-400">Not set</p>
                  )}
                  <p className="mt-1 text-xs text-zinc-500">
                    {meMeta.role === 'ADMIN'
                      ? 'Admin can change this.'
                      : 'Only Admin can change this (RBAC enforced by server).'}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => setPmOpen(true)}
                >
                  Change
                </Button>
              </div>
            </Card>



          <div className="lg:sticky lg:top-20 lg:self-start">
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-zinc-200">Summary</h2>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Total</span>
                <span className="font-semibold text-zinc-50">{formatMoney(totalCents)}</span>
              </div>

              <Button className="mt-4 w-full" onClick={placeOrder} disabled={placing}>
                {placing ? 'Placing…' : 'Checkout & Pay'}
              </Button>

              <p className="mt-3 text-xs text-zinc-500">
                If not permitted, the server will block this action (RBAC).
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Mobile sticky CTA */}
      {cart && lines.length > 0 ? (
        <div className="fixed inset-x-0 bottom-14 z-30 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-xs text-zinc-400">Total</p>
              <p className="text-sm font-semibold">{formatMoney(totalCents)}</p>
            </div>
            <Button onClick={placeOrder} disabled={placing}>
              {placing ? 'Placing…' : 'Pay'}
            </Button>
          </div>
        </div>
      ) : null}

      <Toast
        tone={toast.tone}
        message={toast.message}
        onClose={() => setToast({ tone: 'info', message: '' })}
      />
    </AppShell>
  )
}
