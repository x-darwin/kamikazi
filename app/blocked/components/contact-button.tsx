"use client";

import { MessageCircle } from "lucide-react";
import { Button } from '@/components/ui/button';

export function ContactButton() {
  return (
    <Button
      className="mt-6 w-full"
      onClick={() => window.location.href = 'mailto:support@streamvault.com'}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Contact Support
    </Button>
  );
}