import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";
import StructuredData from "@/components/structured-data";
import { generateOrganizationStructuredData } from "@/lib/seo-utils";

export const metadata = generateSEOMetadata({
  title: "About Right2Thrive UK - Cultural Wellbeing Hub | North London",
  description: "Learn about Right2Thrive UK, a grassroots community-led organisation delivering culturally appropriate mental health support, mentoring, and career development for young people in North London.",
  keywords: [
    "about Right2Thrive UK",
    "cultural wellbeing hub",
    "community mental health",
    "North London therapy",
    "culturally responsive support",
    "young people wellbeing",
    "Edmonton mental health",
    "community-led organisation"
  ],
  path: "/about",
  image: "/right2thrive-logo.jpg"
});

export default function About() {
  return (
    <>
      <StructuredData data={generateOrganizationStructuredData()} id="organization-schema" />
      <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#00990d] py-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/banner.png"
            alt=""
            fill
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white/90">
                Community First
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Your Mental Health. Your Culture. Your Community.
              </h1>
              <p className="text-lg text-gray-100 md:text-xl">
                Right2Thrive UK is a grassroots, community-led organisation based in Edmonton, North London, operating under the umbrella of 21K Digital Media to address and tackle health inequalities.
              </p>
              <p className="text-base text-gray-100 md:text-lg">
                We deliver culturally responsive support so young people and families from Black and marginalised communities can access care that truly reflects who they are.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/wellbeing-hub">
                  <Button className="bg-white text-[#00990d] hover:bg-green-100">
                    Explore Our Support
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white text-[#ff961b] hover:bg-white hover:text-[#00990d]">
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative h-[280px] w-[280px] sm:h-[320px] sm:w-[320px]">
                <Image
                  src="/img2back.jpg"
                  alt="Right2Thrive UK community members"
                  fill
                  className="rounded-3xl object-cover shadow-2xl ring-4 ring-white/30"
                  priority={false}
                />
                <div className="absolute -bottom-6 -left-6 rounded-3xl bg-white/90 p-4 shadow-lg backdrop-blur">
                  <p className="text-sm font-semibold text-[#00990d]">
                    1,200+ sessions delivered
                  </p>
                  <p className="mt-1 text-xs text-gray-600">and growing every month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why We Exist
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Too many young people face mental health challenges alone, struggling to find support that reflects their lived experiences. Traditional services often overlook cultural identity, family dynamics, and the unique pressures facing marginalized communities.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What We Do
            </h2>

            <div className="space-y-8">
              {/* Mental Health & Wellbeing Support */}
              <div className="rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-[#00990d] mb-4">
                  Mental Health &amp; Wellbeing Support
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00990d] flex-shrink-0" aria-hidden="true" />
                    <span><strong>1:1 Culturally Informed Therapy</strong> – Work with therapists who understand your background and experiences</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00990d] flex-shrink-0" aria-hidden="true" />
                    <span><strong>Peer Support Groups</strong> – Connect with others who get it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00990d] flex-shrink-0" aria-hidden="true" />
                    <span><strong>Wellbeing Activities</strong> – Build emotional resilience through creative and cultural activities</span>
                  </li>
                </ul>
              </div>

              {/* Career & Personal Development */}
              <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-[#ff961b] mb-4">
                  Career &amp; Personal Development
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#ff961b] flex-shrink-0" aria-hidden="true" />
                    <span><strong>Career Coaching</strong> – Discover your strengths and explore opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#ff961b] flex-shrink-0" aria-hidden="true" />
                    <span><strong>Employability Support</strong> – Build skills, confidence, and pathways to work</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#ff961b] flex-shrink-0" aria-hidden="true" />
                    <span><strong>Personal Development Workshops</strong> – Grow personally and professionally</span>
                  </li>
                </ul>
              </div>

              {/* Community-Led Approach */}
              <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                  Community-Led Approach
                </h3>
                <p className="text-gray-700">
                  We co-create them with you. Our programmes are shaped by the real experiences of our team and the communities we serve, ensuring what we offer actually works for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-[#00990d] p-8 text-white shadow-lg md:p-12">
              <h2 className="text-3xl font-semibold mb-6 sm:text-4xl">
                Who We Serve
              </h2>
              <p className="mb-6 text-lg text-white/90">
                We support:
              </p>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white flex-shrink-0" aria-hidden="true" />
                  <span>Young people navigating mental health challenges, trauma, or identity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white flex-shrink-0" aria-hidden="true" />
                  <span>Families seeking culturally appropriate support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white flex-shrink-0" aria-hidden="true" />
                  <span>Anyone affected by youth violence, social exclusion, or mental health stigma</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white flex-shrink-0" aria-hidden="true" />
                  <span>People who&apos;ve felt misunderstood or overlooked by traditional services</span>
                </li>
              </ul>
              <p className="mt-8 text-2xl font-semibold text-white">
                You belong here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="bg-[#00990d] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-10 text-3xl font-bold">Join Us</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white">Need Support?</h3>
              <p className="mt-3 text-sm text-gray-100">
                Access our Wellbeing Hub and start your journey today.
              </p>
              <Link href="/wellbeing-hub" className="mt-6 inline-block">
                <Button className="bg-white text-[#00990d] hover:bg-gray-100">
                  Access Wellbeing Hub
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white">Want to Get Involved?</h3>
              <p className="mt-3 text-sm text-gray-100">
                Contact us to learn about partnership and volunteer opportunities.
              </p>
              <Link href="/contact" className="mt-6 inline-block">
                <Button className="bg-white text-[#00990d] hover:bg-gray-100">
                  Contact Us
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white">Believe in Our Mission?</h3>
              <p className="mt-3 text-sm text-gray-100">
                Help us expand our impact and reach more young people who need us.
              </p>
              <Link href="/contact" className="mt-6 inline-block">
                <Button className="bg-white text-[#00990d] hover:bg-gray-100">
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
