"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "start",
  "daily-checkin",
  "support-circle",
  "wellness-toolkit",
  "medication-plan",
  "action-plan",
  "goals",
  "self-care",
  "community",
  "crisis-plan",
  "reflection",
  "review",
];

type AnyRecord = Record<string, any>;

interface TherapistProfile {
  gender?: string | null;
  cultural_background?: string | null;
  telephone?: string | null;
  mobile?: string | null;
  address?: string | null;
  country?: string | null;
  qualifications?: string | null;
  experience?: string | null;
}

interface TherapistDetails {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  profile?: TherapistProfile | null;
}

export default function WellbeingPlan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AnyRecord>({});
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");
  const [therapistDetails, setTherapistDetails] =
    useState<TherapistDetails | null>(null);
  const [isLoadingTherapistDetails, setIsLoadingTherapistDetails] =
    useState(false);
  const [error, setError] = useState<string>("");

  // Read therapist from localStorage and fetch details
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ensure logged in (optional guard)
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) return;

    let stored: any = null;

    const tRaw = localStorage.getItem("therapist");
    if (tRaw) {
      try {
        stored = JSON.parse(tRaw);
      } catch {}
    }
    if (!stored) {
      const authRaw = localStorage.getItem("auth");
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw);
          if (parsed?.therapist) stored = parsed.therapist;
        } catch {}
      }
    }

    if (stored?.id) {
      const idStr = String(stored.id);
      setSelectedTherapist(idStr);
      // set into form
      setFormData((prev) => ({ ...prev, therapist: Number(idStr) }));
      fetchTherapistDetails(idStr);
    } else {
      setSelectedTherapist("");
    }
  }, []);

  const fetchTherapistDetails = async (id: string) => {
    setIsLoadingTherapistDetails(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/therapists/${id}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch therapist details");
      }
      setTherapistDetails(data.data?.therapist ?? null);
    } catch (e) {
      setTherapistDetails(null);
      setError(
        e instanceof Error ? e.message : "Failed to load therapist details"
      );
    } finally {
      setIsLoadingTherapistDetails(false);
    }
  };

  const getTherapistName = (t?: TherapistDetails | null) => {
    if (!t) return "—";
    const full = `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim();
    return full || "—";
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value],
    }));
  };

  const handleNext = () =>
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const renderInputList = (field: string, placeholder: string) => (
    <>
      {(formData[field] || []).map((val: string, i: number) => (
        <div key={i} className="mb-1 px-2 py-1 border rounded">
          {val}
        </div>
      ))}
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = (e.target as HTMLInputElement).value.trim();
            if (val) {
              addToArray(field, val);
              (e.target as HTMLInputElement).value = "";
            }
          }
        }}
      />
    </>
  );

  const renderCheckboxGroup = (field: string, options: string[]) =>
    options.map((option) => (
      <label key={option} className="block mb-1">
        <input
          type="checkbox"
          checked={
            Array.isArray(formData[field])
              ? formData[field].includes(option)
              : false
          }
          onChange={(e) => {
            const prev = (formData[field] || []) as string[];
            updateField(
              field,
              e.target.checked
                ? [...prev, option]
                : prev.filter((f) => f !== option)
            );
          }}
        />{" "}
        {option}
      </label>
    ));

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to upload.");
        return;
      }
      if (!selectedTherapist) {
        alert("No therapist found in your account. Please contact support.");
        return;
      }

      // ensure therapist stays in payload
      const payload = { ...formData, therapist: Number(selectedTherapist) };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wellbeing-forms`,
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
        alert("Plan submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to submit plan.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred.");
    }
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case "start": {
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">
              Welcome to Your Recovery Adventure!
            </h2>
            <p className="mb-2">
              Congratulations on taking this important step! This plan is
              designed to empower you as you transition back into your vibrant
              daily life.
            </p>

            <div className="mt-4 bg-blue-50 p-4 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Your Therapist
              </h4>

              {isLoadingTherapistDetails ? (
                <p>Loading therapist details…</p>
              ) : selectedTherapist ? (
                <>
                  <p>
                    <strong>Name:</strong> {getTherapistName(therapistDetails)}
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
                </>
              ) : (
                <p className="text-gray-700">
                  No therapist found in your account. Please contact support if
                  this is unexpected.
                </p>
              )}

              {error && (
                <p className="mt-2 text-sm text-red-600">Error: {error}</p>
              )}
            </div>
          </div>
        );
      }

      case "daily-checkin":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Daily Check-In</h3>
            <div className="mb-4">
              <label className="block mb-1">How am I feeling today:</label>
              <div className="space-x-2 text-xl">
                {["😀", "🙂", "😐", "😕", "😢"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => updateField("mood", emoji)}
                    className={`p-2 border rounded ${
                      formData.mood === emoji ? "bg-blue-200" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1">
                Overall Wellbeing Score (1 to 10):
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="border p-2 w-full rounded"
                value={formData.score || ""}
                onChange={(e) => updateField("score", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">What’s influencing my mood?</label>
              {renderCheckboxGroup("moodFactors", [
                "Sleep Quality",
                "Appetite",
                "Energy levels",
                "Social interactions",
                "Medication effects",
                "Stress levels",
                "Physical health",
                "Other",
              ])}
            </div>
          </div>
        );

      case "support-circle":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">My Support Circle</h3>

            {(formData.supportCircle?.length
              ? formData.supportCircle
              : [""]
            ).map((entry: string, index: number, arr: string[]) => (
              <div key={index} className="mb-2 flex gap-2 items-center">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Name / Relationship (e.g. Mom, Best Friend)"
                  value={entry}
                  onChange={(e) => {
                    const updated = [...arr];
                    updated[index] = e.target.value;
                    updateField("supportCircle", updated);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (arr.length > 1) {
                      const updated = [...arr];
                      updated.splice(index, 1);
                      updateField("supportCircle", updated);
                    }
                  }}
                  disabled={arr.length === 1}
                  className="px-3 py-1 rounded text-white bg-red-500 disabled:opacity-50"
                >
                  −
                </button>
                {index === arr.length - 1 && (
                  <button
                    type="button"
                    onClick={() => updateField("supportCircle", [...arr, ""])}
                    className="px-3 py-1 rounded text-white bg-blue-500"
                  >
                    +
                  </button>
                )}
              </div>
            ))}

            <h4 className="mt-6 font-medium">Mental Health Professionals</h4>

            {(formData.mentalProfessionals?.length
              ? formData.mentalProfessionals
              : [""]
            ).map((entry: string, index: number, arr: string[]) => (
              <div key={index} className="mb-2 flex gap-2 items-center">
                <input
                  className="border p-2 rounded w-full"
                  placeholder="Name / Role / Contact Info"
                  value={entry}
                  onChange={(e) => {
                    const updated = [...arr];
                    updated[index] = e.target.value;
                    updateField("mentalProfessionals", updated);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (arr.length > 1) {
                      const updated = [...arr];
                      updated.splice(index, 1);
                      updateField("mentalProfessionals", updated);
                    }
                  }}
                  disabled={arr.length === 1}
                  className="px-3 py-1 rounded text-white bg-red-500 disabled:opacity-50"
                >
                  −
                </button>
                {index === arr.length - 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateField("mentalProfessionals", [...arr, ""])
                    }
                    className="px-3 py-1 rounded text-white bg-blue-500"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        );

      case "wellness-toolkit":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Wellness Toolkit</h3>
            <p className="mb-2">
              What helps you feel better? (Select all that apply)
            </p>
            {renderCheckboxGroup("wellnessTools", [
              "Deep breathing exercises",
              "Journaling",
              "Physical exercise",
              "Creative activities",
              "Talking to someone",
              "Mindfulness or meditation",
              "Nature walks",
              "Other",
            ])}
            <p className="mt-4 font-medium">New strategies I want to try:</p>
            {renderInputList("newStrategies", "Type and press Enter")}
          </div>
        );

      case "medication-plan":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Medication Plan</h3>
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Medication Name"
              onChange={(e) => updateField("medicationName", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Dosage"
              onChange={(e) => updateField("dosage", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="How many times per day?"
              onChange={(e) => updateField("frequency", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Side Effects to Watch For"
              onChange={(e) => updateField("sideEffects", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Pharmacy Contact"
              onChange={(e) => updateField("pharmacyContact", e.target.value)}
            />
          </div>
        );

      case "action-plan":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Action Plan for Warning Signs
            </h3>
            <p className="mb-1 font-medium">Identify Your Warning Signs:</p>
            {renderInputList("warningSigns", "Type and press Enter")}
            <p className="mt-3 font-medium">Immediate Steps to Take:</p>
            {renderInputList("immediateSteps", "Type and press Enter")}
            <p className="mt-3 font-medium">Support Resources:</p>
            {renderInputList("supportResources", "Type and press Enter")}
          </div>
        );

      case "goals":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Goals and Aspirations
            </h3>
            <p className="mb-1">Short-term Goal:</p>
            <input
              className="border p-2 w-full mb-2 rounded"
              onChange={(e) => updateField("shortGoal", e.target.value)}
            />
            <p className="mb-1">Steps to achieve it:</p>
            {renderInputList("shortSteps", "Enter and press Enter")}
            <p className="mt-3 mb-1">Long-term Vision:</p>
            <input
              className="border p-2 w-full mb-2 rounded"
              onChange={(e) => updateField("longGoal", e.target.value)}
            />
            <p className="mb-1">Milestones Along the Way:</p>
            {renderInputList("milestones", "Enter and press Enter")}
          </div>
        );

      case "self-care":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Daily Self-Care Checklist
            </h3>
            {renderCheckboxGroup("selfCare", [
              "Healthy meal",
              "Physical activity",
              "Relaxation practice",
              "Social connection",
              "Enjoyable activity",
              "Medication",
              "Other",
            ])}
          </div>
        );

      case "community":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Community Engagement</h3>
            <p className="mb-1">Activities I’m Interested In Joining:</p>
            {renderCheckboxGroup("communityActivities", [
              "Support groups",
              "Volunteer work",
              "Classes/workshops",
              "Sports/fitness",
              "Art/music",
              "Other",
            ])}
            <p className="mt-4 font-medium">Skills I want to develop:</p>
            {renderInputList("skills", "Enter and press Enter")}
          </div>
        );

      case "crisis-plan":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Crisis Plan</h3>
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="If I'm in crisis, I will..."
              onChange={(e) => updateField("crisisAction", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Emergency Contact Name"
              onChange={(e) => updateField("emergencyName", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Phone"
              onChange={(e) => updateField("emergencyPhone", e.target.value)}
            />
          </div>
        );

      case "reflection":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Reflection & Gratitude
            </h3>
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="One thing I’m proud of today"
              onChange={(e) => updateField("pride", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Something I’m looking forward to"
              onChange={(e) => updateField("lookingForward", e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="One person I’m grateful for"
              onChange={(e) => updateField("grateful", e.target.value)}
            />
          </div>
        );

      case "review":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Review Your Plan</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(
                {
                  ...formData,
                  therapist: Number(
                    selectedTherapist || formData.therapist || 0
                  ),
                },
                null,
                2
              )}
            </pre>
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">My Wellbeing Plan</h1>
      <button
        type="button"
        onClick={() => router.push("/my-wellbeing/download")}
        title="View documents assigned by your therapist"
        aria-label="View therapists assigned documents"
        className="inline-flex items-center gap-3 px-4 py-2 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-colors transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 2a2 2 0 00-2 2v3H4a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H8zM7 9V4h6v5H7z" />
          <path d="M9 12a1 1 0 112 0v3h-2v-3z" />
        </svg>
        <span className="font-medium">View Therapists Assigned Docs</span>
      </button>
      {renderStep()}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
