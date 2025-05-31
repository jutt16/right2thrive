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
import { Calendar, Download, ExternalLink } from "lucide-react";

export default function PressRelease() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2c261f]">Press Release</h1>
        <p className="text-gray-600">
          Latest news and announcements from Right2Thrive UK
        </p>
      </div>

      {/* Latest Press Release */}
      <section className="mb-12">
        <Card className="border-2 border-teal-100">
          <CardHeader>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>May 1, 2025</span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#2c261f]">
              Right2Thrive UK Launches New Veris Platform for Mental Health
              Assessments
            </CardTitle>
            <CardDescription>
              Innovative digital platform provides culturally responsive mental
              health assessments and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <p>
                <strong>15th May 2025</strong> - Right2Thrive UK today announced
                it will be launching its new Wellbeing Virtual Platform, to
                provide culturally responsive mental health assessments and
                support to diverse communities across the United Kingdom
              </p>
              <p>
                The Veris platform integrates standardized mental health
                assessment tools, including the GAD-7 for anxiety and PHQ-9 for
                depression, with culturally responsive approaches that
                acknowledge and respect the diverse backgrounds and experiences
                of users.
              </p>
              <p>
                "We recognize that cultural background significantly influences
                how individuals experience and express mental health
                challenges," said Colin Lee-Own, Founder and Clinical Director
                of Right2Thrive UK. "The Veris platform is designed to bridge
                the gap between standardized assessment tools and the cultural
                contexts that shape mental health experiences."
              </p>
              <p>
                The platform offers users the ability to complete assessments,
                track their mental health journey over time, and access
                culturally relevant resources and support. It also connects
                users to Right2Thrive UK's in-person activities and community
                support networks.
              </p>
              <p>
                The launch of the Veris platform comes at a time when mental
                health services are increasingly recognizing the importance of
                culturally responsive approaches. Research has shown that
                cultural factors can significantly impact how mental health
                challenges are experienced, expressed, and treated.
              </p>
              <p>
                Right2Thrive UK has been providing culturally responsive mental
                health support since 2020, offering workshops, community
                activities, and resources designed to support wellbeing in
                diverse communities.
              </p>
              <p>
                The Veris platform is now available to users across the UK. For
                more information, visit right2thriveuk.com.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center bg-[#2c261f] text-white hover:bg-[#3c362f]">
                <Download className="mr-2 h-4 w-4" />
                Download Press Release
              </Button>
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Media Kit
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Press Archive */}
      {/* <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">Press Archive</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>March 15, 2025</span>
              </div>
              <CardTitle>Right2Thrive UK Receives Grant for Cultural Mental Health Research</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Right2Thrive UK has been awarded a significant grant to conduct research on culturally responsive mental
                health approaches and their effectiveness in diverse communities.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                Read More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>February 10, 2025</span>
              </div>
              <CardTitle>Right2Thrive UK Partners with Local Community Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                New partnerships with five community organizations across London will expand Right2Thrive UK's reach and
                enhance culturally responsive mental health support services.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                Read More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>January 5, 2025</span>
              </div>
              <CardTitle>Annual Report Shows Impact of Culturally Responsive Mental Health Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Right2Thrive UK's annual report reveals significant positive outcomes for participants in culturally
                responsive mental health programs over the past year.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                Read More
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>November 20, 2024</span>
              </div>
              <CardTitle>Right2Thrive UK Launches Youth Mental Health Initiative</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                New program specifically designed to support the mental health of young people from diverse cultural
                backgrounds through peer support and culturally responsive resources.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                Read More
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section> */}

      {/* Media Contacts */}
      {/* <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">Media Contacts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-[#2c261f]">Press Inquiries</h3>
              <p className="mb-4 text-gray-600">For all press and media inquiries, please contact:</p>
              <div className="space-y-2">
                <p className="font-medium">Sarah Thompson</p>
                <p>Media Relations Manager</p>
                <p>Email: press@right2thriveuk.com</p>
                <p>Phone: +44 123 456 7890</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-[#2c261f]">Interview Requests</h3>
              <p className="mb-4 text-gray-600">
                For interview requests with Right2Thrive UK team members, please contact:
              </p>
              <div className="space-y-2">
                <p className="font-medium">James Wilson</p>
                <p>Communications Coordinator</p>
                <p>Email: interviews@right2thriveuk.com</p>
                <p>Phone: +44 123 456 7891</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Resources for Media */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">
          Resources for Media
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Logo Pack"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Logo Pack</CardTitle>
              <CardDescription>
                Download Right2Thrive UK logos in various formats
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-[#2c261f] text-white hover:bg-[#3c362f]">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Image Gallery"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
              <CardDescription>
                High-resolution images for media use
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-[#2c261f] text-white hover:bg-[#3c362f]">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <div className="relative h-48">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Fact Sheet"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Fact Sheet</CardTitle>
              <CardDescription>
                Key information about Right2Thrive UK
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full bg-[#2c261f] text-white hover:bg-[#3c362f]">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
