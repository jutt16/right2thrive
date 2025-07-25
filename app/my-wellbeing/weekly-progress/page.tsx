"use client";

import { useState, useEffect } from "react";

export default function WeeklyProgressForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/therapists`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.therapists)) {
          setTherapists(data.data.therapists);
        } else {
          console.error("Invalid therapist data:", data);
        }
      })
      .catch((err) => {
        console.error("Error fetching therapists:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setData((p) => ({ ...p, [field]: value }));
  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const renderInput = (label, field, type = "text") => (
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

  const renderTextArea = (label, field) => (
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
            className={`p-2 border rounded ${
              data.mood === e ? "bg-blue-200" : ""
            }`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );

  // ✅ define this before steps array
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/weekly-progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
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
      <h2 className="text-xl font-bold mb-4">
        Welcome to Your Recovery Journey!
      </h2>
      <p className="mb-2">
        This weekly report helps track your growth and wellbeing.
      </p>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Therapist</label>
        {loading ? (
          <p>Loading therapists...</p>
        ) : (
          <select
            value={data.therapist || ""}
            onChange={(e) => update("therapist", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ✅ Therapist Details Card */}
      {therapists.length > 0 &&
        data.therapist &&
        (() => {
          const selected = therapists.find(
            (t) => t.id === Number(data.therapist)
          );
          if (!selected) return null;

          return (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Therapist Details:
              </h4>
              <p>
                <strong>Name:</strong> {selected.name}
              </p>
              <p>
                <strong>Email:</strong> {selected.email}
              </p>
              <p>
                <strong>Gender:</strong> {selected.gender}
              </p>
              <p>
                <strong>Cultural Background:</strong>{" "}
                {selected.cultural_background}
              </p>
              {selected.telephone && (
                <p>
                  <strong>Telephone:</strong> {selected.telephone}
                </p>
              )}
              {selected.mobile && (
                <p>
                  <strong>Mobile:</strong> {selected.mobile}
                </p>
              )}
              {selected.qualifications && (
                <p>
                  <strong>Qualifications:</strong> {selected.qualifications}
                </p>
              )}
              {selected.experience && (
                <p>
                  <strong>Experience:</strong> {selected.experience}
                </p>
              )}
            </div>
          );
        })()}

      {renderInput("Date", "date", "date")}
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
    </>,

    <>
      <h3 className="text-lg font-semibold mb-2">Support and Feedback</h3>
      {renderTextArea("What's Been Helpful", "helpful")}
      {renderTextArea("What's Been Challenging", "challenging")}
      {renderTextArea("My Requests or Concerns", "requests")}
    </>,

    <>
      <h3 className="text-lg font-semibold mb-2">Looking Ahead & Reflection</h3>
      {renderInput("My Focus for Next Week", "focus")}
      {renderInput("Something I'm Looking Forward To", "lookingForward")}
      {renderInput("One Thing I'm Proud of This Week", "pride")}
      {renderInput("Something I Learned About Myself", "learned")}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Submit
      </button>
    </>,
  ];

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        My Weekly Progress
      </h1>
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
