'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Button from './Button'
import Card from './Card'

function trapFocus(e, rootEl) {
  if (e.key !== 'Tab') return
  const focusables = rootEl.querySelectorAll(
    'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
  )
  const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'))
  if (list.length === 0) return

  const first = list[0]
  const last = list[list.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

export default function PaymentMethodModal({
  open,
  onClose,
  country, // 'INDIA' | 'AMERICA'
  current, // existing paymentMethod row (can be null)
  onSave,   // async (payload) => void
}) {
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const [mode, setMode] = useState(current?.brand === 'UPI' ? 'UPI' : 'CARD')
  const [upiProvider, setUpiProvider] = useState(current?.brand === 'UPI' ? current?.label : 'Google Pay')
  const [cardBrand, setCardBrand] = useState(current?.brand !== 'UPI' ? (current?.brand || 'VISA') : 'VISA')
  const [last4, setLast4] = useState(current?.brand !== 'UPI' ? (current?.last4 || '') : '')
  const [saving, setSaving] = useState(false)

  const upiAllowed = country === 'INDIA'

  const initialMode =
  current?.brand === 'UPI' ? 'UPI' : 'CARD'

    const initialUpi =
    current?.brand === 'UPI' ? current.label : 'Google Pay'

    const initialCardBrand =
    current && current.brand !== 'UPI'
        ? current.brand
        : (country === 'AMERICA' ? 'VISA' : 'VISA')

    useEffect(() => {
    if (!open) return
    setMode(initialMode)
    setUpiProvider(initialUpi)
    setCardBrand(initialCardBrand)
    setLast4(current?.brand !== 'UPI' ? (current?.last4 || '') : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])


  useEffect(() => {
    if (!open) return
    // Focus a static element inside dialog when opened (APG recommendation) [web:307]
    const el = panelRef.current
    if (el) el.focus()
  }, [open])

  function close() {
    onClose?.()
    // return focus to trigger if present
    triggerRef.current?.focus()
  }

  async function save() {
    setSaving(true)
    try {
      if (mode === 'UPI') {
        await onSave({
          label: upiProvider, // Google Pay / Paytm / BharatPe
          brand: 'UPI',
          last4: '0000', // placeholder in this demo schema
        })
      } else {
        if (last4.trim().length !== 4) throw new Error('Last 4 digits must be 4 numbers.')
        await onSave({
          label: 'Card',
          brand: cardBrand, // VISA/MASTERCARD/RUPAY/AMEX etc
          last4,
        })
      }
      close()
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50"
      aria-labelledby="pm-title"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') close()
        if (panelRef.current) trapFocus(e, panelRef.current.parentElement)
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onMouseDown={close} />

      {/* Panel */}
      <div className="relative mx-auto flex min-h-screen max-w-lg items-end px-3 py-4 sm:items-center sm:px-4">
        <Card className="w-full p-4 sm:p-5">
          <div
            tabIndex={-1}
            ref={panelRef}
            className="outline-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="pm-title" className="text-base font-semibold text-zinc-50">
                  Payment method
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Choose how to pay at checkout.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={close} aria-label="Close dialog">
                Close
              </Button>
            </div>

            {/* Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant={mode === 'CARD' ? 'primary' : 'secondary'}
                onClick={() => setMode('CARD')}
                type="button"
              >
                Card
              </Button>
              <Button
                variant={mode === 'UPI' ? 'primary' : 'secondary'}
                onClick={() => setMode('UPI')}
                type="button"
                disabled={!upiAllowed}
                aria-disabled={!upiAllowed}
              >
                UPI
              </Button>
            </div>

            {!upiAllowed ? (
              <p className="mt-2 text-xs text-zinc-500">
                UPI is available only for India users.
              </p>
            ) : null}

            {/* Content */}
            {mode === 'UPI' ? (
              <div className="mt-4 space-y-2">
                {['Google Pay', 'Paytm', 'BharatPe'].map((p) => (
                  <label
                    key={p}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-100">{p}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">UPI</p>
                    </div>
                    <input
                      type="radio"
                      name="upi"
                      value={p}
                      checked={upiProvider === p}
                      onChange={() => setUpiProvider(p)}
                      className="h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-sm text-zinc-300">
                  Card network
                  <select
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm"
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value)}
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="RUPAY">RUPAY</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </label>

                <label className="block text-sm text-zinc-300">
                  Last 4 digits
                  <input
                    className="mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm"
                    inputMode="numeric"
                    placeholder="1234"
                    value={last4}
                    onChange={(e) =>
                      setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                  />
                </label>
                <p className="text-xs text-zinc-500">
                  Demo-only: do not store card details in production.
                </p>
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="w-full" onClick={close} type="button">
                Cancel
              </Button>
              <Button className="w-full" onClick={save} disabled={saving} type="button">
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>

            {/* focus return anchor */}
            <button ref={triggerRef} className="sr-only" tabIndex={-1} />
          </div>
        </Card>
      </div>
    </div>
  )
}
