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
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold md:text-5xl mb-4">
              Creating a Safe Space for Healing and Growth
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              We are dedicated to supporting young Black men and women, who face unique mental health challenges and are disproportionately affected by systemic barriers. At the same time, our services are open to everyone, as we believe that healing and wellbeing should be accessible to all. Our culturally sensitive approach ensures that every individual feels seen, valued, and supported.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4 flex-wrap">
              <Link href="/wellbeing-hub?tab=assessments">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="/img1.jpg"
              alt="Happy Chapter Illustration"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Why Right2Thrive UK Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">
            Why Right2Thrive UK?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Young Black men and women in the UK face systemic barriers to mental health support, often leading to overrepresentation in mental health interventions. At Right2Thrive UK, our mission is to address these challenges by offering tailored, empathetic care and culturally relevant resources.
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            We believe that healing and growth are rights, not privileges. By creating an inclusive and supportive environment, we empower individuals to thrive, regardless of their background.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-10 text-left">
            <div className="bg-gray-50 p-6 rounded shadow">
              <h3 className="text-lg font-semibold text-[#00990d] mb-2">
                Mental Health Statistics for Young Black Men and Women in the UK:
              </h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Black people are <strong>four times more likely</strong> to be detained under the Mental Health Act compared to white people (NHS).</li>
                <li>Young Black men are overrepresented in secure mental health settings and face higher rates of coercive treatments.</li>
                <li>Black children and adolescents are <strong>1.5 times more likely</strong> to be referred through social services or criminal justice rather than primary care.</li>
                <li>Black individuals are more likely to experience physical restraint or seclusion during mental health treatment.</li>
                <li>Stigma and cultural barriers often delay access to early support, resulting in crisis-level interventions.</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded shadow">
              <ul className="list-disc pl-5 text-gray-700 mt-10 md:mt-0">
                <li><strong>Black women</strong> are more likely to experience common mental health disorders such as anxiety and depression (Mental Health Foundation).</li>
                <li>They are also <strong>less likely to receive treatment</strong>, with many reporting a lack of culturally sensitive care options (Race Equality Foundation).</li>
                <li>Black women face higher rates of <strong>domestic abuse</strong>, which has a profound impact on mental health and access to services (ONS 2020).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Wellbeing Hub Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">Our Wellbeing Hub</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            The Wellbeing Hub is a key part of our services, designed to provide the tools and support you need to thrive. It includes:
          </p>
          <ul className="text-gray-700 max-w-2xl mx-auto text-left list-disc pl-5 mb-10">
            <li>Personalized one-on-one counseling</li>
            <li>Group therapy sessions and peer support</li>
            <li>Guided mental health check-ins</li>
            <li>Cultural activities that promote healing and a sense of belonging</li>
          </ul>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Whether you’re feeling overwhelmed, anxious, or simply need a safe space to talk, our Wellbeing Hub is here for you.
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#ff961b] mb-6">Resources for Your Mental Wellness</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            We offer a range of practical and helpful resources to guide you on your mental health journey:
          </p>
          <ul className="text-gray-700 max-w-2xl mx-auto text-left list-disc pl-5">
            <li>Simple tips for managing stress and improving emotional wellbeing</li>
            <li>Interactive tools to help you reflect on your feelings and progress</li>
            <li>Informative articles and blog posts on a variety of mental health topics</li>
            <li>Links to trusted external services for additional support</li>
          </ul>
          <p className="text-gray-700 mt-6">
            Explore our resources to take the first step toward improving your mental health and wellbeing.
          </p>
        </div>
      </section>

      {/* Original Why This Matters section & testimonial kept intact with images */}
      <section className="bg-[#f8fafc] py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-10">
            <img
              src="/img2.jpg"
              alt="Community Healing"
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
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
                <span className="text-2xl font-bold text-orange-600">1 in 4</span>{" "}
                Will experience mental health challenges
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto mb-8">
            <img
              src="/img3.jpg"
              alt="Testimonial"
              className="w-full md:w-1/3 rounded-lg shadow-md object-cover"
            />
            <blockquote className="italic text-gray-600 md:text-left text-center">
              “At Right2Thrive UK we empower individuals to overcome challenges, build resistance and create brighter futures for themselves and their families.”
              <br />
              {/* <span className="block font-semibold text-[#ff961b] mt-2">
                – Marcus, Birmingham
              </span> */}
            </blockquote>
          </div>

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
