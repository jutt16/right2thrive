// components/floating-chat-button.tsx - FIXED
"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import useAuthStatus from "@/hooks/useAuthStatus";

export default function FloatingChatButton() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStatus();
  
  if (pathname === "/chat") return null;
  if (!isAuthenticated) return null;

  return (
    <Link
      href="/chat"
      aria-label="Open secure chat"
      className="
        fixed bottom-6 right-6 z-50
        group
      "
    >
      <div
        className="
          flex items-center gap-3
          rounded-full
          bg-primary px-5 py-3
          text-white
          shadow-xl
          transition-all duration-300
          hover:shadow-2xl hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        "
      >
        <div className="relative">
          <MessageCircle className="h-5 w-5" />
          <span className="
            absolute -top-1 -right-1
            h-2.5 w-2.5
            rounded-full bg-green-400
            ring-2 ring-primary
          " />
        </div>
        <span className="text-sm font-medium whitespace-nowrap">
          Message your wellbeing coach
        </span>
      </div>
    </Link>
  );
}