import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Permissions, hasPermission } from '@/lib/authz'

export const runtime = 'nodejs'

export async function POST(req) {
  const user = await getCurrentUser()
  if (!hasPermission(user, Permissions.UPDATE_PAYMENT)) {
    return NextResponse.json(
      { error: 'Only Admin can change the payment method. Please contact Nick Fury.' },
      { status: 403 }
    )
  }

  const { label, brand, last4 } = await req.json()

  const pm = await prisma.paymentMethod.upsert({
    where: { userId: user.id },
    create: { userId: user.id, label, brand, last4 },
    update: { label, brand, last4 },
  })

  return NextResponse.json({ paymentMethod: pm })
}
