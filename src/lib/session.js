import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const COOKIE_NAME = 'session'

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

export async function createSession(userId) {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = sha256(rawToken)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: { userId, tokenHash, expiresAt },
  })

  ;(await cookies()).set(COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  return { expiresAt }
}

export async function getCurrentUser() {
  const rawToken = (await cookies()).get(COOKIE_NAME)?.value
  if (!rawToken) return null

  const tokenHash = sha256(rawToken)

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!session) return null
  if (session.expiresAt < new Date()) return null

  return session.user
}

export async function deleteSession() {
  const rawToken = (await cookies()).get(COOKIE_NAME)?.value
  if (rawToken) {
    const tokenHash = sha256(rawToken)
    await prisma.session.deleteMany({ where: { tokenHash } })
  }
  ;(await cookies()).delete(COOKIE_NAME)
}
