// Shared blog data for list and single post pages
export interface BlogPost {
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

export const blogPosts: BlogPost[] = [
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

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === slug)
}
