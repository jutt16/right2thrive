"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MagazineSection from "@/components/ui/magazinesection";
import { motion } from "framer-motion";
import {
  FaHandshake,
  FaUsers,
  FaRocket,
  FaCalendarAlt,
  FaComments,
  FaBrain,
  FaBriefcase,
  FaSpa,
  FaClock,
  FaHandsHelping,
  FaLaptop,
} from "react-icons/fa";
import useAuthStatus from "@/hooks/useAuthStatus";

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const isAuthenticated = useAuthStatus();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Something went wrong.");

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Updated Services with Youth-Friendly Copy & Icons ---------- **/
  const services = [
    {
      title: "12-Week Wellbeing Journey",
      description:
        "A step-by-step programme with therapy, group chats, and creative activities that help you heal, grow, and stay strong long after the 12 weeks are done.",
      short: "A 12-week programme with therapy, groups & creative healing.",
      icon: <FaCalendarAlt size={28} />,
      link: "/contact?subject=12-Week Wellbeing Programme",
    },
    {
      title: "1:1 Therapy Sessions",
      description:
        "Your space, your pace. Private sessions with someone who listens and gets it — no judgement, just support that’s tailored to you.",
      short: "Private sessions at your pace with no judgement.",
      icon: <FaComments size={28} />,
      link: isAuthenticated ? "/my-wellbeing" : "/auth/login",
    },
    {
      title: "Anxiety & Trauma Workshops",
      description:
        "Stress? Overthinking? Sleepless nights? We get it. Learn simple tools like breathing hacks and mindset shifts to calm your mind and take back control. 💚",
      short: "Learn breathing hacks & mindset shifts to reduce stress.",
      icon: <FaBrain size={28} />,
      link: "/contact?subject=Anxiety & Trauma Workshops",
    },
    {
      title: "Career & Future Support",
      description:
        "Need help with CVs, interviews, or finding your path? We’ll coach you, connect you with mentors, and give you the skills to shine in your next step. 🚀",
      short: "CV help, interview prep & mentorship for your next step.",
      icon: <FaBriefcase size={28} />,
      link: "/contact?subject=Career Development Support",
    },
    {
      title: "Peer Support Groups",
      description:
        "Real talk with people who understand. Safe spaces to share stories, swap coping tips, and remind each other you’re not alone.",
      short: "Safe peer spaces to share & support each other.",
      icon: <FaUsers size={28} />,
      link: "/contact?subject=Group Support Sessions",
    },
    {
      title: "Mind & Body Wellness",
      description:
        "From Tai Chi to mindfulness, these sessions help you de-stress, recharge, and keep your head and body in sync. 🧘🏾‍♀",
      short: "Tai Chi & mindfulness to de-stress & recharge.",
      icon: <FaSpa size={28} />,
      link: "/contact?subject=Mind & Body Wellness",
    },
    {
      title: "Weekly Check-Ins",
      description:
        "Quick catch-ups to see how you’re doing, give you a boost, and keep your wellbeing on track week by week.",
      short: "Quick weekly check-ins to stay on track.",
      icon: <FaClock size={28} />,
      link: isAuthenticated ? "/wellbeing-hub?tab=assessments" : "/auth/login",
    },
    {
      title: "Extended Support",
      description:
        "Finished your 12 weeks? We’ve still got you. Six months of mentoring and check-ins so the progress sticks. ✨",
      short: "6 months of mentoring after the 12-week journey.",
      icon: <FaHandsHelping size={28} />,
      link: "/contact?subject=Extended Support",
    },
    {
      title: "Online Wellbeing Portal",
      description:
        "Your digital safe space. Access resources, track your growth, and join virtual sessions while you wait for specialist care.",
      short: "Access resources, track growth & join virtual sessions.",
      icon: <FaLaptop size={28} />,
      isFeatured: true,
      link: isAuthenticated ? "/my-wellbeing" : "/auth/login",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ===== Hero Section ===== */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{ backgroundImage: `url('/banner.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        <div className="relative container mx-auto px-4 py-28 text-center md:text-left flex flex-col items-center md:items-start max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-xl mb-6">
            Healing Through Connection, Culture, and Care
          </h1>
          <p className="text-lg md:text-xl text-gray-100 leading-relaxed mb-8 drop-shadow">
            At Right2Thrive UK, we empower young people and families with
            inclusive, culturally responsive wellbeing services to help overcome
            trauma, anxiety, and systemic challenges.
          </p>
          <Link href="#services">
            <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-300 font-semibold px-8 py-4 rounded-full shadow-md transition duration-300">
              Explore Our Services
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== 3-Step Flow ===== */}
      <div className="relative container mx-auto mt-12 md:mt-20 pb-16 px-6 z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          <motion.div
            className="hidden md:block absolute top-12 left-0 right-0 h-[4px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
          />

          <FlowStep
            icon={<FaHandshake size={36} />}
            title="Reach Out"
            desc="Start your journey with a safe chat and wellbeing check."
            delay={0}
            href="#services"
          />
          <FlowStep
            icon={<FaUsers size={36} />}
            title="Get Support"
            desc="Join therapy, peer groups, or cultural activities."
            delay={0.3}
            href="#contact"
          />
          <FlowStep
            icon={<FaRocket size={36} />}
            title="Thrive Forward"
            desc="Build confidence with skills, career coaching, and mentoring."
            delay={0.6}
            href={isAuthenticated ? "/my-wellbeing" : "/auth/login"}
          />
        </div>
      </div>

      {isAuthenticated ? (
        <MagazineSection />
      ) : (
        <section className="py-20 bg-gray-50 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Unlock Our Wellbeing Magazine
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Access inspiring stories, tips, and resources to support your
              wellbeing. Sign up or log in to get full access.
            </p>

            {/* Image Preview */}
            <div className="flex justify-center mb-8">
              <img
                src="/magazine-cover.jpeg"
                alt="Wellbeing Magazine Cover"
                className="rounded-2xl shadow-lg w-full max-w-md hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/auth/login">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-6 py-3 rounded-xl">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== Services Section ===== */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#ff961b] mb-12">
            Explore Our Services
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonial ===== */}
      <section className="bg-[#f8fafc] py-20">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <div className="mb-12">
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
        </div>
      </section>

      {/* ===== Contact Form ===== */}
      <section className="py-20 bg-white" id="contact">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-[#00990d] mb-6 text-center">
            Let's Talk
          </h2>
          <p className="text-center text-gray-600 mb-10">
            We're here to listen. Whether you need guidance, resources, or a
            safe space to talk, reach out to us today.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              label="Your Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <FormField
              label="Your Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <FormField
              label="Your Message"
              type="textarea"
              name="message"
              value={form.message}
              onChange={handleChange}
            />

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

/* ---------- Sub Components ---------- */
function FormField({
  label,
  type,
  name,
  value,
  onChange,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          rows={5}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d]"
        />
      )}
    </div>
  );
}

function FlowStep({
  icon,
  title,
  desc,
  delay,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: number;
  href?: string;
}) {
  const content = (
    <motion.div
      className="relative z-10 flex flex-col items-center text-center px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ scale: 1.15 }}
        className="flex items-center justify-center w-28 h-28 rounded-full 
                   bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 
                   shadow-2xl cursor-pointer hover:shadow-purple-400/70"
      >
        {icon}
      </motion.div>
      <h3 className="mt-4 text-xl font-semibold uppercase tracking-wide">
        {title}
      </h3>
      <p className="mt-2 text-sm md:text-base max-w-[220px] text-white md:text-gray-800">
        {desc}
      </p>
    </motion.div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

/* ---------- Service Card with Expand/Collapse ---------- */
function ServiceCard({ service }: { service: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Link href={service.link}>
      <div
        className={`rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer ${
          service.isFeatured
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-yellow-300"
            : "bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          {service.icon}
          <h3
            className={`text-xl font-semibold ${
              service.isFeatured ? "text-yellow-300" : "text-blue-700"
            }`}
          >
            {service.title}
          </h3>
        </div>

        <p
          className={`leading-relaxed mb-4 ${
            service.isFeatured ? "text-white" : "text-gray-700"
          }`}
        >
          {expanded ? service.description : service.short}
        </p>

        <Button
          onClick={(e) => {
            e.preventDefault();
            setExpanded(!expanded);
          }}
          className="bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          {expanded ? "Show Less" : "Learn More"}
        </Button>
      </div>
    </Link>
  );
}
