'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'


export default function MobileNav() {
  const pathname = usePathname()
  const items = [
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/cart', label: 'Cart' },
    { href: '/orders', label: 'Orders' },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur sm:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 px-3 py-2">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                'rounded-xl px-3 py-2 text-center text-xs transition ' +
                (active ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-300 hover:bg-zinc-900')
              }
            >
              {it.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}