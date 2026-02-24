"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { getApiUrl } from "@/lib/api-client";

export default function WeeklyProgressForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<any>({});

  // therapist-from-localStorage (read-only)
  const [therapistId, setTherapistId] = useState<string>("");
  const [therapistDetails, setTherapistDetails] = useState<any>(null);
  const [loadingTherapist, setLoadingTherapist] = useState(true);
  const [therapistError, setTherapistError] = useState<string>("");

  // read therapist from localStorage and fetch details
  useEffect(() => {
    if (typeof window === "undefined") return;

    let stored: any = null;

    // prefer "therapist"
    const tRaw = localStorage.getItem("therapist");
    if (tRaw) {
      try {
        stored = JSON.parse(tRaw);
      } catch { }
    }

    // fallback "auth.therapist"
    if (!stored) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed?.therapist) stored = parsed.therapist;
        } catch { }
      }
    }

    if (stored?.id) {
      const idStr = String(stored.id);
      setTherapistId(idStr);
      setData((p: any) => ({ ...p, therapist: Number(idStr) }));
      fetchTherapistDetails(idStr);
    } else {
      setLoadingTherapist(false);
    }
  }, []);

  const fetchTherapistDetails = async (id: string) => {
    setLoadingTherapist(true);
    setTherapistError("");
    try {
      const res = await fetch(
        getApiUrl(`/api/therapists/${id}`)
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch therapist details");
      }
      setTherapistDetails(json.data?.therapist ?? null);
    } catch (e) {
      setTherapistDetails(null);
      setTherapistError(
        e instanceof Error ? e.message : "Failed to load therapist details"
      );
    } finally {
      setLoadingTherapist(false);
    }
  };

  const update = (field: string, value: any) =>
    setData((p: any) => ({ ...p, [field]: value }));

  const renderInput = (label: string, field: string, type: string = "text") => (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={type}
        value={data[field] || ""}
        onChange={(e) => update(field, e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );

  const renderTextArea = (label: string, field: string) => (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <textarea
        rows={3}
        value={data[field] || ""}
        onChange={(e) => update(field, e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );

  const renderEmojiSelect = () => (
    <div className="mb-4">
      <label className="block font-medium mb-1">Overall Mood This Week:</label>
      <div className="text-2xl space-x-2">
        {["😀", "🙂", "😐", "😕", "😢"].map((e) => (
          <button
            key={e}
            onClick={() => update("mood", e)}
            className={`p-2 border rounded ${data.mood === e ? "bg-blue-200" : ""
              }`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit.");
        return;
      }

      // ensure therapist id stays in payload
      const payload = {
        ...data,
        therapist: Number(therapistId || data.therapist || 0),
      };

      const response = await fetch(
        getApiUrl("/api/weekly-progress"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Weekly progress submitted successfully!");
        setData({});
        setStep(0);
      } else {
        const error = await response.json();
        console.error("Submission failed:", error);
        alert("Failed to submit progress.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred while submitting.");
    }
  };

  const steps = [
    <>
      <h2 className="text-2xl font-bold mb-3 text-gray-900">
        Welcome to Right2Thrive! We're Glad You're Here.
      </h2>
      <p className="text-gray-700 mb-6">
        Before we begin, let's take a few minutes to get to know you better.
        This helps us provide the best support for your well-being.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {[
          "Takes about 10 minutes",
          "Your information is private and secure",
          "You can save and come back anytime",
        ].map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          👋 Meet Your Wellbeing Coach
        </h3>
        <p className="text-gray-700">
          Raveen Charles will be supporting you on your well-being journey. All
          your responses are shared only with Raveen to help provide
          personalized care.
        </p>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Your Wellbeing Coach</label>
        <div className="rounded border border-blue-200 bg-blue-50 p-4">
          {loadingTherapist ? (
            <p>Loading therapist details...</p>
          ) : therapistId ? (
            <>
              <p>
                <strong>Name:</strong>{" "}
                {`${therapistDetails?.first_name ?? ""} ${therapistDetails?.last_name ?? ""
                  }`.trim() || "—"}
              </p>
              <p>
                <strong>Email:</strong> {therapistDetails?.email ?? "N/A"}
              </p>
              <p>
                <strong>Gender:</strong>{" "}
                {therapistDetails?.profile?.gender ?? "N/A"}
              </p>
              <p>
                <strong>Cultural Background:</strong>{" "}
                {therapistDetails?.profile?.cultural_background ?? "N/A"}
              </p>
              {therapistDetails?.profile?.telephone && (
                <p>
                  <strong>Telephone:</strong>{" "}
                  {therapistDetails.profile.telephone}
                </p>
              )}
              {therapistDetails?.profile?.mobile && (
                <p>
                  <strong>Mobile:</strong> {therapistDetails.profile.mobile}
                </p>
              )}
              {therapistDetails?.profile?.qualifications && (
                <p>
                  <strong>Qualifications:</strong>{" "}
                  {therapistDetails.profile.qualifications}
                </p>
              )}
              {therapistDetails?.profile?.experience && (
                <p>
                  <strong>Experience:</strong>{" "}
                  {therapistDetails.profile.experience}
                </p>
              )}
              {therapistError && (
                <p className="mt-2 text-sm text-red-600">
                  Error: {therapistError}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              No therapist found in your account. Please contact support if this
              is unexpected.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">{renderInput("Select Your Check-In Date", "date", "date")}</div>
    </>,

    <>
      <h3 className="text-lg font-semibold mb-2">This Week's Journey</h3>
      {renderTextArea("Steps Taken", "stepsTaken")}
      {renderTextArea("Challenges I Faced", "challenges")}
      {renderTextArea("How I Handled Challenges", "strategies")}
    </>,

    <>
      <h3 className="text-lg font-semibold mb-2">My Emotional Landscape</h3>
      {renderEmojiSelect()}
      {renderTextArea("Positive Changes I've Noticed", "positiveChanges")}
      {renderTextArea("Challenges in My Well-being", "wellbeingChallenges")}

      <h3 className="text-lg font-semibold mb-2 mt-6">Support and Feedback</h3>
      {renderTextArea("What's Been Helpful", "helpful")}
      {renderTextArea("What's Been Challenging", "challenging")}
      {renderTextArea("My Requests or Concerns", "requests")}

      <h3 className="text-lg font-semibold mb-2 mt-6">Looking Ahead & Reflection</h3>
      {renderInput("My Focus for Next Week", "focus")}
      {renderInput("Something I'm Looking Forward To", "lookingForward")}
      {renderInput("One Thing I'm Proud of This Week", "pride")}
      {renderInput("Something I Learned About Myself", "learned")}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded w-full"
      >
        Submit
      </button>
    </>,
  ];

  const totalSteps = steps.length;
  const progressPercentage =
    totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  const goToStep = (updater: (current: number) => number) =>
    setStep((current) => {
      const next = updater(current);
      return Math.min(Math.max(next, 0), totalSteps - 1);
    });
  const back = () => goToStep((value) => value - 1);
  const next = () => goToStep((value) => value + 1);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        My Weekly Progress
      </h1>
      <div className="mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="text-sm font-medium text-gray-600">
            Step {step + 1} of {totalSteps}
          </span>
          <div className="w-full md:w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      {steps[step]}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Back

        </button>
        {step < steps.length - 1 && (
          <button
            onClick={next}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
