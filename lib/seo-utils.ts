import { Metadata } from 'next';

// Base URL for the application
export const BASE_URL = 'https://right2thriveuk.com';

// Default organization information
export const ORGANIZATION_INFO = {
  name: 'Right2Thrive UK',
  description: 'Culturally responsive mental health support and wellbeing services for young people and families in North London.',
  url: BASE_URL,
  logo: `${BASE_URL}/right2thrive-logo.jpg`,
  email: 'hello@right2thriveuk.com',
  phone: '+44 20 1234 5678',
  address: {
    streetAddress: 'Edmonton Green',
    addressLocality: 'Edmonton',
    addressRegion: 'North London',
    postalCode: 'N9 0TJ',
    addressCountry: 'GB'
  },
  socialMedia: {
    instagram: 'https://www.instagram.com/right2thriveuk/',
    twitter: 'https://twitter.com/@Right2ThriveUK',
    tiktok: 'https://www.tiktok.com/@right2thrive'
  },
  foundingDate: '2024',
  serviceType: [
    'Mental Health Support',
    'Cultural Wellbeing Services',
    'Therapy Sessions',
    'Peer Support Groups',
    'Anxiety & Trauma Workshops',
    'Career Development',
    'Cultural Activities'
  ]
};

// Common keywords for different page types
export const KEYWORDS = {
  base: [
    'mental health support',
    'cultural wellbeing',
    'young people',
    'North London',
    'therapy',
    'anxiety workshops',
    'trauma support',
    'culturally responsive care',
    'wellbeing hub',
    'peer support'
  ],
  about: [
    'about Right2Thrive UK',
    'cultural wellbeing hub',
    'community mental health',
    'North London therapy',
    'culturally responsive support',
    'young people wellbeing'
  ],
  services: [
    'mental health services',
    'therapy sessions',
    'anxiety workshops',
    'trauma support groups',
    'career development',
    'cultural activities',
    'peer support groups'
  ],
  blog: [
    'mental health blog',
    'cultural wellbeing articles',
    'anxiety resources',
    'trauma support tips',
    'mental health insights',
    'wellbeing advice'
  ],
  contact: [
    'contact Right2Thrive UK',
    'mental health support contact',
    'therapy booking',
    'wellbeing consultation',
    'North London mental health'
  ],
  workshops: [
    'anxiety workshops',
    'trauma workshops',
    'mental health workshops',
    'wellbeing sessions',
    'therapy groups',
    'peer support workshops'
  ]
};

// Generate metadata for different page types
export function generateMetadata({
  title,
  description,
  keywords = [],
  path = '',
  image = '/right2thrive-logo.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors = [{ name: 'Right2Thrive UK' }]
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: Array<{ name: string }>;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    title,
    description,
    keywords: [...KEYWORDS.base, ...keywords],
    authors,
    creator: 'Right2Thrive UK',
    publisher: 'Right2Thrive UK',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      locale: 'en_GB',
      url,
      siteName: 'Right2Thrive UK',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Right2Thrive UK`,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors: authors.map(a => a.name) }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Right2ThriveUK',
      creator: '@Right2ThriveUK',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate structured data for Organization
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_INFO.name,
    url: ORGANIZATION_INFO.url,
    logo: ORGANIZATION_INFO.logo,
    description: ORGANIZATION_INFO.description,
    address: {
      '@type': 'PostalAddress',
      ...ORGANIZATION_INFO.address
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: ORGANIZATION_INFO.email,
      telephone: ORGANIZATION_INFO.phone,
      contactType: 'customer service'
    },
    sameAs: Object.values(ORGANIZATION_INFO.socialMedia),
    foundingDate: ORGANIZATION_INFO.foundingDate,
    areaServed: {
      '@type': 'City',
      name: 'North London'
    },
    serviceType: ORGANIZATION_INFO.serviceType
  };
}

// Generate structured data for LocalBusiness
export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}#organization`,
    name: ORGANIZATION_INFO.name,
    url: ORGANIZATION_INFO.url,
    logo: ORGANIZATION_INFO.logo,
    description: ORGANIZATION_INFO.description,
    address: {
      '@type': 'PostalAddress',
      ...ORGANIZATION_INFO.address
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: ORGANIZATION_INFO.email,
      telephone: ORGANIZATION_INFO.phone,
      contactType: 'customer service'
    },
    sameAs: Object.values(ORGANIZATION_INFO.socialMedia),
    openingHours: 'Mo-Fr 09:00-17:00',
    priceRange: '$$',
    paymentAccepted: 'Cash, Credit Card',
    currenciesAccepted: 'GBP'
  };
}

// Generate structured data for Event (workshops)
export function generateEventStructuredData({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  offers
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  organizer: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        ...ORGANIZATION_INFO.address
      }
    },
    organizer: {
      '@type': 'Organization',
      name: organizer,
      url: ORGANIZATION_INFO.url
    },
    ...(offers && {
      offers: {
        '@type': 'Offer',
        ...offers
      }
    })
  };
}

// Generate structured data for BlogPosting
export function generateBlogPostStructuredData({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
  articleBody
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  articleBody?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url,
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_INFO.name,
      url: ORGANIZATION_INFO.url,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_INFO.logo
      }
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `${BASE_URL}${image}`
      }
    }),
    ...(articleBody && { articleBody })
  };
}

// Generate structured data for Service
export function generateServiceStructuredData({
  name,
  description,
  provider,
  areaServed,
  serviceType,
  offers
}: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  serviceType: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: ORGANIZATION_INFO.url
    },
    areaServed: {
      '@type': 'City',
      name: areaServed
    },
    serviceType,
    ...(offers && {
      offers: {
        '@type': 'Offer',
        ...offers
      }
    })
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
