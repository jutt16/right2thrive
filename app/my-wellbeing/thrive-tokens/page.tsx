"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getThriveOverview } from "@/lib/thrive-tokens-api";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HOW_EARNED_ITEMS = [
  {
    type: "session",
    title: "Attending a session",
    description: "Tokens for taking part in your counselling session.",
  },
  {
    type: "reflection",
    title: "Submitting a reflection",
    description: "Tokens for sharing your thoughts after a session.",
  },
  {
    type: "tool",
    title: "Using a wellbeing tool",
    description: "Tokens for trying exercises or tools in the wellbeing hub.",
  },
  {
    type: "check_in",
    title: "Completing a check-in",
    description: "Tokens for completing a wellbeing check-in.",
  },
];

export default function ThriveTokensDetailPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
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
    getThriveOverview()
      .then((data) => setBalance(data?.balance ?? 0))
      .finally(() => setLoading(false));
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-foreground mb-6">Your ThriveTokens</h1>

      <div className="mb-8">
        {loading ? (
          <div className="h-16 w-32 bg-muted rounded animate-pulse" />
        ) : (
          <p className="text-4xl font-medium text-foreground tabular-nums">
            {balance ?? 0}
          </p>
        )}
        <p className="text-muted-foreground mt-2">
          Tokens don't expire and are never taken away.
        </p>
      </div>

      <section className="mb-8" aria-labelledby="how-earned-heading">
        <h2 id="how-earned-heading" className="text-lg font-medium text-foreground mb-4">
          How tokens are earned
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {HOW_EARNED_ITEMS.map((item) => (
            <AccordionItem key={item.type} value={item.type}>
              <AccordionTrigger className="text-left">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>{item.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Button asChild>
        <Link href="/my-wellbeing/thrive-tokens/rewards">Browse rewards</Link>
      </Button>
    </div>
  );
}
