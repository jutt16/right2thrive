"use client";

import { Button } from "@/components/ui/button";

/**
 * Token Earned micro-screen.
 * Soft fade, calm message, no confetti or excitement.
 */

interface TokenEarnedScreenProps {
  tokensAwarded: number;
  onContinue: () => void;
}

export function TokenEarnedScreen({ tokensAwarded, onContinue }: TokenEarnedScreenProps) {
  return (
    <div
      className="py-8 animate-in fade-in duration-500"
      role="status"
      aria-live="polite"
    >
      <p className="text-lg text-foreground mb-4">
        Thank you for engaging today.
      </p>
      <p className="text-3xl font-medium text-foreground tabular-nums mb-8">
        +{tokensAwarded} ThriveTokens
      </p>
      <Button onClick={onContinue}>Continue</Button>
    </div>
  );
}
