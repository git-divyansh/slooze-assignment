import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission } from '@/lib/authz'

export async function GET() {
  const user = await getCurrentUser()
  // anyone who can create orders can at least view their own orders list in UI
  if (!hasPermission(user, Permissions.CREATE_ORDER)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id, status: { in: ['PLACED', 'CANCELED'] } },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { menuItem: true } } },
  })

  return NextResponse.json({ orders })
}
