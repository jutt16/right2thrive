"use client";

/**
 * Soft, abstract progress visual (wave/plant feel).
 * No pressure, no urgency.
 */

interface TokenProgressVisualProps {
  balance: number;
  className?: string;
}

export function TokenProgressVisual({ balance, className = "" }: TokenProgressVisualProps) {
  // Soft visual: balance contributes to a gentle "fill" (max 100 tokens for visual scale)
  const visualScale = Math.min(balance, 100);
  const fillPercent = visualScale;

  return (
    <div
      className={`h-2 w-full rounded-full bg-muted overflow-hidden ${className}`}
      role="presentation"
      aria-hidden
    >
      <div
        className="h-full rounded-full bg-brand-teal/60 transition-all duration-500 ease-out"
        style={{ width: `${Math.max(fillPercent, 5)}%` }}
      />
    </div>
  );
}
