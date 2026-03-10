"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getRewards, getThriveOverview } from "@/lib/thrive-tokens-api";
import type { Reward } from "@/lib/thrive-tokens-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Gift, Star, Tag, Coins, ChevronRight, Info } from "lucide-react";

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <Card className="overflow-hidden border border-gray-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        {reward.image_url ? (
          <div className="aspect-[4/3] w-full bg-muted">
            <img
              src={reward.image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#00990d]/10 to-[#00990d]/5 flex items-center justify-center">
            <Gift className="h-14 w-14 text-[#00990d]/50" aria-hidden />
          </div>
        )}
        {(reward.is_featured ?? false) && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
            <Star className="h-3.5 w-3.5" aria-hidden />
            Featured
          </span>
        )}
      </div>
      <CardContent className="pt-4 pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {reward.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              <Tag className="h-3 w-3" aria-hidden />
              {reward.category}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-foreground text-lg leading-tight">
          {reward.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {reward.description}
        </p>
        <p className="text-base font-semibold text-[#00990d] mt-3">
          {reward.cost} ThriveTokens
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-4">
        {reward.can_afford ? (
          <Button asChild className="w-full bg-[#00990d] hover:bg-[#007a0a]">
            <Link
              href={`/my-wellbeing/thrive-tokens/rewards/${reward.id}`}
              className="inline-flex items-center justify-center gap-1"
            >
              Redeem now
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link
              href={`/my-wellbeing/thrive-tokens/rewards/${reward.id}`}
              className="inline-flex items-center justify-center gap-1"
            >
              View details
              <ChevronRight className="h-4 w-4" />
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
  const [balance, setBalance] = useState<number | null>(null);
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
    Promise.all([getRewards(), getThriveOverview(1)])
      .then(([rewardsData, overview]) => {
        setRewards(rewardsData);
        setBalance(overview?.balance ?? null);
      })
      .finally(() => setLoading(false));
  }, [isClient]);

  useEffect(() => {
    if (redeemed && showRedeemedMsg) {
      const t = setTimeout(() => setShowRedeemedMsg(false), 5000);
      return () => clearTimeout(t);
    }
  }, [redeemed, showRedeemedMsg]);

  if (!isClient) return null;

  const featuredRewards = rewards.filter((r) => r.is_featured ?? false);
  const otherRewards = rewards.filter((r) => !(r.is_featured ?? false));
  const sortedFeatured = [...featuredRewards];
  const sortedOther = [...otherRewards];

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        {/* Hero */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Rewards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Earn ThriveTokens by completing sessions and engaging with wellbeing
            activities—then unlock the rewards below.
          </p>
        </header>

        {/* Balance card */}
        <Card className="mb-10 border-[#00990d]/30 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="h-5 w-5 text-[#00990d]" aria-hidden />
              <span className="text-sm font-medium">Your ThriveTokens balance</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            ) : (
              <p className="text-4xl font-bold text-[#00990d] tabular-nums">
                {balance ?? 0}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Tokens don&apos;t expire. Use them whenever you&apos;re ready.
            </p>
          </CardContent>
        </Card>

        {/* How to unlock */}
        <section
          className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          aria-labelledby="how-to-unlock-heading"
        >
          <h2
            id="how-to-unlock-heading"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            How to unlock rewards
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-gray-700">
            <li>
              Complete sessions, reflections, and wellbeing activities to earn
              ThriveTokens.
            </li>
            <li>
              When you&apos;ve saved enough tokens, choose a reward and tap
              &quot;Redeem now&quot;.
            </li>
            <li>
              You&apos;ll receive confirmation and any delivery details by
              email.
            </li>
            <li>
              Rewards are optional—you can keep saving or use them when it
              suits you.
            </li>
          </ol>
        </section>

        {showRedeemedMsg && (
          <div
            className="mb-8 p-4 rounded-xl bg-[#00990d]/10 border border-[#00990d]/20 text-[#00990d] animate-in fade-in duration-300"
            role="status"
          >
            <p className="font-medium">
              Your reward has been redeemed. You can browse more rewards below.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted rounded-lg mb-4" />
                <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : rewards.length === 0 ? (
          <Card className="border-gray-200 bg-white">
            <CardContent className="py-12 text-center">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">
                No rewards available right now.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later—new rewards are added from time to time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {featuredRewards.length > 0 && (
              <section
                className="mb-10"
                aria-labelledby="featured-rewards-heading"
              >
                <h2
                  id="featured-rewards-heading"
                  className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <Star className="h-5 w-5 text-amber-500" aria-hidden />
                  Featured rewards
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedFeatured.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </div>
              </section>
            )}

            {sortedOther.length > 0 && (
              <section
                className="mb-10"
                aria-labelledby="all-rewards-heading"
              >
                <h2
                  id="all-rewards-heading"
                  className="text-xl font-semibold text-gray-900 mb-4"
                >
                  {featuredRewards.length > 0 ? "More rewards" : "All rewards"}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedOther.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </div>
              </section>
            )}

            <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <Info className="h-5 w-5 shrink-0 text-gray-500 mt-0.5" aria-hidden />
              <p>
                Rewards are optional. You don&apos;t have to use your tokens.
                Delivery or access details will be sent by email after you
                redeem.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RewardsCataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50/80">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="h-10 w-48 bg-muted rounded mb-6 animate-pulse" />
            <div className="h-6 w-96 bg-muted rounded mb-10 animate-pulse" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-muted rounded-lg mb-4" />
                  <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <RewardsCatalogueContent />
    </Suspense>
  );
}
