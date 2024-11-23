import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a custom fetch implementation for server-side with correct types
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  return fetch(input, {
    ...init,
    cache: 'no-store',
  });
};

export async function GET() {
  try {
    // Create Supabase client with custom fetch
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: customFetch,
      },
    });

    const { data, error } = await supabase
      .from('payment_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching payment config:', error);
      return NextResponse.json({
        activeGateway: 'sumup',
        stripePublishableKey: null,
        isEnabled: false,
        status: 'error'
      }, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        }
      });
    }

    return NextResponse.json({
      activeGateway: data.active_gateway,
      stripePublishableKey: data.stripe_publishable_key,
      isEnabled: data.is_enabled,
      status: data.is_enabled ? 'available' : 'unavailable'
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  } catch (error) {
    console.error('Failed to get payment configuration:', error);
    return NextResponse.json({
      activeGateway: 'sumup',
      stripePublishableKey: null,
      isEnabled: false,
      status: 'error'
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      }
    });
  }
}
