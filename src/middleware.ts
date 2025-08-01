import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Si estamos en build time, no procesar rutas API
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.next();
  }

  // Para rutas API, asegurar que no se cacheen y sean dinámicas
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('🔧 Middleware procesando API:', request.nextUrl.pathname);
    console.log('🍪 Cookies en middleware:', request.cookies.getAll());
    
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('X-Runtime', 'dynamic');
    return response;
  }

  return NextResponse.next();
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
}; 