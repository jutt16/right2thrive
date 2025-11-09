"use client";

import Link from "next/link";
import Image from "next/image";
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
import { EnhancedForm } from "@/components/enhanced-form";
import { useAnalytics, AnalyticsPageTracker } from "@/lib/analytics";

export default function Home() {
  const isAuthenticated = useAuthStatus();
  const analytics = useAnalytics();

  const handleFormSubmit = async (data: Record<string, string>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact/message`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-CSRF-Token": "csrf-token-placeholder" // Would be real CSRF token
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message. Please try again.");
      }

      // Track successful form submission
      analytics.trackFormSubmission('contact_form', true);
    } catch (error) {
      // Track form submission error
      analytics.trackFormSubmission('contact_form', false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  const testimonials = [
    {
      quote:
        "Right2Thrive gave me the tools and support I needed when I felt completely alone. My therapist understood my background, and that made all the difference.",
      name: "Sarah",
      age: "24",
    },
    {
      quote:
        "Having weekly check-ins with someone who really listened helped me manage stress and focus on college again. I felt seen for the first time.",
      name: "Malik",
      age: "19",
    },
    {
      quote:
        "As a parent, I felt empowered knowing my teen had culturally aware support. The mentorship programme transformed how we communicate at home.",
      name: "Aisha",
      age: "Parent",
    },
  ];

  const communityStories = [
    {
      name: "Lina",
      role: "College student",
      image: "/img1.jpg",
      quote:
        "Finding peers who share my background made me feel seen. The support circles give me the courage to keep moving forward.",
    },
    {
      name: "Amir",
      role: "Young professional",
      image: "/img2.jpg",
      quote:
        "Right2Thrive pairs real talk with real tools. I always leave group chats feeling lighter and understood.",
    },
    {
      name: "Sade",
      role: "Creative artist",
      image: "/img3.jpg",
      quote:
        "Being around people who get it has been the most healing part of this journey. We lift each other up every week.",
    },
  ];

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
      link: "/anxiety-and-trauma-workshops",
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
      <AnalyticsPageTracker path="/" title="Right2Thrive UK - Cultural Wellbeing Support" category="homepage" />
      {/* ===== Hero Section ===== */}
      <section
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: "url('/banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
        role="banner"
        aria-label="Hero section introducing Right2Thrive UK services"
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

        <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-28 text-center md:text-left flex flex-col items-center md:items-start max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-2xl mb-4 sm:mb-6 text-white">
            Your Mental Health Matters. You Deserve to Thrive.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed mb-6 sm:mb-8 drop-shadow-lg max-w-2xl">
            Culturally responsive therapy, mentorship, and support for young people and families in the UK. Start your journey to wellbeing today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start w-full sm:w-auto">
            <Link href={isAuthenticated ? "/my-wellbeing" : "/auth/signup"} className="w-full sm:w-auto">
              <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-300 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 text-lg sm:text-xl w-full sm:w-auto min-h-[56px]">
                Get Started
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-900 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-white focus:ring-opacity-60 text-lg sm:text-xl w-full sm:w-auto min-h-[56px] bg-transparent backdrop-blur-sm">
                Speak to Someone
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white via-green-50 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Join a community that understands you
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with young people who share your lived experiences. Every photograph below is used with permission from members of our community.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {communityStories.map((story, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={story.image}
                    alt={`Portrait of ${story.name}, Right2Thrive community member`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-base text-gray-700 leading-relaxed">
                    “{story.quote}”
                  </p>
                  <div className="mt-auto">
                    <p className="text-sm font-semibold text-gray-900">{story.name}</p>
                    <p className="text-xs uppercase tracking-wide text-green-600">
                      {story.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonial Section ===== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <blockquote
                key={index}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-left flex flex-col gap-4"
              >
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  “{testimonial.quote}”
                </p>
                <footer className="text-sm font-semibold text-gray-900">
                  {testimonial.name}
                  {testimonial.age ? `, ${testimonial.age}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3-Step Flow ===== */}
      <div className="relative container mx-auto mt-12 md:mt-20 pb-16 px-6 z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          <motion.div
            className="hidden md:block absolute top-12 left-0 right-0 h-[4px] 
                      bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
          />

          <FlowStep
            icon={<FaHandshake size={36} />}
            title="Sign Up"
            desc="Create your free account and complete your wellbeing assessment."
            delay={0}
            href={isAuthenticated ? "/my-wellbeing" : "/auth/signup"}
          />
          <FlowStep
            icon={<FaUsers size={36} />}
            title="Get Matched"
            desc="We'll connect you with the right support based on your needs."
            delay={0.3}
            href={isAuthenticated ? "/my-wellbeing" : "/auth/signup"}
          />
          <FlowStep
            icon={<FaRocket size={36} />}
            title="Start Healing"
            desc="Begin your 12-week journey with therapy, groups, and cultural activities."
            delay={0.6}
            href={isAuthenticated ? "/my-wellbeing" : "/auth/signup"}
          />
        </div>
      </div>

      {isAuthenticated ? (
        <MagazineSection />
      ) : (
        <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Ready to Start Your Healing Journey?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of young people who have transformed their lives through our 
              12-week wellbeing programme. Get started today - it's completely free.
            </p>

            {/* Benefits Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <h3 className="font-semibold mb-2">Free Assessment</h3>
                <p className="text-sm text-gray-600">Complete your wellbeing check in 5 minutes</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <h3 className="font-semibold mb-2">Personalized Support</h3>
                <p className="text-sm text-gray-600">Get matched with the right therapist and group</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-green-600 text-2xl mb-2">✓</div>
                <h3 className="font-semibold mb-2">Cultural Understanding</h3>
                <p className="text-sm text-gray-600">Support that respects your background and values</p>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-6 sm:px-8 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-h-[56px] sm:min-h-[48px]">
                  Start My Free Journey Now
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Already have an account? <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">Sign in here</Link>
            </p>
          </div>
        </section>
      )}

      {/* ===== Services Section ===== */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#ff961b] mb-8 sm:mb-12">
            Explore Our Services
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Contact Form ===== */}
      <section className="py-20 bg-white" id="contact">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00990d] mb-4 sm:mb-6 text-center">
            Let's Talk
          </h2>
          <p className="text-center text-gray-600 mb-10">
            We're here to listen. Whether you need guidance, resources, or a
            safe space to talk, reach out to us today.
          </p>
          <EnhancedForm
            fields={[
              {
                id: "name",
                label: "Your Name",
                type: "text",
                required: true,
                placeholder: "Enter your full name",
                description: "We'll use this to personalize our response"
              },
              {
                id: "email",
                label: "Your Email",
                type: "email",
                required: true,
                placeholder: "your.email@example.com",
                description: "We'll use this to respond to your message"
              },
              {
                id: "message",
                label: "Your Message",
                type: "textarea",
                required: true,
                placeholder: "Tell us how we can help you...",
                description: "Share your thoughts, questions, or concerns",
                rows: 5
              }
            ]}
            onSubmit={handleFormSubmit}
            submitButtonText="Send Message"
            successMessage="Thank you! Your message has been sent successfully. We'll get back to you within 24 hours."
          />
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
  const fieldId = `field-${name}`;
  
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <span className="text-red-500 ml-1" aria-label="required">*</span>
      </label>
      {type === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          rows={5}
          value={value}
          onChange={onChange}
          required
          aria-required="true"
          aria-describedby={`${fieldId}-error`}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent"
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          aria-required="true"
          aria-describedby={`${fieldId}-error`}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00990d] focus:border-transparent"
        />
      )}
      <div id={`${fieldId}-error`} className="sr-only" role="alert" aria-live="polite"></div>
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
      className="relative z-10 flex flex-col items-center text-center px-6 focus-within:ring-4 focus-within:ring-[#00990d] focus-within:ring-opacity-50 rounded-lg"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      role="article"
      aria-labelledby={`flow-step-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.15 }}
        className="flex items-center justify-center w-28 h-28 rounded-full 
                   bg-gradient-to-tr from-green-500 via-teal-500 to-blue-500 
                   shadow-2xl cursor-pointer hover:shadow-teal-400/70 focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50"
        aria-hidden="true"
      >
        {icon}
      </motion.div>

      {/* Title */}
      <h3 
        id={`flow-step-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className="mt-4 text-xl font-semibold uppercase tracking-wide text-gray-800"
      >
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm md:text-base max-w-[220px] text-gray-700">
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
        className={`rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer focus-within:ring-4 focus-within:ring-[#00990d] focus-within:ring-opacity-50 ${
          service.isFeatured
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-yellow-300"
            : "bg-gray-50"
        }`}
        role="article"
        aria-labelledby={`service-title-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div aria-hidden="true">{service.icon}</div>
          <h3
            id={`service-title-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
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
          className="bg-green-600 hover:bg-green-700 text-white text-sm focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          aria-expanded={expanded}
          aria-controls={`service-description-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {expanded ? "Show Less" : "Learn More"}
        </Button>
      </div>
    </Link>
  );
}
