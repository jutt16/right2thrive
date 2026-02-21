"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/navbar";

const DASHBOARD_ROUTES = [
  "/my-wellbeing",
  "/wellbeing-hub",
  "/profile",
  "/my-bookings",
  "/complaints",
  "/chat",
];

function isDashboardRoute(pathname: string) {
  return DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export default function AppShell() {
  const pathname = usePathname();
  const onDashboard = pathname ? isDashboardRoute(pathname) : false;

  if (onDashboard) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
          <Link
            href="/my-wellbeing/dashboard"
            className="flex items-center gap-2.5 shrink-0 min-w-0"
          >
            <Image
              src="/right2thrive-logo-no.jpg"
              alt="Right2Thrive UK"
              width={36}
              height={36}
              className="rounded-full shrink-0"
            />
            <span className="font-bold text-[#00990d] text-base truncate">
              Right2Thrive UK
            </span>
          </Link>
          <a
            href="tel:116123"
            className="text-xs text-gray-600 hover:text-[#00990d] transition-colors whitespace-nowrap shrink-0"
          >
            Need support? 116 123 · SHOUT 85258
          </a>
        </div>
      </header>
    );
  }

  return (
    <>
      <div className="bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white">
        Need immediate support? Call 116 123 | Text SHOUT to 85258 | Live chat
        available
      </div>
      <Navbar />
    </>
  );
}
