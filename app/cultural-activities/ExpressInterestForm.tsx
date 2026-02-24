"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
type Status = "idle" | "loading" | "sent" | "error";

export default function ExpressInterestForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot field
    if (formData.get("website")) {
      setStatus("sent");
      form.reset();
      return;
    }

    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const interest = (formData.get("interest") || "").toString().trim();

    // Build message content (max 1000 chars per Laravel validation)
    const messageParts = [
      "Express interest – Wellbeing activities & wellbeing workshops",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      interest && `Area of interest: ${interest}`,
      "",
      "Source: Wellbeing Activities – Express your interest form",
    ]
      .filter(Boolean)
      .join("\n");

    // Ensure message doesn't exceed 1000 characters
    const message = messageParts.length > 1000 
      ? messageParts.substring(0, 997) + "..." 
      : messageParts;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        }
      );

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      {/* Honeypot field for spam protection */}
      <input
        type="text"
        name="website"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Your name
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter your full name"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-[#00990d] focus:outline-none focus:ring-2 focus:ring-[#00b83a]/40"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Email address
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="name@example.com"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-[#00990d] focus:outline-none focus:ring-2 focus:ring-[#00b83a]/40"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Area of interest
        </label>
        <select
          name="interest"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-[#00990d] focus:outline-none focus:ring-2 focus:ring-[#00b83a]/40"
        >
          <option value="">Select a theme...</option>
          <option value="Trauma & PTSD">Trauma & PTSD</option>
          <option value="Anxiety & emotional regulation">
            Anxiety & emotional regulation
          </option>
          <option value="Mindfulness & creative practices">
            Mindfulness & creative practices
          </option>
          <option value="Anger & conflict">Anger & conflict</option>
          <option value="Cultural identity & intergenerational wellbeing">
            Cultural identity & intergenerational wellbeing
          </option>
        </select>
      </div>
      <Button
        type="submit"
        className="w-full bg-[#00990d] text-white hover:bg-green-700"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Register your interest"}
      </Button>
      {status === "sent" && (
        <p className="text-[11px] leading-snug text-emerald-700">
          Thank you – your interest has been sent. We&apos;ll be in touch with
          upcoming dates and registration details.
        </p>
      )}
      {status === "error" && (
        <p className="text-[11px] leading-snug text-red-600">
          Something went wrong while sending your details. Please try again
          later.
        </p>
      )}
      <p className="mt-1 text-[11px] leading-snug text-slate-500">
        By submitting this form you agree to be contacted by Right2Thrive UK
        regarding upcoming workshops and wellbeing activities.
      </p>
    </form>
  );
}


