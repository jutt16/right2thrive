import { generateMetadata as generateSEOMetadata } from "@/lib/seo-utils";

export const metadata = generateSEOMetadata({
  title: "Authors - Right2Thrive UK Mental Health Experts",
  description: "Meet our team of mental health professionals, cultural experts, and wellbeing specialists who contribute to Right2Thrive UK's blog and resources.",
  keywords: [
    "mental health experts",
    "cultural competence",
    "wellbeing specialists",
    "therapists",
    "psychologists",
    "Right2Thrive UK team",
    "mental health professionals"
  ],
  path: "/authors",
  image: "/authors-team.jpg"
});
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Award, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Author {
  id: string
  name: string
  title: string
  credentials: string[]
  bio: string
  specialties: string[]
  experience: string
  education: string[]
  certifications: string[]
  location: string
  profileImage: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    website?: string
  }
  recentPosts: {
    id: string
    title: string
    date: string
  }[]
}

const authors: Author[] = [
  {
    id: "dr-emma-johnson",
    name: "Dr. Emma Johnson",
    title: "Clinical Psychologist & Cultural Competence Specialist",
    credentials: ["PhD", "CPsychol", "HCPC Registered"],
    bio: "Dr. Emma Johnson is a clinical psychologist with over 15 years of experience in culturally responsive mental health care. She specializes in trauma-informed therapy and has published extensively on cultural competence in mental health services.",
    specialties: ["Cultural Competence", "Trauma Therapy", "Mental Health Assessment", "Community Psychology"],
    experience: "15+ years",
    education: [
      "PhD in Clinical Psychology - University of London",
      "MSc in Cross-Cultural Psychology - University of Manchester",
      "BSc in Psychology - University of Birmingham"
    ],
    certifications: [
      "HCPC Registered Clinical Psychologist",
      "EMDR Certified Therapist",
      "Cultural Competence Trainer (BPS Approved)"
    ],
    location: "London, UK",
    profileImage: "/authors/dr-emma-johnson.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/dr-emma-johnson",
      twitter: "@DrEmmaJohnson"
    },
    recentPosts: [
      { id: "cultural-competence", title: "Cultural Competence in Mental Health: Why It Matters", date: "2025-05-10" },
      { id: "trauma-informed-care", title: "Trauma-Informed Care in Diverse Communities", date: "2025-04-15" }
    ]
  },
  {
    id: "dr-sarah-williams",
    name: "Dr. Sarah Williams",
    title: "Clinical Psychologist & Assessment Specialist",
    credentials: ["PhD", "CPsychol", "HCPC Registered"],
    bio: "Dr. Sarah Williams is a clinical psychologist specializing in mental health assessment and evidence-based interventions. She has extensive experience working with young people and developing culturally sensitive assessment tools.",
    specialties: ["Mental Health Assessment", "Evidence-Based Therapy", "Young People's Mental Health", "Cognitive Behavioral Therapy"],
    experience: "12+ years",
    education: [
      "PhD in Clinical Psychology - University of Cambridge",
      "MSc in Applied Psychology - University of Oxford",
      "BSc in Psychology - University of Bristol"
    ],
    certifications: [
      "HCPC Registered Clinical Psychologist",
      "CBT Therapist (BABCP Accredited)",
      "Mental Health Assessment Specialist"
    ],
    location: "Cambridge, UK",
    profileImage: "/authors/dr-sarah-williams.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/dr-sarah-williams"
    },
    recentPosts: [
      { id: "gad7-phq9", title: "Understanding GAD-7 and PHQ-9 Assessments", date: "2025-05-05" },
      { id: "assessment-tools", title: "Choosing the Right Mental Health Assessment Tools", date: "2025-04-20" }
    ]
  },
  {
    id: "maya-thompson",
    name: "Maya Thompson",
    title: "Cultural Wellbeing Coordinator & Traditional Healing Specialist",
    credentials: ["MA", "DipHE", "Traditional Healing Practitioner"],
    bio: "Maya Thompson brings over 10 years of experience in traditional healing practices and cultural wellbeing. She has worked extensively with diverse communities to integrate traditional healing approaches with modern mental health care.",
    specialties: ["Traditional Healing", "Cultural Wellbeing", "Community Engagement", "Holistic Approaches"],
    experience: "10+ years",
    education: [
      "MA in Cultural Studies - SOAS University of London",
      "Diploma in Traditional Healing Practices - Institute of Traditional Medicine",
      "BA in Anthropology - University of Sussex"
    ],
    certifications: [
      "Traditional Healing Practitioner (ITM Certified)",
      "Cultural Competence Facilitator",
      "Community Mental Health Worker"
    ],
    location: "London, UK",
    profileImage: "/authors/maya-thompson.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/maya-thompson"
    },
    recentPosts: [
      { id: "traditional-healing", title: "Traditional Healing Practices in Modern Mental Health", date: "2025-04-28" },
      { id: "holistic-wellbeing", title: "Integrating Holistic Approaches in Mental Health Care", date: "2025-04-10" }
    ]
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    title: "Youth Mental Health Specialist & Family Therapist",
    credentials: ["MA", "DipHE", "BACP Registered"],
    bio: "James Wilson is a qualified counselor and youth mental health specialist with extensive experience supporting young people and their families. He specializes in family therapy and has developed innovative approaches to engaging young people in mental health services.",
    specialties: ["Youth Mental Health", "Family Therapy", "Parent Support", "Engagement Strategies"],
    experience: "8+ years",
    education: [
      "MA in Counseling Psychology - University of East London",
      "Diploma in Family Therapy - Institute of Family Therapy",
      "BA in Psychology - University of Greenwich"
    ],
    certifications: [
      "BACP Registered Counselor",
      "Family Therapist (IFT Accredited)",
      "Youth Mental Health First Aid Instructor"
    ],
    location: "London, UK",
    profileImage: "/authors/james-wilson.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/james-wilson-counselor"
    },
    recentPosts: [
      { id: "young-people-support", title: "Supporting Young People's Mental Health", date: "2025-04-20" },
      { id: "family-therapy", title: "The Role of Family in Youth Mental Health Recovery", date: "2025-04-05" }
    ]
  },
  {
    id: "dr-robert-chen",
    name: "Dr. Robert Chen",
    title: "Mindfulness Specialist & Clinical Psychologist",
    credentials: ["PhD", "CPsychol", "HCPC Registered"],
    bio: "Dr. Robert Chen is a clinical psychologist and mindfulness specialist who has adapted mindfulness techniques from various cultural traditions for diverse communities. He has published research on culturally adapted mindfulness interventions.",
    specialties: ["Mindfulness", "Cultural Adaptation", "Anxiety Management", "Stress Reduction"],
    experience: "11+ years",
    education: [
      "PhD in Clinical Psychology - University of Edinburgh",
      "MSc in Mindfulness-Based Approaches - University of Bangor",
      "BSc in Psychology - University of Glasgow"
    ],
    certifications: [
      "HCPC Registered Clinical Psychologist",
      "Mindfulness-Based Stress Reduction (MBSR) Teacher",
      "Mindfulness-Based Cognitive Therapy (MBCT) Teacher"
    ],
    location: "Edinburgh, UK",
    profileImage: "/authors/dr-robert-chen.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/dr-robert-chen",
      website: "https://mindfulwellbeing.co.uk"
    },
    recentPosts: [
      { id: "mindfulness-techniques", title: "Mindfulness Techniques from Cultural Traditions", date: "2025-04-15" },
      { id: "anxiety-management", title: "Culturally Adapted Anxiety Management Techniques", date: "2025-04-01" }
    ]
  },
  {
    id: "olivia-parker",
    name: "Olivia Parker",
    title: "Community Mental Health Coordinator & Social Worker",
    credentials: ["MA", "DipSW", "HCPC Registered"],
    bio: "Olivia Parker is a qualified social worker and community mental health coordinator with extensive experience in building community support networks and developing culturally responsive mental health services.",
    specialties: ["Community Mental Health", "Support Networks", "Social Work", "Resilience Building"],
    experience: "9+ years",
    education: [
      "MA in Social Work - University of York",
      "Diploma in Social Work - University of Leeds",
      "BA in Sociology - University of Sheffield"
    ],
    certifications: [
      "HCPC Registered Social Worker",
      "Community Mental Health Worker",
      "Resilience Building Facilitator"
    ],
    location: "Manchester, UK",
    profileImage: "/authors/olivia-parker.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/olivia-parker-social-worker"
    },
    recentPosts: [
      { id: "community-support", title: "The Role of Community in Mental Health Support", date: "2025-04-08" },
      { id: "support-networks", title: "Building Resilient Community Support Networks", date: "2025-03-25" }
    ]
  },
  {
    id: "daniel-lee",
    name: "Daniel Lee",
    title: "Digital Mental Health Specialist & Technology Coordinator",
    credentials: ["MSc", "BSc", "Digital Health Specialist"],
    bio: "Daniel Lee is a digital mental health specialist who focuses on making mental health technology more accessible and culturally responsive. He has extensive experience in digital health implementation and user experience design.",
    specialties: ["Digital Mental Health", "Technology Accessibility", "User Experience", "Digital Inclusion"],
    experience: "7+ years",
    education: [
      "MSc in Digital Health - University College London",
      "BSc in Computer Science - University of Manchester",
      "Certificate in User Experience Design - General Assembly"
    ],
    certifications: [
      "Digital Health Specialist",
      "UX Design Certificate",
      "Accessibility Testing Specialist"
    ],
    location: "London, UK",
    profileImage: "/authors/daniel-lee.jpg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/daniel-lee-digital-health",
      twitter: "@DanielLeeDigital"
    },
    recentPosts: [
      { id: "digital-mental-health", title: "Digital Mental Health Tools: Benefits and Limitations", date: "2025-04-01" },
      { id: "tech-accessibility", title: "Making Mental Health Technology More Accessible", date: "2025-03-20" }
    ]
  }
]

