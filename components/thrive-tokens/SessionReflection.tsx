"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EmojiOption {
  value: number;
  label: string;
  emoji: string;
}

interface SessionReflectionFormProps {
  emojiScale: EmojiOption[];
  onSubmit: (feeling: number, freeText: string) => Promise<void>;
  onSkip: () => void;
}

function SessionReflectionForm({
  emojiScale,
  onSubmit,
  onSkip,
}: SessionReflectionFormProps) {
  const [feeling, setFeeling] = useState<number | null>(null);
  const [freeText, setFreeText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(feeling ?? 0, freeText);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Label htmlFor="feeling" className="text-base">
            How are you feeling right now?
          </Label>
          <div
            id="feeling"
            role="group"
            aria-label="How are you feeling"
            className="flex flex-wrap gap-3 mt-3"
          >
            {emojiScale.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFeeling(opt.value)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
                  feeling === opt.value
                    ? "border-brand-teal bg-brand-teal/10"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {opt.emoji}
                </span>
                <span className="text-xs text-muted-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-base">
            Was anything helpful today? <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="notes"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Share if you'd like…"
            className="mt-2 min-h-[100px]"
            maxLength={500}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground mt-6 mb-6">
        You'll receive ThriveTokens for taking part, but it's okay to skip.
      </p>

      {error && (
        <p className="text-muted-foreground mb-4 p-3 rounded-md bg-muted/50">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1"
        >
          {submitting ? "Submitting…" : "Submit reflection"}
        </Button>
        <Button variant="outline" onClick={onSkip} disabled={submitting}>
          Skip for now
        </Button>
      </div>
    </>
  );
}

interface TokenEarnedProps {
  tokensAwarded: number;
  onContinue: () => void;
}

function TokenEarnedScreen({ tokensAwarded, onContinue }: TokenEarnedProps) {
  return (
    <div
      className="py-8 animate-in fade-in duration-500"
      role="status"
      aria-live="polite"
    >
      <p className="text-lg text-foreground mb-4">
        Thank you for engaging today.
      </p>
      <p className="text-3xl font-medium text-foreground tabular-nums mb-8">
        +{tokensAwarded} ThriveTokens
      </p>
      <Button onClick={onContinue}>Continue</Button>
    </div>
  );
}

type SessionReflectionVariant = "form" | "token-earned";

interface SessionReflectionProps {
  variant: "form";
  emojiScale: EmojiOption[];
  onSubmit: (feeling: number, freeText: string) => Promise<void>;
  onSkip: () => void;
}

interface TokenEarnedSessionReflectionProps {
  variant: "token-earned";
  tokensAwarded: number;
  onContinue: () => void;
}

export function SessionReflection(
  props:
    | SessionReflectionProps
    | TokenEarnedSessionReflectionProps
) {
  if (props.variant === "token-earned") {
    return (
      <TokenEarnedScreen
        tokensAwarded={props.tokensAwarded}
        onContinue={props.onContinue}
      />
    );
  }
  return (
    <SessionReflectionForm
      emojiScale={props.emojiScale}
      onSubmit={props.onSubmit}
      onSkip={props.onSkip}
    />
  );
}
