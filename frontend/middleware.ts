import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // We check for the auth_token cookie
  const authToken = request.cookies.get('auth_token')?.value
  // We check for a "gate" cookie that allows seeing the login page
  const adminGate = request.cookies.get('admin_gate')?.value
  const accessSecret = searchParams.get('access')

  const gateSecret = process.env.ADMIN_GATE_SECRET

  // 1. Secret Gate for the Login Page
  if (pathname === '/admin/login') {
    // If they already have the gate open, or provide the secret key, OR are already logged in (have a token)
    if (adminGate === 'open' || accessSecret === gateSecret || authToken) {
      const response = authToken 
        ? NextResponse.redirect(new URL('/admin', request.url)) 
        : NextResponse.next()

      // Set/Refresh the gate cookie if they used the secret key or are logged in
      if (accessSecret === gateSecret || authToken) {
        response.cookies.set('admin_gate', 'open', {
          path: '/',
          maxAge: 86400 * 7, // 7 days
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      }
      return response
    }

    // Hide the login page if the gate is closed
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  // 2. Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // If they are logged in, ensure the gate stays open
    const response = NextResponse.next()
    if (adminGate !== 'open') {
      response.cookies.set('admin_gate', 'open', {
        path: '/',
        maxAge: 86400 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }
    return response
  }

  return NextResponse.next()
}

// Only run middleware on admin routes for better performance
export const config = {
  matcher: ['/admin/:path*'],
}
