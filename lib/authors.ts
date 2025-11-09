// Author data and schema generation
export interface Author {
  id: string;
  name: string;
  slug: string;
  title: string;
  bio: string;
  credentials: string[];
  specializations: string[];
  image: string;
  email: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  publications: Array<{
    title: string;
    publication: string;
    date: string;
    url?: string;
  }>;
  speakingEngagements: Array<{
    title: string;
    event: string;
    date: string;
    location: string;
  }>;
  awards: Array<{
    title: string;
    organization: string;
    year: string;
  }>;
  languages: string[];
  experience: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
}

export const authors: Author[] = [
  {
    id: "amir-bhai",
    name: "Amir Bhai",
    slug: "amir-bhai",
    title: "Founder & CEO",
    bio: "Amir Bhai is the visionary founder of Right2Thrive UK, dedicated to creating culturally responsive mental health support for young people. With over 15 years of experience in community development and mental health advocacy, Amir has been instrumental in developing innovative approaches to wellbeing that honor cultural diversity and promote healing through connection.",
    credentials: [
      "MSc Community Psychology",
      "Certified Mental Health First Aid Instructor",
      "Registered Community Development Practitioner",
      "Cultural Competency Specialist"
    ],
    specializations: [
      "Community Mental Health",
      "Cultural Competency",
      "Youth Development",
      "Trauma-Informed Care",
      "Community Organizing"
    ],
    image: "/authors/amir-bhai.jpg",
    email: "amir@right2thriveuk.com",
    socialMedia: {
      twitter: "@AmirBhaiR2T",
      linkedin: "https://linkedin.com/in/amir-bhai-right2thrive",
      instagram: "@amir_bhai_r2t"
    },
    publications: [
      {
        title: "Cultural Competency in Mental Health Services: A Community-Based Approach",
        publication: "Journal of Community Psychology",
        date: "2023",
        url: "https://example.com/publication1"
      },
      {
        title: "Building Resilience Through Cultural Connection: Lessons from North London",
        publication: "Mental Health Today",
        date: "2024"
      }
    ],
    speakingEngagements: [
      {
        title: "Cultural Competency in Mental Health",
        event: "National Mental Health Conference",
        date: "2024-03-15",
        location: "London, UK"
      },
      {
        title: "Community-Based Approaches to Youth Mental Health",
        event: "International Wellbeing Summit",
        date: "2024-06-20",
        location: "Manchester, UK"
      }
    ],
    awards: [
      {
        title: "Community Impact Award",
        organization: "London Mental Health Trust",
        year: "2023"
      },
      {
        title: "Innovation in Mental Health Services",
        organization: "UK Mental Health Foundation",
        year: "2024"
      }
    ],
    languages: ["English", "Urdu", "Hindi"],
    experience: "15+ years in community development and mental health advocacy",
    education: [
      {
        degree: "MSc Community Psychology",
        institution: "University of London",
        year: "2010"
      },
      {
        degree: "BA Psychology",
        institution: "University of Manchester",
        year: "2008"
      }
    ]
  },
  {
    id: "dr-emma-johnson",
    name: "Dr. Emma Johnson",
    slug: "dr-emma-johnson",
    title: "Clinical Director",
    bio: "Dr. Emma Johnson is a licensed clinical psychologist specializing in trauma-informed care and culturally responsive therapy. With extensive experience working with diverse communities, Dr. Johnson brings deep clinical expertise to Right2Thrive UK's therapeutic services.",
    credentials: [
      "PhD Clinical Psychology",
      "Licensed Clinical Psychologist (HCPC)",
      "Certified Trauma Therapist",
      "EMDR Certified Practitioner"
    ],
    specializations: [
      "Trauma Therapy",
      "EMDR",
      "Cognitive Behavioral Therapy",
      "Culturally Responsive Therapy",
      "Anxiety Disorders",
      "Depression Treatment"
    ],
    image: "/authors/dr-emma-johnson.jpg",
    email: "emma.johnson@right2thriveuk.com",
    socialMedia: {
      linkedin: "https://linkedin.com/in/dr-emma-johnson",
      twitter: "@DrEmmaJohnson"
    },
    publications: [
      {
        title: "Trauma-Informed Care in Diverse Communities",
        publication: "Clinical Psychology Review",
        date: "2023"
      },
      {
        title: "Cultural Considerations in EMDR Therapy",
        publication: "Journal of EMDR Practice and Research",
        date: "2024"
      }
    ],
    speakingEngagements: [
      {
        title: "Trauma-Informed Approaches to Cultural Healing",
        event: "International Trauma Conference",
        date: "2024-04-10",
        location: "Edinburgh, UK"
      }
    ],
    awards: [
      {
        title: "Excellence in Clinical Practice",
        organization: "British Psychological Society",
        year: "2023"
      }
    ],
    languages: ["English", "French"],
    experience: "12+ years in clinical psychology and trauma therapy",
    education: [
      {
        degree: "PhD Clinical Psychology",
        institution: "University of Oxford",
        year: "2012"
      },
      {
        degree: "MSc Psychology",
        institution: "University of Cambridge",
        year: "2009"
      }
    ]
  },
  {
    id: "maya-thompson",
    name: "Maya Thompson",
    slug: "maya-thompson",
    title: "Cultural Wellbeing Coordinator",
    bio: "Maya Thompson is a passionate advocate for cultural wellbeing and community healing. With a background in social work and cultural studies, Maya coordinates our cultural activities and ensures that all programs honor the diverse backgrounds of our community members.",
    credentials: [
      "MA Social Work",
      "Certified Cultural Competency Trainer",
      "Community Outreach Specialist",
      "Youth Development Practitioner"
    ],
    specializations: [
      "Cultural Competency Training",
      "Community Outreach",
      "Youth Development",
      "Cultural Activities Coordination",
      "Social Work",
      "Community Engagement"
    ],
    image: "/authors/maya-thompson.jpg",
    email: "maya.thompson@right2thriveuk.com",
    socialMedia: {
      instagram: "@maya_thompson_r2t",
      linkedin: "https://linkedin.com/in/maya-thompson"
    },
    publications: [
      {
        title: "Building Bridges Through Cultural Activities",
        publication: "Community Development Journal",
        date: "2024"
      }
    ],
    speakingEngagements: [
      {
        title: "Cultural Activities as Mental Health Support",
        event: "Community Wellbeing Conference",
        date: "2024-05-15",
        location: "Birmingham, UK"
      }
    ],
    awards: [],
    languages: ["English", "Spanish", "Portuguese"],
    experience: "8+ years in social work and community development",
    education: [
      {
        degree: "MA Social Work",
        institution: "University of Birmingham",
        year: "2016"
      },
      {
        degree: "BA Cultural Studies",
        institution: "University of Leeds",
        year: "2014"
      }
    ]
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    slug: "james-wilson",
    title: "Youth Services Manager",
    bio: "James Wilson brings extensive experience in youth services and family support to Right2Thrive UK. His background in counseling and youth development makes him a valuable resource for young people navigating mental health challenges.",
    credentials: [
      "MA Counseling Psychology",
      "Certified Youth Counselor",
      "Family Therapy Specialist",
      "Crisis Intervention Specialist"
    ],
    specializations: [
      "Youth Counseling",
      "Family Therapy",
      "Crisis Intervention",
      "Peer Support",
      "Group Therapy",
      "Mental Health Education"
    ],
    image: "/authors/james-wilson.jpg",
    email: "james.wilson@right2thriveuk.com",
    socialMedia: {
      linkedin: "https://linkedin.com/in/james-wilson-youth-services"
    },
    publications: [
      {
        title: "Peer Support Models for Youth Mental Health",
        publication: "Youth Development Journal",
        date: "2023"
      }
    ],
    speakingEngagements: [
      {
        title: "Supporting Youth Mental Health Through Peer Networks",
        event: "Youth Mental Health Summit",
        date: "2024-07-20",
        location: "Liverpool, UK"
      }
    ],
    awards: [
      {
        title: "Youth Advocate of the Year",
        organization: "National Youth Council",
        year: "2023"
      }
    ],
    languages: ["English"],
    experience: "10+ years in youth services and counseling",
    education: [
      {
        degree: "MA Counseling Psychology",
        institution: "University of Liverpool",
        year: "2014"
      },
      {
        degree: "BA Psychology",
        institution: "University of Sheffield",
        year: "2012"
      }
    ]
  }
];

