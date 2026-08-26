"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, LogIn } from "lucide-react"

/**
 * Why an admin page would not open.
 *
 * The admin pages used to answer this by redirecting — to /auth/login when
 * Clerk had no user, to /dashboard when the signed-in email was not on the
 * admin list — and rendering `null` on the way out. Both look identical from
 * the outside: the panel flashes blank and you end up somewhere else, with
 * nothing saying which check failed or which account you are actually using.
 * That cost real time to diagnose, so the reason is on screen now.
 *
 * This is not the access control. Every admin route is gated server-side by
 * requireAdmin() and by RLS on the tables underneath; this only explains a
 * door that is already locked.
 */

export type AdminDenialReason = "signed-out" | "not-admin"

interface AdminAccessDeniedProps {
  reason: AdminDenialReason
  /** The signed-in address, so it is obvious when it is the wrong account. */
  email?: string | null
}

export function AdminAccessDenied({ reason, email }: AdminAccessDeniedProps) {
  const signedOut = reason === "signed-out"

  return (
    <div className="mx-auto max-w-lg py-16">
      <Card className="border-2">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          {signedOut ? (
            <LogIn className="h-12 w-12 text-muted-foreground" />
          ) : (
            <ShieldAlert className="h-12 w-12 text-yellow-500" />
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {signedOut ? "You are signed out" : "Not an admin account"}
            </h1>
            <p className="text-muted-foreground">
              {signedOut
                ? "Your session has expired or this browser has no session. Sign in again to reach the admin panel."
                : "This account is signed in, but it is not on the admin list."}
            </p>
          </div>

          {!signedOut && (
            <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm text-foreground">
              {email || "this account has no email address"}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {signedOut ? (
              <Button asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/login">Switch account</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
