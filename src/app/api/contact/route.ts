import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// In-memory rate limiter
// Serverless note: state resets on cold starts, but works well for a low-
// traffic site. Limit: 5 submissions per IP per 10 minutes.
// ---------------------------------------------------------------------------
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ipMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  // ── Config check ───────────────────────────────────────────────────────────
  const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!FORMSPREE_ID) {
    return NextResponse.json({ error: "Form not configured" }, { status: 503 });
  }

  const formData = await req.formData();
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  // ── Honeypot check ─────────────────────────────────────────────────────────
  // Bots fill in hidden fields. Humans never see this field so it stays blank.
  if (data._gotcha) {
    // Return 200 to fool the bot into thinking it succeeded
    return NextResponse.json({ ok: true });
  }
  delete data._gotcha;

  // ── Forward to Formspree ───────────────────────────────────────────────────
  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: "https://aetherisvision.com",
      Origin: "https://aetherisvision.com",
    },
  });

  const body = await res.json().catch(() => ({}));
  return NextResponse.json(body, { status: res.status });
}
