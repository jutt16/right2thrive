import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import Link from "next/link";

export const metadata = generateSEOMetadata({
  title: "Support Services - Right2Thrive UK | Mental Health Support Resources",
  description: "Access support services and mental health resources from Right2Thrive UK. Find crisis support, culturally responsive services, and urgent mental health help in North London.",
  keywords: [
    "support services",
    "mental health support",
    "crisis support",
    "urgent mental health help",
    "North London support services",
    "culturally responsive support",
    "mental health resources"
  ],
  path: "/wellbeing-hub/support",
  image: "/right2thrive-logo.jpg"
});

export default function SupportServices() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#00990d] mb-4">
            Support Services
          </h1>
          <p className="text-lg text-gray-700">
            Access support services and resources to help you on your wellbeing journey.
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

          {/* Urgent Support */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Urgent Support
            </h2>
            <p className="mb-4 text-gray-700">
              If you need urgent mental health support, the NHS Every Mind Matters service provides immediate help and resources:
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="mb-3 text-gray-800">
                <strong>NHS Every Mind Matters - Urgent Support:</strong>
              </p>
              <Link
                href="https://www.nhs.uk/every-mind-matters/urgent-support/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium text-lg"
              >
                https://www.nhs.uk/every-mind-matters/urgent-support/
              </Link>
              <p className="mt-3 text-sm text-gray-600">
                This service provides immediate support, self-help resources, and guidance for urgent mental health needs.
              </p>
            </div>
          </div>

          {/* Right2Thrive Services */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Right2Thrive UK Services
            </h2>
            <p className="mb-4 text-gray-700">
              Our culturally responsive support services for young people and families:
            </p>
            <ul className="space-y-3 text-gray-700 ml-6 list-disc">
              <li>
                <strong>1:1 Culturally Informed Therapy</strong> – Work with therapists who understand your background and experiences
              </li>
              <li>
                <strong>Peer Support Groups</strong> – Connect with others who get it
              </li>
              <li>
                <strong>Wellbeing Activities</strong> – Build emotional resilience through creative and cultural activities
              </li>
              <li>
                <strong>Career & Personal Development</strong> – Career coaching, employability support, and personal development workshops
              </li>
              <li>
                <strong>6‑Week Wellbeing Programme</strong> – A comprehensive programme with therapy, group sessions, and creative activities
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block bg-[#00990d] text-white px-6 py-3 rounded-lg hover:bg-[#007a0a] transition-colors font-medium"
              >
                Contact Us for Support
              </Link>
            </div>
          </div>

          {/* Culturally Responsive Support */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Culturally Responsive Support Organizations
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

          {/* General Mental Health Resources */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              General Mental Health Resources
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
        </div>
      </div>
    </div>
  );
}

