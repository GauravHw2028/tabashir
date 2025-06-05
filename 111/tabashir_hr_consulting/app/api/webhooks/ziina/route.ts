// app/api/ziina-webhook/route.ts
import { NextResponse } from 'next/server' 
import {prisma} from '@/lib/prisma'

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
    console.log("Payment intent status updated");
    const intent = event.data as {
      id:           string
      status:       string
      amount:       number
      currency_code:string
      success_url:  string
    }

    console.log(intent);

    // Getting resumeId from success_url
    // https://tabashir-ten.vercel.app/resume/new/cmbf9iyzh0003gtgwb9f9gfi5/skills?intent_id=4f624ae4-b78f-435b-aa1d-387a7de2a01e&payment_completed=true


    if(!event.data.success_url) {
      return NextResponse.json({ error: 'No success_url' }, { status: 400 })
    }

    // If it's the resume payment success url
    if(event.data.success_url.startsWith(`${process.env.NEXT_PUBLIC_APP_URL}/resume/new/`)){
      console.log("Resume payment success url");
      const resumeId = event.data.success_url.split('/resume/new/')[1].split('/')[0];

      if (intent.status === 'completed') {
        const resume = await prisma.aiResume.findUnique({
          where: {
            id: resumeId
          },
          select: {
            id: true,
            candidate: {
              select: {
                userId: true,
              },
            },
          },
        })

        console.log(resume);
        
        if (resume) {
          console.log("Resume found");
          await prisma.aiResume.update({
            where: { id: resume.id },
            data: { paymentStatus: true, paymentAmount: intent.amount, paymentDate: new Date() }
          })

          await prisma.payment.create({
            data: {
              amount: intent.amount,
              currency: intent.currency_code,
              status: intent.status === 'completed' ? 'COMPLETED' : 'FAILED',
              userId: resume.candidate.userId,
            }
          })

          console.log("Payment created");
        }
      }
    }

    // If it's the service payment success url
    if(event.data.success_url.startsWith(`${process.env.NEXT_PUBLIC_APP_URL}/service-details`)){
      // Getting search params from the url params from the url params from the url
      const url = new URL(event.data.success_url)
      const serviceId = url.searchParams.get('service_id')
      const userId = url.searchParams.get('userId')

      console.log(serviceId);
      console.log(userId);

      if(serviceId){
        if(serviceId === "ai-job-apply"){
          const service = await prisma.user.update({
            where: {
              id: serviceId
            },
            data: {
              jobCount: {
                increment: 200
              },
              aiJobApplyCount: {
                increment: 1
              },
            }
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
