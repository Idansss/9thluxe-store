// app/api/paystack/initialize/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function looksLikePaystackSecretKey(v: string) {
  return /^sk_(test|live)_/i.test(v.trim())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, amountNGN, metadata, meta } = body
    const paystackMeta = metadata ?? meta ?? {}

    const secret = (process.env.PAYSTACK_SECRET_KEY || '').trim()
    const cleanSecret = secret.toLowerCase().includes('bearer')
      ? secret.replace(/^bearer\s+/i, '').trim()
      : secret

    if (!cleanSecret) {
      return NextResponse.json(
        { error: 'PAYSTACK_SECRET_KEY missing in .env' },
        { status: 400 }
      )
    }
    if (!looksLikePaystackSecretKey(cleanSecret)) {
      return NextResponse.json(
        {
          error:
            'PAYSTACK_SECRET_KEY is not in the expected format (should start with sk_test_ or sk_live_). Copy the Secret Key from your Paystack Dashboard -> Settings -> API Keys & Webhooks. Current key format is invalid.',
        },
        { status: 400 }
      )
    }

    if (!email || !amountNGN || Number(amountNGN) <= 0) {
      return NextResponse.json(
        { error: 'Invalid email or amount' },
        { status: 400 }
      )
    }

    const amountKobo = Math.round(Number(amountNGN) * 100)

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        // ✅ must be "Bearer <secret>"
        Authorization: `Bearer ${cleanSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: 'NGN',
        metadata: paystackMeta,
      }),
    })

    const data = await res.json().catch(() => ({} as any))

    if (!res.ok || !data?.status || !data?.data?.authorization_url) {
      // Paystack returns { status: false, message: '...' } on errors
      const msg = data?.message || data?.error || 'Paystack init failed'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      access_code: data.data.access_code,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Init error' },
      { status: 500 }
    )
  }
}
