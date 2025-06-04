import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, BookOpen, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#2c261f] py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Right 2Thrive UK
              </h1>
              <p className="text-lg text-gray-300">
                Cultural Wellbeing Hub - Building Communities That Thrive, Not
                Just Survive
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/wellbeing-hub">
                  <Button className="bg-teal-500 text-white hover:bg-teal-600">
                    Access Wellbeing Hub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="outline"
                    className="bg-teal-500 text-white hover:bg-teal-600"
                  >
                    Sign Up Now
                  </Button>
                </Link>
              </div>
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

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2c261f]">
              Our Wellbeing Services
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We offer a range of services designed to support mental health and
              wellbeing through culturally responsive approaches.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 border-teal-100">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-teal-100 p-3">
                  <Heart className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#2c261f]">
                  Mental Health Assessments
                </h3>
                <p className="mb-4 text-gray-600">
                  Access standardized mental health assessments including GAD-7
                  for anxiety and PHQ-9 for depression screening.
                </p>
                <Link
                  href="/wellbeing-hub"
                  className="mt-auto text-teal-600 hover:text-teal-700"
                >
                  Learn more <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-teal-100 p-3">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#2c261f]">
                  Culturally Responsive Support
                </h3>
                <p className="mb-4 text-gray-600">
                  Receive support that acknowledges and respects your cultural
                  background and specific needs.
                </p>
                <Link
                  href="/cultural-activities"
                  className="mt-auto text-teal-600 hover:text-teal-700"
                >
                  Learn more <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-100">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-teal-100 p-3">
                  <BookOpen className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#2c261f]">
                  Resources & Education
                </h3>
                <p className="mb-4 text-gray-600">
                  Access educational resources, workshops, and guidance to
                  support your mental health journey.
                </p>
                <Link
                  href="/blog"
                  className="mt-auto text-teal-600 hover:text-teal-700"
                >
                  Learn more <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2c261f] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Start Your Wellbeing Journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            Join our platform to access mental health assessments, resources,
            and culturally responsive support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button className="bg-teal-500 text-white hover:bg-teal-600">
                Create an Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="bg-teal-500 text-white hover:bg-teal-600"
              >
                Login to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2c261f]">
              Why Choose Right2Thrive UK
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Our platform offers unique benefits designed to support your
              mental health journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-teal-500" />
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#2c261f]">
                  Standardized Assessments
                </h3>
                <p className="text-gray-600">
                  Access clinically validated GAD-7 and PHQ-9 assessments to
                  track your mental health progress.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-teal-500" />
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#2c261f]">
                  Cultural Sensitivity
                </h3>
                <p className="text-gray-600">
                  Our approach acknowledges the importance of cultural context
                  in mental health support.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-teal-500" />
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#2c261f]">
                  Progress Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your wellbeing journey with our Veris platform that
                  tracks your assessment results over time.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 flex-shrink-0 text-teal-500" />
              <div>
                <h3 className="mb-2 text-xl font-semibold text-[#2c261f]">
                  Comprehensive Support
                </h3>
                <p className="text-gray-600">
                  Access resources, community support, and professional guidance
                  all in one platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
