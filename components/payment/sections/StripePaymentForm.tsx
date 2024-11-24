"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import { useTheme } from "next-themes";

export function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();

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

  const appearance: Appearance = {
    theme: theme === 'dark' ? 'night' : 'stripe',
    variables: {
      colorPrimary: 'hsl(20, 100%, 50%)',
      colorBackground: theme === 'dark' ? '#000000' : '#ffffff',
      colorText: theme === 'dark' ? '#ffffff' : '#1a1a1a',
      colorDanger: '#dc2626',
      fontFamily: 'Inter var, sans-serif',
      borderRadius: '8px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid var(--border-color)',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid hsl(20, 100%, 50%)',
        boxShadow: '0 0 0 1px hsl(20, 100%, 50%)',
      },
      '.Label': {
        fontWeight: '500',
      },
    },
  };

  const paymentElementOptions: StripeElementsOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
    fields: {
      billingDetails: {
        name: 'auto',
        email: 'auto',
        phone: 'auto',
      },
    },
    business: {
      name: 'StreamVault',
    },
    appearance,
  };

  return (
    <div className="space-y-6">
      <PaymentElement options={paymentElementOptions} />
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
