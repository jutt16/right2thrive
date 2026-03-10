"use client";

import { motion } from "framer-motion";
import { springSmooth } from "@/lib/motion-variants";

interface TokenProgressVisualProps {
  balance: number;
  className?: string;
}

export function TokenProgressVisual({
  balance,
  className = "",
}: TokenProgressVisualProps) {
  const visualScale = Math.min(balance, 100);
  const fillPercent = Math.max(visualScale, 5);

  return (
    <div
      className={`h-2.5 w-full rounded-full bg-slate-100 overflow-hidden ${className}`}
      role="presentation"
      aria-hidden
    >
      <motion.div
        className="h-full rounded-full bg-[#00990d]"
        initial={false}
        animate={{ width: `${fillPercent}%` }}
        transition={springSmooth}
      />
    </div>
  );
}
