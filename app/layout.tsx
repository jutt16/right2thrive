import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";
import Analytics from "@/components/analytics"; // ✅ This is critical!
import PerformanceMonitor from "@/components/performance-monitor";
import CookieConsent from "@/components/gdpr-cookie-consent";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Right2Thrive UK — Cultural Wellbeing Support for Young People",
  description: "Right2Thrive UK delivers culturally responsive mental health support, workshops and mentoring for young people in North London. Join our wellbeing hub.",
  keywords: [
    "mental health support",
    "cultural wellbeing",
    "young people",
    "North London",
    "therapy",
    "anxiety workshops",
    "trauma support",
    "culturally responsive care",
    "wellbeing hub",
    "peer support"
  ],
  authors: [{ name: "Right2Thrive UK" }],
  creator: "Right2Thrive UK",
  publisher: "Right2Thrive UK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://right2thriveuk.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://right2thriveuk.com',
    siteName: 'Right2Thrive UK',
    title: 'Right2Thrive UK — Healing Through Connection, Culture, and Care',
    description: 'Inclusive, culturally responsive wellbeing services to help young people and families overcome trauma and thrive.',
    images: [
      {
        url: '/right2thrive-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Right2Thrive UK - Cultural Wellbeing Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Right2ThriveUK',
    creator: '@Right2ThriveUK',
    title: 'Right2Thrive UK — Healing Through Connection, Culture, and Care',
    description: 'Inclusive, culturally responsive wellbeing services to help young people and families overcome trauma and thrive.',
    images: ['/right2thrive-logo.jpg'],
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
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics Script with GDPR Consent */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F45J6ZTF7N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent state (denied until user consents)
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'security_storage': 'granted'
            });
            
            gtag('js', new Date());
            gtag('config', 'G-F45J6ZTF7N', {
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `}
        </Script>
        
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Right2Thrive UK",
              "url": "https://right2thriveuk.com",
              "logo": "https://right2thriveuk.com/right2thrive-logo.jpg",
              "description": "Culturally responsive mental health support and wellbeing services for young people and families in North London.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Edmonton Green",
                "addressLocality": "Edmonton",
                "addressRegion": "North London",
                "postalCode": "N9 0TJ",
                "addressCountry": "GB"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@right2thriveuk.com",
                "telephone": "+44 20 1234 5678",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.instagram.com/right2thriveuk/",
                "https://twitter.com/@Right2ThriveUK",
                "https://www.tiktok.com/@right2thrive"
              ],
              "foundingDate": "2024",
              "areaServed": {
                "@type": "City",
                "name": "North London"
              },
              "serviceType": [
                "Mental Health Support",
                "Cultural Wellbeing Services",
                "Therapy Sessions",
                "Peer Support Groups",
                "Anxiety & Trauma Workshops",
                "Career Development",
                "Cultural Activities"
              ]
            })
          }}
        />
        
        {/* Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Right2Thrive UK",
              "url": "https://right2thriveuk.com",
              "description": "Culturally responsive mental health support and wellbeing services for young people and families in North London.",
              "publisher": {
                "@type": "Organization",
                "name": "Right2Thrive UK",
                "url": "https://right2thriveuk.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://right2thriveuk.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            {/* Skip link for keyboard users */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <div className="bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white">
              Need immediate support? Call 116 123 | Text SHOUT to 85258 | Live chat available
            </div>
            <Navbar />
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
            <Suspense fallback={null}>
              <PerformanceMonitor />
            </Suspense>
            <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <CookieConsent />
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
