'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useEffect } from 'react';
import { PaymentGatewayProvider } from '@/components/payment/payment-gateway-context';


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Handle bfcache restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Refresh dynamic content if needed
        window.dispatchEvent(new CustomEvent('bfcache-restore'));
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <>
      <PaymentGatewayProvider>
      {children}
      </PaymentGatewayProvider>
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </>
  );
}