"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Sparkles, MessageCircle } from "lucide-react";
import { getThriveDashboard } from "@/lib/thrive-tokens-api";
import { ThriveTokensCard } from "@/components/thrive-tokens/ThriveTokensCard";

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
          router.replace(`/auth/verify-email?email=${encodeURIComponent(parsed.email)}`);
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
      .then((data) => setDashboard(data ? { balance: data.balance } : { balance: 0 }))
      .finally(() => setLoading(false));
  }, [isClient]);

  if (!isClient) return null;

  const quickLinks = [
    {
      label: "Join session",
      href: "/my-bookings",
      icon: Calendar,
    },
    {
      label: "Try a wellbeing tool",
      href: "/wellbeing-hub",
      icon: Sparkles,
    },
    {
      label: "Reflect after your session",
      href: "/my-wellbeing/reflect",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-foreground mb-2">
        Hi{firstName ? ` ${firstName}` : ""}
      </h1>
      <p className="text-muted-foreground mb-6">
        You're supported here. ThriveTokens are a thank-you for engaging.
      </p>

      <section className="mb-8" aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className="sr-only">
          ThriveTokens
        </h2>
        {loading ? (
          <div className="rounded-lg border bg-muted/20 p-6 animate-pulse">
            <div className="h-8 w-24 bg-muted rounded mb-4" />
            <div className="h-2 w-full bg-muted rounded" />
            <div className="h-10 w-full bg-muted rounded mt-4" />
          </div>
        ) : (
          <ThriveTokensCard balance={dashboard?.balance ?? 0} />
        )}
      </section>

      <section aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="text-lg font-medium text-foreground mb-4">
          Quick links
        </h2>
        <nav className="grid gap-3" aria-label="Quick actions">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden />
                <span className="text-foreground">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
