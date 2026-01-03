import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission, canAccessCountry } from '@/lib/authz'

export async function POST(req) {
  const user = await getCurrentUser()
  if (!hasPermission(user, Permissions.CANCEL_ORDER)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { orderId } = await req.json()
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Bonus: non-admin can only affect orders in their country
  if (!canAccessCountry(user, order.country)) {
    return NextResponse.json({ error: 'Forbidden country scope' }, { status: 403 })
  }

  const canceled = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELED' },
  })

  return NextResponse.json({ order: canceled })
}
