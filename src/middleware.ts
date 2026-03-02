import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.PREVIEW_PASSWORD ?? "marston-av";

function buildCsp(nonce: string): string {
  return [
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://giscus.app https://cal.com https://app.cal.com`,
    "frame-src 'self' https://giscus.app https://cal.com https://app.cal.com",
    "style-src 'self' 'unsafe-inline' https://giscus.app",
    "img-src 'self' data: https://avatars.githubusercontent.com https://github.githubassets.com",
    "connect-src 'self' https://giscus.app https://api.github.com",
    "font-src 'self'",
    "default-src 'self'",
  ].join("; ");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow Next.js internals and static assets through unconditionally
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo/")
  ) {
    return NextResponse.next();
  }

  // Auth check
  const auth = request.headers.get("authorization");
  let authed = false;
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const password = decoded.includes(":") ? decoded.split(":")[1] : decoded;
    if (password === PASSWORD) authed = true;
  }

  if (!authed) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Aetheris Vision Preview"',
      },
    });
  }

  // Generate a per-request nonce for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  // Forward nonce to the app (layout can read it for explicit <Script> components)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
