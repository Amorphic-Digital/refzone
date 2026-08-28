import type React from "react"
import type { Metadata } from "next"

import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerk-key"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomizationProvider } from "@/lib/customization-context"
import { ImportantNotificationModal } from "@/components/important-notification-modal"
import { GlobalTutorialWrapper } from "@/components/tutorial/global-tutorial-wrapper"
import { StructuredData } from "@/components/structured-data"
import { Toaster } from "@/components/ui/sonner"

import { Geist, Inter } from 'next/font/google'

const geistSans = Geist({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.refzone.com.au'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RefZone | Football Referee Training Platform — Scenarios, Quizzes & Analytics",
    template: "%s | RefZone",
  },
  description:
    "Train smarter with 500+ Laws of the Game quiz questions, 100+ match scenarios, and performance analytics. Free football referee training for Australia.",
  keywords: [
    "referee training",
    "football referee",
    "soccer referee",
    "referee education",
    "laws of the game",
    "LOTG",
    "IFAB Laws of the Game 2024",
    "referee quiz",
    "referee scenarios",
    "referee tools",
    "match official training",
    "Australian referee",
    "referee training Australia",
    "referee training app Australia",
    "how to become a football referee in Australia",
    "Football NSW referee training",
    "referee development",
    "referee certification",
    "referee exam preparation",
    "offside rule explained",
    "football referee quiz Australia",
  ],
  authors: [{ name: "RefZone" }],
  creator: "RefZone",
  publisher: "RefZone",
  generator: "RefZone",
  applicationName: "RefZone",
  referrer: "origin-when-cross-origin",
  category: "Education",
  classification: "Sports Education & Training",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RefZone",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "RefZone",
    title: "RefZone - Football Referee Training Platform",
    description: "Master the Laws of the Game with algorithm-driven scenarios, quizzes, and expert analysis. Join hundreds of referees improving their skills every day.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "RefZone - Football Referee Training Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RefZone - Football Referee Training Platform",
    description: "Master the Laws of the Game with algorithm-driven scenarios, quizzes, and expert analysis.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@refzone",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={`font-sans antialiased ${geistSans.className} ${inter.variable}`}>
        {/* Fallback, not Force: a forced redirect discards the ?redirect_url on
            a share link, dumping every invited referee on the dashboard instead
            of the scenario their coach sent them. Fallback still sends ordinary
            sign-ins to /dashboard. */}
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <CustomizationProvider>
              <GlobalTutorialWrapper>{children}</GlobalTutorialWrapper>
              <ImportantNotificationModal />
              <Toaster />
            </CustomizationProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
