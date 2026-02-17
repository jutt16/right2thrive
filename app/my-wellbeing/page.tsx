"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThumbsUp, ShieldAlert } from "lucide-react";
import WellbeingOnboarding from "@/components/wellbeing-onboarding";

const wellbeingOptions = [
  { label: "My Wellbeing Dashboard", href: "/my-wellbeing/dashboard" },
  { label: "My Weekly Goals", href: "/my-wellbeing/upload-weekly-goals" },
  // { label: "Download", href: "/my-wellbeing/download" },
  { label: "My Wellbeing Plan", href: "/my-wellbeing/wellbeing-plan" },
  { label: "My Weekly Progress", href: "/my-wellbeing/weekly-progress" },
  { label: "Generalized Anxiety Disorder 7 (GAD-7)", href: "/wellbeing-hub/gad7" },
  { label: "Nine Symptom Checklist (PHQ-9)", href: "/wellbeing-hub/phq9" },
  { label: "Strength and Difficulties Questionnaire (SDQ)", href: "/my-wellbeing/questionnaires" },
  { label: "PCL-5 Questionnaire", href: "/wellbeing-hub/pcl5" },
  { label: "Risk Assessment", href: "/wellbeing-hub/risk-assessment" },
];

export default function WellbeingHub() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasTherapist, setHasTherapist] = useState(true);

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
                <h2 className="text-xl font-bold text-white">Risk Assessment</h2>
                <p className="text-red-100 text-sm mt-0.5">
                  Confidential safety & wellbeing check — helps ensure you receive the right support
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              This assessment is designed to understand your current emotional state. Your responses are confidential and help your care team provide appropriate support when needed.
            </p>
            <Link
              href="/wellbeing-hub/risk-assessment"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ShieldAlert className="h-5 w-5" />
              Complete Risk Assessment
            </Link>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white">
            {wellbeingOptions.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center border border-gray-200 rounded-lg px-4 py-3 hover:shadow-md hover:border-cyan-500 transition group"
              >
                <ThumbsUp className="h-5 w-5 mr-3 text-cyan-600 group-hover:scale-110 transition-transform" />
                <span className="text-gray-800 group-hover:text-cyan-700 font-medium text-sm">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
