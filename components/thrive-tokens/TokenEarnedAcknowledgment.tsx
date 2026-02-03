"use client";

import Link from "next/link";

/**
 * Calm in-page acknowledgment that the user earned ThriveTokens (e.g. after an assessment).
 * No pressure, no excitement. Optional link to dashboard.
 */

interface TokenEarnedAcknowledgmentProps {
  /** If provided, show "+X ThriveTokens"; otherwise generic "You've earned ThriveTokens for completing this." */
  tokensAwarded?: number | null;
  /** Optional. If true, show link to dashboard. */
  showDashboardLink?: boolean;
}

export function TokenEarnedAcknowledgment({
  tokensAwarded,
  showDashboardLink = true,
}: TokenEarnedAcknowledgmentProps) {
  return (
    <div
      className="rounded-lg border border-border bg-muted/30 p-4 text-foreground animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-foreground">
        {tokensAwarded != null && tokensAwarded > 0
          ? `You've earned ${tokensAwarded} ThriveTokens for completing this.`
          : "You've earned ThriveTokens for completing this."}
      </p>
      {showDashboardLink && (
        <p className="mt-1 text-sm text-muted-foreground">
          You can see your balance on your{" "}
          <Link
            href="/my-wellbeing/dashboard"
            className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            wellbeing dashboard
          </Link>
          .
        </p>
      )}
    </div>
  );
}
