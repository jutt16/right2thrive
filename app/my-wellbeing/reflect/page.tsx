"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitReflection } from "@/lib/thrive-tokens-api";
import { SessionReflection } from "@/components/thrive-tokens/SessionReflection";

const EMOJI_SCALE = [
  { value: 1, label: "Very low", emoji: "😔" },
  { value: 2, label: "Low", emoji: "😕" },
  { value: 3, label: "Okay", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Very good", emoji: "😊" },
];

export default function ReflectPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokensAwarded, setTokensAwarded] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (!localStorage.getItem("token")) {
      router.replace("/auth/login");
      return;
    }
  }, [router]);

  if (!isClient) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-foreground mb-6">
        Session reflection
      </h1>

      {submitted && tokensAwarded !== null ? (
        <SessionReflection
          variant="token-earned"
          tokensAwarded={tokensAwarded}
          onContinue={() => router.push("/my-wellbeing/dashboard")}
        />
      ) : (
        <SessionReflection
          variant="form"
          emojiScale={EMOJI_SCALE}
          onSubmit={async (feeling, freeText) => {
            const idempotencyKey = crypto.randomUUID();
            const feelingLabel = EMOJI_SCALE.find((e) => e.value === feeling)?.label;
            const parts: string[] = [];
            if (feelingLabel) parts.push(`Feeling: ${feelingLabel}`);
            if (freeText?.trim()) parts.push(freeText.trim());
            const content = parts.length ? parts.join(". ") : "Reflection submitted.";
            const result = await submitReflection({ content, idempotency_key: idempotencyKey });

            if ("error" in result) {
              throw new Error(result.error);
            }
            setTokensAwarded(result.tokens_awarded);
            setSubmitted(true);
          }}
          onSkip={() => router.push("/my-wellbeing/dashboard")}
        />
      )}
    </div>
  );
}
