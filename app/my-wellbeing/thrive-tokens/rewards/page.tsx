"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getRewards } from "@/lib/thrive-tokens-api";
import type { Reward } from "@/lib/thrive-tokens-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Gift } from "lucide-react";

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <Card className="overflow-hidden">
      {reward.image_url ? (
        <div className="aspect-video w-full bg-muted">
          <img
            src={reward.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center">
          <Gift className="h-12 w-12 text-muted-foreground" aria-hidden />
        </div>
      )}
      <CardContent className="pt-4">
        <p className="font-medium text-foreground">{reward.name}</p>
        <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
        <p className="text-sm font-medium text-foreground mt-2">
          {reward.cost} ThriveTokens
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        {reward.can_afford ? (
          <Button asChild className="w-full">
            <Link href={`/my-wellbeing/thrive-tokens/rewards/${reward.id}`}>
              Available now
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href={`/my-wellbeing/thrive-tokens/rewards/${reward.id}`}>
              Save for later
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function RewardsCatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redeemed = searchParams.get("redeemed") === "1";
  const [showRedeemedMsg, setShowRedeemedMsg] = useState(redeemed);
  const [isClient, setIsClient] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!isClient) return;
    getRewards()
      .then(setRewards)
      .finally(() => setLoading(false));
  }, [isClient]);

  if (!isClient) return null;

  useEffect(() => {
    if (redeemed && showRedeemedMsg) {
      const t = setTimeout(() => setShowRedeemedMsg(false), 5000);
      return () => clearTimeout(t);
    }
  }, [redeemed, showRedeemedMsg]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-foreground mb-6">Rewards</h1>

      {showRedeemedMsg && (
        <p
          className="mb-6 p-4 rounded-lg bg-muted/50 text-muted-foreground animate-in fade-in duration-300"
          role="status"
        >
          Your reward has been redeemed. You can browse more rewards below.
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded mb-4" />
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : rewards.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/20 p-8 text-center">
          <p className="text-muted-foreground">No rewards available right now.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later. New rewards are added from time to time.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Rewards are optional. You don't have to use your tokens.
          </p>
        </>
      )}
    </div>
  );
}

export default function RewardsCataloguePage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-medium text-foreground mb-6">Rewards</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded mb-4" />
              <div className="h-4 w-3/4 bg-muted rounded mb-2" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    }>
      <RewardsCatalogueContent />
    </Suspense>
  );
}
