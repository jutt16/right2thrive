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
        <h1 className="text-3xl font-bold text-[#ff961b]">Press Release</h1>
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
              <span>24th July 2025</span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Launch of the Right2Thrive UK Wellbeing Platform on the  6th September 2025.
            </CardTitle>
            <CardDescription>
              Empowering diverse communities with culturally responsive mental health support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <p>
                <strong>24th July 2025</strong> - The Right2Thrive UK Wellbeing Hub will be providing culturally responsive mental health support once launched on the 6th September 2025., offering counselling, workshops, community activities, and resources designed to support wellbeing in diverse communities.
              </p>
              <p>
                "We recognize that cultural background significantly influences how individuals experience and express mental health challenges," said Colin Lee-Own, Founder and Clinical Director of Right2Thrive UK. "The platform is designed to bridge the gap between standardized tools and cultural understanding."
              </p>
              <p>
                The new Wellbeing Hub is a major step in providing inclusive support, connecting users to mental health resources that reflect their lived experiences and cultural identities.
              </p>
              <p>
                For further information please contact Colin: 07415771394. Email: hello@right2thriveuk.com
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center bg-[#00990d] text-white hover:bg-[#3c362f]">
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

      {/* Resources for Media */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-[#ff961b]">
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
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
