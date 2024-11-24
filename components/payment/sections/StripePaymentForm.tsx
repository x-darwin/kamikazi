"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
  }, [stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Payment Failed",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
        router.push("/failed");
      }
      // Payment successful - redirect will be handled by Stripe
    } catch (error) {
      console.error("Payment confirmation error:", error);
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      router.push("/failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PaymentElement 
        options={{
          layout: "tabs",
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: 'hsl(var(--primary))',
              colorBackground: 'hsl(var(--background))',
              colorText: 'hsl(var(--foreground))',
              colorDanger: 'hsl(var(--destructive))',
              fontFamily: 'var(--font-inter)',
              borderRadius: '0.5rem',
              spacingUnit: '4px',
            },
          },
        }}
      />
      <Button 
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
        onClick={handleSubmit}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
}
