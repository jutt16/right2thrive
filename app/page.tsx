"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#00990d] py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center text-center md:text-left">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold md:text-5xl mb-4">
              Healing Through Connection, Culture, and Care
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              At Right2Thrive UK, we are committed to empowering young people and families by providing culturally responsive and inclusive mental health and wellbeing services. Our mission is to help individuals overcome challenges such as anxiety, trauma, social isolation, and systemic barriers, enabling them to thrive within their communities. Whether online or in-person at our Wellbeing Hub in Edmonton Green Shopping Centre, we provide the support you need to flourish.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
              <Link href="#services">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="/img1.jpg"
              alt="Happy Chapter Illustration"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#ff961b] mb-10">Explore Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {["12-Week Wellbeing Programme", "Individual Therapy Sessions", "Anxiety & Trauma Workshops", "Career Development Support", "Group Support Sessions", "Mind & Body Wellness", "Weekly Check-ins", "Extended Support", "Online Wellbeing Portal"].map((title, idx) => (
              <div key={idx} className={`rounded-xl p-6 shadow ${title === "Online Wellbeing Portal" ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 border-yellow-300" : "bg-gray-100"}`}>
                <h3 className={`text-xl font-semibold mb-3 ${title === "Online Wellbeing Portal" ? "text-yellow-300" : "text-blue-600"}`}>
                  {title}
                </h3>
                <p className={title === "Online Wellbeing Portal" ? "text-white" : "text-gray-700"}>
                  {
                    title === "12-Week Wellbeing Programme"
                      ? "Structured weekly sessions including individual therapy, group discussions, specialised workshops, and cultural and creative activities designed for sustainable mental health improvement."
                      : title === "Individual Therapy Sessions"
                      ? "Personalized one-on-one therapy sessions focusing on your goals, challenges, and overall wellbeing with culturally responsive care."
                      : title === "Anxiety & Trauma Workshops"
                      ? "Learn practical techniques including breathwork and psychoeducation to manage anxiety, understand trauma, and support your healing journey."
                      : title === "Career Development Support"
                      ? "Comprehensive career guidance including CV writing, interview preparation, mentorship opportunities, and AI tools for professional growth."
                      : title === "Group Support Sessions"
                      ? "\"Let's Thrive Together\" - safe spaces to share experiences, challenges, and coping strategies with peers in similar situations."
                      : title === "Mind & Body Wellness"
                      ? "Tai Chi workshops and mindfulness practices to improve mental clarity, reduce stress, and promote emotional balance."
                      : title === "Weekly Check-ins"
                      ? "Regular progress monitoring through secure online tools and personalized check-ins to track your emotional wellbeing and provide timely support."
                      : title === "Extended Support"
                      ? "Six months of continued one-to-one support and mentoring after completing the 12-week programme to ensure long-term wellbeing and growth."
                      : "Secure digital platform featuring online wellbeing sessions with highly qualified wellbeing specialists, providing regular check-ins to see how you're doing, progress tracking, support resources, and seamless communication whilst you wait for specialist care."
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Image Section */}
      <section className="bg-[#f8fafc] py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-10">
            <img
              src="/img2.jpg"
              alt="Community Healing"
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">
            Why This Matters Right Now
          </h2>
          <p className="text-gray-700 mb-6">
            Let’s keep it real — our community is hurting. Too many of our
            brothers and sisters end up in crisis, in hospitals, in systems that
            don’t understand us. We’re here to change that story.
          </p>
          <p className="text-gray-700 mb-6">
            We know that when Black communities have early access to mental
            health support that actually gets us, everything changes. Fewer
            breakdowns. Stronger families. More people thriving instead of just
            surviving.
          </p>
          <p className="text-gray-700 mb-8">
            This isn’t just about individual healing — it’s about community
            healing. When we support each other, when we catch each other before
            the fall, when we create spaces where our stories matter, that’s
            when real change happens.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left text-gray-700 font-medium">
            <div className="bg-white p-4 shadow rounded">
              <p>
                <span className="text-2xl font-bold text-orange-600">3x</span>{" "}
                Higher rates of detention under Mental Health Act
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <p>
                <span className="text-2xl font-bold text-orange-600">40%</span>{" "}
                Less likely to access early support
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <p>
                <span className="text-2xl font-bold text-orange-600">1 in 4</span>{" "}
                Will experience mental health challenges
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto mb-8">
            <img
              src="/img3.jpg"
              alt="Testimonial"
              className="w-full md:w-1/3 rounded-lg shadow-md object-cover"
            />
            <blockquote className="italic text-gray-600 md:text-left text-center">
              “At Right2Thrive UK we empower individuals to overcome challenges, build resistance and create brighter futures for themselves and their families.”
            </blockquote>
          </div>

          <Link href="/contact">
            <Button className="bg-teal-600 text-white hover:bg-teal-700">
              Let’s Talk
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#00990d] mb-6 text-center">Let's Talk</h2>
          <p className="text-center text-gray-700 mb-10">
            We're here to listen. Whether you need guidance, resources, or a safe space to talk, reach out to us today.
          </p>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              ></textarea>
            </div>
            <Button type="submit" className="bg-[#00990d] text-white hover:bg-green-700 w-full">
              Submit
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}