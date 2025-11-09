"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, User, ArrowRight, Filter, SortAsc, SortDesc } from "lucide-react"

// Blog data structure
interface BlogPost {
  id: string
  title: string
  excerpt: string
  fullContent: string
  author: string
  date: string
  category: string
  tags: string[]
  readTime: string
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: "cultural-competence",
    title: "Cultural Competence in Mental Health: Why It Matters",
    excerpt: "Exploring the importance of culturally responsive approaches to mental health support and how they can improve outcomes for diverse communities.",
    fullContent: "Full article content here...",
    author: "Dr. Emma Johnson",
    date: "2025-05-10",
    category: "cultural",
    tags: ["cultural competence", "mental health", "diversity"],
    readTime: "8 min read",
    featured: true
  },
  {
    id: "gad7-phq9",
    title: "Understanding GAD-7 and PHQ-9 Assessments",
    excerpt: "A comprehensive guide to understanding anxiety and depression screening tools and how to interpret your results.",
    fullContent: "Full article content here...",
    author: "Dr. Sarah Williams",
    date: "2025-05-05",
    category: "mental-health",
    tags: ["assessment", "anxiety", "depression"],
    readTime: "6 min read",
    featured: false
  },
  {
    id: "traditional-healing",
    title: "Traditional Healing Practices in Modern Mental Health",
    excerpt: "How traditional cultural healing practices can complement modern mental health approaches for holistic wellbeing.",
    fullContent: "Full article content here...",
    author: "Maya Thompson",
    date: "2025-04-28",
    category: "cultural",
    tags: ["traditional healing", "holistic", "cultural practices"],
    readTime: "7 min read",
    featured: false
  },
  {
    id: "young-people-support",
    title: "Supporting Young People's Mental Health",
    excerpt: "Practical strategies for parents and caregivers to support young people's mental health in culturally sensitive ways.",
    fullContent: "Full article content here...",
    author: "James Wilson",
    date: "2025-04-20",
    category: "resources",
    tags: ["young people", "parents", "support strategies"],
    readTime: "9 min read",
    featured: false
  },
  {
    id: "mindfulness-techniques",
    title: "Culturally Adapted Mindfulness Techniques for Anxiety",
    excerpt: "Discover mindfulness techniques adapted from various cultural traditions that can help manage anxiety and promote mental wellbeing.",
    fullContent: "Full article content here...",
    author: "Dr. Robert Chen",
    date: "2025-04-15",
    category: "mental-health",
    tags: ["mindfulness", "anxiety", "cultural adaptation"],
    readTime: "5 min read",
    featured: false
  },
  {
    id: "community-support",
    title: "The Role of Community in Mental Health Support",
    excerpt: "Exploring how community connections and cultural support networks can play a vital role in mental health recovery and resilience.",
    fullContent: "Full article content here...",
    author: "Olivia Parker",
    date: "2025-04-08",
    category: "cultural",
    tags: ["community", "support networks", "resilience"],
    readTime: "6 min read",
    featured: false
  },
  {
    id: "digital-mental-health",
    title: "Digital Mental Health Tools: Benefits and Limitations",
    excerpt: "An analysis of digital mental health tools like the Veris platform, and how they can be made more culturally responsive and accessible.",
    fullContent: "Full article content here...",
    author: "Daniel Lee",
    date: "2025-04-01",
    category: "resources",
    tags: ["digital tools", "accessibility", "technology"],
    readTime: "7 min read",
    featured: false
  }
]

