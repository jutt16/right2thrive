// Server Component (no "use client")
import React from "react";

export const metadata = {
  title: "Privacy Policy | Right2Thrive UK",
  description:
    "How Right2Thrive UK collects, uses, and protects your personal information in compliance with UK GDPR and the Data Protection Act 2018.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#00990d]">
          Privacy Policy for Right2Thrive UK
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: 15 August 2025
        </p>
      </header>

      <div className="prose max-w-none prose-p:leading-relaxed prose-li:leading-relaxed">
        <p>
          Right2Thrive UK is committed to protecting your privacy and
          safeguarding any personal information you provide to us, whether
          through our website or other means. This Privacy Policy explains how
          we use your personal information, how we protect your privacy, and
          your rights regarding the use of your data.
        </p>
        <p>
          Right2Thrive UK is dedicated to supporting individuals and communities
          in improving their mental health and well-being. As a registered
          charity in the UK, we interact with supporters, volunteers, and
          stakeholders daily, which requires the responsible use of personal
          information.
        </p>
        <p>
          When handling your personal information, we comply with the UK General
          Data Protection Regulation (UK GDPR), the Data Protection Act 2018,
          and other applicable legislation.
        </p>
        <p>
          By using our website or providing us with your personal information,
          you agree to this Privacy Policy. We may update this policy
          periodically to ensure compliance with legislative changes. Please
          review it regularly, and we will make efforts to communicate any
          significant updates.
        </p>

        <h2 id="how-we-collect" className="text-xl font-semibold mt-8">
          How Do We Collect Information About You?
        </h2>
        <ul className="list-disc pl-6">
          <li>Become one of our members.</li>
          <li>Apply for a paid or unpaid role at Right2Thrive UK.</li>
          <li>Purchase materials or training from us.</li>
          <li>
            Use one of our services, including our national advice service (all
            correspondence remains confidential).
          </li>
          <li>Visit our website or interact with us on social media.</li>
          <li>
            Contact us or engage with us in other ways, such as volunteering or
            campaigning.
          </li>
        </ul>

        <h2 id="what-we-collect" className="text-xl font-semibold mt-8">
          What Personal Information Do We Collect?
        </h2>
        <p>
          Personal information is any data that identifies an individual. It
          does not include anonymous data where identities are removed. The
          types of personal information we may collect include:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Basic Information:</strong> Name, contact details (postal
            address, phone number, email), date of birth, and gender.
          </li>
          <li>
            <strong>Monitoring Information:</strong> Age, nationality, and
            ethnicity (for monitoring purposes).
          </li>
          <li>
            <strong>Employment Information:</strong> Data relevant to job or
            volunteer applications, such as employment status or unspent
            criminal convictions.
          </li>
          <li>
            <strong>Connection to Right2Thrive UK:</strong> Information about
            your link to mental health-related causes (if you choose to share
            this).
          </li>
          <li>
            <strong>Legacy Information:</strong> Details of Executors for legacy
            donations, if applicable.
          </li>
          <li>
            <strong>Online Activity:</strong> Information about your
            interactions with our website or social media, including your IP
            address.
          </li>
        </ul>
        <p>
          We may also collect special category data, such as health information,
          ethnicity, religious beliefs, or sexuality, in specific circumstances
          (e.g., to provide tailored support). This sensitive data will be
          handled with strict confidentiality and only accessed by authorized
          staff.
        </p>

        <h2 id="how-we-use" className="text-xl font-semibold mt-8">
          How Do We Use Personal Information?
        </h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Providing Services:</strong> To deliver support services,
            including advice and assistance.
          </li>
          <li>
            <strong>Communication:</strong> To respond to queries, complaints,
            and requests, and keep you informed about our work.
          </li>
          <li>
            <strong>Improving Services:</strong> To evaluate and improve our
            services and user experience.
          </li>
          <li>
            <strong>Event Management:</strong> To organize and manage events.
          </li>
          <li>
            <strong>Compliance:</strong> To meet legal, regulatory, and
            contractual obligations.
          </li>
          <li>
            <strong>Employment:</strong> To process job or volunteer
            applications and manage employee records.
          </li>
          <li>
            <strong>Training &amp; Research:</strong> To conduct training,
            research, and technical system testing.
          </li>
          <li>
            <strong>Marketing:</strong> To share updates, appeals, and campaign
            information (based on your preferences).
          </li>
        </ul>

        <h2 id="marketing" className="text-xl font-semibold mt-8">
          Marketing and Communication Preferences
        </h2>
        <p>
          We would love to keep you updated about the difference your support
          makes and how you can help further our mission.
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Email/SMS:</strong> We will only contact you via email or
            SMS if you opt in to receive these communications.
          </li>
          <li>
            <strong>Postal Marketing:</strong> If you provide your address, we
            may send you information about our work, appeals, and campaigns
            unless you opt out.
          </li>
          <li>
            <strong>Phone Calls:</strong> If you provide your phone number, we
            may call you about our work and events unless you are registered
            with the Telephone Preference Service or inform us otherwise.
          </li>
        </ul>

        <p className="mt-6">
          You can change your preferences or stop receiving communications at
          any time by contacting us at{" "}
          <a
            href="mailto:info@right2thriveuk.com"
            className="text-[#00990d] underline"
          >
            info@right2thriveuk.com
          </a>{" "}
          or calling 074157 71394.
        </p>
      </div>
    </main>
  );
}
