// Server page; metadata provided by app/authors/[slug]/head.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Award, BookOpen, ExternalLink, Mail, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const author = {
  id: "dr-emma-johnson",
  name: "Dr. Emma Johnson",
  title: "Clinical Psychologist & Cultural Competence Specialist",
  credentials: ["PhD", "CPsychol", "HCPC Registered"],
  bio: "Dr. Emma Johnson is a clinical psychologist with over 15 years of experience in culturally responsive mental health care. She specializes in trauma-informed therapy and has published extensively on cultural competence in mental health services. Dr. Johnson has worked with diverse communities across the UK and internationally, developing innovative approaches to culturally sensitive mental health care.",
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
    "Cultural Competence Trainer (BPS Approved)",
    "Trauma-Informed Care Specialist"
  ],
  location: "London, UK",
  profileImage: "/authors/dr-emma-johnson.jpg",
  socialLinks: {
    linkedin: "https://linkedin.com/in/dr-emma-johnson",
    twitter: "@DrEmmaJohnson"
  },
  contact: {
    email: "emma.johnson@right2thriveuk.com",
    phone: "+44 20 1234 5678"
  },
  publications: [
    {
      title: "Cultural Competence in Mental Health: A Systematic Review",
      journal: "Journal of Cross-Cultural Psychology",
      year: "2023",
      doi: "10.1000/example"
    },
    {
      title: "Trauma-Informed Care in Diverse Communities: Best Practices",
      journal: "Clinical Psychology Review",
      year: "2022", 
      doi: "10.1000/example2"
    },
    {
      title: "Developing Culturally Responsive Assessment Tools",
      journal: "Assessment in Mental Health",
      year: "2021",
      doi: "10.1000/example3"
    }
  ],
  recentPosts: [
    { 
      id: "cultural-competence", 
      title: "Cultural Competence in Mental Health: Why It Matters", 
      date: "2025-05-10",
      excerpt: "Exploring the importance of culturally responsive approaches to mental health support and how they can improve outcomes for diverse communities."
    },
    { 
      id: "trauma-informed-care", 
      title: "Trauma-Informed Care in Diverse Communities", 
      date: "2025-04-15",
      excerpt: "Understanding how trauma-informed approaches can be adapted for different cultural contexts and communities."
    },
    {
      id: "assessment-tools",
      title: "Culturally Responsive Mental Health Assessment",
      date: "2025-03-20",
      excerpt: "A guide to developing and using assessment tools that are culturally sensitive and appropriate for diverse populations."
    }
  ],
  speakingEngagements: [
    {
      title: "Cultural Competence in Mental Health Services",
      event: "British Psychological Society Annual Conference",
      date: "2024",
      location: "Manchester, UK"
    },
    {
      title: "Trauma-Informed Care Across Cultures",
      event: "International Trauma Conference",
      date: "2023",
      location: "Dublin, Ireland"
    }
  ]
}

export default function AuthorProfile() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="text-center md:text-left">
            <Image
              src={author.profileImage}
              alt={`${author.name} profile picture`}
              width={200}
              height={200}
              className="rounded-full object-cover mx-auto md:mx-0 mb-4"
            />
            <h1 className="text-3xl font-bold text-[#00990d] mb-2">{author.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{author.title}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {author.credentials.map((cred) => (
                <Badge key={cred} variant="secondary">
                  {cred}
                </Badge>
              ))}
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {author.location}
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                {author.experience} experience
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About Dr. Emma Johnson</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-6">
                {author.bio}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {author.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {author.certifications.map((cert) => (
                      <li key={cert}>• {cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Education & Experience */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {author.education.map((edu, index) => (
                <li key={index} className="text-sm">
                  <div className="font-medium">{edu}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {author.publications.slice(0, 3).map((pub, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium">{pub.title}</div>
                  <div className="text-gray-600">{pub.journal}, {pub.year}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Blog Posts */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
          <CardDescription>Latest articles by Dr. Emma Johnson</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {author.recentPosts.map((post) => (
              <div key={post.id} className="border-b pb-4 last:border-b-0">
                <Link href={`/blog/${post.id}`} className="group">
                  <h3 className="font-semibold text-[#00990d] group-hover:text-[#007a0a] mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-GB', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Speaking Engagements */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Speaking Engagements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {author.speakingEngagements.map((engagement, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium">{engagement.title}</div>
                <div className="text-gray-600">{engagement.event}, {engagement.date}</div>
                <div className="text-gray-500">{engagement.location}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Social Links */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/contact?subject=Consultation with Dr. Emma Johnson">
          <Button className="bg-[#00990d] text-white hover:bg-[#007a0a]">
            <Mail className="h-4 w-4 mr-2" />
            Book a Consultation
          </Button>
        </Link>
        
        {author.socialLinks?.linkedin && (
          <Link href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              LinkedIn Profile
            </Button>
          </Link>
        )}
        
        <Link href="/authors">
          <Button variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            View All Authors
          </Button>
        </Link>
      </div>
    </div>
  )
}
