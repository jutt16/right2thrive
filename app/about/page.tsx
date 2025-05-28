import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Heart, Award } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#2c261f] py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                RIGHT 2 THRIVE UK
              </h1>
              <p className="text-xl text-gray-300">
                Cultural Wellbeing Hub - Building Communities That Thrive, Not
                Just Survive
              </p>
              <p className="text-lg text-gray-300"></p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Right2Thrive UK Logo"
                width={300}
                height={300}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 pb-0">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2c261f]">
              Our Story
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 text-left">
              At Right 2Thrive, we believe every community deserves more than
              mere survival – they deserve to flourish. Our story begins with a
              simple yet powerful vision: creating spaces where cultural
              wellness isn't just an aspiration, but a lived reality.
            </p>
            <br />
            <p className="mx-auto max-w-3xl text-lg text-gray-600 text-left">
              We recognized that traditional approaches to wellbeing often
              overlook the rich tapestry of cultural identities that make our
              communities vibrant. That's why we're building something different
              – a hub where cultural heritage meets modern wellness practices,
              where individual healing contributes to collective strength. Our
              mission is to transform the narrative from surviving daily
              challenges to thriving through community connection, cultural
              pride, and holistic wellness.
            </p>
            <br />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 pt-2 pb-0">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2c261f]">
              Our Mission
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 text-left">
              Right2Thrive UK fills the gap left by traditional mental health
              services that often overlook cultural context. Our mission is to
              provide safe, culturally responsive spaces where young people and
              families can heal from trauma, build resilience, and thrive.
            </p>
            <br />
            <ul className="mx-auto max-w-3xl list-disc space-y-2 text-lg text-gray-600 text-left">
              <li>
                Culturally appropriate therapy delivered by therapists with
                lived experience of the Black British and African-Caribbean
                community
              </li>
              <li>
                Peer-led support groups that encourage open dialogue, healing,
                and resilience within a safe, relatable environment
              </li>
              <li>
                Social prescribing activities (e.g. music, art, storytelling,
                cultural workshops) to improve emotional wellbeing
              </li>
              <li>
                Early intervention programmes focused on prevention and
                identifying mental health needs before{" "}
              </li>
              <li>
                Safe spaces for young Black men and women to speak openly about
                identity, racism, masculinity, self-worth, and emotional pain
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our Team */}
      {/* <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2c261f]">Our Team</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Meet the dedicated professionals behind Right2Thrive UK.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team Member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-xl font-bold text-[#2c261f]">Dr. Maya Johnson</h3>
              <p className="mb-2 text-teal-600">Founder & Clinical Director</p>
              <p className="text-sm text-gray-600">
                Clinical psychologist with over 15 years of experience in culturally responsive mental health care.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team Member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-xl font-bold text-[#2c261f]">David Chen</h3>
              <p className="mb-2 text-teal-600">Technology Director</p>
              <p className="text-sm text-gray-600">
                Technology specialist focused on creating accessible digital mental health tools.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team Member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-xl font-bold text-[#2c261f]">Sarah Okafor</h3>
              <p className="mb-2 text-teal-600">Community Engagement Lead</p>
              <p className="text-sm text-gray-600">
                Specialist in community development and cultural activities for mental wellbeing.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Team Member"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-xl font-bold text-[#2c261f]">Dr. James Wilson</h3>
              <p className="mb-2 text-teal-600">Research & Development</p>
              <p className="text-sm text-gray-600">
                Researcher specializing in culturally responsive mental health assessment tools and methodologies.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="bg-[#2c261f] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Join Our Mission</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            Whether you’re seeking support or want to contribute, join the
            Right2Thrive UK community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/wellbeing-hub">
              <Button className="bg-teal-500 text-white hover:bg-teal-600">
                Access Wellbeing Hub
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-teal-500 text-white hover:bg-teal-500 hover:text-white"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