// Generate author schema markup
export function generateAuthorSchema(author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://right2thriveuk.com/authors/${author.slug}#person`,
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    image: `https://right2thriveuk.com${author.image}`,
    email: author.email,
    url: `https://right2thriveuk.com/authors/${author.slug}`,
    sameAs: Object.values(author.socialMedia).filter(Boolean),
    knowsAbout: author.specializations,
    hasCredential: author.credentials.map(cred => ({
      "@type": "EducationalOccupationalCredential",
      name: cred
    })),
    alumniOf: author.education.map(edu => ({
      "@type": "EducationalOrganization",
      name: edu.institution
    })),
    worksFor: {
      "@type": "Organization",
      name: "Right2Thrive UK",
      url: "https://right2thriveuk.com"
    },
    ...(author.publications.length > 0 && {
      author: author.publications.map(pub => ({
        "@type": "Article",
        name: pub.title,
        publisher: {
          "@type": "Organization",
          name: pub.publication
        },
        datePublished: pub.date,
        ...(pub.url && { url: pub.url })
      }))
    }),
    ...(author.awards.length > 0 && {
      award: author.awards.map(award => ({
        "@type": "Award",
        name: award.title,
        awardedBy: {
          "@type": "Organization",
          name: award.organization
        },
        dateAwarded: award.year
      }))
    })
  };
}

// Get author by slug
export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find(author => author.slug === slug);
}

// Get all authors
export function getAllAuthors(): Author[] {
  return authors;
}

// Get featured authors
export function getFeaturedAuthors(): Author[] {
  return authors.slice(0, 3); // First 3 authors as featured
}

// Search authors
export function searchAuthors(query: string): Author[] {
  const lowercaseQuery = query.toLowerCase();
  return authors.filter(author => 
    author.name.toLowerCase().includes(lowercaseQuery) ||
    author.title.toLowerCase().includes(lowercaseQuery) ||
    author.specializations.some(spec => spec.toLowerCase().includes(lowercaseQuery)) ||
    author.bio.toLowerCase().includes(lowercaseQuery)
  );
}

export default authors;
