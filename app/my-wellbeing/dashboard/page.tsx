"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  fadeInUp,
  staggerContainer,
  springSmooth,
  springFast,
} from "@/lib/motion-variants";

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
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.header
          className="mb-10"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00990d] mb-2">
            My Wellbeing
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-2">
            Hi{firstName ? ` ${firstName}` : ""}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-md">
            You&apos;re supported here. ThriveTokens are a thank-you for
            engaging.
          </p>
        </motion.header>

        {/* Risk Assessment */}
        <motion.section
          className="mb-8"
          aria-labelledby="risk-assessment-heading"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <h2 id="risk-assessment-heading" className="sr-only">
            Risk Assessment
          </h2>
          <Link href="/wellbeing-hub/risk-assessment" className="block group">
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-white shadow-md shadow-amber-900/5 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-amber-900/10"
              whileHover={{ y: -2 }}
              transition={springFast}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-500 px-5 py-4 pl-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={springFast}
                  >
                    <ShieldAlert className="h-5 w-5 text-white" aria-hidden />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      Risk Assessment
                    </h3>
                    <p className="text-amber-100/90 text-sm mt-0.5">
                      Confidential safety & wellbeing check
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/80 ml-auto group-hover:translate-x-0.5 transition-transform" aria-hidden />
                </div>
              </div>
              <div className="border-t border-amber-100 bg-amber-50/60 px-5 py-3.5 pl-6">
                <p className="text-sm text-slate-700">
                  Complete this check to help ensure you receive the right
                  support.
                </p>
              </div>
            </motion.div>
          </Link>
        </motion.section>

        {/* ThriveTokens */}
        <motion.section
          className="mb-8"
          aria-labelledby="tokens-heading"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <h2 id="tokens-heading" className="sr-only">
            ThriveTokens
          </h2>
          {loading ? (
            <Card className="overflow-hidden border border-slate-200/80 bg-white shadow-md">
              <CardContent className="p-6">
                <div className="h-5 w-28 bg-slate-100 rounded animate-pulse mb-4" />
                <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse mb-4" />
                <div className="h-11 w-full bg-slate-100 rounded-lg animate-pulse" />
              </CardContent>
            </Card>
          ) : (
            <ThriveTokensCard balance={dashboard?.balance ?? 0} />
          )}
        </motion.section>

        {/* Quick links */}
        <motion.section
          aria-labelledby="quick-links-heading"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <h2
            id="quick-links-heading"
            className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4"
          >
            Quick links
          </h2>
          <nav className="grid gap-3" aria-label="Quick actions">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  variants={fadeInUp}
                  transition={springSmooth}
                >
                  <Link href={link.href} className="block group">
                    <motion.div
                      className="flex items-center gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-colors group-hover:border-[#00990d]/40 group-hover:bg-slate-50/50"
                      whileHover={{ y: -2, boxShadow: "0 8px 25px -5px rgb(0 0 0 / 0.08)" }}
                      whileTap={{ scale: 0.995 }}
                      transition={springFast}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00990d]/10 text-[#00990d] transition-colors group-hover:bg-[#00990d]/15">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 tracking-tight">
                          {link.label}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {link.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#00990d]" aria-hidden />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.section>

        {/* Support */}
        <motion.section
          className="mt-10 pt-8 border-t border-slate-200/80"
          aria-labelledby="support-heading"
          variants={fadeInUp}
          transition={springSmooth}
        >
          <h2
            id="support-heading"
            className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-4"
          >
            Get support
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/voice-call" className="block group">
              <motion.div
                className="flex items-center gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-colors group-hover:border-teal-300 group-hover:bg-slate-50/50"
                whileHover={{ y: -2, boxShadow: "0 8px 25px -5px rgb(0 0 0 / 0.08)" }}
                whileTap={{ scale: 0.995 }}
                transition={springFast}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 transition-colors group-hover:bg-teal-500/15">
                  <Phone className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 tracking-tight">
                    Voice call support
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Talk through how you&apos;re feeling
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:translate-x-0.5" aria-hidden />
              </motion.div>
            </Link>
            <Link href="/chat" className="block group">
              <motion.div
                className="flex items-center gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-colors group-hover:border-[#00990d]/40 group-hover:bg-slate-50/50"
                whileHover={{ y: -2, boxShadow: "0 8px 25px -5px rgb(0 0 0 / 0.08)" }}
                whileTap={{ scale: 0.995 }}
                transition={springFast}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00990d]/10 text-[#00990d] transition-colors group-hover:bg-[#00990d]/15">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 tracking-tight">
                    Message your coach
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Secure chat with your wellbeing coach
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:translate-x-0.5" aria-hidden />
              </motion.div>
            </Link>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
