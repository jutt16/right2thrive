import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-4 flex items-center text-[#2c261f]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-[#2c261f]">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700">
          <p>Last Updated: May 15, 2025</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">1. Introduction</h2>
            <p>
              Right2Thrive UK ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our website, Veris
              platform, and services (collectively, the "Services").
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you
              have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <h3 className="mt-4 text-lg font-medium text-[#2c261f]">2.1 Personal Information</h3>
            <p>Personal information is data that can be used to identify you directly or indirectly. We may collect:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Contact information (name, email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Demographic information (age, gender, cultural background)</li>
              <li>Health information (mental health assessment responses, wellbeing data)</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium text-[#2c261f]">2.2 Usage Information</h3>
            <p>We may collect information about how you use our Services, including:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Log data (IP address, browser type, pages visited, time spent)</li>
              <li>Device information (device type, operating system)</li>
              <li>Interaction data (features used, actions taken)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process and complete transactions</li>
              <li>Send administrative information, such as updates or security alerts</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Provide personalized content and recommendations</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Conduct research and analysis to improve our Services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">4. How We Share Your Information</h2>
            <p>We may share your information with the following categories of third parties:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Service Providers:</strong> We may share your information with third-party vendors, consultants,
                and other service providers who need access to such information to carry out work on our behalf.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
                response to valid requests by public authorities.
              </li>
              <li>
                <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a
                portion of our business.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your information with third parties when we have your
                consent to do so.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">5. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the
              security of any personal information we process. However, please also remember that we cannot guarantee
              that the internet itself is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">6. Your Data Protection Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>The right to access the personal information we hold about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to request restriction of processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us"
              section below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">7. Children's Privacy</h2>
            <p>
              Our Services are not intended for children under the age of 16. We do not knowingly collect personal
              information from children under 16. If you are a parent or guardian and believe that your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2c261f]">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Right2Thrive UK
              <br />
              Email: privacy@right2thriveuk.com
              <br />
              Phone: +44 123 456 7890
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
