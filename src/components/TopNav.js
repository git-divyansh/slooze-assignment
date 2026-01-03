'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Button from './Button'

export function NavLink({ href, children }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={
        'rounded-xl px-3 py-2 text-sm transition ' +
        (active ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-300 hover:bg-zinc-900')
      }
    >
      {children}
    </Link>
  )
}

export default function TopNav({ me, onLogout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/restaurants" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-wide">Fury Food</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          <NavLink href="/restaurants">Restaurants</NavLink>
          <NavLink href="/cart">Cart</NavLink>
          <NavLink href="/orders">Orders</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-zinc-400">Signed in as</p>
            <p className="text-sm text-zinc-200">
              {me?.name} <span className="text-zinc-500">({me?.role}, {me?.country})</span>
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
