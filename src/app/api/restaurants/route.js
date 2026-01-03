import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission, canAccessCountry } from '@/lib/authz'

export async function GET(req) {
  const user = await getCurrentUser()
  if (!hasPermission(user, Permissions.VIEW_MENU)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country') // optional filter

  // Bonus scoping: non-admin can only query their own country
  if (country && !canAccessCountry(user, country)) {
    return NextResponse.json({ error: 'Forbidden country scope' }, { status: 403 })
  }

  const where = country
    ? { country }
    : user.role === 'ADMIN'
      ? {}
      : { country: user.country }

  const restaurants = await prisma.restaurant.findMany({
    where,
    include: { menuItems: { where: { isActive: true } } },
  })

  return NextResponse.json({ restaurants })
}
