import { WebBetaBanner } from '@/components/marketing/web-beta-banner'

export default function WebLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WebBetaBanner />
      {children}
    </>
  )
}
