import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { type UserMetadata } from './client/auth/types';
import { RolesEnums } from '@/helpers/types';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

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

  // if (user && !userMetaData?.user_role?.includes(RolesEnums.ADMIN) && request.nextUrl.pathname !== '/un-authorized') {
  //   url.pathname = '/un-authorized';
  //   return NextResponse.redirect(url);
  // }

  if (user && (isRoot || PUBLIC_PATHS.includes(request.nextUrl.pathname))) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!user && (isRoot || !PUBLIC_PATHS.includes(request.nextUrl.pathname))) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
