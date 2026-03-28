import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware'

const PUBLIC_PATHS = ['/login', '/']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createMiddlewareSupabaseClient(request, response)

  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname
  const isPublicPath = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))

  // Sin sesión y ruta protegida → redirigir al login
  if (!session && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Con sesión y va al login → redirigir al dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}