import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import StructuredData from "@/components/structured-data";
import { generateServiceStructuredData } from "@/lib/seo-utils";

export const metadata = generateSEOMetadata({
  title: "Cultural Activities & Wellbeing Workshops | Right2Thrive UK",
  description: "Join our cultural activities and wellbeing workshops designed to empower individuals, build emotional resilience, and promote healing through connection and creativity in North London.",
  keywords: [
    "cultural activities",
    "wellbeing workshops",
    "cultural wellbeing",
    "emotional resilience",
    "healing through connection",
    "creative therapy",
    "North London cultural activities",
    "community workshops"
  ],
  path: "/cultural-activities",
  image: "/right2thrive-logo.jpg"
});

const culturalServices = [
  {
    name: "Cultural Wellbeing Workshops",
    description: "Workshops designed to empower individuals, build emotional resilience, and promote healing through connection and creativity.",
    provider: "Right2Thrive UK",
    areaServed: "North London",
    serviceType: "Cultural Activity",
    offers: {
      price: "0",
      priceCurrency: "GBP",
      availability: "InStock"
    }
  },
  {
    name: "Creative Therapy Sessions",
    description: "Creative therapy sessions that combine cultural activities with therapeutic support to promote healing and personal growth.",
    provider: "Right2Thrive UK",
    areaServed: "North London",
    serviceType: "Therapeutic Service",
    offers: {
      price: "0",
      priceCurrency: "GBP",
      availability: "InStock"
    }
  }
];

export default function WellbeingWorkshops() {
  return (
    <>
      {culturalServices.map((service, index) => (
        <StructuredData 
          key={index}
          data={generateServiceStructuredData(service)} 
          id={`cultural-service-schema-${index}`} 
        />
      ))}
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#ff961b]">
          Right2Thrive UK Wellbeing Hub
        </h1>
        <p className="mt-2 text-gray-600 text-lg">
          <strong>Exciting News:</strong> Launching Our Wellbeing Workshops!
        </p>
        <p className="mt-4 text-gray-700">
          Right2Thrive UK Wellbeing Hub is thrilled to announce the launch of
          its new series of wellbeing workshops, designed to empower
          individuals, build emotional resilience, and promote healing through
          connection and creativity. These workshops address various aspects of
          mental health and personal growth, providing participants with
          practical tools and strategies to thrive in their daily lives.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#00990d] mb-4">
          Upcoming Wellbeing Workshops
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>What is Trauma and PTSD:</strong> Explore the impact of
            trauma on the brain and body, and learn somatic practices to address
            PTSD.
          </li>
          <li>
            <strong>Understanding Anxiety & Ways to Manage:</strong> Gain
            insights into anxiety and discover breathwork techniques to manage
            it effectively.
          </li>
          <li>
            <strong>Mindfulness Through Art (In-Person):</strong> Experience
            creative ways to practice mindfulness through painting and essential
            oil crafting.
          </li>
          <li>
            <strong>Anger Management:</strong> Understand anger as a "mask
            emotion" and learn dynamic meditation and self-exploration
            techniques.
          </li>
          <li>
            <strong>
              Cultural Implications in Mental Health & Intergenerational
              Wellbeing:
            </strong>{" "}
            Discuss cultural influences on mental health and explore barriers to
            accessing support.
          </li>
          <li>
            <strong>Distress Tolerance (In-Person):</strong> Learn DBT skills
            and grounding practices to manage heightened emotions and promote
            emotional regulation.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#00990d] mb-4">About Raveen</h2>
        <p className="text-gray-700">
          Raveen is a registered psychotherapist with over 10 years of
          experience in mental health and social care, having worked in sectors
          such as probation services, the NHS, and local authorities. With a
          holistic approach to therapy, Raveen integrates evidence-based
          practices and Eastern techniques like breathwork and mindfulness to
          empower individuals to achieve emotional balance and well-being.
        </p>
        <p className="mt-4 text-gray-700">
          Her workshops are designed to foster connection, healing, and personal
          growth, addressing everything from trauma and anxiety to cultural
          implications in mental health. Raveen’s mission is to create safe,
          supportive spaces where participants feel seen, heard, and equipped
          with tools to thrive.
        </p>
      </section>

      {/* Registration Form */}
      <section className="mb-12">
        <div className="rounded-lg bg-gray-100 p-6 shadow-md">
          <h2 className="text-2xl font-bold text-[#00990d] mb-4">
            Register for a Workshop
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00990d]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select a Workshop
              </label>
              <select className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00990d]">
                <option value="">Choose a workshop...</option>
                <option value="trauma">What is Trauma and PTSD</option>
                <option value="anxiety">
                  Understanding Anxiety & Ways to Manage
                </option>
                <option value="art">Mindfulness Through Art (In-Person)</option>
                <option value="anger">Anger Management</option>
                <option value="cultural">
                  Cultural Implications in Mental Health
                </option>
                <option value="distress">Distress Tolerance (In-Person)</option>
              </select>
            </div>
            <Button className="w-full bg-[#00990d] text-white hover:bg-green-700">
              Register
            </Button>
          </form>
        </div>
      </section>
      </div>
    </>
  );
}
