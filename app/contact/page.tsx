"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");

  useEffect(() => {
    if (formStatus === "sent") {
      const timer = setTimeout(() => setFormStatus("idle"), 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");

    const form = e.currentTarget; // 👈 Save form reference before async call
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      telephone: formData.get("telephone"),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Uncomment below if using token auth
            // Authorization: "Bearer YOUR_TOKEN"
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setFormStatus("sent");
        form.reset(); // 👈 Safe to call
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff961b]"
              placeholder="Your Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff961b]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telephone</label>
            <input
              type="tel"
              name="telephone"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff961b]"
              placeholder="Your Phone Number"
            />
          </div>

          <Button
            type="submit"
            className="bg-[#00990d] text-white hover:bg-[#007a0a]"
          >
            {formStatus === "loading" ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {/* Success Message */}
        {formStatus === "sent" && (
          <p className="mt-4 text-green-600 font-medium">
            Message sent successfully!
          </p>
        )}
        {formStatus === "error" && (
          <p className="mt-4 text-red-600 font-medium">
            Something went wrong. Try again later.
          </p>
        )}
      </div>
    </div>
  );
}
