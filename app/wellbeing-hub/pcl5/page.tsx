"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TokenEarnedAcknowledgment } from "@/components/thrive-tokens/TokenEarnedAcknowledgment";
import { TextToSpeechButton } from "@/components/text-to-speech/TextToSpeechButton";
import { getApiUrl } from "@/lib/api-client";

interface Question {
  id: number;
  question_text: string;
  order: number;
}

interface Assessment {
  id: number;
  worst_event: string | null;
  responses: number[];
  total_score: number;
  created_at: string;
}

export default function Pcl5Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  // use null so nothing is selected initially
  const [responses, setResponses] = useState<(number | null)[]>([]);
  const [worstEvent, setWorstEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokensEarned, setTokensEarned] = useState<number | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /** fetch all PCL-5 questions */
  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        getApiUrl("/api/pcl5/questions"),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load questions");
      const data: Question[] = await res.json();
      setQuestions(data);
      setResponses(Array(data.length).fill(null)); // start with null
    } catch (err) {
      console.error(err);
      setError("Could not load questions");
    }
  };

  /** fetch my previous assessments */
  const fetchAssessments = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(
        getApiUrl("/api/pcl5/assessments"),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load assessments");
      const data: Assessment[] = await res.json();
      setAssessments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchAssessments();
  }, []);

  /** update score for a question */
  const handleScoreChange = (index: number, value: number) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  /** submit assessment */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // convert nulls to 0 or reject submission if any unanswered
    if (responses.some((r) => r === null)) {
      setError("Please answer all questions.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        getApiUrl("/api/pcl5/assessments"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            worst_event: worstEvent,
            responses: responses as number[],
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to submit");
      if (typeof data.data?.tokens_awarded === "number") {
        setTokensEarned(data.data.tokens_awarded);
      } else if (typeof data.tokens_awarded === "number") {
        setTokensEarned(data.tokens_awarded);
      }
      setSuccess(true);
      fetchAssessments();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        PCL-5 PTSD Assessment
      </h1>

      {/* ====== Assessment Form ====== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-8"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Your Worst Event
          </label>
          <input
            type="text"
            value={worstEvent}
            onChange={(e) => setWorstEvent(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {questions.map((q, idx) => (
          <div key={q.id} className="border-b pb-4 mb-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-medium flex-1">
                {idx + 1}. {q.question_text}
              </p>
              <TextToSpeechButton
                text={q.question_text}
                label="Listen to question"
                className="shrink-0"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 0, label: "Not at all" },
                { value: 1, label: "A little bit" },
                { value: 2, label: "Moderately" },
                { value: 3, label: "Quite a bit" },
                { value: 4, label: "Extremely" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value={value}
                    checked={responses[idx] === value}
                    onChange={() => handleScoreChange(idx, value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && (
          <>
            <p className="text-green-600 text-sm">
              Assessment submitted successfully.
            </p>
            <TokenEarnedAcknowledgment tokensAwarded={tokensEarned} />
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white hover:bg-green-700 w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Assessment"}
        </Button>
      </form>

      {/* ====== Past Assessments ====== */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Assessments</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAssessments}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {assessments.length === 0 ? (
          <p className="text-gray-600">No assessments yet.</p>
        ) : (
          <ul className="space-y-4">
            {assessments.map((a) => (
              <li
                key={a.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">Total Score: {a.total_score}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(a.created_at).toLocaleString()}
                  </span>
                </div>
                {a.worst_event && (
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Worst Event:</strong> {a.worst_event}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Responses: {a.responses.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
