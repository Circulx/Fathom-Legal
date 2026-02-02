import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicAdminRoutes = [
    '/admin/login',
    '/admin/test-login',
    '/admin/standalone-login'
  ]
  
  const publicAdminApiRoutes = [
    '/api/admin/login',
    '/api/admin/check-first-user',
    '/api/admin/create-first-admin'
  ]
  
  // Check if this is a public route
  const isPublicAdminRoute = publicAdminRoutes.some(route => pathname.startsWith(route))
  const isPublicAdminApiRoute = publicAdminApiRoutes.some(route => pathname === route)
  
  if (isPublicAdminRoute || isPublicAdminApiRoute) {
    return NextResponse.next()
  }
  
  // Protect all admin page routes
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
  
  // Protect all admin API routes (except public ones)
  if (pathname.startsWith('/api/admin/')) {
    try {
      // Get the JWT token from the request
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })
      
      // Check if user is authenticated and has admin role
      if (!token || !token.role || (token.role !== 'admin' && token.role !== 'super-admin')) {
        console.log('🔒 Unauthorized access attempt to admin API route:', pathname)
        console.log('Token:', token ? 'Present but invalid role' : 'Not present')
        
        // Return 401 Unauthorized for API routes
        return NextResponse.json(
          { error: 'Unauthorized' }, 
          { status: 401 }
        )
      }
      
      console.log('✅ Authorized admin API access:', pathname, 'Role:', token.role)
      return NextResponse.next()
      
    } catch (error) {
      console.error('❌ Middleware error:', error)
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}