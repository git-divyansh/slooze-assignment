import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission, canAccessCountry } from '@/lib/authz'

export async function POST(req) {
  const user = await getCurrentUser()
  if (!hasPermission(user, Permissions.CREATE_ORDER)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { menuItemId, qty } = await req.json()
  if (!menuItemId || !qty || qty < 1) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const item = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    include: { restaurant: true },
  })
  if (!item || !item.isActive) return NextResponse.json({ error: 'Invalid item' }, { status: 404 })

  // Bonus scoping: can't add items from another country unless admin
  if (!canAccessCountry(user, item.restaurant.country)) {
    return NextResponse.json({ error: 'Forbidden country scope' }, { status: 403 })
  }

  const cart = await prisma.order.upsert({
    where: {
      // using a compound unique would be nicer; keeping it simple via find+create
      id: '___not_used___',
    },
    create: {},
    update: {},
  }).catch(() => null)

  const existingCart = await prisma.order.findFirst({
    where: { userId: user.id, status: 'CART' },
    include: { items: true },
  })

  const activeCart =
    existingCart ||
    (await prisma.order.create({
      data: { userId: user.id, status: 'CART', country: user.country },
    }))

  // merge/append item
  const existingLine = await prisma.orderItem.findFirst({
    where: { orderId: activeCart.id, menuItemId: item.id },
  })

  if (existingLine) {
    await prisma.orderItem.update({
      where: { id: existingLine.id },
      data: { qty: existingLine.qty + qty },
    })
  } else {
    await prisma.orderItem.create({
      data: {
        orderId: activeCart.id,
        menuItemId: item.id,
        qty,
        priceCents: item.priceCents,
      },
    })
  }

  // recompute total
  const lines = await prisma.orderItem.findMany({ where: { orderId: activeCart.id } })
  const totalCents = lines.reduce((s, l) => s + l.qty * l.priceCents, 0)

  const updated = await prisma.order.update({
    where: { id: activeCart.id },
    data: { totalCents },
    include: { items: { include: { menuItem: true } } },
  })

  return NextResponse.json({ cart: updated })
}
