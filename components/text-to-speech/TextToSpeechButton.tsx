"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "ghost" | "outline" | "link" | "default" | "secondary" | "destructive";
  label?: string;
}

/**
 * Button that reads the given text aloud using the browser's built-in Web Speech API.
 * No API keys or server required—works offline with the device's voice.
 */
export function TextToSpeechButton({
  text,
  className = "",
  size = "icon",
  variant = "ghost",
  label = "Listen",
}: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(() => {
    if (!text?.trim() || !supported) return;

    if (isPlaying) {
      stop();
      return;
    }

    setError(null);

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = "en-GB";

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setError("Voice not available");
        setIsPlaying(false);
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not speak");
      setIsPlaying(false);
    }
  }, [text, isPlaying, supported, stop]);

  const trimmedText = text?.trim();
  const disabled = !trimmedText || !supported;

  if (!supported) {
    return null;
  }

  const button = (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={speak}
      disabled={disabled}
      className={className}
      aria-label={label}
      title={error ?? (isPlaying ? "Stop" : label)}
    >
      <Volume2 className="h-4 w-4" />
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{error ?? (isPlaying ? "Stop" : label)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Uses your device&apos;s built-in voice
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
