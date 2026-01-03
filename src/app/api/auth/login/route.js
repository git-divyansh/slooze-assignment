import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'

export const runtime = 'nodejs' // helps ensure Prisma runs in Node runtime 

export async function POST(req) {
  const startedAt = Date.now()
  try {
    console.log('[LOGIN] hit')

    const body = await req.json().catch((e) => {
      console.error('[LOGIN] req.json() failed', e)
      return null
    })

    console.log('[LOGIN] body received?', Boolean(body))
    if (!body?.email || !body?.password) {
      console.warn('[LOGIN] missing email/password')
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const { email, password } = body
    console.log('[LOGIN] email:', email)

    console.log('[LOGIN] querying user...')
    const user = await prisma.user.findUnique({ where: { email } })
    console.log('[LOGIN] user found?', Boolean(user))

    if (!user) {
      console.warn('[LOGIN] not allowed:', email)
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    console.log('[LOGIN] comparing password hash...')
    const ok = await bcrypt.compare(password, user.passwordHash)
    console.log('[LOGIN] password ok?', ok)

    if (!ok) {
      console.warn('[LOGIN] invalid credentials:', email)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    console.log('[LOGIN] creating session...')
    await createSession(user.id)
    console.log('[LOGIN] session created for userId:', user.id)

    console.log('[LOGIN] done in ms:', Date.now() - startedAt)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[LOGIN] unexpected error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