export default function Authors() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#00990d] mb-4">Our Expert Authors</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our team of mental health professionals, cultural experts, and wellbeing specialists 
          who contribute to our blog and resources.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Card key={author.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Image
                  src={author.profileImage}
                  alt={`${author.name} profile picture`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
              </div>
              <CardTitle className="text-xl">{author.name}</CardTitle>
              <CardDescription className="text-sm font-medium text-[#00990d]">
                {author.title}
              </CardDescription>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {author.credentials.map((cred) => (
                  <Badge key={cred} variant="secondary" className="text-xs">
                    {cred}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">
                {author.bio}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {author.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-2" />
                  {author.experience} experience
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-1">
                  {author.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Recent Posts:</h4>
                <div className="space-y-1">
                  {author.recentPosts.slice(0, 2).map((post) => (
                    <Link 
                      key={post.id} 
                      href={`/blog/${post.id}`}
                      className="block text-sm text-[#00990d] hover:text-[#007a0a] line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Link href={`/authors/${author.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                {author.socialLinks?.linkedin && (
                  <Link href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Interested in Contributing?</h2>
        <p className="text-gray-600 mb-6">
          We're always looking for qualified mental health professionals and cultural experts to contribute to our blog.
        </p>
        <Link href="/contact?subject=Author Application">
          <Button className="bg-[#00990d] text-white hover:bg-[#007a0a]">
            Apply to Become an Author
          </Button>
        </Link>
      </div>
    </div>
  )
}
