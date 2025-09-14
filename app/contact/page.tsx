"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [prefilledSubject, setPrefilledSubject] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  useEffect(() => {
    const url = new URL(window.location.href);
    setPrefilledSubject(url.searchParams.get("subject") || "");
  }, []);

  useEffect(() => {
    if (formStatus === "sent") {
      const t = setTimeout(() => setFormStatus("idle"), 5000);
      return () => clearTimeout(t);
    }
  }, [formStatus]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setFormStatus("sent");
        form.reset();
      } else setFormStatus("error");
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#ff961b] mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have questions or want to connect? We're just a message away.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" required className="w-full border p-3 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" required className="w-full border p-3 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telephone</label>
            <input type="tel" name="telephone" className="w-full border p-3 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              name="subject"
              defaultValue={prefilledSubject}
              className="w-full border p-3 rounded-md"
              placeholder="Subject"
            />
          </div>

          <Button type="submit" className="bg-[#00990d] text-white hover:bg-[#007a0a]">
            {formStatus === "loading" ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {formStatus === "sent" && (
          <p className="mt-4 text-green-600 font-medium">Message sent successfully!</p>
        )}
        {formStatus === "error" && (
          <p className="mt-4 text-red-600 font-medium">Something went wrong. Try again later.</p>
        )}
      </div>
    </div>
  );
}