const categories = [
  { value: "all", label: "All Articles", count: blogPosts.length },
  { value: "mental-health", label: "Mental Health", count: blogPosts.filter(post => post.category === "mental-health").length },
  { value: "cultural", label: "Cultural Insights", count: blogPosts.filter(post => post.category === "cultural").length },
  { value: "resources", label: "Resources", count: blogPosts.filter(post => post.category === "resources").length }
]

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [excerptLength, setExcerptLength] = useState<"short" | "medium" | "long">("medium")

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    // Sort posts
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "author":
          comparison = a.author.localeCompare(b.author)
          break
        case "readTime":
          const aTime = parseInt(a.readTime)
          const bTime = parseInt(b.readTime)
          comparison = aTime - bTime
          break
        default:
          comparison = 0
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy, sortOrder])

  // Get excerpt based on length setting
  const getExcerpt = (excerpt: string) => {
    switch (excerptLength) {
      case "short":
        return excerpt.length > 100 ? excerpt.substring(0, 100) + "..." : excerpt
      case "long":
        return excerpt.length > 300 ? excerpt.substring(0, 300) + "..." : excerpt
      default: // medium
        return excerpt.length > 200 ? excerpt.substring(0, 200) + "..." : excerpt
    }
  }

  const featuredPost = blogPosts.find(post => post.featured)
  const recentPosts = filteredAndSortedPosts.filter(post => !post.featured).slice(0, 3)

  return (
    <>
      {/* JSON-LD Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Right2Thrive UK Mental Health Blog",
            "description": "Insights, resources, and stories about mental health and culturally responsive wellbeing",
            "url": "https://right2thriveuk.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Right2Thrive UK",
              "url": "https://right2thriveuk.com",
              "logo": "https://right2thriveuk.com/right2thrive-logo.jpg"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "url": `https://right2thriveuk.com/blog/${post.id}`,
              "datePublished": post.date,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "image": "https://right2thriveuk.com/blog.png"
            }))
          })
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ff961b]">Blog</h1>
          <p className="text-gray-600">
            Insights, resources, and stories about mental health and culturally responsive wellbeing
          </p>
        </div>

        {/* Enhanced Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10" 
              placeholder="Search articles, tags, or authors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-4">
                  {categories.map((category) => (
                    <TabsTrigger key={category.value} value={category.value} className="text-xs">
                      {category.label} ({category.count})
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="readTime">Read Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            {/* Excerpt Length Control */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Excerpt:</span>
              <Select value={excerptLength} onValueChange={(value: "short" | "medium" | "long") => setExcerptLength(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedPosts.length} of {blogPosts.length} articles
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
          </div>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Featured</Badge>
              <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
            </div>
            <Card className="overflow-hidden border-2 border-teal-100">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image src="/blog.png?height=600&width=800" alt={featuredPost.title} fill className="object-cover" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>
                  <CardTitle className="mb-4 text-2xl font-bold text-[#ff961b]">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="mb-4 text-base">
                    {getExcerpt(featuredPost.excerpt)}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/blog/${featuredPost.id}`}>
                    <Button className="bg-[#00990d] text-white hover:bg-[#3c362f]">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recent Articles Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#ff961b]">Recent Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Card key={post.id} className="border-2 border-teal-100 hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="/blog.png?height=400&width=600"
                    alt={post.title}
                    fill
                    className="rounded-t-lg object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        <Link href={`/authors/${post.author.toLowerCase().replace(/\s+/g, '-').replace('dr.', 'dr-')}`} className="hover:text-[#00990d]">
                          <span>{post.author}</span>
                        </Link>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {getExcerpt(post.excerpt)}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardFooter>
                  <Link href={`/blog/${post.id}`} className="w-full">
                    <Button variant="ghost" className="w-full text-orange-600 hover:text-teal-700">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* All Articles List */}
        {filteredAndSortedPosts.length > 3 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-[#ff961b]">All Articles</h2>
            <div className="space-y-6">
              {filteredAndSortedPosts.slice(3).map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <div className="grid md:grid-cols-4">
                    <div className="relative h-48 md:h-full">
                      <Image
                        src="/blog.png?height=300&width=400"
                        alt={post.title}
                        fill
                        className="rounded-t-lg object-cover md:rounded-l-lg md:rounded-tr-none"
                      />
                    </div>
                    <div className="p-6 md:col-span-3">
                      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            <Link href={`/authors/${post.author.toLowerCase().replace(/\s+/g, '-').replace('dr.', 'dr-')}`} className="hover:text-[#00990d]">
                              <span>{post.author}</span>
                            </Link>
                          </div>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{post.readTime}</span>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-[#ff961b] line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mb-4 text-gray-600 line-clamp-3">
                        {getExcerpt(post.excerpt)}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="ghost" className="text-orange-600 hover:text-teal-700">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="rounded-lg bg-[#00990d] p-8 text-white">
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
                <Button className="rounded-l-none bg-blue-500 hover:bg-blue-600">Subscribe</Button>
              </div>
              <p className="text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time. See our{" "}
                <Link href="/privacy" className="underline hover:text-orange-400">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
