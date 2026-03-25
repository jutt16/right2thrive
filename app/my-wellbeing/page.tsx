"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThumbsUp, ShieldAlert, Compass } from "lucide-react";
import WellbeingOnboarding from "@/components/wellbeing-onboarding";
import { getCurrentJourneyStage } from "@/lib/journey-stages-api";
import type { UserJourneyStageData } from "@/lib/journey-stages-api";

type WellbeingOption = {
  label: string;
  href: string;
  subtitle?: string;
};

type WellbeingSection = {
  title: string;
  description?: string;
  items: WellbeingOption[];
};

// Grouped for a calmer, less "technical menu" feel.
const wellbeingSections: WellbeingSection[] = [
  {
    title: "This week",
    description: "See what you’re working on this week.",
    items: [
      { label: "My Wellbeing Dashboard", href: "/my-wellbeing/dashboard" },
      { label: "My Weekly Goals", href: "/my-wellbeing/upload-weekly-goals" },
      { label: "My Weekly Progress", href: "/my-wellbeing/weekly-progress" },
    ],
  },
  {
    title: "Check-ins",
    description: "Answer short questions to help guide your support.",
    items: [
      { label: "Anxiety check-in", subtitle: "GAD-7", href: "/wellbeing-hub/gad7" },
      { label: "Low mood check-in", subtitle: "PHQ-9", href: "/wellbeing-hub/phq9" },
      {
        label: "Strengths & difficulties check",
        subtitle: "SDQ",
        href: "/my-wellbeing/questionnaires",
      },
      { label: "Trauma check-in", subtitle: "PCL-5", href: "/wellbeing-hub/pcl5" },
    ],
  },
  {
    title: "Sessions & preparation",
    description: "Get ready for your next session and keep track of how you feel.",
    items: [
      { label: "Pre-session checklist", href: "/my-wellbeing/pre-session-checklist" },
      { label: "Symptom journal", href: "/my-wellbeing/symptom-journal" },
    ],
  },
  {
    title: "Your plan & journal",
    description: "Keep your plan handy and prevent setbacks.",
    items: [
      { label: "My Wellbeing Plan", href: "/my-wellbeing/wellbeing-plan" },
      {
        label: "Prevent setbacks",
        subtitle: "Relapse prevention",
        href: "/wellbeing-hub/relapse-prevention",
      },
    ],
  },
  {
    title: "Resources & support",
    description: "Helpful info and support when you need it.",
    items: [
      { label: "Resources", href: "/my-wellbeing/resources" },
      { label: "Support", href: "/my-wellbeing/support" },
    ],
  },
];

