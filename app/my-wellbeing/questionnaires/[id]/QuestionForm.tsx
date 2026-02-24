"use client";

import { useEffect, useState } from "react";
import { TokenEarnedAcknowledgment } from "@/components/thrive-tokens/TokenEarnedAcknowledgment";
import { TextToSpeechButton } from "@/components/text-to-speech/TextToSpeechButton";
interface Choice {
  id: number;
  label: string;
  value?: number;
}

interface Question {
  id: number;
  text: string;
  type: "radio" | "checkbox" | "text" | "scale";
  choices: Choice[];
}

interface Questionnaire {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
}

export default function QuestionForm({
  questionnaireId,
}: {
  questionnaireId: string;
}) {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null
  );
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokensEarned, setTokensEarned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/questionnaires/${questionnaireId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load questionnaire");
        return res.json();
      })
      .then((data) => setQuestionnaire(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [questionnaireId]);

  const handleChange = (questionId: number, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing token");
      setSubmitting(false);
      return;
    }

    // build payload
    const payload = {
      responses: Object.entries(responses).map(([questionId, val]) => {
        if (Array.isArray(val)) {
          return {
            question_id: parseInt(questionId),
            selected_choice_ids: val,
          };
        } else if (typeof val === "string" && !isNaN(Number(val))) {
          return { question_id: parseInt(questionId), choice_id: Number(val) };
        } else if (typeof val === "string") {
          return { question_id: parseInt(questionId), text_response: val };
        } else {
          return { question_id: parseInt(questionId) };
        }
      }),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questionnaires/${questionnaireId}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to submit responses");

      if (typeof data?.data?.tokens_awarded === "number") {
        setTokensEarned(data.data.tokens_awarded);
      } else if (typeof data?.tokens_awarded === "number") {
        setTokensEarned(data.tokens_awarded);
      }
      setSubmitted(true);
      setResponses({});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!questionnaire) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Strength and Difficulties Questionnaire (SDQ)</h1>
      <h2 className="text-xl font-semibold mb-2">{questionnaire.title}</h2>
      {questionnaire.description && (
        <p className="text-gray-600 mb-6">{questionnaire.description}</p>
      )}

      {submitted ? (
        <>
          <p className="text-green-600 text-sm">Responses saved successfully.</p>
          <TokenEarnedAcknowledgment tokensAwarded={tokensEarned} />
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-sm text-muted-foreground underline hover:no-underline"
          >
            Submit again
          </button>
        </>
      ) : (
        <>
      {questionnaire.questions.map((q) => (
        <div key={q.id} className="p-4 border rounded">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="font-medium flex-1">{q.text}</p>
            <TextToSpeechButton
              text={q.text}
              label="Listen to question"
              className="shrink-0"
            />
          </div>

          {q.type === "text" && (
            <textarea
              className="w-full border rounded p-2"
              value={responses[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {q.type === "radio" &&
            q.choices.map((c) => (
              <label key={c.id} className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  value={c.id}
                  checked={responses[q.id] === String(c.id)}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
                {c.label}
              </label>
            ))}

          {q.type === "checkbox" &&
            q.choices.map((c) => {
              const selected: number[] = responses[q.id] || [];
              return (
                <label key={c.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    value={c.id}
                    checked={selected.includes(c.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...selected, c.id]
                        : selected.filter((id) => id !== c.id);
                      handleChange(q.id, updated);
                    }}
                  />
                  {c.label}
                </label>
              );
            })}

          {q.type === "scale" &&
            q.choices.map((c) => (
              <label key={c.id} className="mr-4">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  value={c.id}
                  checked={responses[q.id] === String(c.id)}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
                <span className="ml-1">{c.label}</span>
              </label>
            ))}
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
        </>
      )}
    </form>
  );
}
