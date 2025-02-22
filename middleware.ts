import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';

const protectedPaths = [
  '/protected',
  '/protected/dashboard',
  '/protected/profile',
  '/protected/add-member',
  '/protected/members',
  '/protected/reset-password',
];

export async function middleware(request: NextRequest) {
  // セッション更新とリダイレクト処理
  const sessionResponse = await updateSession(request);
  if (sessionResponse.status !== 200) {
    return sessionResponse;
  }

  // protectedパス配下のアクセスチェック
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const path = request.nextUrl.pathname;

    // 許可されたパス以外は404へリダイレクト
    if (!protectedPaths.includes(path)) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  return sessionResponse;
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
