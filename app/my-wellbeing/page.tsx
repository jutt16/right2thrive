"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThumbsUp, FileText, Pill, Activity, Calendar, Clock } from "lucide-react";
import WellbeingOnboarding from "@/components/wellbeing-onboarding";

const wellbeingOptions = [
  // { label: "My Goals", href: "/my-wellbeing/my-goals" },
  { label: "My Weekly Goals", href: "/my-wellbeing/upload-weekly-goals" },
  // { label: "Download", href: "/my-wellbeing/download" },
  { label: "My Wellbeing Plan", href: "/my-wellbeing/wellbeing-plan" },
  { label: "My Weekly Progress", href: "/my-wellbeing/weekly-progress" },
  { label: "Generalized Anxiety Disorder 7 (GAD-7)", href: "/wellbeing-hub/gad7" },
  { label: "Nine Symptom Checklist (PHQ-9)", href: "/wellbeing-hub/phq9" },
  { label: "Strength and Difficulties Questionnaire (SDQ)", href: "/my-wellbeing/questionnaires" },
  { label: "PCL-5 Questionnaire", href: "/wellbeing-hub/pcl5" },
];

export default function WellbeingHub() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasTherapist, setHasTherapist] = useState(true);
  const [sessionNotes, setSessionNotes] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      // Fetch Session Notes
      const notesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session-notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notesData = await notesRes.json();
      if (notesData.status) setSessionNotes(notesData.session_notes);

      // Fetch Medications
      const medRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const medData = await medRes.json();
      if (medData.status === "success") setMedications(medData.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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

        {/* Session Notes & Medication Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Latest Session Note */}
          <div className="rounded-xl shadow-lg border border-orange-200 overflow-hidden bg-white">
            <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5" /> Latest Session Note
              </h2>
              <Link href="/wellbeing-hub?tab=session-notes" className="text-orange-100 text-xs hover:underline">
                View All
              </Link>
            </div>
            <div className="p-6">
              {sessionNotes.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800">
                      {sessionNotes[0].therapist
                        ? `${sessionNotes[0].therapist.first_name} ${sessionNotes[0].therapist.last_name}`
                        : "Wellbeing Coach"}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(sessionNotes[0].date || sessionNotes[0].created_at)}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 relative">
                    <p className="text-gray-700 text-sm italic line-clamp-4 leading-relaxed">
                      "{sessionNotes[0].notes}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 italic">
                  No session notes shared yet.
                </div>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="rounded-xl shadow-lg border border-blue-200 overflow-hidden bg-white">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5" /> Your Medications
              </h2>
              <Link href="/wellbeing-hub?tab=medications" className="text-blue-100 text-xs hover:underline">
                Details
              </Link>
            </div>
            <div className="p-6">
              {medications.length > 0 ? (
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {medications.slice(0, 3).map((med, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-blue-100 transition-colors">
                      <div className="bg-blue-100 rounded-full p-2 mt-1">
                        <Pill className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{med.medications}</p>
                        <p className="text-xs text-gray-500">For: {med.condition}</p>
                      </div>
                    </div>
                  ))}
                  {medications.length > 3 && (
                    <p className="text-center text-xs text-gray-400 pt-2">
                      + {medications.length - 3} more medications
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 italic">
                  No medications recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
