import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';
import { type UserMetadata } from './helpers/auth-types';
import { RolesEnums } from '@/helpers/types';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const PUBLIC_FILE = /\.(.*)$/;
  const PUBLIC_PATHS = ['/login', '/forgot-password'];

  if (
    request.nextUrl.pathname.startsWith('/_next') || // exclude Next.js internals
    request.nextUrl.pathname.startsWith('/api') || //  exclude all API routes
    request.nextUrl.pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(request.nextUrl.pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const isRoot = request.nextUrl.pathname === '/';

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userMetaData = user?.user_metadata as UserMetadata;

  if (user && !userMetaData?.user_role?.includes(RolesEnums.ADMIN) && request.nextUrl.pathname !== '/un-authorized') {
    url.pathname = '/un-authorized';
    return NextResponse.redirect(url);
  }

  if (user && (isRoot || PUBLIC_PATHS.includes(request.nextUrl.pathname))) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!user && (isRoot || !PUBLIC_PATHS.includes(request.nextUrl.pathname))) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
