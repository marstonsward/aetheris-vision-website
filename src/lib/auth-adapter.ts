/**
 * Custom NextAuth v4 adapter backed by Neon Postgres.
 * - Users are stored in the `clients` table (no separate users table).
 * - Magic-link tokens are stored in `verification_tokens`.
 */
import type { Adapter } from 'next-auth/adapters'
import { sql } from './db'

export function NeonAdapter(): Adapter {
  return {
    // ---- User methods -------------------------------------------------------

    async getUser(id) {
      const rows = await sql`
        SELECT id, contact_name AS name, email FROM clients WHERE id = ${Number(id)}
      `
      if (rows.length === 0) return null
      const r = rows[0]
      return { id: String(r.id), name: r.name, email: r.email, emailVerified: null }
    },

    async getUserByEmail(email) {
      const rows = await sql`
        SELECT id, contact_name AS name, email FROM clients WHERE email = ${email}
      `
      if (rows.length === 0) return null
      const r = rows[0]
      return { id: String(r.id), name: r.name, email: r.email, emailVerified: null }
    },

    async getUserByAccount({ providerAccountId }) {
      // Email provider — account IS the user; provider account id = email
      const rows = await sql`
        SELECT id, contact_name AS name, email FROM clients WHERE email = ${providerAccountId}
      `
      if (rows.length === 0) return null
      const r = rows[0]
      return { id: String(r.id), name: r.name, email: r.email, emailVerified: null }
    },

    async createUser({ name, email }: { name?: string | null; email: string }) {
      // Only allow clients that have already been added via the admin panel.
      // If the email exists, return that client. Otherwise insert a placeholder
      // so the magic-link flow doesn't crash (the dashboard will show no projects).
      const existing = await sql`
        SELECT id, contact_name AS name, email FROM clients WHERE email = ${email}
      `
      if (existing.length > 0) {
        const r = existing[0]
        return { id: String(r.id), name: r.name, email: r.email, emailVerified: null }
      }
      const inserted = await sql`
        INSERT INTO clients (name, contact_name, email)
        VALUES (${name ?? email}, ${name ?? email}, ${email})
        RETURNING id, contact_name AS name, email
      `
      const r = inserted[0]
      return { id: String(r.id), name: r.name, email: r.email, emailVerified: null }
    },

    async updateUser({ id, name, email }) {
      const rows = await sql`
        UPDATE clients
        SET contact_name = COALESCE(${name ?? null}, contact_name),
            email        = COALESCE(${email ?? null}, email)
        WHERE id = ${Number(id)}
        RETURNING id, contact_name AS name, email
      `
      const r = rows[0]
      return { id: String(r.id), name: r.name, email: r.email, emailVerified: null }
    },

    // ---- Account / Session (not used for email+JWT, but required) -----------

    async linkAccount() { return undefined },

    async createSession({ sessionToken, userId, expires }) {
      return { sessionToken, userId, expires }
    },

    async getSessionAndUser() { return null },

    async updateSession({ sessionToken }) { return { sessionToken, userId: '', expires: new Date() } },

    async deleteSession() { return undefined },

    // ---- Verification tokens (magic links) ----------------------------------

    async createVerificationToken({ identifier, token, expires }) {
      await sql`
        INSERT INTO verification_tokens (identifier, token, expires)
        VALUES (${identifier}, ${token}, ${expires})
        ON CONFLICT (identifier, token) DO NOTHING
      `
      return { identifier, token, expires }
    },

    async useVerificationToken({ identifier, token }) {
      const rows = await sql`
        DELETE FROM verification_tokens
        WHERE identifier = ${identifier} AND token = ${token}
        RETURNING identifier, token, expires
      `
      if (rows.length === 0) return null
      const r = rows[0]
      return { identifier: r.identifier, token: r.token, expires: new Date(r.expires) }
    },
  }
}
