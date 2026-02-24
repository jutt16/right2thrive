"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import useAuthStatus from "@/hooks/useAuthStatus";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

export default function FloatingVoiceCallButton() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStatus();

  if (pathname === "/voice-call") return null;
  if (!isAuthenticated) return null;
  if (!AGENT_ID) return null;

  return (
    <Link
      href="/voice-call"
      aria-label="Voice call support"
      className="fixed bottom-24 right-6 z-50 group"
    >
      <div
        className="
          flex items-center gap-3
          rounded-full
          bg-teal-600 px-5 py-3
          text-white
          shadow-xl
          transition-all duration-300
          hover:shadow-2xl hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        "
      >
        <Phone className="h-5 w-5" />
        <span className="text-sm font-medium whitespace-nowrap">
          Voice call support
        </span>
      </div>
    </Link>
  );
}
