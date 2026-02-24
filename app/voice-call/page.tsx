"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStatus from "@/hooks/useAuthStatus";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

export default function VoiceCallPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStatus();

  useEffect(() => {
    if (typeof window === "undefined" || !AGENT_ID) return;

    const existing = document.querySelector("elevenlabs-convai");
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      const el = document.createElement("elevenlabs-convai");
      el.setAttribute("agent-id", AGENT_ID);
      el.setAttribute("variant", "expanded");
      el.setAttribute("dismissible", "true");
      el.setAttribute("action-text", "Voice call support");
      el.setAttribute("start-call-text", "Start voice call");
      el.setAttribute("end-call-text", "End call");
      document.body.appendChild(el);
    };
    document.head.appendChild(script);

    return () => {
      const el = document.querySelector("elevenlabs-convai");
      if (el) el.remove();
      const s = document.querySelector('script[src*="convai-widget-embed"]');
      if (s) s.remove();
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-[#ff961b]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Phone className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Voice Call Support
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Have a voice conversation with our AI support agent. Speak naturally and get help with general wellbeing questions.
          </p>

          {AGENT_ID ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                <p className="text-sm font-medium text-primary mb-1">
                  Voice call widget
                </p>
                <p className="text-sm text-gray-600">
                  Look for the voice call button in the bottom-right corner of the screen. Click it to start a conversation.
                </p>
              </div>
              <p className="text-xs text-center text-gray-500">
                The widget may take a moment to load. Click the floating button to begin.
              </p>
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
              <p className="text-sm text-amber-800">
                Voice call is not configured yet. Contact support to enable this feature.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
