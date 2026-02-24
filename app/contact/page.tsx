"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/structured-data";
import { generateLocalBusinessStructuredData, generateFAQStructuredData } from "@/lib/seo-utils";
import { getApiUrl } from "@/lib/api-client";

const faqData = [
  {
    question: "What services does Right2Thrive UK offer?",
    answer: "We offer culturally responsive mental health support, 1:1 therapy sessions, anxiety and trauma workshops, peer support groups, career development, and wellbeing activities for young people in North London."
  },
  {
    question: "How do I book a therapy session?",
    answer: "You can contact us through our contact form, email us at hello@right2thriveuk.com, or call us to book a consultation. We'll discuss your needs and match you with the right support."
  },
  {
    question: "Are your services free?",
    answer: "Many of our services are free or low-cost. We offer free workshops, peer support groups, and some therapy sessions. Contact us to discuss your specific needs and available options."
  },
  {
    question: "Do you provide services in different languages?",
    answer: "Yes, we provide culturally responsive services and can accommodate different cultural and linguistic needs. Our team understands the importance of cultural context in mental health support."
  }
];

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
      const res = await fetch(getApiUrl("/api/contact"), {
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
    <>
      <StructuredData data={generateLocalBusinessStructuredData()} id="local-business-schema" />
      <StructuredData data={generateFAQStructuredData(faqData)} id="faq-schema" />
      <div className="min-h-screen bg-white text-gray-800 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#ff961b] mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have questions or want to connect? We're just a message away.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Honeypot field for spam protection */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
              Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input 
              id="contact-name"
              name="name" 
              required 
              aria-required="true"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent" 
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input 
              id="contact-email"
              type="email" 
              name="email" 
              required 
              aria-required="true"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent" 
            />
          </div>

          <div>
            <label htmlFor="contact-telephone" className="block text-sm font-medium mb-1">Telephone</label>
            <input 
              id="contact-telephone"
              type="tel" 
              name="telephone" 
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent" 
            />
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-sm font-medium mb-1">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              defaultValue={prefilledSubject}
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent"
              placeholder="What would you like to discuss?"
              aria-describedby="subject-help"
            />
            <div id="subject-help" className="sr-only">Brief description of your inquiry</div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
              Message <span className="text-red-500" aria-label="required">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              aria-required="true"
              className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent resize-vertical"
              placeholder="Please share your message or questions here..."
              aria-describedby="message-help"
            />
            <div id="message-help" className="sr-only">Detailed description of your inquiry or questions</div>
          </div>

          <Button 
            type="submit" 
            className="bg-[#00990d] text-white hover:bg-[#007a0a] focus:ring-4 focus:ring-[#00990d] focus:ring-opacity-50"
            disabled={formStatus === "loading"}
            aria-describedby={formStatus === "sent" ? "success-message" : formStatus === "error" ? "error-message" : undefined}
          >
            {formStatus === "loading" ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {formStatus === "sent" && (
          <p id="success-message" className="mt-4 text-green-600 font-medium" role="alert" aria-live="polite">
            Message sent successfully!
          </p>
        )}
        {formStatus === "error" && (
          <p id="error-message" className="mt-4 text-red-600 font-medium" role="alert" aria-live="polite">
            Something went wrong. Try again later.
          </p>
        )}
      </div>
      </div>
    </>
  );
}
