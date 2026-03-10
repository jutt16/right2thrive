"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  MessageCircle,
  ShieldAlert,
  Phone,
  ChevronRight,
} from "lucide-react";
import { getThriveDashboard } from "@/lib/thrive-tokens-api";
import { ThriveTokensCard } from "@/components/thrive-tokens/ThriveTokensCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WellbeingDashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [dashboard, setDashboard] = useState<{ balance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (!parsed.is_email_verified) {
          localStorage.setItem("pendingVerificationEmail", parsed.email);
          router.replace(
            `/auth/verify-email?email=${encodeURIComponent(parsed.email)}`
          );
          return;
        }
        const name = parsed.first_name || parsed.name || "";
        setFirstName(name.split(" ")[0] || "there");
      } catch {
        setFirstName("there");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isClient) return;
    getThriveDashboard()
      .then((data) =>
        setDashboard(data ? { balance: data.balance } : { balance: 0 })
      )
      .finally(() => setLoading(false));
  }, [isClient]);

  if (!isClient) return null;

  const quickLinks = [
    {
      label: "Join session",
      description: "View and join your bookings",
      href: "/my-bookings",
      icon: Calendar,
    },
    {
      label: "Try a wellbeing tool",
      description: "Assessments, resources & more",
      href: "/wellbeing-hub",
      icon: Sparkles,
    },
    {
      label: "Reflect after your session",
      description: "Share your thoughts and earn tokens",
      href: "/my-wellbeing/reflect",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page title */}
        <p className="text-sm font-medium text-muted-foreground mb-1">
          My Wellbeing
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hi{firstName ? ` ${firstName}` : ""}
        </h1>
        <p className="text-gray-600 mb-8">
          You&apos;re supported here. ThriveTokens are a thank-you for engaging.
        </p>

        {/* Risk Assessment — prominent but refined */}
        <section
          className="mb-8"
          aria-labelledby="risk-assessment-heading"
        >
          <h2 id="risk-assessment-heading" className="sr-only">
            Risk Assessment
          </h2>
          <Link
            href="/wellbeing-hub/risk-assessment"
            className="block rounded-xl overflow-hidden border border-amber-200/80 bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <ShieldAlert className="h-5 w-5 text-white" aria-hidden />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Risk Assessment
                  </h3>
                  <p className="text-amber-100 text-sm">
                    Confidential safety & wellbeing check
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-amber-50/50 border-t border-amber-100">
              <p className="text-sm text-gray-700">
                Complete this check to help ensure you receive the right
                support.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 mt-2">
                Take the check
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </section>

        {/* ThriveTokens */}
        <section className="mb-8" aria-labelledby="tokens-heading">
          <h2 id="tokens-heading" className="sr-only">
            ThriveTokens
          </h2>
          {loading ? (
            <Card className="border-gray-200 bg-white shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="h-5 w-28 bg-gray-100 rounded animate-pulse mb-4" />
                <div className="h-2 w-full bg-gray-100 rounded animate-pulse mb-4" />
                <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ) : (
            <ThriveTokensCard balance={dashboard?.balance ?? 0} />
          )}
        </section>

        {/* Quick links */}
        <section aria-labelledby="quick-links-heading">
          <h2
            id="quick-links-heading"
            className="text-lg font-semibold text-gray-900 mb-4"
          >
            Quick links
          </h2>
          <nav
            className="grid gap-3"
            aria-label="Quick actions"
          >
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#00990d]/30 transition-all group"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#00990d]/10 text-[#00990d] group-hover:bg-[#00990d]/15">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{link.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-[#00990d]" aria-hidden />
                </Link>
              );
            })}
          </nav>
        </section>

        {/* Support — in-page CTAs */}
        <section className="mt-10 pt-8 border-t border-gray-200" aria-labelledby="support-heading">
          <h2 id="support-heading" className="text-lg font-semibold text-gray-900 mb-4">
            Get support
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/voice-call"
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#00990d]/30 transition-all group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 group-hover:bg-teal-500/15">
                <Phone className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">Voice call support</p>
                <p className="text-sm text-muted-foreground">
                  Talk through how you&apos;re feeling
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#00990d]/30 transition-all group"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#00990d]/10 text-[#00990d] group-hover:bg-[#00990d]/15">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">Message your coach</p>
                <p className="text-sm text-muted-foreground">
                  Secure chat with your wellbeing coach
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
