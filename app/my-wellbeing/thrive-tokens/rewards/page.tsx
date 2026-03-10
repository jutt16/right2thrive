"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getRewards, getThriveOverview } from "@/lib/thrive-tokens-api";
import type { Reward } from "@/lib/thrive-tokens-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Gift, Star, Tag, Coins, ChevronRight, Info } from "lucide-react";
import { fadeInUp, staggerContainerSlow, springFast, springSmooth } from "@/lib/motion-variants";

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={springSmooth}
      className="h-full"
    >
      <Link
        href={`/my-wellbeing/thrive-tokens/rewards/${reward.id}`}
        className="block h-full group"
      >
        <motion.div
          className="h-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md transition-colors group-hover:border-[#00990d]/30"
          whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgb(0 0 0 / 0.12)" }}
          whileTap={{ scale: 0.99 }}
          transition={springFast}
        >
          <div className="relative overflow-hidden">
            {reward.image_url ? (
              <div className="aspect-[4/3] w-full bg-slate-100">
                <motion.img
                  src={reward.image_url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#00990d]/10 to-[#00990d]/5 flex items-center justify-center">
                <Gift className="h-14 w-14 text-[#00990d]/40" aria-hidden />
              </div>
            )}
            {(reward.is_featured ?? false) && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                <Star className="h-3.5 w-3.5" aria-hidden />
                Featured
              </span>
            )}
          </div>
          <CardContent className="pt-4 pb-2 px-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {reward.category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  <Tag className="h-3 w-3" aria-hidden />
                  {reward.category}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-lg leading-tight tracking-tight">
              {reward.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {reward.description}
            </p>
            <p className="text-base font-bold text-[#00990d] mt-3 tabular-nums">
              {reward.cost} ThriveTokens
            </p>
          </CardContent>
          <CardFooter className="pt-0 pb-4 px-4">
            {reward.can_afford ? (
              <Button
                className="w-full bg-[#00990d] hover:bg-[#008008] font-semibold shadow-sm"
                asChild
              >
                <span className="inline-flex items-center justify-center gap-1">
                  Redeem now
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Button>
            ) : (
              <Button variant="outline" className="w-full font-medium" asChild>
                <span className="inline-flex items-center justify-center gap-1">
                  View details
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Button>
            )}
          </CardFooter>
        </motion.div>
      </Link>
    </motion.div>
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
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      initial="initial"
      animate="animate"
      variants={staggerContainerSlow}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        {/* Hero */}
        <motion.header
          className="text-center mb-10"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00990d] mb-2">
            ThriveTokens
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Rewards
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Earn ThriveTokens by completing sessions and engaging with wellbeing
            activities—then unlock the rewards below.
          </p>
        </motion.header>

        {/* Balance card */}
        <motion.div
          className="mb-10"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <Card className="relative overflow-hidden border border-slate-200/90 bg-white shadow-md">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00990d] rounded-l-lg" />
            <CardHeader className="pb-2 pl-6">
              <div className="flex items-center gap-2 text-slate-500">
                <Coins className="h-5 w-5 text-[#00990d]" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Your ThriveTokens balance
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pl-6">
              {loading ? (
                <div className="h-10 w-24 bg-slate-100 rounded animate-pulse" />
              ) : (
                <motion.p
                  className="text-4xl font-bold text-[#00990d] tabular-nums tracking-tight"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ...springFast }}
                >
                  {balance ?? 0}
                </motion.p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                Tokens don&apos;t expire. Use them whenever you&apos;re ready.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* How to unlock */}
        <motion.section
          className="mb-10 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md"
          aria-labelledby="how-to-unlock-heading"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <h2
            id="how-to-unlock-heading"
            className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4"
          >
            How to unlock rewards
          </h2>
          <ol className="space-y-3 list-decimal list-inside text-slate-700 text-sm leading-relaxed">
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
        </motion.section>

        {showRedeemedMsg && (
          <motion.div
            className="mb-8 p-4 rounded-xl bg-[#00990d]/10 border border-[#00990d]/20 text-[#00990d]"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springSmooth}
          >
            <p className="font-medium">
              Your reward has been redeemed. You can browse more rewards below.
            </p>
          </motion.div>
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
          <motion.div variants={fadeInUp} transition={springSmooth}>
            <Card className="border-slate-200/90 bg-white shadow-md">
              <CardContent className="py-14 text-center">
                <Gift className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="font-medium text-slate-600">
                  No rewards available right now.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Check back later—new rewards are added from time to time.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {featuredRewards.length > 0 && (
              <motion.section
                className="mb-10"
                aria-labelledby="featured-rewards-heading"
                variants={fadeInUp}
                transition={springSmooth}
              >
                <h2
                  id="featured-rewards-heading"
                  className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"
                >
                  <Star className="h-4 w-4 text-amber-500" aria-hidden />
                  Featured rewards
                </h2>
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  variants={staggerContainerSlow}
                  initial="initial"
                  animate="animate"
                >
                  {sortedFeatured.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </motion.div>
              </motion.section>
            )}

            {sortedOther.length > 0 && (
              <motion.section
                className="mb-10"
                aria-labelledby="all-rewards-heading"
                variants={fadeInUp}
                transition={springSmooth}
              >
                <h2
                  id="all-rewards-heading"
                  className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4"
                >
                  {featuredRewards.length > 0 ? "More rewards" : "All rewards"}
                </h2>
                <motion.div
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  variants={staggerContainerSlow}
                  initial="initial"
                  animate="animate"
                >
                  {sortedOther.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                  ))}
                </motion.div>
              </motion.section>
            )}

            <motion.div
              className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm text-slate-600"
              variants={fadeInUp}
              transition={springSmooth}
            >
              <Info className="h-5 w-5 shrink-0 text-slate-400 mt-0.5" aria-hidden />
              <p>
                Rewards are optional. You don&apos;t have to use your tokens.
                Delivery or access details will be sent by email after you
                redeem.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
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
