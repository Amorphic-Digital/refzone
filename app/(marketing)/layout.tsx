import { MarketingHeader } from '@/components/marketing/marketing-header'
import { MarketingFooter } from '@/components/marketing/marketing-footer'
import { SearchHighlight } from '@/components/marketing/search-highlight'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-marketing="" className="overflow-x-hidden" style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}>
      <MarketingHeader />
      <SearchHighlight />
      {children}
      <MarketingFooter />
    </div>
  )
}