export default function WellbeingHub() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasTherapist, setHasTherapist] = useState(true);
  const [journeyStage, setJourneyStage] = useState<UserJourneyStageData | null>(null);

  useEffect(() => {
    setIsClient(true); // make sure we're on the client before using localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
      router.replace("/auth/login"); // redirect if not logged in
      return;
    }

    if (user) {
      const parsedUser = JSON.parse(user);
      // Check if email is verified
      if (!parsedUser.is_email_verified) {
        localStorage.setItem("pendingVerificationEmail", parsedUser.email);
        router.replace(`/auth/verify-email?email=${encodeURIComponent(parsedUser.email)}`);
        return;
      }

      // Check if user has a therapist assigned
      setHasTherapist(!!parsedUser.therapist_id);
    }
  }, [router]);

  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchStage = () => {
      getCurrentJourneyStage()
        .then((data) => data && setJourneyStage(data))
        .catch(() => {});
    };
    fetchStage();
    window.addEventListener("journeyStageUpdated", fetchStage);
    return () => window.removeEventListener("journeyStageUpdated", fetchStage);
  }, [isClient]);

  // Re-check therapist status when page becomes visible or when returning from another page
  useEffect(() => {
    const checkTherapistStatus = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setHasTherapist(!!parsedUser.therapist_id);
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
    };

    // Check when page becomes visible (user switches back to tab or navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTherapistStatus();
      }
    };

    // Check when localStorage changes (in case of updates from other tabs or components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkTherapistStatus();
      }
    };

    // Listen for custom therapist assignment event
    const handleTherapistAssigned = () => {
      checkTherapistStatus();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("therapistAssigned", handleTherapistAssigned as EventListener);

    // Also check when component mounts or updates
    window.addEventListener("focus", checkTherapistStatus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("therapistAssigned", handleTherapistAssigned as EventListener);
      window.removeEventListener("focus", checkTherapistStatus);
    };
  }, []);

  const handleChooseCoach = () => {
    // Set a flag in sessionStorage to trigger scroll on home page
    sessionStorage.setItem("scrollToCoach", "true");
    router.push("/");
  };

  if (!isClient) return null; // avoid SSR hydration issues

  return (
    <>
      <WellbeingOnboarding />
      <div className="max-w-3xl mx-auto mt-10 mb-10 px-4">
        {/* Show "Choose Your Wellbeing Coach" card if no therapist assigned */}
        {/* Risk Assessment - urgent safety check */}
        <div className="rounded-xl shadow-xl border-2 border-red-300 overflow-hidden mb-6 bg-gradient-to-br from-red-50 to-amber-50">
          <div className="bg-gradient-to-r from-red-600 to-amber-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-8 w-8 text-white shrink-0" aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-white">Safety check</h2>
                <p className="text-red-100 text-sm mt-0.5">
                  A confidential safety and wellbeing check to help ensure you get the right support
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              This check is designed to understand how you’re feeling right now. Your responses are confidential and help your care team provide the right support when needed.
            </p>
            <Link
              href="/wellbeing-hub/risk-assessment"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ShieldAlert className="h-5 w-5" />
              Complete safety check
            </Link>
          </div>
        </div>

        {journeyStage && (
          <div className="rounded-xl shadow-lg border border-cyan-300 overflow-hidden mb-6 bg-gradient-to-br from-cyan-50 to-teal-50">
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <Compass className="h-8 w-8 text-white shrink-0" aria-hidden />
                <div>
                  <h2 className="text-xl font-bold text-white">Your Journey Stage</h2>
                  <p className="text-cyan-100 text-sm mt-0.5">
                    {journeyStage.stage.name} — {journeyStage.stage.description}
                  </p>
                </div>
              </div>
            </div>
            {journeyStage.stage.content && (
              <div className="p-4">
                <p className="text-gray-700 text-sm">{journeyStage.stage.content}</p>
              </div>
            )}
          </div>
        )}

        {!hasTherapist && (
          <div className="rounded-xl shadow-xl border border-yellow-400 overflow-hidden mb-6 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Choose Your Wellbeing Coach</h2>
              <p className="text-yellow-50 text-sm mt-1">
                Get personalized support from a professional wellbeing coach
              </p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                You haven't selected a wellbeing coach yet. Choose a professional from our network to begin your personalized wellbeing journey.
              </p>
              <button
                onClick={handleChooseCoach}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ThumbsUp className="h-5 w-5" />
                Choose Your Wellbeing Coach
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl shadow-xl border border-cyan-400 overflow-hidden">
          <div className="bg-cyan-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">My Wellbeing Space</h1>
            <p className="text-cyan-100 text-sm mt-1">
              Access your personalized wellbeing tools and trackers below.
            </p>
          </div>
          <div className="p-6 bg-white space-y-6">
            {wellbeingSections.map((section) => (
              <section key={section.title}>
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                  {section.description && (
                    <p className="text-sm text-slate-600 mt-0.5">{section.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center border border-gray-200 rounded-lg px-4 py-3 hover:shadow-md hover:border-cyan-500 transition group"
                    >
                      <ThumbsUp className="h-5 w-5 mr-3 text-cyan-600 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0 flex-1">
                        <span className="text-gray-800 group-hover:text-cyan-700 font-medium text-sm">
                          {item.label}
                        </span>
                        {item.subtitle ? (
                          <div className="text-gray-500 text-xs mt-0.5 group-hover:text-cyan-600">
                            {item.subtitle}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
