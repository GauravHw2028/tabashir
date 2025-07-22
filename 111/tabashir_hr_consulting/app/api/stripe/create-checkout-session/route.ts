import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { paymentData } from '@/lib/payment-data';

export async function POST(request: Request) {
  try {
    const { serviceId, userId, resumeId, successUrl, cancelUrl } = await request.json();

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get service data
    const service = Object.values(paymentData).find(s => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    // Build success URL with metadata
    const finalSuccessUrl = successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/service-details?payment_completed=true&service_id=${serviceId}&user_info=${userId}`;
    
    // Build cancel URL
    const finalCancelUrl = cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/service-details`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: service.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        serviceId,
        userId,
        resumeId: resumeId || '',
        serviceTitle: service.title,
      },
      customer_email: userId, // You can pass user email here if available
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 