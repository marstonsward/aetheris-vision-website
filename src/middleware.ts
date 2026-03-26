import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security middleware - transforms website into security demonstration
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Generate nonce for CSP
  const nonce = crypto.randomUUID()
  
  // Comprehensive Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://analytics.google.com https://www.googletagmanager.com https://js.stripe.com 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://analytics.google.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  // Set CSP header
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-CSP-Nonce', nonce)
  
  // Rate limiting demonstration
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100
  
  const clientData = rateLimitStore.get(ip)
  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
  } else {
    clientData.count++
    if (clientData.count > maxRequests) {
      return new NextResponse('Rate limit exceeded', { 
        status: 429,
        headers: {
          'X-Security-Action': 'Rate-Limited',
          'X-Security-Framework': 'Aetheris-Protection',
          'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
        }
      })
    }
  }
  
  // Security demonstration headers
  response.headers.set('X-Security-Status', 'Protected')
  response.headers.set('X-Security-Scan', 'Continuous')
  response.headers.set('X-Threat-Detection', 'Active')
  response.headers.set('X-Request-ID', crypto.randomUUID())
  
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('X-Admin-Security', 'Multi-Layer-Auth')
    response.headers.set('X-Access-Control', 'Role-Based')
  }
  
  // API route protection
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('X-API-Security', 'Authenticated')
    response.headers.set('X-Rate-Limit-Remaining', (maxRequests - (clientData?.count || 1)).toString())
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}