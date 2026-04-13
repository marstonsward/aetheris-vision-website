CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
