// app/api/ziina-webhook/route.ts
import { NextResponse } from 'next/server' 

export const config = { api: { bodyParser: false } }

export async function POST(request: Request) {
  // 1) Read raw body (we turn off Next’s auto JSON parsing, because we may need the raw to verify HMAC)
  const payload = await request.text()
  const signature = request.headers.get('x-hmac-signature')   // if you set up a secret

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  console.log(signature);

  const secret = process.env.ZIINA_WEBHOOK_SECRET

  console.log(secret);

  if (!secret) {
    return NextResponse.json({ error: 'No secret' }, { status: 400 })
  }

  console.log(payload);

  // 3) Parse JSON
  const event = JSON.parse(payload) as any

  console.log(event);

  // 4) For a Payment Intent status update:
  if (event.event === 'payment_intent.status.updated') {
    const intent = event.data as {
      id:           string
      status:       string
      amount:       number
      currency_code:string
      success_url:  string
    }

    // Getting resumeId from success_url
    // https://tabashir-ten.vercel.app/resume/new/cmbf9iyzh0003gtgwb9f9gfi5/skills?intent_id=4f624ae4-b78f-435b-aa1d-387a7de2a01e&payment_completed=true

    const resumeId = event.data.success_url.split('/resume/new/')[1].split('/')[0]

    console.log(resumeId);

    if (intent.status === 'completed') {
      
    }
  }

  return NextResponse.json({ received: true })
}
