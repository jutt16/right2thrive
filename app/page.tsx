import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ShieldCheck,
  Users,
  LifeBuoy,
  Baby,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#00990d] py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center text-center md:text-left">
          {/* Text Content */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold md:text-5xl mb-4">
              Every Story Deserves a Happy Chapter
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              Life hits hard sometimes. Stress, trauma, depression — they can
              make you feel stuck, like you're not the person you used to be.
              But here's the thing: your story isn't over. We're here to help
              you write the next chapter, one where you don't just survive — you
              thrive.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
              <Link href="/auth/signup">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  Get Started
                </Button>
              </Link>
              <Link href="/wellbeing-hub">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Explore Wellbeing Hub
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="/img1.jpg"
              alt="Happy Chapter Illustration"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* This Is How We Do It Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">
            This Is How We Do It
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            We're not your typical mental health service. We're your neighbours,
            your community, your people. We get it because we've been there too.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card Items */}
            <Card className="border-2 border-teal-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#ff961b] mb-2">
                  Someone Who Gets It
                </h3>
                <p className="text-gray-600">
                  You don't have to explain why certain things hit different. We
                  understand the weight you carry. Here, you can just be
                  yourself.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <ShieldCheck className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#ff961b] mb-2">
                  A Safe Space to Heal
                </h3>
                <p className="text-gray-600">
                  No judgment, no rush. Just a warm place to process, reflect,
                  and grow at your pace — not ours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Baby className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#ff961b] mb-2">
                  Families Grow Together
                </h3>
                <p className="text-gray-600">
                  Healing isn’t solo. We support families to break cycles and
                  build healthy bonds that uplift everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#ff961b] mb-2">
                  Early Help, Real Change
                </h3>
                <p className="text-gray-600">
                  We catch you when you’re wobbling, not falling. Early support
                  leads to real, lasting change.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <LifeBuoy className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#ff961b] mb-2">
                  More Than Just Talking
                </h3>
                <p className="text-gray-600">
                  Therapy is one part. We teach real-life skills — from setting
                  boundaries to managing stress — to help you thrive every day.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#ff961b] mb-2">
                  Finding Your Spark Again
                </h3>
                <p className="text-gray-600">
                  Remember who you were before life got heavy? That person is
                  still there. We help you reconnect with your passions, your
                  dreams, your joy. Because thriving isn't just about surviving
                  - it's about living fully.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why This Matters Right Now Section */}
      <section className="bg-[#f8fafc] py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Image on Top */}
          <div className="mb-10">
            <img
              src="/img2.jpg"
              alt="Community Healing"
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Heading and Paragraphs */}
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">
            Why This Matters Right Now
          </h2>
          <p className="text-gray-700 mb-6">
            Let’s keep it real — our community is hurting. Too many of our
            brothers and sisters end up in crisis, in hospitals, in systems that
            don’t understand us. We’re here to change that story.
          </p>
          <p className="text-gray-700 mb-6">
            We know that when Black communities have early access to mental
            health support that actually gets us, everything changes. Fewer
            breakdowns. Stronger families. More people thriving instead of just
            surviving.
          </p>
          <p className="text-gray-700 mb-8">
            This isn’t just about individual healing — it’s about community
            healing. When we support each other, when we catch each other before
            the fall, when we create spaces where our stories matter, that’s
            when real change happens.
          </p>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-left text-gray-700 font-medium">
            <div className="bg-white p-4 shadow rounded">
              <p>
                <span className="text-2xl font-bold text-orange-600">3x</span>{" "}
                Higher rates of detention under Mental Health Act
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <p>
                <span className="text-2xl font-bold text-orange-600">40%</span>{" "}
                Less likely to access early support
              </p>
            </div>
            <div className="bg-white p-4 shadow rounded">
              <p>
                <span className="text-2xl font-bold text-orange-600">
                  1 in 4
                </span>{" "}
                Will experience mental health challenges
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto mb-8">
            {/* Image on the Left */}
            <img
              src="/img3.jpg"
              alt="Testimonial"
              className="w-full md:w-1/3 rounded-lg shadow-md object-cover"
            />

            {/* Quote on the Right */}
            <blockquote className="italic text-gray-600 md:text-left text-center">
              “I was drowning in stress and didn't know where to turn.
              Right2Thrive UK didn't just throw a lifeline – they taught me how to
              swim again. Now my whole family is stronger, and I'm showing up as
              the parent I always wanted to be.”
              <br />
              <span className="block font-semibold text-[#ff961b] mt-2">
                – Marcus, Birmingham
              </span>
            </blockquote>
          </div>

          {/* CTA Button */}
          <Link href="/contact">
            <Button className="bg-teal-600 text-white hover:bg-teal-700">
              Let’s Talk
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
