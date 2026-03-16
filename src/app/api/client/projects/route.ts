import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await sql`
    SELECT id, name, status, start_date, signed_at, docuseal_submission_id
    FROM projects
    WHERE client_id = ${Number(session.user.id)}
    ORDER BY created_at DESC
  `

  return NextResponse.json({ projects })
}
