import { sql } from './index'

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id          SERIAL PRIMARY KEY,
      date        DATE NOT NULL,
      vendor      TEXT NOT NULL,
      description TEXT NOT NULL,
      category    TEXT NOT NULL,
      amount      NUMERIC(10, 2) NOT NULL,
      tax_year    INTEGER NOT NULL,
      receipt_url TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id           SERIAL PRIMARY KEY,
      name         TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email        TEXT NOT NULL,
      phone        TEXT,
      address      TEXT,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id                       SERIAL PRIMARY KEY,
      client_id                INTEGER REFERENCES clients(id),
      name                     TEXT NOT NULL,
      status                   TEXT NOT NULL DEFAULT 'active',
      docuseal_submission_id   TEXT,
      signed_pdf_base64        TEXT,
      signed_at                TIMESTAMPTZ,
      start_date               DATE,
      end_date                 DATE,
      created_at               TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier  TEXT NOT NULL,
      token       TEXT NOT NULL,
      expires     TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `

  console.log('Tables created successfully')
}

createTables().catch(console.error)
