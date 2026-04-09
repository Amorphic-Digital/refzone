import { requireAdmin } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/service"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export const metadata = { title: 'Web Beta Signups — Admin' }

interface Signup {
  id: string
  email: string
  signed_up_at: string
  created_at: string
}

export default async function WebBetaSignupsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/auth/login')
  }

  const supabase = createServiceClient()
  const { data: signups, error } = await supabase
    .from('web_beta_signups')
    .select('*')
    .order('created_at', { ascending: false })

  const list: Signup[] = signups || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Admin
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Web Beta Signups</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Users who want to be notified when RefZone Web launches
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {list.length} signup{list.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Error loading signups: {error.message}. Make sure the <code className="bg-muted px-1 rounded">web_beta_signups</code> table
              exists. Run the SQL in <code className="bg-muted px-1 rounded">scripts/create_web_beta_signups.sql</code>.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Signups list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email List
          </CardTitle>
          <CardDescription>
            All emails collected from the RefZone Web beta banner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No signups yet. The beta banner on /web pages collects emails.
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">#</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((signup, i) => (
                    <tr key={signup.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-mono">{signup.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(signup.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Copy all emails */}
          {list.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">All emails (comma-separated for easy copy):</p>
              <div className="bg-muted rounded-lg p-3 text-xs font-mono break-all select-all">
                {list.map((s) => s.email).join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
