// Server Component (no "use client")
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Cookie, Database, Users, Clock, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Right2Thrive UK",
  description:
    "How Right2Thrive UK collects, uses, and protects your personal information in compliance with UK GDPR and the Data Protection Act 2018.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <header className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 flex items-center text-[#ff961b]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-[#00990d]">
          Privacy Policy for Right2Thrive UK
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: 15 January 2025
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>UK GDPR & Data Protection Act 2018 Compliant</span>
        </div>
      </header>

      <div className="prose max-w-none prose-p:leading-relaxed prose-li:leading-relaxed">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <p className="text-blue-800 font-medium mb-2">
            <strong>Quick Summary:</strong> We collect minimal data necessary to provide our wellbeing services. 
            We use Google Analytics (with consent), store data securely, and never sell your information. 
            You have full control over your data and can contact our Data Protection Officer anytime.
          </p>
        </div>

        <p>
          Right2Thrive UK is committed to protecting your privacy and safeguarding any personal information 
          you provide to us. This Privacy Policy explains how we collect, use, store, and protect your 
          personal information in compliance with UK GDPR and the Data Protection Act 2018.
        </p>

        <h2 id="data-controller" className="text-xl font-semibold mt-8 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Controller Information
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Data Controller:</strong> Right2Thrive UK</p>
          <p><strong>Registration:</strong> Charity registered in England and Wales</p>
          <p><strong>Data Protection Officer:</strong> Sarah Johnson</p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <strong>DPO Email:</strong> <a href="mailto:dpo@right2thriveuk.com" className="text-[#00990d] underline">dpo@right2thriveuk.com</a>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <strong>DPO Phone:</strong> 074157 71394
          </p>
        </div>

        <h2 id="what-we-collect" className="text-xl font-semibold mt-8 flex items-center gap-2">
          <Users className="h-5 w-5" />
          What Personal Information We Collect
        </h2>
        
        <h3 className="text-lg font-medium mt-6">Personal Information</h3>
        <ul className="list-disc pl-6">
          <li><strong>Identity Data:</strong> Name, date of birth, gender</li>
          <li><strong>Contact Data:</strong> Email address, phone number, postal address</li>
          <li><strong>Account Data:</strong> Username, password (encrypted), login preferences</li>
          <li><strong>Health Data:</strong> Mental health assessments (GAD-7, PHQ-9, PCL-5), wellbeing goals, progress tracking</li>
          <li><strong>Cultural Data:</strong> Ethnicity, cultural background (for culturally responsive care)</li>
          <li><strong>Communication Data:</strong> Messages, feedback, complaints</li>
        </ul>

        <h3 className="text-lg font-medium mt-6">Technical Information</h3>
        <ul className="list-disc pl-6">
          <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
          <li><strong>Device Data:</strong> IP address, browser type, operating system</li>
          <li><strong>Analytics Data:</strong> Google Analytics data (with consent)</li>
          <li><strong>Performance Data:</strong> Website performance metrics</li>
        </ul>

        <h2 id="cookies-analytics" className="text-xl font-semibold mt-8 flex items-center gap-2">
          <Cookie className="h-5 w-5" />
          Cookies and Analytics
        </h2>
        
        <h3 className="text-lg font-medium mt-6">Essential Cookies (Always Active)</h3>
        <div className="bg-green-50 p-4 rounded-lg">
          <p>These cookies are necessary for the website to function and cannot be switched off:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Authentication cookies:</strong> Keep you logged in</li>
            <li><strong>Security cookies:</strong> Protect against CSRF attacks</li>
            <li><strong>Preference cookies:</strong> Remember your settings</li>
          </ul>
        </div>

        <h3 className="text-lg font-medium mt-6">Analytics Cookies (Consent Required)</h3>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p>We use Google Analytics to understand how visitors use our website:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Google Analytics:</strong> Tracks page views, user behavior, and performance</li>
            <li><strong>Data Retention:</strong> 26 months (Google's default)</li>
            <li><strong>Data Sharing:</strong> Data is shared with Google but anonymized</li>
            <li><strong>Opt-out:</strong> You can disable analytics cookies in our cookie banner</li>
          </ul>
        </div>

        <h2 id="legal-basis" className="text-xl font-semibold mt-8">
          Legal Basis for Processing
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="list-disc pl-6">
            <li><strong>Consent:</strong> For analytics cookies and marketing communications</li>
            <li><strong>Contract:</strong> To provide wellbeing services you've requested</li>
            <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
            <li><strong>Vital Interests:</strong> To protect your health and safety in emergencies</li>
            <li><strong>Legal Obligation:</strong> To comply with safeguarding and reporting requirements</li>
          </ul>
        </div>

        <h2 id="data-sharing" className="text-xl font-semibold mt-8">
          Third-Party Data Processors
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Processor</th>
                <th className="border border-gray-300 p-2 text-left">Purpose</th>
                <th className="border border-gray-300 p-2 text-left">Data Types</th>
                <th className="border border-gray-300 p-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Google Analytics</td>
                <td className="border border-gray-300 p-2">Website analytics</td>
                <td className="border border-gray-300 p-2">Usage data, IP address</td>
                <td className="border border-gray-300 p-2">EU/US (Adequacy Decision)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Email Service Provider</td>
                <td className="border border-gray-300 p-2">Email communications</td>
                <td className="border border-gray-300 p-2">Email address, name</td>
                <td className="border border-gray-300 p-2">UK</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Cloud Hosting Provider</td>
                <td className="border border-gray-300 p-2">Data storage and processing</td>
                <td className="border border-gray-300 p-2">All personal data</td>
                <td className="border border-gray-300 p-2">UK/EU</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="data-retention" className="text-xl font-semibold mt-8 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Data Retention Periods
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="list-disc pl-6">
            <li><strong>Account Data:</strong> Until account deletion + 7 years (legal requirement)</li>
            <li><strong>Health Assessment Data:</strong> 7 years from last assessment</li>
            <li><strong>Communication Records:</strong> 3 years from last contact</li>
            <li><strong>Analytics Data:</strong> 26 months (Google Analytics default)</li>
            <li><strong>Marketing Data:</strong> Until consent withdrawn + 2 years</li>
            <li><strong>Complaint Records:</strong> 6 years from resolution</li>
          </ul>
        </div>

        <h2 id="your-rights" className="text-xl font-semibold mt-8">
          Your Data Protection Rights
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Right to Access</h4>
            <p className="text-sm text-blue-700">Request a copy of all personal data we hold about you</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Right to Rectification</h4>
            <p className="text-sm text-green-700">Correct inaccurate or incomplete personal data</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800">Right to Erasure</h4>
            <p className="text-sm text-red-700">Request deletion of your personal data</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Right to Portability</h4>
            <p className="text-sm text-yellow-700">Receive your data in a structured, machine-readable format</p>
          </div>
        </div>

        <h2 id="data-security" className="text-xl font-semibold mt-8">
          Data Security Measures
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="list-disc pl-6">
            <li><strong>Encryption:</strong> All data encrypted in transit and at rest</li>
            <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
            <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
            <li><strong>Staff Training:</strong> Data protection training for all staff</li>
            <li><strong>Incident Response:</strong> 72-hour breach notification procedures</li>
          </ul>
        </div>

        <h2 id="children-privacy" className="text-xl font-semibold mt-8">
          Children's Privacy
        </h2>
        <p>
          Our services are designed for young people aged 16-25. For users under 16, we require 
          parental consent before collecting any personal data. We do not knowingly collect 
          personal information from children under 13.
        </p>

        <h2 id="international-transfers" className="text-xl font-semibold mt-8">
          International Data Transfers
        </h2>
        <p>
          Some of our processors may transfer data outside the UK/EU. We ensure adequate protection 
          through Standard Contractual Clauses (SCCs) or adequacy decisions. Google Analytics 
          data is processed under Google's Data Processing Amendment.
        </p>

        <h2 id="contact-dpo" className="text-xl font-semibold mt-8">
          Contact Our Data Protection Officer
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="font-semibold text-blue-800 mb-2">For any data protection concerns:</p>
          <p className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4" />
            <strong>Email:</strong> <a href="mailto:dpo@right2thriveuk.com" className="text-[#00990d] underline">dpo@right2thriveuk.com</a>
          </p>
          <p className="flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4" />
            <strong>Phone:</strong> 074157 71394
          </p>
          <p className="text-sm text-blue-700 mt-2">
            <strong>Response Time:</strong> We will respond to all data protection requests within 30 days.
          </p>
        </div>

        <h2 id="supervisory-authority" className="text-xl font-semibold mt-8">
          Supervisory Authority
        </h2>
        <p>
          You have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
          if you believe we have not handled your personal data in accordance with data protection law:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <p><strong>ICO Website:</strong> <a href="https://ico.org.uk" className="text-[#00990d] underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a></p>
          <p><strong>ICO Helpline:</strong> 0303 123 1113</p>
        </div>

        <h2 id="policy-updates" className="text-xl font-semibold mt-8">
          Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of significant changes 
          via email or website notice. The "Last updated" date at the top indicates when this 
          policy was last revised.
        </p>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
          <p className="text-green-800 font-medium">
            <strong>Questions?</strong> Contact our Data Protection Officer at{" "}
            <a href="mailto:dpo@right2thriveuk.com" className="underline">dpo@right2thriveuk.com</a>{" "}
            or call 074157 71394. We're here to help!
          </p>
        </div>
      </div>
    </main>
  );
}
