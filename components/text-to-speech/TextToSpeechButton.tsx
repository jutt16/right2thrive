"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PUTER_SCRIPT = "https://js.puter.com/v2/";

declare global {
  interface Window {
    puter?: {
      ai?: {
        txt2speech: (
          text: string,
          options?: string | { language?: string; engine?: string }
        ) => Promise<HTMLAudioElement>;
      };
    };
  }
}

/** Load Puter.js script dynamically. */
function loadPuterScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.puter?.ai?.txt2speech) return Promise.resolve();

  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${PUTER_SCRIPT}"]`)) {
      if (window.puter?.ai?.txt2speech) return resolve();
      const check = setInterval(() => {
        if (window.puter?.ai?.txt2speech) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        clearInterval(check);
        reject(new Error("Puter script loaded but API not ready"));
      }, 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = PUTER_SCRIPT;
    script.async = true;
    script.onload = () => {
      const check = setInterval(() => {
        if (window.puter?.ai?.txt2speech) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(check);
        if (!window.puter?.ai?.txt2speech) reject(new Error("Puter API not available"));
        else resolve();
      }, 10000);
    };
    script.onerror = () => reject(new Error("Failed to load Puter script"));
    document.head.appendChild(script);
  });
}

/** Get best available voice; Chrome loads voices lazily. */
function getVoice(): Promise<SpeechSynthesisVoice | undefined> {
  return new Promise((resolve) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!synth) return resolve(undefined);

    const pickVoice = (v: SpeechSynthesisVoice[]) =>
      v.find((x) => x.lang.startsWith("en-GB")) ?? v.find((x) => x.lang.startsWith("en")) ?? v[0];

    const voices = synth.getVoices();
    if (voices.length > 0) return resolve(pickVoice(voices));

    const done = (voice: SpeechSynthesisVoice | undefined) => {
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      clearTimeout(timer);
      resolve(voice);
    };

    const onVoicesChanged = () => {
      const v = synth.getVoices();
      done(v.length > 0 ? pickVoice(v) : undefined);
    };
    synth.addEventListener("voiceschanged", onVoicesChanged);

    const timer = setTimeout(() => {
      const v = synth.getVoices();
      done(v.length > 0 ? pickVoice(v) : undefined);
    }, 3000);
  });
}

interface TextToSpeechButtonProps {
  text: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "ghost" | "outline" | "link" | "default" | "secondary" | "destructive";
  label?: string;
}

/**
 * Hybrid TTS: Web Speech API first (free, local), Puter.js fallback when unavailable.
 * No API keys required.
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
  const [supported, setSupported] = useState(true);
  const [ttsMethod, setTtsMethod] = useState<"browser" | "puter" | null>(null);
  const puterAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
    } else {
      getVoice();
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (puterAudioRef.current) {
      puterAudioRef.current.pause();
      puterAudioRef.current.currentTime = 0;
      puterAudioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speakWithPuter = useCallback(async (textToSpeak: string) => {
    await loadPuterScript();
    const audio = await window.puter!.ai!.txt2speech(textToSpeak, { language: "en-GB" });
    puterAudioRef.current = audio;
    audio.onended = () => {
      puterAudioRef.current = null;
      setIsPlaying(false);
      setIsLoading(false);
    };
    audio.onerror = () => {
      puterAudioRef.current = null;
      setError("Could not play audio");
      setIsPlaying(false);
      setIsLoading(false);
    };
    setIsPlaying(true);
    setIsLoading(false);
    setTtsMethod("puter");
    await audio.play();
  }, []);

  const speak = useCallback(async () => {
    if (!text?.trim() || !supported) return;

    if (isPlaying) {
      stop();
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const voice = await getVoice();
      const hasVoices =
        voice || (typeof window !== "undefined" && window.speechSynthesis.getVoices().length > 0);

      if (hasVoices) {
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = voice?.lang ?? "en";
        if (voice) utterance.voice = voice;

        utterance.onend = () => {
          setIsPlaying(false);
          setIsLoading(false);
        };
        utterance.onerror = async () => {
          setIsLoading(false);
          try {
            await speakWithPuter(text.trim());
          } catch {
            setError("Voice not available. Try again or check your connection.");
            setIsPlaying(false);
          }
        };

        setIsPlaying(true);
        setIsLoading(false);
        setTtsMethod("browser");
        window.speechSynthesis.speak(utterance);
      } else {
        await speakWithPuter(text.trim());
      }
    } catch (e) {
      try {
        await speakWithPuter(text.trim());
      } catch {
        setError(e instanceof Error ? e.message : "Could not speak");
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  }, [text, isPlaying, supported, stop, speakWithPuter]);

  const trimmedText = text?.trim();
  const disabled = !trimmedText || !supported || isLoading;

  if (!supported) {
    return null;
  }

  const tooltipSubtext =
    ttsMethod === "puter"
      ? "Using online voice (Puter)"
      : ttsMethod === "browser"
        ? "Uses your device's built-in voice"
        : "Listen (browser or online fallback)";

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
          <p className="mt-1 text-xs text-muted-foreground">{tooltipSubtext}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
