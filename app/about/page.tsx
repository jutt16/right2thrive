import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

      {/* About Us Section (Replaces Story and Mission Sections) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2c261f]">About Us</h2>
          </div>
          <div className="mx-auto max-w-4xl text-lg text-gray-700 space-y-6 text-left">
            <p>
              <strong>Right2Thrive UK</strong> is a grassroots, community-led organisation based
              in Edmonton, North London, delivering culturally appropriate mental
              health support, mentoring, and career development services for
              young people and families from Black and marginalised communities.
            </p>
            <p>
              We exist to tackle health inequalities and improve life outcomes
              for those affected by trauma, youth violence, social exclusion,
              and mental health stigma. Our approach combines early intervention,
              therapeutic support, and skills-based programmes that are shaped by
              the lived experiences of our team and the communities we serve.
            </p>
            <p>
              At the heart of our work is the <strong>Right2Thrive UK Wellbeing Hub</strong>, offering
              a safe, inclusive space where young people can access 1:1 culturally
              informed therapy, join peer support groups, and take part in
              wellbeing activities that promote emotional resilience, identity,
              and belonging.
            </p>
            <p>
              We also provide career coaching, employability support, and personal
              development workshops, empowering young people to build brighter
              futures.
            </p>
            <p>
              We are committed to co-producing solutions with our community and
              partner organisations, working collaboratively to reduce mental
              health disparities, prevent youth violence, and create opportunities
              for social mobility and economic empowerment.
            </p>
            <p>
              <strong>Right2Thrive UK</strong> is actively seeking support to expand our impact,
              scale our services, and invest in the wellbeing of the next generation.
            </p>
          </div>
        </div>
      </section>

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
