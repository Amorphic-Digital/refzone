import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

/**
 * Renders a QR code as SVG for share links.
 *
 * Server-side so the QR library never ships to the browser, and cacheable so
 * a coach showing the same link on a projector does not re-render it.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  // Only ever encode links back into this app. Without this the endpoint is an
  // open QR generator that could be used to dress up a phishing link with a
  // refzone.com.au source.
  let target: URL
  try {
    target = new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  const host = request.headers.get("host")
  const allowedHosts = new Set(
    [host, "refzone.com.au", "www.refzone.com.au"].filter(Boolean) as string[],
  )

  if (!allowedHosts.has(target.host)) {
    return NextResponse.json({ error: "Only RefZone links can be encoded" }, { status: 400 })
  }

  try {
    const svg = await QRCode.toString(target.toString(), {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: 360,
      color: { dark: "#000000", light: "#ffffff" },
    })

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return NextResponse.json({ error: "Could not generate QR code" }, { status: 500 })
  }
}
