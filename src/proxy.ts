import { NextRequest, NextResponse } from 'next/server'

function buildCsp(nonce: string): string {
  return [
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://giscus.app https://cal.com https://app.cal.com`,
    "frame-src 'self' https://giscus.app https://cal.com https://app.cal.com",
    "style-src 'self' 'unsafe-inline' https://giscus.app",
    "img-src 'self' data: https://avatars.githubusercontent.com https://github.githubassets.com",
    "connect-src 'self' https://giscus.app https://api.github.com",
    "font-src 'self'",
    "default-src 'self'",
  ].join('; ')
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo/')
  ) {
    return NextResponse.next()
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
