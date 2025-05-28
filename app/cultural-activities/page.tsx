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
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";

export default function CulturalActivities() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2c261f]">
          Cultural Activities
        </h1>
        <p className="text-gray-600">
          Explore our culturally responsive events and activities designed to
          support mental wellbeing
        </p>
      </div>

      {/* Featured Event */}
      <section className="mb-12">
        <div className="overflow-hidden rounded-lg bg-[#2c261f] text-white shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="mb-4 text-2xl font-bold">
                Cultural Healing Workshop Series
              </h2>
              <p className="mb-6">
                Join our monthly workshop series exploring traditional healing
                practices from diverse cultural backgrounds. Learn how these
                practices can complement modern mental health approaches and
                support your wellbeing journey.
              </p>
              <div className="mb-6 space-y-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-teal-400" />
                  <span>Next workshop: July 26, 2025 | 14:00 - 16:00</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-teal-400" />
                  <span>
                    Right 2 Thrive UK Wellbeing Hub<br /> 37/38 North Square, Edmonton
                    Green Shopping Centre<br />London N9 0HY
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-teal-400" />
                  <span>15 spots remaining</span>
                </div>
              </div>
              <Button className="bg-teal-500 text-white hover:bg-teal-600">
                Register Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Cultural Healing Workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">
          Upcoming Activities
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-teal-100">
            <CardHeader>
              <CardTitle>Art Therapy Session</CardTitle>
              <CardDescription>
                Express yourself through culturally inspired art
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Art Therapy Session"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-teal-500" />
                  <span>June 2, 2025 | 18:00 - 20:00</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-teal-500" />
                  <span>Art Studio, 45 Park Lane, London</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-teal-500" />
                  <span>8 spots remaining</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2c261f] text-white hover:bg-[#3c362f]">
                Register
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-teal-100">
            <CardHeader>
              <CardTitle>Cultural Food & Wellbeing</CardTitle>
              <CardDescription>
                Explore the connection between food and mental health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Cultural Food Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-teal-500" />
                  <span>June 10, 2025 | 12:00 - 14:00</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-teal-500" />
                  <span>Community Kitchen, 78 High Street, London</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-teal-500" />
                  <span>12 spots remaining</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2c261f] text-white hover:bg-[#3c362f]">
                Register
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-teal-100">
            <CardHeader>
              <CardTitle>Mindfulness & Meditation</CardTitle>
              <CardDescription>
                Traditional meditation practices from around the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Mindfulness Session"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-teal-500" />
                  <span>June 15, 2025 | 09:00 - 10:30</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-teal-500" />
                  <span>Wellness Center, 32 Queen Street, London</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-teal-500" />
                  <span>20 spots remaining</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#2c261f] text-white hover:bg-[#3c362f]">
                Register
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Past Events */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">
          Past Activities
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Identity Workshop</CardTitle>
              <CardDescription>
                Exploring the role of cultural identity in mental health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Cultural Identity Workshop"
                  fill
                  className="object-cover opacity-70"
                />
              </div>
              <p className="text-sm text-gray-600">
                This workshop explored how cultural identity influences mental
                health and wellbeing, with discussions on navigating cultural
                expectations and building resilience.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Gallery
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storytelling for Healing</CardTitle>
              <CardDescription>
                Traditional storytelling as a therapeutic practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Storytelling Session"
                  fill
                  className="object-cover opacity-70"
                />
              </div>
              <p className="text-sm text-gray-600">
                Participants shared stories from their cultural backgrounds and
                learned how storytelling can be used as a therapeutic tool for
                processing emotions and experiences.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Gallery
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Music & Movement Therapy</CardTitle>
              <CardDescription>
                Exploring cultural rhythms and movement for wellbeing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Music Therapy Session"
                  fill
                  className="object-cover opacity-70"
                />
              </div>
              <p className="text-sm text-gray-600">
                This session introduced participants to various cultural music
                and movement practices that can help reduce stress, improve
                mood, and promote emotional expression.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Gallery
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Community Testimonials */}
      {/* <section>
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">
          Community Testimonials
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <p className="mb-4 italic text-gray-600">
                "The cultural healing workshops have been transformative for me.
                Learning about traditional practices from my heritage has helped
                me connect with my roots and find new ways to manage my
                anxiety."
              </p>
              <p className="font-medium text-[#2c261f]">
                - Sarah K., Workshop Participant
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <p className="mb-4 italic text-gray-600">
                "I've struggled to find mental health support that understands
                my cultural background. Right2Thrive's activities have provided
                a space where I feel seen and understood. The mindfulness
                sessions have been particularly helpful."
              </p>
              <p className="font-medium text-[#2c261f]">
                - Michael T., Regular Attendee
              </p>
            </CardContent>
          </Card>
        </div>
      </section> */}
    </div>
  );
}
