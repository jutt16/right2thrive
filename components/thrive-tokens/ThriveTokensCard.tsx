"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TokenProgressVisual } from "./TokenProgressVisual";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { springFast } from "@/lib/motion-variants";

interface ThriveTokensCardProps {
  balance: number;
}

export function ThriveTokensCard({ balance }: ThriveTokensCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={springFast}
      className="h-full"
    >
      <Card className="relative h-full overflow-hidden border border-slate-200/90 bg-white shadow-md">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00990d] rounded-l-lg" />
        <CardContent className="relative pt-6 pb-2 pl-6">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Coins className="h-4 w-4 text-[#00990d]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Your ThriveTokens
            </span>
          </div>
          <motion.p
            className="text-4xl font-bold text-[#00990d] tabular-nums tracking-tight"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...springFast }}
          >
            {balance}
          </motion.p>
          <p className="text-sm text-slate-500 mt-1">
            Tokens don&apos;t expire. Use them whenever you&apos;re ready.
          </p>
          <div className="mt-4">
            <TokenProgressVisual balance={balance} />
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-6 pl-6">
          <Button
            asChild
            className="w-full bg-[#00990d] hover:bg-[#008008] text-white font-semibold shadow-sm hover:shadow transition-shadow"
          >
            <Link href="/my-wellbeing/thrive-tokens/rewards">View rewards</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
