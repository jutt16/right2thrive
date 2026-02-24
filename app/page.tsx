"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import { useHomepageData } from "@/hooks/useHomepageData";
import { getIconComponent } from "@/lib/iconMapper";
import { EnhancedForm } from "@/components/enhanced-form";
import { useAnalytics, AnalyticsPageTracker } from "@/lib/analytics";
import { TherapistSelection } from "@/components/TherapistSelection";

export default function Home() {
  const { isAuthenticated } = useAuthStatus();
  const analytics = useAnalytics();
  const { data: homepageData, loading, error } = useHomepageData();

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

  // Handle scroll to therapist selection when navigating from my-wellbeing
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem("scrollToCoach");
    if (shouldScroll === "true") {
      // Clear the flag
      sessionStorage.removeItem("scrollToCoach");

      // Function to attempt scroll with retry logic
      const attemptScroll = (attempts = 0, maxAttempts = 10) => {
        const element = document.getElementById("choose-wellbeing-coach");
        if (element) {
          // Element found, scroll to it
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        } else if (attempts < maxAttempts) {
          // Element not found yet, retry after delay
          setTimeout(() => attemptScroll(attempts + 1, maxAttempts), 300);
        }
      };

      // Start attempting to scroll after initial delay
      setTimeout(() => attemptScroll(), 500);
    }
  }, [loading]); // Depend on loading state to re-run when data loads

  // Use dynamic data from API, fallback to empty arrays if loading or no data
  const testimonials = homepageData?.testimonials || [];
  const communityStories = homepageData?.community_stories || [];
  const services = homepageData?.services || [];
  const flowSteps = homepageData?.flow_steps || [];
  const hero = homepageData?.hero;
  const sectionHeadings = homepageData?.section_headings || {};
  const ctaSection = homepageData?.cta_section;
  const supportServices = homepageData?.support_services;

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-red-600 mb-4">?? {error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AnalyticsPageTracker path="/" title="Right2Thrive UK - Cultural Wellbeing Support" category="homepage" />
      {/* ===== Hero Section ===== */}
      {hero && (
        <section
          className="relative bg-cover bg-center bg-no-repeat text-white"
          style={{
            backgroundImage: hero.background_image ? `url('${hero.background_image}')` : "url('/banner.png')",
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
              {hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed mb-6 sm:mb-8 drop-shadow-lg max-w-2xl">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center md:items-start w-full sm:w-auto">
              <Link href={hero.primary_button_link || (isAuthenticated ? "/my-wellbeing" : "/auth/signup")} className="w-full sm:w-auto">
                <Button className="bg-yellow-400 text-green-900 hover:bg-yellow-300 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 text-lg sm:text-xl w-full sm:w-auto min-h-[56px]">
                  {hero.primary_button_text || "Get Started"}
                </Button>
              </Link>
              <Link href={hero.secondary_button_link || "/contact"} className="w-full sm:w-auto">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-900 font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-white focus:ring-opacity-60 text-lg sm:text-xl w-full sm:w-auto min-h-[56px] bg-transparent backdrop-blur-sm">
                  {hero.secondary_button_text || "Speak to Someone"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {communityStories.length > 0 && (
        <section className="bg-gradient-to-b from-white via-green-50 to-white py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {sectionHeadings.community_stories?.heading || "Join a community that understands you"}
              </h2>
              {sectionHeadings.community_stories?.subheading && (
                <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                  {sectionHeadings.community_stories.subheading}
                </p>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {communityStories.map((story, index) => (
                <div
                  key={story.id || index}
                  className="flex flex-col overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={story.image}
                      alt={`Portrait of ${story.name}, Right2Thrive community member`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: story.objectPosition ?? "center" }}
                      sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                      priority={index === 0}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="text-base text-gray-700 leading-relaxed">
                      "{story.quote}"
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
      )}

      {/* ===== Testimonial Section ===== */}
      {testimonials.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {sectionHeadings.testimonials?.heading || "What Our Community Says"}
            </h2>
            <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <blockquote
                  key={testimonial.id || index}
                  className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-left flex flex-col gap-4"
                >
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    "{testimonial.quote}"
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
      )}

      {/* ===== 3-Step Flow ===== */}
      {flowSteps.length > 0 && (
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

            {flowSteps.map((step, index) => (
              <FlowStep
                key={step.id || index}
                icon={getIconComponent(step.icon_name, 36) || <FaHandshake size={36} />}
                title={step.title}
                desc={step.description}
                delay={index * 0.3}
                href={step.link || (isAuthenticated ? "/my-wellbeing" : "/auth/signup")}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===== Therapist Selection Section ===== */}
      <TherapistSelection />

      {isAuthenticated ? (
        <MagazineSection />
      ) : (
        ctaSection && (
          <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50 text-center">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                {ctaSection.title}
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                {ctaSection.description}
              </p>

              {/* Benefits Preview */}
              {ctaSection.benefits && ctaSection.benefits.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {ctaSection.benefits.map((benefit, index) => {
                    // Parse benefit string (format: "Title - Description")
                    const parts = benefit.split(" - ");
                    const title = parts[0] || benefit;
                    const description = parts[1] || "";

                    return (
                      <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="text-green-600 text-2xl mb-2">?</div>
                        <h3 className="font-semibold mb-2">{title}</h3>
                        {description && (
                          <p className="text-sm text-gray-600">{description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
                <Link href={ctaSection.button_link || "/auth/signup"} className="w-full sm:w-auto">
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-6 sm:px-8 py-4 sm:py-5 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-h-[56px] sm:min-h-[48px]">
                    {ctaSection.button_text || "Start My Free Journey Now"}
                  </Button>
                </Link>
              </div>

              {ctaSection.login_link_text && ctaSection.login_link_url && (
                <p className="text-sm text-gray-500 mt-4">
                  {ctaSection.login_link_text.split("?")[0]}
                  <Link href={ctaSection.login_link_url} className="text-green-600 hover:text-green-700 font-medium">
                    {ctaSection.login_link_text.includes("Sign in") ? " Sign in here" : ""}
                  </Link>
                </p>
              )}
            </div>
          </section>
        )
      )}

      {/* ===== Services Section ===== */}
      {services.length > 0 && (
        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#ff961b] mb-8 sm:mb-12">
              {sectionHeadings.services?.heading || "Explore Our Services"}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                // Map service data to include icon component
                const serviceWithIcon = {
                  ...service,
                  icon: getIconComponent(service.icon_name, 28),
                  isFeatured: service.isFeatured,
                };
                return <ServiceCard key={service.id || index} service={serviceWithIcon} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== Contact Form ===== */}
      <section className="py-20 bg-white" id="contact">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00990d] mb-4 sm:mb-6 text-center">
            {sectionHeadings.contact?.heading || "Let's Talk"}
          </h2>
          <p className="text-center text-gray-600 mb-10">
            {sectionHeadings.contact?.subheading || "We're here to listen. Whether you need guidance, resources, or a safe space to talk, reach out to us today."}
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

      {/* ===== Support Services Section ===== */}
      {supportServices && (
        <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#00990d] mb-6">
              {sectionHeadings.support_services?.heading || supportServices.title || "Support Services"}
            </h2>
            <p className="text-center text-gray-700 mb-8 text-lg">
              {sectionHeadings.support_services?.subheading || supportServices.description || "If you need urgent mental health support, access these resources:"}
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Urgent Support
              </h3>
              <p className="mb-4 text-gray-700">
                {supportServices.description}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="mb-3 text-gray-800 font-medium">
                  <strong>{supportServices.service_name}:</strong>
                </p>
                <a
                  href={supportServices.service_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium text-lg break-all"
                >
                  {supportServices.service_url}
                </a>
                {supportServices.service_description && (
                  <p className="mt-4 text-sm text-gray-600">
                    {supportServices.service_description}
                  </p>
                )}
              </div>

              {supportServices.crisis_lines && supportServices.crisis_lines.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Crisis Support Lines
                  </h4>
                  <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                    {supportServices.crisis_lines.map((line, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                </div>
              )}

              {supportServices.view_all_link_text && supportServices.view_all_link_url && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <Link
                    href={supportServices.view_all_link_url}
                    className="inline-block bg-[#00990d] text-white px-6 py-3 rounded-lg hover:bg-[#007a0a] transition-colors font-medium"
                  >
                    {supportServices.view_all_link_text}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
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
        className={`rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer focus-within:ring-4 focus-within:ring-[#00990d] focus-within:ring-opacity-50 ${service.isFeatured
          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-2 border-yellow-300"
          : "bg-gray-50"
          }`}
        role="article"
        aria-labelledby={`service-title-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div aria-hidden="true">{service.icon || <FaCalendarAlt size={28} />}</div>
          <h3
            id={`service-title-${service.title.replace(/\s+/g, '-').toLowerCase()}`}
            className={`text-xl font-semibold ${service.isFeatured ? "text-yellow-300" : "text-blue-700"
              }`}
          >
            {service.title}
          </h3>
        </div>

        <p
          className={`leading-relaxed mb-4 ${service.isFeatured ? "text-white" : "text-gray-700"
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
