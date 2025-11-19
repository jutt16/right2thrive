"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, Download, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface PressRelease {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  featured: boolean
  image: string
  tags: string[]
  downloadUrl?: string
}

const pressReleases: PressRelease[] = [
  {
    id: "wellbeing-hub-opening",
    title: "UK's First Wellbeing Hub to Tackle Community Violence Opens in Edmonton Green",
    excerpt: "Right2Thrive UK opens the UK's first wellbeing hub specifically designed to tackle community violence in Edmonton Green, North London. The innovative approach combines culturally responsive mental health support, therapeutic interventions, and community engagement activities.",
    date: "2024-09-06",
    category: "announcement",
    featured: true,
    image: "/press1.jpg",
    tags: ["wellbeing hub", "community violence", "mental health", "Edmonton Green"],
    downloadUrl: "/press-releases/wellbeing-hub-opening.pdf"
  },
  {
    id: "cultural-competence-training",
    title: "Right2Thrive UK Launches Cultural Competence Training Programme",
    excerpt: "New training programme aims to improve cultural competence among mental health professionals working with diverse communities across North London.",
    date: "2024-08-15",
    category: "programme",
    featured: false,
    image: "/press2.jpg",
    tags: ["cultural competence", "training", "mental health professionals"],
    downloadUrl: "/press-releases/cultural-competence-training.pdf"
  },
  {
    id: "youth-mental-health-initiative",
    title: "New Initiative Targets Youth Mental Health Crisis in North London",
    excerpt: "Right2Thrive UK announces comprehensive youth mental health initiative providing free therapy sessions, peer support groups, and wellbeing activities for young people aged 16-24.",
    date: "2024-07-22",
    category: "initiative",
    featured: false,
    image: "/press3.jpg",
    tags: ["youth mental health", "free therapy", "peer support", "wellbeing activities"],
    downloadUrl: "/press-releases/youth-mental-health-initiative.pdf"
  },
  {
    id: "partnership-nhs",
    title: "Right2Thrive UK Partners with NHS Trust for Integrated Mental Health Services",
    excerpt: "Strategic partnership announced to integrate culturally responsive mental health services with NHS provision, improving access to appropriate care for diverse communities.",
    date: "2024-06-10",
    category: "partnership",
    featured: false,
    image: "/press4.jpg",
    tags: ["NHS partnership", "integrated care", "mental health services"],
    downloadUrl: "/press-releases/nhs-partnership.pdf"
  },
  {
    id: "funding-secured",
    title: "Right2Thrive UK Secures £500,000 Funding for Community Wellbeing Expansion",
    excerpt: "Major funding boost enables expansion of community wellbeing services across North London, including new therapy spaces and cultural activity programmes.",
    date: "2024-05-18",
    category: "funding",
    featured: false,
    image: "/press5.jpg",
    tags: ["funding", "expansion", "community wellbeing", "therapy spaces"],
    downloadUrl: "/press-releases/funding-announcement.pdf"
  },
  {
    id: "research-findings",
    title: "New Research Reveals Impact of Cultural Competence on Mental Health Outcomes",
    excerpt: "Groundbreaking research by Right2Thrive UK demonstrates significant improvements in mental health outcomes when cultural competence is integrated into therapeutic approaches.",
    date: "2024-04-25",
    category: "research",
    featured: false,
    image: "/press6.jpg",
    tags: ["research", "cultural competence", "mental health outcomes", "therapeutic approaches"],
    downloadUrl: "/press-releases/research-findings.pdf"
  },
  {
    id: "community-violence-report",
    title: "Community Violence Impact Report Highlights Need for Holistic Approaches",
    excerpt: "Comprehensive report on community violence impact in North London calls for integrated approaches combining mental health support, community engagement, and cultural healing.",
    date: "2024-03-12",
    category: "report",
    featured: false,
    image: "/press7.jpg",
    tags: ["community violence", "impact report", "holistic approaches", "cultural healing"],
    downloadUrl: "/press-releases/community-violence-report.pdf"
  }
]

const categories = [
  { value: "all", label: "All Releases", count: pressReleases.length },
  { value: "announcement", label: "Announcements", count: pressReleases.filter(release => release.category === "announcement").length },
  { value: "programme", label: "Programmes", count: pressReleases.filter(release => release.category === "programme").length },
  { value: "initiative", label: "Initiatives", count: pressReleases.filter(release => release.category === "initiative").length },
  { value: "partnership", label: "Partnerships", count: pressReleases.filter(release => release.category === "partnership").length },
  { value: "funding", label: "Funding", count: pressReleases.filter(release => release.category === "funding").length },
  { value: "research", label: "Research", count: pressReleases.filter(release => release.category === "research").length },
  { value: "report", label: "Reports", count: pressReleases.filter(release => release.category === "report").length }
]

export default function PressReleasesArchive() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredReleases = pressReleases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || release.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return a.title.localeCompare(b.title)
  })

  const featuredRelease = pressReleases.find(release => release.featured)
  const recentReleases = filteredReleases.filter(release => !release.featured)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#00990d] mb-4">Press Releases Archive</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Stay informed about our latest developments, partnerships, and initiatives in cultural wellbeing and mental health support.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search press releases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest First)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Release */}
      {featuredRelease && (
        <Card className="mb-12 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src={featuredRelease.image}
                alt={featuredRelease.title}
                width={600}
                height={400}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-[#00990d] text-white">Featured</Badge>
                <Badge variant="outline">{featuredRelease.category}</Badge>
              </div>
              <h2 className="text-2xl font-bold text-[#00990d] mb-4">
                {featuredRelease.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {featuredRelease.excerpt}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(featuredRelease.date).toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex gap-2">
                <Link href={`/press/${featuredRelease.id}`}>
                  <Button className="bg-[#00990d] text-white hover:bg-[#007a0a]">
                    Read Full Release
                  </Button>
                </Link>
                {featuredRelease.downloadUrl && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Releases Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recentReleases.map((release) => (
          <Card key={release.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={release.image}
                alt={release.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-white/90">
                  {release.category}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">
                {release.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {release.excerpt}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(release.date).toLocaleDateString('en-GB', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {release.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {release.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{release.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/press/${release.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </Link>
                  {release.downloadUrl && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredReleases.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No press releases found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search terms or filters</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Media Contact CTA */}
      <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-[#00990d] mb-4">Media Inquiries</h3>
        <p className="text-gray-600 mb-6">
          For press inquiries, interview requests, or additional information about our initiatives, 
          please contact our media team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact?subject=Media Inquiry">
            <Button className="bg-[#00990d] text-white hover:bg-[#007a0a]">
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Media Team
            </Button>
          </Link>
          <Link href="/press">
            <Button variant="outline">
              View Press Kit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
