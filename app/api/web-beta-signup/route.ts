import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Upsert to avoid duplicates — if email exists, update the timestamp
    const { error } = await supabase
      .from('web_beta_signups')
      .upsert(
        { email: email.toLowerCase().trim(), signed_up_at: new Date().toISOString() },
        { onConflict: 'email' }
      )

    if (error) {
      console.error('Beta signup error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
