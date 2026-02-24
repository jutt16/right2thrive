"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2 } from "lucide-react";
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
 * Button that reads text aloud using ElevenLabs TTS.
 * Requires ELEVENLABS_API_KEY configured on the server.
 */
export function TextToSpeechButton({
  text,
  className = "",
  size = "icon",
  variant = "ghost",
  label = "Listen",
}: TextToSpeechButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(async () => {
    if (!text?.trim()) return;

    if (isPlaying) {
      stop();
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `Request failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        stop();
        setIsLoading(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setError("Playback failed");
        stop();
        setIsLoading(false);
      };

      setIsPlaying(true);
      setIsLoading(false);
      await audio.play();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not play audio");
      setIsLoading(false);
      stop();
    }
  }, [text, isPlaying, stop]);

  const trimmedText = text?.trim();
  const disabled = !trimmedText || isLoading;

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
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{error ?? (isPlaying ? "Stop" : label)}</p>
          <p className="mt-1 text-xs text-muted-foreground">ElevenLabs AI voice</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
