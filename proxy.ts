import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { CLERK_PUBLISHABLE_KEY } from '@/lib/clerk-key'

// Routes that should completely skip Clerk middleware — no server-side API calls
const bypassPaths = [
  '/',
  '/features',
  '/referees',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/sitemap-page',
  '/sitemap.xml',
  '/robots.txt',
  '/auth',
  '/leaderboard',
  '/weekly-quiz',
  '/help',
  '/web',
  '/become-a-referee',
  '/search',
  '/topics',
  '/api/search',
  // Config health check: has to answer even when the Clerk key itself is the
  // broken thing, so it cannot sit behind Clerk middleware.
  '/api/health',
  '/api/web-beta-signup',
]

function shouldBypassClerk(pathname: string): boolean {
  return bypassPaths.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  )
}

const isPublicRoute = createRouteMatcher([
  '/auth/login(.*)',
  '/auth/sign-up(.*)',
  '/auth/sign-up-success(.*)',
  '/auth/callback(.*)',
  '/auth/forgot-password(.*)',
  '/auth/reset-password(.*)',
  '/user/(.*)',
  '/api/cron/(.*)',
  '/api/weekly-quiz(.*)',
  // Share landing pages. Deliberately NOT in bypassPaths: Clerk has to run so
  // the page can detect an existing session and send signed-in users straight
  // through to the content instead of showing them the sign-in prompt.
  '/share/(.*)',
])

// Main middleware: skip Clerk entirely for marketing routes
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Marketing + auth routes — bypass Clerk middleware completely
  if (shouldBypassClerk(pathname)) {
    return NextResponse.next()
  }

  // All other routes — go through Clerk. The publishable key is passed
  // explicitly so the handshake redirect targets the same validated Frontend
  // API host the browser bundle uses (see lib/clerk-key.ts).
  return clerkMiddleware(
    async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect()
      }
    },
    { publishableKey: CLERK_PUBLISHABLE_KEY },
  )(request, {} as any)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|json)).*)',
    '/(api|trpc)(.*)',
  ],
}
