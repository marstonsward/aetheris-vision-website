import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  if (!FORMSPREE_ID) {
    return NextResponse.json({ error: "Form not configured" }, { status: 503 });
  }

  const formData = await req.formData();
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = value.toString();
  });

  const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const body = await res.json().catch(() => ({}));

  return NextResponse.json(body, { status: res.status });
}
