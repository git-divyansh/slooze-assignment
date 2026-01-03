import { NextResponse } from 'next/server'
export async function GET() {
  console.log('[PING] hit')
  return NextResponse.json({ ok: true })
}
