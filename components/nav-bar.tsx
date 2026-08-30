"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth, useUser } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Shield,
  Moon,
  Sun,
  Users,
  Layers,
  Library,
  GraduationCap,
  UsersRound,
  PlayCircle,
  FileQuestion,
  Trophy,
  User,
  HelpCircle,
  Mail,
  Copy,
  Check,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useCoachStatus } from "@/lib/use-coach"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { BetaBadge } from "@/components/beta-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** One row in the sidebar. `beta` tags a feature that is still settling. */
interface NavItem {
  href: string
  label: string
  icon: any
  tutorialId?: string
  beta?: boolean
}

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { isSignedIn, isLoaded, userId, signOut } = useAuth()
  // Decides whether the Coaching section is there at all. Resolves a moment
  // after mount; see lib/use-coach.ts for why that direction is the safe one.
  // Must stay below useAuth(): isSignedIn is a const, so reading it earlier
  // is a temporal dead zone that only shows up as a prerender failure.
  const { isCoach } = useCoachStatus(!!isSignedIn)

  const { user: clerkUser } = useUser()

  useEffect(() => {
    setMounted(true)
    if (clerkUser?.primaryEmailAddress?.emailAddress) {
      const email = clerkUser.primaryEmailAddress.emailAddress
      if (email === "henrytowen@googlemail.com" || email === "refzone.office@gmail.com") {
        setIsAdminUser(true)
      }
    }
  }, [clerkUser])

  useEffect(() => {
    router.prefetch("/dashboard")
    router.prefetch("/quizzes")
    router.prefetch("/scenarios")
    router.prefetch("/leaderboard")
    router.prefetch("/decision-lab")
  }, [])

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
    router.push("/")
  }

  const user = isSignedIn
  const userLoading = !isLoaded

  const [supportOpen, setSupportOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@refzone.com.au")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Children are the trigger. The account menu opens it by flipping
  // supportOpen instead, so the dialog also has to stand on its own.
  const SupportDialog = ({ children }: { children?: React.ReactNode }) => (
    <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>Have a question or need help? Reach out to us via email.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">support@refzone.com.au</span>
            <Button variant="outline" size="sm" onClick={handleCopyEmail} className="gap-2 cursor-pointer bg-transparent">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <a
            href="mailto:support@refzone.com.au"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium transition-colors hover:bg-primary/90"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </a>
          <Link
            href="/help"
            onClick={() => setSupportOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            <HelpCircle className="h-4 w-4" />
            Visit Help Center
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )

  const mainNavItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/scenarios", label: "Scenarios", icon: PlayCircle, tutorialId: "scenarios-nav" },
    { href: "/quizzes", label: "Quizzes", icon: FileQuestion, tutorialId: "quizzes-nav" },
    // Referees land here for packs a coach has set them, so it is not a
    // coach-only link even though coaches are the ones who build them.
    { href: "/packs", label: "Training Packs", icon: Layers },
    {
      href: "/decision-lab",
      label: "DecisionLab",
      icon: Users,
      tutorialId: "decision-lab-nav",
      beta: true,
    },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ]

  // Everything the coach account unlocks, in one place. Referees never see it;
  // for them these routes either redirect to /coach or do not apply.
  const coachNavItems: NavItem[] = [
    { href: "/coach", label: "Coach home", icon: GraduationCap },
    { href: "/scenarios/browse", label: "Scenario library", icon: Library },
    { href: "/coach/groups", label: "Groups", icon: UsersRound },
  ]

  // Everything that is not somewhere you train. This used to be six stacked
  // rows under the nav — account, settings, admin, support, theme, sign out —
  // which is more chrome than the six things a referee actually came to do.
  const accountNavItems: NavItem[] = [
    { href: "/account", label: "Account", icon: User, tutorialId: "account-link" },
    { href: "/settings", label: "Settings", icon: Settings, tutorialId: "settings-link" },
  ]

  if (isAdminUser) {
    accountNavItems.push({ href: "/admin", label: "Admin Panel", icon: Shield })
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    return (
      <Link
        href={item.href}
        data-tutorial={item.tutorialId}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="flex-1">{item.label}</span>
        {item.beta && <BetaBadge onPrimary={isActive} />}
      </Link>
    )
  }

  const NavLinks = () => (
    <>
      {mainNavItems.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}

      {isCoach && (
        <div className="pt-4">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Coaching
          </p>
          <div className="space-y-1">
            {coachNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      )}
    </>
  )

  /**
   * The account menu that replaced the footer stack. Signed-out visitors do
   * not get it — there would be nothing in it for them but the theme toggle,
   * which their footer still shows on its own.
   */
  const AccountMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          data-tutorial="settings-link"
          className="w-full justify-start gap-3 cursor-pointer text-muted-foreground"
        >
          <User className="h-5 w-5" />
          <span className="flex-1 text-left">Account & settings</span>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        {accountNavItems.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} data-tutorial={item.tutorialId} className="flex items-center">
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            setSupportOpen(true)
          }}
          className="flex items-center cursor-pointer"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Support
        </DropdownMenuItem>
        {mounted && (
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              toggleTheme()
            }}
            className="flex items-center cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            void handleSignOut()
          }}
          disabled={isLoading}
          className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoading ? "Signing out..." : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // This prevents the old hamburger menu from flashing
  if (userLoading) {
    return (
      <>
        {/* Desktop Navigation - show skeleton */}
        <nav className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#9114af] to-[#ff5eb8]">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                  <span className="text-foreground">efZone</span>
                </h1>
                <p className="text-xs text-muted-foreground">Train Your Skills</p>
              </div>
            </div>
          </div>
          <div className="flex-1" />
        </nav>
        {/* Mobile - just show centered logo, no hamburger */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
          <div className="flex items-center justify-center h-full">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-foreground">efZone</span>
              </span>
            </Link>
          </div>
        </div>
      </>
    )
  }

  if (user) {
    return (
      <>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                <div>
                  <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                  <span className="text-foreground">efZone</span>
                </h1>
                  <p className="text-xs text-muted-foreground">Train Your Skills</p>
                </div>
              </Link>
              <NotificationsDropdown />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <NavLinks />
            </div>
          </div>
          <div className="border-t p-3">
            <AccountMenu />
            <SupportDialog />
          </div>
        </nav>

        {/* Mobile Bottom Navigation - includes MobileTopBar */}
        <MobileBottomNav />

        {/* Padding for bottom nav */}
        <style>{`
          @media (max-width: 768px) {
            main {
              padding-bottom: 80px;
            }
          }
        `}</style>
      </>
    )
  }

  // Mobile users who aren't logged in will see just the centered logo
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#9114af] to-[#ff5eb8]">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
                  <span className="text-foreground">efZone</span>
                </h1>
                <p className="text-xs text-muted-foreground">Train Your Skills</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <NavLinks />
          </div>
        </div>
        <div className="border-t p-4">
          <div className="space-y-2">
            {mounted && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3 cursor-pointer bg-transparent"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile - just show centered logo with theme toggle, no hamburger menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b h-14">
        <div className="flex items-center justify-center h-full px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#9114af] to-[#ff5eb8] bg-clip-text text-transparent">R</span>
              <span className="text-foreground">efZone</span>
            </span>
          </Link>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer absolute right-4">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
