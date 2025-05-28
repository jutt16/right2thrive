import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, ArrowRight } from "lucide-react"

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2c261f]">Blog</h1>
        <p className="text-gray-600">
          Insights, resources, and stories about mental health and culturally responsive wellbeing
        </p>
      </div>

      {/* Search and Categories */}
      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input className="pl-10" placeholder="Search articles..." />
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
            <TabsTrigger value="cultural">Cultural Insights</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Featured Article */}
      <div className="mb-12">
        <Card className="overflow-hidden border-2 border-teal-100">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto">
              <Image src="/placeholder.svg?height=600&width=800" alt="Featured Article" fill className="object-cover" />
            </div>
            <div className="p-6 md:p-8">
              <div className="mb-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>May 10, 2025</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  <span>Dr. Emma Johnson</span>
                </div>
              </div>
              <CardTitle className="mb-4 text-2xl font-bold text-[#2c261f]">
                Cultural Competence in Mental Health: Why It Matters
              </CardTitle>
              <CardDescription className="mb-4 text-base">
                Exploring the importance of culturally responsive approaches to mental health support and how they can
                improve outcomes for diverse communities.
              </CardDescription>
              <Link href="/blog/cultural-competence-in-mental-health">
                <Button className="bg-[#2c261f] text-white hover:bg-[#3c362f]">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Articles */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">Recent Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-teal-100">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Understanding GAD-7 and PHQ-9"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <div className="mb-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>May 5, 2025</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>Dr. Sarah Williams</span>
                </div>
              </div>
              <CardTitle className="text-lg">Understanding GAD-7 and PHQ-9 Assessments</CardTitle>
              <CardDescription>
                A comprehensive guide to understanding anxiety and depression screening tools and how to interpret your
                results.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/blog/understanding-gad7-phq9" className="w-full">
                <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-2 border-teal-100">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Traditional Healing Practices"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <div className="mb-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>April 28, 2025</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>Maya Thompson</span>
                </div>
              </div>
              <CardTitle className="text-lg">Traditional Healing Practices in Modern Mental Health</CardTitle>
              <CardDescription>
                How traditional cultural healing practices can complement modern mental health approaches for holistic
                wellbeing.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/blog/traditional-healing-practices" className="w-full">
                <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-2 border-teal-100">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Supporting Young People"
                fill
                className="rounded-t-lg object-cover"
              />
            </div>
            <CardHeader>
              <div className="mb-2 flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>April 20, 2025</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>James Wilson</span>
                </div>
              </div>
              <CardTitle className="text-lg">Supporting Young People's Mental Health</CardTitle>
              <CardDescription>
                Practical strategies for parents and caregivers to support young people's mental health in culturally
                sensitive ways.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/blog/supporting-young-people" className="w-full">
                <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* More Articles */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-[#2c261f]">More Articles</h2>
        <div className="space-y-6">
          <Card>
            <div className="grid md:grid-cols-4">
              <div className="relative h-48 md:h-full">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Mindfulness Techniques"
                  fill
                  className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-tr-none"
                />
              </div>
              <div className="p-6 md:col-span-3">
                <div className="mb-2 flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>April 15, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    <span>Dr. Robert Chen</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#2c261f]">
                  Culturally Adapted Mindfulness Techniques for Anxiety
                </h3>
                <p className="mb-4 text-gray-600">
                  Discover mindfulness techniques adapted from various cultural traditions that can help manage anxiety
                  and promote mental wellbeing.
                </p>
                <Link href="/blog/mindfulness-techniques">
                  <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card>
            <div className="grid md:grid-cols-4">
              <div className="relative h-48 md:h-full">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Community Support"
                  fill
                  className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-tr-none"
                />
              </div>
              <div className="p-6 md:col-span-3">
                <div className="mb-2 flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>April 8, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    <span>Olivia Parker</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#2c261f]">
                  The Role of Community in Mental Health Support
                </h3>
                <p className="mb-4 text-gray-600">
                  Exploring how community connections and cultural support networks can play a vital role in mental
                  health recovery and resilience.
                </p>
                <Link href="/blog/community-support">
                  <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card>
            <div className="grid md:grid-cols-4">
              <div className="relative h-48 md:h-full">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Digital Mental Health"
                  fill
                  className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-tr-none"
                />
              </div>
              <div className="p-6 md:col-span-3">
                <div className="mb-2 flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>April 1, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    <span>Daniel Lee</span>
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#2c261f]">
                  Digital Mental Health Tools: Benefits and Limitations
                </h3>
                <p className="mb-4 text-gray-600">
                  An analysis of digital mental health tools like the Veris platform, and how they can be made more
                  culturally responsive and accessible.
                </p>
                <Link href="/blog/digital-mental-health">
                  <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-lg bg-[#2c261f] p-8 text-white">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-2xl font-bold">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300">
              Stay updated with the latest articles, resources, and events from Right2Thrive UK.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 md:items-end">
            <div className="flex w-full max-w-md">
              <Input
                type="email"
                placeholder="Your email address"
                className="rounded-r-none border-r-0 bg-white text-gray-900"
              />
              <Button className="rounded-l-none bg-teal-500 hover:bg-teal-600">Subscribe</Button>
            </div>
            <p className="text-xs text-gray-400">
              We respect your privacy. Unsubscribe at any time. See our{" "}
              <Link href="/privacy" className="underline hover:text-teal-400">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
