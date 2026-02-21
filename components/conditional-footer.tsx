"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

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

export default function ConditionalFooter() {
  const pathname = usePathname();
  const onDashboard = pathname ? isDashboardRoute(pathname) : false;

  if (onDashboard) {
    return null;
  }

  return <Footer />;
}
