"use client";

import Link from "next/link";
import { TokenProgressVisual } from "./TokenProgressVisual";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface ThriveTokensCardProps {
  balance: number;
}

export function ThriveTokensCard({ balance }: ThriveTokensCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <CardContent className="pt-6 pb-2">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Coins className="h-4 w-4 text-[#00990d]" aria-hidden />
          <span className="text-sm font-medium">Your ThriveTokens</span>
        </div>
        <p className="text-4xl font-bold text-[#00990d] tabular-nums">
          {balance}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Tokens don&apos;t expire. Use them whenever you&apos;re ready.
        </p>
        <div className="mt-4">
          <TokenProgressVisual balance={balance} />
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6">
        <Button
          asChild
          className="w-full bg-[#00990d] hover:bg-[#007a0a] text-white"
        >
          <Link href="/my-wellbeing/thrive-tokens/rewards">View rewards</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
