import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to login pages and API routes without authentication
  if (pathname.startsWith('/admin/login') || 
      pathname.startsWith('/admin/test-login') ||
      pathname.startsWith('/admin/standalone-login') ||
      pathname.startsWith('/api/admin/')) {
    return NextResponse.next()
  }
  
  // Protect all other admin routes
  if (pathname.startsWith('/admin')) {
    try {
      // Get the JWT token from the request
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })
      
      // Check if user is authenticated and has admin role
      if (!token || !token.role || (token.role !== 'admin' && token.role !== 'super-admin')) {
        console.log('🔒 Unauthorized access attempt to admin route:', pathname)
        console.log('Token:', token ? 'Present but invalid role' : 'Not present')
        
        // Redirect to login page
        const loginUrl = new URL('/admin/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
      
      console.log('✅ Authorized admin access:', pathname, 'Role:', token.role)
      return NextResponse.next()
      
    } catch (error) {
      console.error('❌ Middleware error:', error)
      // Redirect to login on error
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}