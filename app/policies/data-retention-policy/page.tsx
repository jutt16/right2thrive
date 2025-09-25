"use client";
import Head from "next/head";

export default function DataRetentionPolicy() {
  return (
    <>
      <Head>
        <title>Data Retention & Secure Deletion Policy</title>
        <meta
          name="description"
          content="Right2Thrive UK – Organisational Policy on Data Retention and Secure Deletion"
        />
      </Head>

      <main className="container mx-auto max-w-4xl px-4 py-10 text-gray-800">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Organisational Policy on Data Retention and Secure Deletion
        </h1>
        {/* <p className="text-sm text-gray-500 mb-10">
          Version 1.0 • Effective Date: DD-MM-YYYY
        </p> */}

        <section className="space-y-6 leading-relaxed">
          <article>
            <h2 className="text-xl font-semibold mb-2">1. Purpose</h2>
            <p>
              This policy establishes the principles and procedures for the
              retention and secure deletion of data within the organisation. It
              ensures that all personal, confidential, and business-critical
              data is retained only as long as necessary to fulfil its intended
              purpose, meet legal/regulatory obligations, and is securely
              deleted when no longer required.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">2. Scope</h2>
            <p>
              Applies to all employees, contractors, and third parties who
              process, manage, or store data on behalf of the organisation. It
              covers all forms of data—electronic files, emails, paper
              documents, and data held within systems, applications, and
              devices.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">3. Definitions</h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Data:</strong> Any information held or processed by the
                organisation, including personal data, confidential business
                information, and operational records.
              </li>
              <li>
                <strong>Retention Period:</strong> The length of time data must
                be kept to meet business, legal, or regulatory requirements.
              </li>
              <li>
                <strong>Secure Deletion:</strong> Permanent erasure of data so
                it cannot be reconstructed or retrieved.
              </li>
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">4. Policy Principles</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Data Minimisation:</strong> Collect and retain only data
                necessary for specified, legitimate purposes.
              </li>
              <li>
                <strong>Retention Schedules:</strong> Define and maintain
                retention periods for each data category in line with legal,
                regulatory, and business needs.
              </li>
              <li>
                <strong>Review & Disposal:</strong> Review data regularly. Data
                that has reached the end of its retention period, or is no
                longer required, must be securely deleted or destroyed without
                delay.
              </li>
              <li>
                <strong>Secure Deletion Methods:</strong> For electronic data,
                use overwriting, degaussing, or physical destruction of storage
                media. For paper records, use cross-cut shredding or
                incineration.
              </li>
              <li>
                <strong>Documentation:</strong> Record all deletion/destruction
                activities; obtain witness signatures or system logs for audit
                purposes when appropriate.
              </li>
              <li>
                <strong>Third-Party Compliance:</strong> Contracts with vendors
                or processors must require adherence to this policy and
                verification of secure deletion practices.
              </li>
            </ol>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">
              5. Roles & Responsibilities
            </h2>
            <ul className="list-disc list-inside">
              <li>
                <strong>Data Owners:</strong> Define retention periods, ensure
                regular reviews, and oversee secure deletion.
              </li>
              <li>
                <strong>IT Department:</strong> Provide/maintain secure deletion
                tools, support users, and verify technical compliance.
              </li>
              <li>
                <strong>All Staff:</strong> Comply with this policy and report
                any concerns or breaches to the Data Protection Officer (DPO) or
                relevant manager.
              </li>
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">
              6. Legal & Regulatory Compliance
            </h2>
            <p>
              Ensures compliance with the UK General Data Protection Regulation
              (UK GDPR), the Data Protection Act 2018, and any other applicable
              legislation or contractual obligations.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">7. Policy Review</h2>
            <p>
              Reviewed at least annually, or sooner if legislation, business
              practices, or audit findings require. Updates will be communicated
              to all staff.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">8. Breach of Policy</h2>
            <p>
              Non-compliance may result in disciplinary action and could
              constitute a breach of legal or regulatory obligations.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold mb-2">
              9. Further Information
            </h2>
            <p>
              For guidance or clarification, contact the{" "}
              <strong>Data Protection Officer</strong> at
              [DPO-email@example.com].
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
