import { prisma } from '@/lib/prisma'

export async function getOrCreateDefaultPaymentMethod(user) {
  const existing = await prisma.paymentMethod.findUnique({
    where: { userId: user.id },
  })
  if (existing) return existing

  // Defaults:
  // INDIA  -> UPI / Google Pay
  // AMERICA -> VISA credit card
  const defaults =
    user.country === 'INDIA'
      ? { label: 'Google Pay', brand: 'UPI', last4: '0000' }
      : { label: 'Visa credit card', brand: 'VISA', last4: '4242' }

  return prisma.paymentMethod.create({
    data: {
      userId: user.id,
      ...defaults,
      token: null,
    },
  })
}
