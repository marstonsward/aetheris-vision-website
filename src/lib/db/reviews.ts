import { sql } from '@/lib/db'

// Auto-migrate: create the table if it doesn't exist yet.
// Safe to call multiple times (IF NOT EXISTS). Runs once per cold start.
let migrated = false
export async function ensureReviewsTable() {
  if (migrated) return
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_role TEXT,
      client_company TEXT,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      body TEXT NOT NULL,
      approved BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  migrated = true
}

export type Review = {
  id: number
  client_name: string
  client_role: string | null
  client_company: string | null
  rating: number
  body: string
  approved: boolean
  created_at: string
}

export type CreateReviewInput = {
  client_name: string
  client_role?: string | null
  client_company?: string | null
  rating: number
  body: string
}

export async function getAllReviews(): Promise<Review[]> {
  const rows = await sql`
    SELECT id, client_name, client_role, client_company, rating, body, approved, created_at
    FROM reviews
    ORDER BY approved ASC, created_at DESC
  `
  return rows as Review[]
}

export async function getApprovedReviews(): Promise<Review[]> {
  const rows = await sql`
    SELECT id, client_name, client_role, client_company, rating, body, approved, created_at
    FROM reviews
    WHERE approved = true
    ORDER BY created_at DESC
  `
  return rows as Review[]
}

export async function createReview(input: CreateReviewInput): Promise<Review> {
  const rows = await sql`
    INSERT INTO reviews (client_name, client_role, client_company, rating, body)
    VALUES (
      ${input.client_name},
      ${input.client_role ?? null},
      ${input.client_company ?? null},
      ${input.rating},
      ${input.body}
    )
    RETURNING id, client_name, client_role, client_company, rating, body, approved, created_at
  `
  return rows[0] as Review
}

export async function approveReview(id: number): Promise<void> {
  await sql`
    UPDATE reviews SET approved = true WHERE id = ${id}
  `
}

export async function rejectReview(id: number): Promise<void> {
  await sql`
    DELETE FROM reviews WHERE id = ${id}
  `
}
