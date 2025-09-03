"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Questionnaire {
  id: number;
  title: string;
  description?: string;
}

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Missing token");
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Accept", "application/json");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questionnaires`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questionnaires");
        return res.json();
      })
      .then((data) => {
        setQuestionnaires(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Questionnaires</h2>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && questionnaires.length === 0 && (
        <p className="text-center text-gray-500">No questionnaires available.</p>
      )}

      {!loading && !error && questionnaires.length > 0 && (
        <ul className="space-y-4">
          {questionnaires.map((q) => (
            <li
              key={q.id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition"
            >
              <Link href={`/my-wellbeing/questionnaires/${q.id}`}>
                <h3 className="font-semibold text-gray-800 hover:text-cyan-700">
                  {q.title}
                </h3>
                {q.description && (
                  <p className="text-gray-600 text-sm mt-1">{q.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
