import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-4 flex items-center text-[#ff961b]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-[#ff961b]">Terms of Service</h1>
        <div className="space-y-6 text-gray-700">
          <p>Last Updated: May 15, 2025</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">1. Introduction</h2>
            <p>
              Welcome to Right2Thrive UK. These Terms of Service ("Terms") govern your use of the Right2Thrive UK
              website, Veris platform, and services (collectively, the "Services") operated by Right2Thrive UK ("we,"
              "us," or "our").
            </p>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of
              the Terms, you may not access the Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">2. Services Description</h2>
            <p>Right2Thrive UK provides culturally responsive mental health support, including but not limited to:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Mental health assessments (GAD-7, PHQ-9, and others)</li>
              <li>Digital wellbeing resources</li>
              <li>Community activities and workshops</li>
              <li>Educational content related to mental health and wellbeing</li>
            </ul>
            <p>
              Our Services are not a substitute for professional medical advice, diagnosis, or treatment. Always seek
              the advice of qualified health providers with any questions you may have regarding medical conditions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are
              responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <p>
              You agree to notify us immediately of any unauthorized access to or use of your account. We cannot and
              will not be liable for any loss or damage arising from your failure to comply with this section.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">4. Privacy Policy</h2>
            <p>
              Your use of our Services is also governed by our Privacy Policy, which is incorporated into these Terms by
              reference. Please review our Privacy Policy to understand our practices regarding your personal
              information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">5. Content and Intellectual Property</h2>
            <p>
              All content, features, and functionality of our Services, including but not limited to text, graphics,
              logos, icons, images, audio clips, digital downloads, and software, are owned by Right2Thrive UK, its
              licensors, or other providers and are protected by copyright, trademark, and other intellectual property
              laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform,
              republish, download, store, or transmit any of the material on our Services without our prior written
              consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">6. User Conduct</h2>
            <p>
              You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not
              to use our Services:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any material that is harmful, threatening, abusive, or otherwise objectionable</li>
              <li>To impersonate or attempt to impersonate Right2Thrive UK, an employee, or any other person</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">7. Limitation of Liability</h2>
            <p>
              In no event will Right2Thrive UK, its affiliates, or their licensors, service providers, employees,
              agents, officers, or directors be liable for damages of any kind, including but not limited to direct,
              indirect, special, incidental, consequential, or punitive damages, arising out of or in connection with
              your use of our Services.
            </p>
            <p>
              This limitation of liability applies to all damages or injuries, including those caused by any failure of
              performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer
              virus, communication line failure, theft or destruction, or unauthorized access to, alteration of, or use
              of the Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">8. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Right2Thrive UK, its affiliates, licensors, and service
              providers, and its and their respective officers, directors, employees, contractors, agents, licensors,
              suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards,
              losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your
              violation of these Terms or your use of the Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">9. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Services immediately, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Services will immediately cease. If you wish to terminate your
              account, you may simply discontinue using the Services or contact us to request account deletion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
              is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Services after those revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, please stop using the Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#ff961b]">11. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              Right2Thrive UK
              <br />
              Email: legal@right2thriveuk.com
              <br />
              Phone: +44 123 456 7890
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
