"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, LogIn } from "lucide-react"

/**
 * Joining a branch: one code, one button.
 *
 * The code is read out at a training night, so the field forces lower case and
 * strips spaces rather than bouncing "AB 12 CD" back as wrong.
 */
export function JoinBranchForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState("")

  const join = async () => {
    setIsJoining(true)
    setError("")

    try {
      const response = await fetch("/api/branches/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not join that branch")

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join that branch")
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="branch-code">Branch code</Label>
        <Input
          id="branch-code"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\s/g, "").toLowerCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter" && code.trim() && !isJoining) void join()
          }}
          placeholder="e.g. k7m2wp"
          maxLength={12}
          autoComplete="off"
          spellCheck={false}
          className="font-mono text-lg tracking-[0.3em]"
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Button onClick={join} disabled={!code.trim() || isJoining} className="w-full">
        {isJoining ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-4 w-4" />
        )}
        Join branch
      </Button>
    </div>
  )
}
