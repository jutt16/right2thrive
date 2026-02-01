"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getReward, redeemReward } from "@/lib/thrive-tokens-api";
import type { RewardDetail } from "@/lib/thrive-tokens-api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Gift } from "lucide-react";

export default function RewardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [reward, setReward] = useState<RewardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!id) return;
    getReward(id)
      .then((data) => {
        setReward(data ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleRedeemClick = () => setShowConfirm(true);

  const handleConfirmRedeem = async () => {
    if (!id) return;
    setRedeeming(true);
    setError(null);
    const result = await redeemReward(id);
    setRedeeming(false);
    setShowConfirm(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }
    router.push("/my-wellbeing/thrive-tokens/rewards?redeemed=1");
  };

  const handleCancel = () => setShowConfirm(false);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="aspect-video bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">This reward is not available.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/my-wellbeing/thrive-tokens/rewards">Back to rewards</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-foreground mb-2">{reward.name}</h1>
      <p className="text-lg text-muted-foreground mb-6">
        {reward.cost} ThriveTokens
      </p>

      {reward.image_url ? (
        <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-6">
          <img
            src={reward.image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center mb-6">
          <Gift className="h-16 w-16 text-muted-foreground" aria-hidden />
        </div>
      )}

      <p className="text-foreground mb-6">{reward.description}</p>

      <section className="mb-6" aria-labelledby="what-happens-heading">
        <h2 id="what-happens-heading" className="font-medium text-foreground mb-2">
          What happens next
        </h2>
        <p className="text-muted-foreground">
          Once redeemed, your tokens will be exchanged for this reward. You'll
          receive details about how to access it by email.
        </p>
      </section>

      {error && (
        <p className="text-muted-foreground mb-4 p-3 rounded-md bg-muted/50">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleRedeemClick}
          disabled={redeeming || !reward.can_afford}
          className="flex-1"
        >
          {redeeming ? "Processing…" : "Redeem reward"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/my-wellbeing/thrive-tokens/rewards">Not right now</Link>
        </Button>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={(open) => !redeeming && setShowConfirm(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redeem this reward?</AlertDialogTitle>
            <AlertDialogDescription>
              This will use {reward.cost} ThriveTokens. You can't undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={redeeming}>Cancel</AlertDialogCancel>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleConfirmRedeem();
              }}
              disabled={redeeming}
            >
              {redeeming ? "Processing…" : "Redeem"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
