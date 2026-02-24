"use client";

import { useEffect } from "react";

/**
 * ElevenLabs ElevenAgents voice call widget.
 * Renders when NEXT_PUBLIC_ELEVENLABS_AGENT_ID is set.
 * See ELEVENLABS_SETUP_GUIDE.md for setup instructions.
 */
export default function VoiceCallAgent() {
  useEffect(() => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    if (!agentId || typeof document === "undefined") return;

    const existing = document.querySelector("elevenlabs-convai");
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    script.onload = () => {
      const el = document.createElement("elevenlabs-convai");
      el.setAttribute("agent-id", agentId);
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

  return null;
}
