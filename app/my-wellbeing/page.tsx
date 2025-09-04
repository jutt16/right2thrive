"use client";

import Link from "next/link";
import { ThumbsUp } from "lucide-react";

const wellbeingOptions = [
  { label: "My Goals", href: "/my-wellbeing/my-goals" },
  { label: "My Weekly Goals", href: "/my-wellbeing/upload-weekly-goals" },
  { label: "Download", href: "/my-wellbeing/download" },
  { label: "My Wellbeing Plan", href: "/my-wellbeing/wellbeing-plan" },
  { label: "My Weekly Progress", href: "/my-wellbeing/weekly-progress" },
  { label: "Generalized Anxiety Disorder 7 (GAD-7)", href: "/wellbeing-hub/gad7" },
  { label: "Nine Symptom Checklist (PHQ-9)", href: "/wellbeing-hub/phq9" },
  { label: "Strength and Difficulties Questionnaire (SDQ)", href: "/my-wellbeing/questionnaires" },
];

export default function WellbeingHub() {
  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10 px-4">
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
  );
}
