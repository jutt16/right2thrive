"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      title: "12-Week Wellbeing Programme",
      description:
        "Structured weekly sessions including individual therapy, group discussions, and cultural and creative activities for lasting mental health improvement.",
    },
    {
      title: "Individual Therapy Sessions",
      description:
        "One-on-one therapy tailored to your personal goals and challenges, provided with culturally responsive care.",
    },
    {
      title: "Anxiety & Trauma Workshops",
      description:
        "Learn techniques like breathwork and psychoeducation to better manage anxiety and trauma on your healing journey.",
    },
    {
      title: "Career Development Support",
      description:
        "Professional development guidance including CV writing, interview prep, mentorship, and AI tools.",
    },
    {
      title: "Group Support Sessions",
      description:
        "Safe peer spaces to share experiences and develop resilience through shared coping strategies.",
    },
    {
      title: "Mind & Body Wellness",
      description:
        "Tai Chi and mindfulness practices for better stress management and emotional balance.",
    },
    {
      title: "Weekly Check-ins",
      description:
        "Regular check-ins to track emotional wellbeing, offer support, and adjust your growth plan as needed.",
    },
    {
      title: "Extended Support",
      description:
        "Six months of continued 1-on-1 mentoring after completing the 12-week programme to maintain progress.",
    },
    {
      title: "Online Wellbeing Portal",
      description:
        "Secure platform offering virtual sessions, progress tracking, and wellbeing resources while you wait for specialist care.",
      isFeatured: true,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#00990d] py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center text-center md:text-left gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Healing Through Connection, Culture, and Care
            </h1>
            <p className="text-lg text-gray-200 max-w-xl leading-relaxed">
              At Right2Thrive UK, we empower young people and families with
              inclusive, culturally responsive wellbeing services to help
              overcome trauma, anxiety, and systemic challenges.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
              <Link href="#services">
                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/img1.jpg"
              alt="Happy Chapter"
              className="w-full max-w-md mx-auto rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#ff961b] mb-12">
            Explore Our Services
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 shadow-md transition duration-300 hover:shadow-xl ${
                  service.isFeatured
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-yellow-300"
                    : "bg-gray-50"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    service.isFeatured ? "text-yellow-300" : "text-blue-700"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`leading-relaxed ${
                    service.isFeatured ? "text-white" : "text-gray-700"
                  }`}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-[#f8fafc] py-20">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <div className="mb-12">
            <img
              src="/img2.jpg"
              alt="Community Healing"
              className="rounded-xl shadow-lg w-full max-w-3xl mx-auto"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 text-left">
            <img
              src="/img3.jpg"
              alt="Testimonial"
              className="w-full md:w-1/3 rounded-lg shadow-md object-cover"
            />
            <blockquote className="italic text-lg text-gray-700">
              “At Right2Thrive UK, we empower individuals to overcome
              challenges, build resilience, and create brighter futures for
              themselves and their families.”
            </blockquote>
          </div>
          <div className="mt-10">
            <Link href="/contact">
              <Button className="bg-teal-600 text-white hover:bg-teal-700 transition duration-300">
                Let’s Talk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-[#00990d] mb-6 text-center">
            Let's Talk
          </h2>
          <p className="text-center text-gray-600 mb-10">
            We're here to listen. Whether you need guidance, resources, or a
            safe space to talk, reach out to us today.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              ></textarea>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm">
                Message sent successfully. We'll get back to you soon!
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`bg-[#00990d] text-white hover:bg-green-700 w-full py-2 transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
