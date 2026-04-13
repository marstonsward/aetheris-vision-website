import { NextRequest, NextResponse } from 'next/server'
import { getAllReviews, ensureReviewsTable } from '@/lib/db/reviews'

function isAdmin(req: NextRequest) {
  return req.cookies.get('av-admin-session')?.value === 'authenticated'
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await ensureReviewsTable()
    const reviews = await getAllReviews()
    return NextResponse.json({ reviews })
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
