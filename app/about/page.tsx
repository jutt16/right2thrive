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

      {/* About Us Section (Replaces Story and Mission Sections) */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff961b]">
                  About Us
                </h2>
                <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Built by the community, for the community
                </h3>
                <p className="text-lg leading-relaxed text-gray-700">
                  Too many young people face mental health challenges alone, struggling to find support that reflects their lived experiences. We bridge the gap between mental health care and cultural understanding, offering a safe space where you can be yourself, heal at your own pace, and build the future you deserve.
                </p>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-green-100 bg-green-50/60 p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-[#00990d]">
                    Mental Health &amp; Wellbeing Support
                  </h4>
                  <p className="mt-2 text-sm text-gray-700">
                    From 1:1 culturally informed therapy to peer-led circles and creative wellbeing sessions, we help you heal in ways that honour the whole you.
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-[#ff961b]">
                    Career &amp; Personal Growth
                  </h4>
                  <p className="mt-2 text-sm text-gray-700">
                    Build confidence, discover talents, and unlock new pathways through coaching, employability support, and development workshops.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-blue-700">
                    Community-Led Approach
                  </h4>
                  <p className="mt-2 text-sm text-gray-700">
                    Our programmes are co-created with young people, families, and local partners so every offer reflects real needs and real stories.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl bg-[#00990d] p-8 text-white shadow-lg">
                <h4 className="text-2xl font-semibold">Who we stand beside</h4>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  We support young people navigating identity, mental health, or trauma; families seeking culturally appropriate help; and anyone affected by violence, exclusion, or stigma.
                </p>
                <p className="mt-6 text-lg font-semibold text-white">
                  You belong here.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900">Our commitments</h4>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00990d]" aria-hidden="true" />
                    Rooted in Edmonton, North London, responding to what our community needs most.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#ff961b]" aria-hidden="true" />
                    Led by lived experience, guided by trauma-informed practice, powered by cultural knowledge.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                    Working shoulder-to-shoulder with local organisations, schools, and families.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
