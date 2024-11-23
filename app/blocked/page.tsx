import { Shield } from 'lucide-react';
import { ContactButton } from './components/contact-button';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCountryFromIP } from '@/lib/getCountryFromIP';
import { supabase } from '@/lib/supabase';

async function getBlockedInfo() {
  const headersList = await headers();
  const clientIP = 
    await headersList.get('x-forwarded-for')?.split(',')[0] || 
    await headersList.get('x-real-ip') || 
    '0.0.0.0';

  const countryCode = await getCountryFromIP(clientIP);
  
  const { data: blockedCountry } = await supabase
    .from('blocked_countries')
    .select('country_code')
    .eq('country_code', countryCode)
    .single();
  
  return {
    blocked: !!blockedCountry,
  };
}

export default async function BlockedPage() {
  const { blocked } = await getBlockedInfo();

  if (!blocked) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-destructive" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Access Restricted
          </h1>
          <div className="mt-4 space-y-4">
            <p className="text-muted-foreground">
              We apologize, but this service is not available in country due to regional restrictions.
            </p>
            <ContactButton />
          </div>
        </div>
      </div>
    </div>
  );
}
