import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const ADMIN_COOKIE = 'av-admin-session'

function isAdmin(request: NextRequest) {
  return request.cookies.get(ADMIN_COOKIE)?.value === 'authenticated'
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  // Cascades to projects and documents via FK ON DELETE CASCADE
  await sql`DELETE FROM clients WHERE id = ${Number(id)}`
  return NextResponse.json({ ok: true })
}
