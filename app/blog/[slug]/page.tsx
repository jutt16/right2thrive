import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { getPostBySlug, blogPosts } from "@/lib/blog-data"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Article not found" }
  return {
    title: `${post.title} | Right2Thrive UK Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center text-[#00990d] hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to blog
      </Link>

      <article className="max-w-3xl mx-auto">
        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src="/blog.png"
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(post.date).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            <Link
              href={`/authors/${post.author.toLowerCase().replace(/\s+/g, "-").replace("dr.", "dr-")}`}
              className="hover:text-[#00990d]"
            >
              {post.author}
            </Link>
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{post.readTime}</span>
        </div>
        <h1 className="text-3xl font-bold text-[#ff961b] mb-4">{post.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="prose prose-lg max-w-none text-gray-700">
          {post.fullContent.split("\n\n").map((para, i) => (
            <p key={i} className="mb-4">
              {para}
            </p>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t">
          <Link href="/blog">
            <Button className="bg-[#00990d] text-white hover:bg-[#3c362f]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Read more articles
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
