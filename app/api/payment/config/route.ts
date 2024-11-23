import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getPaymentConfig, updatePaymentConfig } from '@/lib/payment-config';

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAuth(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const config = await getPaymentConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to get payment configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get payment configuration' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAuth(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    if (typeof body.isEnabled !== 'boolean' && !body.activeGateway) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const updates = {
      isEnabled: body.isEnabled,
      activeGateway: body.activeGateway,
      sumupKey: body.sumupKey?.trim(),
      sumupMerchantEmail: body.sumupMerchantEmail?.trim(),
      stripePublishableKey: body.stripePublishableKey?.trim(),
      stripeSecretKey: body.stripeSecretKey?.trim(),
    };

    // Validate gateway-specific credentials
    if (updates.activeGateway === 'stripe') {
      if (!updates.stripePublishableKey || !updates.stripeSecretKey) {
        return NextResponse.json(
          { error: 'Stripe publishable key and secret key are required' },
          { status: 400 }
        );
      }
    } else if (updates.activeGateway === 'sumup') {
      if (!updates.sumupKey || !updates.sumupMerchantEmail) {
        return NextResponse.json(
          { error: 'SumUp API key and merchant email are required' },
          { status: 400 }
        );
      }
    }

    const updatedConfig = await updatePaymentConfig(updates);
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Failed to update payment configuration:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update payment configuration' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';