"use client";

import Link from "next/link";
import { TokenProgressVisual } from "./TokenProgressVisual";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ThriveTokensCardProps {
  balance: number;
}

export function ThriveTokensCard({ balance }: ThriveTokensCardProps) {
  return (
    <Card className="border-muted bg-muted/20">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground mb-2">Your ThriveTokens</p>
        <p className="text-3xl font-medium text-foreground tabular-nums">{balance}</p>
        <div className="mt-4">
          <TokenProgressVisual balance={balance} />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" asChild className="w-full">
          <Link href="/my-wellbeing/thrive-tokens">View rewards</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
