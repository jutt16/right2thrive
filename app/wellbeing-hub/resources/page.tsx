import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import Link from "next/link";

export const metadata = generateSEOMetadata({
  title: "Mental Health Resources - Right2Thrive UK | Wellbeing Support & Information",
  description: "Access comprehensive mental health resources, self-help guides, crisis support information, and culturally responsive wellbeing resources from Right2Thrive UK.",
  keywords: [
    "mental health resources",
    "wellbeing resources",
    "self-help mental health",
    "mental health information",
    "crisis support resources",
    "culturally responsive resources",
    "North London mental health"
  ],
  path: "/wellbeing-hub/resources",
  image: "/right2thrive-logo.jpg"
});

export default function MentalHealthResources() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#00990d] mb-4">
            Mental Health Resources
          </h1>
          <p className="text-lg text-gray-700">
            Comprehensive resources to support your mental health and wellbeing journey.
          </p>
        </div>

        <div className="space-y-6">
          {/* Crisis Support */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Crisis Support
            </h2>
            <p className="mb-4 text-gray-700">
              If you&apos;re experiencing a mental health crisis or need immediate support:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6 list-disc">
              <li>Samaritans: Call <strong>116 123</strong> (free, 24/7)</li>
              <li>Crisis Text Line: Text <strong>SHOUT</strong> to <strong>85258</strong></li>
              <li>NHS Mental Health Helpline: Call <strong>111</strong>, option 2</li>
              <li>
                Emergency Services: Call <strong>999</strong> if you or someone else is in immediate danger
              </li>
            </ul>
          </div>

          {/* Self-Help Resources */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Self-Help Resources
            </h2>
            <p className="mb-4 text-gray-700">
              Explore these resources to support your mental wellbeing:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6 list-disc">
              <li>
                Mind:{" "}
                <Link
                  href="https://www.mind.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.mind.org.uk
                </Link>
              </li>
              <li>
                Mental Health Foundation:{" "}
                <Link
                  href="https://www.mentalhealth.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.mentalhealth.org.uk
                </Link>
              </li>
              <li>
                NHS Mental Health:{" "}
                <Link
                  href="https://www.nhs.uk/mental-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.nhs.uk/mental-health
                </Link>
              </li>
              <li>
                Every Mind Matters:{" "}
                <Link
                  href="https://www.nhs.uk/every-mind-matters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.nhs.uk/every-mind-matters
                </Link>
              </li>
            </ul>
          </div>

          {/* Culturally Responsive Support */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Culturally Responsive Support
            </h2>
            <p className="mb-4 text-gray-700">
              Organizations providing culturally sensitive mental health support:
            </p>
            <ul className="space-y-2 text-gray-700 ml-6 list-disc">
              <li>
                Black Minds Matter UK:{" "}
                <Link
                  href="https://www.blackmindsmatteruk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.blackmindsmatteruk.com
                </Link>
              </li>
              <li>
                Muslim Youth Helpline:{" "}
                <Link
                  href="https://www.myh.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.myh.org.uk
                </Link>
              </li>
              <li>
                Nafsiyat Intercultural Therapy Centre:{" "}
                <Link
                  href="https://www.nafsiyat.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00990d] hover:text-[#007a0a] underline"
                >
                  www.nafsiyat.org.uk
                </Link>
              </li>
            </ul>
          </div>

          {/* Right2Thrive Resources */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Right2Thrive UK Resources
            </h2>
            <p className="mb-4 text-gray-700">
              Access our wellbeing hub and resources:
            </p>
            <ul className="space-y-3 text-gray-700 ml-6 list-disc">
              <li>
                <Link
                  href="/wellbeing-hub"
                  className="text-[#00990d] hover:text-[#007a0a] underline font-medium"
                >
                  Wellbeing Hub
                </Link> – Access assessments, resources, and support
              </li>
              <li>
                <Link
                  href="/cultural-activities"
                  className="text-[#00990d] hover:text-[#007a0a] underline font-medium"
                >
                  Wellbeing Activities & Workshops
                </Link> – Join our cultural and wellbeing activities
              </li>
              <li>
                <Link
                  href="/anxiety-and-trauma-workshops"
                  className="text-[#00990d] hover:text-[#007a0a] underline font-medium"
                >
                  Anxiety & Trauma Workshops
                </Link> – Free online workshops for young people
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#00990d] hover:text-[#007a0a] underline font-medium"
                >
                  Contact Us
                </Link> – Get in touch for support and information
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

