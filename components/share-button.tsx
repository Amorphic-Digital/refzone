"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Copy, QrCode, Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  /** App-relative path, e.g. /scenarios/<id>. Absolute URLs are used as-is. */
  url: string
  /** Shown in the dialog and used for the native share sheet. */
  title: string
  label?: string
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  /** Render just the icon — for tight rows like the admin scenario list. */
  iconOnly?: boolean
  className?: string
}

export function ShareButton({
  url,
  title,
  label = "Share",
  variant = "outline",
  size = "default",
  iconOnly = false,
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Built in the browser so the link always carries the host the coach is
  // actually on (refzone.com.au, a preview deploy, or localhost).
  const absoluteUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
      ? `${window.location.origin}${url}`
      : url

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl)
      setCopied(true)
      toast.success("Link copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy — select the link and copy it manually")
    }
  }

  const openShare = async () => {
    // On phones, hand off to the OS share sheet so a coach can drop the link
    // straight into WhatsApp or a team chat. Desktop falls back to the dialog.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: absoluteUrl })
        return
      } catch {
        // User dismissed the sheet, or the browser refused — show the dialog.
      }
    }
    setOpen(true)
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={openShare} className={className} title="Share">
        <Share2 className="h-4 w-4" />
        {!iconOnly && label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share &ldquo;{title}&rdquo;</DialogTitle>
            <DialogDescription>
              Anyone with this link can open it after signing in to RefZone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input readOnly value={absoluteUrl} onFocus={(e) => e.currentTarget.select()} className="font-mono text-xs" />
            <Button onClick={copy} size="icon" variant="outline" title="Copy link">
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="rounded-lg bg-white p-3">
              {/* Generated server-side so no QR library ships to the browser. */}
              <img
                src={`/api/qr?url=${encodeURIComponent(absoluteUrl)}`}
                alt={`QR code linking to ${title}`}
                width={180}
                height={180}
                className="h-[180px] w-[180px]"
              />
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <QrCode className="h-3.5 w-3.5" />
              Put this on screen and the room can scan in
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
