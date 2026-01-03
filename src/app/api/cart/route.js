import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission } from '@/lib/authz'

export async function GET() {
  const user = await getCurrentUser()
  if (!hasPermission(user, Permissions.CREATE_ORDER)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const cart = await prisma.order.findFirst({
    where: { userId: user.id, status: 'CART' },
    include: { items: { include: { menuItem: { include: { restaurant: true } } } } },
  })

  return NextResponse.json({ cart })
}
