import type { Metadata } from "next"
import { MarketingHeader } from "@/components/marketing/marketing-header"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { MarketingHomePage } from "@/components/marketing/marketing-home"

export const metadata: Metadata = {
  description:
    "Train smarter with 500+ Laws of the Game quiz questions, 100+ match scenarios, and performance analytics. Free football referee training for Australia.",
  alternates: { canonical: "https://www.refzone.com.au" },
}

export default function HomePage() {
  return (
    <div data-marketing="" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif', overflowX: 'clip' }}>
      <MarketingHeader />
      <MarketingHomePage />
      <MarketingFooter />
    </div>
  )
}
