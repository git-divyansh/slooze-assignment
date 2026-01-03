import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission } from '@/lib/authz'

export async function POST() {
  const user = await getCurrentUser()
  if (!hasPermission(user, Permissions.PLACE_ORDER)) {
    return NextResponse.json(
      { error: 'Only Admin / Managers can place orders. Please contact Admin or you manager.' },
      { status: 403 }
    )
  }

  const payment = await prisma.paymentMethod.findUnique({ where: { userId: user.id } })
  if (!payment) return NextResponse.json({ error: 'No payment method' }, { status: 400 })

  const cart = await prisma.order.findFirst({
    where: { userId: user.id, status: 'CART' },
    include: { items: true },
  })
  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart empty' }, { status: 400 })
  }

  // demo “payment”
  const paymentRef = `PMT_${Date.now()}`

  const placed = await prisma.order.update({
    where: { id: cart.id },
    data: { status: 'PLACED', paymentRef },
  })

  return NextResponse.json({ order: placed })
}
