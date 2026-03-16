import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const clients = await sql`
    SELECT id, name, contact_name, email, phone, created_at
    FROM clients
    ORDER BY created_at DESC
  `
  return NextResponse.json({ clients })
}

export async function POST(request: NextRequest) {
  const { name, contact_name, email, phone } = await request.json()

  const rows = await sql`
    INSERT INTO clients (name, contact_name, email, phone)
    VALUES (${name}, ${contact_name}, ${email}, ${phone || null})
    RETURNING id, name, contact_name, email, phone, created_at
  `
  return NextResponse.json({ client: rows[0] })
}
