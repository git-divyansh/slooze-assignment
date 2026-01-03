'use client'

import { useEffect } from 'react'

export default function Toast({ tone = 'info', message, onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const tones = {
    info: 'border-sky-500/30 bg-sky-500/10 text-sky-100',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-100',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div
        role="status"
        aria-live="polite"
        className={`max-w-md rounded-2xl border px-4 py-3 text-sm shadow-lg ${tones[tone]}`}
      >
        {message}
      </div>
    </div>
  )
}
