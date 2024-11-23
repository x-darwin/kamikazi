"use client";

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        if (result.error.type === "card_error" || result.error.type === "validation_error") {
          toast({
            title: "Payment Failed",
            description: result.error.message,
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
      } else {
        // Payment successful
        router.push("/success");
      }
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
    <div className="space-y-4">
      <PaymentElement />
    </div>
  );
}