"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { PaymentCardIcons } from "@/components/payment/payment-card-icons";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold tracking-tight">StreamVault</h3>
            <p className="text-base text-muted-foreground">
              Your premium entertainment solution
            </p>
            <div className="pt-4">
              <PaymentCardIcons />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-base font-medium">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-base font-medium">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-base font-medium">Connect With Us</h4>
            <Button
              variant="outline"
              size="lg"
              className="w-full text-sm gap-2 font-normal"
              onClick={() => window.open("https://wa.me/1234567890", "_blank")}
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} StreamVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}