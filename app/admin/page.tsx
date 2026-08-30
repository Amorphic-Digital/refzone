"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth, useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Shield, Users, Target, BookOpen, MessageSquare, TrendingUp, Settings, Bell, AlertCircle, Mail, GraduationCap, Film } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AdminAccessDenied, type AdminDenialReason } from "@/components/admin-access-denied"

interface Stats {
  totalUsers: number
  activeUsers: number
  totalScenarios: number
  totalQuizzes: number
  totalReports: number
  totalFeedback: number
  avgAccuracy: number
}

export default function AdminDashboard() {
  const { userId, isLoaded: authLoaded } = useAuth()
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Why the panel would not open, shown instead of a silent redirect.
  const [denied, setDenied] = useState<{ reason: AdminDenialReason; email: string | null } | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalScenarios: 0,
    totalQuizzes: 0,
    totalReports: 0,
    totalFeedback: 0,
    avgAccuracy: 0,
  })
  const router = useRouter()

  useEffect(() => {
    // Clerk resolves the session in the browser, so userId is null for the
    // first render or two. Redirecting before it settles bounces a signed-in
    // admin straight to the login page, which then tells them they are
    // already signed in. Wait for Clerk to say it has finished.
    if (!authLoaded || !userLoaded) return

    const checkAdminAndFetchStats = async () => {
      if (!userId) {
        setDenied({ reason: "signed-out", email: null })
        setIsLoading(false)
        return
      }

      // Check if user is admin by email
      const email = clerkUser?.primaryEmailAddress?.emailAddress
      const adminEmails = ["henrytowen@googlemail.com", "refzone.office@gmail.com"]
      if (!email || !adminEmails.includes(email)) {
        setDenied({ reason: "not-admin", email: email ?? null })
        setIsLoading(false)
        return
      }

      const supabase = createClient()

      setIsAdmin(true)

      // Fetch statistics
      const [usersRes, scenariosRes, quizzesRes, feedbackRes] = await Promise.all([
        supabase.from("profiles").select("id, last_activity_date", { count: "exact" }),
        supabase.from("scenario_responses").select("id", { count: "exact" }),
        supabase.from("quiz_attempts").select("id", { count: "exact" }),
        supabase.from("user_feedback").select("id", { count: "exact" }),
      ])

      const activeUsers =
        usersRes.data?.filter((u) => {
          if (!u.last_activity_date) return false
          const lastActive = new Date(u.last_activity_date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return lastActive >= weekAgo
        }).length || 0

      setStats({
        totalUsers: usersRes.count || 0,
        activeUsers,
        totalScenarios: scenariosRes.count || 0,
        totalQuizzes: quizzesRes.count || 0,
        totalReports: 0,
        totalFeedback: feedbackRes.count || 0,
        avgAccuracy: 0,
      })

      setIsLoading(false)
    }

    checkAdminAndFetchStats()
  }, [router, userId, clerkUser, authLoaded, userLoaded])

  if (denied) {
    return <AdminAccessDenied reason={denied.reason} email={denied.email} />
  }

  if (!isAdmin && !isLoading) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    )
  }


  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage RefZone platform and monitor usage</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Users</CardDescription>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.activeUsers} active this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Scenario Responses</CardDescription>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalScenarios}</div>
            <p className="text-xs text-muted-foreground mt-1">Total completions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Quiz Attempts</CardDescription>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground mt-1">Total attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>User Feedback</CardDescription>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground mt-1">Submissions received</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/content">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription className="mt-1">Manage scenarios, quizzes, and shop items</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/feedback">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>User Feedback</CardTitle>
                  <CardDescription className="mt-1">Review feedback submissions</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>



        <Link href="/admin/config">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>AI Configuration</CardTitle>
                  <CardDescription className="mt-1">Manage AI prompts and settings</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/notifications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Global Notifications</CardTitle>
                  <CardDescription className="mt-1">Send announcements to all users</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription className="mt-1">Detailed insights and user activity tracking</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/feature-closures">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Feature Closures</CardTitle>
                  <CardDescription className="mt-1">Temporarily close features with custom messages</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/coach-applications">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Coach Applications</CardTitle>
                  <CardDescription className="mt-1">Referees asking for a coach account — the scenario library and the pack builder</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/scenario-submissions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <Film className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Coach Submissions</CardTitle>
                  <CardDescription className="mt-1">Footage coaches have sent in — check the source, then approve into the library</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/web-beta-signups">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Mail className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Web Beta Signups</CardTitle>
                  <CardDescription className="mt-1">Emails from users wanting to be notified when RefZone Web launches</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Platform Health */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Platform Health</CardTitle>
          </div>
          <CardDescription>Overview of platform activity and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div>
                <p className="font-medium text-foreground">User Engagement</p>
                <p className="text-sm text-muted-foreground">Active users in the last 7 days</p>
              </div>
              <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                {stats.activeUsers > 0 ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%` : "0%"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div>
                <p className="font-medium text-foreground">Content Activity</p>
                <p className="text-sm text-muted-foreground">Scenarios + Quizzes completed</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
                {stats.totalScenarios + stats.totalQuizzes}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div>
                <p className="font-medium text-foreground">Generated Reports</p>
                <p className="text-sm text-muted-foreground">AI match reports created</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
                {stats.totalReports}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
