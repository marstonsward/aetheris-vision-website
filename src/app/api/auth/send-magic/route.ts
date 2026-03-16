import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLink } from '@/lib/send-magic-link'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  // Only send to known clients (don't reveal if email exists or not)
  const clients = await sql`SELECT id FROM clients WHERE email = ${email}`
  if (clients.length > 0) {
    await sendMagicLink(email)
  }

  return NextResponse.json({ sent: true })
}
